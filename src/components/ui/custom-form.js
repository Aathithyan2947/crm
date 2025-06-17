'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import SimpleSelect from './simple-dropdown';
import SearchableSelect from './searchable-dropdown';
import MultiSelect from './mulit-select-dropdown';
import ToggleSwitch from './toggle-switch';
import { buildSchema } from '@/lib/form-build-schema';
import Loader from './loader';
import { Save, Edit, Loader2 } from 'lucide-react';

export default function CustomForm({
  formDetails = [],
  data = {},
  title,
  onSubmit,
  isLoading = false,
  fetchOptionsMap = {},
}) {
  // Filter out fields that should be hidden in create mode
  const filteredFormDetails = formDetails.filter((field) => {
    // If we're in create mode and field has hideInCreate: true, exclude it
    if (!data?.id && field.hideInCreate) {
      return false;
    }
    return true;
  });

  const schema = buildSchema(filteredFormDetails);
  const defaultValues = {
    ...data,
    ...filteredFormDetails.reduce((acc, field) => {
      if (field.type === 'toggle' && !(field.name in data)) {
        acc[field.name] = true;
      }
      return acc;
    }, {}),
  };

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues,
    resolver: zodResolver(schema),
  });

  const isCreateMode = !data?.id;
  const [isEditing, setIsEditing] = useState(isCreateMode);

  useEffect(() => {
    const hasData = Object.keys(data).length > 0;
    if (hasData) {
      const formattedData = { ...data };
      if (formattedData.status !== undefined) {
        formattedData.status = formattedData.status === 'active';
      }
      reset(formattedData);
      if (!isCreateMode) {
        setIsEditing(false);
      }
    } else {
      reset(defaultValues);
      if (isCreateMode) {
        setIsEditing(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.id, reset, isCreateMode]);

  const submitHandler = (values) => {
    // First, filter out any fields that should be excluded in create mode
    let submissionData = { ...values };

    if (isCreateMode) {
      submissionData = Object.fromEntries(
        Object.entries(values).filter(([key]) => {
          const fieldConfig = formDetails.find((f) => f.name === key);
          return !fieldConfig?.hideInCreate;
        })
      );
    }

    // Transform boolean status back to active/inactive if needed
    if (submissionData.status !== undefined) {
      submissionData.status = submissionData.status ? 'active' : 'inactive';
    }

    if (onSubmit) onSubmit(submissionData);
    if (!isCreateMode) {
      setIsEditing(false);
    }
  };

  // Separate toggle fields from other fields (from filtered form details)
  const toggleFields = filteredFormDetails.filter(
    (field) => field.type === 'toggle'
  );
  const regularFields = filteredFormDetails.filter(
    (field) => field.type !== 'toggle'
  );

  const layoutClasses =
    toggleFields.length > 0
      ? 'grid grid-cols-2 lg:grid-cols-3 gap-6'
      : 'grid grid-cols-1';

  return (
    <div className='flex flex-col gap-5 bg-white rounded-xl shadow p-4 relative'>
      {isLoading && (
        <div className='absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 rounded-xl'>
          <Loader />
        </div>
      )}

      <div className='flex justify-between items-center'>
        <h2 className='text-lg font-semibold'>
          {isCreateMode ? `Create ${title}` : `Edit ${title}`}
        </h2>
        <div className='flex gap-2'>
          <button
            type='button'
            onClick={() => {
              if (isEditing) {
                handleSubmit(submitHandler)();
              } else {
                setIsEditing(true);
              }
            }}
            className={`border border-gray-400 bg-deepViolet text-white shadow-sm rounded-3xl hover:scale-105 transition-all duration-300 ${
              isLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            <div className='flex gap-2 items-center p-3'>
              {isLoading ? (
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

      <div className={layoutClasses}>
        <div className={toggleFields.length > 0 ? 'lg:col-span-2' : 'w-full'}>
          <form className='text-sm grid grid-cols-1 md:grid-cols-2 gap-4'>
            {regularFields.map((field, index) => {
              const isError = errors[field.name];
              const isRequired = field.validation?.required;
              const isTextArea = field.type === 'text-area';
              // Determine if field should be permanently disabled (readonly)
              const isPermanentlyDisabled = field.readonly && !isCreateMode;

              return (
                <div
                  key={index}
                  className={`flex flex-col ${
                    isTextArea ? 'md:col-span-2' : ''
                  }`}
                >
                  <label className='mb-1 font-medium text-sm text-gray-600'>
                    {field.label}{' '}
                    {isRequired && <span className='text-red-500'>*</span>}
                  </label>

                  {/* Text Input */}
                  {field.type === 'text' && (
                    <>
                      <input
                        type='text'
                        {...register(field.name)}
                        disabled={!isEditing || isPermanentlyDisabled}
                        className={`border rounded-md px-3 py-2 text-sm focus:outline-none ${
                          isError ? 'border-red-500' : 'border-gray-300'
                        } ${
                          !isEditing || isPermanentlyDisabled
                            ? 'bg-gray-100 cursor-not-allowed'
                            : ''
                        }`}
                      />
                      {isError && (
                        <p className='pt-2 text-xs text-red-500'>
                          {isError.message}
                        </p>
                      )}
                    </>
                  )}

                  {/* Text Area */}
                  {field.type === 'text-area' && (
                    <>
                      <textarea
                        {...register(field.name)}
                        disabled={!isEditing || isPermanentlyDisabled}
                        rows={4}
                        className={`border rounded-md px-3 py-2 text-sm focus:outline-none resize-none ${
                          isError ? 'border-red-500' : 'border-gray-300'
                        } ${
                          !isEditing || isPermanentlyDisabled
                            ? 'bg-gray-100 cursor-not-allowed'
                            : ''
                        }`}
                      />
                      {isError && (
                        <p className='pt-2 text-xs text-red-500'>
                          {isError.message}
                        </p>
                      )}
                    </>
                  )}

                  {/* Date Input */}
                  {field.type === 'date' && (
                    <>
                      <input
                        type='date'
                        {...register(field.name)}
                        disabled={!isEditing || isPermanentlyDisabled}
                        className={`border rounded-md px-3 py-2 text-sm focus:outline-none ${
                          isError ? 'border-red-500' : 'border-gray-300'
                        } ${
                          !isEditing || isPermanentlyDisabled
                            ? 'bg-gray-100 cursor-not-allowed'
                            : ''
                        }`}
                      />
                      {isError && (
                        <p className='pt-2 text-xs text-red-500'>
                          {isError.message}
                        </p>
                      )}
                    </>
                  )}

                  {/* Simple Select */}
                  {field.type === 'simple-select' && (
                    <>
                      <Controller
                        control={control}
                        name={field.name}
                        render={({ field: controllerField }) => (
                          <SimpleSelect
                            value={controllerField.value}
                            options={field.options}
                            onChange={(val) => controllerField.onChange(val)}
                            error={isError}
                            isDisabled={!isEditing || isPermanentlyDisabled}
                          />
                        )}
                      />
                      {isError && (
                        <p className='pt-2 text-xs text-red-500'>
                          {isError.message}
                        </p>
                      )}
                    </>
                  )}

                  {/* Searchable Select */}
                  {field.type === 'searchable-select' && (
                    <>
                      <Controller
                        control={control}
                        name={field.name}
                        render={({ field: controllerField }) => (
                          <SearchableSelect
                            value={controllerField.value}
                            options={field.options || []}
                            onChange={(val) => controllerField.onChange(val)}
                            error={isError}
                            isDisabled={!isEditing || isPermanentlyDisabled}
                            fetchOptions={
                              field.fetchOptions &&
                              fetchOptionsMap[field.fetchOptions]
                                ? fetchOptionsMap[field.fetchOptions]
                                : undefined
                            }
                            useApiFiltering={!!field.fetchOptions}
                            debounceDelay={field.debounceDelay || 300}
                          />
                        )}
                      />
                      {isError && (
                        <p className='pt-2 text-xs text-red-500'>
                          {isError.message}
                        </p>
                      )}
                    </>
                  )}

                  {/* Multi Select */}
                  {field.type === 'multi-select' && (
                    <>
                      <Controller
                        control={control}
                        name={field.name}
                        render={({ field: controllerField }) => (
                          <MultiSelect
                            value={controllerField.value || []}
                            options={field.options || []}
                            onChange={(val) => controllerField.onChange(val)}
                            error={isError}
                            isDisabled={!isEditing || isPermanentlyDisabled}
                            fetchOptions={
                              field.fetchOptions &&
                              fetchOptionsMap[field.fetchOptions]
                                ? fetchOptionsMap[field.fetchOptions]
                                : undefined
                            }
                            useApiFiltering={!!field.fetchOptions}
                            debounceDelay={field.debounceDelay || 300}
                          />
                        )}
                      />
                      {isError && (
                        <p className='pt-2 text-xs text-red-500'>
                          {isError.message}
                        </p>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </form>
        </div>

        {/* Right Section - Toggles */}
        {toggleFields.length > 0 && (
          <div className='lg:col-span-1'>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h3 className='text-md font-semibold mb-4'>Settings</h3>
              <div className='grid grid-cols-1 gap-4'>
                {toggleFields.map((field, index) => {
                  const isError = errors[field.name];
                  const isRequired = field.validation?.required;
                  const isPermanentlyDisabled = field.readonly && !isCreateMode;

                  return (
                    <div key={index} className='flex flex-col'>
                      <label className='mb-1 font-medium text-sm text-gray-600'>
                        {field.label}{' '}
                        {isRequired && <span className='text-red-500'>*</span>}
                      </label>

                      <Controller
                        control={control}
                        name={field.name}
                        render={({ field: controllerField }) => (
                          <ToggleSwitch
                            value={controllerField.value ?? true}
                            onChange={controllerField.onChange}
                            isDisabled={!isEditing || isPermanentlyDisabled}
                          />
                        )}
                      />
                      {isError && (
                        <p className='pt-2 text-xs text-red-500'>
                          {isError.message}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
