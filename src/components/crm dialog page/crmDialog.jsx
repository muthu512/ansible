import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  Input,
  MenuItem,
  Stack,
  TextField,
  Avatar,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import PropTypes from 'prop-types';
import Iconify from '../iconify';


const CrmDialog = ({
  open,
  onClose,
  TransitionComponent,
  paperprops,
  handleChange,
  edit,
  errors,
  customer,
  citiesData,
  onChangeLocation,
  handleClose,
  qualificationData,
  onChangeQulification,
  fresherOrExprienceData,
  onChangeEnqu,
  leadData,
  courseData,
  assigneData,
  reportingData,
  statusData,
  enquiryDate,
  joinedDate,
  completeDate,
  onChangeJoin,
  onChangeComplete,
  departmentData,
  handleImageChange,
  onChangeDepartment,
  profile,
}) =>

(
  <Dialog
    open={open}
    onClose={onClose}
    onBackdropClick={false}
    TransitionComponent={TransitionComponent}
    fullWidth
    maxWidth="lg"
    keepMounted
    PaperProps={paperprops}
  >
    <DialogTitle color="#f79520">{edit ? 'Update Customer' : 'Create Customer'}</DialogTitle>
    <DialogContent>
      <Stack spacing={2}>
        <Grid container spacing={1} direction="column" justifyContent="center" marginRight={20}>
          <Divider variant="li" textAlign="center" sx={{ color: '#f79520' }}>
            Customer Information
          </Divider>
          <Grid
            container
            mt={1}
            spacing={1}
            sx={{ flexDirection: { xs: 'column', md: 'row', lg: 'row' } }}
          >
            <Grid item xs={12} md={2.5} sx={{ textAlign: 'center' }}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="upload-image"
                type="file"
                onChange={handleImageChange}
              />
              <InputLabel htmlFor="upload-image">
                <Avatar
                  src={profile}
                  variant="square"
                  alt="Uploaded Profile"
                  sx={{
                    width: 180,
                    height: 180,
                    cursor: 'pointer',
                    border: '1px solid green',
                  }}
                />
              </InputLabel>
              <FormControl fullWidth>
                <Input
                  id="upload-image"
                  type="file"
                  onChange={handleImageChange}
                  inputProps={{ accept: 'image/*' }}
                  style={{ display: 'none' }}
                />
              </FormControl>
            </Grid>
            
              <Grid item xs={12} md={9} container spacing={3} direction="row">

                <Grid item xs={12} md={6}>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    onChange={handleChange}
                    name="name"
                    value={customer.name}
                    label={
                      <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                        <Iconify
                          sx={{ marginRight: '4px' }}
                          icon="healthicons:ui-user-profile"
                          width="1.2rem"
                          height="1.2rem"
                        />
                        <div> Customer Name *</div>
                      </Grid>
                    }
                    type="text"
                    error={Boolean(errors.name)}
                    helperText={errors.name}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    margin="dense"
                    id="mobileNumber"
                    onChange={handleChange}
                    name="mobileNumber"
                    value={customer.mobileNumber}
                    label={
                      <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                        <Iconify
                          sx={{ marginRight: '4px' }}
                          icon="ic:baseline-phone-iphone"
                          width="1.2rem"
                          height="1.2rem"
                        />
                        <div> Mobile Number *</div>
                      </Grid>
                    }
                    type="tel"
                    error={Boolean(errors.mobileNumber)}
                    helperText={errors.mobileNumber}
                    fullWidth
                    variant="outlined"
                    inputProps={{ maxLength: 10 }}
                  />
                </Grid>
                <Grid item xs={12} md={6} mt={1} sm={12}>
                  <FormControl fullWidth>
                    <TextField
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={customer.gender}
                      label={
                        <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                          <Iconify
                            sx={{ marginRight: '4px' }}
                            icon="mdi:human-genderless"
                            width="1.2rem"
                            height="1.2rem"
                          />
                          <div> Gender *</div>
                        </Grid>
                      }
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
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Others">Others</MenuItem>
                      <MenuItem value="N/A">N/A</MenuItem>
                    </TextField>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6} mt={1}>
                  <FormControl fullWidth>
                    <Autocomplete
                      id="combo-box-demo"
                      options={citiesData}
                      value={customer.location}
                      onChange={onChangeLocation}
                      ListboxProps={{
                        style: {
                          maxHeight: '150px',
                          border: '2px solid blue',
                          borderRadius: '10px',
                        },
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={
                            <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                              <Iconify
                                sx={{ marginRight: '4px' }}
                                icon="subway:location-3"
                                width="1.2rem"
                                height="1.2rem"
                              />
                              <div> Location *</div>
                            </Grid>
                          }
                          name="location"
                          error={Boolean(errors.location)}
                          helperText={errors.location}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>

              </Grid>

            <Grid item xs={12} md={12} mt={1} sm={12}>
              <Divider variant="li" textAlign="center" sx={{ color: '#f79520' }}>
                Qualification
              </Divider>
            </Grid>

            <Grid item xs={12} md={3} mt={1}>
              <FormControl fullWidth>
                <Autocomplete
                  id="combo-box-demo"
                  options={qualificationData}
                  value={customer.qualification}
                  onChange={onChangeQulification}
                  ListboxProps={{
                    style: {
                      maxHeight: '150px',
                      border: '2px solid blue',
                      borderRadius: '10px',
                    },
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                          <Iconify
                            sx={{ marginRight: '4px' }}
                            icon="iconamoon:certificate-badge-duotone"
                            width="1.2rem"
                            height="1.2rem"
                          />
                          <div>Qualification *</div>
                        </Grid>
                      }
                      error={Boolean(errors.qualification)}
                      helperText={errors.qualification}
                    />
                  )}
                />
              </FormControl>
            </Grid>


            <Grid item xs={12} md={3} mt={1}>
              <FormControl fullWidth>
                <Autocomplete
                  id="combo-box-demo"
                  options={departmentData}
                  value={customer.department}
                  onChange={onChangeDepartment}
                  ListboxProps={{
                    style: {
                      maxHeight: '150px',
                      border: '2px solid blue',
                      borderRadius: '10px',
                    },
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                          <Iconify
                            sx={{ marginRight: '4px' }}
                            icon="iconamoon:certificate-badge-duotone"
                            width="1.2rem"
                            height="1.2rem"
                          />
                          <div>Department *</div>
                        </Grid>
                      }
                      error={Boolean(errors.department)}
                      helperText={errors.department}
                    />
                  )}
                />
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
                  value={customer.passedOutYear}
                  error={Boolean(errors.passedOutYear)}
                  helperText={errors.passedOutYear}
                  label={
                    <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                      <Iconify
                        sx={{ marginRight: '4px' }}
                        icon="uiw:date"
                        width="1.2rem"
                        height="1.2rem"
                      />
                      <div>Passed Out Year *</div>
                    </Grid>
                  }
                  name="passedOutYear"
                  onChange={handleChange}
                  type="number"
                >
                  <MenuItem value="2010">2010</MenuItem>
                  <MenuItem value="2011">2011</MenuItem>
                  <MenuItem value="2012">2012</MenuItem>
                  <MenuItem value="2013">2013</MenuItem>
                  <MenuItem value="2014">2014</MenuItem>
                  <MenuItem value="2015">2015</MenuItem>
                  <MenuItem value="2016">2016</MenuItem>
                  <MenuItem value="2017">2017</MenuItem>
                  <MenuItem value="2018">2018</MenuItem>
                  <MenuItem value="2019">2019</MenuItem>
                  <MenuItem value="2020">2020</MenuItem>
                  <MenuItem value="2021">2021</MenuItem>
                  <MenuItem value="2022">2022</MenuItem>
                  <MenuItem value="2023">2023</MenuItem>
                  <MenuItem value="2024">2024</MenuItem>
                  <MenuItem value="2025">2025</MenuItem>
                  <MenuItem value="2026">2026</MenuItem>
                  <MenuItem value="2027">2027</MenuItem>
                  <MenuItem value="2028">2028</MenuItem>
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
                  label={
                    <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                      <Iconify
                        sx={{ marginRight: '4px' }}
                        icon="icon-park-twotone:file-staff"
                        width="1.2rem"
                        height="1.2rem"
                      />
                      <div>Fresher / Exprience *</div>
                    </Grid>
                  }
                  name="fresherOrExprienceCode"
                  Assigned
                  onChange={handleChange}
                >
                  {fresherOrExprienceData}
                </TextField>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={12}>
              <Divider variant="li" textAlign="center" sx={{ color: '#f79520' }}>
                Course Details
              </Divider>
            </Grid>

            <Grid item md={3} mt={1}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Enquiry Date"
                  value={enquiryDate}
                  onChange={onChangeEnqu}
                  format="yyyy-MMM-dd"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={Boolean(errors.enquiryDate)}
                      helperText={errors.enquiryDate}
                    />
                  )}
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
                  label={
                    <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                      <Iconify
                        sx={{ marginRight: '4px' }}
                        icon="fluent:people-chat-24-filled"
                        width="1.2rem"
                        height="1.2rem"
                      />
                      <div>Lead Source *</div>
                    </Grid>
                  }
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
                  label={
                    <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                      <Iconify
                        sx={{ marginRight: '4px' }}
                        icon="healthicons:i-training-class"
                        width="1.2rem"
                        height="1.2rem"
                      />
                      <div>Class Type *</div>
                    </Grid>
                  }
                  name="classType"
                  onChange={handleChange}
                >
                  <MenuItem value="Online">Online</MenuItem>
                  <MenuItem value="Offline">Offline</MenuItem>
                  <MenuItem value="Offline-Weekend">Offline-Weekend</MenuItem>
                  <MenuItem value="N/A">N/A</MenuItem>
                </TextField>
              </FormControl>
            </Grid>

            <Grid item md={12}>
              <Divider variant="li" textAlign="center" sx={{ color: '#f79520' }}>
                Status and Joined date
              </Divider>
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
                  value={customer.statusCode}
                  error={Boolean(errors.statusCode)}
                  helperText={errors.statusCode}
                  label={
                    <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                      <Iconify
                        sx={{ marginRight: '4px' }}
                        icon="f7:status"
                        width="1.2rem"
                        height="1.2rem"
                      />
                      <div>Status *</div>
                    </Grid>
                  }
                  name="statusCode"
                  onChange={handleChange}
                >
                  {statusData}
                </TextField>
              </FormControl>
            </Grid>

            <Grid item md={3} mt={1} >
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  disabled={customer.statusCode !== 'JOIN' && customer.statusCode !== 'COMP'}
                  label="Joining Date"
                  value={customer.statusCode === 'JOIN' || customer.statusCode === 'COMP' ? joinedDate : null}
                  onChange={onChangeJoin}
                  name='joinDate'
                  format="yyyy-MMM-dd"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={Boolean(errors.joinedDate)}
                      helperText={errors.joinedDate}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item md={3} mt={1} >
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  disabled={customer.statusCode !== 'COMP'}
                  label="Complete Date"
                  value={customer.statusCode !== 'COMP' ? null : completeDate}
                  onChange={onChangeComplete}
                  name='completeDate'
                  format="yyyy-MMM-dd"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={Boolean(errors.completeDate)}
                      helperText={errors.completeDate}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item md={12}>
              <Divider variant="li" textAlign="center" sx={{ color: '#f79520' }}>
                Office Use
              </Divider>
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
                  value={customer.priority}
                  error={Boolean(errors.priority)}
                  helperText={errors.priority}
                  label={
                    <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                      <Iconify
                        sx={{ marginRight: '4px' }}
                        icon="bi:patch-question-fill"
                        width="1.2rem"
                        height="1.2rem"
                      />
                      <div>Priority *</div>
                    </Grid>
                  }
                  name="priority"
                  onChange={handleChange}
                >
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="N/A">N/A</MenuItem>
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
                  label={
                    <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                      <Iconify
                        sx={{ marginRight: '4px' }}
                        icon="pajamas:assignee"
                        width="1.2rem"
                        height="1.2rem"
                      />
                      <div>Assigned *</div>
                    </Grid>
                  }
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
                  label={
                    <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                      <Iconify
                        sx={{ marginRight: '4px' }}
                        icon="ic:round-report"
                        width="1.2rem"
                        height="1.2rem"
                      />
                      <div>Reporting *</div>
                    </Grid>
                  }
                  name="reportingId"
                  onChange={handleChange}
                >
                  {reportingData}
                </TextField>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
      </Stack>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} color="secondary">
        Cancel
      </Button>
      <Button type="submit" color="primary">
        {edit ? 'Update' : 'Create'}{' '}
      </Button>
    </DialogActions>
  </Dialog>
);

CrmDialog.propTypes = {
  open: PropTypes.any,
  onClose: PropTypes.any,
  TransitionComponent: PropTypes.any,
  paperprops: PropTypes.any,
  handleChange: PropTypes.any,
  edit: PropTypes.any,
  errors: PropTypes.any,
  customer: PropTypes.any,
  citiesData: PropTypes.any,
  onChangeLocation: PropTypes.any,
  handleClose: PropTypes.any,
  qualificationData: PropTypes.any,
  onChangeQulification: PropTypes.any,
  fresherOrExprienceData: PropTypes.any,
  onChangeEnqu: PropTypes.any,
  leadData: PropTypes.any,
  courseData: PropTypes.any,
  assigneData: PropTypes.any,
  reportingData: PropTypes.any,
  statusData: PropTypes.any,
  enquiryDate: PropTypes.any,
  joinedDate: PropTypes.any,
  completeDate: PropTypes.any,
  onChangeJoin: PropTypes.any,
  onChangeComplete: PropTypes.any,
  departmentData: PropTypes.any,
  onChangeDepartment: PropTypes.any,
  handleImageChange: PropTypes.any,
  profile: PropTypes.any,
};
export default CrmDialog;
