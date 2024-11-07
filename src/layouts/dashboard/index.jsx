import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import { useRouter } from 'src/routes/hooks';
import GradientProgress from 'src/components/progress/gradientProgress';
import Nav from './nav';
import Main from './main';
import Header from './header';

// ----------------------------------------------------------------------

export default function DashboardLayout({ children }) {

  const auth = useSelector((state) => state.auth);
  const router = useRouter();
  const [openNav, setOpenNav] = useState(false);
  const [progressLoading, setProgressLoading] = useState(true);

  const checkLogin = useCallback(() => {
    if (!auth.isAuthenticated) {
      router.replace("/login"); // Redirect to dashboard if logged in
    }
    setProgressLoading(false);
  }, [router, auth]);

  useEffect(() => {
    checkLogin(); 
  }, [checkLogin]);


  return (
    progressLoading ? <GradientProgress /> : <>
      <Header onOpenNav={() => setOpenNav(true)} />
      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
        }}
      >
        <Nav openNav={openNav} onCloseNav={() => setOpenNav(false)} />
        <Main>{children}</Main>
      </Box>
    </>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node,
};
