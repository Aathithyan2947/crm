'use client';

import { useEffect, useState } from 'react';
import Select from 'react-select';
import { useDebounce } from '@/hooks/useDebounce';

export default function SimpleSelect({
  value,
  options = [],
  onChange,
  error,
  isDisabled,
  fetchOptions,
  useApiFiltering = false,
  debounceDelay = 300,
}) {
  const [loadedOptions, setLoadedOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load options on mount and when fetchOptions changes
  useEffect(() => {
    const loadInitialOptions = async () => {
      if (useApiFiltering && fetchOptions) {
        setIsLoading(true);
        try {
          const result = await fetchOptions();
          setLoadedOptions(formatOptions(result));
        } catch (err) {
          console.error('Failed to load options:', err);
          setLoadedOptions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setLoadedOptions(formatOptions(options));
      }
    };

    loadInitialOptions();
  }, [fetchOptions, options, useApiFiltering]);

  const formatOptions = (opts) =>
    (opts || []).map((opt) =>
      typeof opt === 'string'
        ? { label: opt, value: opt }
        : {
          label: opt.label || opt.Label || opt.name || opt.value || String(opt),
          value: opt.value || opt.id || opt.Value || opt,
        }
    );

  const selectedOption =
    loadedOptions.find((opt) => opt.value === value || opt.label === value) ||
    null;

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: error ? '#f87171' : state.isFocused ? '#3b82f6' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
      '&:hover': { borderColor: error ? '#f87171' : '#3b82f6' },
      minHeight: '38px',
      backgroundColor: isDisabled ? '#f3f4f6' : 'white',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? '#3b82f6'
        : state.isFocused
          ? '#eff6ff'
          : 'white',
      color: state.isSelected ? 'white' : '#374151',
    }),
  };

  return (
    <Select
      options={loadedOptions}
      value={selectedOption}
      onChange={(selected) => onChange(selected?.value)}
      isDisabled={isDisabled}
      isLoading={isLoading}
      styles={customStyles}
      placeholder='Select...'
      noOptionsMessage={() => 'No options available'}
      loadingMessage={() => 'Loading options...'}
      isSearchable={false}
    />
  );
}
