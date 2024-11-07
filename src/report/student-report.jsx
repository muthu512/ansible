import * as React from 'react';
import { useRouter } from 'src/routes/hooks';
import { Container, useMediaQuery } from '@mui/system';
import './crmReportStyle.css';
import {
  TextField,
  Grid,
  Button,
  Tooltip,
  Card,
  IconButton,
  Typography,
  InputAdornment,
  OutlinedInput,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { styled } from '@mui/material/styles';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { format, parse } from 'date-fns';
import { useState, useCallback } from 'react';
import useApiService from 'src/services/api_services';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Iconify from '../components/iconify';
import DataTable from '../components/datatable/data-table';
import Label from '../components/label';
import ListView from '../components/List-view-component/ListView';

export default function StudentReport() {
  const router = useRouter();
  const [load, setLoad] = useState(true);
  const { getCourseActive, getBatchCourses, searchReportStudent, downloadStudentReport } =
    useApiService();
  const [showForm, setShowForm] = useState(false);
  const [courseData, setCourseData] = useState([]);
  const [batchData, setBatchData] = useState([]);
  const [report, setReport] = useState([]);
  const [downloadProgress, setDownloadProgress] = useState(false)
  const isSmallScreen = useMediaQuery('(max-width: 650px)');
  // const toSmallScreen = useMediaQuery('(max-width: 400px)');

  const [searchStudentReport, setSearchStudentReport] = useState({
    fromDate: format(new Date(), 'yyyy-MMM-dd'),
    toDate: format(new Date(), 'yyyy-MMM-dd'),
    batch: '',
    course: '',
    attendanceType: 'both',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'course') {
      getBatchDetails(value);
    }
    setSearchStudentReport((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleClear = (event) => {
    setSearchStudentReport({
      fromDate: format(new Date(), 'yyyy-MMM-dd'),
      toDate: format(new Date(), 'yyyy-MMM-dd'),
      batch: '',
      course: '',
      attendanceType: 'both',
    });
  };

  const getBatchDetails = React.useCallback(
    async (code) => {
      const response = await getBatchCourses(code);
      const data = response.map((batch) => (
        <MenuItem value={batch.id} label={batch.name}>
          {batch.title}
        </MenuItem>
      ));
      setBatchData(data);
    },
    [getBatchCourses]
  );

  const getCourse = React.useCallback(async () => {
    const response = await getCourseActive();
    const data = response.map((course) => <MenuItem value={course.code}>{course.name}</MenuItem>);
    setCourseData(data);
  }, [getCourseActive]);

  const search = React.useCallback(
    async (searchData) => {
      const response = await searchReportStudent(searchData);
      setReport(response);
      localStorage.setItem('searchResults', JSON.stringify(response));
      setDownloadProgress(false);
    },
    [searchReportStudent]
  );

  const downloadStudentTableData = useCallback(
    async (searchReportData) => {
      const response = await downloadStudentReport(searchReportData);
      const disposition = response.headers['content-disposition'];
      let filename = 'Student_report.xlsx';
      if (disposition && disposition.indexOf('filename=') !== -1) {
        const matches = disposition.match(/filename="(.+)"/);
        if (matches != null && matches[1]) {
          filename = matches[1];
        }
      }
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    [downloadStudentReport]
  );

  const handleFindClick = () => {
    search(searchStudentReport);
    setShowForm(false);
  };
  const handleShowForm = () => {
    setShowForm(true);
  };

  const handleExportToExcel = () => {
    setDownloadProgress(true)
    downloadStudentTableData(searchStudentReport).finally(() => {
      setDownloadProgress(false)
    });
  };

  React.useEffect(() => {
    if (load) {
      getCourse();
      setLoad(false);
      const storedData = JSON.parse(localStorage.getItem('searchResults'));
      if (storedData) {
        setReport(storedData); // Set the reports state with the stored data
      }
    }
  }, [load, getCourse]);

  const [columnDefs] = useState([
    {
      id: '',
      field: 'S.no',
      valueGetter: 'node.rowIndex + 1',
      align: 'center',
      headerName: 'S.No',
      flex: 1,
      maxWidth: 80,
      filter: false,
      cellStyle: { textAlign: 'center' },
    },
    {
      id: '',
      field: 'studentName',
      headerName: 'Name',
      flex: 1,
      cellRenderer: (params) => (
        <Label
          onClick={() =>
            router.push(`/student/batches/${params.data.batchId}/${params.data.attDate}`)
          }
          color="secondary"
          sx={{ cursor: 'pointer' }}
        >
          {params.value}
        </Label>
      ),
    },
    {
      id: '',
      field: 'mobileNumber',
      flex: 1,
      cellStyle: { textAlign: 'center' },
      headerName: 'Mobile Number',
      cellRenderer: (params) => <Label color="primary">{params.value}</Label>,
    },
    {
      id: '',
      field: 'location',
      flex: 1,
      cellStyle: { textAlign: 'center' },
      headerName: 'Location',
      cellRenderer: (params) => <Label color="primary">{params.value}</Label>,
    },
    {
      id: '',
      field: 'paymentStatus',
      flex: 1,
      cellStyle: { textAlign: 'center' },
      headerName: 'Payment Status',
      cellRenderer: (params) => <Label color="primary">{params.value}</Label>,
    },
    {
      id: '',
      field: 'amount',
      flex: 1,
      cellStyle: { textAlign: 'center' },
      headerName: 'Amount',
      cellRenderer: (params) => <Label color="primary">{params.value}</Label>,
    },
    {
      id: '',
      field: 'totalPresent',
      align: 'center',
      cellStyle: { textAlign: 'center' },
      flex: 1,
      headerName: 'Total Present',
      cellRenderer: (params) => <Label color="success">{params.value}</Label>,
    },
    {
      id: '',
      field: 'totalAbsent',
      align: 'center',
      cellStyle: { textAlign: 'center' },
      flex: 1,
      headerName: 'Total Absent',
      cellRenderer: (params) => <Label color="error">{params.value}</Label>,
    },
  ]);

  const [columnDefsPresent] = useState([
    {
      id: '',
      field: 'S.no',
      valueGetter: 'node.rowIndex + 1',
      align: 'center',
      headerName: 'S.No',
      flex: 1,
      maxWidth: 80,
      filter: false,
      cellStyle: { textAlign: 'center' },
    },
    {
      id: '',
      field: 'studentName',
      headerName: 'Name',
      flex: 1,
      cellRenderer: (params) => (
        <Label
          onClick={() =>
            router.push(`/student/batches/${params.data.batchId}/${params.data.attDate}`)
          }
          color="secondary"
          sx={{ cursor: 'pointer' }}
        >
          {params.value}
        </Label>
      ),
    },
    {
      id: '',
      field: 'mobileNumber',
      flex: 1,
      cellStyle: { textAlign: 'center' },
      headerName: 'Mobile Number',
      cellRenderer: (params) => <Label color="primary">{params.value}</Label>,
    },
    {
      id: '',
      field: 'location',
      flex: 1,
      cellStyle: { textAlign: 'center' },
      headerName: 'Location',
      cellRenderer: (params) => <Label color="primary">{params.value}</Label>,
    },
    {
      id: '',
      field: 'paymentStatus',
      flex: 1,
      cellStyle: { textAlign: 'center' },
      headerName: 'Payment Status',
      cellRenderer: (params) => <Label color="primary">{params.value}</Label>,
    },
    {
      id: '',
      field: 'amount',
      flex: 1,
      cellStyle: { textAlign: 'center' },
      headerName: 'Amount',
      cellRenderer: (params) => <Label color="primary">{params.value}</Label>,
    },
    {
      id: '',
      field: 'totalPresent',
      align: 'center',
      cellStyle: { textAlign: 'center' },
      flex: 1,
      headerName: 'Total Present',
      cellRenderer: (params) => <Label color="success">{params.value}</Label>,
    },
  ]);

  const [columnDefsAbsent] = useState([
    {
      id: '',
      field: 'S.no',
      valueGetter: 'node.rowIndex + 1',
      align: 'center',
      headerName: 'S.No',
      flex: 1,
      maxWidth: 80,
      filter: false,
      cellStyle: { textAlign: 'center' },
    },
    {
      id: '',
      field: 'studentName',
      headerName: 'Name',
      flex: 1,
      cellRenderer: (params) => (
        <Label
          onClick={() =>
            router.push(`/student/batches/${params.data.batchId}/${params.data.attDate}`)
          }
          color="secondary"
          sx={{ cursor: 'pointer' }}
        >
          {params.value}
        </Label>
      ),
    },
    {
      id: '',
      field: 'mobileNumber',
      flex: 1,
      cellStyle: { textAlign: 'center' },
      headerName: 'Mobile Number',
      cellRenderer: (params) => <Label color="primary">{params.value}</Label>,
    },
    {
      id: '',
      field: 'location',
      flex: 1,
      cellStyle: { textAlign: 'center' },
      headerName: 'Location',
      cellRenderer: (params) => <Label color="primary">{params.value}</Label>,
    },
    {
      id: '',
      field: 'paymentStatus',
      flex: 1,
      cellStyle: { textAlign: 'center' },
      headerName: 'Payment Status',
      cellRenderer: (params) => <Label color="primary">{params.value}</Label>,
    },
    {
      id: '',
      field: 'amount',
      flex: 1,
      cellStyle: { textAlign: 'center' },
      headerName: 'Amount',
      cellRenderer: (params) => <Label color="primary">{params.value}</Label>,
    },
    {
      id: '',
      field: 'totalAbsent',
      align: 'center',
      cellStyle: { textAlign: 'center' },
      flex: 1,
      headerName: 'Total Absent',
      cellRenderer: (params) => <Label color="error">{params.value}</Label>,
    },
  ]);

  const CustomDatePicker = styled(DatePicker)({
    '& .MuiOutlinedInput-root': {
      height: '100%',
    },
  });

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          color: '#f79520',
          padding: '10px',
          marginLeft: '10px',
          '&:hover': {
            color: 'blue',
            cursor: 'pointer',
          },
        }}
      >
        {showForm === true ? (
          <Stack
            direction="row"
            onClick={() => router.back()}
            sx={{
              color: '#f79520',
              '&:hover': {
                color: 'blue',
                cursor: 'pointer',
              },
            }}
          >
            <KeyboardArrowLeftIcon />
            <Tooltip title="back">
              <Typography onClick={() => router.back()} variant="h6">
                Student Report
              </Typography>
            </Tooltip>
          </Stack>
        ) : null}
      </Stack>

      {showForm === true ? (
        <div style={{ display: 'grid', width: '100%', height: '70dvh', alignItems: 'center' }}>
          <Container maxWidth="md">
            <Card
              className="formCardT"
              sx={{ paddingTop: '10px', boxShadow: '1px  2px  10px #ddd' }}
            >
              <Stack direction="column" alignItems="start" mb={0} padding={2}>
                <Grid
                  container
                  spacing={1}
                  alignItems="center"
                  sx={{ flexWrap: 'wrap', width: '100%' }}
                >
                  <Grid
                    item
                    sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, rowGap: '20px' }}
                  >
                    <Grid
                      item
                      sx={{
                        display: 'flex',
                        gap: '10px',
                        flexWrap: 'wrap',
                        flexGrow: 1,
                        justifyContent: 'space-evenly',
                      }}
                    >
                      <Grid item xs={12} sm={12} md={5.5}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <CustomDatePicker
                            sx={{ width: { xs: '100%', sm: '100%', xl: '100%' } }}
                            value={parse(searchStudentReport.fromDate, 'yyyy-MMM-dd', new Date())}
                            name="fromDate"
                            label="Start Date"
                            format="yyyy-MMM-dd"
                            onChange={(newValue) => {
                              setSearchStudentReport((prevState) => ({
                                ...prevState,
                                fromDate: format(newValue, 'yyyy-MMM-dd'),
                              }));
                            }}
                          />
                        </LocalizationProvider>
                      </Grid>
                      <Grid item xs={12} sm={12} md={5.5}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <CustomDatePicker
                            sx={{ width: { xs: '100%', sm: '100%', xl: '100%' } }}
                            name="toDate"
                            value={parse(searchStudentReport.toDate, 'yyyy-MMM-dd', new Date())}
                            label="End Date"
                            format="yyyy-MMM-dd"
                            onChange={(newValue) => {
                              setSearchStudentReport((prevState) => ({
                                ...prevState,
                                toDate: format(newValue, 'yyyy-MMM-dd'),
                              }));
                            }}
                          />
                        </LocalizationProvider>
                      </Grid>
                    </Grid>
                    <Grid
                      sx={{
                        display: 'flex',
                        gap: '10px',
                        flexWrap: 'wrap',
                        flexGrow: 1,
                        justifyContent: 'space-evenly',
                      }}
                    >
                      <Grid item xs={12} sm={12} md={5.5}>
                        <TextField
                          variant="outlined"
                          select
                          SelectProps={{
                            MenuProps: {
                              style: {
                                maxHeight: 300,
                              },
                            },
                          }}
                          sx={{
                            width: { xs: '100%', sm: '100%', xl: '100%' },
                            display: 'flex',
                            flex: 1,
                          }}
                          value={searchStudentReport.course}
                          onChange={handleChange}
                          label="Course *"
                          name="course"
                        >
                          {courseData}
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sm={12} md={5.5}>
                        <TextField
                          variant="outlined"
                          select
                          sx={{ width: { xs: '100%', sm: '100%', xl: '100%' } }}
                          value={searchStudentReport.batch}
                          onChange={handleChange}
                          label="Batch *"
                          name="batch"
                          SelectProps={{
                            MenuProps: {
                              style: {
                                maxHeight: 300,
                              },
                            },
                          }}
                        >
                          {batchData}
                        </TextField>
                      </Grid>
                    </Grid>
                    <Grid
                      sx={{
                        display: 'flex',
                        gap: '10px',
                        flexWrap: 'wrap',
                        flexGrow: 1,
                        justifyContent: 'space-evenly',
                      }}
                    >
                      <Grid
                        item
                        xs={12}
                        sm={5.5}
                        md={5.5}
                        sx={{ display: 'flex', justifyContent: 'start' }}
                      >
                        <FormControl>
                          <RadioGroup
                            row
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue="both"
                            name="attendanceType"
                            onChange={handleChange}
                            value={searchStudentReport.attendanceType}
                            sx={{ display: 'flex' }}
                          >
                            <FormControlLabel
                              value="both"
                              control={
                                <Radio
                                  sx={{
                                    '& .MuiSvgIcon-root': {
                                      fontSize: 15,
                                    },
                                  }}
                                />
                              }
                              label="both"
                            />
                            <FormControlLabel
                              value="present"
                              control={
                                <Radio
                                  sx={{
                                    '& .MuiSvgIcon-root': {
                                      fontSize: 15,
                                    },
                                  }}
                                />
                              }
                              label="present"
                            />
                            <FormControlLabel
                              value="absent"
                              control={
                                <Radio
                                  sx={{
                                    '& .MuiSvgIcon-root': {
                                      fontSize: 15,
                                    },
                                  }}
                                />
                              }
                              label="absent"
                            />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={5.5}
                        md={5.5}
                        sx={{
                          display: 'flex',
                          justifyContent: 'end',
                          flexDirection: 'row',
                          gap: '20px',
                        }}
                      >
                        <Grid item xs={4} sm={4} md={3} px={1} sx={{ justifyContent: 'center' }}>
                          <Button onClick={handleFindClick} variant="contained">
                            <Iconify
                              sx={{ marginRight: '10px' }}
                              icon="line-md:file-search-twotone"
                            />{' '}
                            Find
                          </Button>
                        </Grid>
                        <Grid item xs={4} sm={4} md={3}>
                          <Button onClick={handleClear} variant="outlined">
                            <Iconify
                              sx={{ marginRight: '10px' }}
                              icon="mdi:clear-reverse-outline"
                            />{' '}
                            Clear
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Stack>
            </Card>
          </Container>
        </div>
      ) : (
        <Card className="reportCardT" style={{ margin: '5px',paddingBottom:'10px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px',
            }}
          >
            <Stack
              direction="row"
              onClick={() => router.back()}
              sx={{
                color: '#f79520',
                '&:hover': {
                  color: 'blue',
                  cursor: 'pointer',
                },
              }}
            >
              <KeyboardArrowLeftIcon />
              <Tooltip title="back">
                <Typography onClick={() => router.back()} variant="h6">
                  Student Report
                </Typography>
              </Tooltip>
            </Stack>
            <div style={{ display: 'flex', gap: '10px' }}>
              {isSmallScreen ? null : (
                <OutlinedInput
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
              )}
              <div
                className="tableButtons"
                style={{ display: 'flex', justifyContent: 'end', gap: '10px' }}
              >
                 { downloadProgress ?  <CircularProgress size={24} /> :
                        <Tooltip title="Export to Excel">
                            <IconButton
                                onClick={handleExportToExcel}
                                sx={{ backgroundColor: 'rgba(235,235,235)', borderRadius: '10px' }}
                                disabled={downloadProgress} 
                            >
                                <Iconify icon="vscode-icons:file-type-excel" />
                            </IconButton>
                        </Tooltip>}

                <Tooltip title="Export to PDF">
                  <IconButton
                    sx={{
                      backgroundColor: 'rgba(235,235,235)',
                      borderRadius: '10px',
                      display: 'none',
                    }}
                  >
                    <Iconify icon="formkit:filepdf" sx={{ color: '#db2929' }} />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Search On">
                  <Button onClick={handleShowForm} sx={{ backgroundColor: 'rgba(235,235,235)' }}>
                    <Iconify sx={{ marginRight: '10px' }} icon="line-md:file-search-twotone" />{' '}
                    Search On
                  </Button>
                </Tooltip>
              </div>
            </div>
          </div>
          {isSmallScreen ? (
            <ListView
              data={report}
              onRowClick={(id) => router.push(`/crm/customer/${id}`)}
              page="student report"
            />
          ) : (
            <div style={{ width: '100%', padding: '0 10px 0 10px' }}>
              <DataTable
                rowData={report}
                columnDefs={
                  searchStudentReport.attendanceType === 'present'
                    ? columnDefsPresent
                    : searchStudentReport.attendanceType === 'absent'
                      ? columnDefsAbsent
                      : columnDefs
                }
                pagers="noPagination"
              />
            </div>
          )}
        </Card>
      )}
    </>
  );
}
