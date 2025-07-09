'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
          <Input
            type='text'
            value={field.value}
            onChange={(e) => onChange(index, e.target.value)}
            disabled={!isEditing}
            className={error ? 'border-red-500' : ''}
          />

          {isEditing && (
            <Button
              type='button'
              variant="ghost"
              size="icon"
              onClick={() => onRemoveField(index)}
              className='text-red-500 hover:text-red-700'
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          )}
        </div>
      ))}

      {isEditing && (
        <Button
          type='button'
          variant="ghost"
          size="sm"
          onClick={onAddField}
          className='flex items-center gap-1 text-primary mt-2'
        >
          <Plus className='h-4 w-4' />
          Add another
        </Button>
      )}

      {error && <p className='pt-2 text-xs text-red-500'>{error.message}</p>}
      }
    </div>
  );
}