import { memo, useEffect} from 'react';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { useRouter } from '../routes/hooks';
import useAuthToken from './user_auth_token';
import { authlogout } from '../redux/authSlice';
import { useSnackbar } from '../components/snakbar';


const SessionManager = memo(() => {
    const dispatch = useDispatch();
    const token = useAuthToken();
    const { showSnackbar } = useSnackbar();
    const router = useRouter();

    useEffect(() => {
        if (!token) {
            return () => {}; 
        }

        const decodedToken = jwtDecode(token);
        const expirationTime = decodedToken.exp * 1000; 
        const currentTime = Date.now();
        const timeLeft = expirationTime - currentTime;

        const alertTime = Math.max(timeLeft - 30 * 60 * 1000, 0); 
        const alertTimeSecond = Math.max(timeLeft - 10 * 60 * 1000, 0);

        const alertTimeout = setTimeout(() => {
            if (alertTime) {
                showSnackbar("Your session will expire in 30 minutes. Please re-login.", 'warning');
            }
        }, alertTime);

        const SecondAlertTimeout = setTimeout(() => {
            if (alertTimeSecond) {
                showSnackbar("Your session will expire in 10 minutes. Please re-login.", 'warning');
            }
        }, alertTimeSecond);

        const logoutTimeout = setTimeout(() => {
            dispatch(authlogout());
            showSnackbar("Your session has expired. You have been logged out.", 'error');
            router.push('/login');
        }, timeLeft);

        return () => {
            clearTimeout(alertTimeout);
            clearTimeout(logoutTimeout);
            clearTimeout(SecondAlertTimeout);
        };
    }, [token, dispatch, showSnackbar, router]);

    return null; 
});

export default SessionManager;
