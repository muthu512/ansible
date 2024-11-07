import DataTable from 'src/components/datatable/data-table';
import { Button, Stack, Tooltip, Typography, IconButton, Card,Grid } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import useApiService from 'src/services/api_services';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Container } from '@mui/system';
import { format } from 'date-fns';
import './over-all-attendance-style.css';
import Label from 'src/components/label';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BatchOverallCount() {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const router = useRouter();
  const { id } = useParams();
  const { getBatchAttendanceReportInfo, getAllStudentReport } =
    useApiService();
  const [batchAttendanceReport, setBatchAttendanceReport] = useState([]);
  const [studentReportData, setStudentReportData] = useState({
    "batchInfo":{},
    "attInfo":[]
  });
  
  const [load, setLoad] = useState(true);
  const [columnDefsTab1] = useState([
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
      field: 'attDate',
      headerName: 'Date',
      align: 'center',
      cellStyle: { textAlign: 'center' },
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
      field: 'topic',
      flex: 1,
      headerName: 'Topic',
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
    {
      id: '',
      field: 'status',
      align: 'center',
      cellStyle: { textAlign: 'center' },
      flex: 1,
      headerName: 'Status',
      cellRenderer: (params) => (
        <Label color={params.value === 'Inprogress' ? 'primary' : 'success'}>{params.value}</Label>
      ),
    },
    {
      id: '',
      field: 'description',
      align: 'center',
      flex: 1,
      headerName: 'Description',
    },
    {
      id: '',
      field: 'Action',
      align: 'center',
      flex: 1,
      maxWidth: 100,
      headerName: 'Action',
      cellRenderer: (params) => (
        <Tooltip title="Edit">
          <IconButton
            color="primary"
            sx={{ backgroundColor: 'whitesmoke' }}
            onClick={() =>
              router.push(`/student/batches/${params.data.batchId}/${params.data.attDate}`)
            }
          >
            <Iconify icon="ic:outline-edit-note" />
          </IconButton>
        </Tooltip>
      ),
    },
  ]);

  const [columnDefsTab2] = useState([
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
      field: 'billNumber',
      headerName: 'Bill No',
      flex: 1,
      maxWidth: 120,
      cellRenderer: (params) => (
        <Label
          onClick={() =>
            router.push(`/student/batches/${params.data.batchId}/${params.data.attDate}`)
          }
          sx={{ cursor: 'pointer' }}
        >
          {params.value}
        </Label>
      ),
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
      cellRenderer: (params) => <Label color="info">{params.value}</Label>,
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
      cellRenderer: (params) => <Label color="warning">{params.value}</Label>,
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
    {
      id: '',
      field: 'average',
      align: 'center',
      cellStyle: { textAlign: 'center' },
      flex: 1,
      headerName: 'Percentage',
      cellRenderer: (params) => <Label color="secondary">{params.value}</Label>,
    },
  ]);

  const defaultColDef = useMemo(
    () => ({
      filter: 'agTextColumnFilter',
    }),
    []
  );

  const getBatchAttendanceReport = useCallback(
    async (batchId) => {
      const response = await getBatchAttendanceReportInfo(batchId);
      setBatchAttendanceReport(response);
    },
    [getBatchAttendanceReportInfo]
  );

  const studentReport = useCallback(
    async (batchId) => {
      const response = await getAllStudentReport(batchId);
      setStudentReportData(response);
    },
    [getAllStudentReport]
  );

  useEffect(() => {
    if (load) {
      getBatchAttendanceReport(id);
      studentReport(id);
      setLoad(false);
    }
  }, [getBatchAttendanceReport, studentReport, id, load]);

  return (
    <Container maxWidth="xxl">
      <Card
        sx={{
          padding: '10px',
          display: 'flex',
          justifyContent:'space-around',
          flexWrap: 'wrap',
        }}
      > 
      <div
      className="header trainerName"
      style={{ display: 'flex',width:'100%',gap:'10px', justifyContent:'space-around',flexWrap: 'wrap', }}
    >
     
        <Stack
          direction="row"
          alignItems="center"
          onClick={() => {
            router.back();
          }}
          sx={{
            color: '#f79520',
            '&:hover': {
              color: '#1877f2',
              cursor: 'pointer',
            },
          }}
        >
          <Typography variant="h6" sx={{padding:'5px',margin:'0',display:'flex',justifyContent:'center',alignItems:'center',}}>
            <KeyboardArrowLeftIcon />
            <h5 style={{margin:'0',padding:'0'}}>back</h5>
          </Typography>
        </Stack>
        <Tooltip title='Batch Name'>
          <Grid className='grid' item xs={12} md={6} sx={{flexGrow:'2',
            border:'1px solid #ddd',borderRadius:'10px',padding:'0 5px',display:'flex',justifyContent:'center',alignItems:'center',
            }}>
            <h5
              style={{
                color: 'grey',
                margin: '0',
                padding: '0',
                display: 'flex',
                justifyContent:'space-evenly',
                alignItems: 'center',
                cursor:'default',
                width:'100%',
                
              }}
            >
             <Iconify className='icon' style={{color:'#ff9b00',height:'28px',width:'28px',}} icon="ic:twotone-school"/>
             {`${studentReportData.batchInfo.title}`}
            </h5>
          </Grid>
          </Tooltip>
          <Tooltip title='Trainer Name'>
          <Grid className='grid' item xs={12} md={6} style={{flexGrow:'2',
            border:'1px solid #ddd',borderRadius:'10px', padding:'0 5px',display:'flex',justifyContent:'center',alignItems:'center'}}>
            <h5
              style={{
                color: 'grey',
                margin: '0',
                padding: '0',
                display: 'flex',
                width:'80%',
                justifyContent:'space-evenly',
                alignItems: 'center',
                cursor:'default',
              }}
            >
              <Iconify className='icon' style={{color:'#ff9b00',height:'28px',width:'28px',}} icon="la:chalkboard-teacher"/>
             {`${studentReportData.batchInfo.trainnerName}`}
            </h5>
          </Grid>
          </Tooltip>
          <Tooltip title='Total Students'>
          <Grid className='totalCount grid' item xs={12} md={6} style={{flexGrow:'4',
            border:'1px solid #ddd',borderRadius:'10px',padding:'0 5px',display:'flex',justifyContent:'center',alignItems:'center'}}>
            <h5
              style={{
                color: 'grey',
                margin: '0',
                padding: '0',
                display: 'flex',
                width:'80%',
                justifyContent:'space-evenly',
                alignItems: 'center',
                cursor:'default',
              }}
            >
              <Iconify className='icon' style={{color:'#ff9b00',height:'28px',width:'28px',}} icon="hugeicons:student-card"/>
              {`${studentReportData.attInfo.length}`}
            </h5>
          </Grid>
          </Tooltip>
          <Tooltip title='Total no.of Days'>
          <Grid className='grid' item xs={12} md={6} style={{flexGrow:'4',
            border:'1px solid #ddd',borderRadius:'10px',padding:'0 5px',display:'flex',justifyContent:'center',alignItems:'center'}}>
          <h5
            style={{
              color: 'grey',
              margin: '0',
              padding: '0',
              display: 'flex',
              width:'80%',
              justifyContent:'space-evenly',
              alignItems: 'center',
              cursor:'default',
            }}
          >
            {' '}
            <Iconify className='icon' style={{color:'#ff9b00',height:'28px',width:'28px',}} icon="healthicons:i-schedule-school-date-time"/>
            {` ${batchAttendanceReport.length}`}
          </h5>
          </Grid>
          </Tooltip>
        
        <Grid sx={{ display: 'flex', alignItems: 'center',justifyContent:'end', gap: '10px',flexGrow:'1',
          
        }}>

          <Tooltip title="view">
            <IconButton
              color="dark"
              className='icon'
              variant="text"
              sx={{ backgroundColor: 'rgba(235,235,235)', borderRadius: '10px',}}
              onClick={() => router.push(`/student/batches/${id}/report`)}
            >
              <Iconify  sx={{ width: 30, height: 20 }} icon="carbon:task-view" />
            </IconButton>
          </Tooltip>

          <Button
            variant="contained"
            color="inherit"
            sx={{width:'100px',}}
            onClick={() =>
              router.push(`/student/batches/${id}/${format(new Date(), 'yyyy-MMM-dd')}`)
            }
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New
          </Button>
         </Grid>
        </div>
      </Card>

      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider',marginLeft:1, }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Syllabus Tracking" {...a11yProps(0)}/>
            <Tab label="Student Report" {...a11yProps(1)}/>
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <DataTable
            rowData={batchAttendanceReport}
            defaultColDef={defaultColDef}
            columnDefs={columnDefsTab1}
            onGridReady={(params) => {
              params.api.sizeColumnsToFit();
            }}
            domLayout="autoHeight"
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <DataTable
            rowData={studentReportData.attInfo}
            defaultColDef={defaultColDef}
            columnDefs={columnDefsTab2}
            onGridReady={(params) => {
              params.api.sizeColumnsToFit();
            }}
            domLayout="autoHeight"
          />
        </CustomTabPanel>
      </Box>
    </Container>
  );
}
