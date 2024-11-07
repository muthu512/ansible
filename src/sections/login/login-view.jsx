import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Button, CircularProgress,Grid  } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import { useRouter } from 'src/routes/hooks';
import useApiService from 'src/services/api_services';
import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import GradientProgress from 'src/components/progress/gradientProgress';
import { useSnackbar } from 'src/components/snakbar/SnackbarContext';
import { authlogin } from '../../redux/authSlice';
import Login360Logo from '../../assets/LOGIN TO TECHNOEDGE CERNTER.png';
import Login360Logo1 from '../../assets/transparantLogo.png';


// ----------------------------------------------------------------------

export default function LoginView() {
  const auth = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();
  const { signin } = useApiService();
  const { showSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [progressLoading, setProgressLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);


  const [user, setUser] = useState({ 'email': "", 'password': "" });

  const checkLogin = useCallback(() => {
    if (auth.isAuthenticated) {
      setLoggedIn(true);
      if(auth.user.deptCode === 'TR'){
        router.push("/student/batches")
      } else {
        router.push("/");
      }
    }
    setProgressLoading(false);
  }, [router, auth]);

  useEffect(() => {
    checkLogin();
  }, [checkLogin]);



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

  const login = async (e) => {

    if (validate()) {
      setLoading(true);
      const response = await signin(user);
      setLoading(false);
      if (response.status === "OK") {
        const token = response.info.accessToken;
        const userInfo = response.info.user;
        dispatch(authlogin({ userInfo, token }));
        router.push("/");
      } else {
        showSnackbar(response.message, 'warning');
        setLoading(false);
      }

    }

  }

  const onEnter = (e) => {
    if (e.key === 'Enter') {
      login();
    }
  }

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

  const renderForm = (
    <>

      <Stack spacing={3}>

        <TextField name="email"
          label={
            <Grid item style={{ display: 'flex', alignItems: 'center' }}>
              <Iconify
                sx={{ marginRight: '4px' }}
                icon="line-md:email-twotone"
                width="1.2rem"
                height="1.2rem"
              />
              <div>Email address *</div>
            </Grid>
          }
          value={user.email || ''}
          error={Boolean(errors.email)}
          helperText={errors.email}
          onChange={handleChange}
          onKeyDown={onEnter}
        />

        <TextField
          name="password"
          label={
            <Grid item style={{ display: 'flex', alignItems: 'center' }}>
              <Iconify
                sx={{ marginRight: '4px' }}
                icon="mdi:password"
                width="1.2rem"
                height="1.2rem"
              />
              <div>Password *</div>
            </Grid>
          }
          type={showPassword ? 'text' : 'password'}
          value={user.password || ''}
          error={Boolean(errors.password)}
          helperText={errors.password}
          onChange={handleChange}
          onKeyDown={onEnter}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
        <Link href='/' variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <Button
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        disabled={loading}
        onKeyDown={login}
        onClick={login}
      >
        {loading ? (

          <CircularProgress sx={{ color: 'orange' }} />
        ) : (
          <span>Sign In</span>
        )}
      </Button>


    </>
  );

  return (
    <Box
      sx={{
        backgroundImage: `url(${'/assets/background/Forms_white.jpg'})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        height: '100vh',

      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
        onContextMenu="return false"
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        {progressLoading || loggedIn ? <GradientProgress /> : <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
            boxShadow: '0px 0px 30px -20px grey'
          }}
        >

         <div  style={{textAlign:'center'}} onContextMenu="return false"><img alt="login360logo" src={Login360Logo} height={120} width={280} style={{pointerEvents:'none'}}  /></div> 
          <h4 style={{marginTop:'15px', paddingLeft:'8px'}}>  Sign In </h4>
          <Typography variant="body2" sx={{ mt: 1, mb: 2 }} />

          <Stack direction="row" spacing={2} />

          {renderForm}
        </Card>}
        <footer style={{ position: 'absolute', left:'10px', bottom: '1px' }}>
          <Typography sx={{fontSize: '12px' }}
          onClick={ () =>{router.push('/copyrights')}}
          >
            <a href='#policy' style={{color: 'orange', fontWeight: 'bold'}}>Privacy Policy</a>
            <br/>
            <a href='#terms' style={{color: 'orange', fontWeight: 'bold'}}>Terms & Conditions</a>
            <br/>
            <a href='#refund' style={{color: 'orange', fontWeight: 'bold'}}>Refund Policy</a>
            <br/>
            <a href='#contact' style={{color: 'orange', fontWeight: 'bold'}}>Contact Us</a>

          </Typography>
          <p style={{fontSize: '12px', userSelect:'none'}}>&#9426; 2017 - 2024 www.login360.info - All Rights Reserved.
              <br/>
            Last Updated : 07/17/2024 12:57:03</p>
        </footer>
        
        <img alt="login360logo" src={Login360Logo1} height={60} width={100} style={{position:'absolute' , right:50 , bottom:40, pointerEvents: 'none'}} onContextMenu="return false" />
      </Stack>

    </Box>

  );


}
