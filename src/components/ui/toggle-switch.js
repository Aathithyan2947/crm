'use client';

import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function ToggleSwitch({ value, onChange, isDisabled }) {
  return (
    <div className='flex items-center gap-2'>
      <Switch
        checked={value}
        onCheckedChange={onChange}
        disabled={isDisabled}
      />
    </div>
  );
}