import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

const initialState = {
    isAuthenticated: false,
    user: null,
    token: null,
    expirationTime: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        authlogin: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload.userInfo;
            state.token = action.payload.token;

            const decodedToken = jwtDecode(action.payload.token);
            console.log('decodedtoken',decodedToken)
            state.expirationTime = decodedToken.exp ? decodedToken.exp * 1000 : null;
        },
        authlogout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.expirationTime = null;
        },
    },
});

export const { authlogin, authlogout } = authSlice.actions;
export default authSlice.reducer;
