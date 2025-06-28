'use client';

import { Trash2, Plus } from 'lucide-react';
import SimpleSelect from './simple-dropdown';
import { Controller } from 'react-hook-form';
import ToggleSwitch from './toggle-switch';

export default function DynamicInputGroup({
  fields = [],
  template = [],
  onAddField,
  onRemoveField,
  onChange,
  isEditing,
  error,
  control,
  fetchOptionsMap,
  name,
}) {
  return (
    <div className='space-y-4'>
      {fields.map((index) => (
        <div key={index} className='flex flex-col gap-3 p-4 border rounded-md'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {template.map((t) => {
              const defaultValue = t.type === 'toggle'
                ? (t.defaultValue !== undefined ? t.defaultValue : false)
                : t.type === 'number'
                  ? 0
                  : '';

              return (
                <Controller
                  key={`${name}.${index}.${t.name}`}
                  control={control}
                  name={`${name}.${index}.${t.name}`}
                  defaultValue={defaultValue}
                  render={({ field: controllerField }) => (
                    <div className='flex flex-col'>
                      <label className='mb-1 text-sm text-gray-600'>
                        {t.label}
                        {t.validation?.required && (
                          <span className='text-red-500 ml-1'>*</span>
                        )}
                      </label>

                      {t.type === 'simple-select' ? (
                        <SimpleSelect
                          value={controllerField.value}
                          options={t.options || []}
                          onChange={(val) => {
                            controllerField.onChange(val);
                            onChange(index, t.name, val);
                          }}
                          isDisabled={!isEditing}
                          fetchOptions={
                            t.fetchOptions && fetchOptionsMap
                              ? fetchOptionsMap[t.fetchOptions]
                              : undefined
                          }
                          useApiFiltering={!!t.fetchOptions}
                          error={error?.[index]?.[t.name]}
                        />
                      ) : t.type === 'toggle' ? (
                        <ToggleSwitch
                          value={controllerField.value}
                          onChange={(val) => {
                            controllerField.onChange(val);
                            onChange(index, t.name, val);
                          }}
                          isDisabled={!isEditing}
                        />
                      ) : (
                        <input
                          type={t.type === 'number' ? 'number' : 'text'}
                          value={controllerField.value}
                          onChange={(e) => {
                            const value = t.type === 'number'
                              ? Number(e.target.value)
                              : e.target.value;
                            controllerField.onChange(value);
                            onChange(index, t.name, value);
                          }}
                          disabled={!isEditing}
                          className={`border rounded-md px-3 py-2 text-sm focus:outline-none ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''
                            } ${error?.[index]?.[t.name] ? 'border-red-500' : 'border-gray-300'}`}
                        />
                      )}

                      {error?.[index]?.[t.name] && (
                        <p className='mt-1 text-xs text-red-500'>
                          {error[index][t.name].message}
                        </p>
                      )}
                    </div>
                  )}
                />
              );
            })}
          </div>

          {isEditing && (
            <button
              type='button'
              onClick={() => onRemoveField(index)}
              className='self-end flex items-center gap-1 text-white bg-red-500 px-3 py-2 rounded-md text-sm hover:scale-105 transition-all duration-200'
            >
              <Trash2 className='h-4 w-4' />
              Remove
            </button>
          )}
        </div>
      ))}

      {isEditing && (
        <button
          type='button'
          onClick={onAddField}
          className='w-full bg-deepViolet text-white flex justify-center items-center gap-2 border border-gray-300 px-6 py-2 rounded-md text-sm hover:scale-105 transition-all duration-200'
        >
          <Plus className='h-4 w-4' />
          Add Team Member
        </button>
      )}

      {error?.message && !Array.isArray(error) && (
        <p className='text-xs text-red-500'>{error.message}</p>
      )}
    </div>
  );
}
