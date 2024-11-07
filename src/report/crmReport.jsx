import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'src/routes/hooks';
import './crmReportStyle.css';
import {
  TextField,
  MenuItem,
  Grid,
  Card,
  Typography,
  Tooltip,
  Avatar,
  InputAdornment,
  OutlinedInput,
  useMediaQuery,
  Button,
  Radio,
  FormControlLabel,
  RadioGroup,
  IconButton,
  Chip,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
} from '@mui/material';
import Container from '@mui/material/Container';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, parse } from 'date-fns';
import { Stack } from '@mui/system';
import useApiService from 'src/services/api_services';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import { styled } from '@mui/material/styles';
import DataTable from '../components/datatable/data-table';
import Iconify from '../components/iconify';
import Label from '../components/label';
import cities from '../assets/cities.json';
import GradientProgress from '../components/progress/gradientProgress';
import ListView from '../components/List-view-component/ListView';

const CustomDatePicker = styled(DatePicker)(({ theme }) => ({
  '& .MuiInputBase-root': {
    height: '40px',
  },
  '& .MuiInputBase-input': {
    padding: '8px 14px',
  },
  '& .MuiOutlinedInput-root': {
    height: '100%',
    '& fieldset': {
      borderColor: theme.palette.text.primary,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiInputLabel-root': {
    top: 8,
    left: 14,
    transform: 'scale(1) translate(0, -1.5px)',
    backgroundColor: theme.palette.background.paper,
    padding: '0 4px',
    transition: 'all 0.2s ease-out',
  },
  '& .MuiInputLabel-shrink': {
    top: -8,
    left: 14,
    transform: 'scale(0.75) translate(0, -1.5px)',
  },
}));

export default function CrmReport() {
  const [reports, setReports] = useState([]);
  const smallscreen = useMediaQuery('(min-width: 450px)');
  const [showForm, setShowForm] = useState(false);
  const [progressLoading, setProgressLoading] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width: 650px)');
  const {
    getStatusActive,
    getLeadsActive,
    getCourseActive,
    getActiveUsers,
    searchCrmReport,
    downloadCrmReport,
  } = useApiService();

  const [searchCrm, setSearchCrm] = useState({
    searchType: 'ALL',
    fromDate: format(new Date(), 'yyyy-MMM-dd'),
    toDate: format(new Date(), 'yyyy-MMM-dd'),
    statusCode: [],
    assigneeId: null,
    location: null,
    leadCode: [],
    courseCode: null,
    priority: null,
  });

  const [statusData, setStatusData] = useState([]);
  const [assigneData, setAssigeData] = useState([]);
  const [leadData, setLeadData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [citiesData, setCitiesData] = useState([]);
  const [load, setLoad] = useState(true);
  const [downloadProgress, setDownloadProgress] = useState(false)
  const copyToMobileNumber = (phoneNumber) => {
    navigator.clipboard.writeText(phoneNumber);
  };
  const [searchText, setSearchText] = useState('');
  const quickFilterText = searchText.trim();

  const handleSearchTextChange = (event) => {
    const newSearchText = event.target.value;
    setSearchText(newSearchText);
    localStorage.setItem('searchText', newSearchText);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'searchType' && value === 'JOIN') {
      setSearchCrm((prevState) => ({
        ...prevState,
        searchType: value,
        statusCode: ['JOIN'],
        setStatusData: ['joined'],
      }));
    } else {
      setSearchCrm((prevState) => ({
        ...prevState,
        [name]: value,
        statusCode: [],
        setStatusData: [],
      }));
    }
  };

  const handleClear = (event) => {
    setSearchCrm({
      searchType: 'ALL',
      fromDate: format(new Date(), 'yyyy-MMM-dd'),
      toDate: format(new Date(), 'yyyy-MMM-dd'),
      statusCode: null,
      assigneeId: null,
      location: null,
      leadCode: null,
      courseCode: null,
      priority: null,
    });
  };

  const getUserstatus = useCallback(async () => {
    const response = await getStatusActive();
    const data = response.map((statusRes) => (
      <MenuItem value={statusRes.code}>{statusRes.name}</MenuItem>
    ));
    setStatusData(data);
  }, [getStatusActive]);

  const getLeads = useCallback(async () => {
    const response = await getLeadsActive();
    const data = response.map((lead) => <MenuItem value={lead.code}>{lead.name}</MenuItem>);
    setLeadData(data);
  }, [getLeadsActive]);

  const search = useCallback(
    async (searchReportData) => {
      setProgressLoading(true);
      const response = await searchCrmReport(searchReportData);
      setReports(response);
      localStorage.setItem('searchResults', JSON.stringify(searchReportData));
      setProgressLoading(false);
    },
    [searchCrmReport]
  );
  
  const downloadCrmTableData = useCallback(
    async (searchReportData) => {
      const response = await downloadCrmReport(searchReportData);
      const disposition = response.headers['content-disposition'];
      let filename = 'CRM_report.xlsx';
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
    [downloadCrmReport]
  );

  const getCourse = useCallback(async () => {
    const response = await getCourseActive();
    const data = response.map((course) => <MenuItem value={course.code}>{course.name}</MenuItem>);
    setCourseData(data);
  }, [getCourseActive]);

  const getUsersActive = useCallback(async () => {
    const response = await getActiveUsers();
    const data = response.map((user) => <MenuItem value={user.uid}>{user.userName}</MenuItem>);
    setAssigeData(data);
  }, [getActiveUsers]);

  const loadCities = useCallback(() => {
    const data = cities.map((city) => (
      <MenuItem key={city.name} value={city.name}>
        {city.name}
      </MenuItem>
    ));
    setCitiesData(data);
  }, []);

  const [columnDefs] = useState([
    {
      id: '',
      field: 'S.no',
      valueGetter: 'node.rowIndex + 1',
      align: 'center',
      flex: 1,
      maxWidth: 100,
      filter: false,
    },
    { id: 'enquiryDate', field: 'enquiryDate', flex: 2 },
    {
      id: 'customerName',
      field: 'name',
      width: 250,
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
      id: 'mobileNumber',
      field: 'mobileNumber',
      flex: 2,
      cellRenderer: (params) => (
        <Label
          onClick={() => {
            copyToMobileNumber(params.value);
          }}
          sx={{
            marginTop: '11px',
            '&:hover': {
              color: 'blue',
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
      id: 'priority',
      field: 'priority',
      cellStyle: { textAlign: 'center' },
      flex: 2,
      cellRenderer: (params) => (
        <Label
          color={params.value === 'Low' ? 'info' : params.value === 'High' ? 'error' : 'warning'}
        >
          {params.value}
        </Label>
      ),
    },
    {
      id: 'course',
      field: 'courseName',
      cellStyle: { textAlign: 'center' },
      flex: 2,
      cellRenderer: (params) => <Label color="primary">{params.value}</Label>,
    },
    {
      id: '',
      field: 'assigneeName',
      align: 'center',
      flex: 2,

      cellRenderer: (params) => (
        <Label
          onClick={() => {
            router.push(`/users/info/${params.data.assigneeId}`);
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
          <Avatar sx={{ height: '18px', width: '18px', marginRight: '5px', fontSize: '10px' }}>
            {params.data.assigneeName? params.data.assigneeName.charAt(0).toUpperCase() :"A"}
          </Avatar>
          {params.value}
        </Label>
      ),
    },

    { id: 'location', field: 'location', flex: 2 },
    {
      id: '', field: 'lastFollowup', align: 'center', flex: 2,

      cellRenderer: (params) => (
        <span>
          {params.data.lastFollowup === "" ? "" : params.data.lastFollowup}
        </span>
      )
    },
    { id: '', field: 'leadsName', align: 'center', flex: 2 },
    { id: '', field: 'classType', align: 'center', flex: 2 },
    {
      id: '',
      field: 'statusName',
      align: 'center',
      flex: 2,
      cellRenderer: (params) => (
        <Label
          color={
            params.value === 'Joined'
              ? 'success'
              : params.value === 'Open'
                ? 'info'
                : params.value === 'Just Follow'
                  ? 'warning'
                  : 'secondary'
          }
        >
          {params.value}
        </Label>
      ),
    },
  ]);
  const router = useRouter();

  const handleFindClick = () => {
    search(searchCrm); 
    setShowForm(false);
  };
  

  const handleShowForm = () => {
    setShowForm(true);
  };

  useEffect(() => {
    if (load) {
      getUserstatus();
      loadCities();
      getLeads();
      getCourse();
      getUsersActive();
      setLoad(false);
      const storedData = JSON.parse(localStorage.getItem('searchResults'));
      console.log('storedData',storedData);
      if (storedData) {
        setSearchCrm(storedData); 
        search(storedData);
      }else{
        search(searchCrm);
      }  
    }

  }, [load, loadCities, getUserstatus, getLeads, getCourse, getUsersActive,search,searchCrm]);


  const handleExportToExcel = () => {
    setDownloadProgress(true)
    downloadCrmTableData(searchCrm).finally(() => {
      setDownloadProgress(false)
    });
  };

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ padding: '10px 20px' }}
      >
        {showForm === true ? (
          <Stack
            direction="row"
            onClick={() => router.back()}
            sx={{
              color: '#f79520',
              alignItems: 'center',
              '&:hover': {
                color: 'blue',
                cursor: 'pointer',
              },
            }}
          >
            <KeyboardArrowLeftIcon />
            <Tooltip title="back">
              <Typography variant="h6">CRM Report</Typography>
            </Tooltip>
          </Stack>
        ) : null}
      </Stack>
      {showForm === true ? (
        <Container
          sx={{
            maxWidth: {
              xs: '100%',
              sm: '100%',
              md: '65%',
              lg: '65%',
              xl: '80%',
              xxl: '100%',
            },
          }}
        >
          <Card
            className="formCardT"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              paddingTop: '20px',
              gap: '10px',
              boxShadow: '1px  2px  10px #ddd',
            }}
          >
            <Grid
              item
              className="radiobutton"
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="ALL"
                value={searchCrm.searchType}
                onChange={handleChange}
                name="searchType"
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >  
                <FormControlLabel
                  sx={{ marginRight: '10px' }}
                  value="ALL"
                  control={
                    <Radio
                      sx={{
                        '& .MuiSvgIcon-root': {
                          fontSize: 14,
                        },
                      }}
                    />
                  }
                  label="All"
                />
                <FormControlLabel
                  sx={{ marginRight: '10px' }}
                  value="ENQ"
                  control={
                    <Radio
                      sx={{
                        '& .MuiSvgIcon-root': {
                          fontSize: 14,
                        },
                      }}
                    />
                  }
                  label=" Enquiry Date"
                />
                <FormControlLabel
                  sx={{ marginRight: '5px' }}
                  value="JOIN"
                  control={
                    <Radio
                      sx={{
                        '& .MuiSvgIcon-root': {
                          fontSize: 14,
                        },
                      }}
                    />
                  }
                  label=" Join Date"
                />
              </RadioGroup>
            </Grid>
            <Stack direction="column" alignItems="start" mb={0} padding={2}>
              <Grid
                container
                spacing={2}
                alignItems="center"
                justifyContent="start"
                sx={{ flexWrap: 'wrap', width: '100%' }}
              >
                {/* Form fields */}
                <Grid
                  item
                  xs={12}
                  md={6}
                  lg={6}
                  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}
                >
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <CustomDatePicker
                      sx={{ width: '100%' }}
                      value={parse(searchCrm.fromDate, 'yyyy-MMM-dd', new Date())}
                      name="fromDate"
                      label="From Date"
                      format="yyyy-MMM-dd"
                      onChange={(newValue) => {
                        setSearchCrm((prevState) => ({
                          ...prevState,
                          fromDate: format(newValue, 'yyyy-MMM-dd'),
                        }));
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={6}
                  lg={6}
                  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}
                >
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <CustomDatePicker
                      sx={{ width: '100%' }}
                      name="toDate"
                      value={parse(searchCrm.toDate, 'yyyy-MMM-dd', new Date())}
                      label="To Date"
                      format="yyyy-MMM-dd"
                      onChange={(newValue) => {
                        setSearchCrm((prevState) => ({
                          ...prevState,
                          toDate: format(newValue, 'yyyy-MMM-dd'),
                        }));
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={6}
                  lg={6}
                  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}
                >
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
                    size="small"
                    sx={{ width: '100%' }}
                    value={searchCrm.courseCode}
                    onChange={handleChange}
                    label="Course "
                    name="courseCode"
                  >
                    {courseData}
                  </TextField>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={6}
                  lg={6}
                  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}
                >
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
                    size="small"
                    sx={{ width: '100%' }}
                    name="assigneeId"
                    value={searchCrm.assigneeId}
                    onChange={handleChange}
                    label="Assignee "

                  >
                    {assigneData}
                  </TextField>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={6}
                  lg={6}
                  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}
                >
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
                    size="small"
                    sx={{ width: '100%' }}
                    value={searchCrm.location}
                    onChange={handleChange}
                    label="Location "
                    name="location"
                  >
                    {citiesData}
                  </TextField>
                </Grid>

                <Grid
                  item
                  xs={12}
                  md={6}
                  lg={6}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    mb: 2,
                  }}
                >
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
                    size="small"
                    sx={{ width: '100%' }}
                    value={searchCrm.priority}
                    onChange={handleChange}
                    label="Priority "
                    name="priority"
                  >
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="N/A">N/A</MenuItem>
                  </TextField>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={6}
                  lg={6}
                  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}
                >
                  <FormControl variant="outlined" size="small" sx={{ width: '100%' }}>
                    <InputLabel>Status </InputLabel>
                    <Select
                      multiple
                      MenuProps={{
                        PaperProps: {
                          style: { maxHeight: '300px' },
                        },
                      }}
                      value={searchCrm.statusCode || []}
                      name='statusCode'
                      onChange={(e) => {
                        setSearchCrm((prevState) => ({
                          ...prevState,
                          statusCode: e.target.value,
                        }));
                      }}
                      input={<OutlinedInput label="Status " />}
                      renderValue={(selected) => (
                        <Stack gap={1} direction="row" flexWrap="wrap">
                          {selected.map((value) => {
                            const status = statusData.find(item => item.props.value === value);
                            return (
                              <Chip
                                key={value.id}
                                label={status ? status.props.children : ''}
                                onDelete={null}
                                deleteIcon={null}
                              />
                            );
                          })}
                        </Stack>
                      )}
                    >
                      {statusData}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={6}
                  lg={6}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    mb: 2,
                  }}
                >
                  <FormControl variant="outlined" size="small" sx={{ width: '100%' }}>
                    <InputLabel>Lead </InputLabel>
                    <Select
                      multiple
                      value={searchCrm.leadCode || []}
                      name="leadCode"
                      onChange={(e) => {
                        setSearchCrm((prevState) => ({
                          ...prevState,
                          leadCode: e.target.value,
                        }));
                      }}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 300,
                          },
                        },
                      }}
                      input={<OutlinedInput label="Lead " />}
                      renderValue={(selected) => (
                        <Stack gap={1} direction="row" flexWrap="wrap">
                          {selected.map((value) => {
                            const lead = leadData.find(item => item.props.value === value);
                            return (
                              <Chip
                                key={value.id}
                                label={lead ? lead.props.children : ''}
                                onDelete={null}
                                deleteIcon={null}
                              />
                            );
                          })}
                        </Stack>
                      )}
                    >
                      {leadData}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={12}
                  lg={12}
                  sx={{ display: 'flex', justifyContent: { md: 'end', xs: 'center' }, gap: '15px' }}
                >
                  <Button onClick={handleFindClick} variant="contained">
                    <Iconify sx={{ marginRight: '10px' }} icon="line-md:file-search-twotone" />{' '}
                    Search
                  </Button>
                  <Button onClick={handleClear} variant="outlined">
                    <Iconify sx={{ marginRight: '10px' }} icon="mdi:clear-reverse-outline" />
                    Clear
                  </Button>
                </Grid>
              </Grid>
            </Stack>
          </Card>
        </Container>
      ) : (
        <Container maxWidth="xxl">
          <Card className="reportCardT" sx={{paddingBottom:'10px',marginBottom:'10px'}}>
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
                  alignItems: 'center',
                  '&:hover': {
                    color: 'blue',
                    cursor: 'pointer',
                  },
                }}
              >
                <KeyboardArrowLeftIcon />
                <Tooltip title="back">
                  <Typography variant="h6">CRM Report</Typography>
                </Tooltip>
              </Stack>
              <div style={{ display: 'flex', gap: '10px' }}>
                {isSmallScreen ? null : (
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
                )}
                <div
                  className="tableButtons"
                  style={{ display: 'flex', justifyContent: 'end', gap: '10px' }}
                >
                  {downloadProgress ? <CircularProgress size={24} /> :
                    <Tooltip title="Export to Excel">
                      <IconButton
                        onClick={handleExportToExcel}
                        sx={{ backgroundColor: 'rgba(235,235,235)', borderRadius: '10px' }}
                        disabled={downloadProgress}
                      >
                        <Iconify icon="vscode-icons:file-type-excel" />
                      </IconButton>
                    </Tooltip>}
                  {/* --------------------------------------------------- */}

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
                  {/* ---------------------------------------------------------- */}

                  <Tooltip title="Search Again">
                    <Button sx={{ backgroundColor: 'rgba(235,235,235)' }} onClick={handleShowForm}>
                      <Iconify sx={{ marginRight: '10px' }} icon="line-md:file-search-twotone" />{' '}
                      Search
                    </Button>
                  </Tooltip>
                </div>
              </div>
            </div>
            {progressLoading ? (
              <GradientProgress />
            ) : isSmallScreen ? (
              <ListView
                data={reports}
                onRowClick={(id) => router.push(`/crm/customer/${id}`)}
                page="CRM report"
              />
            ) : (
              <div style={{ width: '100%', padding: '0 10px 0 10px' }}>
                <DataTable
                  rowData={reports}
                  columnDefs={columnDefs}
                  quickFilterText={quickFilterText}
                  pagers="noPagination"
                />
              </div>
            )}
          </Card>
        </Container>
      )}
    </>
  );
}
