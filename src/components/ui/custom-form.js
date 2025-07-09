'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SimpleSelect from './simple-dropdown';
import SearchableSelect from './searchable-dropdown';
import MultiSelect from './mulit-select-dropdown';
import DynamicInput from './dynamic-input';
import { buildSchema } from '@/lib/form-build-schema';
import Loader from './loader';
import { Save, Edit, Loader2 } from 'lucide-react';
import DynamicInputGroup from './dynamic-input-group';

const transformFormData = (values, formDetails, originalData = {}) => {
  return Object.entries(values).reduce((acc, [key, value]) => {
    const fieldConfig = formDetails.find((f) => f.name === key);
    if (!fieldConfig) return acc;

    if (fieldConfig.type === 'toggle') {
      acc[key] =
        fieldConfig.name === 'status'
          ? value
            ? 'active'
            : 'inactive'
          : Boolean(value);
    } else if (fieldConfig.type === 'dynamic-input-group') {
      const originalArrayData = originalData[key] || [];
      acc[key] = Array.isArray(value)
        ? value.map((item, index) => {
            const transformedItem = {};
            fieldConfig.fields?.forEach((f) => {
              const fieldName = f.name === 'role' ? 'party_user_role' : f.name;
              if (f.type === 'number') {
                transformedItem[fieldName] =
                  item[f.name] !== undefined && item[f.name] !== null
                    ? Number(item[f.name])
                    : null;
              } else if (f.type === 'toggle') {
                transformedItem[fieldName] = item[f.name]
                  ? 'active'
                  : 'inactive';
              } else {
                transformedItem[fieldName] = item[f.name] || '';
              }
            });
            if (originalArrayData[index]?.id) {
              transformedItem.id = originalArrayData[index].id;
            }
            return transformedItem;
          })
        : [];
    } else if (fieldConfig.type === 'number') {
      acc[key] =
        value !== null && value !== undefined && value !== ''
          ? Number(value)
          : null;
    } else {
      acc[key] = value;
    }
    return acc;
  }, {});
};

const getDefaultValues = (formDetails, data) => {
  return formDetails.reduce((acc, field) => {
    if (data && data[field.name] !== undefined) {
      if (field.type === 'toggle') {
        acc[field.name] =
          field.name === 'status'
            ? data[field.name] === 'active' || data[field.name] === true
            : Boolean(data[field.name]);
      } else if (field.type === 'dynamic-input-group' && field.fields) {
        acc[field.name] = Array.isArray(data[field.name])
          ? data[field.name].map((item) => {
              const newItem = {};
              field.fields.forEach((f) => {
                const sourceField =
                  f.name === 'role' ? 'party_user_role' : f.name;
                if (f.type === 'number') {
                  newItem[f.name] =
                    item[sourceField] !== undefined &&
                    item[sourceField] !== null
                      ? Number(item[sourceField])
                      : f.defaultValue || 0;
                } else if (f.type === 'toggle') {
                  newItem[f.name] =
                    item[sourceField] === 'active' ||
                    item[sourceField] === true;
                } else {
                  newItem[f.name] = item[sourceField] || '';
                }
              });
              if (item.id) {
                newItem.id = item.id;
              }
              return newItem;
            })
          : [];
      } else if (field.type === 'number') {
        acc[field.name] =
          data[field.name] !== null && data[field.name] !== undefined
            ? Number(data[field.name])
            : field.defaultValue || 0;
      } else {
        acc[field.name] = data[field.name];
      }
    } else {
      if (field.type === 'toggle') {
        acc[field.name] = field.name === 'status' ? true : false;
      } else if (field.type === 'dynamic-input-group') {
        acc[field.name] = [];
      } else if (field.type === 'number') {
        acc[field.name] = field.defaultValue || 0;
      } else if (field.type === 'time') {
        acc[field.name] = '';
      }
    }
    return acc;
  }, {});
};

