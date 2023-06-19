// ** Redux Imports
import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "axios";

// ** Get Config
import supportConfig from "../../../configs/support";

interface DataParams {
  // q: string;
  // role: string;
  // status: string;
  // currentPlan: string;
}

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

// ** Fetch Support
export const fetchData = createAsyncThunk(
  "appSupport/fetchData",
  async (params: DataParams) => {
    const response = await axios.get(supportConfig.getRequest, {
      headers: {
        Authorization: window.localStorage.getItem(
          supportConfig.storageTokenKeyName
        )!,
      },
      params,
    });
    console.log(response.data.data);
    return response.data.data;
  }
);

// ** Add Support
export const addSupport = createAsyncThunk(
  "appUsers/addUser",
  async (
    data: { [key: string]: number | string },
    { getState, dispatch }: Redux
  ) => {
    const response = await axios.post("/apps/users/add-user", {
      data,
    });
    dispatch(fetchData(getState().user.params));

    return response.data;
  }
);

export const userSupportsSlice = createSlice({
  name: "userSupports",
  initialState: {
    supportList: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.supportList = action.payload;
    });
  },
});

export default userSupportsSlice.reducer;
