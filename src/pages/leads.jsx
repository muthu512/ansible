import { Helmet } from 'react-helmet-async';

import {LeadsView  } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function LeadsPage() {
  return (
    <>
      <Helmet>
        <title> Master | Leads </title>
      </Helmet>

      <LeadsView />
    </>
  );
}