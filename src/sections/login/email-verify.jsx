import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import TextField from '@mui/material/TextField';
import { Avatar, Box, Button, Card, Stack, Typography } from '@mui/material';
import useApiService from 'src/services/api_services';
import { useSnackbar } from 'src/components/snakbar/SnackbarContext';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Logo from 'src/components/logo';
import { authlogin } from '../../redux/authSlice';
import Login360Logo from '../../assets/login360_logo_transp_copy.png';

export default function EmailVerificationView() {
    const [errors, setErrors] = useState({});
    const [user, setUser] = useState({ 'email': "", 'password': "" });
    const { showSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const { signin } = useApiService();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevState) => ({
            ...prevState,
            [name]: value
        }));
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
       
    };

    const validate = () => {
        const error = {};
        if (!user.password) {
            error.password = 'Password is required';
        }
        if (!user.email) {
            error.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(user.email)) {
            error.email = 'Invalid email address';
        }
        setErrors(error);
        return Object.keys(error).length === 0;
    };

    const login = async (e) => {

        if (validate()) {
            const response = await signin(user);
            if (response.status === "OK") {
                const token = response.info.accessToken;
                const userInfo = response.info.user;
                dispatch(authlogin({ userInfo, token }));
            } else {
                showSnackbar(response.message, 'warning');
            }

        }
    }

    const onEnter = (e) => {
        if (e.key === 'Enter') {
            login();
        }
    }
    const renderForm = (
        <>  
                <TextField
                    fullWidth 
                    name="email"                   
                    label="Email address"
                    value={user.email || ''}
                    error={Boolean(errors.email)}
                    helperText={errors.email}
                    onChange={handleChange}
                    onKeyDown={onEnter}
                />
            <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}/>
              
            <Button
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                color="inherit"
                sx={{borderRadius:'50px'}}
                onKeyDown={login}
                onClick={login}
            >
                Confirm
            </Button>
        </>
    );
    
    return (
        <Box
            sx={{
                height: 1,
            }}
        >
            <Logo
                sx={{
                    position: 'fixed',
                    top: { xs: 16, md: 24 },
                    left: { xs: 16, md: 24 },
                }}
            />

            <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
                 <Card
                    sx={{
                        p: 5,
                        width: 1,
                        maxWidth: 420,
                        display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
                    }}
                >
                    <Typography variant="h4" >
                         <img alt="login360logo" src={Login360Logo} height={50} style={{marginBottom:'25px'}} />

                    </Typography>
                    <Avatar sx={{ m: 1, bgcolor: 'orange' }}>
            <LockOutlinedIcon />
          </Avatar>
                    <Typography variant="h6" sx={{mb:4}}> Enter a valid Email
                    </Typography>
                    {renderForm}
                </Card>
            </Stack>
        </Box>
    );
}
    


