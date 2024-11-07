import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Scrollbar from 'src/components/scrollbar';
import useApiService from 'src/services/api_services';
import { ListItemText, ListItemButton, Badge, Tooltip } from '@mui/material';
import { useRouter } from 'src/routes/hooks';
import Iconify from 'src/components/iconify';
import { Link } from 'react-router-dom';


// ----------------------------------------------------------------------


const LANGS = [
  {
    value: 'en',
    label: 'English',
    icon: '/assets/icons/remainder1.svg',
  },
  {
    value: 'de',
    label: 'German',
    icon: '/assets/icons/ic_flag_de.svg',
  },
  {
    value: 'fr',
    label: 'French',
    icon: '/assets/icons/ic_flag_fr.svg',
  },
];



// ----------------------------------------------------------------------

export default function LanguagePopover() {
  const [open, setOpen] = useState(null);
  const [reminderData, setReminderDta] = useState([]);
  const { getReminderbyToday } = useApiService();
  const [load, setLoad] = useState(true)
  const router = useRouter();



  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };



  const getReminder = useCallback(async () => {
    const response = await getReminderbyToday();
    setReminderDta(response);
    setLoad(false);
  }, [getReminderbyToday]);

  useEffect(() => {
    if (load) {
      getReminder()
    }
    const interval = setInterval(() => getReminder(), 15000)
    return () => {
      clearInterval(interval);
    }
  }, [load, getReminder])

  return (
    <>

      {/* <Count/> */}

      <Tooltip title="Reminder">
        <IconButton
          onClick={handleOpen}
          sx={{
            width: 37,
            height: 37,
            ...(open && {
              bgcolor: 'action.selected',
            }),
          }}
        >
          <IconButton color={open ? 'primary' : 'default'} onClick={handleOpen}>
            <Badge badgeContent={reminderData.length} color="error" >
              <img src={LANGS[0].icon} alt={LANGS[0].label} style={{ width: '20px' }} />
            </Badge>
          </IconButton>
        </IconButton>
      </Tooltip>
      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            ml: 0.75,
            width: 360,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 1, px: 1.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Reminder</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have {reminderData.length} reminder
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
          <List
            disablePadding
          >
            {reminderData.slice(0, 10).map((reminder) => (
              <ListItemButton
              key={reminder.id}
              onClick={() => { router.push(`/crm/customer/${reminder.cid}`); handleClose(); }}
              sx={{
                py: 0,
                px: 1.5,
              }}
            >
              <ListItemText
                sx={{
                  m: 0.1,
                }}
                primary={
                  <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Link style={{ color: 'rgb(24, 119, 242)', textDecoration: 'none' }}>{reminder.customerName}</Link>
                    <Iconify icon="mdi:arrow-right-thin" sx={{ mx: 0.5 }} />
                    <Link style={{ color: 'rgb(255, 171, 0)', textDecoration: 'none' }}>{reminder.assignee}</Link>
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', color: 'text.disabled' }}>
                    {reminder.description}
                  </Typography>
                }
              />
            </ListItemButton>
            
            ))}
          </List>
        </Scrollbar>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple onClick={() => { router.push('/crm/reminder'); handleClose() }}>
            View All
          </Button>
        </Box>
      </Popover>
    </>
  );
}



