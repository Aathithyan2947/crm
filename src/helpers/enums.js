import { Home, ListChecks, Users } from 'lucide-react';

export const ROUTES = {
  EMPLOYEES: '/dashboard/employees',
  EMPLOYEES_GROUP: '/dashboard/employees_group',
  ACTIVITY_TYPE: '/dashboard/activity_type',
  ACTIVITY_PRIORITY: '/dashboard/activity_priority',
};

export const DASHBOARD_MENU_ITEMS = [
  // { label: 'Dashboard', icon: <Home className='size-5' />, href: '/' },
  {
    label: 'Employees',
    icon: <Users className='size-5' />,
    children: [
      { label: 'Employees List', href: ROUTES.EMPLOYEES },
      { label: 'Employees Group', href: ROUTES.EMPLOYEES_GROUP },
    ],
  },
  {
    label: 'Activity',
    icon: <ListChecks className='size-5' />,
    children: [
      { label: 'Activity Type', href: ROUTES.ACTIVITY_TYPE },
      { label: 'Activity Priority', href: ROUTES.ACTIVITY_PRIORITY },
    ],
  },
];
