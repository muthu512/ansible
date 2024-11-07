import { Helmet } from 'react-helmet-async';

import {StudentAttendanceView  } from 'src/sections/student_attendance/view';

// ----------------------------------------------------------------------

export default function StatusPage() {
  return (
    <>
      <Helmet>
        <title> Student | Batch  </title>
      </Helmet>

      <StudentAttendanceView />
    </>
  );
}