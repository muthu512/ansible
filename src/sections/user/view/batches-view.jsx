import { useState, forwardRef, useCallback, useEffect, useMemo } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Slide from '@mui/material/Slide';
// import Table from '@mui/material/Table';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
// import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
// import TableContainer from '@mui/material/TableContainer';
// import TablePagination from '@mui/material/TablePagination';
import Grid from '@mui/material/Grid';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RefreshIcon from '@mui/icons-material/Refresh';

import {
  Select,
  // MenuItem,
  TextField,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogActions,
  FormControl,
  DialogContent,
  DialogContentText,
  MenuItem,
  Avatar,
  Tooltip,
  IconButton,
  useMediaQuery,
  OutlinedInput,
  InputAdornment
  // FormControlLabel,
  // Checkbox,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';
import DataTable from 'src/components/datatable/data-table';

import useApiService from 'src/services/api_services';

import Iconify from 'src/components/iconify';
// import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snakbar/SnackbarContext';

// import UserTableRow from 'src/sections/user/user-table-row';
// import UserTableHead from 'src/sections/user/user-table-head';
// import UserTableToolbar from 'src/sections/user/user-table-toolbar';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parse } from 'date-fns';
import Label from 'src/components/label';
import ListView from '../../../components/List-view-component/ListView';
import GradientProgress from '../../../components/progress/gradientProgress';

// import TableNoData from '../table-no-data';
// import TableEmptyRows from '../table-empty-rows';
// import {  applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------
const Transition = forwardRef((props, ref) => <Slide direction="left" ref={ref} {...props} />);

export default function BatchesView() {
  const router = useRouter();

  const { showSnackbar } = useSnackbar();

  const { createBatches, getAllBatches, getCourseActive, getUsersByDepartment, getSyllabusByCourse,deleteBatches } = useApiService();

  const isSmallScreen = useMediaQuery('(max-width: 650px)');

  const [batches, setBatches] = useState({
    id: 0,
    courseCode: '',
    courseName: '',
    title: '',
    scheduleTime: '',
    startDate: format(new Date(), 'yyyy-MMM-dd'),
    endDate: format(new Date(), 'yyyy-MMM-dd'),
    trainnerId: '',
    trainnerName: '',
    altTrainnerId: '',
    altTrainnerName: '',
    reportingId: '',
    repotingName: '',
    description: '',
    syllabusId: '',
    status: '',
  });

  // const [courseTypeData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const quickFilterText = searchText.trim();
  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };
  const smallscreen = useMediaQuery('(min-width: 450px)');
  const [batchesData, setBatchesData] = useState([]);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [load, setLoad] = useState(true);
  const [courseData, setCourseData] = useState([]);
  const [syllabusData, setSyllabusData] = useState([]);
  const [errors, setError] = useState({});
  const [assigneData, setAssigeData] = useState([]);
  const [reportingData, setReportingData] = useState([]);
  const [refreshTable, setRefreshTable] = useState(false);
  const [progressLoading , setProgressLoading] = useState(true);
  
  const deleteBatch = async(id) =>{
    const response = await deleteBatches(id);
    if (response.status === 'OK') {
      showSnackbar(response.message, 'success');
      getAllBatchesDetails();
    } else {
      showSnackbar(response.message, 'warning');
    }
  }

  const [columnDefs] = useState([
    {
      id: '',
      field: 'S.no',
      valueGetter: 'node.rowIndex + 1',
      align: 'center',
      flex: 1,
      maxWidth: 80,
      filter: false,

    },
    {
      id: '',
      field: 'title',
      align: 'center',
      flex: 1,
    },
    {
      id: '',
      field: 'scheduleTime',
      align: 'center',
      flex: 1,
    },
    {
      id: '',
      field: 'courseName',
      align: 'center',
      flex: 1,
      cellRenderer: (params) => <Label color="primary">{params.value}</Label>,
    },
    {
      id: '',
      field: 'syllabusName',
      align: 'center',
      flex: 1,
      cellRenderer: (params) => 
      <Label color="secondary" onClick={()=>{router.push(`/master/syllabus/${params.data.syllabusId}`)}}>
        {params.value}
      </Label>,
    },

    {
      id: '',
      field: 'startDate',
      align: 'center',
      flex: 1,
    },
    {
      id: '',
      field: 'endDate',
      align: 'center',
      flex: 1,
    },
    {
      id: '',
      field: 'trainnerName',
      align: 'center',
      flex: 1,
      cellRenderer: (params) => (
        <Label
          onClick={() => {
            router.push(`/users/info/${params.data.trainnerId}`);
          }}
          sx={{
            margin: '11px',
            '&:hover': {
              color: 'blue',
              cursor: 'pointer',
            },
          }}
        >
          <Avatar sx={{ height: '18px', width: '18px', marginRight: '5px', fontSize: '10px' }}>
            {params.data.trainnerName.charAt(0).toUpperCase()}
          </Avatar>
          {params.value}
        </Label>
      ),
    },
    {
      id: '',
      field: 'altTrainnerName',
      align: 'center',
      flex: 1,
      cellRenderer: (params) => (
        <Label
          onClick={() => {
            router.push(`/users/info/${params.data.altTrainnerId}`);
          }}
          sx={{
            margin: '11px',
            '&:hover': {
              color: 'blue',
              cursor: 'pointer',
            },
          }}
        >
          <Avatar sx={{ height: '18px', width: '18px', marginRight: '5px', fontSize: '10px' }}>
            {params.data.altTrainnerName.charAt(0).toUpperCase()}
          </Avatar>
          {params.value}
        </Label>
      ),
    },
    {
      id: '',
      field: 'repotingName',
      align: 'center',
      flex: 1,
      cellRenderer: (params) => (
        <Label
          onClick={() => {
            router.push(`/users/info/${params.data.reportingId}`);
          }}
          sx={{
            margin: '11px',
            color:`${params.data.color}`,
            '&:hover': {
              color: 'blue',
              cursor: 'pointer',
            },
          }}
        >
          <Avatar sx={{ height: '18px', width: '18px', marginRight: '5px',backgroundColor:`${params.data.color}`, fontSize: '10px' }}>
            {params.data.repotingName.charAt(0).toUpperCase()}
          </Avatar>
          {params.value}
        </Label>
      ),
    },
    {
      id: '',
      field: 'status',
      align: 'center',
      flex: 1,
      cellRenderer: (params) => (
        <Label
          color={params.value === 'NEW' ? 'info' : params.value === 'Closed' ? 'error' : 'success'}
        >
          {params.value}
        </Label>
      ),
    },
    {
      id: '',
      field: 'Actions',
      align: 'center',
      flex: 1,
      cellRenderer: (params) => (
        <>
        <Tooltip title="Edit">
          <IconButton
            color="primary"
            // sx={{ backgroundColor: 'whitesmoke' }}
            onClick={() => {
              handleEdit(params.data);
            }}
          >
            <Iconify icon="ic:outline-edit-note" />
          </IconButton>
        </Tooltip>
           
        <Tooltip title="Delete">
         <IconButton
           onClick={() => {
            deleteBatch(params.data.id);
           }}
         >
           <Iconify icon="material-symbols:delete-outline-rounded" sx={{ color: 'red' }} />
         </IconButton>
       </Tooltip>
        </>
      ),
    },
  ]);

  const getAllBatchesDetails = useCallback(async () => {
    const response = await getAllBatches();
    setBatchesData(response);
    setProgressLoading(false);
  }, [getAllBatches]);

  const getCourse = useCallback(async () => {
    const response = await getCourseActive();
    const data = response.map((course) => <MenuItem value={course.code}>{course.name}</MenuItem>);
    setCourseData(data);
  }, [getCourseActive]);

  const getSyllabus = useCallback(async (courseCode) => {
    const response = await getSyllabusByCourse(courseCode);
    const data = response.map((syllabus) => <MenuItem value={syllabus.id}>{syllabus.title}</MenuItem>);
    setSyllabusData(data);
  }, [getSyllabusByCourse]);

  const getUsersActive = useCallback(async () => {
    const response = await getUsersByDepartment("TR");
    const data = response.map((user) => (
      <MenuItem sx={{ maxHeight: '300px' }} value={user.uid}>
        {user.userName}
      </MenuItem>
    ));
    setAssigeData(data);
    setReportingData(data);
  }, [getUsersByDepartment]);

  useEffect(() => {
    if (load) {
      getCourse();
      getUsersActive();
      getAllBatchesDetails();
      setLoad(false);
    }
  }, [load, getAllBatchesDetails, getCourse, getUsersActive]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEdit(false);
    setBatches({
      id: 0,
      courseCode: '',
      courseName: '',
      title: '',
      scheduleTime: '',
      startDate: format(new Date(), 'yyyy-MMM-dd'),
      endDate: format(new Date(), 'yyyy-MMM-dd'),
      trainnerId: '',
      trainnerName: '',
      altTrainnerId: '',
      altTrainnerName: '',
      reportingId: '',
      repotingName: '',
      description: '',
      syllabusId: '',
      status: '',
    });
    setError('');
  };

  const saveBatches = async () => {
    const response = await createBatches(batches);
    if (response.status === 'OK') {
      showSnackbar(response.message, 'success');
      getAllBatchesDetails();
    } else {
      showSnackbar(response.message, 'warning');
    }
  };

  const updateBatches = async () => {
    const response = await createBatches(batches);
    if (response.status === 'OK') {
      showSnackbar(response.message, 'success');
      getAllBatchesDetails();
    } else {
      showSnackbar(response.message, 'warning');
    }
  };



  const handleChange = (e) => {
    const { name, value } = e.target;
    setBatches((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (name === 'courseCode') {
      getSyllabus(value);
    }
  };
  const handleEdit = async (row) => {
    setEdit(true);
    await getSyllabus(row.courseCode);
    setBatches({
      id: row.id,
      courseCode: row.courseCode,
      courseName: row.courseName,
      title: row.title,
      scheduleTime: row.scheduleTime,
      startDate: row.startDate,
      endDate: row.endDate,
      trainnerId: row.trainnerId,
      trainnerName: row.trainnerName,
      altTrainnerId: row.altTrainnerId,
      altTrainnerName: row.altTrainnerName,
      reportingId: row.reportingId,
      repotingName: row.repotingName,
      description: row.description,
      syllabusId: row.syllabusId,
      status: row.status,
    });
    setOpen(true);
  };

  const handleRefresh = () => {
    getAllBatchesDetails();
    setRefreshTable(!refreshTable); 
  };


  const defaultColDef = useMemo(
    () => ({
      filter: 'agTextColumnFilter',
    }),
    []
  );

  return (
    <Container maxWidth="xxl">
      <Card sx={{padding:'0 10px 10px 10px',marginBottom:'10px'}}>
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
            <Typography variant="h6">Batch</Typography>
          </Stack>

          <div style={{ display: 'flex', gap: 10 }}>

            <Stack spacing={2} direction="row">
              <Button variant="text" onClick={handleRefresh}>
                <RefreshIcon />
              </Button>
            </Stack>

            <OutlinedInput
              value={searchText}
              onChange={handleSearchTextChange}
              placeholder="Search...."
              sx={{ height: 36, display: smallscreen ? '' : 'none' }}
              startAdornment={
                <InputAdornment position="start">
                  <Iconify
                    icon="eva:search-fill"
                    sx={{ color: 'text.disabled', width: 20, height: 20 }}
                  />
                </InputAdornment>
              }
            />

            <Button
              variant="contained"
              color="inherit"
              onClick={handleClickOpen}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New
            </Button>
          </div>

          <Dialog
            onBackdropClick="false"
            open={open}
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
                  updateBatches();
                } else {
                  saveBatches();
                }
                handleClose();
              },
            }}
          >
            <DialogTitle sx={{ color: '#f79520' }}>
              {edit ? 'Update batches' : 'Create batches'}
            </DialogTitle>
            <DialogContent>
              <Stack spacing={2}>
                <DialogContentText>Manage Batches</DialogContentText>

                <Grid
                  container
                  spacing={1}
                  sx={{ flexDirection: { xs: 'column', md: 'row', lg: 'row' } }}
                >
                  <Grid item md={4}>
                    <TextField
                      autoFocus
                      // required
                      margin="dense"
                      id="name"
                      onChange={handleChange}
                      onBlur={handleChange}
                      name="title"
                      value={batches.title}
                      label={
                        <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                          <Iconify
                            style={{ marginRight: '4px' }}
                            icon="carbon:batch-job-step"
                            width="1.2rem"
                            height="1.2rem"
                          />
                          <div> Batch Name *</div>
                        </Grid>
                      }
                      type="text"
                      fullWidth
                      variant="outlined"
                      error={Boolean(errors.name)}
                      helperText={errors.name}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      // required
                      margin="dense"
                      id="duration"
                      onChange={handleChange}
                      onBlur={handleChange}
                      name="scheduleTime"
                      value={batches.scheduleTime}
                      label={
                        <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                          <AccessTimeIcon sx={{ marginRight: '4px' }} />

                          <div> Timming (hr:min) *</div>
                        </Grid>
                      }
                      type="text"
                      fullWidth
                      variant="outlined"
                      error={Boolean(errors.duration)}
                      helperText={errors.duration}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        sx={{ marginTop: 1, width: 1 }}
                        label="start Date"
                        value={parse(batches.startDate, 'yyyy-MMM-dd', new Date())}
                        onChange={(newValue) => {
                          setBatches((prevState) => ({
                            ...prevState,
                            startDate: format(newValue, 'yyyy-MMM-dd'),
                          }));
                        }}
                        format="yyyy-MMM-dd"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={Boolean(errors.enquiryDate)}
                            helperText={errors.enquiryDate}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        sx={{ marginTop: 1, width: 1 }}
                        label="End Date"
                        value={parse(batches.endDate, 'yyyy-MMM-dd', new Date())}
                        onChange={(newValue) => {
                          setBatches((prevState) => ({
                            ...prevState,
                            endDate: format(newValue, 'yyyy-MMM-dd'),
                          }));
                        }}
                        format="yyyy-MMM-dd"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={Boolean(errors.enquiryDate)}
                            helperText={errors.enquiryDate}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} md={4} mt={1}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                          <Iconify
                            sx={{ marginRight: '4px' }}
                            icon="hugeicons:course"
                            width="1.2rem"
                            height="1.2rem"
                          />
                          <div> Course *</div>
                        </Grid>
                      </InputLabel>
                      <Select
                        MenuProps={{
                          style: {
                            maxHeight: 300,
                          },
                        }}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label={
                          <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                            <Iconify
                              sx={{ marginRight: '4px' }}
                              icon="hugeicons:course"
                              width="1.2rem"
                              height="1.2rem"
                            />
                            <div> Course *</div>
                          </Grid>
                        }
                        name="courseCode"
                        onChange={handleChange}
                        onBlur={handleChange}
                        value={batches.courseCode}
                        error={Boolean(errors.coursesTypeCode)}
                        helperText={errors.coursesTypeCode}
                        required
                      >
                        {courseData}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4} mt={1}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                          <Iconify
                            sx={{ marginRight: '4px' }}
                            icon="hugeicons:course"
                            width="1.2rem"
                            height="1.2rem"
                          />
                          <div> Syllabus *</div>
                        </Grid>
                      </InputLabel>
                      <Select
                        MenuProps={{
                          style: {
                            maxHeight: 300,
                          },
                        }}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label={
                          <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                            <Iconify
                              sx={{ marginRight: '4px' }}
                              icon="hugeicons:course"
                              width="1.2rem"
                              height="1.2rem"
                            />
                            <div> Syllabus *</div>
                          </Grid>
                        }
                        name="syllabusId"
                        onChange={handleChange}
                        onBlur={handleChange}
                        value={batches.syllabusId}
                        error={Boolean(errors.syllabusId)}
                        helperText={errors.syllabusId}
                        required
                      >
                        {syllabusData}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={4} mt={1}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                          <Iconify
                            sx={{ marginRight: '4px' }}
                            icon="line-md:person-twotone"
                            width="1.2rem"
                            height="1.2rem"
                          />
                          <div> Trainer *</div>
                        </Grid>
                      </InputLabel>
                      <Select
                        MenuProps={{
                          style: {
                            maxHeight: 300,
                          },
                        }}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={batches.trainnerId}
                        label={
                          <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                            <Iconify
                              sx={{ marginRight: '4px' }}
                              icon="line-md:person-twotone"
                              width="1.2rem"
                              height="1.2rem"
                            />
                            <div> Trainer *</div>
                          </Grid>
                        }
                        name="trainnerId"
                        onChange={handleChange}
                        onBlur={handleChange}
                        error={Boolean(errors.coursesTypeCode)}
                        helperText={errors.coursesTypeCode}
                      // required
                      >
                        {assigneData}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4} mt={1}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                          <Iconify
                            sx={{ marginRight: '4px' }}
                            icon="line-md:document-report-twotone"
                            width="1.2rem"
                            height="1.2rem"
                          />
                          <div> Reporting *</div>
                        </Grid>
                      </InputLabel>
                      <Select
                        MenuProps={{
                          style: {
                            maxHeight: 300,
                          },
                        }}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={batches.reportingId}
                        label={
                          <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                            <Iconify
                              sx={{ marginRight: '4px' }}
                              icon="line-md:document-report-twotone"
                              width="1.2rem"
                              height="1.2rem"
                            />
                            <div> Reporting *</div>
                          </Grid>
                        }
                        name="reportingId"
                        onChange={handleChange}
                        onBlur={handleChange}
                        error={Boolean(errors.coursesTypeCode)}
                        helperText={errors.coursesTypeCode}
                        required
                      >
                        {reportingData}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4} mt={1}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                          <Iconify
                            sx={{ marginRight: '4px' }}
                            icon="fluent:person-sync-28-filled"
                            width="1.2rem"
                            height="1.2rem"
                          />
                          <div>Alt.Trainer *</div>
                        </Grid>
                      </InputLabel>
                      <Select
                        MenuProps={{
                          style: {
                            maxHeight: 300,
                          },
                        }}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={batches.altTrainnerId}
                        label={
                          <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                            <Iconify
                              sx={{ marginRight: '4px' }}
                              icon="fluent:person-sync-28-filled"
                              width="1.2rem"
                              height="1.2rem"
                            />
                            <div>Alt.Trainer *</div>
                          </Grid>
                        }
                        name="altTrainnerId"
                        onChange={handleChange}
                        onBlur={handleChange}
                        error={Boolean(errors.coursesTypeCode)}
                        helperText={errors.coursesTypeCode}
                        required
                      >
                        {assigneData}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4} mt={1}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                          <Iconify
                            sx={{ marginRight: '4px' }}
                            icon="f7:status"
                            width="1.2rem"
                            height="1.2rem"
                          />
                          <div>Status *</div>
                        </Grid>
                      </InputLabel>
                      <Select
                        MenuProps={{
                          style: {
                            maxHeight: 300,
                          },
                        }}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={batches.status}
                        label={
                          <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                            <Iconify
                              sx={{ marginRight: '4px' }}
                              icon="f7:status"
                              width="1.2rem"
                              height="1.2rem"
                            />
                            <div>Status *</div>
                          </Grid>
                        }
                        name="status"
                        onChange={handleChange}
                        onBlur={handleChange}
                        error={Boolean(errors.coursesTypeCode)}
                        helperText={errors.coursesTypeCode}
                      // required
                      >
                        <MenuItem value="New"> New</MenuItem>
                        <MenuItem value="Active"> Active</MenuItem>
                        <MenuItem value="Closed"> Closed</MenuItem>
                      </Select>
                    </FormControl>
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
            data={batchesData}
            // onRowClick={uid => router.push(`/users/info/${uid}`)}
            page="batchtable"
          />
        ) : (
          <DataTable
            quickFilterText={quickFilterText}
            rowData={batchesData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            refreshTable={refreshTable}
          />)}</> }
      </Card>
    </Container>
  );
}
