import { Helmet } from 'react-helmet-async';

import { FollowupsView } from 'src/routes/sections';
// ----------------------------------------------------------------------

export default function CourseTypePage() {
  return (
    <>
      <Helmet>
        <title> Master | Course Type </title>
      </Helmet>

      <FollowupsView />
    </>
  );
}