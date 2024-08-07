import { SideNavInterface } from '../../interfaces/side-nav.type';
export const ROUTES: SideNavInterface[] = [
  {
    path: 'dashboard',
    title: 'Dashboard',
    // iconType: 'material',
    // iconTheme: 'outline',
    icon: 'assets/images/icons/dashboard',
    submenu: []
  },

  // {
  //   path: 'dashboard/content',
  //   title: 'Ai Content',
  //   iconType: 'material',
  //   iconTheme: 'outline',
  //   icon: 'bar-chart',
  //   submenu: []
  // },
  {
    path: '/tools',
    title: 'Tools',
    // iconType: 'material',
    // iconTheme: 'outline',
    icon: 'assets/images/icons/tools',
    submenu: []
  },
  {
    path: '/projects',
    title: 'Projects',
    // iconType: 'material',
    // iconTheme: 'outline',
    icon: 'assets/images/icons/projects',
    submenu: []
  },
  {
    path: '/documents',
    title: 'Documents',
    // iconType: 'material',
    // iconTheme: 'outline',
    icon: 'assets/images/icons/documents',
    submenu: []
  },
  {
    path: '/contents',
    title: 'Contents',
    // iconType: 'material',
    // iconTheme: 'outline',
    icon: 'assets/images/icons/edit',
    submenu: [
      {
        path: '/contents/favourites',
        title: 'Favourites',
        icon: 'assets/images/icons/favourites',
        submenu: [],
      },
      {
        path: '/contents/flagged',
        title: 'Flagged',
        icon: 'assets/images/icons/flag',
        submenu: [],
      },
    ],
    opened: true,
    addButton: true
  },
  {
    path: '/trash',
    title: 'Trash',
    // iconType: 'material',
    // iconTheme: 'outline',
    icon: 'assets/images/icons/trash-2',
    submenu: []
  },
  // {
  //   path: '',
  //   title: 'Project',
    // iconType: 'fontawesome',
  //   iconTheme: 'fas',
  //   icon: 'fa-circle',
  //   submenu: []
  // },
  // Sub menu demo
  // {
  //   path: '',
  //   title: 'Multi Level Menu',
  //   iconType: 'nzIcon',
  //   iconTheme: 'outline',
  //   icon: 'appstore',
  //   submenu: [
  //     {
  //       path: '',
  //       title: 'Level 1',
  //       iconType: '',
  //       icon: '',
  //       iconTheme: '',
  //       submenu: [
  //         {
  //           path: '',
  //           title: 'Level 2',
  //           iconType: 'nzIcon',
  //           iconTheme: 'outline',
  //           icon: '',
  //           submenu: []
  //         }
  //       ]
  //     }
  //   ]
  // }
]
