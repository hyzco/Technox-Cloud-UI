// ** Redux Imports
import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "axios";

// ** Get Config
import userConfig from "../../../configs/user";

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

// ** Fetch Servers
export const fetchData = createAsyncThunk(
  "appUsers/fetchData",
  async (params: DataParams) => {
    const response = await axios.get(userConfig.getServer, {
      headers: {
        Authorization: window.localStorage.getItem(
          userConfig.storageTokenKeyName
        )!,
      },
      params,
    });
    console.log(response.data.userServer);
    return response.data.userServer;
  }
);

// // ** Add User
// export const addUser = createAsyncThunk(
//   'appUsers/addUser',
//   async (data: { [key: string]: number | string }, { getState, dispatch }: Redux) => {
//     const response = await axios.post('/apps/users/add-user', {
//       data
//     })
//     dispatch(fetchData(getState().user.params))

//     return response.data
//   }
// )

// // ** Delete User
// export const deleteUser = createAsyncThunk(
//   'appUsers/deleteUser',
//   async (id: number | string, { getState, dispatch }: Redux) => {
//     const response = await axios.delete('/apps/users/delete', {
//       data: id
//     })
//     dispatch(fetchData(getState().user.params))

//     return response.data
//   }
// )

export const userServersSlice = createSlice({
  name: "userServers",
  initialState: {
    serverList: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.serverList = action.payload.serverList;
    });
  },
});

export default userServersSlice.reducer;
