import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: 'MENUITEMS.MENU.TEXT',
    isTitle: true
  },
  {
    id: 2,
    label: 'MENUITEMS.DASHBOARD.TEXT',
    collapseid: 'sidebarDashboards',
    icon: 'home',
    subItems: [
      {
        id: 3,
        label: 'MENUITEMS.DASHBOARD.LIST.ANALYTICS',
        link: '/jawda/analytics',
        parentId: 2
      },
      {
        id: 4,
        label: 'MENUITEMS.DASHBOARD.LIST.CRM',
        link: '/jawda/crm',
        parentId: 2
      },
      {
        id: 5,
        label: 'MENUITEMS.DASHBOARD.LIST.ECOMMERCE',
        link: '/jawda',
        parentId: 2
      },
      {
        id: 6,
        label: 'MENUITEMS.DASHBOARD.LIST.CRYPTO',
        link: '/jawda/crypto',
        parentId: 2
      },
      {
        id: 7,
        label: 'MENUITEMS.DASHBOARD.LIST.PROJECTS',
        link: '/jawda/projects',
        parentId: 2
      },
      {
        id: 7,
        label: 'MENUITEMS.DASHBOARD.LIST.NFT',
        link: '/jawda/nft',
        parentId: 2
      },
      {
        id: 8,
        label: 'MENUITEMS.DASHBOARD.LIST.JOB',
        link: '/jawda/job',
        parentId: 2,
      },
      {
        id: 9,
        label: 'MENUITEMS.PAGES.LIST.BLOG',
        link: '/jawda/dashboard-blog',
        parentId: 2,
      }
    ]
  },
  {
    id: 8,
    label: 'MENUITEMS.APPS.TEXT',
    collapseid: 'sidebarApps',
    icon: 'grid',
    subItems: [
      {
        id: 9,
        label: 'MENUITEMS.APPS.LIST.CALENDAR',
        link: '/jawda/calendar',
        parentId: 8,
        subItems: [
          {
            id: 9,
            label: 'MENUITEMS.APPS.LIST.MAINCALENDAR',
            link: '/jawda/calendar',
          },
          {
            id: 9,
            label: 'MENUITEMS.APPS.LIST.MONTHGRID',
            link: '/jawda/month-grid',
          }
        ]
      },
      {
        id: 10,
        label: 'MENUITEMS.APPS.LIST.CHAT',
        link: '/jawda/chat',
        parentId: 8
      },
      {
        id: 11,
        label: 'MENUITEMS.APPS.LIST.EMAIL',
        parentId: 8,
        subItems: [
          {
            id: 13,
            label: 'MENUITEMS.APPS.LIST.MAILBOX',
            link: '/jawda/mailbox',
            parentId: 11
          },
          {
            id: 14,
            label: 'MENUITEMS.APPS.LIST.MAILTEMPLATES',
            parentId: 11,
            subItems: [
              {
                id: 13,
                label: 'MENUITEMS.APPS.LIST.BASICACTION',
                link: '/jawda/email-basic',
                parentId: 14
              },
              {
                id: 13,
                label: 'MENUITEMS.APPS.LIST.ECOMMERCEACTION',
                link: '/jawda/email-ecommerce',
                parentId: 14
              },
            ]
          }
        ]
      },
      {
        id: 12,
        label: 'MENUITEMS.APPS.LIST.ECOMMERCE',
        link: '/jawda/mailbox',
        parentId: 8,
        collapseid: 'ecommerce',
        subItems: [
          {
            id: 13,
            label: 'MENUITEMS.APPS.LIST.PRODUCTS',
            link: '/jawda/ecommerce/products',
            parentId: 12
          },
          {
            id: 14,
            label: 'MENUITEMS.APPS.LIST.PRODUCTDETAILS',
            link: '/jawda/ecommerce/product-detail/1',
            parentId: 12
          },
          {
            id: 15,
            label: 'MENUITEMS.APPS.LIST.CREATEPRODUCT',
            link: '/jawda/ecommerce/add-product',
            parentId: 12
          },
          {
            id: 16,
            label: 'MENUITEMS.APPS.LIST.ORDERS',
            link: '/jawda/ecommerce/orders',
            parentId: 12
          },
          {
            id: 17,
            label: 'MENUITEMS.APPS.LIST.ORDERDETAILS',
            link: '/jawda/ecommerce/order-details',
            parentId: 12
          },
          {
            id: 18,
            label: 'MENUITEMS.APPS.LIST.CUSTOMERS',
            link: '/jawda/ecommerce/customers',
            parentId: 12
          },
          {
            id: 19,
            label: 'MENUITEMS.APPS.LIST.SHOPPINGCART',
            link: '/jawda/ecommerce/cart',
            parentId: 12
          },
          {
            id: 20,
            label: 'MENUITEMS.APPS.LIST.CHECKOUT',
            link: '/jawda/ecommerce/checkout',
            parentId: 12
          },
          {
            id: 21,
            label: 'MENUITEMS.APPS.LIST.SELLERS',
            link: '/jawda/ecommerce/sellers',
            parentId: 12
          },
          {
            id: 22,
            label: 'MENUITEMS.APPS.LIST.SELLERDETAILS',
            link: '/jawda/ecommerce/seller-details',
            parentId: 12
          }
        ]
      },
      {
        id: 23,
        label: 'MENUITEMS.APPS.LIST.PROJECTS',
        parentId: 8,
        subItems: [
          {
            id: 24,
            label: 'MENUITEMS.APPS.LIST.LIST',
            link: '/jawda/projects/list',
            parentId: 23
          },
          {
            id: 25,
            label: 'MENUITEMS.APPS.LIST.OVERVIEW',
            link: '/jawda/projects/overview',
            parentId: 23
          },
          {
            id: 26,
            label: 'MENUITEMS.APPS.LIST.CREATEPROJECT',
            link: '/jawda/projects/create',
            parentId: 23
          }
        ]
      },
      {
        id: 27,
        label: 'MENUITEMS.APPS.LIST.TASK',
        parentId: 8,
        subItems: [
          {
            id: 28,
            label: 'MENUITEMS.APPS.LIST.KANBANBOARD',
            link: '/jawda/tasks/kanban',
            parentId: 27
          },
          {
            id: 29,
            label: 'MENUITEMS.APPS.LIST.LISTVIEW',
            link: '/jawda/tasks/list-view',
            parentId: 27
          },
          {
            id: 30,
            label: 'MENUITEMS.APPS.LIST.TASKDETAILS',
            link: '/jawda/tasks/details',
            parentId: 27
          }
        ]
      },
      {
        id: 31,
        label: 'MENUITEMS.APPS.LIST.CRM',
        parentId: 8,
        subItems: [
          {
            id: 32,
            label: 'MENUITEMS.APPS.LIST.CONTACTS',
            link: '/jawda/crm/contacts',
            parentId: 31
          },
          {
            id: 33,
            label: 'MENUITEMS.APPS.LIST.COMPANIES',
            link: '/jawda/crm/companies',
            parentId: 31
          },
          {
            id: 34,
            label: 'MENUITEMS.APPS.LIST.DEALS',
            link: '/jawda/crm/deals',
            parentId: 31
          },
          {
            id: 35,
            label: 'MENUITEMS.APPS.LIST.LEADS',
            link: '/jawda/crm/leads',
            parentId: 31
          }
        ]
      },
      {
        id: 36,
        label: 'MENUITEMS.APPS.LIST.CRYPTO',
        parentId: 8,
        subItems: [
          {
            id: 37,
            label: 'MENUITEMS.APPS.LIST.TRANSACTIONS',
            link: '/jawda/crypto/transactions',
            parentId: 36
          },
          {
            id: 38,
            label: 'MENUITEMS.APPS.LIST.BUY&SELL',
            link: '/jawda/crypto/buy-sell',
            parentId: 36
          },
          {
            id: 38,
            label: 'MENUITEMS.APPS.LIST.ORDERS',
            link: '/jawda/crypto/orders',
            parentId: 36
          },
          {
            id: 39,
            label: 'MENUITEMS.APPS.LIST.MYWALLET',
            link: '/jawda/crypto/wallet',
            parentId: 36
          },
          {
            id: 40,
            label: 'MENUITEMS.APPS.LIST.ICOLIST',
            link: '/jawda/crypto/ico',
            parentId: 36
          },
          {
            id: 41,
            label: 'MENUITEMS.APPS.LIST.KYCAPPLICATION',
            link: '/jawda/crypto/kyc',
            parentId: 36
          }
        ]
      },
      {
        id: 42,
        label: 'MENUITEMS.APPS.LIST.INVOICES',
        parentId: 8,
        subItems: [
          {
            id: 43,
            label: 'MENUITEMS.APPS.LIST.LISTVIEW',
            link: '/jawda/invoices/list',
            parentId: 42
          },
          {
            id: 44,
            label: 'MENUITEMS.APPS.LIST.DETAILS',
            link: '/jawda/invoices/details',
            parentId: 42
          },
          {
            id: 45,
            label: 'MENUITEMS.APPS.LIST.CREATEINVOICE',
            link: '/jawda/invoices/create',
            parentId: 42
          }
        ]
      },
      {
        id: 46,
        label: 'MENUITEMS.APPS.LIST.SUPPORTTICKETS',
        parentId: 8,
        subItems: [
          {
            id: 47,
            label: 'MENUITEMS.APPS.LIST.LISTVIEW',
            link: '/jawda/tickets/list',
            parentId: 46
          },
          {
            id: 48,
            label: 'MENUITEMS.APPS.LIST.TICKETDETAILS',
            link: '/jawda/tickets/details',
            parentId: 46
          }
        ]
      },
      {
        id: 46,
        label: 'MENUITEMS.APPS.LIST.NFTMARKETPLACE',
        parentId: 8,
        subItems: [
          {
            id: 47,
            label: 'MENUITEMS.APPS.LIST.MARKETPLACE',
            link: '/jawda/marletplace/marketplace',
            parentId: 46
          },
          {
            id: 48,
            label: 'MENUITEMS.APPS.LIST.EXPLORENOW',
            link: '/jawda/marletplace/explore',
            parentId: 46
          },
          {
            id: 48,
            label: 'MENUITEMS.APPS.LIST.LIVEAUCTION',
            link: '/jawda/marletplace/auction',
            parentId: 46
          },
          {
            id: 48,
            label: 'MENUITEMS.APPS.LIST.ITEMDETAILS',
            link: '/jawda/marletplace/item-details',
            parentId: 46
          },
          {
            id: 48,
            label: 'MENUITEMS.APPS.LIST.COLLECTIONS',
            link: '/jawda/marletplace/collections',
            parentId: 46
          },
          {
            id: 48,
            label: 'MENUITEMS.APPS.LIST.CREATORS',
            link: '/jawda/marletplace/creators',
            parentId: 46
          },
          {
            id: 48,
            label: 'MENUITEMS.APPS.LIST.RANKING',
            link: '/jawda/marletplace/raking',
            parentId: 46
          },
          {
            id: 48,
            label: 'MENUITEMS.APPS.LIST.WALLETCONNECT',
            link: '/jawda/marletplace/wallet',
            parentId: 46
          },
          {
            id: 48,
            label: 'MENUITEMS.APPS.LIST.CREATENFT',
            link: '/jawda/marletplace/create',
            parentId: 46
          },
        ]
      },
      {
        id: 49,
        label: 'MENUITEMS.APPS.LIST.FILEMANAGER',
        link: '/file-manager',
        parentId: 8,
      },
      {
        id: 50,
        label: 'MENUITEMS.APPS.LIST.TODO',
        link: '/todo',
        parentId: 8,
      },
      {
        id: 51,
        label: 'MENUITEMS.APPS.LIST.JOBS',
        parentId: 8,
        subItems: [
          {
            id: 52,
            label: 'MENUITEMS.APPS.LIST.STATISTICS',
            link: '/jawda/jobs/statistics',
            parentId: 51
          },
          {
            id: 53,
            label: 'MENUITEMS.APPS.LIST.JOBLISTS',
            subItems: [
              {
                id: 54,
                label: 'MENUITEMS.APPS.LIST.LIST',
                link: '/jawda/jobs/list',
                parentId: 53
              },
              {
                id: 55,
                label: 'MENUITEMS.APPS.LIST.GRID',
                link: '/jawda/jobs/grid',
                parentId: 53
              },
              {
                id: 56,
                label: 'MENUITEMS.APPS.LIST.OVERVIEW',
                link: '/jawda/jobs/overview',
                parentId: 53
              }
            ]
          },
          {
            id: 57,
            label: 'MENUITEMS.APPS.LIST.CANDIDATELISTS',
            subItems: [
              {
                id: 58,
                label: 'MENUITEMS.APPS.LIST.LISTVIEW',
                link: '/jawda/jobs/listview',
                parentId: 57
              },
              {
                id: 59,
                label: 'MENUITEMS.APPS.LIST.GRIDVIEW',
                link: '/jawda/jobs/gridview',
                parentId: 57
              }
            ]
          },
          {
            id: 60,
            label: 'MENUITEMS.APPS.LIST.APPLICATION',
            link: '/jawda/jobs/application',
            parentId: 51
          },
          {
            id: 61,
            label: 'MENUITEMS.APPS.LIST.NEWJOB',
            link: '/jawda/jobs/newjob',
            parentId: 51
          },
          {
            id: 62,
            label: 'MENUITEMS.APPS.LIST.COMPANIESLIST',
            link: '/jawda/jobs/companies-list',
            parentId: 51
          },
          {
            id: 63,
            label: 'MENUITEMS.APPS.LIST.JOBCATEGORIES',
            link: '/jawda/jobs/job-categories',
            parentId: 51
          },
        ]
      },
      {
        id: 64,
        label: 'MENUITEMS.APPS.LIST.APIKEY',
        link: '/apikey',
        parentId: 8,
      },
    ]
  },
  {
    id: 54,
    label: 'MENUITEMS.PAGES.TEXT',
    isTitle: true
  },
  {
    id: 55,
    label: 'MENUITEMS.AUTHENTICATION.TEXT',
    collapseid: 'sidebarAuth',
    icon: 'users',
    subItems: [
      {
        id: 56,
        label: 'MENUITEMS.AUTHENTICATION.LIST.SIGNIN',
        parentId: 49,
        subItems: [
          {
            id: 57,
            label: 'MENUITEMS.AUTHENTICATION.LIST.BASIC',
            link: '/auth/signin/basic',
            parentId: 56
          },
          {
            id: 58,
            label: 'MENUITEMS.AUTHENTICATION.LIST.COVER',
            link: '/auth/signin/cover',
            parentId: 56
          },
        ]
      },
      {
        id: 59,
        label: 'MENUITEMS.AUTHENTICATION.LIST.SIGNUP',
        parentId: 49,
        subItems: [
          {
            id: 60,
            label: 'MENUITEMS.AUTHENTICATION.LIST.BASIC',
            link: '/auth/signup/basic',
            parentId: 59
          },
          {
            id: 61,
            label: 'MENUITEMS.AUTHENTICATION.LIST.COVER',
            link: '/auth/signup/cover',
            parentId: 59
          },
        ]
      },
      {
        id: 62,
        label: 'MENUITEMS.AUTHENTICATION.LIST.PASSWORDRESET',
        parentId: 49,
        subItems: [
          {
            id: 63,
            label: 'MENUITEMS.AUTHENTICATION.LIST.BASIC',
            link: '/auth/pass-reset/basic',
            parentId: 62
          },
          {
            id: 64,
            label: 'MENUITEMS.AUTHENTICATION.LIST.COVER',
            link: '/auth/pass-reset/cover',
            parentId: 62
          },
        ]
      },
      {
        id: 62,
        label: 'MENUITEMS.AUTHENTICATION.LIST.PASSWORDCREATE',
        parentId: 49,
        subItems: [
          {
            id: 63,
            label: 'MENUITEMS.AUTHENTICATION.LIST.BASIC',
            link: '/auth/pass-create/basic',
            parentId: 62
          },
          {
            id: 64,
            label: 'MENUITEMS.AUTHENTICATION.LIST.COVER',
            link: '/auth/pass-create/cover',
            parentId: 62
          },
        ]
      },
      {
        id: 65,
        label: 'MENUITEMS.AUTHENTICATION.LIST.LOCKSCREEN',
        parentId: 49,
        subItems: [
          {
            id: 66,
            label: 'MENUITEMS.AUTHENTICATION.LIST.BASIC',
            link: '/auth/lockscreen/basic',
            parentId: 65
          },
          {
            id: 67,
            label: 'MENUITEMS.AUTHENTICATION.LIST.COVER',
            link: '/auth/lockscreen/cover',
            parentId: 65
          },
        ]
      },
      {
        id: 68,
        label: 'MENUITEMS.AUTHENTICATION.LIST.LOGOUT',
        parentId: 49,
        subItems: [
          {
            id: 69,
            label: 'MENUITEMS.AUTHENTICATION.LIST.BASIC',
            link: '/auth/logout/basic',
            parentId: 68
          },
          {
            id: 70,
            label: 'MENUITEMS.AUTHENTICATION.LIST.COVER',
            link: '/auth/logout/cover',
            parentId: 68
          },
        ]
      },
      {
        id: 71,
        label: 'MENUITEMS.AUTHENTICATION.LIST.SUCCESSMESSAGE',
        parentId: 49,
        subItems: [
          {
            id: 72,
            label: 'MENUITEMS.AUTHENTICATION.LIST.BASIC',
            link: '/auth/success-msg/basic',
            parentId: 71
          },
          {
            id: 73,
            label: 'MENUITEMS.AUTHENTICATION.LIST.COVER',
            link: '/auth/success-msg/cover',
            parentId: 71
          },
        ]
      },
      {
        id: 74,
        label: 'MENUITEMS.AUTHENTICATION.LIST.TWOSTEPVERIFICATION',
        parentId: 49,
        subItems: [
          {
            id: 75,
            label: 'MENUITEMS.AUTHENTICATION.LIST.BASIC',
            link: '/auth/twostep/basic',
            parentId: 74
          },
          {
            id: 76,
            label: 'MENUITEMS.AUTHENTICATION.LIST.COVER',
            link: '/auth/twostep/cover',
            parentId: 74
          },
        ]
      },
      {
        id: 77,
        label: 'MENUITEMS.AUTHENTICATION.LIST.ERRORS',
        parentId: 49,
        subItems: [
          {
            id: 78,
            label: 'MENUITEMS.AUTHENTICATION.LIST.404BASIC',
            link: '/auth/errors/404-basic',
            parentId: 77
          },
          {
            id: 79,
            label: 'MENUITEMS.AUTHENTICATION.LIST.404COVER',
            link: '/auth/errors/404-cover',
            parentId: 77
          },
          {
            id: 80,
            label: 'MENUITEMS.AUTHENTICATION.LIST.404ALT',
            link: '/auth/errors/404-alt',
            parentId: 77
          },
          {
            id: 81,
            label: 'MENUITEMS.AUTHENTICATION.LIST.500',
            link: '/auth/errors/page-500',
            parentId: 77
          },
          {
            id: 81,
            label: 'MENUITEMS.AUTHENTICATION.LIST.OFFLINE',
            link: '/auth/errors/offline',
            parentId: 77
          },
        ]
      },
    ]
  },
  {
    id: 82,
    label: 'MENUITEMS.PAGES.TEXT',
    icon: 'command',
    collapseid: 'sidebarPages',
    subItems: [
      {
        id: 83,
        label: 'MENUITEMS.PAGES.LIST.STARTER',
        link: '/jawda/pages/starter',
        parentId: 82
      },
      {
        id: 84,
        label: 'MENUITEMS.PAGES.LIST.PROFILE',
        parentId: 82,
        subItems: [
          {
            id: 85,
            label: 'MENUITEMS.PAGES.LIST.SIMPLEPAGE',
            link: '/jawda/pages/profile',
            parentId: 84
          },
          {
            id: 86,
            label: 'MENUITEMS.PAGES.LIST.SETTINGS',
            link: '/jawda/pages/profile-setting',
            parentId: 84
          },
        ]
      },
      {
        id: 87,
        label: 'MENUITEMS.PAGES.LIST.TEAM',
        link: '/jawda/pages/team',
        parentId: 82
      },
      {
        id: 88,
        label: 'MENUITEMS.PAGES.LIST.TIMELINE',
        link: '/jawda/pages/timeline',
        parentId: 82
      },
      {
        id: 89,
        label: 'MENUITEMS.PAGES.LIST.FAQS',
        link: '/jawda/pages/faqs',
        parentId: 82
      },
      {
        id: 90,
        label: 'MENUITEMS.PAGES.LIST.PRICING',
        link: '/jawda/pages/pricing',
        parentId: 82
      },
      {
        id: 91,
        label: 'MENUITEMS.PAGES.LIST.GALLERY',
        link: '/jawda/pages/gallery',
        parentId: 82
      },
      {
        id: 92,
        label: 'MENUITEMS.PAGES.LIST.MAINTENANCE',
        link: '/jawda/pages/maintenance',
        parentId: 82
      },
      {
        id: 93,
        label: 'MENUITEMS.PAGES.LIST.COMINGSOON',
        link: '/jawda/pages/coming-soon',
        parentId: 82
      },
      {
        id: 94,
        label: 'MENUITEMS.PAGES.LIST.SITEMAP',
        link: '/jawda/pages/sitemap',
        parentId: 82
      },
      {
        id: 95,
        label: 'MENUITEMS.PAGES.LIST.SEARCHRESULTS',
        link: '/jawda/pages/search-results',
        parentId: 82
      },
      {
        id: 96,
        label: 'MENUITEMS.PAGES.LIST.PRIVACYPOLICY',
        link: '/jawda/pages/privacy-policy',
        parentId: 82
      },
      {
        id: 97,
        label: 'MENUITEMS.PAGES.LIST.TERMS&CONDITIONS',
        link: '/jawda/pages/terms-condition',
        parentId: 82
      },
      {
        id: 98,
        label: 'MENUITEMS.PAGES.LIST.BLOG',
        subItems: [
          {
            id: 85,
            label: 'MENUITEMS.PAGES.LIST.BLOGLIST',
            link: '/jawda/pages/pages-blog-list',
            parentId: 84
          },
          {
            id: 85,
            label: 'MENUITEMS.PAGES.LIST.BLOGGRID',
            link: '/jawda/pages/pages-blog-grid',
            parentId: 84
          },
          {
            id: 85,
            label: 'MENUITEMS.PAGES.LIST.BLOGOVERVIEW',
            link: '/jawda/pages/pages-blog-overview',
            parentId: 84
          }
        ]
      }
    ]
  },
  {
    id: 131,
    label: 'MENUITEMS.LANDING.TEXT',
    collapseid: 'sidebarUI',
    icon: 'airplay',
    subItems: [
      {
        id: 85,
        label: 'MENUITEMS.LANDING.LIST.ONEPAGE',
        link: '/landing',
        parentId: 84
      },
      {
        id: 86,
        label: 'MENUITEMS.LANDING.LIST.NFTLANDING',
        link: '/landing/nft',
        parentId: 84
      },
      {
        id: 87,
        label: 'MENUITEMS.LANDING.LIST.JOB',
        link: '/landing/job',
        parentId: 84,
      },
    ]
  },
  {
    id: 96,
    label: 'MENUITEMS.COMPONENTS.TEXT',
    isTitle: true
  },
  {
    id: 97,
    label: 'MENUITEMS.BASEUI.TEXT',
    collapseid: 'sidebarBasicUI',
    icon: 'package',
    subItems: [
      {
        id: 98,
        label: 'MENUITEMS.BASEUI.LIST.ALERTS',
        link: '/jawda/ui/alerts',
        parentId: 97
      },
      {
        id: 99,
        label: 'MENUITEMS.BASEUI.LIST.BADGES',
        link: '/jawda/ui/badges',
        parentId: 97
      },
      {
        id: 100,
        label: 'MENUITEMS.BASEUI.LIST.BUTTONS',
        link: '/jawda/ui/buttons',
        parentId: 97
      },
      {
        id: 101,
        label: 'MENUITEMS.BASEUI.LIST.COLORS',
        link: '/jawda/ui/colors',
        parentId: 97
      },
      {
        id: 102,
        label: 'MENUITEMS.BASEUI.LIST.CARDS',
        link: '/jawda/ui/cards',
        parentId: 97
      },
      {
        id: 103,
        label: 'MENUITEMS.BASEUI.LIST.CAROUSEL',
        link: '/jawda/ui/carousel',
        parentId: 97
      },
      {
        id: 104,
        label: 'MENUITEMS.BASEUI.LIST.DROPDOWNS',
        link: '/jawda/ui/dropdowns',
        parentId: 97
      },
      {
        id: 105,
        label: 'MENUITEMS.BASEUI.LIST.GRID',
        link: '/jawda/ui/grid',
        parentId: 97
      },
      {
        id: 106,
        label: 'MENUITEMS.BASEUI.LIST.IMAGES',
        link: '/jawda/ui/images',
        parentId: 97
      },
      {
        id: 107,
        label: 'MENUITEMS.BASEUI.LIST.TABS',
        link: '/jawda/ui/tabs',
        parentId: 97
      },
      {
        id: 108,
        label: 'MENUITEMS.BASEUI.LIST.ACCORDION&COLLAPSE',
        link: '/jawda/ui/accordions',
        parentId: 97
      },
      {
        id: 109,
        label: 'MENUITEMS.BASEUI.LIST.MODALS',
        link: '/jawda/ui/modals',
        parentId: 97
      },
      {
        id: 111,
        label: 'MENUITEMS.BASEUI.LIST.PLACEHOLDERS',
        link: '/jawda/ui/placeholder',
        parentId: 97
      },
      {
        id: 112,
        label: 'MENUITEMS.BASEUI.LIST.PROGRESS',
        link: '/jawda/ui/progress',
        parentId: 97
      },
      {
        id: 113,
        label: 'MENUITEMS.BASEUI.LIST.NOTIFICATIONS',
        link: '/jawda/ui/notifications',
        parentId: 97
      },
      {
        id: 114,
        label: 'MENUITEMS.BASEUI.LIST.MEDIAOBJECT',
        link: '/jawda/ui/media',
        parentId: 97
      },
      {
        id: 115,
        label: 'MENUITEMS.BASEUI.LIST.EMBEDVIDEO',
        link: '/jawda/ui/video',
        parentId: 97
      },
      {
        id: 116,
        label: 'MENUITEMS.BASEUI.LIST.TYPOGRAPHY',
        link: '/jawda/ui/typography',
        parentId: 97
      },
      {
        id: 117,
        label: 'MENUITEMS.BASEUI.LIST.LISTS',
        link: '/jawda/ui/list',
        parentId: 97
      },
      {
        id: 117,
        label: 'MENUITEMS.BASEUI.LIST.LINKS',
        link: '/jawda/ui/links',
        badge: {
          variant: 'bg-success',
          text: 'MENUITEMS.DASHBOARD.BADGE',
        },
        parentId: 97
      },
      {
        id: 118,
        label: 'MENUITEMS.BASEUI.LIST.GENERAL',
        link: '/jawda/ui/general',
        parentId: 97
      },
      {
        id: 119,
        label: 'MENUITEMS.BASEUI.LIST.RIBBONS',
        link: '/jawda/ui/ribbons',
        parentId: 97
      },
      {
        id: 120,
        label: 'MENUITEMS.BASEUI.LIST.UTILITIES',
        link: '/jawda/ui/utilities',
        parentId: 97
      }
    ]
  },
  {
    id: 121,
    label: 'MENUITEMS.ADVANCEUI.TEXT',
    icon: 'layers',
    collapseid: 'sidebarAdvanceUI',
    badge: {
      variant: 'bg-success',
      text: 'MENUITEMS.ADVANCEUI.BADGE',
    },
    subItems: [
      {
        id: 122,
        label: 'MENUITEMS.ADVANCEUI.LIST.SWEETALERTS',
        link: '/jawda/advance-ui/sweetalerts',
        parentId: 121
      },
      {
        id: 124,
        label: 'MENUITEMS.ADVANCEUI.LIST.SCROLLBAR',
        link: '/jawda/advance-ui/scrollbar',
        parentId: 121
      },
      {
        id: 126,
        label: 'MENUITEMS.ADVANCEUI.LIST.TOUR',
        link: '/jawda/advance-ui/tour',
        parentId: 121
      },
      {
        id: 127,
        label: 'MENUITEMS.ADVANCEUI.LIST.SWIPERSLIDER',
        link: '/jawda/advance-ui/swiper',
        parentId: 121
      },
      {
        id: 128,
        label: 'MENUITEMS.ADVANCEUI.LIST.RATTINGS',
        link: '/jawda/advance-ui/ratings',
        parentId: 121
      },
      {
        id: 129,
        label: 'MENUITEMS.ADVANCEUI.LIST.HIGHLIGHT',
        link: '/jawda/advance-ui/highlight',
        parentId: 121
      },
      {
        id: 130,
        label: 'MENUITEMS.ADVANCEUI.LIST.SCROLLSPY',
        link: '/jawda/advance-ui/scrollspy',
        parentId: 121
      }
    ]
  },
  {
    id: 131,
    label: 'MENUITEMS.WIDGETS.TEXT',
    icon: 'copy',
    link: '/jawda/widgets'
  },
  {
    id: 132,
    label: 'MENUITEMS.FORMS.TEXT',
    icon: 'file-text',
    collapseid: 'sidebarForms',
    subItems: [
      {
        id: 133,
        label: 'MENUITEMS.FORMS.LIST.BASICELEMENTS',
        link: '/jawda/forms/basic',
        parentId: 132
      },
      {
        id: 134,
        label: 'MENUITEMS.FORMS.LIST.FORMSELECT',
        link: '/jawda/forms/select',
        parentId: 132
      },
      {
        id: 135,
        label: 'MENUITEMS.FORMS.LIST.CHECKBOXS&RADIOS',
        link: '/jawda/forms/checkboxs-radios',
        parentId: 132
      },
      {
        id: 136,
        label: 'MENUITEMS.FORMS.LIST.PICKERS',
        link: '/jawda/forms/pickers',
        parentId: 132
      },
      {
        id: 137,
        label: 'MENUITEMS.FORMS.LIST.INPUTMASKS',
        link: '/jawda/forms/masks',
        parentId: 132
      },
      {
        id: 138,
        label: 'MENUITEMS.FORMS.LIST.ADVANCED',
        link: '/jawda/forms/advanced',
        parentId: 132
      },
      {
        id: 139,
        label: 'MENUITEMS.FORMS.LIST.RANGESLIDER',
        link: '/jawda/forms/range-sliders',
        parentId: 132
      },
      {
        id: 140,
        label: 'MENUITEMS.FORMS.LIST.VALIDATION',
        link: '/jawda/forms/validation',
        parentId: 132
      },
      {
        id: 141,
        label: 'MENUITEMS.FORMS.LIST.WIZARD',
        link: '/jawda/forms/wizard',
        parentId: 132
      },
      {
        id: 142,
        label: 'MENUITEMS.FORMS.LIST.EDITORS',
        link: '/jawda/forms/editors',
        parentId: 132
      },
      {
        id: 143,
        label: 'MENUITEMS.FORMS.LIST.FILEUPLOADS',
        link: '/jawda/forms/file-uploads',
        parentId: 132
      },
      {
        id: 144,
        label: 'MENUITEMS.FORMS.LIST.FORMLAYOUTS',
        link: '/jawda/forms/layouts',
        parentId: 132
      }
    ]
  },
  {
    id: 145,
    label: 'MENUITEMS.TABLES.TEXT',
    collapseid: 'sidebarTables',
    icon: 'database',
    subItems: [
      {
        id: 146,
        label: 'MENUITEMS.TABLES.LIST.BASICTABLES',
        link: '/jawda/tables/basic',
        parentId: 145
      },
      {
        id: 147,
        label: 'MENUITEMS.TABLES.LIST.GRIDJS',
        link: '/jawda/tables/gridjs',
        parentId: 145
      },
      {
        id: 148,
        label: 'MENUITEMS.TABLES.LIST.LISTJS',
        link: '/jawda/tables/listjs',
        parentId: 145
      }
    ]
  },
  {
    id: 149,
    label: 'MENUITEMS.CHARTS.TEXT',
    collapseid: 'sidebarCharts',
    icon: 'pie-chart',
    subItems: [
      {
        id: 150,
        label: 'MENUITEMS.CHARTS.LIST.APEXCHARTS',
        parentId: 149,
        subItems: [
          {
            id: 151,
            label: 'MENUITEMS.CHARTS.LIST.LINE',
            link: '/jawda/charts/apex-line',
            parentId: 150
          },
          {
            id: 152,
            label: 'MENUITEMS.CHARTS.LIST.AREA',
            link: '/jawda/charts/apex-area',
            parentId: 150
          },
          {
            id: 153,
            label: 'MENUITEMS.CHARTS.LIST.COLUMN',
            link: '/jawda/charts/apex-column',
            parentId: 150
          },
          {
            id: 154,
            label: 'MENUITEMS.CHARTS.LIST.BAR',
            link: '/jawda/charts/apex-bar',
            parentId: 150
          },
          {
            id: 155,
            label: 'MENUITEMS.CHARTS.LIST.MIXED',
            link: '/jawda/charts/apex-mixed',
            parentId: 150
          },
          {
            id: 156,
            label: 'MENUITEMS.CHARTS.LIST.TIMELINE',
            link: '/jawda/charts/apex-timeline',
            parentId: 150
          },
          {
            id: 157,
            label: 'MENUITEMS.CHARTS.LIST.RANGEAREA',
            link: '/jawda/charts/range-area',
            badge: {
              variant: 'bg-success',
              text: 'MENUITEMS.DASHBOARD.BADGE',
            },
            parentId: 150
          },
          {
            id: 157,
            label: 'MENUITEMS.CHARTS.LIST.FUNNEL',
            link: '/jawda/charts/funnel',
            badge: {
              variant: 'bg-success',
              text: 'MENUITEMS.DASHBOARD.BADGE',
            },
            parentId: 150
          },
          {
            id: 157,
            label: 'MENUITEMS.CHARTS.LIST.CANDLSTICK',
            link: '/jawda/charts/apex-candlestick',
            parentId: 150
          },
          {
            id: 158,
            label: 'MENUITEMS.CHARTS.LIST.BOXPLOT',
            link: '/jawda/charts/apex-boxplot',
            parentId: 150
          },
          {
            id: 159,
            label: 'MENUITEMS.CHARTS.LIST.BUBBLE',
            link: '/jawda/charts/apex-bubble',
            parentId: 150
          },
          {
            id: 160,
            label: 'MENUITEMS.CHARTS.LIST.SCATTER',
            link: '/jawda/charts/apex-scatter',
            parentId: 150
          },
          {
            id: 161,
            label: 'MENUITEMS.CHARTS.LIST.HEATMAP',
            link: '/jawda/charts/apex-heatmap',
            parentId: 150
          },
          {
            id: 162,
            label: 'MENUITEMS.CHARTS.LIST.TREEMAP',
            link: '/jawda/charts/apex-treemap',
            parentId: 150
          },
          {
            id: 163,
            label: 'MENUITEMS.CHARTS.LIST.PIE',
            link: '/jawda/charts/apex-pie',
            parentId: 150
          },
          {
            id: 164,
            label: 'MENUITEMS.CHARTS.LIST.RADIALBAR',
            link: '/jawda/charts/apex-radialbar',
            parentId: 150
          },
          {
            id: 165,
            label: 'MENUITEMS.CHARTS.LIST.RADAR',
            link: '/jawda/charts/apex-radar',
            parentId: 150
          },
          {
            id: 166,
            label: 'MENUITEMS.CHARTS.LIST.POLARAREA',
            link: '/jawda/charts/apex-polar',
            parentId: 150
          },
          {
            id: 168,
            label: 'MENUITEMS.CHARTS.LIST.SLOPE',
            link: '/jawda/charts/slope',
            badge: {
              variant: 'bg-success',
              text: 'MENUITEMS.DASHBOARD.BADGE',
            },
            parentId: 150
          },
        ]
      },
      {
        id: 167,
        label: 'MENUITEMS.CHARTS.LIST.CHARTJS',
        link: '/jawda/charts/chartjs',
        parentId: 149
      },
      {
        id: 168,
        label: 'MENUITEMS.CHARTS.LIST.ECHARTS',
        link: '/jawda/charts/echarts',
        parentId: 149
      }
    ]
  },
  {
    id: 169,
    label: 'MENUITEMS.ICONS.TEXT',
    icon: 'archive',
    collapseid: 'sidebarIcons',
    subItems: [
      {
        id: 170,
        label: 'MENUITEMS.ICONS.LIST.REMIX',
        link: '/jawda/icons/remix',
        parentId: 169
      },
      {
        id: 171,
        label: 'MENUITEMS.ICONS.LIST.BOXICONS',
        link: '/jawda/icons/boxicons',
        parentId: 169
      },
      {
        id: 172,
        label: 'MENUITEMS.ICONS.LIST.MATERIALDESIGN',
        link: '/jawda/icons/materialdesign',
        parentId: 169
      },
      {
        id: 173,
        label: 'MENUITEMS.ICONS.LIST.LINEAWESOME',
        link: '/jawda/icons/lineawesome',
        parentId: 169
      },
      {
        id: 174,
        label: 'MENUITEMS.ICONS.LIST.FEATHER',
        link: '/jawda/icons/feather',
        parentId: 169
      },
      {
        id: 174,
        label: 'MENUITEMS.ICONS.LIST.CRYPTOSVG',
        link: '/jawda/icons/icons-crypto',
        parentId: 169,
      },
    ]
  },
  {
    id: 175,
    label: 'MENUITEMS.MAPS.TEXT',
    icon: 'map-pin',
    collapseid: 'sidebarMaps',
    subItems: [
      {
        id: 176,
        label: 'MENUITEMS.MAPS.LIST.GOOGLE',
        link: '/jawda/maps/google',
        parentId: 175
      },
      {
        id: 178,
        label: 'MENUITEMS.MAPS.LIST.LEAFLET',
        link: '/jawda/maps/leaflet',
        parentId: 175
      }
    ]
  },
  {
    id: 179,
    label: 'MENUITEMS.MULTILEVEL.TEXT',
    icon: 'share-2',
    collapseid: 'sidebarMultilevel',
    subItems: [
      {
        id: 180,
        label: 'MENUITEMS.MULTILEVEL.LIST.LEVEL1.1',
        parentId: 179
      },
      {
        id: 181,
        label: 'MENUITEMS.MULTILEVEL.LIST.LEVEL1.2',
        subItems: [
          {
            id: 182,
            label: 'MENUITEMS.MULTILEVEL.LIST.LEVEL1.LEVEL2.1',
            parentId: 181,
          },
          {
            id: 183,
            label: 'MENUITEMS.MULTILEVEL.LIST.LEVEL1.LEVEL2.2',
            parentId: 181,
          }
        ]
      },
    ]
  }

];
