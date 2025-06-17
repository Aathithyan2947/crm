'use client';

import Select from 'react-select';
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce'; // Adjust import path as needed

export default function MultiSelect({
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
    if (!value || !Array.isArray(value)) return [];
    return value.map((val) => {
      const foundOption = loadedOptions.find((option) => option.value === val);
      return foundOption || { label: val, value: val };
    });
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: error ? '#f87171' : state.isFocused ? '#3b82f6' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
      '&:hover': { borderColor: error ? '#f87171' : '#3b82f6' },
      minHeight: '38px',
      backgroundColor: isDisabled ? '#f3f4f6' : 'white',
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#e5e7eb',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#374151',
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
    loadingIndicator: (provided) => ({
      ...provided,
      color: '#6b7280',
    }),
  };

  return (
    <Select
      options={loadedOptions}
      value={formatValue()}
      onChange={(selected) => {
        const values = selected ? selected.map((s) => s.value) : [];
        onChange(values);
      }}
      onInputChange={handleInputChange}
      isLoading={isLoading}
      styles={customStyles}
      isMulti
      isDisabled={isDisabled}
      placeholder='Select options...'
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
