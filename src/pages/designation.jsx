import { Helmet } from 'react-helmet-async';

import {DesignationView  } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function DesignationPage() {
  return (
    <>
      <Helmet>
        <title> Master | Designation </title>
      </Helmet>
      <DesignationView />
    </>
  );
}
