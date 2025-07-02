'use client';

import { Plus, Trash2 } from 'lucide-react';

export default function DynamicInput({
  fields,
  onAddField,
  onRemoveField,
  onChange,
  isEditing,
  error,
}) {
  return (
    <div className='space-y-2'>
      {fields.map((field, index) => (
        <div key={index} className='flex items-center gap-2'>
          <input
            type='text'
            value={field.value}
            onChange={(e) => onChange(index, e.target.value)}
            disabled={!isEditing}
            className={`flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none ${error ? 'border-red-500' : 'border-gray-300'
              } ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          />

          {isEditing && (
            <button
              aria-labelledby='remove button'
              type='button'
              onClick={() => onRemoveField(index)}
              className='p-2 text-red-500 hover:text-red-700'
            >
              <Trash2 className='h-4 w-4' />
            </button>
          )}
        </div>
      ))}

      {isEditing && (
        <button
          aria-labelledby='add button'
          type='button'
          onClick={onAddField}
          className='flex items-center gap-1 text-sm text-deepViolet mt-2'
        >
          <Plus className='h-4 w-4' />
          Add another
        </button>
      )}

      {error && <p className='pt-2 text-xs text-red-500'>{error.message}</p>}
    </div>
  );
}
