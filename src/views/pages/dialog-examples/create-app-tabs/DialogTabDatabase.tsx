// ** React Imports
import { useState, ChangeEvent, useEffect } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Radio from "@mui/material/Radio";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

// ** Icons Imports
import Aws from "mdi-material-ui/Aws";
import Firebase from "mdi-material-ui/Firebase";
import Database from "mdi-material-ui/DatabaseOutline";

// ** Custom Avatar Component
import CustomAvatar from "src/@core/components/mui/avatar";
import Grid from "@mui/material/Grid";
import useFormReducer from "src/@core/hooks/useFormReducer";
import {
  FormWrapperHook,
  useFormHook,
} from "src/@core/components/form/form-wrapper";
import useTheme from "@mui/material/styles/useTheme";

interface IDatabase {
  engineName: string;
  engineVersion: string;
  engineDesc: string;
  engineIcon: string;
}

const DATABASE_CATALOG = [
  {
    engineName: "MySQL",
    engineVersion: "8.0.26",
    engineDesc:
      "MySQL is an open-source relational database management system.",
    engineIcon: "https://img.icons8.com/color/96/mysql-logo.png",
  },
  {
    engineName: "PostgreSQL",
    engineVersion: "13.3",
    engineDesc:
      "PostgreSQL is a powerful, open-source object-relational database system.",
    engineIcon: "https://img.icons8.com/plasticine/100/postgreesql.png",
  },
  {
    engineName: "MongoDB",
    engineVersion: "5.0.0",
    engineDesc: "MongoDB is a popular open-source NoSQL document database.",
    engineIcon: "https://img.icons8.com/color/96/mongodb.png",
  },
  {
    engineName: "SQLite",
    engineVersion: "3.36.0",
    engineDesc:
      "SQLite is a lightweight, file-based open-source relational database engine.",
    engineIcon:
      "https://e7.pngegg.com/pngimages/759/621/png-clipart-sqlite-database-android-computer-software-application-software-android-angle-data.png",
  },
  {
    engineName: "MariaDB",
    engineVersion: "10.6.4",
    engineDesc: "MariaDB is a community-developed, open-source fork of MySQL.",
    engineIcon: "https://img.icons8.com/fluency/96/maria-db.png",
  },
];

interface IDatabaseProps {
  callback: Function;
  tabFooter: (props: any) => JSX.Element;
}

enum REDUCER_ACTIONS {
  SET_DB_ENGINE = "SET_DB_ENGINE",
  SET_DB_DETAILS = "SET_DB_DETAILS",
}

const TabDatabase = (props: IDatabaseProps) => {
  const [value, setValue] = useState<string>("");
  const formHook = useFormHook();
  const theme = useTheme();
  const [
    handleSubmit,
    reset,
    control,
    register,
    getValues,
    // setValue,
    formState,
    trigger,
  ] = formHook;

  const { callback, tabFooter } = props;

  // const cachedOsName = React.useRef("");

  const [state, dispatch]: any = useFormReducer({
    reducer: (state: any, action: any) => {
      switch (action.type) {
        case REDUCER_ACTIONS.SET_DB_ENGINE:
          console.log(action);
          return { ...state, dbEngineName: action.payload.dbEngineName };
        case REDUCER_ACTIONS.SET_DB_DETAILS:
          console.log(action);
          return { ...state, dbEngineName: action.payload.dbEngineName };
      }
    },
    reducerState: {
      dbEngineName: "",
      accountDetails: {
        dbName: "",
        dbUser: "",
        dbPw: "",
        dbRootPw: "",
      },
    },
  });

  useEffect(() => {
    // console.log(formContext);
    // This effect runs after every render
    console.log("rendering TabDetails...");
    if (state) {
      // console.log(state);
    }
    // console.log(formState());
  }, [state]);

  const handleChange = (value: any) => {
    dispatch({
      type: REDUCER_ACTIONS.SET_DB_ENGINE,
      payload: { dbEngineName: value },
    });
  };

  const renderDatabase = (props: IDatabase) => {
    return (
      <Box
        onClick={(e) => handleChange(props.engineName)}
        sx={{
          mb: 6,
          p: 2,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor:
            state.dbEngineName == props.engineName
              ? theme.palette.background.default
              : "transparent",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <CustomAvatar
            skin="light"
            color="error"
            variant="rounded"
            sx={{ mr: 3, width: 48, height: 48 }}
          >
            <img
              width="48"
              height="48"
              style={{ background: "white" }}
              src={props.engineIcon}
              alt={`${props.engineName} ${props.engineVersion} ${props.engineName}`}
            />
          </CustomAvatar>
          <Box>
            <Typography sx={{ color: "text.secondary" }}>
              {props.engineName} {props.engineVersion}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.disabled" }}>
              {props.engineDesc}
            </Typography>
          </Box>
        </Box>
        <Radio
          checked={state && state.dbEngineName === props.engineName}
          name="dbEngineName"
          {...register("dbEngineName", {
            value: state.dbEngineName,
            onchange: handleChange,
          })}
        />
      </Box>
    );
  };
  return (
    <FormWrapperHook
      name={"serverDatabase"}
      formHook={formHook}
      fields={["dbName", "dbUser", "dbPw", "dbRootPw", "dbEngineName"]}
      onSubmit={(data) => {
        console.log("submitted");
        callback(data);
      }}
    >
      <Box>
        <Typography variant="h6" sx={{ mb: 4 }}>
          Database Settings
        </Typography>
        <Grid container spacing={6}>
          <Grid item xs={8} sm={3}>
            <TextField
              {...register("dbName")}
              name="dbName"
              sx={{ mb: 4 }}
              label="Database Name"
              placeholder=""
            />
          </Grid>
          <Grid item xs={8} sm={3}>
            <TextField
              {...register("dbUser")}
              name="dbUser"
              sx={{ mb: 4 }}
              label="Database User"
              placeholder=""
            />
          </Grid>
          <Grid item xs={4} sm={3}>
            <TextField
              {...register("dbPw")}
              name="dbPw"
              sx={{ mb: 4 }}
              label="Database Password"
              placeholder=""
            />
          </Grid>
        </Grid>
        <Grid container spacing={6}>
          <Grid item xs={4} sm={3}>
            <TextField
              {...register("dbRootPw")}
              name="dbRootPw"
              sx={{ mb: 4 }}
              label="Database Root Password"
              placeholder=""
            />
          </Grid>
        </Grid>

        <Typography variant="h6" sx={{ mb: 4 }}>
          Select Database Engine (no selection to skip)
        </Typography>
        <Box sx={{ mb: 8 }}>
          {[...DATABASE_CATALOG].map((databaseEngine: IDatabase) => {
            return renderDatabase(databaseEngine);
          })}
        </Box>
        {tabFooter && tabFooter({ enableDefaultOnClick: false })}
      </Box>
    </FormWrapperHook>
  );
};

export default TabDatabase;
