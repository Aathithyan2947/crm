'use client';

export default function IconButton({ children, onClick, count = 0 }) {
  return (
    <div className='relative'>
      <div
        className='bg-white flex justify-center items-center h-10 w-10 rounded-full hover:scale-110 transition-all duration-200 cursor-pointer'
        onClick={onClick}
      >
        {children}
      </div>
      {count > 0 && (
        <div className='absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold h-5 w-5 flex items-center justify-center rounded-full shadow-md'>
          {count}
        </div>
      )}
    </div>
  );
}
