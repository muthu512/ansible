import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import "./customer-view.css"
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Iconify from 'src/components/iconify';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import DELETE from '@mui/icons-material/Delete';
import { Chip, OutlinedInput, Select, InputLabel, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, MenuItem, Slide, Stack, TextField, Tooltip, CircularProgress, } from '@mui/material';
import { useSnackbar } from 'src/components/snakbar';
import CrmDialog from 'src/components/crm dialog page/crmDialog';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import IconButton from '@mui/material/IconButton';
import ConfirmDialog from 'src/components/confirmdialog/confirm-dialog';
import AlarmIcon from '@mui/icons-material/Alarm';
import { useParams } from 'react-router-dom';
import { useRouter } from 'src/routes/hooks';
import useApiService from 'src/services/api_services';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import AppWidgetSummary from 'src/sections/master/app-widget-summary';
import GradientProgress from 'src/components/progress/gradientProgress';
import { format, parse } from 'date-fns';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useSelector } from 'react-redux';
import { LocalizationProvider, DateTimePicker, DatePicker } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import Label from 'src/components/label';
import cities from '../../../assets/cities.json';
import qulifications from '../../../assets/qualification.json';
import department from '../../../assets/quali-department.json';
import AvatarView from '../../../components/profile-view/profileView';


const Transition = forwardRef((props, ref) => (
  <Slide direction="left" ref={ref} {...props} />
));

