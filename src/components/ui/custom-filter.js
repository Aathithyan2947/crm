'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import SimpleSelect from './simple-dropdown';
import SearchableSelect from './searchable-dropdown';
import MultiSelect from './mulit-select-dropdown';
import { useDebounce } from '@/hooks/useDebounce';

export default function CustomFilter({
  config = [],
  defaultValues = {},
  onFilterChange,
  fetchOptionsMap = {},
}) {
  const { control, watch, setValue, reset } = useForm({
    defaultValues,
  });

  const [textInputValues, setTextInputValues] = useState({});
  const debouncedTextValues = useDebounce(textInputValues, 1000);

  useEffect(() => {
    for (const key in debouncedTextValues) {
      setValue(key, debouncedTextValues[key]);
    }
  }, [debouncedTextValues, setValue]);

  // Trigger filter changes
  useEffect(() => {
    const subscription = watch((values) => {
      onFilterChange(values);
    });
    return () => subscription.unsubscribe();
  }, [watch, onFilterChange]);

  return (
    <div className='bg-white p-2 rounded-lg shadow-sm space-y-3'>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3'>
        {config.map((field) => (
          <div key={field.name} className='flex flex-col'>
            <label className='text-xs text-gray-600 mb-0.5 font-semibold'>
              {field.label}
            </label>

            {field.type === 'text' && (
              <input
                type='text'
                value={textInputValues[field.name] || ''}
                onChange={(e) =>
                  setTextInputValues((prev) => ({
                    ...prev,
                    [field.name]: e.target.value,
                  }))
                }
                className='border px-2 py-2.5 rounded text-xs border-gray-300'
              />
            )}

            {field.type === 'date' && (
              <input
                type='date'
                onChange={(e) => setValue(field.name, e.target.value)}
                className='border px-2 py-2.5 rounded text-xs border-gray-300'
              />
            )}

            {field.type === 'simple-select' && (
              <Controller
                name={field.name}
                control={control}
                render={({ field: controllerField }) => (
                  <SimpleSelect
                    value={controllerField.value}
                    options={field.options}
                    onChange={controllerField.onChange}
                    size='xs'
                  />
                )}
              />
            )}

            {field.type === 'searchable-select' && (
              <Controller
                name={field.name}
                control={control}
                render={({ field: controllerField }) => (
                  <SearchableSelect
                    value={controllerField.value}
                    options={field.options}
                    onChange={controllerField.onChange}
                    fetchOptions={
                      field.fetchOptions && fetchOptionsMap[field.fetchOptions]
                    }
                    useApiFiltering={!!field.fetchOptions}
                    size='xs'
                  />
                )}
              />
            )}

            {field.type === 'multi-select' && (
              <Controller
                name={field.name}
                control={control}
                render={({ field: controllerField }) => (
                  <MultiSelect
                    value={controllerField.value || []}
                    options={field.options}
                    onChange={controllerField.onChange}
                    fetchOptions={
                      field.fetchOptions && fetchOptionsMap[field.fetchOptions]
                    }
                    useApiFiltering={!!field.fetchOptions}
                    size='xs'
                  />
                )}
              />
            )}
          </div>
        ))}
      </div>

      <div className='flex justify-end'>
        <button
          onClick={() => {
            reset();
            setTextInputValues({});
          }}
          className='text-sm px-3 py-2 border border-deepViolet rounded hover:bg-deepViolet hover:text-white transition'
        >
          Clear
        </button>
      </div>
    </div>
  );
}
