'use client';

import Select from 'react-select';
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce'; // Adjust import path as needed

export default function SearchableSelect({
  value,
  options,
  onChange,
  error,
  isDisabled,
  fetchOptions,
  useApiFiltering = false,
  debounceDelay = 300,
}) {
  const [inputValue, setInputValue] = useState('');
  const [loadedOptions, setLoadedOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedInputValue = useDebounce(inputValue, debounceDelay);

  useEffect(() => {
    if (!useApiFiltering) {
      setLoadedOptions(options || []);
    }
  }, [options, useApiFiltering]);

  useEffect(() => {
    if (useApiFiltering && fetchOptions) {
      loadOptionsFromApi(debouncedInputValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedInputValue, useApiFiltering, fetchOptions]);

  useEffect(() => {
    if (useApiFiltering && fetchOptions) {
      loadOptionsFromApi('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useApiFiltering, fetchOptions]);

  const loadOptionsFromApi = async (searchValue) => {
    setIsLoading(true);
    try {
      const results = await fetchOptions(searchValue);
      setLoadedOptions(results || []);
    } catch (error) {
      console.error('Error loading options:', error);
      setLoadedOptions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (newValue) => {
    setInputValue(newValue);
    if (!useApiFiltering && options) {
      const filtered = (options || []).filter((option) =>
        option.label.toLowerCase().includes(newValue.toLowerCase())
      );
      setLoadedOptions(filtered);
    }
    return newValue;
  };

  const formatValue = () => {
    if (value === null || value === undefined) return null;
    const foundOption = loadedOptions.find((option) => option.value === value);
    return foundOption || { label: value, value: value };
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      fontSize: '0.875rem', // text-sm
      borderColor: error ? '#f87171' : state.isFocused ? '#3b82f6' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
      '&:hover': { borderColor: error ? '#f87171' : '#3b82f6' },
      minHeight: '38px',
      backgroundColor: isDisabled ? '#f3f4f6' : 'white',
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: '0.875rem', // text-sm
      backgroundColor: state.isSelected
        ? '#3b82f6'
        : state.isFocused
        ? '#eff6ff'
        : 'white',
      color: state.isSelected ? 'white' : '#374151',
    }),
    loadingIndicator: (provided) => ({ ...provided, color: '#6b7280' }),
  };

  return (
    <Select
      options={loadedOptions}
      value={formatValue()}
      onChange={(selected) => {
        onChange(selected ? selected.value : null);
      }}
      onInputChange={handleInputChange}
      isLoading={isLoading}
      styles={customStyles}
      isDisabled={isDisabled}
      placeholder='Search and select...'
      noOptionsMessage={({ inputValue }) =>
        inputValue
          ? `No options found for "${inputValue}"`
          : 'No options available'
      }
      loadingMessage={() => 'Loading options...'}
      isClearable
      isSearchable
    />
  );
}
