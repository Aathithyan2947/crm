'use client';

import { useState, useRef } from 'react';
import { useClickAway } from 'react-use';
import { Controller, useForm } from 'react-hook-form';
import SimpleSelect from './simple-dropdown';
import SearchableSelect from './searchable-dropdown';
import MultiSelect from './mulit-select-dropdown';

export default function CustomFilter({
  config = [],
  defaultValues = {},
  onFilterChange,
  fetchOptionsMap = {},
}) {
  // Initialize proper default values for all fields
  const initializedDefaults = config.reduce((acc, field) => {
    if (defaultValues[field.name] !== undefined) {
      acc[field.name] = defaultValues[field.name];
    } else {
      // Set appropriate empty values based on field type
      acc[field.name] =
        field.type === 'multi-select'
          ? []
          : field.type === 'text' || field.type === 'date'
          ? ''
          : null;
    }
    return acc;
  }, {});

  const { control, watch, reset, setValue, getValues } = useForm({
    defaultValues: initializedDefaults,
  });

  const [activeFilter, setActiveFilter] = useState(null);
  const popoverRef = useRef(null);

  useClickAway(popoverRef, () => {
    setActiveFilter(null);
  });

  const handleToggle = (name) => {
    setActiveFilter((prev) => (prev === name ? null : name));
  };

  const handleClearAll = () => {
    reset(initializedDefaults);
    onFilterChange({});
    setActiveFilter(null);
  };

  const handleClearOne = (name) => {
    const fieldConfig = config.find((f) => f.name === name);
    const emptyValue =
      fieldConfig?.type === 'multi-select'
        ? []
        : fieldConfig?.type === 'text' || fieldConfig?.type === 'date'
        ? ''
        : null;

    setValue(name, emptyValue);
    const values = getValues();
    onFilterChange(values);
  };

  const handleSearch = () => {
    const values = getValues();
    onFilterChange(values);
    setActiveFilter(null);
  };

  return (
    <div className='relative'>
      {/* Pills */}
      <div className='flex flex-wrap gap-2'>
        {config.map((field) => {
          const isActive = activeFilter === field.name;
          const fieldValue = watch(field.name);
          const isFilled = Array.isArray(fieldValue)
            ? fieldValue.length > 0
            : fieldValue !== null &&
              fieldValue !== undefined &&
              fieldValue !== '';

          const commonPillClasses = `rounded-md text-xs border border-gray-300 whitespace-nowrap flex items-center gap-1 px-3 py-1 ${
            isFilled ? 'text-deepViolet font-medium' : 'text-gray-600'
          }`;

          const renderClearIcon = () =>
            isFilled ? (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearOne(field.name);
                }}
                className='cursor-pointer text-gray-500 ml-1 hover:text-red-500'
              >
                ✕
              </span>
            ) : null;

          const renderInlineInput = () => {
            if (field.type === 'text') {
              return (
                <Controller
                  name={field.name}
                  control={control}
                  defaultValue=''
                  render={({ field: controllerField }) => (
                    <input
                      type='text'
                      autoFocus
                      value={controllerField.value || ''}
                      onChange={controllerField.onChange}
                      onBlur={() => setActiveFilter(null)}
                      className='bg-white text-xs focus:outline-none'
                    />
                  )}
                />
              );
            }

            if (field.type === 'date') {
              return (
                <Controller
                  name={field.name}
                  control={control}
                  defaultValue=''
                  render={({ field: controllerField }) => (
                    <input
                      type='date'
                      autoFocus
                      value={controllerField.value || ''}
                      onChange={controllerField.onChange}
                      onBlur={() => setActiveFilter(null)}
                      className='bg-white px-2 py-0.5 rounded text-xs border border-gray-300 focus:outline-none'
                    />
                  )}
                />
              );
            }

            return null;
          };

          return (
            <div key={field.name} className='relative'>
              {/* Inline inputs for text/date */}
              {(field.type === 'text' || field.type === 'date') && isActive ? (
                <div className={commonPillClasses}>{renderInlineInput()}</div>
              ) : (
                <button
                  onClick={() => handleToggle(field.name)}
                  className={`${commonPillClasses} ${
                    isActive ? 'bg-gray-200' : 'bg-white'
                  }`}
                >
                  {field.label}
                  {isFilled && <span className='text-[10px]'>⬤</span>}
                  {renderClearIcon()}
                </button>
              )}

              {/* Popover for dropdown/multi-select */}
              {isActive &&
                ['simple-select', 'searchable-select', 'multi-select'].includes(
                  field.type
                ) && (
                  <div
                    ref={popoverRef}
                    className='absolute left-0 mt-2 bg-white shadow-lg rounded-lg border border-gray-200 p-3 z-50 min-w-[220px] max-w-[320px]'
                  >
                    {field.type === 'simple-select' && (
                      <Controller
                        name={field.name}
                        control={control}
                        defaultValue={null}
                        render={({ field: controllerField }) => (
                          <SimpleSelect
                            value={controllerField.value}
                            options={field.options}
                            onChange={controllerField.onChange}
                            size='sm'
                          />
                        )}
                      />
                    )}

                    {field.type === 'searchable-select' && (
                      <Controller
                        name={field.name}
                        control={control}
                        defaultValue={null}
                        render={({ field: controllerField }) => (
                          <SearchableSelect
                            value={controllerField.value}
                            options={field.options}
                            onChange={controllerField.onChange}
                            fetchOptions={
                              field.fetchOptions &&
                              fetchOptionsMap[field.fetchOptions]
                            }
                            useApiFiltering={!!field.fetchOptions}
                            size='sm'
                          />
                        )}
                      />
                    )}

                    {field.type === 'multi-select' && (
                      <Controller
                        name={field.name}
                        control={control}
                        defaultValue={[]}
                        render={({ field: controllerField }) => (
                          <MultiSelect
                            value={controllerField.value || []}
                            options={field.options}
                            onChange={controllerField.onChange}
                            fetchOptions={
                              field.fetchOptions &&
                              fetchOptionsMap[field.fetchOptions]
                            }
                            useApiFiltering={!!field.fetchOptions}
                            size='sm'
                          />
                        )}
                      />
                    )}
                  </div>
                )}
            </div>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className='flex justify-end gap-2 mt-3'>
        <button
          onClick={handleSearch}
          className='text-xs px-2.5 py-1.5 border border-deepViolet bg-deepViolet text-white rounded hover:opacity-90 transition'
        >
          Search
        </button>
        <button
          onClick={handleClearAll}
          className='text-xs px-2.5 py-1.5 border border-gray-400 rounded hover:bg-gray-100 transition'
        >
          Clear all
        </button>
      </div>
    </div>
  );
}
