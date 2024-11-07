import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import PropTypes from 'prop-types';

export default function ConfirmDialog({confirmPopup,handleClosePopup,handleExit,text, ...props}) {

    const name = text
    return (
        <Dialog
            open={confirmPopup}
            onClose={handleClosePopup}
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle id="responsive-dialog-title">Do you want to {name}?</DialogTitle>
            <DialogActions>
                <Button autoFocus onClick={handleClosePopup}>
                    No
                </Button>
                <Button onClick={handleExit} autoFocus>
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    )
}

ConfirmDialog.propTypes = {
    text:PropTypes.any,
    handleExit: PropTypes.any,
    handleClosePopup: PropTypes.any,
    confirmPopup: PropTypes.any
}