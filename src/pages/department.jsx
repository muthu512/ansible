import { Helmet } from 'react-helmet-async';

import {DepartmentView  } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function DepartmentPage() {
  return (
    <>
      <Helmet>
        <title> Master | Department </title>
      </Helmet>

      <DepartmentView />
    </>
  );
}