export default function CustomForm({
  formDetails = [],
  data = {},
  title,
  onSubmit,
  isLoading = false,
  fetchOptionsMap = {},
}) {
  const filteredFormDetails = useMemo(
    () => formDetails.filter((field) => !(!data?.id && field.hideInCreate)),
    [formDetails, data?.id]
  );

  const schema = buildSchema(filteredFormDetails);
  const defaultValues = useMemo(
    () => getDefaultValues(filteredFormDetails, data),
    [filteredFormDetails, data]
  );

  const form = useForm({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const isCreateMode = !data?.id;
  const [isEditing, setIsEditing] = useState(isCreateMode);
  const formValues = useWatch({ control: form.control });

  useEffect(() => {
    const hasData = Object.keys(data || {}).length > 0;
    if (hasData) {
      const formattedData = { ...data };
      if (formattedData.status !== undefined) {
        formattedData.status =
          typeof formattedData.status === 'boolean'
            ? formattedData.status
            : formattedData.status === 'active';
      }
      form.reset(getDefaultValues(filteredFormDetails, formattedData));
      if (!isCreateMode) setIsEditing(false);
    } else {
      form.reset(getDefaultValues(filteredFormDetails, {}));
      if (isCreateMode) setIsEditing(true);
    }
  }, [data?.id, filteredFormDetails, form, isCreateMode]);

  const submitHandler = async (values) => {
    const submissionData = isCreateMode
      ? Object.fromEntries(
          Object.entries(values).filter(
            ([key]) => !formDetails.find((f) => f.name === key)?.hideInCreate
          )
        )
      : values;

    const transformedData = transformFormData(
      submissionData,
      filteredFormDetails,
      data
    );

    try {
      const submitResult = onSubmit(transformedData);
      if (submitResult && typeof submitResult.then === 'function') {
        const response = await submitResult;
        if (!isCreateMode && response) {
          const newData = response.data || response;
          form.reset(getDefaultValues(filteredFormDetails, newData));
        }
      } else if (!isCreateMode) {
        form.reset(
          getDefaultValues(filteredFormDetails, { ...data, ...transformedData })
        );
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const { toggleFields, regularFields } = useMemo(() => {
    const toggles = [];
    const regular = [];
    filteredFormDetails.forEach((field) => {
      if (field.showIf && !field.showIf(formValues)) return;
      field.type === 'toggle' ? toggles.push(field) : regular.push(field);
    });
    return { toggleFields: toggles, regularFields: regular };
  }, [filteredFormDetails, formValues]);

  const renderField = (field) => {
    const isRequired = field.validation?.required;
    const isPermanentlyDisabled = field.readonly && !isCreateMode;

    switch (field.type) {
      case 'text':
      case 'date':
      case 'time':
      case 'color':
      case 'number':
        return (
          <FormField
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {field.label}
                  {isRequired && <span className='text-red-500 ml-1'>*</span>}
                </FormLabel>
                <FormControl>
                  <Input
                    type={
                      field.type === 'date'
                        ? 'date'
                        : field.type === 'time'
                        ? 'time'
                        : field.type === 'color'
                        ? 'color'
                        : field.type === 'number'
                        ? 'number'
                        : 'text'
                    }
                    {...formField}
                    disabled={!isEditing || isPermanentlyDisabled}
                    step={field.type === 'number' ? field.step || 1 : undefined}
                    min={field.type === 'number' ? field.validation?.min : undefined}
                    max={field.type === 'number' ? field.validation?.max : undefined}
                    className={field.type === 'color' ? 'h-10 w-16 p-1 cursor-pointer' : ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'text-area':
        return (
          <FormField
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {field.label}
                  {isRequired && <span className='text-red-500 ml-1'>*</span>}
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...formField}
                    disabled={!isEditing || isPermanentlyDisabled}
                    rows={4}
                    className="resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'simple-select':
        return (
          <FormField
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {field.label}
                  {isRequired && <span className='text-red-500 ml-1'>*</span>}
                </FormLabel>
                <FormControl>
                  <SimpleSelect
                    value={formField.value}
                    options={field.options}
                    onChange={formField.onChange}
                    isDisabled={!isEditing || isPermanentlyDisabled}
                    isRequired={isRequired}
                    fetchOptions={
                      field.fetchOptions && fetchOptionsMap[field.fetchOptions]
                        ? () => fetchOptionsMap[field.fetchOptions]()
                        : undefined
                    }
                    useApiFiltering={!!field.fetchOptions}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'searchable-select':
      case 'multi-select':
        const SelectComponent =
          field.type === 'searchable-select' ? SearchableSelect : MultiSelect;
        return (
          <FormField
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {field.label}
                  {isRequired && <span className='text-red-500 ml-1'>*</span>}
                </FormLabel>
                <FormControl>
                  <SelectComponent
                    value={formField.value}
                    options={field.options}
                    onChange={formField.onChange}
                    isDisabled={!isEditing || isPermanentlyDisabled}
                    isRequired={isRequired}
                    fetchOptions={
                      field.fetchOptions && fetchOptionsMap[field.fetchOptions]
                        ? fetchOptionsMap[field.fetchOptions]
                        : undefined
                    }
                    useApiFiltering={!!field.fetchOptions}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'dynamic-input':
        return (
          <FormField
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {field.label}
                  {isRequired && <span className='text-red-500 ml-1'>*</span>}
                </FormLabel>
                <FormControl>
                  <DynamicInput
                    fields={formField.value || []}
                    onAddField={() => {
                      const newValue = [
                        ...(formField.value || []),
                        { value: '' },
                      ];
                      formField.onChange(newValue);
                    }}
                    onRemoveField={(index) => {
                      const newValue = [...(formField.value || [])];
                      newValue.splice(index, 1);
                      formField.onChange(
                        newValue.length ? newValue : [{ value: '' }]
                      );
                    }}
                    onChange={(index, value) => {
                      const newValue = [...(formField.value || [])];
                      newValue[index] = { value };
                      formField.onChange(newValue);
                    }}
                    isEditing={isEditing}
                    isRequired={isRequired}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'dynamic-input-group':
        return (
          <FormField
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {field.label}
                  {field.validation?.required && (
                    <span className='text-red-500 ml-1'>*</span>
                  )}
                </FormLabel>
                <FormControl>
                  <DynamicInputGroup
                    name={field.name}
                    control={form.control}
                    fields={formField.value || []}
                    template={field.fields || []}
                    onAddField={() => {
                      const newItem = field.fields.reduce(
                        (obj, f) => ({
                          ...obj,
                          [f.name]:
                            f.type === 'toggle'
                              ? f.defaultValue !== undefined
                                ? f.defaultValue
                                : false
                              : '',
                        }),
                        {}
                      );
                      formField.onChange([
                        ...(formField.value || []),
                        newItem,
                      ]);
                    }}
                    onRemoveField={(index) => {
                      const newValue = [...(formField.value || [])];
                      newValue.splice(index, 1);
                      formField.onChange(newValue);
                    }}
                    onChange={(index, name, value) => {
                      const newValue = [...(formField.value || [])];
                      newValue[index] = {
                        ...newValue[index],
                        [name]: value,
                      };
                      formField.onChange(newValue);
                    }}
                    isEditing={isEditing}
                    fetchOptionsMap={fetchOptionsMap}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'toggle':
        return (
          <FormField
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    {field.label}
                    {isRequired && <span className='text-red-500 ml-1'>*</span>}
                  </FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={formField.value ?? true}
                    onCheckedChange={formField.onChange}
                    disabled={!isEditing || (field.readonly && !isCreateMode)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Card className="relative">
      {isLoading && (
        <div className='absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 rounded-xl'>
          <Loader />
        </div>
      )}

      <CardHeader>
        <div className='flex justify-between items-center'>
          <CardTitle className='text-lg'>
            {isCreateMode ? `Create ${title}` : `Edit ${title}`}
          </CardTitle>
          <Button
            type='button'
            onClick={() =>
              isEditing ? form.handleSubmit(submitHandler)() : setIsEditing(true)
            }
            className="gap-2"
            disabled={isLoading || form.formState.isSubmitting}
          >
            {isLoading || form.formState.isSubmitting ? (
              <>
                <Loader2 className='h-4 w-4 animate-spin' />
                {isEditing ? 'Saving...' : 'Loading...'}
              </>
            ) : (
              <>
                {isCreateMode
                  ? isEditing
                    ? 'Create'
                    : 'Edit'
                  : isEditing
                  ? 'Save'
                  : 'Edit'}
                {isEditing ? (
                  <Save className='h-4 w-4' />
                ) : (
                  <Edit className='h-4 w-4' />
                )}
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className={toggleFields.length > 0 ? 'grid grid-cols-1 lg:grid-cols-3 gap-6' : 'grid grid-cols-1'}>
          <div className={toggleFields.length > 0 ? 'lg:col-span-2' : 'w-full'}>
            <Form {...form}>
              <form className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {regularFields.map((field, index) => (
                  <div
                    key={index}
                    className={`${
                      [
                        'text-area',
                        'dynamic-input',
                        'dynamic-input-group',
                      ].includes(field.type)
                        ? 'md:col-span-2'
                        : ''
                    }`}
                  >
                    {renderField(field)}
                  </div>
                ))}
              </form>
            </Form>
          </div>

          {toggleFields.length > 0 && (
            <div className='lg:col-span-1'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-base'>Settings</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <Form {...form}>
                    {toggleFields.map((field, index) => (
                      <div key={index}>
                        {renderField(field)}
                      </div>
                    ))}
                  </Form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}