'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import SimpleSelect from './simple-dropdown';
import SearchableSelect from './searchable-dropdown';
import MultiSelect from './mulit-select-dropdown';
import ToggleSwitch from './toggle-switch';
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
      acc[key] = fieldConfig.name === 'status'
        ? value ? 'active' : 'inactive'
        : Boolean(value);
    } else if (fieldConfig.type === 'dynamic-input-group') {
      // Get original array data for this field
      const originalArrayData = originalData[key] || [];

      acc[key] = Array.isArray(value)
        ? value.map((item, index) => {
          const transformedItem = {};

          // 1. Handle all form fields from template
          fieldConfig.fields?.forEach((f) => {
            const fieldName = f.name === 'role' ? 'party_user_role' : f.name;
            transformedItem[fieldName] = f.type === 'toggle'
              ? item[f.name] ? 'active' : 'inactive'
              : item[f.name] || '';
          });

          // 2. Preserve the ID from original data if it exists at this index
          if (originalArrayData[index]?.id) {
            transformedItem.id = originalArrayData[index].id;
          }

          return transformedItem;
        })
        : [];
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
        acc[field.name] = field.name === 'status'
          ? data[field.name] === 'active' || data[field.name] === true
          : Boolean(data[field.name]);
      } else if (field.type === 'dynamic-input-group' && field.fields) {
        acc[field.name] = Array.isArray(data[field.name])
          ? data[field.name].map((item) => {
            const newItem = {};
            field.fields.forEach((f) => {
              const sourceField = f.name === 'role' ? 'party_user_role' : f.name;
              newItem[f.name] = f.type === 'toggle'
                ? item[sourceField] === 'active' || item[sourceField] === true
                : item[sourceField] || '';
            });

            // 2. Preserve the ID
            if (item.id) {
              newItem.id = item.id;
            }
            return newItem;
          })
          : [];
      } else {
        acc[field.name] = data[field.name];
      }
    } else {
      if (field.type === 'toggle') {
        acc[field.name] = field.name === 'status' ? true : false;
      } else if (field.type === 'dynamic-input-group') {
        acc[field.name] = [];
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

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const isCreateMode = !data?.id;
  const [isEditing, setIsEditing] = useState(isCreateMode);
  const formValues = useWatch({ control });

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
      reset(getDefaultValues(filteredFormDetails, formattedData));
      if (!isCreateMode) setIsEditing(false);
    } else {
      reset(getDefaultValues(filteredFormDetails, {}));
      if (isCreateMode) setIsEditing(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.id, filteredFormDetails, reset, isCreateMode]);

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
          reset(getDefaultValues(filteredFormDetails, newData));
        }
      } else if (!isCreateMode) {
        reset(
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
    const isError = errors[field.name];
    const isRequired = field.validation?.required;
    const isPermanentlyDisabled = field.readonly && !isCreateMode;

    const baseInputClasses = `border rounded-md px-3 py-2 text-sm focus:outline-none ${isError ? 'border-red-500' : 'border-gray-300'
      } ${!isEditing || isPermanentlyDisabled
        ? 'bg-gray-100 cursor-not-allowed'
        : ''
      }`;

    switch (field.type) {
      case 'text':
      case 'text-area':
      case 'date':
      case 'color':
        return (
          <div className='flex flex-col'>
            <label className='mb-1 font-medium text-sm text-gray-600'>
              {field.label}
              {isRequired && <span className='text-red-500 ml-1'>*</span>}
            </label>
            <input
              type={
                field.type === 'date'
                  ? 'date'
                  : field.type === 'color'
                    ? 'color'
                    : 'text'
              }
              {...register(field.name, { required: isRequired })}
              disabled={!isEditing || isPermanentlyDisabled}
              className={`${baseInputClasses} ${field.type === 'text-area' ? 'resize-none' : ''
                } ${field.type === 'color' ? 'h-10 w-16 p-1 cursor-pointer' : ''
                }`}
              rows={field.type === 'text-area' ? 4 : undefined}
              aria-required={isRequired}
            />
            {isError && (
              <p className='pt-1 text-xs text-red-500'>{isError.message}</p>
            )}
          </div>
        );

      case 'simple-select':
        return (
          <Controller
            control={control}
            name={field.name}
            rules={{ required: isRequired }}
            render={({ field: controllerField }) => (
              <div className='flex flex-col'>
                <label className='mb-1 font-medium text-sm text-gray-600'>
                  {field.label}
                  {isRequired && <span className='text-red-500 ml-1'>*</span>}
                </label>
                <SimpleSelect
                  value={controllerField.value}
                  options={field.options}
                  onChange={controllerField.onChange}
                  error={isError}
                  isDisabled={!isEditing || isPermanentlyDisabled}
                  isRequired={isRequired}
                  fetchOptions={
                    field.fetchOptions && fetchOptionsMap[field.fetchOptions]
                      ? () => fetchOptionsMap[field.fetchOptions]()
                      : undefined
                  }
                  useApiFiltering={!!field.fetchOptions}
                />
                {isError && (
                  <p className='pt-1 text-xs text-red-500'>{isError.message}</p>
                )}
              </div>
            )}
          />
        );

      case 'searchable-select':
      case 'multi-select':
        const SelectComponent =
          field.type === 'searchable-select' ? SearchableSelect : MultiSelect;
        return (
          <Controller
            control={control}
            name={field.name}
            rules={{ required: isRequired }}
            render={({ field: controllerField }) => (
              <div className='flex flex-col'>
                <label className='mb-1 font-medium text-sm text-gray-600'>
                  {field.label}
                  {isRequired && <span className='text-red-500 ml-1'>*</span>}
                </label>
                <SelectComponent
                  value={controllerField.value}
                  options={field.options}
                  onChange={controllerField.onChange}
                  error={isError}
                  isDisabled={!isEditing || isPermanentlyDisabled}
                  isRequired={isRequired}
                  fetchOptions={
                    field.fetchOptions && fetchOptionsMap[field.fetchOptions]
                      ? fetchOptionsMap[field.fetchOptions]
                      : undefined
                  }
                  useApiFiltering={!!field.fetchOptions}
                />
                {isError && (
                  <p className='pt-1 text-xs text-red-500'>{isError.message}</p>
                )}
              </div>
            )}
          />
        );

      case 'dynamic-input':
        return (
          <Controller
            control={control}
            name={field.name}
            rules={{ required: isRequired }}
            render={({ field: controllerField }) => (
              <div className='flex flex-col'>
                <label className='mb-1 font-medium text-sm text-gray-600'>
                  {field.label}
                  {isRequired && <span className='text-red-500 ml-1'>*</span>}
                </label>
                <DynamicInput
                  fields={controllerField.value || []}
                  onAddField={() => {
                    const newValue = [
                      ...(controllerField.value || []),
                      { value: '' },
                    ];
                    controllerField.onChange(newValue);
                  }}
                  onRemoveField={(index) => {
                    const newValue = [...(controllerField.value || [])];
                    newValue.splice(index, 1);
                    controllerField.onChange(
                      newValue.length ? newValue : [{ value: '' }]
                    );
                  }}
                  onChange={(index, value) => {
                    const newValue = [...(controllerField.value || [])];
                    newValue[index] = { value };
                    controllerField.onChange(newValue);
                  }}
                  isEditing={isEditing}
                  error={errors[field.name]}
                  isRequired={isRequired}
                />
                {isError && (
                  <p className='pt-1 text-xs text-red-500'>{isError.message}</p>
                )}
              </div>
            )}
          />
        );

      case 'dynamic-input-group':
        return (
          <Controller
            control={control}
            name={field.name}
            render={({ field: controllerField }) => (
              <div className='flex flex-col'>
                <label className='mb-1 font-medium text-sm text-gray-600'>
                  {field.label}
                  {field.validation?.required && <span className='text-red-500 ml-1'>*</span>}
                </label>
                <DynamicInputGroup
                  name={field.name}
                  control={control}
                  fields={controllerField.value || []}
                  template={field.fields || []}
                  onAddField={() => {
                    const newItem = field.fields.reduce(
                      (obj, f) => ({
                        ...obj,
                        [f.name]: f.type === 'toggle'
                          ? (f.defaultValue !== undefined ? f.defaultValue : false)
                          : ''
                      }),
                      {}
                    );
                    // New items won't have an ID
                    controllerField.onChange([...(controllerField.value || []), newItem]);
                  }}
                  onRemoveField={(index) => {
                    const newValue = [...(controllerField.value || [])];
                    newValue.splice(index, 1);
                    controllerField.onChange(newValue);
                  }}
                  onChange={(index, name, value) => {
                    const newValue = [...(controllerField.value || [])];
                    newValue[index] = {
                      ...newValue[index],
                      [name]: value
                      // ID remains unchanged if it exists
                    };
                    controllerField.onChange(newValue);
                  }}
                  isEditing={isEditing}
                  error={errors[field.name]}
                  fetchOptionsMap={fetchOptionsMap}
                />
                {errors[field.name] && (
                  <p className='pt-1 text-xs text-red-500'>{errors[field.name].message}</p>
                )}
              </div>
            )}
          />
        );

      case 'toggle':
        return (
          <Controller
            control={control}
            name={field.name}
            render={({ field: controllerField }) => (
              <div className='flex flex-col'>
                <label className='mb-1 font-medium text-sm text-gray-600'>
                  {field.label}
                  {isRequired && <span className='text-red-500 ml-1'>*</span>}
                </label>
                <ToggleSwitch
                  value={controllerField.value ?? true}
                  onChange={controllerField.onChange}
                  isDisabled={!isEditing || (field.readonly && !isCreateMode)}
                />
                {isError && (
                  <p className='pt-1 text-xs text-red-500'>{isError.message}</p>
                )}
              </div>
            )}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className='flex flex-col gap-5 bg-white rounded-xl shadow p-4 relative'>
      {isLoading && (
        <div className='absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 rounded-xl'>
          <Loader />
        </div>
      )}

      <div className='flex justify-between items-center'>
        <h2 className='text-md font-semibold'>
          {isCreateMode ? `Create ${title}` : `Edit ${title}`}
        </h2>
        <div className='flex gap-2'>
          <button
            aria-labelledby='form button'
            type='button'
            onClick={() =>
              isEditing ? handleSubmit(submitHandler)() : setIsEditing(true)
            }
            className={`border border-gray-400 cursor-pointer bg-deepViolet text-white shadow-sm rounded-3xl hover:scale-105 transition-all duration-300 ${isLoading || isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            disabled={isLoading || isSubmitting}
          >
            <div className='flex gap-2 items-center p-3'>
              {isLoading || isSubmitting ? (
                <>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  <p className='text-xs'>
                    {isEditing ? 'Saving...' : 'Loading...'}
                  </p>
                </>
              ) : (
                <>
                  <p className='text-xs'>
                    {isCreateMode
                      ? isEditing
                        ? 'Create'
                        : 'Edit'
                      : isEditing
                        ? 'Save'
                        : 'Edit'}
                  </p>
                  {isEditing ? (
                    <Save className='h-4 w-4' />
                  ) : (
                    <Edit className='h-4 w-4' />
                  )}
                </>
              )}
            </div>
          </button>
        </div>
      </div>

      <div
        className={
          toggleFields.length > 0
            ? 'grid grid-cols-2 lg:grid-cols-3 gap-6'
            : 'grid grid-cols-1'
        }
      >
        <div className={toggleFields.length > 0 ? 'lg:col-span-2' : 'w-full'}>
          <form className='text-sm grid grid-cols-1 md:grid-cols-2 gap-4'>
            {regularFields.map((field, index) => (
              <div
                key={index}
                className={`flex flex-col ${['text-area', 'dynamic-input', 'dynamic-input-group'].includes(
                  field.type
                )
                  ? 'md:col-span-2'
                  : ''
                  }`}
              >
                {renderField(field)}
              </div>
            ))}
          </form>
        </div>

        {toggleFields.length > 0 && (
          <div className='lg:col-span-1'>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h3 className='text-md font-semibold mb-4'>Settings</h3>
              <div className='grid grid-cols-1 gap-4'>
                {toggleFields.map((field, index) => (
                  <div key={index} className='flex flex-col'>
                    {renderField(field)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
