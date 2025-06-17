'use client';

import IconButton from '../ui/iconbutton';
import { BellRing, Settings, User } from 'lucide-react';

const HEADER_ICONS = [
  {
    icon: <Settings size={15} />,
    handleSubmit: () => {
      console.log('settings is clicked');
    },
  },
  {
    icon: <BellRing size={15} />,
    handleSubmit: () => {
      console.log('bell clicked');
    },
    count: 3,
  },
  {
    icon: <User size={15} />,
    handleSubmit: () => {
      console.log('user clicked');
    },
  },
];

export default function Header() {
  return (
    <div className='bg-lightPurple w-full flex justify-end items-center px-4'>
      <div className='flex gap-4'>
        {HEADER_ICONS.map((item, index) => (
          <IconButton
            key={index}
            onClick={item.handleSubmit}
            count={item.count || 0}
          >
            {item.icon}
          </IconButton>
        ))}
      </div>
    </div>
  );
}
