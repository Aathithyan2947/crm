'use client';

import Select from 'react-select';

export default function SimpleSelect({
  value,
  options,
  onChange,
  error,
  isDisabled,
}) {
  const formattedOptions = options.map((opt) => ({ label: opt, value: opt }));
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
    loadingIndicator: (provided) => ({ ...provided, color: '#6b7280' }),
  };

  return (
    <Select
      options={formattedOptions}
      value={value ? { label: value, value } : null}
      onChange={(selected) => onChange(selected?.value)}
      isDisabled={isDisabled}
      isSearchable={false}
      styles={customStyles}
    />
  );
}
