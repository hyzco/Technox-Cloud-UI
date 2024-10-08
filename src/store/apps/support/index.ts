// ** Redux Imports
import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "axios";

// ** Get Config
import supportConfig from "../../../configs/support";

interface DataParams {
  offset?: number;
  limit?: number;
  isParents?: boolean;
  role?: string;
  requestId?: number;
}

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

// ** Fetch Support
export const fetchSingleRequest = createAsyncThunk(
  "appSupport/fetchSingleRequest",
  async (params: DataParams) => {
    console.log("here params");
    console.log(params);
    if (typeof params.requestId != "number") return;

    const response = await axios.get(supportConfig.getSingleRequest, {
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

export const fetchData = createAsyncThunk(
  "appSupport/fetchDataForUser",
  async (params: DataParams) => {
    console.log("here params");
    console.log(params);

    const endpoint =
      params.role === "user"
        ? supportConfig.getRequestForUser
        : supportConfig.getRequestForOperator;

    const response = await axios.get(endpoint, {
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

export const fetchTotalRequest = createAsyncThunk(
  "appSupport/fetchTotalRequest",
  async (params: DataParams) => {
    const response = await axios.get(
      supportConfig.getTotalRequestCountForUser,
      {
        headers: {
          Authorization: window.localStorage.getItem(
            supportConfig.storageTokenKeyName
          )!,
        },
        params,
      }
    );
    console.log(response.data);
    return response.data.count;
  }
);

// ** Add Support
// export const addSupport = createAsyncThunk(
//   "appUsers/addUser",
//   async (
//     data: { [key: string]: number | string },
//     { getState, dispatch }: Redux
//   ) => {
//     const response = await axios.post("/apps/users/add-user", {
//       data,
//     });
//     dispatch(fetchData(getState().user.params));

//     return response.data;
//   }
// );

export const userSupportsSlice = createSlice({
  name: "userSupports",
  initialState: {
    supportList: [],
    totalRequestCount: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.supportList = action.payload;
    });
    builder.addCase(fetchTotalRequest.fulfilled, (state, action) => {
      state.totalRequestCount = action.payload.count;
    });
  },
});

export default userSupportsSlice.reducer;
