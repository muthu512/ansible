import DataTable from 'src/components/datatable/data-table';
import useApiService from 'src/services/api_services';
import { useSnackbar } from 'src/components/snakbar';
import { useSelector } from 'react-redux';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import { Avatar, Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, Grid, InputAdornment, MenuItem, OutlinedInput, Slide, Stack, TextField, Tooltip, Typography, useMediaQuery, Container } from '@mui/material';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { useRouter } from 'src/routes/hooks';
import { format, parse } from 'date-fns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import RefreshIcon from '@mui/icons-material/Refresh';
import cities from '../../../assets/cities.json'
import qulifications from '../../../assets/qualification.json'
import ListView from '../../../components/List-view-component/ListView';


export default function EnquiriesView() {

    const Transition = forwardRef((props, ref) => (
        <Slide direction="left" ref={ref} {...props} />
    ));
    const { showSnackbar } = useSnackbar();
    const isSmallScreen = useMediaQuery('(max-width: 650px)');
    const [searchText, setSearchText] = useState('');

    // Handler to update search text
    const handleSearchTextChange = (event) => {
        setSearchText(event.target.value);
    };
    const quickFilterText = searchText.trim();

    const auth = useSelector((state) => state.auth);

    const router = useRouter();
    const { getStatusActive, getLeadsActive, getCourseActive, getFresherOrExprienceActive, getActiveUsers,
        createCustomer } = useApiService();

    const { getEnquiries } = useApiService();
    const [statusData, setStatusData] = useState([]);
    const [reportingData, setReportingData] = useState([])
    const [assigneData, setAssigeData] = useState([]);
    const [enquiries, setEnquiries] = useState();
    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState(false);
    const [errors, setErrors] = useState({});
    const [leadData, setLeadData] = useState([]);
    const [courseData, setCourseData] = useState([]);
    const [fresherOrExprienceData, setFresherOrExprienceData] = useState([])
    const [load, setLoad] = useState(true);
    const [refreshTable, setRefreshTable] = useState(false);
    const [citiesData, setCitiesData] = useState([]);
    const [qualificationData, setQulificationData] = useState([]);

    const is4KScreen = useMediaQuery('(min-width: 1920px)');

    const [columnDefs] = useState([
        { id: '', field: 'S.no', valueGetter: "node.rowIndex + 1", align: 'center', width: 100, filter: false },
        { id: 'enquiryDate', field: 'enquiryDate', },
        {
            id: 'customerName', field: 'name',

            cellRenderer: (params) => (<Label
                onClick={() => { router.push(`/crm/customer/${params.data.cid}`) }}
                sx={{
                    margin: '11px',
                    "&:hover": {
                        color: 'blue',
                        cursor: "pointer",
                    }
                }}> <Iconify icon="mdi:account-circle" sx={{ marginRight: .5 }} />{params.value}
            </Label>)
        },
        { id: 'mobileNumber', field: 'mobileNumber' },
        {
            id: 'priority', field: 'priority', cellStyle: { textAlign: 'center' },
            cellRenderer: (params) => (<Label color={params.value === "Low" ? 'info' : (params.value === "High") ? 'error' : 'warning'}>{params.value}</Label>)
        },
        {
            id: 'course', field: 'courseName', cellStyle: { textAlign: 'center' },
            cellRenderer: (params) => (<Label color="primary" >{params.value}</Label>)
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
                        '&:hover': {
                            color: 'blue',
                            cursor: 'pointer',
                        },
                    }}
                >
                    <Avatar sx={{ height: '18px', width: '18px', marginRight: '5px', fontSize: '10px' }}>
                        {params.data.assigneeName.charAt(0).toUpperCase()}
                    </Avatar>
                    {params.value}
                </Label>
            ),
        },
        { id: 'location', field: 'location', },

        { id: '', field: 'leadsName', align: 'center', }


    ]);


    const handleRefresh = () => {
        getEnquiriesdata()
        setRefreshTable(!refreshTable); 
    };


    const getUserstatus = useCallback(async () => {
        const response = await getStatusActive();
        const data = response.map((statusRes) => (
            <MenuItem value={statusRes.code}>{statusRes.name}</MenuItem>)
        )
        setStatusData(data);
    }, [getStatusActive]);

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
        // setLoad(false);
    }, [getActiveUsers]);


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
    const getEnquiriesdata = useCallback(async () => {
        const response = await getEnquiries();
        setEnquiries(response);
    }, [getEnquiries]);

    useEffect(() => {
        if (load) {
            getUserstatus();
            loadQulification();
            loadCities();
            getLeads()
            getCourse();
            getFresherOrExprience();
            getUsersActive();
            getEnquiriesdata()
            setLoad(false);
        }
    }, [load, loadQulification, loadCities, getUserstatus, getLeads, getCourse, getFresherOrExprience, getUsersActive, getEnquiriesdata])


    const [customer, setCustomer] = useState({
        "id": 0,
        "name": "",
        "cid": "",
        "mobileNumber": "",
        "gender": "",
        "classType": "",
        "qualification": "",
        "passedOutYear": "",
        "priority": "",
        "fresherOrExprienceCode": "",
        "fresherOrExprienceName": "",
        "leadsCode": "",
        "leadsName": "",
        "courseCode": "",
        "courseName": "",
        "statusCode": "OPEN",
        "statusName": "",
        "assigneeId": auth.user.uid,
        "assigneeName": "",
        "reportingId": auth.user.reportingId,
        "reportingName": "",
        "enquiryDate": format(new Date(), "yyyy-MMM-dd"),
        "location": "",
        "profile": ""
    });


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

    const saveCrmData = async () => {
        if (validate()) {
            const response = await createCustomer(customer);
            if (response.status === "OK") {
                showSnackbar(response.message, 'success');
                router.push(`/crm/customer/${response.customer.cid}`);
            } else {
                showSnackbar(response.message, 'warning');
            }
        }
    }

    const updateCrmData = async () => {
        if (validate()) {
            const response = await createCustomer(customer);
            if (response.status === "OK") {
                showSnackbar(response.message, 'success');
                router.push(`/crm/customer/${response.customer.cid}`);
            } else {
                showSnackbar(response.message, 'warning');
            }
        }

    }

    const handleChange = (e, data) => {
        const { name, value } = e.target || { name: 'location', data };
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

    const handleClose = () => {
        setOpen(false);
        setEdit(false);
        setCustomer({
            "id": 0,
            "name": "",
            "cid": "",
            "gender": "",
            "mobileNumber": "",
            "qualification": "",
            "classType": "",
            "passedOutYear": "",
            "priority": "",
            "fresherOrExprienceCode": "",
            "fresherOrExprienceName": "",
            "leadsCode": "",
            "leadsName": "",
            "courseCode": "",
            "courseName": "",
            "statusCode": "OPEN",
            "statusName": "",
            "assigneeId": auth.user.uid,
            "assigneeName": "",
            "reportingId": auth.user.reportingId,
            "reportingName": "",
            "enquiryDate": format(new Date(), "yyyy-MMM-dd"),
            "location": "",
            "profile": ""
        })
        setErrors('')
    };


    return (
        <Container maxWidth='xxl'>
            <Box>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={0} paddingLeft={2} paddingRight={2} paddingTop={0}>
                    <Dialog
                        open={open}
                        onClose={handleClose}
                        onBackdropClick="false"
                        TransitionComponent={Transition}
                        fullWidth
                        maxWidth="lg"
                        keepMounted
                        PaperProps={{
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
                    >
                        <DialogTitle color='#f79520' >{edit ? 'Update Customer' : 'Create Customer'}</DialogTitle>
                        <DialogContent>
                            <Stack spacing={2}>
                                <Grid container spacing={1} direction='column' justifyContent='center' marginRight={20}>
                                    <Divider variant='li' textAlign="left" sx={{ color: '#f79520' }}>Customer Information</Divider>
                                    <Grid container mt={1} spacing={1} sx={{ flexDirection: { xs: "column", md: "row", lg: "row" } }}>
                                        <Grid item xs={12} md={3}>
                                            <TextField
                                                autoFocus
                                                margin="dense"
                                                id="name"
                                                onChange={handleChange}
                                                name="name"
                                                value={customer.name || ''}
                                                label="Customer Name"
                                                type="text"
                                                error={Boolean(errors.name)}
                                                helperText={errors.name}
                                                fullWidth
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField
                                                margin="dense"
                                                id="mobileNumber"
                                                onChange={handleChange}
                                                name="mobileNumber"
                                                value={customer.mobileNumber}
                                                label="Mobile Number"
                                                type="tel"
                                                error={Boolean(errors.mobileNumber)}
                                                helperText={errors.mobileNumber}
                                                fullWidth
                                                variant="outlined"
                                                inputProps={{ maxLength: 10 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={3} mt={1} sm={12}>
                                            <FormControl fullWidth>
                                                <TextField
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={customer.gender}
                                                    label="Gender"
                                                    name="gender"
                                                    onBlur={handleChange}
                                                    onChange={handleChange}
                                                    error={Boolean(errors.gender)}
                                                    helperText={errors.gender}
                                                    select
                                                    SelectProps={{
                                                        MenuProps: {
                                                            style: {
                                                                maxHeight: 300,
                                                            },
                                                        },
                                                    }}

                                                >
                                                    <MenuItem value='Male'>Male</MenuItem>
                                                    <MenuItem value='Female'>Female</MenuItem>
                                                    <MenuItem value='Others'>Others</MenuItem>
                                                </TextField>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={3} mt={1}>
                                            <FormControl fullWidth>
                                                <Autocomplete
                                                    id="combo-box-demo"
                                                    options={citiesData}
                                                    value={customer.location}
                                                    onChange={(event, value) => {
                                                        setCustomer((prevState) => ({
                                                            ...prevState,
                                                            'location': value
                                                        }));
                                                    }}
                                                    ListboxProps={
                                                        {
                                                            style: {
                                                                maxHeight: '150px',
                                                                border: '2px solid blue',
                                                                borderRadius: '10px'
                                                            }
                                                        }
                                                    }
                                                    renderInput={(params) => <TextField {...params} label="Location" name='location' error={Boolean(errors.location)}
                                                        helperText={errors.location} />}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={12} mt={1} sm={12}>
                                            <Divider variant='li' textAlign='left' sx={{ color: '#f79520' }}>Qualification</Divider>
                                        </Grid>

                                        <Grid item xs={12} md={3} mt={1}>
                                            <FormControl fullWidth>
                                                <Autocomplete
                                                    id="combo-box-demo"
                                                    options={qualificationData}
                                                    value={customer.qualification}
                                                    onChange={(event, value) => {
                                                        setCustomer((prevState) => ({
                                                            ...prevState,
                                                            'qualification': value
                                                        }));
                                                    }}
                                                    ListboxProps={
                                                        {
                                                            style: {
                                                                maxHeight: '150px',
                                                                border: '2px solid blue',
                                                                borderRadius: '10px'
                                                            }
                                                        }
                                                    }
                                                    renderInput={(params) => <TextField {...params} label="qulification" error={Boolean(errors.qualification)}
                                                        helperText={errors.qualification} />}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={3} mt={1}>
                                            <FormControl fullWidth >
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
                                                    value={customer.passedOutYear}
                                                    error={Boolean(errors.passedOutYear)}
                                                    helperText={errors.passedOutYear}
                                                    label="Passed Out Year"
                                                    name="passedOutYear"
                                                    onChange={handleChange}
                                                    type="number"
                                                // required
                                                >
                                                    <MenuItem value='2010'>2010</MenuItem>
                                                    <MenuItem value='2011'>2011</MenuItem>
                                                    <MenuItem value='2012'>2012</MenuItem>
                                                    <MenuItem value='2013'>2013</MenuItem>
                                                    <MenuItem value='2014'>2014</MenuItem>
                                                    <MenuItem value='2015'>2015</MenuItem>
                                                    <MenuItem value='2016'>2016</MenuItem>
                                                    <MenuItem value='2017'>2017</MenuItem>
                                                    <MenuItem value='2018'>2018</MenuItem>
                                                    <MenuItem value='2019'>2019</MenuItem>
                                                    <MenuItem value='2020'>2020</MenuItem>
                                                    <MenuItem value='2021'>2021</MenuItem>
                                                    <MenuItem value='2022'>2022</MenuItem>
                                                    <MenuItem value='2023'>2023</MenuItem>
                                                    <MenuItem value='2024'>2024</MenuItem>
                                                    <MenuItem value='2025'>2025</MenuItem>
                                                    <MenuItem value='2026'>2026</MenuItem>
                                                    <MenuItem value='2027'>2027</MenuItem>
                                                    <MenuItem value='2028'>2028</MenuItem>
                                                </TextField>
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12} md={3} mt={1}>
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
                                                    value={customer.fresherOrExprienceCode}
                                                    error={Boolean(errors.fresherOrExprienceCode)}
                                                    helperText={errors.fresherOrExprienceCode}
                                                    label="Fresher / Exprience"
                                                    name="fresherOrExprienceCode"
                                                    onChange={handleChange}
                                                // required
                                                >
                                                    {fresherOrExprienceData}
                                                </TextField>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={12}><Divider variant='li' textAlign='left' sx={{ color: '#f79520' }}>Course Details</Divider></Grid>

                                        <Grid item md={3} mt={1}>
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <DatePicker
                                                    label="Enquiry Date"
                                                    value={parse(customer.enquiryDate, "yyyy-MMM-dd", new Date())}
                                                    onChange={(newValue) => {
                                                        setCustomer((prevState) => ({
                                                            ...prevState,
                                                            'enquiryDate': format(newValue, "yyyy-MMM-dd")
                                                        }));
                                                    }}
                                                    format="yyyy-MMM-dd"
                                                    renderInput={(params) => <TextField {...params} error={Boolean(errors.enquiryDate)} helperText={errors.enquiryDate} />}
                                                />
                                            </LocalizationProvider>
                                        </Grid>
                                        <Grid item md={3} mt={1}>
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
                                                    value={customer.leadsCode}
                                                    error={Boolean(errors.leadsCode)}
                                                    helperText={errors.leadsCode}
                                                    label="Lead Source"
                                                    name="leadsCode"
                                                    onChange={handleChange}
                                                >
                                                    {leadData}
                                                </TextField>
                                            </FormControl>
                                        </Grid>

                                        <Grid item md={3} mt={1}>
                                            <FormControl fullWidth>
                                                <TextField
                                                    select
                                                    SelectProps={{
                                                        MenuProps: {
                                                            style: {
                                                                maxHeight: 280,
                                                            },
                                                        },
                                                    }}
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={customer.courseCode}
                                                    error={Boolean(errors.courseCode)}
                                                    helperText={errors.courseCode}
                                                    label="Cource"
                                                    name="courseCode"
                                                    onChange={handleChange}
                                                >
                                                    {courseData}
                                                </TextField>
                                            </FormControl>
                                        </Grid>

                                        <Grid item md={3} mt={1}>
                                            <FormControl fullWidth>
                                                <TextField
                                                    select
                                                    SelectProps={{
                                                        MenuProps: {
                                                            style: {
                                                                maxHeight: 280,
                                                            },
                                                        },
                                                    }}
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={customer.classType}
                                                    error={Boolean(errors.classType)}
                                                    helperText={errors.classType}
                                                    label="Class Type"
                                                    name="classType"
                                                    onChange={handleChange}
                                                >
                                                    <MenuItem value='Online'>Online</MenuItem>
                                                    <MenuItem value='Offline'>Offline</MenuItem>
                                                    <MenuItem value='Offline-Weekend'>Offline-Weekend</MenuItem>
                                                </TextField>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={12}><Divider variant='li' textAlign='left' sx={{ color: '#f79520' }}>Office Use</Divider></Grid>
                                        <Grid item md={3} mt={1}>
                                            <FormControl fullWidth>
                                                <TextField
                                                    select
                                                    SelectProps={{

                                                        MenuProps: {
                                                            style: {
                                                                maxHeight: 280,

                                                            },
                                                        },
                                                    }}
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={customer.priority}
                                                    error={Boolean(errors.priority)}
                                                    helperText={errors.priority}
                                                    label="Priority"
                                                    name="priority"
                                                    onChange={handleChange}
                                                >
                                                    <MenuItem value='High'>High</MenuItem>
                                                    <MenuItem value='Medium'>Medium</MenuItem>
                                                    <MenuItem value='Low'>Low</MenuItem>
                                                </TextField>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} mt={1}>
                                            <FormControl fullWidth>
                                                <TextField
                                                    select
                                                    SelectProps={{
                                                        MenuProps: {
                                                            style: {
                                                                maxHeight: 280,
                                                            },
                                                        },
                                                    }}
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={customer.assigneeId}
                                                    error={Boolean(errors.assigneeId)}
                                                    helperText={errors.assigneeId}
                                                    label="Assigned"
                                                    name="assigneeId"
                                                    onChange={handleChange}
                                                >
                                                    {assigneData}
                                                </TextField>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} mt={1}>
                                            <FormControl fullWidth>
                                                <TextField
                                                    select
                                                    SelectProps={{
                                                        MenuProps: {
                                                            style: {
                                                                maxHeight: 280,
                                                            },
                                                        },
                                                    }}
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={customer.reportingId}
                                                    error={Boolean(errors.reportingId)}
                                                    helperText={errors.reportingId}
                                                    label="Reporting"
                                                    name="reportingId"
                                                    onChange={handleChange}
                                                >
                                                    {reportingData}
                                                </TextField>
                                            </FormControl>
                                        </Grid>

                                        <Grid item md={3} mt={1}>
                                            <FormControl
                                                fullWidth>
                                                <TextField
                                                    select
                                                    SelectProps={{
                                                        MenuProps: {
                                                            style: {
                                                                maxHeight: 280,
                                                            },
                                                        },
                                                    }}
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={customer.statusCode}
                                                    error={Boolean(errors.statusCode)}
                                                    helperText={errors.statusCode}
                                                    label="Status"
                                                    name="statusCode"
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    {statusData}
                                                </TextField>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Stack>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="secondary">Cancel</Button>
                            <Button type="submit" color='primary'> Update </Button>
                        </DialogActions>
                    </Dialog>
                </Stack>

                <div style={{ padding: '10px', display: 'flex', gap: 20, justifyContent: 'space-between', flexWrap: 'wrap', alignItems: "center", justifyItems: "center" }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between"
                        onClick={() => { router.back() }}
                        sx={{
                            color: "#f79520",
                            "&:hover": {
                                color: 'blue',
                                cursor: "pointer",
                            }
                        }}>
                        <KeyboardArrowLeftIcon />
                        <Tooltip title='back'>
                            <Typography variant="h6">Enquiries</Typography>
                        </Tooltip>
                    </Stack>

                    {isSmallScreen ? null :
                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'warp' }}>
                            <div>
                                <Stack spacing={2} direction="row" sx={{ marginRight: '15px' }}>
                                    <Button variant="text" onClick={handleRefresh}>
                                        <RefreshIcon />
                                    </Button>
                                </Stack>
                            </div>
                            <OutlinedInput
                                value={searchText}
                                onChange={handleSearchTextChange}
                                placeholder="Search...."
                                sx={{ height: 36 }}
                                startAdornment={

                                    <InputAdornment position="start" >
                                        <Iconify
                                            icon="eva:search-fill"
                                            sx={{ color: 'text.disabled', width: 20, height: 20 }}
                                        />
                                    </InputAdornment>
                                }
                            />

                        </div>}
                </div>

                {isSmallScreen ? (
                    <ListView
                        data={enquiries}
                        onRowClick={cid => router.push(`/crm/customer/${cid}`)}
                        page="enquiries"
                    />
                ) :
                    (<Box
                        className='ag-theme-quartz'
                        sx={{
                            height: is4KScreen ? '92vh' : 470,

                        }}
                    >
                        <DataTable
                            quickFilterText={quickFilterText}
                            rowData={enquiries}
                            columnDefs={columnDefs}
                            refreshTable={refreshTable}
                            onGridReady={params => {
                                params.api.sizeColumnsToFit();
                            }}

                        />

                    </Box>)}
            </Box>
        </Container>
    )
}
