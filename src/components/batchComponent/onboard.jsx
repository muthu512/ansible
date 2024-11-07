import { useState, useEffect, useCallback, useMemo } from 'react';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import Typography from '@mui/material/Typography';
import Label from 'src/components/label';
import {
  Dialog,
  TextField,
  DialogTitle,
  FormControl,
  DialogContent,
  InputAdornment,
  useMediaQuery,
  OutlinedInput,
  Tooltip,
  Grid,
  DialogActions,
  Autocomplete,
  Avatar,
} from '@mui/material';
import useApiService from 'src/services/api_services';
import Iconify from 'src/components/iconify';
import DataTable from 'src/components/datatable/data-table';
import { useRouter } from 'src/routes/hooks';
import GradientProgress from '../progress/gradientProgress';
import ListView from '../List-view-component/ListView';


export default function StudentOnboard() {
  const { getCourseActive, studentOnboardTable } = useApiService();
  const [progressLoading , setProgressLoading] = useState(true)
  const [searchText, setSearchText] = useState('');
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const isSmallScreen = useMediaQuery('(max-width: 700px)');
  const router = useRouter();

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };

  const quickFilterText = searchText.trim();

  const defaultColDef = useMemo(
    () => ({
      filter: 'agTextColumnFilter',
    }),
    []
  );
  const smallscreen = useMediaQuery('(min-width: 450px)');
  
  const [columnDefs] = useState([
    {
      field: 'S.no',
      valueGetter: 'node.rowIndex + 1',
      align: 'center',
      flex: 1,
      maxWidth: 100,
      filter: false,

    },
    {
      field: 'studentName',
      flex: 2,
      cellRenderer: (params) => (
        <Label
          onClick={() => {
            router.push(`/crm/customer/${params.data.cid}`);
          }}
          sx={{
            margin: '11px',
            '&:hover': {
              color: 'blue',
              cursor: 'pointer',
            },
          }}
        >
          {' '}
          <Iconify icon="mdi:account-circle" sx={{ marginRight: 0.5, fontSize: '1px' }} />
          {params.value}
        </Label>
      ),
    },
    {
      field: 'batchTitle',
      align: 'center',
      flex: 2,
      cellRenderer: (params) => <Label color="warning">{params.value}</Label>,
  },
    {
      field: 'courseName',
      align: 'center',
      flex: 2,
      cellRenderer: (params) => <Label color="primary">{params.value}</Label>,
  },
  {
    field: 'scheduleTime',
    align: 'center',
    flex: 2,
    cellRenderer: (params) => <Label color="secondary">{params.value}</Label>,
},
    { field:'startDate', flex:2},
    { field:'endDate', flex:2},
    {
      id: '',
      field: 'trainnerName',
      align: 'center',
      flex: 2,
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
            <Avatar sx={{ height: '18px', width: '18px', marginRight: '5px', fontSize: '10px' }}/>

            {params.value}
          </Label>
        ),
  },
  {
      id: '',
      field: 'altTrainnerName',
      align: 'center',
      flex: 2,
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
            <Avatar sx={{ height: '18px', width: '18px', marginRight: '5px', fontSize: '10px' }}/>

            {params.value}
          </Label>
        ),
  },
  {
      id: '',
      field: 'reportingName',
      align: 'center',
      flex: 2,
      cellRenderer: (params) => (
          <Label
            onClick={() => {
              router.push(`/users/info/${params.data.reportingId}`);
            }}
            sx={{
              margin: '11px',
              '&:hover': {
                color: 'blue',
                cursor: 'pointer',
              },
            }}
          >
            <Avatar sx={{ height: '18px', width: '18px', marginRight: '5px', fontSize: '10px' }}/>
            {params.value}
          </Label>
        ),
  },
  {
      id: '',
      field: 'status',
      align: 'center',
      flex: 2,
      cellRenderer: (params) => (
          <Label
            color={params.value === 'NEW' ? 'info' : params.value === 'Closed' ? 'error' : 'success'}
          >
            {params.value}
          </Label>
        ),
  },
    ]);
  const [open, setOpen] = useState(false);
  const [load, setLoad] = useState(true);
  const [courseData, setCourseData] = useState([]);
  const [getOnboardData, setGetOnboardData] = useState([]);

  const getCourse = useCallback(async () => {
    const response = await getCourseActive();
    const data = response.map((course) => <MenuItem value={course.code}>{course.name}</MenuItem>);
    setCourseData(data);
  }, [getCourseActive]);

  const getOnboardTable = useCallback(async () => {
    const response = await studentOnboardTable();
    setGetOnboardData(response);
    setProgressLoading(false)
  },[studentOnboardTable]);

  useEffect(() => {
    if (load) {
      getCourse();
      getOnboardTable();
      setLoad(false);
    }
  }, [load, getCourse,getOnboardTable]);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
    {progressLoading ? <GradientProgress/> : 
    <Container maxWidth="xxl">
      <Card sx={{padding:'0 10px 10px 10px'}}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={0} p={1}>
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
                borderRadius: '10px',
              },
            }}
          >
            <KeyboardArrowLeftIcon />
            <Tooltip title="back">
              <Typography variant="h6">Onboard</Typography>
            </Tooltip>
          </Stack>

          <OutlinedInput
            value={searchText}
            onChange={handleSearchTextChange}
            placeholder="Search...."
            sx={{ height: 36, marginRight: '20px', display: smallscreen ? '' : 'none' }}
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
            sx={{ display: 'none' }}
          >
            New
          </Button>
          <Dialog
            open={open}
            onClose={handleClose}
            onBackdropClick="false"
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleClose();
            }}
          >
            <DialogTitle>Student Onboard</DialogTitle>
            <DialogContent sx={{ minWidth: '40vw' }}>
              <Stack spacing={2}>
                <Grid item xs={12} md={12}>
                  <TextField
                    margin="normal"
                    fullWidth
                    id="name"
                    name="name"
                    label="Student Name"
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <FormControl fullWidth>
                    <Autocomplete
                      multiple
                      id="coursesTypeCode"
                      options={courseData}
                      getOptionLabel={(option) => option.name}
                      onChange={(event, value) => setSelectedCourses(value)}
                      renderInput={(params) => <TextField {...params} label="Course Type" />}
                    >
                      {selectedCourses}
                    </Autocomplete>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    margin="normal"
                    fullWidth
                    id="batch"
                    name="batch"
                    label="Batch"
                    type="text"
                    value={selectedBatches}
                    onChange={(e) => setSelectedBatches(e.target.value)}
                    placeholder="Enter Batch"
                  />
                </Grid>
                <Grid
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <DialogActions>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="warning"
                      sx={{ mb: 1, maxWidth: '180px', mt: 1, color: 'whitesmoke' }}
                      onClick={handleClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      sx={{ mb: 1, maxWidth: '180px', mt: 1 }}
                    >
                      Submit
                    </Button>
                  </DialogActions>
                </Grid>
              </Stack>
            </DialogContent>
          </Dialog>
        </Stack>
        {isSmallScreen ? (
          <ListView
            data={getOnboardData}
            onRowClick={uid => router.push(`/crm/customer/${uid}`)}
            page="Onboard"
          />
        ) : (

          <DataTable
            quickFilterText={quickFilterText}
            rowData={getOnboardData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
          /> )}

      </Card>
    </Container> } </>
  );
}
