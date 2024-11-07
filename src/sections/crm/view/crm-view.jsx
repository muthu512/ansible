import { useSnackbar } from 'src/components/snakbar';
import { useSelector } from 'react-redux';
import { useRouter } from 'src/routes/hooks';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography'
import {
  Avatar,
  Button,
  Card,
  IconButton,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Slide,
  Stack,
  Tooltip,
  useMediaQuery,
} from '@mui/material';

import CrmDialog from 'src/components/crm dialog page/crmDialog';
import Iconify from 'src/components/iconify';
import RefreshIcon from '@mui/icons-material/Refresh';
import { format, parse } from 'date-fns';
import React, { forwardRef, useCallback, useEffect, useState, useMemo } from 'react';
import ConfirmDialog from 'src/components/confirmdialog/confirm-dialog';
import DataTable from 'src/components/datatable/data-table';
import '../../../global.css';
import useApiService from 'src/services/api_services';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import Label from 'src/components/label';
import { ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import cities from '../../../assets/cities.json';
import qulifications from '../../../assets/qualification.json';
import department from '../../../assets/quali-department.json';
import ListView from '../../../components/List-view-component/ListView';
import GradientProgress from '../../../components/progress/gradientProgress';

ModuleRegistry.registerModules([ClientSideRowModelModule, RowGroupingModule]);


function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const Transition = forwardRef((props, ref) => <Slide direction="left" ref={ref} {...props} />);

export default function CRMView() {
  const auth = useSelector((state) => state.auth);  

  const [tabValue, setTabValue] = useState(() => {
    const savedValue = localStorage.getItem('selectedTab');
    return savedValue ? parseInt(savedValue, 10) : 0;
  });

  const [statusData, setStatusData] = useState([]);
  const [status, setStatus] = useState([]);
  const [assigneData, setAssigeData] = useState([]);
  const [reportingData, setReportingData] = useState([]);
  const [leadData, setLeadData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [fresherOrExprienceData, setFresherOrExprienceData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [citiesData, setCitiesData] = useState([]);
  const [qualificationData, setQulificationData] = useState([]);
  const router = useRouter();
  const [load, setLoad] = useState(true);
  const [errors, setErrors] = useState({});
  const [itemToDelete, setItemToDelete] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [progressLoading, setProgressLoading] = useState(true);

  const {
    getStatusActive,
    getLeadsActive,
    getCourseActive,
    getFresherOrExprienceActive,
    getActiveUsers,
    createCustomer,
    getCustomersByStatus,
    getDeleteCustomer,
  } = useApiService();

  const { showSnackbar } = useSnackbar();

  const [searchText, setSearchText] = useState('');
  // Handler to update search text
  const handleSearchTextChange = (event) => {
    const newSearchText = event.target.value;
    setSearchText(newSearchText);
    localStorage.setItem('searchText', newSearchText);
  };
  
  const quickFilterText = searchText.trim();
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const smallscreen = useMediaQuery('(min-width: 450px)');
  const [refreshTable, setRefreshTable] = useState(false);
  const [departmentData, setDepartmentData] = useState([]);
  const isSmallScreen = useMediaQuery('(max-width: 650px)');

  const copyToMobileNumber = (phoneNumber) => {
    navigator.clipboard.writeText(phoneNumber);
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
    setProgressLoading(true);
    const response = await getDeleteCustomer(itemToDelete);
    if (response.status === 'OK') {
      showSnackbar(response.message, 'success');
      getCustomerDataByStatus(statusData[tabValue].props.value);
      setProgressLoading(false)
    } else {
      showSnackbar(response.message, 'warning');
      setProgressLoading(false)
    }
  };

  const onCellValueChanged = async (event) => {
    console.log('update')
    const updatedData = event.data;
    const response = await createCustomer(updatedData);
    if (response.status === "OK") {
      showSnackbar(response.message, 'success');
      setProgressLoading(true);
      try {
        await getCustomerDataByStatus(statusData[tabValue].props.value); 
      } catch (error) {
        console.error("Error fetching customer data:", error);
      } finally {
        setProgressLoading(false); 
      }
    } else {
      showSnackbar(response.message, 'warning');
    }
  }

  const [customer, setCustomer] = useState({
    id: 0,
    name: '',
    cid: '',
    mobileNumber: '',
    gender: '',
    classType: '',
    qualification: '',
    department: '',
    passedOutYear: '',
    priority: '',
    fresherOrExprienceCode: '',
    fresherOrExprienceName: '',
    leadsCode: '',
    leadsName: '',
    courseCode: '',
    courseName: '',
    statusCode: 'OPEN',
    statusName: '',
    assigneeId: auth.user.uid,
    assigneeName: '',
    reportingId: auth.user.reportingId,
    reportingName: '',
    enquiryDate: format(new Date(), 'yyyy-MMM-dd'),
    location: '',
    profile: '',
    joinDate: '',
    completeDate: '',
  });

  const getCustomerDataByStatus = useCallback(
    async (code) => {
      if (code === null || code === undefined) {
        code = statusData[0];
      }
      const response = await getCustomersByStatus(code);
      setCustomerData(response);
      setProgressLoading(false)
    },
    [statusData, getCustomersByStatus]
  );

  const getUserstatus = useCallback(async () => {
    const response = await getStatusActive();
    setStatus(response);
    const data = response.map((statusRes) => (
      <MenuItem value={statusRes.code}>{statusRes.name}</MenuItem>
    ));
    setStatusData(data);
    getCustomerDataByStatus(localStorage.getItem('code') === null ? response[0].code : localStorage.getItem('code'));
  }, [getStatusActive, getCustomerDataByStatus]);

  const getLeads = useCallback(async () => {
    const response = await getLeadsActive();
    const data = response.map((lead) => <MenuItem value={lead.code}>{lead.name}</MenuItem>);
    setLeadData(data);
  }, [getLeadsActive]);

  const getCourse = useCallback(async () => {
    const response = await getCourseActive();
    const data = response.map((course) => <MenuItem value={course.code}>{course.name}</MenuItem>);
    setCourseData(data);
  }, [getCourseActive]);

  const getFresherOrExprience = useCallback(async () => {
    const response = await getFresherOrExprienceActive();
    const data = response.map((course) => <MenuItem value={course.code}>{course.name}</MenuItem>);
    setFresherOrExprienceData(data);
  }, [getFresherOrExprienceActive]);

  const getUsersActive = useCallback(async () => {
    const response = await getActiveUsers();
    const data = response.map((user) => <MenuItem value={user.uid}>{user.userName}</MenuItem>);
    setAssigeData(data);
    setReportingData(data);
  }, [getActiveUsers]);

  const loadCities = useCallback(() => {
    const data = cities.map((city) => city.name);
    setCitiesData(data);
  }, []);

  const loadQulification = useCallback(() => {
    const data = qulifications.map((qulification) => qulification.name);
    setQulificationData(data);
  }, []);

  const loadDepartment = useCallback(() => {
    const data = department.map((departments) => departments.name);
    setDepartmentData(data);
  }, []);

  useEffect(() => {
    const savedSearchText = localStorage.getItem('searchText') || '';
    setSearchText(savedSearchText);
    if (load) {
      getUserstatus();
      loadQulification();
      loadDepartment();
      loadCities();
      getLeads();
      getCourse();
      getFresherOrExprience();
      getUsersActive();
      setLoad(false);
    }
  }, [
    load,
    loadDepartment,
    loadQulification,
    loadCities,
    getUserstatus,
    getLeads,
    getCourse,
    getFresherOrExprience,
    getUsersActive,
  ]);

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
      editable: true,
      field: 'name',
      width: 250,
      flex: 3,

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
      editable: true,
      flex: 3,
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
      cellEditor: 'agSelectCellEditor',
      editable: true,
      cellEditorParams: {
        values: ['Low', 'Medium', 'High', 'N/A'],
      },
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
      flex: 3,
      cellRenderer: (params) => (
        <Label
          onClick={() => {
            router.push(`/users/info/${params.data.assigneeId}`);
          }}
          sx={{
            margin: '11px',
            color: `${params.data.assigneeColor}`,
            '&:hover': {
              color: 'blue',
              cursor: 'pointer',
            },
          }}
        >
          <Avatar sx={{ height: '18px', width: '18px', marginRight: '5px', backgroundColor: `${params.data.assigneeColor}`, fontSize: '10px' }}>

            {params.data.assigneeName.charAt(0).toUpperCase()}
          </Avatar>
          {params.value}
        </Label>
      ),
    },

    {
      id: 'location',
      field: 'location',
      flex: 2,
      cellEditor: 'agSelectCellEditor',
      editable: true,
      cellEditorParams: {
        values: cities.map(location => location.name),
      },
    },
    { id: '', field: 'leadsName', align: 'center', flex: 2 },
    { id: '', field: 'lastFollowup', align: 'center', flex: 2 },
    {
      id: '',
      field: 'Action',
      align: 'center',
      flex: auth.user.roleCode === 'ADMIN' ? 3 : 2.2,
      filter: false,
      cellRenderer: (params) => (
        <>
          <Tooltip title="Edit">
            <IconButton
              onClick={() => {
                handleEdit(params.data);
              }}
            >
              <Iconify icon="ic:outline-edit-note" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Whats App">
            <a href={`whatsapp://send?phone=+91${params.data.mobileNumber}&text=Hello ${params.data.name}`}>
              <IconButton>
                <Iconify icon="mage:whatsapp-filled" sx={{ color: '#25D366' }} />
              </IconButton>
            </a>
          </Tooltip>

          {auth.user.roleCode === 'ADMIN' ? <Tooltip title="Delete">
            <IconButton onClick={() => handleClickDelete(params.data.cid)}>
              <Iconify icon="material-symbols:delete-outline-rounded" sx={{ color: 'red' }} />
            </IconButton>
          </Tooltip> : null}

        </>
      ),
    },
  ]);

  const [columnDefsJoin] = useState([
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
      editable: true,
      width: 250,
      flex: 3,

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
      editable: true,
      flex: 3,
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
      cellEditor: 'agSelectCellEditor',
      editable: true,
      cellEditorParams: {
        values: ['Low', 'Medium', 'High', 'N/A'],
      },
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
      id: 'classType',
      field: 'classType',
      cellStyle: { textAlign: 'center' },
      flex: 2,
      cellRenderer: (params) => <Label color="primary">{params.value}</Label>,
    },
    {
      id: 'joinDate',
      field: 'joinDate',
      cellStyle: { textAlign: 'center' },
      flex: 2,
      cellRenderer: (params) => {
        if (params.data.statusCode === 'JOIN') {
          return <Label color="primary">{params.value}</Label>;
        }
        return null;
      },
    },
    {

      id: '',
      field: 'assigneeName',
      align: 'center',
      flex: 3,

      cellRenderer: (params) => (
        <Label
          onClick={() => {
            router.push(`/users/info/${params.data.assigneeId}`);
          }}

          sx={{
            margin: '11px',
            color: `${params.data.assigneeColor}`,
            '&:hover': {
              color: 'blue',
              cursor: 'pointer',
            },
          }}
        >
          <Avatar sx={{ height: '18px', width: '18px', marginRight: '5px', fontSize: '10px', backgroundColor: `${params.data.assigneeColor}`, }}>
            {params.data.assigneeName.charAt(0).toUpperCase()}
          </Avatar>
          {params.value}
        </Label>
      ),
    },

    { id: 'location',
      field: 'location',
      flex: 2,
      cellEditor: 'agSelectCellEditor',
      editable: true,
      cellEditorParams: {
        values: cities.map(location => location.name),
      },
     },
    { id: '', field: 'leadsName', align: 'center', flex: 2 },
    {
      id: '', field: 'lastFollowup', align: 'center', flex: 2,

      cellRenderer: (params) => (
        <span>
          {params.data.lastFollowup === "" ? "" : params.data.lastFollowup}
        </span>
      )
    },
    {
      id: '',
      field: 'Action',
      align: 'center',
      flex: auth.user.roleCode === 'ADMIN' ? 3 : 2.2,
      filter: false,
      cellRenderer: (params) => (
        <>
          <Tooltip title="Edit">
            <IconButton
              onClick={() => {
                handleEdit(params.data);
              }}
            >
              <Iconify icon="ic:outline-edit-note" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Whats App">
            <a href={`whatsapp://send?phone=+91${params.data.mobileNumber}&text=Hello ${params.data.name}`}>
              <IconButton>
                <Iconify icon="mage:whatsapp-filled" sx={{ color: '#25D366' }} />
              </IconButton>
            </a>
          </Tooltip>

          {auth.user.roleCode === 'ADMIN' ? <Tooltip title="Delete">
            <IconButton onClick={() => handleClickDelete(params.data.cid)}>
              <Iconify icon="material-symbols:delete-outline-rounded" sx={{ color: 'red' }} />
            </IconButton>
          </Tooltip> : null}
        </>
      ),
    },
  ]);

  const [columnDefsCompleted] = useState([
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
      editable: true,
      width: 250,
      flex: 3,

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
      editable: true,
      flex: 3,
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
      cellEditor: 'agSelectCellEditor',
      editable: true,
      cellEditorParams: {
        values: ['Low', 'Medium', 'High', 'N/A'],
      },
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
      id: 'classType',
      field: 'classType',
      cellStyle: { textAlign: 'center' },
      flex: 2,
      cellRenderer: (params) => <Label color="primary">{params.value}</Label>,
    },
    {
      id: 'joinDate',
      field: 'joinDate',
      cellStyle: { textAlign: 'center' },
      flex: 2,
    },
    {
      field: 'completeDate',
      cellStyle: { textAlign: 'center' },
      flex: 2,
    },
    {

      id: '',
      field: 'assigneeName',
      align: 'center',
      flex: 3,

      cellRenderer: (params) => (
        <Label
          onClick={() => {
            router.push(`/users/info/${params.data.assigneeId}`);
          }}

          sx={{
            margin: '11px',
            color: `${params.data.assigneeColor}`,
            '&:hover': {
              color: 'blue',
              cursor: 'pointer',
            },
          }}
        >
          <Avatar sx={{ height: '18px', width: '18px', marginRight: '5px', fontSize: '10px', backgroundColor: `${params.data.assigneeColor}`, }}>
            {params.data.assigneeName.charAt(0).toUpperCase()}
          </Avatar>
          {params.value}
        </Label>
      ),
    },

    { id: 'location',
      field: 'location',
      flex: 2,
      cellEditor: 'agSelectCellEditor',
      editable: true,
      cellEditorParams: {
        values: cities.map(location => location.name),
      },
     },
    { id: '', field: 'leadsName', align: 'center', flex: 2 },
    {
      id: '', field: 'lastFollowup', align: 'center', flex: 2,

      cellRenderer: (params) => (
        <span>
          {params.data.lastFollowup === "" ? "" : params.data.lastFollowup}
        </span>
      )
    },
    {
      id: '',
      field: 'Action',
      align: 'center',
      flex: auth.user.roleCode === 'ADMIN' ? 3 : 2.2,
      filter: false,
      cellRenderer: (params) => (
        <>
          <Tooltip title="Edit">
            <IconButton
              onClick={() => {
                handleEdit(params.data);
              }}
            >
              <Iconify icon="ic:outline-edit-note" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Whats App">
            <a href={`whatsapp://send?phone=+91${params.data.mobileNumber}&text=Hello ${params.data.name}`}>
              <IconButton>
                <Iconify icon="mage:whatsapp-filled" sx={{ color: '#25D366' }} />
              </IconButton>
            </a>
          </Tooltip>

          {auth.user.roleCode === 'ADMIN' ? <Tooltip title="Delete">
            <IconButton onClick={() => handleClickDelete(params.data.cid)}>
              <Iconify icon="material-symbols:delete-outline-rounded" sx={{ color: 'red' }} />
            </IconButton>
          </Tooltip> : null}
        </>
      ),
    },
  ]);

  const handleTabChange = async (event, newValue) => {
    localStorage.setItem('currentPage', JSON.stringify(0));
    setTabValue(newValue);
    localStorage.setItem('selectedTab', newValue)
    localStorage.setItem('code', statusData[newValue].props.value);
    setProgressLoading(true);
    try {
      await getCustomerDataByStatus(statusData[newValue].props.value); 
    } catch (error) {
      console.error("Error fetching customer data:", error);
    } finally {
      setProgressLoading(false); 
    }

  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEdit(false);
    setCustomer({
      id: 0,
      name: '',
      cid: '',
      gender: '',
      mobileNumber: '',
      qualification: '',
      classType: '',
      passedOutYear: '',
      priority: '',
      fresherOrExprienceCode: '',
      fresherOrExprienceName: '',
      leadsCode: '',
      leadsName: '',
      courseCode: '',
      courseName: '',
      statusCode: 'OPEN',
      statusName: '',
      assigneeId: auth.user.uid,
      assigneeName: '',
      reportingId: auth.user.reportingId,
      reportingName: '',
      enquiryDate: format(new Date(), 'yyyy-MMM-dd'),
      location: '',
      profile: '',
      joinDate: '',
      completeDate: '',
    });
    setErrors('');
  };

  const saveCrmData = async () => {
    setProgressLoading(true);
    if (validate()) {
      handleClose();
      const response = await createCustomer(customer);
      if (response.status === 'OK') {
        showSnackbar(response.message, 'success');
        getCustomerDataByStatus(statusData[tabValue].props.value);
        router.push(`/crm/customer/${response.customer.cid}`);
      } else {
        showSnackbar(response.message, 'warning');
      }
    }
  };

  const updateCrmData = async () => {
    setProgressLoading(true);
    if (validate()) {
      handleClose();
      const response = await createCustomer(customer);
      if (response.status === 'OK') {
        showSnackbar(response.message, 'success');
        getCustomerDataByStatus(statusData[tabValue].props.value);
      } else {
        showSnackbar(response.message, 'warning');
      }
    }
  };

  const validate = () => {
    const error = {};

    if (!customer.name) {
      error.name = 'Name is required';
    }
    if (!customer.mobileNumber) {
      error.mobileNumber = 'Mobile number required';
    }
    if (!customer.gender) {
      error.gender = 'Gender is required';
    }
    if (!customer.location) {
      error.location = 'Location is required';
    }
    if (!customer.qualification) {
      error.qualification = 'Qualification is required';
    }
    if (!customer.department) {
      error.department = 'Department is required';
    }
    if (!customer.passedOutYear) {
      error.passedOutYear = 'Passed out year is required';
    }
    if (!customer.fresherOrExprienceCode) {
      error.fresherOrExprienceCode = 'This filed is required';
    }
    if (!customer.enquiryDate) {
      error.enquiryDate = 'Date is required';
    }
    if (!customer.leadsCode) {
      error.leadsCode = 'Lead Source is required';
    }
    if (!customer.courseCode) {
      error.courseCode = 'Course is required';
    }
    if (!customer.classType) {
      error.classType = 'Class Type is required';
    }
    if (!customer.priority) {
      error.priority = 'Priority is required';
    }
    if (!customer.assigneeId) {
      error.assigneeId = 'Assigned is required';
    }
    if (!customer.reportingId) {
      error.reportingId = 'Reporting is required';
    }
    setErrors(error);
    return Object.keys(error).length === 0;
  };

  const handleChange = (e, data) => {
    const { name, value } = e.target || { name: 'location', data };
    if (name === 'statusCode') {
      if (value === 'JOIN') {
        setCustomer((prevState) => ({
          ...prevState,
          "joinDate": customer.joinDate==='' || customer.joinDate === null ? format(new Date(), 'yyyy-MMM-dd') : customer.joinDate,
        }));
      }
      if (value === 'COMP') {
        setCustomer((prevState) => ({
          ...prevState,
          "completeDate":customer.completeDate === '' || customer.completeDate === null ? format(new Date(), 'yyyy-MMM-dd') : customer.completeDate,
        }));
      }
    }
    
    setCustomer((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (!value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: `${name} is required`,
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }

    if (name === 'mobileNumber') {
      const sanitizedValue = value.replace(/[^0-9-]/g, '');
      const truncatedValue = sanitizedValue.slice(0, 10);

      setCustomer((prevState) => ({
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
        {value === index && <Box sx={{ ml: -1, p: 0 }}>{children}</Box>}
      </div>
    );
  }

  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  const defaultColDef = useMemo(
    () => ({
      filter: 'agTextColumnFilter',
    }),
    []
  );

  const handleEdit = (row) => {
    setEdit(true);
    setCustomer({
      id: row.id,
      name: row.name,
      cid: row.cid,
      gender: row.gender,
      mobileNumber: row.mobileNumber,
      qualification: row.qualification,
      classType: row.classType,
      passedOutYear: row.passedOutYear,
      priority: row.priority,
      fresherOrExprienceCode: row.fresherOrExprienceCode,
      fresherOrExprienceName: row.fresherOrExprienceName,
      leadsCode: row.leadsCode,
      leadsName: row.leadsName,
      courseCode: row.courseCode,
      courseName: row.courseName,
      statusCode: row.statusCode,
      statusName: row.statusName,
      assigneeId: row.assigneeId,
      assigneeName: row.assigneeName,
      reportingId: row.reportingId,
      reportingName: row.reportingName,
      enquiryDate: row.enquiryDate,
      department: row.department,
      profile: row.profile,
      location: row.location,
      joinDate: row.statusCode === 'COMP' || row.statusCode === 'JOIN' ? row.joinDate : row.joinDate === null ? format(new Date(), 'yyyy-MMM-dd'): row.statusCode !== 'JOIN' ? null : row.joinDate,
      completeDate: row.statusCode === 'COMP' ? row.completeDate :  row.completeDate === null ? format(new Date(), 'yyyy-MMM-dd') : row.statusCode !== "COMP"  ? null: row.completeDate,

    });
    setOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCustomer((prevState) => ({
          ...prevState,
          profile: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRefresh = () => {
    getCustomerDataByStatus(statusData[tabValue].props.value);
    setRefreshTable(!refreshTable);
  };

  return (
    <Container maxWidth="xxl" sx={{marginBottom:'10px'}}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="warp">
        <Typography variant="h6" sx={{ color: '#f79520' }}>
          CRM
        </Typography>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'warp' }}>
    {/* ----------Refresh button----------- */}
    <Stack spacing={1} direction="row" sx={{ marginRight: '5px' }}>
            <Button variant="text" onClick={handleRefresh}>
              <RefreshIcon />
            </Button>
          </Stack>
          <Tooltip title="CRM Report">
            <Stack spacing={1} direction="row" sx={{ marginRight: '5px' }}>
              <Button variant="text" onClick={() => {
                router.push(`/crm_report`);
              }}>
                <Iconify icon="mdi:report-timeline-variant" />
              </Button>
            </Stack>
          </Tooltip>
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
          >
            New
          </Button>
        </div>
      </Stack>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 0, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
          >
            {status.map((sta, index) => (
              <Tab key={sta.id || index} label={sta.name} {...a11yProps(index)} />
            ))}
          </Tabs>
        </Box>
        {/* --------------Delete Icon Dialog------------------ */}
        <ConfirmDialog
          text="Delete"
          confirmPopup={confirmDelete}
          handleExit={handleDelete}
          handleClosePopup={handleCloseDelete}
        />

        <Card>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={0}
            paddingLeft={2}
            paddingRight={2}
            paddingTop={0}
          >
            < CrmDialog
              open={open}
              onClose={handleClose}
              TransitionComponent={Transition}
              paperprops={{
                component: 'form',
                onSubmit: (event) => {
                  event.preventDefault();
                  if (edit) {
                    updateCrmData();
                  } else {
                    saveCrmData();
                  }
                },
              }}
              handleImageChange={handleImageChange}
              handleChange={handleChange}
              edit={edit}
              errors={errors}
              customer={customer}
              citiesData={citiesData}
              onChangeLocation={(event, value) => {
                setCustomer((prevState) => ({
                  ...prevState,
                  location: value,
                }));
              }}

              handleClose={handleClose}
              departmentData={departmentData}
              onChangeDepartment={(event, value) => {
                setCustomer((prevState) => ({
                  ...prevState,
                  department: value,
                }));
              }}
              qualificationData={qualificationData}

              onChangeQulification={(event, value) => {
                setCustomer((prevState) => ({
                  ...prevState,
                  qualification: value,
                }));
              }}
              fresherOrExprienceData={fresherOrExprienceData}
              onChangeEnqu={(newValue) => {
                setCustomer((prevState) => ({
                  ...prevState,
                  enquiryDate: format(newValue, 'yyyy-MMM-dd'),
                }));
              }}
              leadData={leadData}
              profile={customer.profile}
              courseData={courseData}
              assigneData={assigneData}
              reportingData={reportingData}
              statusData={statusData}
              enquiryDate={parse(customer.enquiryDate, 'yyyy-MMM-dd', new Date())}
              joinedDate={parse(customer.joinDate, 'yyyy-MMM-dd', new Date())}
              completeDate ={parse(customer.completeDate , 'yyyy-MMM-dd', new Date())}
              onChangeJoin={(newValue) => {
                setCustomer((prevState) => ({
                  ...prevState,
                  joinDate: newValue ? format(newValue, 'yyyy-MMM-dd', new Date()) : null,
                }));
              }}
              onChangeComplete={(newValue) => {
                setCustomer((prevState) => ({
                  ...prevState,
                  completeDate: newValue ? format(newValue, 'yyyy-MMM-dd', new Date()) : null,
                }));
              }}
            />

          </Stack>
        </Card>
        {status.map((sta, index) => (
          <CustomTabPanel value={tabValue} index={index} key={index}>
            {progressLoading ? <GradientProgress /> :
              <>
                {isSmallScreen ? (
                  <ListView
                    data={customerData}
                    deletedata={(res) => handleClickDelete(res)}
                    editdata={handleEdit}
                    onRowClick={cid => router.push(`/crm/customer/${cid}`)}
                    page="CRM"
                  />
                ) : (
                  <DataTable
                    quickFilterText={quickFilterText}
                    rowData={customerData}
                    columnDefs={statusData[tabValue] ? (statusData[tabValue].props.value === 'JOIN' ? columnDefsJoin : statusData[tabValue].props.value === 'COMP' ? columnDefsCompleted : columnDefs) : null }
                    // columnDefs={statusData[tabValue] ? columnDefsJoin  : null}
                    defaultColDef={defaultColDef}
                    onCellValueChange={onCellValueChanged}
                    refreshTable={refreshTable}
                    onPaginationChanged={(params) => {
                      if (params.newPage) {
                        const currentPage = params.api.paginationGetCurrentPage();
                        localStorage.setItem('currentPage', JSON.stringify(currentPage));
                      }
                    }}
                    onFirstDataRendered={(params) => {
                      const pageToNavigate = JSON.parse(localStorage.getItem('currentPage'));
                      params.api.paginationGoToPage(pageToNavigate);
                    }}
                  />)}
              </>}
          </CustomTabPanel>
        ))}
      </Box>
    </Container>
  );
}

CRMView.propTypes = {
  handleEdit: PropTypes.any,
};