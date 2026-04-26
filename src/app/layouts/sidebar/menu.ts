import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [

  {
    id: 1,
    label: 'Home',
    icon: 'las la-tachometer-alt',
    isCollapsed: true,
    subItems: [
      {
        id: 2,
        label: 'Dashboard',
        link: '#',
        parentId: 1
      },
      {
        id: 3,
        label: 'Reports',
        link: '#',
        parentId: 1
      }
    ]
  },


  {
    id: 4,
    label: 'MENU.SERVICES',
    icon: 'las la-tachometer-alt',
    isCollapsed: true,
    subItems: [
      {
        id: 5,
        label: 'Schoole Education Qualtiy',
        link: '#',
        parentId: 4
      },
      {
        id: 6,
        label: 'High Education Qualtiy',
        link: '#',
        parentId: 4
      }
    ]
  },


  {
    id:7,
    label: 'School Education',
    icon: 'las la-tachometer-alt',
    isCollapsed: true,
    subItems: [
      {
        id:8,
        label: 'Dashbaord',
        link: '#',
        parentId: 7
      },
      {
        id: 9,
        label: 'Reports',
        link: '#',
        parentId: 7
      },
      {
        id: 10,
        label: 'Settings',
        link: '#',
        parentId: 7
      }
    ]
  },



  {
    id: 11,
    label: 'High Education',
    icon: 'las la-tachometer-alt',
    isCollapsed: true,
    subItems: [
      {
        id: 12,
        label: 'Dashbaord',
        link: '/jawda/analytics',
        parentId: 11
      },
      {
        id: 13,
        label: 'Reports',
        link: '/jawda/crm',
        parentId: 11
      },
      {
        id: 14,
        label: 'Settings',
        link: '/jawda/crm',
        parentId: 11
      }
    ]
  },
  
];
