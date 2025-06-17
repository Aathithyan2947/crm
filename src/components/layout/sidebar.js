'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import logo from '../../../public/logo.svg';
import {
  PanelLeftClose,
  PanelRightOpen,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { DASHBOARD_MENU_ITEMS } from '@/helpers/enums';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState({});
  const pathname = usePathname();

  const isActive = (href) =>
    pathname === href || (href !== '/' && pathname.startsWith(`${href}/`));

  const toggleMenu = (label) =>
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));

  useEffect(() => {
    const updatedOpenMenus = {};
    DASHBOARD_MENU_ITEMS.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some(
          (child) => pathname === child.href
        );
        if (hasActiveChild) updatedOpenMenus[item.label] = true;
      }
    });
    setOpenMenus((prev) => ({ ...prev, ...updatedOpenMenus }));
  }, [pathname]);

  return (
    <div
      className={cn(
        'h-screen sticky top-0 bg-lightPurple border-r border-gray-200 transition-all duration-300',
        collapsed ? 'w-20' : 'w-60'
      )}
    >
      {/* Logo + Collapse Button */}
      <div className='flex items-center justify-between px-3 py-3 bg-lightPurple border-b border-gray-200'>
        {!collapsed && (
          <Image
            src={logo}
            alt='Logo'
            width={100}
            height={24}
            className='transition-all duration-300'
          />
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className='p-4 text-headingBlack hover:bg-lightViolet rounded-md transition'
        >
          {collapsed ? (
            <PanelRightOpen size={18} />
          ) : (
            <PanelLeftClose size={18} />
          )}
        </button>
      </div>

      {/* Scrollable Navigation */}
      <div className='overflow-y-auto h-[calc(100vh-64px)] px-2 py-3'>
        <nav className='flex flex-col gap-1'>
          {DASHBOARD_MENU_ITEMS.map((item) => {
            const itemIsActive = isActive(item.href);
            const hasActiveChild = item.children?.some((child) =>
              isActive(child.href)
            );
            const isOpen = openMenus[item.label];

            return (
              <div key={item.label} className='mb-1'>
                {/* Parent Item */}
                <div
                  className={cn(
                    'flex items-center gap-2 px-2 py-1.5 rounded-lg transition group cursor-pointer',
                    collapsed ? 'justify-center' : '',
                    itemIsActive || hasActiveChild
                      ? 'bg-darkBlue text-white'
                      : 'text-headingBlack hover:bg-lightViolet'
                  )}
                  onClick={() =>
                    item.children ? toggleMenu(item.label) : null
                  }
                  title={collapsed ? item.label : ''}
                >
                  <div
                    className={cn(
                      'p-1.5 rounded-full transition text-sm',
                      itemIsActive || hasActiveChild
                        ? 'bg-white text-darkBlue'
                        : 'bg-lightSandal text-headingBlack group-hover:bg-deepViolet group-hover:text-white'
                    )}
                  >
                    {item.icon}
                  </div>

                  {!collapsed && (
                    <>
                      <span
                        className={cn(
                          'text-xs font-medium',
                          itemIsActive || hasActiveChild
                            ? 'text-white'
                            : 'text-gray-700 group-hover:text-black'
                        )}
                      >
                        {item.label}
                      </span>
                      {item.children && (
                        <span className='ml-auto'>
                          {isOpen ? (
                            <ChevronDown className='w-3 h-3' />
                          ) : (
                            <ChevronRight className='w-3 h-3' />
                          )}
                        </span>
                      )}
                    </>
                  )}
                </div>

                {/* Child Items */}
                {isOpen && !collapsed && item.children && (
                  <div className='ml-4 mt-1 border-l border-gray-400 pl-3 flex flex-col gap-1'>
                    {item.children.map((child) => {
                      const childIsActive = isActive(child.href);
                      return (
                        <Link key={child.label} href={child.href}>
                          <div
                            className={cn(
                              'text-sm px-3 py-2 rounded-lg font-medium transition',
                              childIsActive
                                ? 'bg-black text-white'
                                : 'text-gray-700 hover:bg-gray-600 hover:text-white'
                            )}
                          >
                            {child.label}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
