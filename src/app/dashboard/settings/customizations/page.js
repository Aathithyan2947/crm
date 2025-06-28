'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, GripVertical, Save, ChevronDown } from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import axios from 'axios';
import SimpleSelect from '@/components/ui/simple-dropdown';
import ToggleSwitch from '@/components/ui/toggle-switch';
import {
  createDropdownConfig,
  getDropdownConfigs,
  getDropdownModels,
  getModelFields,
  updateDropdownConfig,
} from '@/services/customization-api';

export default function DropdownConfigurationManager() {
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedAttribute, setSelectedAttribute] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  // Fetch dropdown models
  const { data: models } = useQuery({
    queryKey: ['dropdownModels'],
    queryFn: () => getDropdownModels().then((res) => res.data.data),
    select: (data) => {
      if (!Array.isArray(data)) return [];
      return data.map((item) => item.value);
    },
  });

  // Fetch fields for selected model
  const { data: modelFields } = useQuery({
    queryKey: ['modelFields', selectedModel],
    queryFn: () => getModelFields(selectedModel).then((res) => res.data.data),
    enabled: !!selectedModel,
    select: (data) => {
      if (!Array.isArray(data)) return [];
      return data.map((field) => ({
        value: field.Attribute,
        label: field.Label || field.Attribute,
      }));
    },
  });

  const { data: configData, refetch: refetchConfig } = useQuery({
    queryKey: ['dropdownConfigs', selectedModel],
    queryFn: () =>
      getDropdownConfigs(selectedModel).then((res) => res.data.data),
    enabled: !!selectedModel,
  });

  // Get options for selected attribute
  const existingOptions =
    selectedAttribute && configData?.attributes?.[selectedAttribute]
      ? configData.attributes[selectedAttribute].map((opt) => ({
          id: opt.id?.toString() || `${opt.config_key}-${opt.config_value}`,
          config_key: opt.config_key,
          config_value: opt.config_value,
          display_order: opt.display_order || 0,
          is_active: opt.is_active !== false,
        }))
      : [];

  const hasExistingConfig = !!existingOptions.length;

  // Create/update configuration mutation
  const { mutate: saveConfig, isPending: isSaving } = useMutation({
    mutationFn: (config) => {
      if (hasExistingConfig) {
        return updateDropdownConfig(
          config.model_name,
          config.attribute,
          config.options.map((opt) => ({
            id: Number(opt.id),
            config_key: opt.config_key,
            config_value: opt.config_value,
            display_order: opt.display_order,
            is_active: opt.is_active,
          }))
        );
      } else {
        return createDropdownConfig({
          model_name: config.model_name,
          attribute: config.attribute,
          options: config.options.map((opt, index) => ({
            config_key:
              opt.config_key ||
              opt.config_value.toUpperCase().replace(/\s+/g, '_'),
            config_value: opt.config_value,
            display_order: index,
            is_active: opt.is_active !== false,
          })),
        });
      }
    },
    onSuccess: () => {
      toast.success('Configuration saved successfully');
      queryClient.invalidateQueries(['dropdownConfigs', selectedModel]);
      setIsEditing(false);
    },
    onError: (error) => {
      console.error('Save error:', error);
      toast.error('Failed to save configuration');
    },
  });
  const handleModelChange = (value) => {
    setSelectedModel(value);
    setSelectedAttribute('');
    setIsEditing(false);
  };

  const handleAttributeChange = (value) => {
    setSelectedAttribute(value);
    setIsEditing(false);
  };

  // Auto-refresh after save to get latest data
  useEffect(() => {
    if (!isSaving && isEditing) {
      refetchConfig();
    }
  }, [isSaving, isEditing, refetchConfig]);

  return (
    <div className='p-4 max-w-6xl mx-auto'>
      <h1 className='text-xl font-bold text-gray-800 mb-4'>
        Dropdown Configuration Manager
      </h1>

      <div className='bg-white rounded-lg shadow p-4 mb-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          {/* Model Selection */}
          <div className='text-sm'>
            <label className='block text-xs font-medium text-gray-700 mb-1'>
              Select Model
            </label>
            <SimpleSelect
              value={selectedModel}
              options={models || []} // models is ['model1', 'model2']
              onChange={handleModelChange}
              isDisabled={!models}
            />
          </div>

          {/* Attribute Selection */}
          <div className='text-sm'>
            <label className='block text-xs font-medium text-gray-700 mb-1'>
              Select Attribute
            </label>
            <SimpleSelect
              value={selectedAttribute}
              options={modelFields || []} // modelFields is [{value: 'attr1', label: 'Attribute 1'}]
              onChange={handleAttributeChange}
              isDisabled={!selectedModel || !modelFields}
            />
          </div>
        </div>
      </div>

      {selectedModel && selectedAttribute && (
        <div className='bg-white rounded-lg shadow overflow-hidden'>
          <div className='flex justify-between items-center p-4 border-b'>
            <h2 className='text-md font-semibold text-gray-800'>
              {modelFields?.find((f) => f.value === selectedAttribute)?.label ||
                selectedAttribute}{' '}
              Options
            </h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className='px-3 py-1.5 bg-deepViolet text-white rounded-md hover:bg-deepViolet/90 flex items-center gap-1 text-sm'
            >
              {isEditing ? 'View Mode' : 'Edit Mode'}
            </button>
          </div>

          {isEditing ? (
            <EditableOptionsList
              initialOptions={existingOptions}
              onSave={(options) =>
                saveConfig({
                  model_name: selectedModel,
                  attribute: selectedAttribute,
                  options: options,
                })
              }
              isSaving={isSaving}
            />
          ) : (
            <ReadOnlyOptionsList options={existingOptions} />
          )}
        </div>
      )}
    </div>
  );
}

