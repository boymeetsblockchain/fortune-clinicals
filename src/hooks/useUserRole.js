import { useAuthStatus } from './useAuthStatus';

function useUserRole() {
  const { loggedIn, userData } = useAuthStatus();

  const isAdmin = userData?.isAdmin === true;
  const isESH = userData?.isESH === true;

  return {
    isAdmin,
    isESH,
    loggedIn,
  };
}

export { useUserRole };
