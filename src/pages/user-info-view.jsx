import { Helmet } from 'react-helmet-async';

import {UserInformationView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function UserInfoPage() {
  return (
    <>
      <Helmet>
        <title> Master | Status </title>
      </Helmet>

      <UserInformationView />
    </>
  );
}