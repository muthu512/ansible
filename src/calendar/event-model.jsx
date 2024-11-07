import React, { useState } from 'react';
import { useRouter } from 'src/routes/hooks';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Stack, TextField, Tooltip } from '@mui/material';
import TableChartIcon from '@mui/icons-material/TableChart';


export default function EventModal({ isOpen, onClose, onSave, defaultStart, defaultEnd, ...props }) {
    const [eventName, setEventName] = useState('');
    const [description, setDescription] = useState('');
    const router = useRouter();

    const handleSave = () => {
        onSave({
            eventName,
            description,
        });
        onClose();
    };

    const handleRouter = () => {
        router.push('/calendar/attendance');
    }

    return (
        <Dialog
            maxWidth="sm"
            fullWidth
            open={isOpen}
            onClose={onClose}
            aria-labelledby="responsive-dialog-title"
        >
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px'}}>
            <DialogTitle>Create Event</DialogTitle>
            <Tooltip title='Attendance'>
            <IconButton
             sx={{marginRight: '15px'}}
             onClick={handleRouter}
            >
                <TableChartIcon/>
            </IconButton>
            </Tooltip>
            </div>
            <DialogContent>
                <Stack spacing={2}>
                    <Grid container spacing={2}>
                        <Grid item xs={11.5}>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="eventName"
                                name="eventName"
                                label="Event Name"
                                type="text"
                                variant="outlined"
                                fullWidth
                                value={eventName}
                                onChange={(e) => setEventName(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={11.5}>
                            <TextField
                                label="Description"
                                variant="outlined"
                                multiline
                                rows={3}
                                fullWidth
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button autoFocus onClick={onClose}>
                    Cancel
                </Button>
                <Button onClick={handleSave} autoFocus>
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
}

EventModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    defaultStart: PropTypes.instanceOf(Date),
    defaultEnd: PropTypes.instanceOf(Date),
};
