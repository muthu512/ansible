import { useState, useEffect, forwardRef, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Slide from '@mui/material/Slide';
import Table from '@mui/material/Table';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Grid from '@mui/material/Grid';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
// import SpeakerGroupSharpIcon from '@mui/icons-material/SpeakerGroupSharp';
// import TimelapseRoundedIcon from '@mui/icons-material/TimelapseRounded';

import {
  Select,
  MenuItem,
  TextField,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogActions,
  FormControl,
  DialogContent,
  DialogContentText,
  FormControlLabel,
  Checkbox,
  Input,
  Avatar,
  // InputAdornment,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import useApiService from 'src/services/api_services';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snakbar/SnackbarContext';

import UserTableRow from 'src/sections/user/user-table-row';
import UserTableHead from 'src/sections/user/user-table-head';
import UserTableToolbar from 'src/sections/user/user-table-toolbar';

import TableNoData from '../table-no-data';
import TableEmptyRows from '../table-empty-rows';
import { emptyRows, applyFilter, getComparator } from '../utils';
import GradientProgress from '../../../components/progress/gradientProgress';

// ----------------------------------------------------------------------
const Transition = forwardRef((props, ref) => <Slide direction="left" ref={ref} {...props} />);

export default function CoursesPage() {
  const router = useRouter();

  const { showSnackbar } = useSnackbar();

  const { getCourses, createCourse, getCourseTypeActive } = useApiService();

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [course, setcourse] = useState({
    id: '',
    code: '',
    profile: '',
    name: '',
    description: '',
    active: false,
    fees: 0,
    duration: '',
    coursesTypeCode: '',
    coursesTypeName: '',
  });

  const [courseTypeData, setCourseTypeData] = useState([]);

  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [courseData, setcourseData] = useState([]);
  const [load, setLoad] = useState(true);
  const [progressLoading , setProgressLoading] = useState(true)

  const [errors, setError] = useState({});

  const getcourseDetails = useCallback(async () => {
    const response = await getCourses();
    setcourseData(response);
    setProgressLoading(false)
  }, [getCourses]);

  const getCourseTypeData = useCallback(async () => {
    const response = await getCourseTypeActive();
    const data = response.map((courseType) => (
      <MenuItem value={courseType.code}>{courseType.name}</MenuItem>
    ));
    setLoad(false);
    setCourseTypeData(data);
  }, [getCourseTypeActive]);

  useEffect(() => {
    if (load) {
      getCourseTypeData();
      getcourseDetails();
    }
  }, [load, getCourseTypeData, getcourseDetails]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEdit(false);
    setcourse({
      id: '',
      code: '',
      profile: '',
      name: '',
      description: '',
      active: false,
      fees: 0,
      duration: '',
      coursesTypeCode: '',
      coursesTypeName: '',
    });
    setError('');
  };

  const saveCourses = async () => {
    const response = await createCourse(course);
    if (response.status === 'OK') {
      showSnackbar(response.message, 'success');
      getcourseDetails();
    } else {
      showSnackbar(response.message, 'warning');
    }
  };

  const updateCourses = async () => {
    const response = await createCourse(course);
    if (response.status === 'OK') {
      showSnackbar(response.message, 'success');
      getcourseDetails();
    } else {
      showSnackbar(response.message, 'warning');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setcourse((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (
      name === 'name' ||
      name === 'code' ||
      name === 'duration' ||
      name === 'coursesTypeCode' ||
      name === 'fees' ||
      name === 'description'
    ) {
      if (!value) {
        setError((prevState) => ({
          ...prevState,
          [name]: 'This field is required',
        }));
      } else {
        setError((prevState) => ({
          ...prevState,
          [name]: '',
        }));
      }
    }
  };
  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = courseData.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleEdit = (row) => {
    setEdit(true);
    setcourse({
      id: row.id,
      code: row.code,
      name: row.name,
      profile: row.profile,
      description: row.description,
      active: row.active,
      fees: row.fees,
      duration: row.duration,
      coursesTypeCode: row.coursesTypeCode,
      coursesTypeName: row.coursesTypeName,
    });
    setOpen(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: courseData,
    comparator: getComparator(order, orderBy),
    filterName,
    page: 'courses',
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setcourse((prevState) => ({
          ...prevState,
          profile: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container maxWidth="xxl">
      <Card>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={0}
          paddingLeft={2}
          paddingRight={2}
          paddingTop={2}
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
            <Typography variant="h6">Courses</Typography>
          </Stack>
          <Button
            variant="contained"
            color="inherit"
            onClick={handleClickOpen}
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New
          </Button>
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
                  updateCourses();
                } else {
                  saveCourses();
                }
                handleClose();
              },
            }}
          >
            <DialogTitle sx={{ color: '#f79520' }}>
              {edit ? 'Update course' : 'Create course'}
            </DialogTitle>
            <DialogContent>
              <Stack spacing={2}>
                <DialogContentText>Manage Courses</DialogContentText>

                <Grid item xs={6} md={2}>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="upload-image"
                    type="file"
                    onChange={handleImageChange}
                  />
                  <InputLabel htmlFor="upload-image">
                    <Avatar
                      src={course.profile}
                      alt="Uploaded Profile"
                      sx={{ width: 80, height: 80, cursor: 'pointer', border: '1px solid green' }}
                    />
                  </InputLabel>
                  <FormControl fullWidth>
                    {/* <InputLabel htmlFor="upload-image">Upload Image</InputLabel> */}
                    <Input
                      id="upload-image"
                      type="file"
                      onChange={handleImageChange}
                      inputProps={{ accept: 'image/*' }}
                      style={{ display: 'none' }}
                    />
                  </FormControl>
                </Grid>
                <Grid
                  container
                  spacing={1}
                  sx={{ flexDirection: { xs: 'column', md: 'row', lg: 'row' } }}
                  alignItems={{ xs: 'center', md: 'start', lg: 'start' }}
                  justifyContent={{ xs: 'center', md: 'start', lg: 'start' }}
                >
                  <Grid item xs={12} md={6}>
                    <TextField
                      autoFocus
                      // required
                      margin="dense"
                      id="name"
                      onChange={handleChange}
                      onBlur={handleChange}
                      name="name"
                      value={course.name}
                      label={
                        <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                          <Iconify
                            sx={{ marginRight: '4px' }}
                            icon="hugeicons:course"
                            width="1.2rem"
                            height="1.2rem"
                          />
                          <div> Name *</div>
                        </Grid>
                      }
                      type="text"
                      fullWidth
                      variant="outlined"
                      error={Boolean(errors.name)}
                      helperText={errors.name}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      // required
                      margin="dense"
                      id="code"
                      onChange={handleChange}
                      onBlur={handleChange}
                      name="code"
                      value={course.code}
                      disabled = {edit}
                      label={
                        <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                          <Iconify
                            sx={{ marginRight: '4px' }}
                            icon="gravity-ui:folder-code"
                            width="1.2rem"
                            height="1.2rem"
                          />
                          <div> Code *</div>
                        </Grid>
                      }
                      type="text"
                      fullWidth
                      variant="outlined"
                      error={Boolean(errors.code)}
                      helperText={errors.code}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} mt={1}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                          <Iconify
                            sx={{ marginRight: '4px' }}
                            icon="fluent-mdl2:publish-course"
                            width="1.2rem"
                            height="1.2rem"
                          />
                          <div>Course Type *</div>
                        </Grid>
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={course.coursesTypeCode}
                        label={
                          <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                            <Iconify
                              sx={{ marginRight: '4px' }}
                              icon="fluent-mdl2:publish-course"
                              width="1.2rem"
                              height="1.2rem"
                            />
                            <div>Course Type *</div>
                          </Grid>
                        }
                        name="coursesTypeCode"
                        onChange={handleChange}
                        onBlur={handleChange}
                        error={Boolean(errors.coursesTypeCode)}
                        helperText={errors.coursesTypeCode}
                        required
                      >
                        {courseTypeData}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      margin="dense"
                      id="duration"
                      onChange={handleChange}
                      onBlur={handleChange}
                      name="duration"
                      value={course.duration}
                      label={
                        <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                          <Iconify
                            sx={{ marginRight: '4px' }}
                            icon="game-icons:sands-of-time"
                            width="1.2rem"
                            height="1.2rem"
                          />
                          <div> Duration (Hrs) *</div>
                        </Grid>
                      }
                      type="text"
                      fullWidth
                      variant="outlined"
                      error={Boolean(errors.duration)}
                      helperText={errors.duration}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      // required
                      margin="dense"
                      id="fees"
                      onChange={handleChange}
                      onBlur={handleChange}
                      name="fees"
                      value={course.fees}
                      label={
                        <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                          <Iconify
                            sx={{ marginRight: '4px' }}
                            icon="fluent:feed-32-filled"
                            width="1.2rem"
                            height="1.2rem"
                          />
                          <div> Fees *</div>
                        </Grid>
                      }
                      type="number"
                      fullWidth
                      variant="outlined"
                      error={Boolean(errors.fees)}
                      helperText={errors.fees}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} mt={2}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={course.active}
                          onChange={(event, value) => {
                            setcourse((prevState) => ({
                              ...prevState,
                              active: value,
                            }));
                          }}
                          name="active"
                          id="active"
                        />
                      }
                      label="Status (Active/Inactive)"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      // required
                      margin="dense"
                      id="description"
                      maxRows={5}
                      minRows={3}
                      value={course.description}
                      multiline
                      onChange={handleChange}
                      onBlur={handleChange}
                      name="description"
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
                      type="text"
                      fullWidth
                      variant="outlined"
                      error={Boolean(errors.description)}
                      helperText={errors.description}
                    />
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
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={courseData.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: '', label: 'S.no' },
                  { id: 'name', label: 'Name' },
                  { id: 'courseType', label: 'Course Type' },
                  { id: 'duration', label: 'Duration (Hrs)' },
                  { id: 'fees', label: 'Fees' },
                  { id: 'code', label: 'Code' },
                  { id: 'description', label: 'Description' },
                  { id: 'active', label: 'Status', align: 'center' },
                  { id: '', label: 'Action', align: 'center' },
                ]}
              />
                {progressLoading ? <GradientProgress/> :
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <UserTableRow
                      key={row.courseName}
                      sno={index + 1}
                      name={row.name}
                      code={row.code}
                      status={row.active}
                      duration={row.duration}
                      fees={row.fees}
                      description={row.description}
                      courseType={row.coursesTypeName}
                      selected={selected.indexOf(row.name) !== -1}
                      handleClick={(event) => handleClick(event, row.name)}
                      handleEdit={() => handleEdit(row)}
                      page="courses"
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, courseData.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody> }
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={courseData.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
