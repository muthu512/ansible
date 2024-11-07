import { useState, useEffect, forwardRef, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

import {
  Select,
  MenuItem,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogActions,
  FormControl,
  DialogContent,
  Switch,
  Tooltip,
  Typography,
  useMediaQuery,
  Chip,
} from '@mui/material';

import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parse } from 'date-fns';
import useApiService from 'src/services/api_services';
import RefreshIcon from '@mui/icons-material/Refresh';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snakbar/SnackbarContext';
import Datatable from 'src/components/datatable';
import Label from 'src/components/label';
import { useRouter } from 'src/routes/hooks';
import ListView from '../../../components/List-view-component/ListView';
import ConfirmDialog from '../../../components/confirmdialog/confirm-dialog';

// ----------------------------------------------------------------------
const Transition = forwardRef((props, ref) => <Slide direction="left" ref={ref} {...props} />);

export default function AssigneeChange() {
  const [personName, setPersonName] = useState([]);
  const [status, setStatus] = useState([]);
  const [orgStatus, setOrgStatus] = useState([]);
  const [getTableData, setGetTableData] = useState([]);

  const { showSnackbar } = useSnackbar();
  const router = useRouter();
  const { assigneeCreate, getActiveUsers, getStatusActive, getassigneeCreate, deleteChangedAssignee } = useApiService();

  const [changeAssignee, setChangeAssignee] = useState({
    id: 0,
    assigneeFrom: '',
    assigneeTo: '',
    assignDate: format(new Date(), 'yyyy-MMM-dd'),
    status: [],
    active: false,
  });

  const isSmallScreen = useMediaQuery('(max-width: 650px)');
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  // const [userData] = useState([]);
  const [load, setLoad] = useState(true);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [refreshTable, setRefreshTable] = useState(false);

  const [columnDefs] = useState([
    {
      id: '',
      field: 'S.no',
      valueGetter: 'node.rowIndex + 1',
      align: 'center',
      headerName: 'S.No',
      flex: 1,
      maxWidth: 80,
      cellStyle: {
        alignContent: 'center',
        textAlign: '-webkit-center',
      },
      filter: false,
    },
    {
      id: '',
      field: 'assignDate',
      headerName: 'Assign Date',
      align: 'center',
      cellStyle: {
        alignContent: 'center',
        textAlign: '-webkit-center',
      },
      flex: 1,
    },
    {
      id: '',
      field: 'assigneeFromName',
      headerName: 'Assignee From',
      align: 'center',
      flex: 1,
      cellRenderer: (params) => (
        <Label
          color="error"
          sx={{ cursor: 'pointer' }}
          onClick={() => {
            router.push(`/users/info/${params.data.assigneeFrom}`);
          }}
        >
          {params.value}
        </Label>
      ),
    },
    {
      id: '',
      field: 'assigneeToName',
      headerName: 'Assignee To',
      align: 'center',
      flex: 1,
      cellRenderer: (params) => (
        <Label
          color="success"
          sx={{ cursor: 'pointer' }}
          onClick={() => {
            router.push(`/users/info/${params.data.assigneeTo}`);
          }}
        >
          {params.value}
        </Label>
      ),
    },
    {
      id: '',
      field: 'status',
      headerName: 'Status',
      align: 'center',
      cellStyle: {
        alignContent: 'center',
        textAlign: '-webkit-center',
      },
      flex: 1,
    },

    {
      id: '',
      field: 'Action',
      align: 'center',
      flex: 1,
      maxWidth: 150,
      headerName: 'Action',
      cellStyle: { textAlign: 'center' },
      cellRenderer: (params) => (
        <>
        <Tooltip title="Edit">
          <IconButton
            color="primary"
            sx={{ backgroundColor: 'whitesmoke' }}
            onClick={() => handleEdit(params.data)}
          >
            <Iconify icon="ic:outline-edit-note" />
          </IconButton>
        </Tooltip>
         <Tooltip title="Delete">
         <IconButton onClick={() => handleClickDelete(params.data.id)}>
           <Iconify icon="material-symbols:delete-outline-rounded" sx={{ color: 'red' }} />
         </IconButton>
       </Tooltip>
       </>
      ),
    },
  ]);

  const handleRefresh = () => {
    setRefreshTable(!refreshTable);
  };

  const getSwitchAssignee = useCallback(async () => {
    const response = await getassigneeCreate();
    setGetTableData(response);
  }, [getassigneeCreate]);

  const switchAssignee = async () => {
    handleClose();
    const response = await assigneeCreate(changeAssignee);
    if (response.status === 'OK') {
      showSnackbar(response.message, 'success');
      getSwitchAssignee();
    } else {
      showSnackbar(response.message, 'warning');
    }
  };

  const updateAssignee = async () => {
    handleClose();
    const response = await assigneeCreate(changeAssignee);
    if (response.status === 'OK') {
      showSnackbar(response.message, 'success');
      getSwitchAssignee();
    } else {
      showSnackbar(response.message, 'warning');
    }
  };

  const getUsersActive = useCallback(async () => {
    const response = await getActiveUsers();
    const data = response.map((user) => <MenuItem value={user.uid}>{user.userName}</MenuItem>);
    setPersonName(data);
  }, [getActiveUsers]);

  const getUserstatus = useCallback(async () => {
    const response = await getStatusActive();
    setOrgStatus(response);
    const data = response.map((statusRes) => (
      <MenuItem value={statusRes.code}>{statusRes.name}</MenuItem>
    ));
    setStatus(data);
  }, [getStatusActive]);

  useEffect(() => {
    if (load) {
      getUsersActive();
      getUserstatus();
      getSwitchAssignee();
      setLoad(false);
    }
  }, [load, getUsersActive, getUserstatus, getSwitchAssignee]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEdit(false);
    setChangeAssignee({
      id: 0,
      assigneeFrom: '',
      assigneeTo: '',
      assignDate: format(new Date(), 'yyyy-MMM-dd'),
      status: [],
      active: false,
    });
  };
  const handleEdit = (row) => {
    setEdit(true);
    setChangeAssignee({
      id: row.id,
      assigneeFrom: row.assigneeFrom,
      assigneeTo: row.assigneeTo,
      status: row.status,
      assignDate: row.assignDate,
      active: row.active,
    });
    setOpen(true);
  };

  const handleChangeAssignee = (e) => {
    const { name, value } = e.target;
    setChangeAssignee((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleClickDelete = (item) => {
    setItemToDelete(item);
    setConfirmDelete(true);
  };

  const handleCloseDelete = () => {
    setConfirmDelete(false);
    setItemToDelete(null);
  };

  const handleDelete = async () => {
    handleCloseDelete();
    const response = await deleteChangedAssignee(itemToDelete);
    if (response.status === 'OK') {
      showSnackbar(response.message, 'success');
      getSwitchAssignee()
    } else {
      showSnackbar(response.message, 'warning');
    }
   
  };

  return (
    <Container maxWidth="xxl">
      <Card>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={0}
          px={2}
          py={1}
        >
          <Typography variant="h6" sx={{ color: '#f79520' }}>
            Assignee Change
          </Typography>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Stack spacing={2} direction="row" sx={{ marginRight: '15px' }}>
              <Button variant="text" onClick={handleRefresh}>
                <RefreshIcon />
              </Button>
            </Stack>
            <Button
              variant="contained"
              sx={{ marginLeft: 2, marginBottom: 0.5 }}
              color="inherit"
              onClick={handleClickOpen}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New
            </Button>
          </div>

          <ConfirmDialog
          text="Delete"
          confirmPopup={confirmDelete}
          handleExit={handleDelete}
          handleClosePopup={handleCloseDelete}
        />

          <Dialog
            open={open}
            onBackdropClick="false"
            onClose={handleClose}
            TransitionComponent={Transition}
            keepMounted
            fullWidth
            maxWidth="xs"
            PaperProps={{
              component: 'form',
              onSubmit: (event) => {
                event.preventDefault();
                if (edit) {
                  updateAssignee();
                } else {
                  switchAssignee();
                }
                handleClose();
              },
            }}
          >
            <DialogTitle sx={{ color: '#f79520' }}>
              {edit ? 'Update Assignee' : 'Create Assignee'}
            </DialogTitle>
            <DialogContent>
              <Stack spacing={2}>
                <Grid
                  container
                  spacing={1}
                  direction="column"
                  justifyContent="center"
                  marginRight={10}
                >
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    sx={{
                      display: 'flex',
                      placeItems: 'center',
                      width: '100%',
                      padding: '15px',
                      gap: '10px',
                    }}
                  >
                    <Typography
                      variant="p"
                      sx={{
                        width: '250px',
                        placeItems: 'center',
                        textAlign: 'start',
                      }}
                    >
                      Assignee From
                    </Typography>
                    <Typography>:</Typography>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Assign Date"
                        value={parse(changeAssignee.assignDate, 'yyyy-MMM-dd', new Date())}
                        onChange={(newValue) => {
                          setChangeAssignee((prevState) => ({
                            ...prevState,
                            assignDate: format(newValue, 'yyyy-MMM-dd'),
                          }));
                        }}
                        sx={{width:'380px'}}
                        format="yyyy-MMM-dd"
                        renderInput={(params) => <TextField {...params} required />}
                      />
                    </LocalizationProvider>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    sx={{
                      display: 'flex',
                      placeItems: 'center',
                      width: '100%',
                      padding: '15px',
                      gap: '10px',
                    }}
                  >
                    <Typography
                      variant="p"
                      sx={{
                        width: '250px',
                        placeItems: 'center',
                        textAlign: 'start',
                      }}
                    >
                      Assignee From
                    </Typography>
                    <Typography>:</Typography>
                    <FormControl fullWidth>
                      <Select
                        labelId="assignee-from-select-label"
                        id="assignee-from-select"
                        value={changeAssignee.assigneeFrom}
                        name="assigneeFrom"
                        // label="Assignee From"
                        onChange={handleChangeAssignee}
                        // error={Boolean(errors.assigneeFrom)}
                        MenuProps={{
                          sx: { maxHeight: '300px' },
                        }}
                      >
                        {personName}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    sx={{
                      display: 'flex',
                      placeItems: 'center',
                      width: '100%',
                      padding: '15px',
                      gap: '10px',
                    }}
                  >
                    <Typography
                      variant="p"
                      sx={{
                        width: '250px',
                        placeItems: 'center',
                        textAlign: 'start',
                      }}
                    >
                      Assignee To
                    </Typography>
                    <Typography>:</Typography>

                    <FormControl fullWidth>
                      <Select
                        labelId="assignee-to-select-label"
                        id="assignee-to-select"
                        value={changeAssignee.assigneeTo}
                        // label="Assignee To"
                        name="assigneeTo"
                        onChange={handleChangeAssignee}
                        MenuProps={{
                          sx: { maxHeight: '300px' },
                        }}
                      >
                        {personName}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    sx={{
                      display: 'flex',
                      placeItems: 'center',
                      width: '100%',
                      padding: '15px',
                      gap: '10px',
                    }}
                  >
                    <Typography
                      variant="p"
                      sx={{
                        width: '250px',
                        placeItems: 'center',
                        textAlign: 'start',
                      }}
                    >
                      Status{' '}
                    </Typography>
                    <Typography>:</Typography>
                    <FormControl fullWidth>
                      {/* <InputLabel>Batch ID</InputLabel> */}
                      <Select
                        multiple
                        MenuProps={{
                          style: { height: '300px' },
                        }}
                        value={changeAssignee.status}
                        onChange={(e) =>
                          setChangeAssignee((prevState) => ({
                            ...prevState,
                            status: e.target.value,
                          }))
                        }
                        renderValue={(selected) => (
                          <Stack gap={1} direction="row" flexWrap="wrap">
                            {selected.map((value) => (
                              <Chip
                                key={value}
                                label={
                                  orgStatus.length > 0
                                    ? orgStatus.find((statusData) => statusData.code === value) ===
                                      'undefined'
                                      ? ''
                                      : orgStatus.find((statusData) => statusData.code === value)
                                          .name
                                    : ''
                                }
                                onDelete={null}
                                deleteIcon={null}
                              />
                            ))}
                          </Stack>
                        )}
                      >
                        {status}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    sx={{
                      display: 'flex',
                      placeItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '15px',
                      gap: '10px',
                    }}
                  >
                    <div style={{ display: 'flex' }}>
                      <Typography
                        variant="p"
                        sx={{
                          width: '152px',
                        }}
                      >
                        Active{' '}
                      </Typography>

                      <Typography sx={{}}>
                        :{' '}
                        <Switch
                          checked={changeAssignee.active}
                          onChange={(event, value) => {
                            setChangeAssignee((prevState) => ({
                              ...prevState,
                              active: value,
                            }));
                          }}
                        />
                      </Typography>
                    </div>
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

        {isSmallScreen ? (
          <ListView
            data={getTableData}
            onRowClick={(assigneeFrom) => router.push(`/users/info/${assigneeFrom}`)}
            secondRow={(assigneeTo) => router.push(`/users/info/${assigneeTo}`)}
            page="assigneeChange"
          />
        ) : (
          <Datatable rowData={getTableData} columnDefs={columnDefs} refreshTable={refreshTable} />
        )}
      </Card>
    </Container>
  );
}
