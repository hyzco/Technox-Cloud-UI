import { useContext } from "react";
import { UserFinanceContext } from "src/context/UserFinanceContext";

const useGetUserFinance = () => useContext(UserFinanceContext);

export default useGetUserFinance;
