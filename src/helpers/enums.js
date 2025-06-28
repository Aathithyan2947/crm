import {
  Activity,
  BellIcon,
  ListChecks,
  SignalHigh,
  FilesIcon,
  Settings,
  UserCircle,
  Users,
  Goal,
  UserCog,
  User2,
} from 'lucide-react';

export const AUTH_ROUTE = {
  LOGIN: '/auth/login',
};

export const DASHBOARD_ROUTES = {
  EMPLOYEES: '/dashboard/employees',
  PARTIES: '/dashboard/parties',
  ACTIVITIES: '/dashboard/activities',
};

export const SETTINGS_MODULE_ROUTES = {
  EMPLOYEES_GROUP: '/dashboard/settings/configurations/employees_group',
  ACTIVITY_TYPE: '/dashboard/settings/configurations/activity_type',
  ACTIVITY_PRIORITY: '/dashboard/settings/configurations/activity_priority',
  ACTIVITY_OUTCOME: '/dashboard/settings/configurations/activity_outcome',
  CUSTOMIZATIONS: '/dashboard/settings/customizations',
};

export const BOTTOM_DASHBOARD_ROUTES = {
  SETTINGS: '/dashboard/settings',
  PROFILE: '/dashboard/profile',
  ANNOUNCEMENT: '/dashboard/annoucement',
};

export const DASHBOARD_MENU_ITEMS = [
  {
    label: 'Employees',
    href: DASHBOARD_ROUTES.EMPLOYEES,
    icon: <User2 size={18} />,
    color: 'text-blue-400',
  },
  {
    label: 'Activities',
    href: DASHBOARD_ROUTES.ACTIVITIES,
    icon: <Activity size={18} />,
    color: 'text-pink-500',
  },
  {
    label: 'Parties',
    href: DASHBOARD_ROUTES.PARTIES,
    icon: <Users size={18} />,
    color: 'text-yellow-500', // Changed to a distinctive color
  },
];

export const DASHBOARD_MENU_ITEM_BOTTOM = [
  {
    label: 'Profile',
    href: BOTTOM_DASHBOARD_ROUTES.PROFILE,
    icon: <UserCircle size={18} />,
    color: 'text-purple-400',
  },
  {
    label: 'Announcement',
    href: BOTTOM_DASHBOARD_ROUTES.ANNOUNCEMENT,
    icon: <BellIcon size={18} />,
    color: 'text-orange-400',
  },
  {
    label: 'Settings',
    href: BOTTOM_DASHBOARD_ROUTES.SETTINGS,
    icon: <Settings size={18} />,
    color: 'text-gray-400',
  },
];

export const SETTINGS_MENU_ITEMS = [
  {
    label: 'Configurations',
    icon: <FilesIcon size={16} />,
    children: [
      {
        label: 'Employee Group',
        href: SETTINGS_MODULE_ROUTES.EMPLOYEES_GROUP,
        icon: <UserCog size={16} />,
      },
      {
        label: 'Activity Type',
        href: SETTINGS_MODULE_ROUTES.ACTIVITY_TYPE,
        icon: <ListChecks size={16} />,
      },
      {
        label: 'Activity Priority',
        href: SETTINGS_MODULE_ROUTES.ACTIVITY_PRIORITY,
        icon: <SignalHigh size={16} />,
      },
      {
        label: 'Activity Outcomes',
        href: SETTINGS_MODULE_ROUTES.ACTIVITY_OUTCOME,
        icon: <Goal size={16} />,
      },
    ],
  },
  {
    label: 'Customization',
    icon: <Settings size={18} />,
    children: [
      {
        label: 'Module Entities',
        href: SETTINGS_MODULE_ROUTES.CUSTOMIZATIONS,
        icon: <UserCog size={16} />,
      },
    ],
  },
];
