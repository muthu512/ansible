import { Helmet } from 'react-helmet-async';

import { EnquiriesView } from 'src/routes/sections';
// ----------------------------------------------------------------------

export default function DepartmentPage() {
  return (
    <>
      <Helmet>
        <title> Enquiries </title>
      </Helmet>

      <EnquiriesView />
    </>
  );
}
