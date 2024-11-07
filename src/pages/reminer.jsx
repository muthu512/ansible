import { Helmet } from 'react-helmet-async';

import {ReminderView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function RolePage() {
  return (
    <>
      <Helmet>
        <title> CRM | Reminders </title>
      </Helmet>

      <ReminderView />
    </>
  );
}
