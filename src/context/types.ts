export type ErrCallbackType = (err: { [key: string]: string }) => void;

export type LoginParams = {
  email: string;
  password: string;
};

export type RegisterParams = {
  email: string;
  // username?: string;
  password: string;
};

export type UserDataType = {
  id: number;
  role: string;
  email: string;
  fullName: string;
  username: string;
  password: string;
  name: string;
  surname: string;
  avatar?: string | null;
};

export type UserFinanceDataType = {
  userID: number;
  balance: number;
  activeServiceID: Object | null;
  deactiveServiceID: Object | null;
  expiredServiceID: Object | null;
};

export type AuthValuesType = {
  loading: boolean;
  setLoading: (value: boolean) => void;
  logout: () => void;
  isInitialized: boolean;
  user: UserDataType | null;
  setUser: (value: UserDataType | null) => void;
  setIsInitialized: (value: boolean) => void;
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void;
  register: (params: RegisterParams, errorCallback?: ErrCallbackType) => void;
};

export type UserFinanceValuesType = {
  loading: boolean;
  setLoading: (value: boolean) => void;
  isInitialized: boolean;
  setIsInitialized: (value: boolean) => void;
  userFinance: UserFinanceDataType | null;
  setUserFinance: (value: UserFinanceDataType | null) => void;
  //sync User Finance - to update finance data
};
