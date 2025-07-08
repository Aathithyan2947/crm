'use client';

import { Plus } from 'lucide-react';
import SimpleSelect from './simple-dropdown';
import { Controller } from 'react-hook-form';
import ToggleSwitch from './toggle-switch';

export default function DynamicInputGroup({
  fields = [],
  template = [],
  onAddField,
  onChange,
  isEditing,
  error,
  control,
  fetchOptionsMap,
  name,
}) {
  // Function to check if field is a phone number field
  const isPhoneNumberField = (fieldName) => {
    return ['contact_number', 'phone_number'].includes(fieldName);
  };

  // Default validation for phone number fields
  const getPhoneNumberValidation = () => ({
    pattern: {
      value: /^[0-9]{10}$/,
      message: 'Must be exactly 10 digits',
    },
    required: 'Contact number is required',
  });

  return (
    <div className='space-y-4'>
      {fields.map((field, index) => (
        <div key={field.id || index} className='flex flex-col gap-3 p-4 border rounded-md'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {template.map((t) => {
              const fieldValue = fields[index]?.[t.name] ??
                (t.type === 'toggle' ? (t.defaultValue !== undefined ? t.defaultValue : false) :
                  t.type === 'number' ? 0 : '');

              // Apply phone number validation if field name matches
              const validation = isPhoneNumberField(t.name)
                ? { ...t.validation, ...getPhoneNumberValidation() }
                : t.validation;

              return (
                <Controller
                  key={`${name}.${index}.${t.name}`}
                  control={control}
                  name={`${name}.${index}.${t.name}`}
                  defaultValue={fieldValue}
                  rules={validation}
                  render={({ field: controllerField }) => (
                    <div className='flex flex-col'>
                      <label className='mb-1 text-sm text-gray-600'>
                        {t.label}
                        {validation?.required && (
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
                          value={controllerField.value || ''}
                          onChange={(e) => {
                            // For phone numbers, only allow numeric input
                            let value = e.target.value;
                            if (isPhoneNumberField(t.name)) {
                              value = value.replace(/\D/g, ''); // Remove non-digit characters
                              value = value.slice(0, 10); // Limit to 10 digits
                            } else if (t.type === 'number') {
                              value = Number(e.target.value);
                            } else {
                              value = e.target.value;
                            }

                            controllerField.onChange(value);
                            onChange(index, t.name, value);
                          }}
                          disabled={!isEditing}
                          className={`border rounded-md px-3 py-2 text-sm focus:outline-none ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''
                            } ${error?.[index]?.[t.name] ? 'border-red-500' : 'border-gray-300'
                            }`}
                          // Add input mode for better mobile keyboard
                          inputMode={isPhoneNumberField(t.name) ? 'numeric' : undefined}
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