function EditableOptionsList({ initialOptions, onSave, isSaving }) {
  const [options, setOptions] = useState(
    initialOptions.length > 0
      ? initialOptions
      : [
          {
            id: 'new-0',
            config_key: '',
            config_value: '',
            display_order: 0,
            is_active: true,
          },
        ]
  );
  const [activeId, setActiveId] = useState(null);
  const [newOptionValue, setNewOptionValue] = useState('');
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addNewOption = () => {
    if (!newOptionValue.trim()) {
      toast.error('Please enter an option value');
      return;
    }

    const newKey = newOptionValue.toUpperCase().replace(/\s+/g, '_');

    setOptions((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}`,
        config_key: newKey,
        config_value: newOptionValue,
        display_order: prev.length,
        is_active: true,
      },
    ]);
    setNewOptionValue('');
  };

  const removeOption = (id) => {
    if (options.length <= 1) {
      toast.error('At least one option is required');
      return;
    }
    setOptions((prev) => {
      const newOptions = prev.filter((opt) => opt.id !== id);
      return newOptions.map((opt, idx) => ({
        ...opt,
        display_order: idx,
      }));
    });
  };

  const toggleActiveStatus = (id) => {
    setOptions((prev) =>
      prev.map((opt) =>
        opt.id === id ? { ...opt, is_active: !opt.is_active } : opt
      )
    );
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setOptions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        return newItems.map((item, index) => ({
          ...item,
          display_order: index,
        }));
      });
    }
    setActiveId(null);
  };
  const handleOptionChange = (id, field, value) => {
    setOptions((prev) => {
      return prev.map((opt) => {
        if (opt.id === id) {
          const updatedOption = {
            ...opt,
            [field]: value,
          };
          // Always update config_key when config_value changes
          if (field === 'config_value') {
            updatedOption.config_key = value.toUpperCase().replace(/\s+/g, '_');
          }
          return updatedOption;
        }
        return opt;
      });
    });
  };

  const handleSubmit = () => {
    const hasEmptyValues = options.some(
      (opt) => !opt.config_value?.trim() || !opt.config_key?.trim()
    );

    if (hasEmptyValues) {
      toast.error('All options must have both a key and a value');
      return;
    }

    onSave(options);
  };

  return (
    <div className='p-4'>
      <div className='mb-4'>
        <div className='flex gap-2 mb-2'>
          <input
            type='text'
            value={newOptionValue}
            onChange={(e) => setNewOptionValue(e.target.value)}
            className='flex-1 px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm'
            placeholder='Add new option'
          />
          <button
            onClick={addNewOption}
            className='px-3 py-2 bg-deepViolet text-white rounded-md hover:bg-deepViolet/90 flex items-center gap-1 text-sm'
          >
            <Plus className='h-4 w-4' />
            Add
          </button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={options.map((opt) => opt.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className='border rounded-md divide-y'>
            {options.map((option) => (
              <SortableOption
                key={option.id}
                id={option.id}
                option={option}
                onRemove={removeOption}
                onChange={handleOptionChange}
                onToggleActive={toggleActiveStatus}
                disabled={isSaving}
              />
            ))}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeId ? (
            <OptionItem
              option={options.find((opt) => opt.id === activeId)}
              isDragging
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      <div className='mt-4 flex justify-end'>
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className='px-4 py-2 bg-deepViolet text-white rounded-md hover:bg-deepViolet/90 flex items-center gap-1 text-sm disabled:opacity-50'
        >
          {isSaving ? (
            <>
              <svg className='animate-spin h-4 w-4' viewBox='0 0 24 24'>
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                ></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <Save className='h-4 w-4' />
              Save Options
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function SortableOption({
  id,
  option,
  onRemove,
  onChange,
  onToggleActive,
  disabled,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 bg-white ${
        isDragging ? 'bg-blue-50 shadow-md' : ''
      } ${disabled ? 'opacity-50' : ''}`}
    >
      <button
        {...attributes}
        {...listeners}
        className={`text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing`}
        disabled={disabled}
      >
        <GripVertical className='h-4 w-4' />
      </button>

      <input
        type='text'
        value={option.config_value}
        onChange={(e) => onChange(id, 'config_value', e.target.value)}
        disabled={disabled}
        className='flex-1 px-3 py-2 border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:opacity-50'
      />

      <ToggleSwitch
        value={option.is_active}
        onChange={(checked) => onToggleActive(id, checked)}
        isDisabled={disabled}
      />

      <button
        onClick={() => onRemove(id)}
        disabled={disabled}
        className='text-red-500 hover:text-red-700 p-1'
      >
        <Trash2 className='h-4 w-4' />
      </button>
    </div>
  );
}

function OptionItem({ option, isDragging }) {
  return (
    <div
      className={`flex items-center gap-3 p-3 bg-white shadow-lg ${
        isDragging ? 'ring-1 ring-blue-500' : ''
      }`}
    >
      <GripVertical className='h-4 w-4 text-gray-400' />
      <div className='flex-1 px-3 py-2'>{option.config_value}</div>
      <ToggleSwitch value={option.is_active} onChange={() => {}} isDisabled />
    </div>
  );
}

function ReadOnlyOptionsList({ options }) {
  return (
    <div className='p-4'>
      {options.length === 0 ? (
        <div className='text-center py-4 text-gray-500 text-sm'>
          No options configured yet
        </div>
      ) : (
        <div className='border rounded-md divide-y'>
          {options
            .sort((a, b) => a.display_order - b.display_order)
            .map((option) => (
              <div
                key={option.id || `${option.config_key}-${option.config_value}`}
                className='flex items-center gap-3 p-3 bg-white'
              >
                <ChevronDown className='h-4 w-4 text-gray-400' />
                <div className='flex-1'>{option.config_value}</div>
                <ToggleSwitch
                  value={option.is_active}
                  onChange={() => {}}
                  isDisabled
                />
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
