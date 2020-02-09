import { useEffect } from 'react';

const useAuthCheck = ({isAuthenticated, initialAuthCheckDone, history}) => {
  useEffect(() => {
    if (!isAuthenticated && initialAuthCheckDone) {
      history.replace('/');
    }
  }, [isAuthenticated, initialAuthCheckDone, history]);
};

export default useAuthCheck;
