import PropTypes from 'prop-types';
import { useRouter } from 'src/routes/hooks';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { useResponsive } from 'src/hooks/use-responsive';
import { bgBlur } from 'src/theme/css';
import Iconify from 'src/components/iconify';
import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonthTwoTone';
import { Tooltip } from '@mui/material';
import Searchbar from './common/searchbar';
import { NAV, HEADER } from './config-layout';
import AccountPopover from './common/account-popover';
import LanguagePopover from './common/language-popover';
import NotificationsPopover from './common/notifications-popover';
// ---------------------------------------------------------------------

export default function Header({ onOpenNav }) {
  const theme = useTheme();
  const router = useRouter();
  const lgUp = useResponsive('up', 'lg');
  const auth = useSelector((state) => state.auth);
  const renderContent = (
    <>
      {!lgUp && (
        <IconButton onClick={onOpenNav} sx={{ mr: 1 }}>
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>
      )}

      <Searchbar />

      <Box sx={{ flexGrow: 1 }} />

      <Stack direction="row" alignItems="center" spacing={1} >
        {auth.user.roleCode === 'ADMIN' ? <LanguagePopover /> : auth.user.roleCode === 'USER' ? <LanguagePopover /> : null }
        <Tooltip title='Calendar'>
          <IconButton
            onClick={() => {
              router.push(`/calendar`);
            }}
          >
            <CalendarMonthTwoToneIcon sx={{ color: '#1877f2' }} />
          </IconButton>
        </Tooltip>

        {auth.user.roleCode === 'ADMIN' ?
          <Tooltip title='Admin Controller'>
            <IconButton
              // sx={{display:'none'}}
              onClick={() => {
                router.push(`admin_controll`);
              }}
            >
              <Iconify sx={{ color: '#5d6d7e', height: '28px', width: '28px' }} icon="flowbite:user-settings-outline" />
            </IconButton>
          </Tooltip> : null}

        <NotificationsPopover />

        <AccountPopover />
      </Stack>
    </>
  );

  return (
    <AppBar
      sx={{
        padding: '0px',
        boxShadow: 'none',
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        ...bgBlur({
          color: theme.palette.background.default,
        }),
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(lgUp && {
          width: `calc(100% - ${NAV.WIDTH + 1}px)`,
          height: HEADER.H_DESKTOP,
        }),
      }}
    >
      <Toolbar
        sx={{
          height: 0.5,
          px: { lg: 2, xs: 0 },
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  onOpenNav: PropTypes.func,
};
