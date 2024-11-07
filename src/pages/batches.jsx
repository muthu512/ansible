import { Helmet } from 'react-helmet-async';


import { BatchesView } from '../sections/user/view';




// ----------------------------------------------------------------------

export default function BatchesPage() {
  return (
    <>
      <Helmet>
        <title> Master | Batches </title>
      </Helmet>

      <BatchesView />
    </>
  );
}
