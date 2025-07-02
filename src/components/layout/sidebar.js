'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLast, ChevronFirst, Search, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  BOTTOM_DASHBOARD_ROUTES,
  DASHBOARD_MENU_ITEM_BOTTOM,
  DASHBOARD_MENU_ITEMS,
  SETTINGS_MENU_ITEMS,
} from '@/helpers/enums';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState({});
  const pathname = usePathname();

  const isActive = (href) =>
    pathname === href || pathname.startsWith(`${href}/`);
  const isSettingsPage = pathname.startsWith(BOTTOM_DASHBOARD_ROUTES.SETTINGS);

  useEffect(() => {
    if (isSettingsPage) {
      const sections = {};
      SETTINGS_MENU_ITEMS.forEach((section) => {
        if (section.children.some((child) => isActive(child.href))) {
          sections[section.label] = true;
        }
      });
      setExpandedSections(sections);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, isSettingsPage]);

  const toggleSection = (label) => {
    setExpandedSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const filteredModuleItems = DASHBOARD_MENU_ITEMS.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={cn(
        'flex h-screen bg-[#1f2a38] text-white sticky top-0 pt-3 select-none',
        collapsed ? 'w-[60px]' : 'w-[260px]'
      )}
      aria-label="Main navigation"
    >
      {/* Left Icons Column */}
      <div className='flex flex-col justify-between h-full w-[60px] border-r border-[#2c3e50]'>
        <div>
          <button
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={() => setCollapsed(!collapsed)}
            className='mb-4 p-1 text-gray-400 hover:text-white w-full flex justify-center'
          >
            {collapsed ? <ChevronLast size={18} /> : <ChevronFirst size={18} />}
          </button>

          {/* Module Items (Top) */}
          <div className='overflow-y-auto max-h-[calc(100vh-120px)]'>
            {DASHBOARD_MENU_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className='relative group my-1 flex justify-center'
                aria-label={item.label}
              >
                <div
                  className={cn(
                    'w-8 h-8 flex items-center justify-center rounded-md',
                    isActive(item.href)
                      ? 'bg-[#1e4a8e] text-white'
                      : 'text-gray-400 hover:bg-[#32435b]'
                  )}
                >
                  <div
                    className={isActive(item.href) ? 'text-white' : item.color}
                    aria-hidden="true"
                  >
                    {item.icon}
                  </div>
                </div>
                <div
                  className={cn(
                    'absolute left-full top-1/2 -translate-y-1/2 whitespace-nowrap rounded px-2 py-1 text-sm bg-gray-800 text-white opacity-0 group-hover:opacity-100 z-10',
                    collapsed ? 'block' : 'hidden'
                  )}
                  aria-hidden="true"
                >
                  {item.label}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Menu Items */}
        <div className='pb-4'>
          {DASHBOARD_MENU_ITEM_BOTTOM.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className='relative group my-1 flex justify-center'
              aria-label={item.label}
            >
              <div
                className={cn(
                  'w-8 h-8 flex items-center justify-center rounded-md',
                  isActive(item.href)
                    ? 'bg-[#1e4a8e] text-white'
                    : 'text-gray-400 hover:bg-[#32435b]'
                )}
              >
                <div
                  className={isActive(item.href) ? 'text-white' : item.color}
                  aria-hidden="true"
                >
                  {item.icon}
                </div>
              </div>
              <div
                className={cn(
                  'absolute left-full top-1/2 -translate-y-1/2 whitespace-nowrap rounded px-2 py-1 text-sm bg-gray-800 text-white opacity-0 group-hover:opacity-100 z-10',
                  collapsed ? 'block' : 'hidden'
                )}
                aria-hidden="true"
              >
                {item.label}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Right Content Column */}
      {!collapsed && (
        <div className='flex flex-col h-full w-[200px]'>
          {/* Fixed Search Bar */}
          <div className='px-3 pt-3 pb-2 border-b border-[#2c3e50]'>
            <div className='relative'>
              <label htmlFor="sidebar-search" className="sr-only">Search menu items</label>
              <Search
                className='absolute left-2 top-2 text-gray-400'
                size={16}
                aria-hidden="true"
              />
              <input
                id="sidebar-search"
                type='text'
                placeholder='Search'
                className='w-full pl-8 pr-3 py-1.5 text-sm rounded-md bg-[#2c3e50] text-white border border-transparent focus:outline-none focus:border-blue-400'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search menu items"
              />
            </div>
          </div>

          {/* Scrollable Content */}
          <div className='flex-1 overflow-y-auto'>
            {isSettingsPage ? (
              // Settings Page Layout
              <div className='p-3'>
                <h2 className='text-sm font-medium text-gray-300 mb-3'>
                  Settings
                </h2>

                <div className='space-y-1'>
                  {SETTINGS_MENU_ITEMS.map((section) => (
                    <div key={section.label} className='mb-2'>
                      <button
                        aria-expanded={expandedSections[section.label]}
                        aria-controls={`section-${section.label}`}
                        className={cn(
                          'flex items-center justify-between w-full px-2 py-1.5 rounded-md cursor-pointer',
                          expandedSections[section.label]
                            ? 'bg-[#1e4a8e] text-white'
                            : 'text-gray-300 hover:bg-[#32435b]'
                        )}
                        onClick={() => toggleSection(section.label)}
                      >
                        <div className='flex items-center gap-2'>
                          <div
                            className={
                              expandedSections[section.label]
                                ? 'text-white'
                                : section.color || 'text-gray-400'
                            }
                            aria-hidden="true"
                          >
                            {section.icon}
                          </div>
                          <span className='text-sm'>{section.label}</span>
                        </div>
                        <ChevronDown
                          size={16}
                          className={cn(
                            'transition-transform',
                            expandedSections[section.label]
                              ? 'rotate-180 text-white'
                              : 'text-gray-400'
                          )}
                          aria-hidden="true"
                        />
                      </button>

                      {expandedSections[section.label] && (
                        <div
                          id={`section-${section.label}`}
                          className='ml-4 mt-1 pl-2 border-l border-gray-600 space-y-1'
                        >
                          {section.children.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              aria-current={isActive(item.href) ? 'page' : undefined}
                            >
                              <div
                                className={cn(
                                  'flex items-center gap-2 px-2 py-1.5 rounded-md text-sm',
                                  isActive(item.href)
                                    ? 'bg-[#1e4a8e] text-white'
                                    : 'text-gray-300 hover:bg-[#32435b]'
                                )}
                              >
                                <div
                                  className={
                                    isActive(item.href)
                                      ? 'text-white'
                                      : 'text-gray-400'
                                  }
                                  aria-hidden="true"
                                >
                                  {item.icon}
                                </div>
                                <span>{item.label}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Regular Page Layout
              <div className='p-3'>
                <h2 className='text-sm font-medium text-gray-300 mb-3'>
                  Module
                </h2>

                <nav aria-label="Main menu">
                  <ul className='space-y-1'>
                    {filteredModuleItems.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          aria-current={isActive(item.href) ? 'page' : undefined}
                        >
                          <div
                            className={cn(
                              'flex items-center gap-2 px-2 py-1.5 rounded-md text-sm',
                              isActive(item.href)
                                ? 'bg-[#1e4a8e] text-white'
                                : 'text-gray-300 hover:bg-[#32435b]'
                            )}
                          >
                            <div
                              className={
                                isActive(item.href) ? 'text-white' : item.color
                              }
                              aria-hidden="true"
                            >
                              {item.icon}
                            </div>
                            <span>{item.label}</span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
