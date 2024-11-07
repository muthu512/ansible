import { Helmet } from 'react-helmet-async';


// ----------------------------------------------------------------------

export default function ApiErrorView() {
  return (
    <>
      <Helmet>
        <title> 404 Page Not Found </title>
      </Helmet>

      <ApiErrorView />
    </>
  );
}
