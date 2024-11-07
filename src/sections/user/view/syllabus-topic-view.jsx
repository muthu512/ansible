import React, { useCallback, useEffect, useState } from 'react';
import './topic-view-stylesheet.css';
import {
  Typography,
  Tooltip,
  Stack,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { useRouter } from 'src/routes/hooks';
import Iconify from 'src/components/iconify';
import useApiService from 'src/services/api_services';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'src/components/snakbar';
import DataTable from '../../../components/datatable';

export default function SyllabusTableView() {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState(''); 
  const [rowToDelete, setRowToDelete] = useState([]);
  const { id } = useParams();
  const [formData, setFormData] = useState({
    description: '',
    id: '',
    title: '',
    estimation: '',
    status: '',
    syllabusId: id,
    topicNumber: '',
  });
  const [syllabusTableView, setSyllabusTableView] = useState([]);
  const [load, setLoad] = useState(true);
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const { getSyllabusByTopic, updateSyllabus, deleteSyllabus } = useApiService();
  const [oldParam, setOldParam] = useState();
  const [topicNumberError, setTopicNumberError] = useState(false);


  const [syllabusDefs] = useState([
    {
      id: '',
      field: 'topicNumber',
      align: 'center',
      headerName: 'Syllabus.No',
      flex: 1,
      maxWidth: 80,
      cellStyle: {
        alignContent: 'center',
        textAlign: '-webkit-center',
      },
      filter: false,
    },
    {
      id: '',
      field: 'title',
      headerName: 'Topic',
      align: 'center',
      flex: 1,
    },
    {
      id: '',
      field: 'description',
      headerName: 'Topic Description',
      align: 'center',
      flex: 1,
    },
    {
      id: '',
      field: 'estimation',
      headerName: 'Hours',
      align: 'center',
      cellStyle: { textAlign: 'center' },
      flex: 1,
    },
    {
      id: '',
      field: 'status',
      headerName: 'Status',
      align: 'center',
      cellStyle: { textAlign: 'center' },
      flex: 1,
    },
    {
      id: '',
      field: 'Action',
      align: 'center',
      flex: 1,
      maxWidth: 100,
      headerName: 'Action',
      cellStyle: { textAlign: 'center' },
      cellRenderer: (params) => (
        <div style={{ display: "flex", gap: '5px', justifyContent: 'center', }}>
          <Tooltip title="Edit" placement="left">
            <IconButton onClick={() => handleOpenDialog('edit', params.data)}>
              <Iconify
                icon="ic:outline-edit-note"
                sx={{ cursor: 'pointer', color: '#0390f3', }}
              />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete" placement="right">
            <IconButton onClick={() => handleDeleteClick(params.data.id)}>
              <Iconify
                icon="material-symbols:delete-outline-rounded"
                sx={{ color: 'red', cursor: 'pointer' }}
              />
            </IconButton>
          </Tooltip>
        </div>
      )
    }
  ])


  const getSyllabusData = useCallback(
    async (topicId) => {
      try {
        const response = await getSyllabusByTopic(topicId);
        setSyllabusTableView(Array.isArray(response) ? response : []);
      } catch (error) {
        setSyllabusTableView([]); 
      }
    },
    [getSyllabusByTopic]
  );

  const handleSaveSyllabus = async () => {
    try {
      const response = await updateSyllabus(formData);
      if (response.status === 'OK') {
        showSnackbar(response.message, 'success');
        getSyllabusData(id);
        setOpenEditDialog(false);
      } else {
        showSnackbar(response.message, 'warning');
      }
    } catch (error) {
      showSnackbar('Failed to save syllabus', 'error');

    }
  };

  const handleDelete = async () => {
    if (rowToDelete !== null) {
      try {
        const response = await deleteSyllabus(rowToDelete);
        if (response.status === 'OK') {
          showSnackbar(response.message, 'success');
          getSyllabusData(id);
        } else {
          showSnackbar(response.message, 'warning');
        }
      } catch (error) {
        showSnackbar('Failed to delete item', 'error');
      } finally {
        setRowToDelete(null); 
        setOpenDeleteDialog(false); 
      }
    }
  };

  const handleDeleteClick = (syllabusNo) => {
    setRowToDelete(syllabusNo);
    setOpenDeleteDialog(true); 
  };

  const handleOpenDialog = (mode, row = {}) => {
    setDialogMode(mode);
    if (mode === 'edit') {
      setFormData({
        description: row.description,
        id: row.id,
        title: row.title,
        estimation: row.estimation,
        status: row.status,
        syllabusId: row.syllabusId,
        topicNumber: row.topicNumber,
      });
      setOpenEditDialog(true);
    } else if (mode === 'add') {
      setFormData({
        description: '',
        id: '',
        title: '',
        estimation: '',
        status: '',
        syllabusId: id,
        topicNumber: '',
      });
      setOpenEditDialog(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'topicNumber') {
      const isValid = /^[0-9.]*$/.test(value);
      setTopicNumberError(!isValid);
      if (!isValid) return; 
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (oldParam !== id) {
      setLoad(true);
    }
    if (load) {
      setOldParam(id);
      getSyllabusData(id);
      setLoad(false);
    }
  }, [getSyllabusData, id, load, oldParam]);

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0px',
          height: '33px',
          margin: '10px 5px',
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          maxWidth="200px"
          margin={1}
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
            <Typography variant="h6">Syllabus View</Typography>
          </Tooltip>
        </Stack>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Tooltip title="Print" placement="left">
            <Iconify
              onClick={() => window.print()}
              style={{ height: '35px', width: '35px', cursor: 'pointer' }}
              icon="flat-color-icons:print"
            />
          </Tooltip>
          <Button
            onClick={() => handleOpenDialog('add')}
            variant="contained"
            sx={{
              height: 30,
              marginRight: '20px',
              backgroundColor: 'black',
              width: '100px',
              '&:hover': { backgroundColor: 'black' },
            }}
          >
            Add Item
          </Button>
        </div>
      </div>
      {/* <div className="syllabus-container">
        <table className="syllabus-table">
          <thead>
            <tr>
              <th className="syllabus-header s-no">Syllabus No.</th>
              <th className="syllabus-header topicsh">Topics</th>
              <th className="syllabus-header description">Topic-Description</th>
              <th className="syllabus-header hours">Hours</th>
              <th className="syllabus-header status">Status</th>
              <th className="syllabus-header edit">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(syllabusTableView) &&
              syllabusTableView.map((syllabus) => (
                <tr key={syllabus.syllabusNo} className="syllabus-row">
                  <td className="syllabus-cell">{syllabus.topicNumber}</td>
                  <td className="syllabus-cell topics">{syllabus.title}</td>
                  <td className="syllabus-cell topics" >{syllabus.description}</td>
                  <td className="syllabus-cell">{syllabus.estimation}</td>
                  <td className="syllabus-cell topics">{syllabus.status}</td>
                  <td className="syllabus-cell">
                    <div style={{ display: "flex", gap: '5px', justifyContent: 'center', }}>
                      <Tooltip title="Edit" placement="left">
                        <IconButton onClick={() => handleOpenDialog('edit', syllabus)}>
                          <Iconify
                            icon="ic:outline-edit-note"
                            sx={{ cursor: 'pointer', color: '#0390f3', }}
                          />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete" placement="right">
                        <IconButton onClick={() => handleDeleteClick(syllabus.id)}>
                          <Iconify
                            icon="material-symbols:delete-outline-rounded"
                            sx={{ color: 'red', cursor: 'pointer' }}
                          />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div> */}

      <DataTable
        rowData={syllabusTableView}
        columnDefs={syllabusDefs}
        pagers="noPagination"

      />

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
              handleDelete();
            }}
            autoFocus
            color="primary"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit/Add Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        aria-labelledby="form-dialog-title"
        aria-describedby="form-dialog-description"
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            handleSaveSyllabus();
          },
        }}
      >
        <DialogTitle id="form-dialog-title">
          {dialogMode === 'edit' ? 'Edit Item' : 'Add Item'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="topicNumber"
            label="Topic No"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.topicNumber}
            onChange={handleChange}
            error={topicNumberError}
            helperText={topicNumberError ? "Only numbers and full stops are allowed." : ""}
          />
          <TextField
            margin="dense"
            name="title"
            label="Title"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.description}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="estimation"
            label="Estimation"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.estimation}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select name="status" value={formData.status} onChange={handleChange} label="Status">
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button type="submit" color="primary">
            {dialogMode === 'edit' ? 'Save Changes' : 'Add Item'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
