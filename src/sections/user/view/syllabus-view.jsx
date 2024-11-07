import { useState, forwardRef, useCallback, useEffect, useMemo } from 'react';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  Select,
  TextField,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogActions,
  FormControl,
  DialogContent,
  DialogContentText,
  MenuItem,
  Tooltip,
  IconButton,
  useMediaQuery,
  OutlinedInput,
  InputAdornment
} from '@mui/material';
import { useRouter } from 'src/routes/hooks';
import DataTable from 'src/components/datatable/data-table';
import useApiService from 'src/services/api_services';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snakbar/SnackbarContext';
import { Box } from '@mui/system';
import Label from 'src/components/label';
import ListView from '../../../components/List-view-component/ListView';
import GradientProgress from '../../../components/progress/gradientProgress';

// ----------------------------------------------------------------------
const Transition = forwardRef((props, ref) => <Slide direction="left" ref={ref} {...props} />);

export default function SyllabusView() {
  const router = useRouter();

  const { showSnackbar } = useSnackbar();

  const { getAllSyllabus, createSyllabus, getCourseActive, deleteManageSyllabus } = useApiService();

  const [syllabusData, setSyllabusData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [progressLoading, setProgressLoading] = useState(true);
  const [validationMessage, setValidationMessage] = useState('');
  const [syllabus, setSyllabus] = useState({
    "id": 0,
    "title": "",
    "description": "",
    "courseCode": "",
    "status": 'New',
    "listSyllabusTopic": []
  })


  // const [courseTypeData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const quickFilterText = searchText.trim();
  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };
  const smallscreen = useMediaQuery('(min-width: 450px)');
  const isSmallScreen = useMediaQuery('(max-width: 650px)');
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [load, setLoad] = useState(true);
  const [, setError] = useState({});
  const [refreshTable, setRefreshTable] = useState(false);
  const [syllabusDelete, setSyllabusDelete] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [columnDefs] = useState([
    {
      id: '',
      field: 'S.no',
      valueGetter: 'node.rowIndex + 1',
      align: 'center',
      flex: 1,
      maxWidth: 80,
      filter: false,

    },
    {
      id: '',
      field: 'title',
      align: 'center',
      flex: 1,
      cellRenderer: (params) => <Label color="secondary" sx={{ cursor: 'pointer' }} onClick={() => { router.push(`${params.data.id}`) }}>{params.value}</Label>
    },
    {
      id: '',
      field: 'courseName',
      align: 'center',
      headerName: 'Course',
      flex: 1,
      cellStyle: { textAlign: 'center' },
      cellRenderer: (params) => <Label color="primary" sx={{ cursor: 'pointer' }}>{params.value}</Label>
    },
    {
      id: '',
      field: 'description',
      align: 'center',
      flex: 1,
    },
    {
      id: '',
      field: 'status',
      align: 'center',
      flex: 1,
      cellStyle: { textAlign: 'center' },
      cellRenderer: (params) => <Label color="secondary">{params.value}</Label>
    },
    {
      id: '',
      field: 'Actions',
      align: 'center',
      flex: 1,
      cellStyle: { textAlign: 'center' },
      cellRenderer: (params) => (
        <Grid container spacing={2} justifyContent='center'>
          <Grid item>
            <Tooltip title="Topics">
              <IconButton
                color="secondary"
                sx={{ backgroundColor: 'whitesmoke' }}
                onClick={() => {
                  router.push(`${params.data.id}`)
                }}
              >
                <Iconify icon="material-symbols-light:view-list-outline" />
              </IconButton>
            </Tooltip>
          </Grid>

          <Grid item>
            <Tooltip title="Edit">
              <IconButton
                color="primary"
                sx={{ backgroundColor: 'whitesmoke' }}
                onClick={() => {
                  handleEdit(params.data)
                }}
              >
                <Iconify icon="ic:outline-edit-note" />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item>
          <Tooltip title="Delete" placement="right">
            <IconButton
            color="primary"
            sx={{ backgroundColor: 'whitesmoke' }} 
            onClick={() => handleDeleteClick(params.data.id)}
            >
              <Iconify
                icon="material-symbols:delete-outline-rounded"
                sx={{ color: 'red', cursor: 'pointer' }}
              />
            </IconButton>
          </Tooltip>
          </Grid>
        </Grid>
      ),
    },
  ]);

  const getAllSyllabusDetails = useCallback(async () => {
    const response = await getAllSyllabus();
    setSyllabusData(response);
    setProgressLoading(false)
  }, [getAllSyllabus]);

  const getCourse = useCallback(async () => {
    const response = await getCourseActive();
    const data = response.map((course) => <MenuItem value={course.code}>{course.name}</MenuItem>);
    setCourseData(data);
  }, [getCourseActive]);

  useEffect(() => {
    if (load) {
      getAllSyllabusDetails();
      getCourse();
      setLoad(false);
    }
  }, [load, getAllSyllabusDetails, getCourse]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEdit(false);
    setSyllabus({
      "id": 0,
      "title": "",
      "description": "",
      "courseCode": "",
      "status": 'New',
      "listSyllabusTopic": []
    })
    setError('');
  };
  const handleEdit = (data) => {
    setEdit(true);
    setSyllabus({
      id: data.id,
      title: data.title,
      description: data.description,
      courseCode: data.courseCode,
      status: data.status,
      listSyllabusTopic: data.listSyllabusTopic || []
    });
    handleClickOpen();
  };


  const saveSyllabusData = async () => {
    if (syllabus.listSyllabusTopic.length === 0) {
      setValidationMessage("Please add at least one topic.");
      return;
    }
    setValidationMessage('');
    const response = await createSyllabus(syllabus);
    if (response.status === 'OK') {
      showSnackbar(response.message, 'success');
      getAllSyllabusDetails();
      handleClose();
    } 
  };

  const updateSyllabusData = async () => {
    const response = await createSyllabus(syllabus);
    handleClose();
    if (response.status === 'OK') {
      showSnackbar(response.message, 'success');
      getAllSyllabusDetails();
    } else {
      showSnackbar(response.message, 'warning');
    }
  };

  const handleSyllabusDelete = async () => {
    if (syllabusDelete !== null) {
        try {
            const response = await deleteManageSyllabus(syllabusDelete); 
            if (response.status === 'OK') {
                showSnackbar(response.message, 'success');
                getAllSyllabusDetails(); 
            } else {
                showSnackbar(response.message, 'warning');
            }
        } catch (error) {
            showSnackbar('Failed to delete item', 'error');
        } finally {
            setSyllabusDelete(null); 
            setOpenDeleteDialog(false); 
        }
    }
};


  const handleDeleteClick = (syllabusNo) => {
    setSyllabusDelete(syllabusNo);
    setOpenDeleteDialog(true); 
  };

  const handleRefresh = () => {
    getAllSyllabusDetails();
    setRefreshTable(!refreshTable);
  };

  const handleButtonClick = () => {
    setSyllabus(prevSyllabus => ({
      ...prevSyllabus,
      listSyllabusTopic: [
        ...prevSyllabus.listSyllabusTopic,
        {
          id: 0, // New ID for the topic
          title: "", // Initialize empty fields or default values
          estimation: "",
          description: "",
          courseCode: "",
          status: "",
          topicNumber: prevSyllabus.listSyllabusTopic.length + 1 // Or any other logic for topicNumber
        }
      ]
    }));
  };

  // Handler for input changes
  const handleChange = (event, index) => {
    const { name, value } = event.target;
    setSyllabus(prevSyllabus => ({
      ...prevSyllabus,
      listSyllabusTopic: prevSyllabus.listSyllabusTopic.map((topic, i) =>
        i === index ? { ...topic, [name]: value } : topic
      )
    }));
  };

  const handleSyllabusChange = (event) => {
    const { name, value } = event.target;
    setSyllabus(prevSyllabus => ({
      ...prevSyllabus,
      [name]: value
    }))
  }

  // Handler to remove a set of fields
  const handleRemove = (index) => {
    setSyllabus(prevSyllabus => ({
      ...prevSyllabus,
      listSyllabusTopic: prevSyllabus.listSyllabusTopic.filter((_, i) => i !== index)
    }));
  };

  const defaultColDef = useMemo(
    () => ({
      filter: 'agTextColumnFilter',
    }),
    []
  );

  return (
    <Container maxWidth="xxl">
      <Card sx={{ padding: '0 10px 10px 10px' }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={0}
          padding={2}
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
            <Typography variant="h6">Syllabus</Typography>
          </Stack>

          <div style={{ display: 'flex', gap: 10 }}>

            <Stack spacing={2} direction="row">
              <Button variant="text" onClick={handleRefresh}>
                <RefreshIcon />
              </Button>
            </Stack>

            <OutlinedInput
              value={searchText}
              onChange={handleSearchTextChange}
              placeholder="Search...."
              sx={{ height: 36, display: smallscreen ? '' : 'none' }}
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

              {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Are you sure you want to delete this item?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button
            onClick={() => {
              handleSyllabusDelete();
            }}
            autoFocus
            color="primary"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

          <Dialog
            onBackdropClick="false"
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
            keepMounted
            fullWidth
            maxWidth={edit ? 'xs' : 'xl'}
            PaperProps={{
              component: 'form',
              onSubmit: (event) => {
                event.preventDefault();
                saveSyllabusData();
                if (edit) {
                  updateSyllabusData();
                } else {
                  saveSyllabusData();
                }
              },
            }}
          >
            <DialogTitle sx={{ color: '#f79520', padding: '10px 15px' }}>
              {edit ? 'Update Syllabus' : 'Create Syllabus'}
            </DialogTitle>
            <DialogContent sx={{ padding: "8px" }}>
              <Stack spacing={2} >
                <DialogContentText sx={{ padding: '0px 8px' }}>Manage Syllabus</DialogContentText>
                <Box item sx={{ display: 'flex', justifyContent: 'space-around', flexDirection: { xs: 'column', md: 'row', lg: 'row' }, gap: '20px' }}>
                  <Box item sx={{ alignSelf: 'end', display: 'flex', gap: '20px', flexDirection: edit ? { xs: 'column', md: 'column', lg: 'column' } : { xs: 'column', md: 'row', lg: 'row' }, width: '100%' }}>
                    <Box item >
                      <TextField
                        size='small'
                        select
                        sx={{ width: edit ? { md: '100%', xs: '100%' } : { md: '250px', xs: '100%' } }}

                        SelectProps={{
                          MenuProps: {
                            style: {
                              maxHeight: 280,
                            },
                          },
                        }}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label={
                          <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                            <Iconify
                              sx={{ marginRight: '4px' }}
                              icon="fluent-mdl2:publish-course"
                              width="1.2rem"
                              height="1.2rem"
                            />
                            <div>Courses *</div>
                          </Grid>
                        }
                        name="courseCode"
                        value={syllabus.courseCode}
                        onChange={handleSyllabusChange}
                      >
                        {courseData}
                      </TextField>
                    </Box>
                    <Box item >
                      <TextField md={4}
                        id="standard-basic"
                        label={<Grid item style={{ display: 'flex', alignItems: 'center' }}>
                          <Iconify
                            sx={{ marginRight: '4px' }}
                            icon="ph:book-light"
                            width="1.2rem"
                            height="1.2rem"
                          />
                          <div>Syllabus Title *</div>
                        </Grid>}
                        variant="outlined"
                        name='title'
                        sx={{ width: { xs: '100%' } }}
                        value={syllabus.title}
                        size="small"
                        onChange={handleSyllabusChange} />
                    </Box>

                    <Box item sx={{ width: edit ? { md: '100%', xs: '100%' } : { md: '200px', xs: '100%' } }}>

                      <FormControl fullWidth size="small">
                        <InputLabel>
                          <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                            <Iconify
                              sx={{ marginRight: '4px' }}
                              icon="lets-icons:status-list"
                              width="1.2rem"
                              height="1.2rem"
                            />
                            <div>Status *</div>
                          </Grid>
                        </InputLabel>
                        <Select
                          name='status'
                          value={syllabus.status}
                          onChange={handleSyllabusChange}
                          label={
                            <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                              <Iconify
                                sx={{ marginRight: '4px' }}
                                icon="majesticons:library-line"
                                width="1.2rem"
                                height="1.2rem"
                              />
                              <div>Status *</div>
                            </Grid>}>
                          <MenuItem value="New">New</MenuItem>
                          <MenuItem value="Active">Active</MenuItem>
                          <MenuItem value="Inactive">Close</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>

                    <Box item sx={{ width: edit ? { md: '100%', xs: '100%' } : { md: '40%', xs: '100%' } }}>

                      <TextField
                        id="standard-basic"
                        label={
                          <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                            <Iconify
                              sx={{ marginRight: '4px' }}
                              icon="ic:twotone-description"
                              width="1.2rem"
                              height="1.2rem"
                            />
                            <div> Description *</div>
                          </Grid>
                        }
                        name='description'
                        fullWidth
                        value={syllabus.description}
                        onChange={handleSyllabusChange}
                        variant="outlined"
                        size="small"
                      />
                    </Box>

                  </Box>
                  {!edit && (
                    <Box item sx={{ alignSelf: 'end', justifyContent: 'end', display: 'flex', gap: '20px', width: { md: '10%', xs: '100%' } }}>
                      <Box item >
                        <Button variant="contained" color='inherit' onClick={handleButtonClick}>Add Topic</Button>
                      </Box>
                    </Box>
                  )}
                </Box>

                <Grid
                  container
                  spacing={1}
                  sx={{ flexDirection: { xs: 'column', md: 'row', lg: 'row' } }}
                >
                  {syllabus.listSyllabusTopic.map((fieldSet, index) => (
                    <Grid container spacing={1} key={fieldSet.id}>
                      <Grid item md={1.5}>
                        <TextField
                          margin="dense"
                          name='topicNumber'
                          label={
                            <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                              <Iconify
                                sx={{ marginRight: '4px' }}
                                icon="solar:pin-line-duotone"
                                width="1.2rem"
                                height="1.2rem"
                              />
                              <div> Topic No *</div>
                            </Grid>
                          }
                          type="text"
                          fullWidth
                          variant="outlined"
                          value={fieldSet.topicNumber}
                          size="small"
                          onChange={(event) => handleChange(event, index)}
                        />
                      </Grid>
                      <Grid item xs={12} md={2.5}>
                        <TextField
                          margin="dense"
                          name='title'
                          label={
                            <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                              <Iconify
                                sx={{ marginRight: '4px' }}
                                icon="solar:bill-line-duotone"
                                width="1.2rem"
                                height="1.2rem"
                              />
                              <div> Topic Name *</div>
                            </Grid>
                          }
                          type="text"
                          fullWidth
                          variant="outlined"
                          value={fieldSet.title}
                          size="small"
                          onChange={(event) => handleChange(event, index)}
                        />
                      </Grid>
                      <Grid item xs={12} md={2.5}>
                        <TextField
                          margin="dense"
                          name='description'
                          label={
                            <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                              <Iconify
                                sx={{ marginRight: '4px' }}
                                icon="solar:card-2-line-duotone"
                                width="1.2rem"
                                height="1.2rem"
                              />
                              <div> Topic Description *</div>
                            </Grid>
                          }
                          type="text"
                          fullWidth
                          variant="outlined"
                          size="small"
                          value={fieldSet.description}
                          onChange={(event) => handleChange(event, index)}
                        />
                      </Grid>
                      <Grid item md={1.5}>
                        <TextField
                          margin="dense"
                          name='estimation'
                          label={
                            <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                              <Iconify
                                sx={{ marginRight: '4px' }}
                                icon="hugeicons:time-02"
                                width="1.2rem"
                                height="1.2rem"
                              />
                              <div> Estimation *</div>
                            </Grid>
                          }
                          type="text"
                          fullWidth
                          variant="outlined"
                          size="small"
                          value={fieldSet.estimation}
                          onChange={(event) => handleChange(event, index)}
                        />
                      </Grid>
                      <Grid item xs={12} md={2.5} mt={1}>
                        <FormControl fullWidth size="small">
                          <InputLabel id={index}>
                            <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                              <Iconify
                                sx={{ marginRight: '4px' }}
                                icon="majesticons:chat-status"
                                width="1.2rem"
                                height="1.2rem"
                              />
                              <div> Status *</div>
                            </Grid>
                          </InputLabel>
                          <Select
                            labelId={index}
                            label={
                              <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                                <Iconify
                                  sx={{ marginRight: '4px' }}
                                  icon="majesticons:chat-status"
                                  width="1.2rem"
                                  height="1.2rem"
                                />
                                <div> Status *</div>
                              </Grid>
                            }
                            name='status'
                            value={fieldSet.status}
                            onChange={(event) => handleChange(event, index)}
                          >
                            <MenuItem value="Active">Active</MenuItem>
                            <MenuItem value="Inactive">Inactive</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item md={1} sx={{ alignSelf: 'center', margin: 'auto' }}>
                        <IconButton onClick={handleButtonClick}>
                          <Iconify icon="mdi:add" />
                        </IconButton>
                        <IconButton onClick={() => handleRemove(index)}>
                          <Iconify icon="mdi:delete-forever-outline" />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            </DialogContent>
            <DialogActions>
              {validationMessage && (
                <Typography color="error" variant="body2" sx={{ mb: 1 }}>
                  {validationMessage}
                </Typography>
              )}
              <Button onClick={handleClose} color="info" sx={{ border: '1px solid #d8def5' }}>
                Cancel
              </Button>
              <Button type="submit" color="primary" sx={{ border: '1px solid #d8def5' }}>
                {edit ? 'Update' : 'Create'}
              </Button>
            </DialogActions>
          </Dialog>
        </Stack>
        {progressLoading ? <GradientProgress /> :
          <>
            {isSmallScreen ? (
              <ListView
                data={syllabusData}
                onRowClick={id => router.push(`/master/syllabus/${id}`)}
                editdata={handleEdit}
                page="syllabus"
              />
            ) : (
              <DataTable
                quickFilterText={quickFilterText}
                rowData={syllabusData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                refreshTable={refreshTable}
              />)} </>}
      </Card>
    </Container>
  );
}
