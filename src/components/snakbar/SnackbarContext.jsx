import PropTypes from 'prop-types';
import React, { useMemo, useState, useContext, useCallback, createContext } from 'react';
import { Alert, Slide, Snackbar } from '@mui/material';

const SnackbarContext = createContext();

const SnackbarProvider = ({ children }) => {
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });

    const showSnackbar = useCallback((message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    }, []);

    const hideSnackbar = useCallback(() => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    }, []);

    const contextValue = useMemo(() => ({
        showSnackbar,
        hideSnackbar,
    }), [showSnackbar, hideSnackbar]);

    const CustomTransition = (e) => <Slide  {...e} direction="left" />;

    return (
        <SnackbarContext.Provider value={contextValue}>
            {children}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={hideSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                className='snackBar'
                TransitionComponent={CustomTransition}
            >
                <Alert onClose={hideSnackbar} variant="filled" severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};

SnackbarProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error('useSnackbar must be used within a SnackbarProvider');
    }
    return context;
};

export { useSnackbar, SnackbarProvider };
