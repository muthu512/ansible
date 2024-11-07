import { useSelector } from 'react-redux';

const useAuthToken = () =>{
     const token = useSelector(state => state.auth.token);
     return token;
};

export default useAuthToken;
