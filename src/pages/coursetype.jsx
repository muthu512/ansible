import { Helmet } from 'react-helmet-async';

import {CourseTypeView  } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function CourseTypePage() {
  return (
    <>
      <Helmet>
        <title> Master | Course Type </title>
      </Helmet>

      <CourseTypeView />
    </>
  );
}