import React, { useCallback, useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Button,
  Tooltip,
  Stack,
  Typography,
  TextField,
  FormControl,
  Box,
  MenuItem,
  Grid,
  useMediaQuery,
  Card,
  Paper,
} from '@mui/material';
import { useRouter } from 'src/routes/hooks';
import useApiService from 'src/services/api_services';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'src/components/snakbar';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parse } from 'date-fns';
import Iconify from 'src/components/iconify';
import GradientProgress from 'src/components/progress/gradientProgress';

const StudentAttendanceTable = () => {
  const smscreen = useMediaQuery('(min-width: 600px)');
  const { showSnackbar } = useSnackbar();
  const router = useRouter();
  const { id, attDate } = useParams();
  const [oldParam, setOldParam] = useState();
  const [load, setLoad] = useState(true);
  const [topics, setTopics] = useState([]);
  const { getStudentInfo, createStudentAttendance, getBatchAttendanceReportByDate, getBatchSyllabusTopic } = useApiService();
  const [selectAll, setSelectAll] = useState(false);
  const [attendanceInfo, setAttendanceInfo] = useState({
    "id": 0,
    "attDate": attDate ?? format(new Date(), 'yyyy-MMM-dd'),
    "topic": "",
    "topicId": "",
    "description": "",
    "totalPresent": 0,
    "totalAbsent": 0,
    "status": "",
    "batchId": id,
    "batchName": "",
    "studentAttendanceDtos": []
  });

  const getBatchStudent = useCallback(async (batchId) => {
    const response = await getStudentInfo(batchId);
    setAttendanceInfo((prevState) => ({
      ...prevState,
      "studentAttendanceDtos": response.map((stu) => ({
        "id": 0,
        "studentAttendanceInfoId": 0,
        "studentOnboardId": stu.id,
        "studentName": stu.studentName,
        "mobileNumber": stu.mobileNumber,
        "billNo": stu.billNo,
        "attendance": false
      }),
      ),
      "topic": "",
      "topicId": "",
      "id": 0,
      "status": "",
      "description": "",
    }));
  }, [getStudentInfo]);

  const getByDate = useCallback(async (batchId, date) => {
    const response = await getBatchAttendanceReportByDate(batchId, date);
    if (Object.prototype.hasOwnProperty.call(response, 'status')) {
      if (response.status === "NOT_FOUND") {
        getBatchStudent(batchId);
      } else {
        setAttendanceInfo(response);
      }
    } else {
      setAttendanceInfo(response);
    }
  }, [getBatchAttendanceReportByDate, getBatchStudent]);


  const getSyllabusTopic = useCallback(async (batchId) => {
    const response = await getBatchSyllabusTopic(batchId);
    const data = response.map((topic) => <MenuItem value={topic.id}>{topic.title}</MenuItem>);
    setTopics(data);
  }, [getBatchSyllabusTopic]);


  useEffect(() => {
    if (oldParam !== attDate) {
      setLoad(true);
    }
    if (load) {
      getSyllabusTopic(id);
      setOldParam(attDate);
      getByDate(id, attDate);
      setLoad(false);
    }
  }, [getByDate, getSyllabusTopic, id, load, attendanceInfo, oldParam, attDate])

  const handleAttendanceChange = (stuId) => {
    const updatedStudents = attendanceInfo.studentAttendanceDtos.map((student) =>
      student.studentOnboardId === stuId ? { ...student, attendance: !student.attendance } : student
    );
    setAttendanceInfo((prevState) => ({
      ...prevState,
      "studentAttendanceDtos": updatedStudents,
    }));
  };

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    const updatedStudents = attendanceInfo.studentAttendanceDtos.map((student) => ({
      ...student,
      attendance: !selectAll
    }));
    setAttendanceInfo((prevState) => ({
      ...prevState,
      studentAttendanceDtos: updatedStudents
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAttendanceInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  const saveAttendance = async (e) => {
    e.preventDefault();
    const response = await createStudentAttendance(attendanceInfo);
    router.replace(`/student/batches/${id}`);
    if (response.status === 'OK') {
      showSnackbar(response.message, 'success');
    } else {
      showSnackbar(response.message, 'warning');
    }
  }

  return (

    load ? <GradientProgress /> : <TableContainer
      component='form'
      sx={{ minHeight: { xl: '100%' } }}
    >
      <div style={{
        height: '50px', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: '0.1px',
        marginLeft: '10px', marginRight: '10px',
        background: 'white', zIndex: 10,borderRadius:'10px'
      }}>
        <Stack direction="row" alignItems="center"
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
            <Typography variant="h6">Student daily attendance</Typography>
          </Tooltip>
        </Stack>

        {smscreen ? <div style={{ marginRight: '30px' }}><Button type='submit' variant="contained" color="inherit" onClick={saveAttendance}> Submit </Button></div> : null}
      </div>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, width: { xl: '100%', md: '100%' }, maxHeight: { xl: '100vh',xxl:'100vh', lg: '100vh', md: '80vh', sm: 'unset', xs: 'unset' }, padding: '10px', gap: '20px' }}>
        <Card item sx={{ flex: 1, maxHeight: { xl: '100vh',xxl:'100vh', md: '72vh' }, minWidth: { lg: '30%', md: '30%' }, }}>
          <h3 style={{ margin: '0px', padding: '8px' }}>Student attendance record</h3>
          <Card
            component="form"
            sx={{
              '& > :not(style)': { m: 1 },
              padding: '10px',
              height:{xl:'100%'},
            }}
            noValidate
            autoComplete="off"
          >
            <FormControl variant='standard' sx={{ width: '100%', paddingRight: '20px' }}>
              <Grid container spacing={{md:1,xl:2,xxl:3,}}>
                <Grid item xs={12} sm={6} md={12} >
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Attendance Date"
                      disableFuture='true'
                      value={parse(attendanceInfo.attDate, 'yyyy-MMM-dd', new Date())}
                      onChange={(newValue) => {
                        setAttendanceInfo((prevState) => ({
                          ...prevState,
                          "attDate": format(newValue, 'yyyy-MMM-dd')
                        }));
                        router.replace(`/student/batches/${id}/${format(newValue, 'yyyy-MMM-dd')}`)
                      }}
                      format="yyyy-MMM-dd"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                        />
                      )}
                      sx={{ width: '100%' }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6} md={12}>
                  <FormControl fullWidth>
                    <TextField
                      variant="outlined"
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
                      value={attendanceInfo.topicId}
                      label={
                        <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                          <Iconify
                            sx={{ marginRight: '4px' }}
                            icon="hugeicons:profile"
                            width="1.2rem"
                            height="1.2rem"
                          />
                          <div>Topic *</div>
                        </Grid>
                      }
                      name="topicId"
                      onChange={handleInputChange}
                    >
                      {topics}
                    </TextField>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={12}>
                  <FormControl fullWidth>
                    <TextField
                      variant="outlined"
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
                      value={attendanceInfo.status}
                      label={
                        <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                          <Iconify
                            sx={{ marginRight: '4px' }}
                            icon="majesticons:chat-status-line"
                            width="1.2rem"
                            height="1.2rem"
                          />
                          <div>Status *</div>
                        </Grid>
                      }
                      name="status"
                      onChange={handleInputChange}
                    >
                      <MenuItem value='Inprogress'>InProgress</MenuItem>
                      <MenuItem value='Completed'>Completed</MenuItem>
                    </TextField>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid item xs={12} md={12} mt={3}>
                <Box >
                  <TextField
                    id="message"
                    label={
                      <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                        <Iconify
                          sx={{ marginRight: '4px' }}
                          icon="mdi:file-chart"
                          width="1.2rem"
                          height="1.2rem"
                        />
                        <div>Today Topic Description... *</div>
                      </Grid>
                    }
                    multiline
                    name="description"
                    value={attendanceInfo.description}
                    onChange={handleInputChange}
                    rows={4}
                    fullWidth
                    variant="outlined"
                    sx={{ marginTop: '10px' }}
                  />
                </Box>
              </Grid>

            </FormControl>
          </Card>
        </Card>
        <div style={{
          overflow: 'scroll', background: 'transparent', width: '100%', maxHeight: '77vh', borderRadius: '10px', scrollbarWidth: 'none', // For Firefox
          '-ms-overflow-style': 'none',
        }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650, }} size="small" aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ backgroundColor: 'black', color: 'white' }}>S.no</TableCell>
                  {smscreen ? <TableCell sx={{ backgroundColor: 'black', color: 'white' }}>Bill.number</TableCell> : null}
                  {/* {smscreen ? <TableCell sx={{ py: 1, background: 'rgb(255, 171, 0)', color: 'white' }}>mobileNumber</TableCell> : null} */}
                  <TableCell sx={{ backgroundColor: 'black', color: 'white' }}>Student Name</TableCell>
                  <TableCell sx={{ backgroundColor: 'black', color: 'white', textAlign: 'center' }}>
                    Present
                    <Checkbox
                      sx={{
                        p: 0,
                        color: "white",
                        '&.Mui-checked': {
                          color: "white",
                        },
                        marginX: '5px'
                      }}
                      checked={selectAll}
                      onChange={handleSelectAllChange}
                    />
                  </TableCell>

                </TableRow>
              </TableHead>
              <TableBody sx={{ '& .MuiTableCell-root': { py: '0' }, height: 1 }} >
                {attendanceInfo.studentAttendanceDtos.map((student, index) => (
                  <TableRow key={student.studentOnboardId}
                  sx={{ backgroundColor: index % 2 === 0 ? 'transparent' : '#EEEEEE' }}>
                    <TableCell sx={{ width: '50px' }}>{index + 1}</TableCell>
                    {smscreen ? <TableCell>{student.billNo}</TableCell> : null}
                    {/* {smscreen ? <TableCell sx={{ width: '150px' }}>{student.mobileNumber}</TableCell> : null} */}
                    <TableCell>{student.studentName}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Checkbox
                        sx={{
                          p: 0,
                          color: "lightgray",
                          '&.Mui-checked': {
                            color: "#00e676",
                          },
                        }}
                        checked={student.attendance}
                        onChange={() => handleAttendanceChange(student.studentOnboardId)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        {smscreen ? null : <div style={{ textAlign: 'center' }}><Button type='submit' variant="contained" color="inherit" sx={{ width: '100%' }} onClick={saveAttendance}> Submit </Button></div>}
      </Box>
    </TableContainer>
  );
};

export default StudentAttendanceTable;
