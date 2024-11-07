import { useState, useEffect, forwardRef, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Slide from '@mui/material/Slide';
// import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
// import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
// import TableContainer from '@mui/material/TableContainer';
// import TablePagination from '@mui/material/TablePagination';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import {
  Dialog,
  TextField,
  DialogTitle,
  DialogActions,
  DialogContent,
  OutlinedInput,
  DialogContentText,
  Grid,
  MenuItem,
  FormControl,
  Tooltip,
  IconButton,
  InputAdornment,
  useMediaQuery,
} from '@mui/material';
import { useRouter } from 'src/routes/hooks';
import RefreshIcon from '@mui/icons-material/Refresh';
import useApiService from 'src/services/api_services';
import ConfirmDialog from 'src/components/confirmdialog/confirm-dialog';
import { useSnackbar } from 'src/components/snakbar/SnackbarContext';
import { format, parse } from 'date-fns';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { useSelector } from 'react-redux';
import DataTable from 'src/components/datatable/data-table';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import ListView from '../../../components/List-view-component/ListView';
import GradientProgress from '../../../components/progress/gradientProgress';

// ----------------------------------------------------------------------
const Transition = forwardRef((props, ref) => <Slide direction="left" ref={ref} {...props} />);

export default function ReminderPage() {
  const router = useRouter();

  const [refreshTable, setRefreshTable] = useState(false);

  const { showSnackbar } = useSnackbar();

  const { getReminder, addReminder, deleteReminder } = useApiService();

  const [remainderDate, setRemiderData] = useState([]);

  const isSmallScreen = useMediaQuery('(max-width: 650px)');

  const isToSmallScreen = useMediaQuery('(max-width: 400px)');

  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [load, setLoad] = useState(true);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [progressLoading, setProgressLoading] = useState(true);

  const auth = useSelector((state) => state.auth);

  const handleRefresh = () => {
    getReminderData();
    setRefreshTable(!refreshTable);
  };
  const [reminder, setReminder] = useState({
    id: 0,
    cid: '',
    customerName: '',
    remainderDate: format(new Date(), 'yyyy-MMM-dd'),
    lastModifyDate: '2024-08-17T04:38:14.223Z',
    description: '',
    status: 'Pending',
  });
  const copyToMobileNumber = (phoneNumber) => {
    navigator.clipboard.writeText(phoneNumber);
  };
  const [columnDefs] = useState([
    {
      id: '',
      field: 'S.no',
      valueGetter: 'node.rowIndex + 1',
      align: 'center',
      maxWidth: 70,
      filter: false,
    },
    {
      id: '',
      field: 'remainderDate',
      headerName: 'Remainder Date',
      align: 'center',
      flex: 1,
      cellRenderer: (params) => <Label color="secondary">{params.value}</Label>,
    },
    {
      field: 'customerName',
      flex: 1,
      cellRenderer: (params) => (
        <Label
          onClick={() => {
            router.push(`/crm/customer/${params.data.cid}`);
          }}
          sx={{
            margin: '11px',
            '&:hover': {
              color: '#7f02ef',
              cursor: 'pointer',
            },
          }}
        >
          {' '}
          <Iconify icon="mdi:account-circle" sx={{ marginRight: 0.5 }} />
          {params.value}
        </Label>
      ),
    },
    {
      field: 'mobileNumber',
      flex: 1,
      cellRenderer: (params) => (
        <Label
          onClick={() => {
            copyToMobileNumber(params.value);
          }}
          sx={{
            margin: '11px',
            '&:hover': {
              color: '#0279fe',
              cursor: 'pointer',
            },
          }}
        >
          {' '}
          <Tooltip title="copy">
            <ContentCopyRoundedIcon sx={{ margin: 0.5, fontSize: 'medium' }} />
          </Tooltip>
          {params.value}
        </Label>
      ),
    },
    {
      field: 'assignee',
      flex: 1,
      cellRenderer: (params) => (
        <Label
          onClick={() => {
            router.push(`/users/info/${params.data.uid}`);
          }}
          sx={{
            margin: '11px',
            color: `${params.data.color}`,
            '&:hover': {
              color: 'blue',
              cursor: 'pointer',
            },
          }}
        >
          {' '}
          {params.value}
        </Label>
      ),
    },
    {
      field: 'updateBy',
      flex: 1,
      cellRenderer: (params) => (
        <Label
          onClick={() => {
            router.push(`/users/info/${params.data.uid}`);
          }}
          sx={{
            margin: '11px',
            color: `${params.data.color}`,
            '&:hover': {
              color: 'blue',
              cursor: 'pointer',
            },
          }}
        >
          {' '}
          {params.value}
        </Label>
      ),
    },
    {
      id: '',
      field: 'createDate',
      headerName: 'Created Date',
      align: 'center',
      flex: 1,
      cellRenderer: (params) => <Label color="success">{params.value}</Label>,
    },
    {
      field: 'description',
      flex: 1,
      tooltipField: 'description'
    },

    {
      field: 'status',
      flex: 1,
      align: 'center',
      cellEditor: 'agSelectCellEditor',
      editable: true,
      cellEditorParams: {
        values: ['Pending', 'Completed'],
      },
    },
    {
      id: '',
      field: 'lastModifyDate',
      headerName: 'Last Modified Date',
      align: 'center',
      flex: 1,
      cellRenderer: (params) => <Label color="info">{params.value}</Label>,
    },
    {
      id: '',
      field: 'Action',
      align: 'center',
      flex: 1,
      filter: false,
      minWidth: 110,
      headerName: 'Action',
      cellStyle: { textAlign: 'center' },
      cellRenderer: (params) => (
        <>
          <Tooltip title="Edit">
            <IconButton color="primary" onClick={() => handleEdit(params.data)}>
              <Iconify icon="ic:outline-edit-note" />
            </IconButton>
          </Tooltip>
          {auth.user.roleCode === 'ADMIN' ? (
            <Tooltip title="Delete">
              <IconButton onClick={() => handleClickDelete(params.data.id)}>
                <Iconify icon="material-symbols:delete-outline-rounded" sx={{ color: 'red' }} />
              </IconButton>
            </Tooltip>
          ) : null}
        </>
      ),
    },
  ]);
  const [searchText, setSearchText] = useState('');
  // Handler to update search text
  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };
  const quickFilterText = searchText.trim();
  const saveReminder = async () => {
    const response = await addReminder(reminder);
    if (response.status === 'OK') {
      showSnackbar(response.message, 'success');
      getReminderData();
    }
  };

  const getReminderData = useCallback(async () => {
    const response = await getReminder();
    setRemiderData(response);
    setProgressLoading(false);
    setLoad(false);
  }, [getReminder]);

  const handleReminderDetele = async () => {
    setConfirmDelete(false);
    const response = await deleteReminder(itemToDelete);
    if (response.status === 'OK') {
      showSnackbar(response.message, 'success');
    } else {
      showSnackbar(response.message, 'warning');
    }
    getReminderData();
  };

  const onCellValueChanged = async (event) => {
    const updatedData = event.data;
    const response = await addReminder(updatedData);
    console.log('status', response)
    if (response.status === "OK") {
      showSnackbar(response.message, 'success')
    } else {
      showSnackbar(response.message, 'warning');
    }
  }

  useEffect(() => {
    if (load) {
      getReminderData();
    }
  }, [load, getReminderData]);


  const handleClose = () => {
    setOpen(false);
    setEdit(false);
    setReminder({
      id: 0,
      cid: '',
      customerName: '',
      remainderDate: format(new Date(), 'yyyy-MMM-dd'),
      description: '',
      status: 'Pending',
      uid: auth.user.uid,
    });
  };

  const handleEdit = (rem) => {
    setEdit(true);
    setReminder({
      id: rem.id,
      cid: rem.cid,
      customerName: rem.customerName,
      remainderDate: rem.remainderDate,
      description: rem.description,
      status: rem.status,
      uid: auth.user.uid,
    });
    setOpen(true);
  };

  const handleClickDelete = (item) => {
    setItemToDelete(item);
    setConfirmDelete(true);
  };

  const handleCloseDelete = () => {
    setConfirmDelete(false);
    setItemToDelete(null);
  };

  return (
    <Container maxWidth="xxl">
      <Card>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={0}
          padding={2}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            onClick={() => {
              router.back();
            }}
            sx={{
              color: '#f79520',
              '&:hover': {
                color: 'blue',
                cursor: 'pointer',
              },
            }}
          >
            <KeyboardArrowLeftIcon />
            <Typography variant="h6">Reminders</Typography>
          </Stack>

          {isToSmallScreen ? null : (
            <div style={{ display: 'flex' }}>
              <Stack spacing={2} direction="row" sx={{ marginRight: '15px' }}>
                <Button variant="text" onClick={handleRefresh}>
                  <RefreshIcon />
                </Button>
              </Stack>

              <OutlinedInput
                value={searchText}
                onChange={handleSearchTextChange}
                placeholder="Search...."
                sx={{ height: 36 }}
                startAdornment={
                  <InputAdornment position="start">
                    <Iconify
                      icon="eva:search-fill"
                      sx={{ color: 'text.disabled', width: 20, height: 20 }}
                    />
                  </InputAdornment>
                }
              />
            </div>
          )}

          {/* --------------Delete reminder-------------- */}

          <ConfirmDialog
            text="Delete"
            confirmPopup={confirmDelete}
            handleExit={handleReminderDetele}
            handleClosePopup={handleCloseDelete}
          />

          <Dialog
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
            fullWidth
            maxWidth="xs"
            keepMounted
            PaperProps={{
              component: 'form',
              onSubmit: (event) => {
                event.preventDefault();
                saveReminder();
                handleClose();
              },
            }}
          >
            <DialogTitle color="#f79520">
              {edit ? 'Update Reminder' : 'Create reminder'}
            </DialogTitle>
            <DialogContent>
              <Stack spacing={1}>
                <DialogContentText>Create reminder for remember task</DialogContentText>
                <Grid
                  container
                  spacing={{ sx: 0, md: 1 }}
                  direction="row"
                  justifyContent="flex-start"
                  mt={10}
                  sx={{ flexDirection: { xs: 'column', md: 'row', lg: 'row' } }}
                >
                  <Grid container spacing={2} mt={1}>
                    <Grid item xs={12} md={6}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="Reminder Date"
                          value={parse(reminder.remainderDate, 'yyyy-MMM-dd', new Date())}
                          onChange={(newValue) => {
                            setReminder((prevState) => ({
                              ...prevState,
                              remainderDate: format(newValue, 'yyyy-MMM-dd'),
                            }));
                          }}
                          format="yyyy-MMM-dd"
                          renderInput={(params) => <TextField {...params} fullWidth required />}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} md={6} sm={12}>
                      <FormControl fullWidth>
                        {/* <InputLabel id="demo-simple-select-label">Gender</InputLabel> */}
                        <TextField
                          select
                          SelectProps={{
                            MenuProps: {
                              style: {
                                maxHeight: 300,
                              },
                            },
                          }}
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={reminder.status}
                          label="Status"
                          name="status"
                          onChange={(event) => {
                            const { name, value } = event.target;
                            setReminder((prevState) => ({
                              ...prevState,
                              [name]: value,
                            }));
                          }}
                          required
                        >
                          <MenuItem value="Pending">Pending</MenuItem>
                          <MenuItem value="Completed">Completed</MenuItem>
                        </TextField>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Description"
                        variant="outlined"
                        multiline
                        autoFocus
                        fullWidth
                        value={reminder.description}
                        rows={3}
                        onChange={(e) => {
                          setReminder((prevState) => ({
                            ...prevState,
                            description: e.target.value,
                          }));
                        }}
                      // fullWidth
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="secondary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                {edit ? 'Update' : 'Create'}
              </Button>
            </DialogActions>
          </Dialog>
        </Stack>
        {progressLoading ? (
          <GradientProgress />
        ) : (
          <>
            {isSmallScreen ? (
              <ListView
                data={remainderDate}
                onRowClick={(uid) => router.push(`/crm/customer/${uid}`)}
                page="remainder"
              />
            ) : (
              <DataTable
                quickFilterText={quickFilterText}
                rowData={remainderDate}
                onCellValueChange={onCellValueChanged}
                columnDefs={columnDefs}
              />
            )}
          </>
        )}
      </Card>
    </Container>
  );
}
