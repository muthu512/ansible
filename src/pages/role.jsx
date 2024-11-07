import { Helmet } from 'react-helmet-async';

import {RoleView  } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function RolePage() {
  return (
    <>
      <Helmet>
        <title> Master | Role </title>
      </Helmet>

      <RoleView />
    </>
  );
}
