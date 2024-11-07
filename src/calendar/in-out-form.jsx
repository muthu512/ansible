import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Button, Box, FormControl } from '@mui/material';
import Iconify from 'src/components/iconify';


export default function InOutFormView() {
    const [startTime, setStartTime] = useState(dayjs().startOf('day'));
    const [activeButton, setActiveButton] = useState('out'); 


    const products = [
        {
            name: 'In-Time',
            desc: 'How many hours taken ',
            price: '2:00',
        },
        {
            name: 'Out-Time',
            desc: 'Today Java class taken by Prabakaran',
            price: '4:00',
        },

    ];


    const handleButtonClick = () => {
        if (activeButton === 'in') {
            setActiveButton('out');
        } else {
            setActiveButton('in');
        }
    };


    return (
        <>
            <div style={{ marginBottom: '20px' }}>
                <Typography variant="h4">In and Out Form</Typography>
            </div>
            <Grid container xs={12} md={12} >

                <Grid container xs={12} md={5}>
                    {/* Right Side */}
                    <List >
                        <Typography variant="h6" color="text.secondary">
                            Details
                        </Typography>
                        {products.map((product) => (
                            <ListItem key={product.name} sx={{ py: 1, px: 0 }}>
                                <ListItemText
                                    sx={{ mr: { xl: 50, md: 10, sm: 40 } }}
                                    primary={product.name}
                                    secondary={product.desc}
                                />
                                <Typography variant="body1" fontWeight="medium">
                                    {product.price}
                                </Typography>
                            </ListItem>
                        ))}
                    </List>
                </Grid>

                {/* Left Side */}
                <Grid container md={7} sx={{ marginTop: { xs: '30px' } }}>
                    <FormControl fullWidth>
                        <Grid md={12} >

                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Grid sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                    <Grid>
                                        <DatePicker
                                            sx={{ minWidth: { xs: '270px', sm: '350px', md: '270px', lg: '300px', xl: '630px' } }}
                                            label="Date"
                                            defaultValue={dayjs('2022-04-17')}
                                            renderInput={(params) => <TextField {...params} fullWidth />}
                                        />
                                    </Grid>

                                    <Grid>
                                        <TimePicker
                                            sx={{ minWidth: { xs: '270px', sm: '350px', md: '270px', lg: '300px', xl: '630px' } }}
                                            label="Start Time"
                                            value={startTime}
                                            onChange={(newValue) => setStartTime(newValue)}
                                            renderInput={(params) => <TextField {...params} fullWidth />}
                                        />
                                    </Grid>
                                </Grid>
                            </LocalizationProvider>
                        </Grid>

                        <Grid item xs={12} md={12} mt={3}>
                            <Box mb={6} >
                                <TextField
                                    id="message"
                                    name="message"
                                    label={
                                        <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                                          <Iconify
                                            sx={{ marginRight: '4px' }}
                                            icon="ic:twotone-message"
                                            width="1.2rem"
                                            height="1.2rem"
                                          />
                                          <div>Enter Your Message Here.. </div>
                                        </Grid>
                                      }
                                    multiline
                                    rows={4}
                                    fullWidth
                                    variant="outlined"
                                    sx={{ marginTop: '10px' }}
                                />
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <Box display="flex" flexDirection="row" alignItems="flex-start" gap='10px'>
                                <Button
                                    variant="contained"
                                     color="success"
                                    onClick={handleButtonClick}
                                    disabled={activeButton === 'in'}
                                    sx={{ width: '100px', height: '50px', fontSize: '18px', mb: 2 }}
                                >
                                    In
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={handleButtonClick}
                                    disabled={activeButton === 'out'}
                                    sx={{ width: '100px', height: '50px', fontSize: '18px'}}
                                >
                                    Out
                                </Button>
                            </Box>
                        </Grid>
                    </FormControl>
                </Grid>
            </Grid>
        </>
    );
}
