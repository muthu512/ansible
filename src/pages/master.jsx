import { Helmet } from 'react-helmet-async';

import { MasterView } from 'src/sections/master/view';

// ----------------------------------------------------------------------

export default function MasterPage() {
  return (
    <>
      <Helmet>
        <title> Master | CRM </title>
      </Helmet>

      <MasterView />
    </>
  );
}
