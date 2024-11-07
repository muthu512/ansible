import { useState, useCallback } from 'react';
import Slide from '@mui/material/Slide';
import Input from '@mui/material/Input';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Popper from '@mui/material/Popper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import { useRouter } from 'src/routes/hooks';
import { styled } from '@mui/material/styles';
import useApiService from 'src/services/api_services';
import { bgBlur } from 'src/theme/css';
import Iconify from 'src/components/iconify';
import { Box, Tooltip } from '@mui/material';
import Login360LOGO from '../../../assets/LOGO ICON.png';
import { useRouteContext } from '../../../routes/hooks/contextHook';

const HEADER_MOBILE = 64;

const StyledSearchbar = styled('div')(({ theme }) => ({
  ...bgBlur({
    color: theme.palette.background.default,
  }),
  top: 0,
  left: 0,
  zIndex: 99,
  width: '100%',
  display: 'flex',
  position: 'absolute',
  alignItems: 'center',
  height: HEADER_MOBILE,
  padding: theme.spacing(0, 3),
  boxShadow: theme.customShadows.z8,
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(0, 5),
  },
}));

// -------------------------------------------------------------------

export default function Searchbar() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [customerGet, setCustomerGet] = useState([]);
  const { getCustomerSearch } = useApiService();
  const { isSearchBarDisabled } = useRouteContext();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
  };

  const customData = useCallback(async () => {
    const response = await getCustomerSearch(searchTerm);
    setCustomerGet(response);
  }, [getCustomerSearch, searchTerm]);

  const handleInputChange = (event) => {
    const newSearchTerm = event.target.value;
    if (newSearchTerm.length >= 3) {
      customData();
    }
    setSearchTerm(newSearchTerm);
    if (newSearchTerm.length > 0) {
      setAnchorEl(event.currentTarget);
    } else {
      setAnchorEl(null);
    }
  };
  const router = useRouter();
  const handleClickAway = useCallback(() => handleClose(), []);

  if (isSearchBarDisabled) {
    return null; // Hide the search bar if the route is matched
  }

  return (
    <>
      <Box onClick={() => router.push(`/`)}>
        <img
          style={{
            cursor: 'pointer',
            width: 80,
            height: 60,
            bgcolor: 'transparent',
          }}
          alt="logo"
          src={Login360LOGO}
        />
      </Box>
      <ClickAwayListener onClickAway={handleClickAway}>
        <div>
          {!open && (
            <Tooltip title="Global search">
              <IconButton onClick={handleOpen}>
                <Iconify icon="eva:search-fill" />
              </IconButton>
            </Tooltip>
          )}
          <Slide direction="down" in={open} mountOnEnter unmountOnExit>
            
            <StyledSearchbar>
              <Input
                autoFocus
                fullWidth
                disableUnderline
                placeholder="Search…"
                value={searchTerm}
                onChange={handleInputChange}
                startAdornment={
                  <InputAdornment position="start">
                    <Iconify
                      icon="eva:search-fill"
                      sx={{ color: 'text.disabled', width: 20, height: 30 }}
                    />
                  </InputAdornment>
                }
                sx={{ mr: 1, fontWeight: 'fontWeightBold' }}
                disabled={isSearchBarDisabled}
              />
              <Popper
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                placement="bottom-start"
                style={{
                  width: anchorEl ? anchorEl.clientWidth : 'auto',
                  zIndex: 100,
                  borderRadius: '4px',
                  boxShadow: '8px 8x 8px 8px rgba(0, 0, 0, 0.1)',
                }}
              >
                <MenuList
                  style={{
                    maxHeight: '250px',
                    overflowY: 'auto',
                    padding: 0,
                    margin: 0,
                    position: 'relative',
                    top: '20px',
                  }}
                >
                  {customerGet.map((result) => (
                    <MenuItem
                      key={result}
                      onClick={() => router.replace(`/crm/customer/${result.cid}`)(handleClickAway())}
                      style={{
                        padding: '10px 20px',
                        borderBottom: '1px solid #ddd',
                        cursor: 'pointer',
                        backgroundColor: 'whitesmoke',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f0f0f0';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                      }}
                    >
                      {result.name} - {result.mobileNumber} - {result.location} -{' '}
                      {result.enquiryDate}
                    </MenuItem>
                  ))}
                </MenuList>
              </Popper>
            </StyledSearchbar>
          </Slide>
        </div>
      </ClickAwayListener>
    </>
  );
}
