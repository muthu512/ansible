/* eslint-disable perfectionist/sort-imports */
import 'src/global.css';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';


import Router from 'src/routes/sections';
import ThemeProvider from 'src/theme';
import SessionManager from './services/tokenExpire';


// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
    <ThemeProvider>
      <SessionManager/>
      <Router />
    </ThemeProvider>
  );
}
