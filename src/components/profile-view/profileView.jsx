
import PropTypes from 'prop-types';
import { Modal, Box, Avatar, Typography, useMediaQuery } from '@mui/material'; 
import Iconify from '../iconify';


const AvatarView = ({ showModal, handleCloseModal, avatarUrl, user,page }) => {

    const smallScreen = useMediaQuery('(min-width: 650px)');
    const mobile = useMediaQuery('(max-width: 500px)');

    return(
        <Modal open={showModal} onClose={handleCloseModal} sx={{backdropFilter:'blur(3px)'}}>

            <Box>
                {mobile ? null:
                <Iconify icon="maki:cross"
                onClick={handleCloseModal}
                width= {smallScreen ? '30px' : '20px' } 
                height={smallScreen ? '30px' : '20px' } 
              
                sx={{position:'absolute' , top:smallScreen ? '15%': '20%', right:smallScreen ? '20%': '20%', color:'rgba(150,150,150)',
                '&:hover':{
            color:'rgba(250,250,250)', cursor:'pointer'}, fontSize:'35px'}}/>}

            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                height:smallScreen ? '350px':'250px',
                width: smallScreen ? '350px':'250px',
                border:'3px solid orange',
                boxShadow:('0px 0px 30px -10px orange') ,        
                borderRadius: page ? 'unset' :'50%'
            }}>
                <Avatar  src={avatarUrl} alt=""  variant={page? 'square':'circle'} style={{ width: '100%', height: '100%', }}>
                    <Typography sx={{ fontSize: 55 }}>{user}</Typography>
                </Avatar>
            </Box>

            </Box>
        </Modal>

        );
    }

        AvatarView.propTypes = {
            showModal: PropTypes.any,
            handleCloseModal: PropTypes.any,
            avatarUrl:PropTypes.any,
            user:PropTypes.any,
            page:PropTypes.any,
        }
    

export default AvatarView;


