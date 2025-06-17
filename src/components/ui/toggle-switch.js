'use client';

export default function ToggleSwitch({ value, onChange, isDisabled }) {
  return (
    <label className='flex items-center gap-2 cursor-pointer'>
      <div className='relative'>
        <input
          type='checkbox'
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          disabled={isDisabled}
          className='sr-only peer'
        />
        <div
          className={`w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-green-500 transition-all ${isDisabled ? 'opacity-50' : ''
            }`}
        ></div>
        <div
          className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5`}
        ></div>
      </div>
    </label>
  );
}