export default function CustomerInfo() {
  const { id } = useParams();

  const { getCustomerById, addFollowup, getCustomersFollowup, addReminder, deleteStudentOnboard, getActiveUsers,
    getFresherOrExprienceActive, getCourseActive, getLeadsActive, createCustomer, getStatusActive,
    createPayment, getPaymentStatus,
    getBatchCourses, addToBatch, getStudentOnboardBatch, downloadCertificatePDF } = useApiService();

  const router = useRouter();

  const auth = useSelector((state) => state.auth);
  const { showSnackbar } = useSnackbar();
  const [load, setLoad] = useState(true)
  const [open, setOpen] = useState(false)
  const [editCustomerOpen, setEditCustomerOpen] = useState(false)
  const [openBatch, setOpenBatch] = useState(false)
  const [openLink, setOpenLink] = useState(false)
  const [followUpdata, setFollowUpdata] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [assigneData, setAssigeData] = useState([]);
  const [reportingData, setReportingData] = useState([])
  const [leadData, setLeadData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [fresherOrExprienceData, setFresherOrExprienceData] = useState([])
  const [oldParam, setOldParam] = useState();
  const [errors, setErrors] = useState({});
  const [citiesData, setCitiesData] = useState([]);
  const [qualificationData, setQulificationData] = useState([]);
  const [edit] = useState(true);
  const [openReminderDialoge, setOpenReminderDialoge] = useState(false);
  const [batchData, setBatchData] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [batchOrgData, setBatchOrgData] = useState([]);
  const [showPro, setShowPro] = useState(false);
  const [studentOnboardDetails, setStudentOnboardDetails] = useState([])
  const [departmentData, setDepartmentData] = useState([]);
  const [paymentTableData, setPaymentTableData] = useState([]);
  const [downloadProgress, setDownloadProgress] = useState(false)
  const [saveToBatch, setsaveToBatch] = useState(
    {
      "cid": id,
      "billNo": "",
      "batches": []
    }
  )

  const [reminder, setReminder] = useState({
    'id': 0,
    'cid': id,
    'customerName': "",
    'uid': auth.user.uid,
    'remainderDate': format(new Date(), "yyyy-MMM-dd"),
    'description': "",
    'status': "Pending"
  })

  const [followUp, setFollowUp] = useState({
    "id": 0,
    "cid": id,
    "customerName": "",
    "fcontent": "",
    "uid": auth.user.uid,
    "assigneName": "",
    "fdate": format(new Date(), "yyyy-MMM-dd hh:mm a")
  })

  const [customer, setCustomer] = useState({
    "id": 0,
    "name": "",
    "cid": id,
    "mobileNumber": "",
    "gender": "",
    "classType": "",
    "qualification": "",
    "passedOutYear": "",
    "department": "",
    "priority": "",
    "fresherOrExprienceCode": "",
    "fresherOrExprienceName": "",
    "leadsCode": "",
    "leadsName": "",
    "courseCode": "",
    "courseName": "",
    "statusCode": "",
    "statusName": "",
    "assigneeId": "",
    "assigneeName": "",
    "reportingId": "",
    "reportingName": "",
    "enquiryDate": "",
    "location": "",
    "profile": "",
    "amount": 0,
    "updatedDate": "",
    "completeDate": '',
    "joinDate": '',
  });

  const [payment, setPayment] = useState({
    "id": 0,
    "cid": id,
    "refId": "",
    "paymentStatus": "",
    "paymentType": "",
    "amount": 0,
    "description": "",
    "tdate": format(new Date(), "yyyy-MMM-dd"),
  })

  const validatePayment = () => {
    const error = {};

    if (!payment.amount) {
      error.amount = "Amount is required";
    } else if (payment.amount === 0) {
      error.amount = "Amount cannot be zero";
    }

    if (!payment.refId) {
      error.refId = "Reference ID is required";
    }

    if (!payment.paymentType) {
      error.paymentType = "Payment type is required";
    }

    if (!payment.paymentStatus) {
      error.paymentStatus = "Payment status is required";
    }

    if (!payment.tdate) {
      error.tdate = "Date is required";
    }

    setErrors(error);
    return Object.keys(error).length === 0;
  };

  const handleAvatarOpen = () => {
    setShowPro(true);
  };

  const handleAvatarClose = () => {
    setShowPro(false);
  };

  const handleOpen = () => {
    setOpen(true)
  }
  const handlebatchOpen = () => {
    setOpenBatch(true)
  }

  const handleLinkOpen = () => {
    setOpenLink(true)
  }

  const handleEdit = (row) => {
    setFollowUp({
      "id": row.id,
      "cid": row.cid,
      "customerName": row.customerName,
      "fcontent": row.fcontent,
      "uid": row.uid,
      "assigneName": row.assigneName,
      "fdate": row.fdate
    })
    setOpen(true);
  }

  

  const handleClose = () => {
    setOpen(false);
    setFollowUp({
      "id": 0,
      "cid": id,
      "customerName": "",
      "fcontent": "",
      "uid": auth.user.uid,
      "assigneName": "",
      "fdate": format(new Date(), "yyyy-MMM-dd hh:mm a")
    })
  }

  const handleCloseDelete = () => {
    setConfirmDelete(false);
    setItemToDelete(null);
  };

  const handleClickDelete = (item) => {
    setItemToDelete(item);
    setConfirmDelete(true);
  };

  const handleOpenReminder = () => {
    setOpenReminderDialoge(true)
  }
  const handleCloseReminder = () => {
    setOpenReminderDialoge(false);
    setReminder({
      'id': 0,
      'cid': id,
      'uid': auth.user.uid,
      'customerName': "",
      'remainderDate': format(new Date(), "yyyy-MMM-dd"),
      'description': "",
      'status': "Pending"
    })
  }

  const updateCrmData = async () => {
    if (validate()) {
      const response = await createCustomer(customer);
      if (response.status === "OK") {
        showSnackbar(response.message, 'success');
        getCustomerDetails(id);
      } else {
        showSnackbar(response.message, 'warning');
      }
    }
  }

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
      error.classType = 'Class Type is required'
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
          "joinDate": customer.joinDate
        }));
      }
      if (value === 'COMP') {
        setCustomer((prevState) => ({
          ...prevState,
          "completeDate": customer.completeDate
        }));
      }
    }
    setCustomer((prevState) => ({
      ...prevState,
      [name]: value
    }));
    if (!value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: `${name} is required`
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  const getStudentOnBoardView = useCallback(async () => {
    const response = await getStudentOnboardBatch(id);
    setStudentOnboardDetails(response)
    setsaveToBatch((prevState) => ({
      ...prevState,
      "batches": response.map((stuOn) => stuOn.batchId),
      "billNo": response.length > 0 ? response[0].billNo : ""
    }))
  }, [getStudentOnboardBatch, id]);

  const getBatchDetails = useCallback(async (code) => {
    const response = await getBatchCourses(code);
    setBatchOrgData(response);
    const data = response.map((batch) => <MenuItem value={batch.id} label={batch.name}>{batch.title}</MenuItem>);
    setBatchData(data);
    getStudentOnBoardView();
  }, [getBatchCourses, getStudentOnBoardView]);

  const getCustomerDetails = useCallback(async (cid) => {
    const response = await getCustomerById(cid);
    setCustomer(response);
    getBatchDetails(response.courseCode)
  }, [getCustomerById, getBatchDetails]);

  const paymentTableCall = useCallback(async (cid) => {
    const response = await getPaymentStatus(cid);
    setPaymentTableData(response);
  }, [getPaymentStatus]);

  const getCustomerFollowup = useCallback(async (cid) => {
    const response = await getCustomersFollowup(cid);
    setFollowUpdata(response);
  }, [getCustomersFollowup]);

  const getLeads = useCallback(async () => {
    const response = await getLeadsActive();
    const data = response.map((lead) => (
      <MenuItem value={lead.code}>{lead.name}</MenuItem>)
    )
    setLeadData(data);
  }, [getLeadsActive]);

  const getCourse = useCallback(async () => {
    const response = await getCourseActive();
    const data = response.map((course) => (
      <MenuItem value={course.code}>{course.name}</MenuItem>)
    )
    setCourseData(data);
  }, [getCourseActive]);

  const getFresherOrExprience = useCallback(async () => {
    const response = await getFresherOrExprienceActive();
    const data = response.map((course) => (
      <MenuItem value={course.code}>{course.name}</MenuItem>)
    )
    setFresherOrExprienceData(data);
  }, [getFresherOrExprienceActive]);

  const getUsersActive = useCallback(async () => {
    const response = await getActiveUsers();
    const data = response.map((user) => (
      <MenuItem value={user.uid}>{user.userName}</MenuItem>)
    )
    setAssigeData(data);
    setReportingData(data);
  }, [getActiveUsers]);

  const getCertificate = useCallback(async () => {
    setDownloadProgress(true)
    const response = await downloadCertificatePDF(id).finally(() => {
      setDownloadProgress(false)
    });
    console.log(response);
  }, [downloadCertificatePDF, id])


  const loadCities = useCallback(() => {
    const data = cities.map((city) => (
      city.name
    )
    );

    setCitiesData(data);
  }, []);

  const loadQulification = useCallback(() => {
    const data = qulifications.map((qulification) => (
      qulification.name
    )
    );
    setQulificationData(data);
  }, []);

  const loadDepartment = useCallback(() => {
    const data = department.map((departments) => departments.name);
    setDepartmentData(data);
  }, []);

  const getUserstatus = useCallback(async () => {
    const response = await getStatusActive();
    const data = response.map((statusRes) => (
      <MenuItem value={statusRes.code}>{statusRes.name}</MenuItem>)
    )
    setStatusData(data);
  }, [getStatusActive]);

  useEffect(() => {
    if (oldParam !== id) {
      setLoad(true);
    }
    if (load) {
      setOldParam(id);
      getCustomerFollowup(id);
      getCustomerDetails(id);
      paymentTableCall(id);
      loadQulification();
      loadCities();
      loadDepartment();
      getLeads()
      getUserstatus();
      getCourse();
      getFresherOrExprience();
      getUsersActive();
      setLoad(false);
    }
  }, [load, oldParam, getCustomerDetails, getCustomerFollowup, id, loadQulification, paymentTableCall,
    loadCities, getLeads, getCourse, getFresherOrExprience, getUsersActive, getUserstatus, loadDepartment])

  const saveAccount = async () => {
    const response = await addFollowup(followUp);
    if (response.status === "OK") {
      showSnackbar(response.message, 'success');
      getCustomerFollowup(id);
    } else {
      showSnackbar(response.message, 'warning');
    }
  }

  const editAccount = async () => {
    const response = await addFollowup(followUp);
    if (response.status === "OK") {
      showSnackbar(response.message, 'success');
      getCustomerFollowup(id);
    } else {
      showSnackbar(response.message, 'warning');
    }
  }

  const saveReminder = async () => {
    const response = await addReminder(reminder);
    if (response.status === "OK") {
      showSnackbar(response.message, 'success');
    } else {
      showSnackbar(response.message, 'warning');
    }
  }

  const handleDeleteBatch = async () => {
    const response = await deleteStudentOnboard(itemToDelete);
    handleCloseDelete();
    if (response.status === "OK") {
      showSnackbar(response.message, 'success');
      getStudentOnBoardView();
    } else {
      showSnackbar(response.message, 'warning');
    }
  }

  const saveBatch = async () => {
    handleBatchClose();
    const response = await addToBatch(saveToBatch);
    if (response.status === "OK") {
      getStudentOnBoardView();
      showSnackbar(response.message, 'success');
    } else {
      showSnackbar(response.message, 'warning');
    }
  }

  const savePayment = async () => {
    if (validatePayment()) {
      handlePaymentTransaction()
      const response = await createPayment(payment);
      if (response.status === "OK") {
        showSnackbar(response.message, 'success');
      } else {
        showSnackbar(response.message, 'warning');
      }
      getCustomerDetails(id)
      paymentTableCall(id)
    }
  }

  const handleChangePay = (e) => {
    const { name, value } = e.target;
    setPayment((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  const handleCustomerEdit = (row) => {
    setCustomer({
      "id": row.id,
      "name": row.name,
      "cid": row.cid,
      "gender": row.gender,
      "mobileNumber": row.mobileNumber,
      "qualification": row.qualification,
      "classType": row.classType,
      "passedOutYear": row.passedOutYear,
      "priority": row.priority,
      "fresherOrExprienceCode": row.fresherOrExprienceCode,
      "fresherOrExprienceName": row.fresherOrExprienceName,
      "leadsCode": row.leadsCode,
      "leadsName": row.leadsName,
      "courseCode": row.courseCode,
      "courseName": row.courseName,
      "statusCode": row.statusCode,
      "statusName": row.statusName,
      "department": row.department,
      "assigneeId": row.assigneeId,
      "assigneeName": row.assigneeName,
      "reportingId": row.reportingId,
      "reportingName": row.reportingName,
      "enquiryDate": row.enquiryDate,
      "location": row.location,
      "profile": row.profile,
      "joinDate": row.statusCode === 'JOIN' || row.statusCode === "COMP" ? row.joinDate : null,
      "completeDate": row.statusCode !== "COMP"  ? null: row.completeDate,
      // "joinDate": row.statusCode === 'COMP' || row.statusCode === 'JOIN' ? row.joinDate : row.joinDate === null ? format(new Date(), 'yyyy-MMM-dd'): row.statusCode !== 'JOIN' ? null : row.joinDate,
      // "completeDate": row.statusCode === 'COMP' ? row.completeDate :  row.completeDate === null ? format(new Date(), 'yyyy-MMM-dd') : row.statusCode !== "COMP"  ? null: row.completeDate,
    })
    setEditCustomerOpen(true);
  };

  const handlebatchEdit = () => {
    setOpenBatch(true)
  }

  const handleCustomerClose = () => {
    setEditCustomerOpen(false);
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
    getCustomerDetails(id)
    setErrors('')
  };

  const handleBatchClose = () => {
    setOpenBatch(false);
    setsaveToBatch(
      {
        "cid": id,
        "billNo": "",
        "batches": []
      }
    )
    getBatchDetails(customer.courseCode);
    setErrors('')
  };

  const handlePaymentTransaction = () => {
    setOpenLink(false);
    setPayment({
      "id": 0,
      "cid": id,
      "refId": "",
      "paymentStatus": "",
      "paymentType": "",
      "amount": 0,
      "description": "",
      "tdate": format(new Date(), "yyyy-MMM-dd"),
    })
    setErrors('')
  }

  const initialRecordCount = 5;

  const [isExpanded, setIsExpanded] = useState(false);

  const handleViewMoreClick = () => {
    setIsExpanded(!isExpanded);
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

  const recordsToShow = isExpanded ? paymentTableData : paymentTableData.slice(0, initialRecordCount);

  return (
    load ? <GradientProgress /> :
      <div style={{ paddingBottom: '30px' }}>
        {/* ------------Customer Infomation------------ */}
        <ConfirmDialog
          text="Would you like to remove the student attendance record? If you remove the batch, it will be erased."
          confirmPopup={confirmDelete}
          handleExit={handleDeleteBatch}
          handleClosePopup={handleCloseDelete}
        />
        <div style={{ padding: '10px', display: 'flex', gap: 20, justifyContent: 'space-between', flexWrap: 'wrap', alignItems: "center" }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" paddingBottom='15px'
            onClick={() => { router.back() }}
            sx={{
              color: "#f79520",
              "&:hover": {
                color: 'blue',
                cursor: "pointer",
              }
            }}>
            <KeyboardArrowLeftIcon />
            <Tooltip title='Back'> <Typography variant="h6" >Customer Information</Typography></Tooltip>

          </Stack>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {downloadProgress ? <CircularProgress size={24} /> :
              <Button className='pdf_styles' sx={{ marginRight: '15px', }} onClick={getCertificate} >Certificate</Button>}
            <Tooltip title="CRM Report">
              <Stack spacing={2} direction="row" sx={{ marginRight: '15px' }}>
                <Button variant="text" color='inherit' onClick={() => router.push(`/crm_report?showForm=false`)
                }>
                  <Iconify icon="mdi:report-timeline-variant" />
                </Button>
              </Stack>
            </Tooltip>
            <Tooltip title='Edit'> <Button variant="contained" color="inherit" onClick={() => { handleCustomerEdit(customer) }}>
              <Iconify icon="eva:edit-fill" sx={{ mr: 1 }} />
              Edit
            </Button></Tooltip>
          </div>

          <Dialog
            open={open}
            onClose={handleClose}
            onBackdropClick="false"
            TransitionComponent={Transition}
            fullWidth
            maxWidth="sm"
            keepMounted
            PaperProps={{
              component: 'form',
              onSubmit: (event) => {
                event.preventDefault();
                if (edit) {
                  editAccount();
                } else {
                  saveAccount();
                }
                handleClose();
              },
            }}
          >
            <DialogTitle color='#f79520' >Add Follow</DialogTitle>
            <DialogContent>
              <Stack spacing={2}>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DateTimePicker
                        label="FollowUp Date and Time"
                        onChange={(newValue) => {
                          setFollowUp((prevState) => ({
                            ...prevState,
                            fdate: format(newValue, "yyyy-MMM-dd hh:mm a")
                          }));
                        }}
                        value={parse(followUp.fdate, "yyyy-MMM-dd hh:mm a", new Date())}
                        renderInput={(params) => <TextField {...params} fullWidth required />}
                        dateFormat="yyyy-MM-dd"
                        timeFormat="HH:mm"
                      />
                    </LocalizationProvider>

                  </Grid>
                  <Grid item xs={11.5}>
                    <TextField
                      label={
                        <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                          <Iconify
                            sx={{ marginRight: '4px' }}
                            icon="material-symbols-light:description-rounded"
                            width="1.2rem"
                            height="1.2rem"
                          />
                          <div> Description *</div>
                        </Grid>
                      }
                      value={followUp.fcontent}
                      variant="outlined"
                      multiline
                      rows={3}
                      onChange={(e) => {
                        setFollowUp((prevState) => ({
                          ...prevState,
                          fcontent
                            :
                            e.target.value
                        }));
                      }}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="secondary">Cancel</Button>
              <Button type="submit" color='primary'>Submit</Button>
            </DialogActions>
          </Dialog>
          {/* ----Reminder---- */}
          <Dialog
            open={openReminderDialoge}
            onClose={handleCloseReminder}
            onBackdropClick="false"
            TransitionComponent={Transition}
            fullWidth
            maxWidth="sm"
            keepMounted
            PaperProps={{
              component: 'form',
              onSubmit: (event) => {
                event.preventDefault();
                saveReminder();
                handleCloseReminder();
              },
            }}
          >
            <DialogTitle color='#f79520' >Reminder</DialogTitle>
            <DialogContent>
              <Stack spacing={2}>

                <Grid container spacing={2} >
                  <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Reminder Date"
                        value={parse(reminder.remainderDate, "yyyy-MMM-dd", new Date())}
                        onChange={(newValue) => {
                          setReminder((prevState) => ({
                            ...prevState,
                            remainderDate: format(newValue, "yyyy-MMM-dd")
                          }));
                        }}
                        format="yyyy-MMM-dd"
                        renderInput={(params) => <TextField {...params} fullWidth required />}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={11.5} md={5.5} sm={11.5}>
                    <FormControl fullWidth>
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
                        label={
                          <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                            <Iconify
                              sx={{ marginRight: '4px' }}
                              icon="majesticons:chat-status-line"
                              width="1.2rem"
                              height="1.2rem"
                            />
                            <div> Status *</div>
                          </Grid>
                        }
                        name="status"
                        onChange=
                        {(event) => {
                          const { name, value } = event.target;
                          setReminder((prevState) => ({
                            ...prevState,
                            [name]: value
                          }));
                        }
                        }
                      >
                        <MenuItem value='Pending'>Pending</MenuItem>
                        <MenuItem value='Completed'>Completed</MenuItem>
                      </TextField>

                    </FormControl>
                  </Grid>
                  <Grid item xs={11.5} >
                    <TextField
                      label={
                        <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                          <Iconify
                            sx={{ marginRight: '4px' }}
                            icon="material-symbols-light:description-rounded"
                            width="1.2rem"
                            height="1.2rem"
                          />
                          <div> Description *</div>
                        </Grid>
                      }
                      variant="outlined"
                      multiline
                      value={reminder.description}
                      rows={3}
                      onChange={(e) => {
                        setReminder((prevState) => ({
                          ...prevState,
                          description
                            :
                            e.target.value
                        }));
                      }}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseReminder} color="secondary">Cancel</Button>
              <Button type="submit" color='primary'>Add</Button>
            </DialogActions>
          </Dialog>

          {/* ---------------Add batch button Dialog--------------- */}

          <Dialog
            open={openBatch}
            onClose={handleBatchClose}
            onBackdropClick="false"
            TransitionComponent={Transition}
            fullWidth
            maxWidth="sm"
            keepMounted
            PaperProps={{
              component: 'form',
              onSubmit: (event) => {
                event.preventDefault();
                saveBatch()
                handleBatchClose()
              },
            }}
          >
            <DialogTitle color='#f79520' >Add Batch</DialogTitle>
            <DialogContent>
              <Stack spacing={2}>
                <Grid container spacing={2} >
                  <Grid item xs={11} >
                    <TextField
                      value={saveToBatch.billNo}
                      onChange={(e) => {
                        setsaveToBatch((prevState) => ({
                          ...prevState,
                          [e.target.name]: e.target.value,
                        }));
                      }}
                      id="outlined-basic"
                      fullWidth
                      name="billNo"
                      label="Bill Number"
                      variant="outlined" />
                  </Grid>
                  <Grid item xs={11} >
                    <FormControl sx={{ width: { xs: '100%', sm: '500px' } }}>
                      <InputLabel>Batch ID</InputLabel>
                      <Select
                        multiple
                        MenuProps={{
                          style: { height: '300px' }
                        }}
                        value={saveToBatch.batches}
                        onChange={(e) => setsaveToBatch((prevState) => ({
                          ...prevState,
                          "batches": e.target.value,
                        }))}
                        input={<OutlinedInput label="Multiple Select" />}
                        renderValue={(selected) => (
                          <Stack gap={1} direction="row" flexWrap="wrap">
                            {selected.map((value) => (
                              <Chip
                                key={value}
                                label={batchOrgData.length > 0 ?
                                  batchOrgData.find(batch => batch.id === value) === "undefined" ? '' : batchOrgData.find(batch => batch.id === value).title : ''}
                                onDelete={null}
                                deleteIcon={null}
                              />
                            ))}
                          </Stack>
                        )
                        }
                      >
                        {batchData}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleBatchClose} color="secondary">Cancel</Button>
              <Button type="submit" color='primary'>Submit</Button>
            </DialogActions>
          </Dialog>
          {/* ---------------------------Transaction payment method---------------------------- */}
          <Dialog
            open={openLink}
            onClose={handlePaymentTransaction}
            onBackdropClick="false"
            TransitionComponent={Transition}
            fullWidth
            maxWidth="md"
            keepMounted
            PaperProps={{
              component: 'form',
              onSubmit: (event) => {
                event.preventDefault();
                const isValid = validatePayment();
                if (isValid) {
                  savePayment();
                }
              },
            }}
          >
            <DialogTitle color='#f79520' sx={{ paddingTop: '30px' }}>Payment method</DialogTitle>
            <DialogContent item sx={{ padding: '30px', paddingTop: '30px' }}>
              <Stack spacing={2}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
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
                        value={payment.paymentType}
                        error={Boolean(errors.paymentType)}
                        helperText={errors.paymentType}
                        label={
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item>
                              <Iconify
                                icon="marketeq:wallet-money-3"
                                width="1.2rem"
                                height="1.2rem"
                              />
                            </Grid>
                            <Grid item>
                              <div>Payment Type *</div>
                            </Grid>
                          </Grid>
                        }
                        name="paymentType"
                        onChange={handleChangePay}
                      >
                        <MenuItem value="Cash">Cash</MenuItem>
                        <MenuItem value="UPI">UPI</MenuItem>
                        <MenuItem value="Card">Card</MenuItem>
                        <MenuItem value="G Pay">G Pay</MenuItem>
                        <MenuItem value="PhonePe">PhonePe</MenuItem>
                        <MenuItem value="Bucciness Account">Business Account</MenuItem>
                        <MenuItem value="Paytm">Paytm</MenuItem>
                        <MenuItem value="CRUD">CRUD</MenuItem>
                        <MenuItem value="Netbanking">Netbanking</MenuItem>
                        <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                        <MenuItem value="Check">Cheque</MenuItem>
                        <MenuItem value="Others">Others</MenuItem>
                      </TextField>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DemoContainer components={['DatePicker']}>
                        <DatePicker
                          value={parse(payment.tdate, 'yyyy-MMM-dd', new Date())}

                          onChange={(newValue) => {
                            setPayment((prevState) => ({
                              ...prevState,
                              tdate: format(newValue, 'yyyy-MMM-dd'),
                            }));
                          }}

                          format='yyyy-MMM-dd'
                          label={
                            <Grid container alignItems="center" spacing={1}>
                              <Grid item>
                                <Iconify
                                  icon="lets-icons:date-range"
                                  width="1.2rem"
                                  height="1.2rem"
                                />
                              </Grid>
                              <Grid item>
                                <div>Payment Date *</div>
                              </Grid>
                            </Grid>
                          } />
                      </DemoContainer>
                    </LocalizationProvider>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <TextField
                        select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={payment.paymentStatus}
                        error={Boolean(errors.paymentStatus)}
                        helperText={errors.paymentStatus}
                        label={
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item>
                              <Iconify
                                icon="marketeq:wallet-money-3"
                                width="1.2rem"
                                height="1.2rem"
                              />
                            </Grid>
                            <Grid item>
                              <div>Payment Status *</div>
                            </Grid>
                          </Grid>
                        }
                        name="paymentStatus"
                        onChange={handleChangePay}
                      >
                        <MenuItem value="Partial">Partial</MenuItem>
                        <MenuItem value="Full">Full</MenuItem>
                      </TextField>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      value={payment.amount}
                      onChange={handleChangePay}
                      id="outlined-basic"
                      name="amount"
                      label={
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item>
                            <Iconify
                              icon="emojione-monotone:money-bag"
                              width="1.2rem"
                              height="1.2rem"
                            />
                          </Grid>
                          <Grid item>
                            <div>Amount *</div>
                          </Grid>
                        </Grid>
                      }
                      variant="outlined"
                      fullWidth
                      error={Boolean(errors.amount)}
                      helperText={errors.amount}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      value={payment.refId}
                      error={Boolean(errors.refId)}
                      helperText={errors.refId}
                      onChange={handleChangePay}
                      id="outlined-basic"
                      name="refId"
                      label={
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item>
                            <Iconify
                              icon="hugeicons:file-pin"
                              width="1.2rem"
                              height="1.2rem"
                            />
                          </Grid>
                          <Grid item>
                            <div>Reference ID *</div>
                          </Grid>
                        </Grid>
                      }
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      value={payment.description}
                      onChange={handleChangePay}
                      id="outlined-basic"
                      name="description"
                      label={
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item>
                            <Iconify
                              icon="fluent:text-description-24-filled"
                              width="1.2rem"
                              height="1.2rem"
                            />
                          </Grid>
                          <Grid item>
                            <div>Description *</div>
                          </Grid>
                        </Grid>
                      }
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Stack>

            </DialogContent>
            <DialogActions>
              <Button onClick={handlePaymentTransaction} color="secondary">Cancel</Button>
              <Button type="submit" color='primary'>Submit</Button>
            </DialogActions>
          </Dialog>

          {/* --------------------------------crm dialog component------------------------------------- */}
          < CrmDialog
            open={editCustomerOpen}
            onClose={handleCustomerClose}
            TransitionComponent={Transition}
            paperprops={{
              component: 'form',
              onSubmit: (event) => {
                event.preventDefault();
                const isValid = validate();
                if (isValid) {
                  updateCrmData();
                  handleCustomerClose();
                }
              },
            }}

            handleImageChange={handleImageChange}
            profile={customer.profile}
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
            handleClose={handleCustomerClose}
            qualificationData={qualificationData}
            onChangeQulification={(event, value) => {
              setCustomer((prevState) => ({
                ...prevState,
                qualification: value,
              }));
            }}
            departmentData={departmentData}
            onChangeDepartment={(event, value) => {
              setCustomer((prevState) => ({
                ...prevState,
                department: value,
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
            courseData={courseData}
            assigneData={assigneData}
            reportingData={reportingData}
            statusData={statusData}
            enquiryDate={parse(customer.enquiryDate, 'yyyy-MMM-dd', new Date())}
            joinedDate={parse(customer.joinDate, 'yyyy-MMM-dd', new Date())}
            completeDate={parse(customer.completeDate, 'yyyy-MMM-dd', new Date())}
            onChangeJoin={(newValue) => {
              setCustomer((prevState) => ({
                ...prevState,
                joinDate:newValue ? format(newValue, 'yyyy-MMM-dd', new Date()) : null,
              }));
            }}
            onChangeComplete={(newValue) => {
              setCustomer((prevState) => ({
                ...prevState,
                completeDate:newValue ? format(newValue, 'yyyy-MMM-dd', new Date()) : null,
              }));
            }}
          />

        </div>
        <Divider sx={{ marginBottom: 4 }} />

        <div style={{ paddingLeft: '40px', paddingRight: '30px' }}>
          <Grid container spacing={2} sx={{ padding: 1 }}>

            <Grid container item md={2} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Box onClick={handleAvatarOpen} style={{ cursor: 'pointer' }}><Avatar variant="square" src={customer.profile} sx={{ width: 150, height: 150, }} >{customer.name.charAt(0).toUpperCase()}</Avatar></Box>
              <Typography variant="subtitle2" sx={{ paddingTop: '10px' }} >{customer.name.toUpperCase()} </Typography>
              <Typography sx={{ fontSize: "12px", fontWeight: 500 }} >STATUS :  <span style={{ fontWeight: 'bold', color: customer.statusName === 'Joined' ? '#21d421' : customer.statusName === 'Open' ? 'blue' : customer.statusName === 'InProgress' ? 'orangered' : customer.statusName === 'TT-Priority' ? 'orange' : 'red' }}> {customer.statusName}</span>  </Typography>
            </Grid>

            <Grid container item md={10}>
              <Grid container item xs={4} sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }} >

                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '12px', width: '90px' }} >Gender</Typography>
                  <span style={{ fontSize: '13px' }}>:  {customer.gender}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '12px', width: '90px' }} >Phone number</Typography>
                  <span style={{ fontSize: '13px' }} >: {`+91-${customer.mobileNumber}`}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '12px', width: '90px' }} >Location</Typography>
                  <span style={{ fontSize: '13px' }} >: {customer.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '12px', width: '90px' }} >Fresh / Exp</Typography>
                  <span style={{ fontSize: '13px' }} >: {customer.fresherOrExprienceName}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '12px', width: '90px' }} >Passed out</Typography>
                  <span style={{ fontSize: '13px' }} >: {customer.passedOutYear}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '12px', width: '90px' }} >Education</Typography>
                  <span style={{ fontSize: '13px' }} >: {customer.qualification} {customer.department !== null ? `- (${customer.department})` : null}</span>
                </div>
              </Grid>

              <Grid item xs={4} sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }} >

                <div style={{ display: 'flex', alignItems: 'center', }}>
                  <Typography sx={{ fontSize: '12px', width: '90px' }} >Enquary Date</Typography>
                  <span style={{ fontSize: '13px' }}>:  {customer.enquiryDate}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '12px', width: '90px' }} >Lead</Typography>
                  <span style={{ fontSize: '13px' }} >: {customer.leadsName}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '12px', width: '90px' }} >Course</Typography>
                  <span style={{ fontSize: '13px' }} >: {customer.courseName}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '12px', width: '90px' }} >Join Date</Typography>
                  <span style={{ fontSize: '13px' }} >: {customer.joinDate ? customer.joinDate : 'Not joined yet'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '12px', width: '90px' }} >Completed Date</Typography>
                  <span style={{ fontSize: '13px' }} >: {customer.completeDate ? customer.completeDate : 'Not Completed yet'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '12px', width: '90px' }} >Amount</Typography>
                  <span style={{ fontSize: '13px' }} >: {customer.amount}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '12px', width: '90px' }} >Modified Date</Typography>
                  <span style={{ fontSize: '13px' }} >: {customer.updatedDate ? customer.updatedDate : "Not Modified"}</span>
                </div>
              </Grid>
              <Grid item xs={4} sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }} >

                <Typography sx={{ fontSize: "14px", color: 'gray' }} >Status : <span style={{ fontWeight: 'bold', color: customer.statusName === 'Joined' ? '#21d421' : customer.statusName === 'Open' ? 'blue' : customer.statusName === 'InProgress' ? 'orangered' : customer.statusName === 'TT-Priority' ? 'orange' : 'red' }}> {customer.statusName}</span>  </Typography>
                <Typography sx={{ fontSize: "14px", color: 'gray' }} >Priority : <span style={{ color: customer.priority === 'High' ? 'red' : customer.priority === 'Low' ? 'blue' : 'orange', fontWeight: 'bold' }}>{customer.priority}</span>  </Typography>

                <div style={{ paddingRight: 10 }}>
                  <span style={{ fontSize: '14px', color: 'gray' }}>Assigne</span>: <span style={{ color: '#21d421', fontWeight: 'bold' }}>{customer.assigneeName}</span>
                </div>

                <div style={{ paddingRight: 10 }}>
                  <span style={{ fontSize: '14px', color: 'gray' }}>Reporting</span>: <span style={{ color: 'blue', fontWeight: 'bold' }}>{customer.reportingName}</span>
                </div>


                <div>
                  <a href={`whatsapp://send?phone=+91${customer.mobileNumber}&text=Hello ${customer.name}`}>
                    <Tooltip title="Whats App">
                      <IconButton>
                        <Iconify icon="mage:whatsapp-filled" sx={{ color: '#25D366' }} />
                      </IconButton>
                    </Tooltip>
                  </a>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </div>

        {/* ------------Courses details----------- */}
        <Box sx={{ paddingLeft: 2, paddingRight: 2, paddingTop: 0 }}>

          <Grid container spacing={1} columns={{ xs: 4, sm: 8, md: 12 }} >


            <Grid item xs={12} sx={{ marginTop: '20px', display: 'flex', flexDirection: 'column', paddingTop: 0 }}>
              <div >
                <div style={{ display: 'flex', justifyContent: 'space-between' }} >
                  <p>
                    {studentOnboardDetails.length !== 0 ? <b> Bill Number : <span style={{ color: 'black', fontSize: '15px' }}> <Label color='primary' > {studentOnboardDetails[0].billNo}</Label></span></b> : null}
                  </p>
                  {customer.statusCode === 'JOIN' ?
                    <div>

                      <Button sx={{ marginRight: '20px' }} startIcon={<Iconify icon="tabler:report-money" />} onClick={handleLinkOpen}> Payment Method </Button>

                    </div> : null}
                </div>

                {recordsToShow.length >= 1 ?
                  <div className="table-container">
                    <table className='table1'>
                      <thead className='thead1'>
                        <tr>
                          <th>s.no</th>
                          <th>Date</th>
                          <th>Reference-no</th>
                          <th>Payment Type</th>
                          <th>Amount</th>
                          <th>Payment Status</th>
                          <th>Description</th>
                        </tr>
                      </thead>
                      <tbody className='tablebody'>
                        {recordsToShow.map((pay, index) => (
                          <tr key={index} className='tbody1'>
                            <td>{index + 1}</td>
                            <td>{pay.tdate}</td>
                            <td>{pay.refId}</td>
                            <td>{pay.paymentType}</td>
                            <td>{pay.amount}</td>
                            <td> <Label my={0.4} color={pay.paymentStatus === 'Full' ? 'success' : 'warning'} >{pay.paymentStatus}</Label></td>
                            <td>{pay.description}</td>
                          </tr>))}
                      </tbody>
                    </table></div> : null}
                {paymentTableData.length > initialRecordCount && (
                  <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <Button onClick={handleViewMoreClick}>
                      {isExpanded ? 'View Less' : 'View More'}
                    </Button>
                  </div>
                )}

                {/* --------------------------------Student onboard details-------------------------------- */}
                {recordsToShow.length >= 1 ?
                  studentOnboardDetails.length === 0 ?
                    <div style={{ textAlign: 'right', marginTop: '10px' }}>
                      <Button variant="contained" color="inherit" onClick={() => handlebatchOpen()} startIcon={<Iconify icon="eva:plus-fill" />}>
                        Add Batch
                      </Button>
                    </div>
                    : <div style={{ textAlign: 'right' }}> <Button variant="contained" color="inherit" onClick={() => handlebatchEdit()} startIcon={<Iconify icon="eva:edit-fill" />}>
                      Edit Batch
                    </Button>
                    </div>
                  : null}
                {customer.statusCode === 'JOIN' && recordsToShow.length >= 1 ?
                  <>
                    <Divider sx={{ marginBottom: 2, margin: 0 }}> Student Batch details</Divider>

                    <Grid container spacing={2} mt={1} >
                      {studentOnboardDetails.map((onBoard) => (
                        <Grid item xs={12} sm={6} md={4}>
                          <AppWidgetSummary
                            title={onBoard.batchTitle} d
                            scheduleTime={onBoard.scheduleTime}
                            color="success"
                            icon={onBoard.courseProfile ? <img alt="icon" src={onBoard.courseProfile} /> : <img alt="icon" src='/assets/icons/glass/code.png' />}
                            deleteIcon={<IconButton><DELETE sx={{ color: 'orange', }} onClick={() => { handleClickDelete(onBoard.id) }} /></IconButton>}
                          />
                        </Grid>
                      ))}
                    </Grid> </> : null}
              </div>

              {/* ------------Follow up Button------------- */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '5px', padding: '10px 0', alignItems: 'center' }}>
                  <Typography sx={{ fontWeight: 'bold', color: '#f79520' }}>Follow up</Typography>
                  <div style={{ marginLeft: 'auto' }}>
                    <Tooltip title='Reminder'> <IconButton color="secondary" aria-label="add an alarm" sx={{ marginRight: 2, color: 'red' }} onClick={() => handleOpenReminder()}>
                      <AlarmIcon />
                    </IconButton></Tooltip>
                    <Tooltip title='Follow Up'><Button variant="contained" color="inherit" onClick={() => handleOpen()} startIcon={<Iconify icon="eva:plus-fill" />}>
                      Follow up
                    </Button></Tooltip>
                  </div>
                </div>
                <Divider sx={{ marginBottom: 2 }} />
              </div>
            </Grid>

            {/* -----------1st card----------- */}
            <Grid container px={3}>
              {followUpdata.map((fUp) => (
                auth.user.uid === fUp.uid ?
                  <Grid container justifyContent="flex-end" >
                    <Grid item xs={12} >

                      <Card sx={{ marginLeft: 'auto', paddingLeft: 4, width: '100%', borderRadius: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >

                        <Tooltip title='Edit'>

                          <IconButton color='success' sx={{ backgroundColor: 'whitesmoke' }}
                            onClick={() => { handleEdit(fUp) }}
                          >
                            <Iconify icon="ic:outline-edit-note" />
                          </IconButton>
                        </Tooltip>

                        <CardHeader sx={{ padding: 2, display: 'flex', flexDirection: 'row-reverse', alignItems: 'center' }}
                          avatar={
                            <Avatar sx={{ marginLeft: 2 }} aria-label="recipe" src={fUp.profile} alt={fUp.assigneName} />
                          }

                          title={
                            <Typography variant="subtitle2" component="div" sx={{ textAlign: 'right', fontWeight: 'light', paddingLeft: 10 }}>

                              {fUp.fcontent}

                            </Typography>
                          }
                          subheader={
                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right', fontWeight: 'light', fontSize: 10, paddingLeft: 10 }}>
                              {fUp.fdate}
                            </Typography>
                          }
                        />

                      </Card>

                    </Grid>
                  </Grid> :
                  <Grid container sx={{ marginTop: 0 }}>
                    <Grid item xs={12}>
                      <Card sx={{ borderRadius: 0 }}>
                        <CardHeader sx={{ padding: 2, marginLeft: 2 }}
                          avatar={
                            <Avatar aria-label="recipe" src={fUp.profile} alt={fUp.assigneName} />
                          }
                          title={
                            <Typography variant="subtitle2" component="div" sx={{ textAlign: 'left', fontWeight: '300', paddingRight: 10 }}>
                              {fUp.fcontent}
                            </Typography>
                          }
                          subheader={
                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left', fontWeight: 'light', fontSize: 10 }}>
                              {fUp.fdate}
                            </Typography>
                          }
                        />
                      </Card>
                    </Grid>
                  </Grid>
              ))}
            </Grid>
          </Grid>
        </Box>
        <AvatarView
          showModal={showPro}
          handleCloseModal={handleAvatarClose}
          avatarUrl={customer.profile}
          user={customer.userName ?customer.userName.charAt(0).toUpperCase():<Iconify sx={{height:'100%',width:'100%'}} icon="ooui:user-avatar"/>}
          page={showPro}
        />
      </div>
  );
}

CustomerInfo.propTypes = {
  handleEdit: PropTypes.any,
}
