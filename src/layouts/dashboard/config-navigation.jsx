import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

export const TR_Navigation = [

  {
    title: 'Student Batches',
    path: '/student/batches',
    icon: icon('ic_student_batch'),
  },
  {
    title: 'Attendance',
    path: '/attendance',
    icon: icon('ic_attendance'),
  },
  {
    title: 'Report',
    path: '/',
    icon: icon('mdi--report-box'),
    children: [
      {
        title: 'Student Report',
        path: '/student_report',
        icon: icon('ic_onboard_report'),
      },
    ],
  },
];

export const SALES_Navigation = [
  {
    title: 'dashboard',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Attendance',
    path: '/attendance',
    icon: icon('ic_attendance'),
  },
  {
    title: 'CRM',
    path: '/crm',
    icon: icon('ic_crm'),
  },
  {
    title: 'Report',
    icon: icon('mdi--report-box'),
    children: [
      {
        title: 'CRM Report',
        path: '/crm_report',
        icon: icon('ic_crm_report'),
      },
      {
        title: 'Student Report',
        path: '/student_report',
        icon: icon('ic_onboard_report'),
      },
    ],
  },
  {
    title: 'Transactions',
    path: '/transaction',
    icon: icon('ic_transaction'),
  },
];

export const navConfig = [
  {
    title: 'dashboard',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Attendance',
    path: '/attendance',
    icon: icon('ic_attendance'),
  },
  {
    title: 'Onboard',
    path: '/onboard',
    icon: icon('ic_onboard'),
  },
  {
    title: 'Student Batches',
    path: '/student/batches',
    icon: icon('ic_student_batch'),
  },
  {
    title: 'Users',
    path: '/users',
    icon: icon('ic_user'),
  },
  {
    title: 'CRM',
    path: '/crm',
    icon: icon('ic_crm'),
  },
  
  {
    title: 'Report',
    path: '',
    icon: icon('mdi--report-box'),
    children: [
      {
        title: 'CRM Report',
        path: '/crm_report',
        icon: icon('ic_crm_report'),
      },
      {
        title: 'Transaction Report',
        path: '/transaction_report',
        icon: icon('ic_batch_report'),
      },
      {
        title: 'Student Report',
        path: '/student_report',
        icon: icon('ic_onboard_report'),
      },
    ],
  },

  {
    title: 'Transactions',
    path: '/transaction',
    icon: icon('ic_transaction'),
  },
  {
    title: 'Masters',
    path: '/master',
    icon: icon('ic_master'),
  },
];
