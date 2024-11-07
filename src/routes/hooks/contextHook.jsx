import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const RouteContext = createContext();


export const RouteProvider = ({ children }) => {
  const location = useLocation();
  const [isSearchBarDisabled, setSearchBarDisabled] = useState(false);

  useEffect(() => {
    // Adjust the condition to match your route patterns
    if (location.pathname.startsWith('/crm/customer/')) {
      setSearchBarDisabled(true);
    } else {
      setSearchBarDisabled(false);
    }
  }, [location.pathname]);

  // Use useMemo to memoize the context value
  const value = useMemo(() => ({ isSearchBarDisabled }), [isSearchBarDisabled]);

  return (
    <RouteContext.Provider value={value}>
      {children}
    </RouteContext.Provider>
  );
};

export const useRouteContext = () => useContext(RouteContext);

RouteProvider.propTypes = {
    children: PropTypes.node.isRequired, // Validate that children is required
  };
