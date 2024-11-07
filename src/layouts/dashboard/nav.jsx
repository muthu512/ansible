import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import { useMediaQuery } from '@mui/material';
import { useSelector } from 'react-redux';
import { alpha, useTheme } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
import Scrollbar from 'src/components/scrollbar';
import { NAV } from './config-layout';
import { navConfig, SALES_Navigation, TR_Navigation } from './config-navigation';
import Login360LOGO from '../../assets/login360_logo_transp.png';

// ---------------------------------------------------------------------------

export default function Nav({ openNav, onCloseNav }) {
  const pathname = usePathname();
  const theme = useTheme();
  const [hover, setHover] = useState(false);
  const [activeItem, setActiveItem] = useState(null); 
  const [openParent, setOpenParent] = useState(null); 
  const auth = useSelector((state) => state.auth);

  const upLg = useMediaQuery(theme.breakpoints.up('lg'));
  const screen4k = useMediaQuery('(min-width: 1400px)');
  const mobileScreen = useMediaQuery('(min-width: 1200px)');

  useEffect(() => {
    if (openNav && upLg) {
      onCloseNav();
    }
    setActiveItem(pathname);
  }, [pathname, upLg, openNav, onCloseNav]);

  const handleSetActiveItem = (title) => {
    setActiveItem(title);
    setOpenParent(title); 
  };

  const renderAccount = (
    <Box
      sx={{
        my: 3,
        mx: 1.0,
        py: 2.5,
        px: 3.5,
        display: 'flex',
        borderRadius: 1.5,
        height: 80,
        alignItems: 'center',
        bgcolor: 'transparent',
      }}
    >
      <img alt='logo' src={Login360LOGO} style={{ width: mobileScreen ? 0 : 100 }} />
    </Box>
  );

  const renderMenu = (
    <Stack component="nav" spacing={0.7} sx={{ px: 1 }}>
      {auth.user.deptCode === "TR" ? TR_Navigation.map((item) => (
        <NavItem
          key={item.title}
          item={item}
          activeItem={activeItem}
          setActiveItem={handleSetActiveItem}
          openParent={openParent}
          setOpenParent={setOpenParent}
        />
      )) : auth.user.deptCode === "SALES" ? SALES_Navigation.map((item) => (
        <NavItem
          key={item.title}
          item={item}
          activeItem={activeItem}
          setActiveItem={handleSetActiveItem}
          openParent={openParent}
          setOpenParent={setOpenParent}
        />
      )) : navConfig.map((item) => (
        <NavItem
          key={item.title}
          item={item}
          activeItem={activeItem}
          setActiveItem={handleSetActiveItem}
          openParent={openParent}
          setOpenParent={setOpenParent}
        />
      ))}
    </Stack>
  );

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          display: 'flex',
          alignItems: 'flex-start',
          flexDirection: 'column',
        },
      }}
    >
      {renderAccount}
      {renderMenu}
      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );
  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: screen4k ? 200 : hover ? NAV.HOVER_WIDTH : NAV.WIDTH,
        transition: 'width 0.3s ease',
      }}
    >
      {upLg ? (
        <Box
          sx={{
            height: 1,
            width: screen4k ? 200 : hover ? NAV.HOVER_WIDTH : NAV.WIDTH,
            transition: 'width 0.3s ease',
            position: 'fixed',
            borderRight: `dashed 1px ${theme.palette.divider}`,
          }}
          onMouseEnter={() => !screen4k && setHover(true)}
          onMouseLeave={() => !screen4k && setHover(false)}
        >
          {renderContent}
        </Box>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: 200,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

// ----------------------------------------------------------------------
function NavItem({ item, activeItem, setActiveItem, openParent, setOpenParent }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const createTheme = useTheme();
  const active = item.path === pathname || item.children?.some(child => child.path === pathname);

  useEffect(() => {
    setOpen(item.title === openParent);
  }, [openParent, item.title]);

  const handleClick = () => {
    if (item.children) {
      setOpenParent(item.title);
      setOpen(!open);
    } else {
      setActiveItem(item.title);
    }
  };
  const handleChildClick = (path) => {
    setActiveItem(item.title);
    setOpen(false);
  };
  return (
    <>
      <ListItemButton
        component={item.children ? 'div' : RouterLink}
        href={!item.children ? item.path : undefined}
        onClick={handleClick}
        sx={{
          minHeight: 44,
          borderRadius: 0.75,
          typography: 'body2',
          color: 'text.secondary',
          textTransform: 'capitalize',
          fontWeight: 'fontWeightMedium',
          ...(active && {
            color: 'orange',
            fontWeight: 'fontWeightSemiBold',
            bgcolor: (theme) => alpha(createTheme.palette.primary.main, 0.08),
            '&:hover': {
              bgcolor: (theme) => alpha(createTheme.palette.primary.main, 0.16),
            },
          }),
        }}
      >
        <Box component="span" sx={{ width: 26, height: 26, mr: 1.9 }}>
          {item.icon}
        </Box>
        <Box sx={{ width: 110 }} component="span">{item.title}</Box>
      </ListItemButton>

      {item.children && open && (
        <Stack
          spacing={0.7}
          sx={{
            bgcolor: 'rgba(24, 119, 242, 0.08)',
            borderRadius: '5px'
          }}
        >
          {item.children.map((child) => {
            const childActive = child.path === pathname; 
            return (
              <ListItemButton
                key={child.title}
                component={RouterLink}
                href={child.path}
                onClick={() => handleChildClick(child.path)}
                sx={{
                  minHeight: 44,
                  borderRadius: 0.75,
                  typography: 'body2',
                  color: 'text.secondary',
                  textTransform: 'capitalize',
                  fontWeight: 'fontWeightMedium',
                  ...(childActive && {
                    color: 'orange',
                    fontWeight: 'fontWeightSemiBold',
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                    '&:hover': {
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
                    },
                  }),
                }}
              >
                <Box component="span" sx={{ width: 26, height: 26, mr: 1.9 }}>
                  {child.icon}
                </Box>
                <Box sx={{ width: 110 }} component="span">{child.title}</Box>
              </ListItemButton>
            );
          })}

        </Stack>
      )}
    </>
  );
}

NavItem.propTypes = {
  item: PropTypes.object,
  activeItem: PropTypes.string,
  setActiveItem: PropTypes.func,
  openParent: PropTypes.string,
  setOpenParent: PropTypes.func,
};
