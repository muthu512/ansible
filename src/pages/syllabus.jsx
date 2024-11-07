import { Helmet } from 'react-helmet-async';


import { SyllabusView } from '../sections/user/view';




// ----------------------------------------------------------------------

export default function BatchesPage() {
  return (
    <>
      <Helmet>
        <title> Master | Syllabus </title>
      </Helmet>

      <SyllabusView/>
    </>
  );
}
