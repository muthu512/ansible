import { Avatar, Box, Grid, Paper, Stack, Typography } from '@mui/material';
import { useRouter } from 'src/routes/hooks';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Label from 'src/components/label';
import AvatarView from 'src/components/profile-view/profileView';
import GradientProgress from 'src/components/progress/gradientProgress';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

import useApiService from 'src/services/api_services';

import UserWidgetSummary from '../user-widget-summary';

export default function UserInfoView() {
    const { id } = useParams();
    const { getUserById } = useApiService();
    const [load, setLoad] = useState(true);
    const router = useRouter();

    const [user, setUser] = useState({
        "id": 0,
        "userName": "",
        "email": "",
        "password": "",
        "deptCode": "",
        "deptName": "",
        "designCode": "",
        "designName": "",
        "roleCode": "",
        "mobileNumber": 0,
        "gender": "",
        "reportingId": "",
        "reportingName": "",
        "active": false,
        "profile": ""
    });
    const getUserDetails = useCallback(async (uid) => {
        const response = await getUserById(uid);
        setUser(response);
        setLoad(false);
    }, [getUserById]);
     
    const [showModal, setShowModal] = useState(false);

    const handleAvatarClick = () => {
        setShowModal(true); 
    };

    const handleCloseModal = () => {
        setShowModal(false); 
    };

    useEffect(() => {
        if (load) {
            getUserDetails(id);
        }
    }, [load, getUserDetails, id])

    return (
        load ? <GradientProgress /> :
            <Grid container direction='column' sx={{px:2}}>
                <Grid item spacing={2} direction='row'>
                    <Stack direction="row" alignItems="center" width='80px' marginBottom={2}
                        onClick={() => { router.back() }}
                        sx={{
                            color: "#f79520",
                            "&:hover": {
                                color: 'blue',
                                cursor: "pointer",
                            }
                        }}>
                        <KeyboardArrowLeftIcon />
                        <Typography variant="h6">Back</Typography>
                    </Stack>
                    <Paper sx={{ padding: 2 }}>
                        <Grid container direction='row' spacing={2} alignItems="center"
                            justify="center" >
                            <Grid item>
                            <Box onClick={handleAvatarClick} style={{ cursor: 'pointer'}}>
                                <Avatar 
                                    src={user.profile}
                                    alt="Uploaded Profile"
                                    sx={{ width: 100, height: 100,  border: '1px solid orange', }}
                                >{user.userName.charAt(0).toUpperCase()}</Avatar>
                                </Box>
                            </Grid>
                            <Grid item direction='column' md={8} xs={8} justifyItems='self-start'>

                                <Typography component="div" variant="h5">
                                    {user.userName}
                                </Typography>
                                <Typography variant="subtitle1" color="text.secondary" component="div">
                                    {user.designName} - {user.deptName}
                                </Typography>
                            </Grid>
                            <Grid item direction='column' md={2} xs={4}>
                                <Label color={(user.active ? 'success' : 'error')}>{user.active ? "Active" : "Inactive"}</Label>
                            </Grid>
                        </Grid>
                    </Paper>
                    <Grid container spacing={2} mt={1}>
                        <Grid item xs={12} sm={6} md={3}>
                            <UserWidgetSummary
                                title={user.gender}
                                color="success"
                                pageClick={() => { }}
                                icon={<img alt="icon" src="/assets/icons/glass/ic_gender.png" />}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <UserWidgetSummary
                                title={user.mobileNumber}
                                color="success"
                                pageClick={() => { }}
                                icon={<img alt="icon" src="/assets/icons/glass/ic_phonecall.png" />}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <UserWidgetSummary
                                title={user.email}
                                color="success"
                                pageClick={() => { }}
                                icon={<img alt="icon" src="/assets/icons/glass/ic_mail.png" />}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <UserWidgetSummary
                                title={user.reportingName}
                                color="success"
                                pageClick={() => { }}
                                icon={<img alt="icon" src="/assets/icons/glass/ic_boss.png" />}
                            />
                        </Grid>
                    </Grid>
                </Grid>

<AvatarView
    showModal={showModal}
    handleCloseModal={handleCloseModal}
    avatarUrl={user.profile}
    user={user.userName.charAt(0).toUpperCase()}
/>

            </Grid>

    )
}