import { lazy, Suspense } from 'react';
import { Outlet, useRoutes } from 'react-router-dom';
import DashboardLayout from 'src/layouts/dashboard';
import { RouteProvider } from './hooks/contextHook';

export const IndexPage = lazy(() => import('src/pages/app'));
export const AccountPage = lazy(() => import('src/pages/master'));
export const MasterPage = lazy(() => import('src/pages/master'));
export const RolePage = lazy(() => import('src/pages/role'));
export const StatusPage = lazy(() => import('src/pages/status'));
export const UsersPage = lazy(() => import('src/pages/users'));
export const CourseType = lazy(() => import('src/pages/coursetype'))
export const CoursesPage = lazy(() => import('src/pages/courses'))
export const LeadsPage = lazy(() => import('src/pages/leads'));
export const FresherOrExpriencePage = lazy(() => import('src/pages/fresher-exprience'));
export const DepartmentPage = lazy(() => import('src/pages/department'));
export const CRMPage = lazy(() => import('src/pages/crm'));
export const DesignationPage = lazy(() => import('src/pages/designation'));
export const TransactionPage = lazy(() => import('src/pages/transaction-page'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const RegisterPage = lazy(() => import('src/pages/register'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const CustomerReview = lazy(() => import("src/pages/crm-customer"))
export const UserInformationView = lazy(() => import("src/pages/user-info-view"))
export const ReminderView = lazy(() => import("src/sections/user/view/reminder-view"))
export const EnquiriesView = lazy(() => import('src/sections/overview/view/EnquiriesView'))
export const FollowupsView = lazy(() => import('src/sections/overview/view/followupsView'))
export const ApiErrorView = lazy(() => import('src/sections/error/api-error-view'))
export const EmailVerificationView = lazy(() => import('src/sections/login/email-verify'))
export const PasswordVerificationView = lazy(() => import('src/sections/login/password-verify'))
export const ConpyrightsView = lazy(() => import('src/sections/login/copyrights-view'))
export const CalendarView = lazy(() => import('src/calendar/calender-view'))
export const AttendanceView = lazy(() => import('src/calendar/attendance-view'))
export const StudentAttendanceBatch = lazy(() => import('src/pages/student_attendance'))
export const HolidayView = lazy(() => import('src/calendar/holidayView'))
export const AttendenceView = lazy(() => import('src/sections/attendance/view/attendance-view'))
export const InOutFormView = lazy(() => import('src/calendar/in-out-form'))
export const BatchesView = lazy(() => import('src/sections/user/view/batches-view'))
export const SyllabusView = lazy(() => import('src/sections/user/view/syllabus-view'))
export const StudentOnboard = lazy(() => import('src/components/batchComponent/onboard'))
export const OverAllAttendance = lazy(() => import('src/sections/student_attendance/view/over_all_attendance'))
export const BatchOverallCount = lazy(() => import('src/sections/student_attendance/view/batch-overallcount'))
export const StudentAttendanceTable = lazy(() => import('src/sections/student_attendance/view/student-att-daily-view'))
export const SyllabusTableView = lazy (()=> import('src/sections/user/view/syllabus-topic-view'))
export const CustomerInfo = lazy (() => import('src/sections/crm/view/customer-view'))
export const StudentReportView = lazy (() => import('src/sections/student_attendance/view/student-report-view'))
export const CrmReport = lazy (() => import ('src/report/crmReport'))
export const StudentReport = lazy (() => import ('src/report/student-report'))
export const TransactionReport = lazy(() => import ("src/report/transaction-report"))
export const AdminController = lazy (() => import ('../layouts/dashboard/common/admin-controller-view') )
export const AssigneeChange = lazy (() => import ('../layouts/dashboard/common/assignee-change') )

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <RouteProvider>
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
        </RouteProvider>
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: 'master', element: <MasterPage /> },
        { path: 'master/role', element: <RolePage /> },
        { path: 'users', element: <UsersPage /> },
        { path: 'master/status', element: <StatusPage /> },
        { path: 'master/leads', element: <LeadsPage /> },
        { path: 'master/fresher-or-exprience', element: <FresherOrExpriencePage /> },
        { path: 'master/courses', element: <CoursesPage /> },
        { path: 'master/course-type', element: <CourseType /> },
        { path: 'master/department', element: <DepartmentPage /> },
        { path: 'master/designation', element: <DesignationPage /> },
        { path: 'master/syllabus', element: <SyllabusView /> },
        { path: 'master/syllabus/add', element: <SyllabusView /> },
        { path: 'crm', element: <CRMPage /> },
        { path: 'transaction', element: <TransactionPage /> },
        { path: 'users/info/:id', element: <UserInformationView />, },
        { path: 'crm/customer/:id', element: <CustomerInfo /> },
        { path: 'crm/reminder', element: <ReminderView /> },
        { path: 'enquiries', element: <EnquiriesView /> },
        { path: 'followups', element: <FollowupsView /> },
        { path: 'calendar', element: <CalendarView /> },
        { path: 'attendance', element: <AttendenceView /> },
        { path: 'calendar/attendance', element: <AttendanceView /> },
        { path: 'master/batches', element: <BatchesView /> },
        { path: 'holiday', element: <HolidayView /> },
        { path: 'onboard', element: <StudentOnboard /> },
        { path: 'in_out', element: <InOutFormView /> },
        { path: 'student/batches/:id/report', element: <OverAllAttendance /> },
        { path: 'student/batches', element: <StudentAttendanceBatch /> },
        { path: 'student/batches/:id', element: <BatchOverallCount /> },
        { path: 'student/batches/:id/attendance', element: <StudentAttendanceTable /> },
        { path: 'student/batches/:id/:attDate', element: <StudentAttendanceTable /> },
        { path: 'master/syllabus/:id',element:<SyllabusTableView/>},
        { path: 'student/batches/:id/student_report', element: <StudentReportView/>},
        { path: '/crm_report',element:<CrmReport/>},
        {path: 'student_report', element:<StudentReport/>},
        {path: 'transaction_report', element:<TransactionReport/>},
        {path :'admin_controll',element:<AdminController/>},
        {path :'/assignee_change',element:<AssigneeChange/>},
      ],
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: 'register',
      element: <RegisterPage />,
    },
    {
      path: '*',
      element: <Page404 />,
    },
    {
      path: 'not_found',
      element: <ApiErrorView />,
    },
    {
      path: 'verification',
      element: <EmailVerificationView />
    },
    {
      path: 'reset-password',
      element: <PasswordVerificationView />
    },
    {
      path: 'copyrights',
      element: <ConpyrightsView />
    },
  ]);

  return routes;
}
