import * as React from 'react';
import PropTypes from 'prop-types';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ApprovalIcon from '@mui/icons-material/Approval';
import SettingsIcon from '@mui/icons-material/Settings';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import GolfCourseIcon from '@mui/icons-material/GolfCourse';
import AvTimerIcon from '@mui/icons-material/AvTimer';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import HolidayView from 'src/calendar/holidayView';
import InOutFormView from 'src/calendar/in-out-form';
import DataTable from 'src/components/datatable/data-table';
import { useMemo,useState } from 'react';
import { Typography } from '@mui/material';
import LeaveForm from '../leaveformpage';



function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
      sx={{
        p: 3,
        overflowY: 'auto', 
        maxHeight: 'calc(100vh - 100px)' 
      }}
    >
      {value === index && (
        <Typography>{children}</Typography>
      )}
    </Box>
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

export default function AttendenceView() {
  const [loadPage] = useState(true);

  const [value, setValue] = React.useState(0);

const [rowData] = useState([
    { SNo: '1', Name:"surya", date: "11/04/2024", number: "6768500045" , approvel:"Gpay"},
    { SNo: '2', Name:"chandran", date: "22/04/2024", number: "6568500042" ,approvel:"Phonepey"},
    { SNo: '3', Name:"prakash", date:"12/05/2024" , number: "6868500043" ,approvel:"Gpay"},
    { SNo: '4', Name:"selva", date: "8/06/2024", number: "6068500044" , approvel:"onCash"},
    { SNo: '5', Name:"deva", date: "15/06/2024", number: "168500048" ,approvel:"Paytm"},
    { SNo: '6', Name:"madhu", date:"16/06/2024" , number: "6268500049" ,approvel:"OnCash"},
    { SNo: '7', Name:"sruthi", date:"12/05/2024" , number: "6868500043" ,approvel:"Gpay"},
    { SNo: '8', Name:"selvaragavan", date: "8/06/2024", number: "6068500044" , approvel:"onCash"},
    { SNo: '9', Name:"dhanush", date: "15/06/2024", number: "168500048" ,approvel:"Paytm"},
    { SNo: '10', Name:"madhavan", date:"16/06/2024" , number: "6268500049" ,approvel:"OnCash"},
  ]);

  const [columnDefs] = useState([
    { field: 'SNo' , flex:0, width:100},
    { field: 'Name', flex:2 },
    { field: 'date' , flex:2},
    { field: 'number', flex:2 },
    { field: 'approvel', flex:2 },
  ]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const defaultColDef = useMemo(() => ({
      filter: 'agTextColumnFilter',
  }), []);

  return (
    loadPage ? <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
      }}>
      <img alt="icon" src="/assets/loadpage/bubble-gum-error-404.gif" style={{width: '300px', height: '300px'}}/>
      <h1 style={{textAlign: 'center',  color:'#637381'}}>Oops..! 🤭 <br/>Page under progress <br/>Please contact the Dev... team</h1>
    </div>
    :
    <Box sx={{ width: '100%' }}>
      
      <Box sx={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>

        <Tabs value={value} onChange={handleChange}  aria-label="scrollable tabs example"
          sx={{ minWidth: 'max-content' }}>
          
          <Tab label="Time Log" icon={<EditCalendarIcon />} iconPosition="start" {...a11yProps(0)} />
          <Tab label="Holidays" icon={<GolfCourseIcon />} iconPosition="start"{...a11yProps(1)} />
          <Tab label="Leave Request" icon={<PendingActionsIcon/>} iconPosition="start" {...a11yProps(2)} />
          <Tab label="Leave Approvel" icon={<ApprovalIcon />} iconPosition="start"  {...a11yProps(3)} />
          <Tab label="converted working/holiday"icon={< AssignmentTurnedInIcon />} iconPosition="start" {...a11yProps(4)} />
          <Tab label="Leave count" icon={<AvTimerIcon />} iconPosition="start"{...a11yProps(5)} />
          <Tab label="Settings" icon={<SettingsIcon />} iconPosition="start"  {...a11yProps(6)} />
          <Tab label="Report" icon={<AssessmentIcon />} iconPosition="start" {...a11yProps(7)} />
        
        </Tabs>  
      </Box>
     

      <CustomTabPanel  value={value} index={0}>
        <InOutFormView/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <HolidayView/>
      </CustomTabPanel>
     
      <CustomTabPanel value={value} index={2}>
        <LeaveForm/>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={3}>

          <DataTable
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
          />

      </CustomTabPanel>

      <CustomTabPanel value={value} index={4}>
        Item five
      </CustomTabPanel>
      <CustomTabPanel value={value} index={5}>
        Item six
      </CustomTabPanel>
      <CustomTabPanel value={value} index={6}>
        Item seven
      </CustomTabPanel>
      <CustomTabPanel value={value} index={7}>
        Item Eight
      </CustomTabPanel>
    </Box>
  );
}