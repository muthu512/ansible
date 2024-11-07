import { Helmet } from 'react-helmet-async';

import {FresherOrExprienceView  } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function DepartmentPage() {
  return (
    <>
      <Helmet>
        <title> Master | Fresher | Exprience </title>
      </Helmet>

      <FresherOrExprienceView />
    </>
  );
}
