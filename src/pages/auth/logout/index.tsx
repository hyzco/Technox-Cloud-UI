// ** React Imports
import { useEffect } from "react";

// ** Hooks
import { useAuth } from "src/hooks/useAuth";

const Logout = () => {
  // ** Hooks
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, []);
};

Logout.acl = {
  action: "all",
  subject: "logout",
};

export default Logout;
