import { Helmet } from 'react-helmet-async';

import {StatusView  } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function StatusPage() {
  return (
    <>
      <Helmet>
        <title> Master | Status </title>
      </Helmet>

      <StatusView />
    </>
  );
}