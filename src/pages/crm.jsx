import { Helmet } from 'react-helmet-async';

import { CRMView } from 'src/sections/crm/view';

// ----------------------------------------------------------------------

export default function MasterPage() {
  return (
    <>
      <Helmet>
        <title> Master | CRM </title>
      </Helmet>

      <CRMView />
    </>
  );
}
