import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Grid } from '@mui/material';
import Iconify from 'src/components/iconify';

const LeaveForm = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    reason: '',
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // You can send formData to an API or process it here
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        minHeight: {xl: '900px'},
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 1,
          borderRadius: 1,
          boxShadow: 3,
          width: {xl: '80%'},
          height: {xl: '700px'},
        }}
      >
        <Typography component="h1" variant="h5" sx={{margin: {xl: '60px'}}}>
          Leave Form
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{width : {xl: '100%'}, height: {xl: '100%'}}}>
          <Grid
            container
            // mt={1}
            px={6}
            spacing={1}
            sx={{ flexDirection: { xs: 'column', md: 'row', lg: 'row' }, height: {xl: '100%'} }}
          >
            <Grid item xs={12} md={6}>
              <TextField
                margin="normal"
                fullWidth
                id="name"
                name="name"
                label={
                  <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                    <Iconify
                      sx={{ marginRight: '4px' }}
                      icon="healthicons:ui-user-profile"
                      width="1.2rem"
                      height="1.2rem"
                    />
                    <div> Name *</div>
                  </Grid>
                }
                value={formData.name}
                onChange={handleChange}
                
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                margin="normal"
                fullWidth
                id="name"
                name="name"
                label={
                  <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                    <Iconify
                      sx={{ marginRight: '4px' }}
                      icon="majesticons:library-line"
                      width="1.2rem"
                      height="1.2rem"
                    />
                    <div> Department *</div>
                  </Grid>
                }
                value={formData.name}
                onChange={handleChange}
                
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                margin="normal"
                fullWidth
                id="startDate"
                name="startDate"
                label="Start Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.startDate}
                onChange={handleChange}
                
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                margin="normal"
                fullWidth
                id="endDate"
                name="endDate"
                label="End Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.endDate}
                onChange={handleChange}
                
              />
            </Grid>
            <TextField
              margin="normal"
              fullWidth
              id="reason"
              name="reason"
              label={
                <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                  <Iconify
                    sx={{ marginRight: '4px' }}
                    icon="tabler:message-report"
                    width="1.2rem"
                    height="1.2rem"
                  />
                  <div>Reason *</div>
                </Grid>
              }
              multiline
              rows={4}
              value={formData.reason}
              onChange={handleChange}
              
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2, width: '200px' }}
              >
                Submit
              </Button>
            </div>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default LeaveForm;
