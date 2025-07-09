'use client';

import { useState, useRef } from 'react';
import { useClickAway } from 'react-use';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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

          const renderClearIcon = () =>
            isFilled ? (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearOne(field.name);
                }}
                className='cursor-pointer text-muted-foreground ml-1 hover:text-red-500'
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
                    <Input
                      type='text'
                      autoFocus
                      value={controllerField.value || ''}
                      onChange={controllerField.onChange}
                      onBlur={() => setActiveFilter(null)}
                      className='h-6 text-xs border-none p-0 focus-visible:ring-0'
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
                    <Input
                      type='date'
                      autoFocus
                      value={controllerField.value || ''}
                      onChange={controllerField.onChange}
                      onBlur={() => setActiveFilter(null)}
                      className='h-6 text-xs'
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
                <Badge 
                  variant="outline" 
                  className={`cursor-pointer gap-1 ${isFilled ? 'border-primary text-primary' : ''}`}
                >
                  {renderInlineInput()}
                </Badge>
              ) : (
                <Badge
                  variant={isActive ? "default" : "outline"}
                  className={`cursor-pointer gap-1 ${isFilled ? 'border-primary text-primary' : ''}`}
                  onClick={() => handleToggle(field.name)}
                >
                  {field.label}
                  {isFilled && <span className='text-[10px]'>⬤</span>}
                  {renderClearIcon()}
                </Badge>
              )}

              {/* Popover for dropdown/multi-select */}
              {isActive &&
                ['simple-select', 'searchable-select', 'multi-select'].includes(
                  field.type
                ) && (
                  <Card
                    ref={popoverRef}
                    className='absolute left-0 mt-2 z-50 min-w-[220px] max-w-[320px]'
                  >
                    <CardContent className="p-3">
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
                            />
                          )}
                        />
                      )}
                    </CardContent>
                  </Card>
                )}
            </div>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className='flex justify-end gap-2 mt-3'>
        <Button
          onClick={handleSearch}
          size="sm"
        >
          Search
        </Button>
        <Button
          onClick={handleClearAll}
          variant="outline"
          size="sm"
        >
          Clear all
        </Button>
      </div>
    </div>
  );
}