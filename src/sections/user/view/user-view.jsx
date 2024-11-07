import { useState, useEffect, forwardRef, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

import {
  Avatar,
  Select,
  MenuItem,
  TextField,
  IconButton,
  InputAdornment,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogActions,
  FormControl,
  DialogContent,
  FormControlLabel,
  DialogContentText,
  Input,
  Switch,
  FormHelperText,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';

import { format, parse } from 'date-fns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import useApiService from 'src/services/api_services';
import RefreshIcon from '@mui/icons-material/Refresh';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snakbar/SnackbarContext';
import Datatable from 'src/components/datatable';
import Label from 'src/components/label';
import { useRouter } from 'src/routes/hooks';
import ListView from '../../../components/List-view-component/ListView';
import GradientProgress from '../../../components/progress/gradientProgress';


// ----------------------------------------------------------------------
const Transition = forwardRef((props, ref) => <Slide direction="left" ref={ref} {...props} />);

export default function UserPage(onFilterName) {
  const { showSnackbar } = useSnackbar();
  const router = useRouter()
  const {
    getUsers,
    getDepartmentActive,
    getDesignationActive,
    getRolesActive,
    saveAppUser,
    getActiveUsers,
  } = useApiService();

  const [user, setUser] = useState({
    id: 0,
    userName: '',
    email: '',
    password: '',
    deptCode: '',
    designCode: '',
    roleCode: '',
    mobileNumber: '',
    gender: '',
    reportingId: '',
    reportingName: '',
    active: false,
    profile: '',
    joiningDate: format(new Date(), 'yyyy-MMM-dd'),
    color: '',
  });

  const isSmallScreen = useMediaQuery('(max-width: 650px)');
  const [departmentData, setDepartmentData] = useState([]);
  const [designationData, setDesignationData] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [showCPassword, setShowCPassword] = useState(false);
  const [reportingData, setReportingData] = useState(false);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [userData, setUserData] = useState([]);
  const [load, setLoad] = useState(true);
  const [errors, setErrors] = useState({});
  const [refreshTable, setRefreshTable] = useState(false);
  const [progressLoading, setProgressLoading] = useState(true)
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
      field: 'userName',
      headerName: 'User Name',
      flex: 1,
      align: 'center',
      cellStyle: { textAlign: 'start',alignContent: 'center' },
      cellRenderer: (params) => <Label sx={{
        cursor: 'pointer',backgroundColor:'whitesmoke',color: `${params.data.color}`, '&:hover': {
          cursor: 'pointer',
        },
      }} onClick={() => { router.push(`/users/info/${params.data.uid}`) }}><Iconify icon="mdi:account-circle" sx={{ marginRight: 0.5, fontSize: '1px' }} />{params.value}</Label>,
    },
    {
      id: '',
      field: 'email',
      headerName: 'Email',
      align: 'center',
      flex: 1,
    },
    {
      id: '',
      field: 'joiningDate',
      headerName: 'Joining Date',
      align: 'center',
      flex: 1,
    },
    {
      id: '',
      field: 'deptName',
      headerName: 'Department',
      align: 'center',
      flex: 1,
    },
    {
      id: '',
      field: 'designName',
      headerName: 'Desgination',
      align: 'center',
      flex: 1,
    },
    {
      id: '',
      field: 'roleName',
      headerName: 'Role',
      align: 'center',
      flex: 1,
    },
    {
      id: '',
      field: 'active',
      headerName: 'Status',
      align: 'center',
      flex: 1,
      cellStyle: { textAlign: 'center' },
      cellRenderer: (params) => <Label color={params.value ? 'success' : 'error'}>{params.value ? 'Active' : 'Inactive'}</Label>,
    },
    {
      id: '',
      field: 'Action',
      align: 'center',
      flex: 1,
      maxWidth: 100,
      headerName: 'Action',
      cellStyle: { textAlign: 'center' },
      cellRenderer: (params) => (
        <Tooltip title="Edit">
          <IconButton
            color="primary"
            sx={{ backgroundColor: 'whitesmoke' }}
            onClick={() => handleEdit(params.data)}
          >
            <Iconify icon="ic:outline-edit-note" />
          </IconButton>
        </Tooltip>
      )
    }
  ])
  const validate = (type) => {
    const error = {};

    if (!user.userName) {
      error.userName = 'Name is required';
    }
    if (!user.email) {
      error.email = 'Email is required';
    }
    if (type !== "edit") {
      if (!user.password) {
        error.password = 'Password is required';
      }
    }
    if (!user.gender) {
      error.gender = 'Gender is required';
    }
    if (!user.mobileNumber) {
      error.mobileNumber = 'MobileNumber is required';
    }
    if (!user.deptCode) {
      error.deptCode = 'Department is required';
    }
    if (!user.designCode) {
      error.designCode = 'Designation is required';
    }
    if (!user.reportingId) {
      error.reportingId = 'Reporting to is required';
    }
    if (!user.roleCode) {
      error.roleCode = 'Role is required';
    }
    if (!user.joiningDate) {
      error.joiningDate = 'Joining date is required';
    }
    setErrors(error);
    return Object.keys(error).length === 0;
  };

  const handleRefresh = () => {
    getUserDetails();
    setRefreshTable(!refreshTable);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'deptCode') {
      getUserDesignation(value);
    }
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (
      name === 'gender' ||
      name === 'deptCode' ||
      name === 'designCode' ||
      name === 'reportingId' ||
      name === 'roleCode'
    ) {
      if (!value) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: 'This field is required',
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: '',
        }));
      }
    }

    if (name === 'userName' || name === 'email' || name === 'password') {
      if (!value) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: 'This field is required',
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: '',
        }));
      }
    }

    if (name === 'mobileNumber') {
      const sanitizedValue = value.replace(/[^0-9-]/g, '');
      const truncatedValue = sanitizedValue.slice(0, 10);

      setUser((prevState) => ({
        ...prevState,
        [name]: truncatedValue,
      }));

      if (!truncatedValue) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: 'Mobile is required',
        }));
      } else if (truncatedValue.length !== 10) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: 'Mobile number must be exactly 10 digits',
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: '',
        }));
      }
    }
  };

  const getUserDetails = useCallback(async () => {
    const response = await getUsers();
    setUserData(response);
    setProgressLoading(false);
  }, [getUsers]);

  const getUserDepartment = useCallback(async () => {
    const response = await getDepartmentActive();
    const data = response.map((dept) => <MenuItem value={dept.code}>{dept.name}</MenuItem>);
    setDepartmentData(data);
  }, [getDepartmentActive]);

  const getUserRole = useCallback(async () => {
    const response = await getRolesActive();
    const data = response.map((role) => <MenuItem value={role.code}>{role.name}</MenuItem>);
    setRoleData(data);
    setLoad(false);
  }, [getRolesActive]);

  const getUserDesignation = async (code) => {
    const response = await getDesignationActive(code);
    const data = response.map((design) => <MenuItem value={design.code}>{design.name}</MenuItem>);
    setDesignationData(data);
  };

  const getUsersActive = useCallback(async () => {
    const response = await getActiveUsers();
    const data = response.map((userdata) => (
      <MenuItem value={userdata.uid}>{userdata.userName}</MenuItem>
    ));
    setReportingData(data);
  }, [getActiveUsers]);

  useEffect(() => {
    if (load) {
      getUserDetails();
      getUserDepartment();
      getUserRole();
      getUsersActive();
    }
  }, [load, getUserDetails, getUserDepartment, getUserRole, getUsersActive]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEdit(false);
    setUser({
      id: 0,
      userName: '',
      email: '',
      password: '',
      deptCode: '',
      designCode: '',
      roleCode: '',
      mobileNumber: '',
      gender: '',
      reportingId: '',
      reportingName: '',
      profile: '',
      active: false,
      joiningDate: format(new Date(), 'yyyy-MMM-dd'),
      color: '',
    });
    setErrors('');
  };

  const saveAccount = async () => {
    if (validate("add")) {
      handleClose();
      const response = await saveAppUser(user);
      if (response.status === 'OK') {
        showSnackbar(response.message, 'success');
        getUserDetails();
      } else {
        showSnackbar(response.message, 'warning');
      }
    }
  };

  const updateAccount = async () => {
    if (validate("edit")) {
      handleClose();
      const response = await saveAppUser(user);
      if (response.status === 'OK') {
        showSnackbar(response.message, 'success');
        getUserDetails();
      } else {
        showSnackbar(response.message, 'warning');
      }
    }
  };

  const handleEdit = (row) => {
    setEdit(true);
    getUserDesignation(row.deptCode);
    setUser({
      id: row.id,
      userName: row.userName,
      email: row.email,
      password: row.password,
      deptCode: row.deptCode,
      designCode: row.designCode,
      roleCode: row.roleCode,
      mobileNumber: row.mobileNumber,
      gender: row.gender,
      active: row.active,
      profile: row.profile,
      reportingId: row.reportingId,
      reportingName: row.reportingName,
      joiningDate: row.joiningDate,
      color: row.color,
    });
    setOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUser((prevState) => ({
          ...prevState,
          profile: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };
 
  return (
    <Container maxWidth="xxl">
      <Card sx={{padding:'0 10px 10px 10px'}}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={0}
          px={2}
          py={1}
        >

          <Typography variant="h6" sx={{ color: '#f79520' }}>
            Users
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

          <Dialog
            open={open}
            onBackdropClick="false"
            onClose={handleClose}
            TransitionComponent={Transition}
            keepMounted
            fullWidth
            maxWidth="md"
            PaperProps={{
              component: 'form',
              onSubmit: (event) => {
                event.preventDefault();
                if (edit) {
                  updateAccount();
                } else {
                  saveAccount();
                }
              },
            }}
          >
            <DialogTitle sx={{ color: '#f79520' }}>
              {edit ? 'Update User' : 'Create User'}
            </DialogTitle>
            <DialogContent>
              <Stack spacing={2}>
                <DialogContentText>Manage application users</DialogContentText>
                <Grid
                  container
                  spacing={1}
                  direction="column"
                  justifyContent="center"
                  marginRight={10}
                >
                  <Grid
                    container
                    spacing={1}
                    sx={{ flexDirection: { xs: 'column', md: 'row', lg: 'row' } }}
                    alignItems={{ xs: 'center', md: 'start', lg: 'start' }}
                    justifyContent={{ xs: 'center', md: 'start', lg: 'start' }}
                  >
                    <Grid item xs={6} md={2}>
                      <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="upload-image"
                        type="file"
                        onChange={handleImageChange}
                      />
                      <InputLabel htmlFor="upload-image">
                        <Avatar
                          src={user.profile}
                          alt="Uploaded Profile"
                          sx={{
                            width: 80,
                            height: 80,
                            cursor: 'pointer',
                            border: '1px solid green',
                          }}
                        />
                      </InputLabel>
                      <FormControl fullWidth>
                        <Input
                          id="upload-image"
                          type="file"
                          onChange={handleImageChange}
                          inputProps={{ accept: 'image/*' }}
                          style={{ display: 'none' }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={10} sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: { xs: 'column', md: 'row', sm: 'row' } }}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          autoFocus
                          margin="dense"
                          id="userName"
                          onChange={handleChange}
                          name="userName"
                          value={user.userName}
                          label={
                            <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                              <Iconify
                                sx={{ marginRight: '4px' }}
                                icon="healthicons:ui-user-profile"
                                width="1.2rem"
                                height="1.2rem"
                              />
                              <div> User Name *</div>
                            </Grid>
                          }
                          type="text"
                          fullWidth
                          variant="outlined"
                          error={Boolean(errors.userName)}
                          helperText={errors.userName}
                        />
                      </Grid>

                      <Grid sx={{ width: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <input type="color" name="color" value={user.color} onChange={handleChange} />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    spacing={1}
                    sx={{ flexDirection: { xs: 'column', md: 'row', lg: 'row' } }}
                  >
                    <Grid item xs={12} md={6}>
                      <TextField
                        margin="dense"
                        id="mobileNumber"
                        onChange={handleChange}
                        name="mobileNumber"
                        value={user.mobileNumber}
                        label={
                          <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                            <Iconify
                              sx={{ marginRight: '4px' }}
                              icon="ic:baseline-phone-iphone"
                              width="1.2rem"
                              height="1.2rem"
                            />
                            <div> Mobile Number *</div>
                          </Grid>
                        }
                        type="text"
                        fullWidth
                        variant="outlined"
                        error={Boolean(errors.mobileNumber)}
                        helperText={errors.mobileNumber}
                        inputProps={{
                          maxLength: 10,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        margin="dense"
                        id="email"
                        onChange={handleChange}
                        name="email"
                        value={user.email}
                        label={
                          <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                            <Iconify
                              sx={{ marginRight: '4px' }}
                              icon="line-md:email-twotone"
                              width="1.2rem"
                              height="1.2rem"
                            />
                            <div> Email *</div>
                          </Grid>
                        }
                        type="email"
                        fullWidth
                        variant="outlined"
                        error={errors.email}
                        helperText={errors.email}
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    spacing={1}
                    sx={{ flexDirection: { xs: 'column', md: 'row', lg: 'row' } }}
                  >
                    <Grid item xs={12} md={6} mt={1}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                            <Iconify
                              sx={{ marginRight: '4px' }}
                              icon="mdi:human-genderless"
                              width="1.2rem"
                              height="1.2rem"
                            />
                            <div> Gender *</div>
                          </Grid>
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={user.gender}
                          label={
                            <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                              <Iconify
                                sx={{ marginRight: '4px' }}
                                icon="mdi:human-genderless"
                                width="1.2rem"
                                height="1.2rem"
                              />
                              <div> Gender *</div>
                            </Grid>
                          }
                          name="gender"
                          onBlur={handleChange}
                          onChange={handleChange}
                          error={Boolean(errors.gender)}
                        >
                          <MenuItem value="Male">Male</MenuItem>
                          <MenuItem value="Female">Female</MenuItem>
                          <MenuItem value="Others">Others</MenuItem>
                        </Select>
                        <FormHelperText sx={{ color: 'red' }}>{errors.gender}</FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6} mt={1}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="Join date"
                          value={parse(user.joiningDate, 'yyyy-MMM-dd', new Date())}
                          onChange={(newValue) => {
                            setUser((prevState) => ({
                              ...prevState,
                              joiningDate: format(newValue, 'yyyy-MMM-dd'),
                            }));
                          }}
                          format="yyyy-MMM-dd"
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              error={Boolean(errors.joiningDate)}
                              helperText={errors.joiningDate}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    spacing={1}
                    sx={{ flexDirection: { xs: 'column', md: 'row', lg: 'row' } }}
                  >
                    <Grid item xs={12} md={6} mt={1}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                            <Iconify
                              sx={{ marginRight: '4px' }}
                              icon="majesticons:library-line"
                              width="1.2rem"
                              height="1.2rem"
                            />
                            <div> Department *</div>
                          </Grid>
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={user.deptCode}
                          label={
                            <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                              <Iconify
                                sx={{ marginRight: '4px' }}
                                icon="majesticons:library-line"
                                width="1.2rem"
                                height="1.2rem"
                              />
                              <div> Department *</div>
                            </Grid>
                          }
                          name="deptCode"
                          onBlur={handleChange}
                          onChange={handleChange}
                          error={Boolean(errors.deptCode)}
                        >
                          {departmentData}
                        </Select>
                        <FormHelperText sx={{ color: 'red' }}>{errors.deptCode}</FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6} mt={1}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                            <Iconify
                              sx={{ marginRight: '4px' }}
                              icon="bitcoin-icons:sign-filled"
                              width="1.2rem"
                              height="1.2rem"
                            />
                            <div> Designation *</div>
                          </Grid>
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={user.designCode}
                          label={
                            <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                              <Iconify
                                sx={{ marginRight: '4px' }}
                                icon="mdi:human-genderless"
                                width="1.2rem"
                                height="1.2rem"
                              />
                              <div> Designation *</div>
                            </Grid>
                          }
                          name="designCode"
                          onChange={handleChange}
                          onBlur={handleChange}
                          error={Boolean(errors.designCode)}
                        >
                          {designationData}
                        </Select>
                        <FormHelperText sx={{ color: 'red' }}>{errors.designCode}</FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6} mt={1}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                            <Iconify
                              sx={{ marginRight: '4px' }}
                              icon="ic:round-report"
                              width="1.2rem"
                              height="1.2rem"
                            />
                            <div>Reporting *</div>
                          </Grid>
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={user.reportingId}
                          label={
                            <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                              <Iconify
                                sx={{ marginRight: '4px' }}
                                icon="material-symbols-light:manage-accounts"
                                width="1.2rem"
                                height="1.2rem"
                              />
                              <div>Reporting *</div>
                            </Grid>
                          }
                          name="reportingId"
                          onBlur={handleChange}
                          onChange={handleChange}
                          error={Boolean(errors.reportingId)}
                        >
                          {reportingData}
                        </Select>
                        <FormHelperText sx={{ color: 'red' }}>{errors.reportingId}</FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6} mt={1}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                            <Iconify
                              sx={{ marginRight: '4px' }}
                              icon="solar:user-id-bold-duotone"
                              width="1.2rem"
                              height="1.2rem"
                            />
                            <div>Role *</div>
                          </Grid>
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={user.roleCode}
                          label={
                            <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                              <Iconify
                                sx={{ marginRight: '4px' }}
                                icon="solar:user-id-bold-duotone"
                                width="1.2rem"
                                height="1.2rem"
                              />
                              <div>RoleCode *</div>
                            </Grid>
                          }
                          name="roleCode"
                          onBlur={handleChange}
                          onChange={handleChange}
                          error={Boolean(errors.roleCode)}
                        >
                          {roleData}
                        </Select>
                        <FormHelperText sx={{ color: 'red' }}>{errors.roleCode}</FormHelperText>
                      </FormControl>
                    </Grid>
                    {edit ? null : (
                      <Grid item xs={12} md={6} mt={1}>
                        <TextField
                          fullWidth
                          name="password"
                          value={user.password || ''}
                          label={
                            <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                              <Iconify
                                sx={{ marginRight: '4px' }}
                                icon="mdi:password"
                                width="1.2rem"
                                height="1.2rem"
                              />
                              <div>Password *</div>
                            </Grid>
                          }
                          onChange={handleChange}
                          type={showCPassword ? 'text' : 'password'}
                          error={errors.password}
                          helperText={errors.password}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowCPassword(!showCPassword)}
                                  edge="end"
                                >
                                  <Iconify
                                    icon={showCPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}
                                  />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    )}
                    <Grid item xs={12} md={6} mt={2}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={user.active}
                            color={user.active ? 'success' : 'error'}
                            onChange={(event, value) => {
                              setUser((prevState) => ({
                                ...prevState,
                                active: value,
                              }));
                            }}
                          />
                        }
                        label="Status"
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
        {progressLoading ? <GradientProgress/> :
          <>
            {isSmallScreen ? (
              <ListView
                data={userData}
                onRowClick={uid => router.push(`/users/info/${uid}`)}
                page="user"
              />
            ) : (
              <Datatable
                rowData={userData}
                columnDefs={columnDefs}
                refreshTable={refreshTable}
              />)} </>}
      </Card>
    </Container>
  );
}
