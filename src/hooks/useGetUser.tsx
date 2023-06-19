import { useContext } from "react";
import { UserContext } from "src/context/UserContext";

const useGetUser = () => useContext(UserContext);

export default useGetUser;
