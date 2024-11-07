import { Suspense } from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { PersistGate } from 'redux-persist/integration/react';
import { SnackbarProvider } from 'src/components/snakbar/SnackbarContext';
import App from './app';
import { store, persistor } from './redux/store';

// Don't remove this warning it's for console warnings.
console.warn = () => {};

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(

  <HelmetProvider>
    <SnackbarProvider>
      <BrowserRouter>
        <Suspense>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <App />
            </PersistGate>
          </Provider>
        </Suspense>
      </BrowserRouter>
    </SnackbarProvider>
  </HelmetProvider>
);
