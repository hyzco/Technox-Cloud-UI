// ** React Imports
import {
  useState,
  ChangeEvent,
  SyntheticEvent,
  useEffect,
  useMemo,
  useLayoutEffect,
  useContext,
  JSXElementConstructor,
} from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Radio from "@mui/material/Radio";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

// ** Custom Avatar Component
import CustomAvatar from "src/@core/components/mui/avatar";
import Grid from "@mui/material/Grid";
import NativeSelect from "@mui/material/NativeSelect";
import InputLabel from "@mui/material/InputLabel";
import React from "react";
import { ThemeColor } from "src/@core/layouts/types";
import { useTheme } from "@mui/material/styles";
import {
  FormWrapperHook,
  useFormHook,
} from "src/@core/components/form/form-wrapper";
import useFormReducer from "src/@core/hooks/useFormReducer";

interface renderOsProps {
  osName: string;
  osVersions: Array<string>;
  osDesc: string;
  osImage: string;
}

const osList = [
  {
    osName: "Centos",
    osVersions: ["6.0", "7.0"],
    osDesc: "Centos <version> operating system",
    osImage: "https://img.icons8.com/color/48/centos.png",
  },
  {
    osName: "Ubuntu",
    osVersions: ["18.04", "22.04"],
    osDesc: "Ubuntu <version> operating system",
    osImage: "https://img.icons8.com/color/48/ubuntu--v1.png",
  },
  {
    osName: "Debian",
    osVersions: ["10", "11"],
    osDesc: "Debian <version> operating system",
    osImage: "https://img.icons8.com/color/48/debian.png",
  },
  {
    osName: "Fedora",
    osVersions: ["6", "7", "8"],
    osDesc: "Fedora <version> operating system",
    osImage: "https://img.icons8.com/fluency/48/fedora.png",
  },
  {
    osName: "SUSE",
    osVersions: ["6", "7", "8"],
    osDesc: "SUSE <version> operating system",
    osImage: "https://img.icons8.com/color/48/suse.png",
  },
];

interface IDetailsProps {
  callback: Function;
}

//TODO : radio button issue

const TabDetails = React.memo((_propsDetails: IDetailsProps) => {
  const formHook = useFormHook();
  const [
    handleSubmit,
    reset,
    control,
    register,
    getValues,
    setValue,
    formState,
    trigger,
  ] = formHook;

  const [state, dispatch]: any = useFormReducer({
    reducer: (state: any, action: any) => {
      switch (action.type) {
        case "UPDATE_OS_NAME":
          return { ...state, osName: action.osName };
        case "UPDATE_OS_DESC":
          return { ...state, osDesc: action.osDesc };
        case "UPDATE_OS_VERSION":
          return { ...state, osVersion: action.osVersion };
        default:
          return state;
      }
    },
    reducerState: { osName: "", osDesc: "", osVersion: "" },
  });

  useEffect(() => {
    // console.log(formContext);
    // This effect runs after every render
    console.log("rendering TabDetails...");
    if (state) {
      console.log(state);
    }
    // console.log(formState());
  }, [state]);

  const OperationSystems = (props: renderOsProps) => {
    // const [osVersion, setOsVersion] = useState<string>("");
    let { osName, osVersions, osDesc, osImage } = props;
    // const [desc, setOsDesc] = useState<string>(osDesc);
    // const [selectedOs, setSelectedOs] = useState<string>("");
    // const [prevOs, setPrevOs] = useState<string>("");

    const [ignored, forceUpdate] = React.useReducer((x) => x + 1, 0);

    const cachedDesc = React.useRef("");
    const cachedOsName = React.useRef("");
    const cachedOsVersion = React.useRef("");

    // useEffect(() => {
    //   // Compare the current osName with the previous osName
    //   if (osName !== cachedOsName.current) {
    //     // Dispatch the action only if they are different
    //     dispatch({ type: "UPDATE_OS_NAME", osName });
    //   }
    //   console.log(osName);

    //   // Update the previous osName ref after each render
    //   cachedOsName.current = osName;
    // }, [selectedOs]);

    // useEffect(() => {
    //   cachedOsName.current = osName;
    //   cachedDesc.current = osDesc;
    //   cachedOsVersion.current = osVersions[0];

    //   console.log(cachedOsName);
    // }, []);

    const theme = useTheme();

    const handleChangeOS = (event: ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      event.stopPropagation();
      // setSelectedOs(event.target.value);

      dispatch({ type: "UPDATE_OS_NAME", osName: event.target.value });

      // forceUpdate();
    };

    const selectOsVersion = (event: ChangeEvent<HTMLSelectElement>) => {
      event.preventDefault();
      // if (cachedOsName.current != osName) {
      // cachedOsVersion.current = "";
      // } else {
      cachedOsVersion.current = event.target.value;
      cachedDesc.current = replaceDesc(event.target.value);
      // dispatch({ type: "UPDATE_OS_VERSION", osVersion: event.target.value });
      console.log(cachedOsVersion.current);
      console.log(cachedDesc.current);
      // dispatch({
      //   type: "UPDATE_OS_DESC",
      //   osDesc: replaceDesc(event.target.value),
      // });
      forceUpdate();
      // }
      // setOsVersion(event.target.value);
    };

    useEffect(() => {
      // This effect runs after every render
      console.log("rendering OperationSystems...");
      return () => {
        console.log("unmounting Operation..");
      };
    });

    const replaceDesc = (osVersion: string) => {
      if (
        cachedDesc.current != "" &&
        !cachedDesc.current.includes(cachedOsVersion.current)
      ) {
        const replacedDesc = osDesc.replace("<version>", osVersion);
        // setOsDesc(replacedDesc);
        cachedDesc.current = replacedDesc;
        return replacedDesc;
      }

      const replacedDesc = osDesc.replace(cachedOsVersion.current, osVersion);
      // setOsDesc(replacedDesc);
      cachedDesc.current = replacedDesc;

      return replacedDesc;
    };

    useEffect(() => {
      if (osDesc.includes("<version>")) {
        const replacedDesc = replaceDesc(osVersions[0]);
        cachedDesc.current = replacedDesc;
      }
      // forceUpdate();
    }, []);

    const OsVersionOptions = useMemo(
      () => (props: any) => {
        return (
          <>
            {React.createElement("option", { value: "" }, "")}
            {props.osVersions.map((version: string) => {
              return React.createElement("option", { value: version }, version);
            })}
          </>
        );
      },
      []
    );

    const OsDetails = useMemo(
      () => () => {
        console.log("rendered... OS DETAILS");
        return (
          <Box>
            <Typography sx={{ color: "text.secondary" }}>{osName}</Typography>
            <Typography variant="caption" sx={{ color: "text.disabled" }}>
              {cachedDesc.current != ""
                ? cachedDesc.current
                : osDesc.replace("<version>", osVersions[0])}
            </Typography>
          </Box>
        );
      },
      [cachedDesc.current]
    );

    const RenderBody = () => {
      return (
        <Box
          onClickCapture={(e: any) => {
            e.stopPropagation();
            if (state.osName !== osName) {
              cachedOsName.current == osName;
              dispatch({ type: "UPDATE_OS_NAME", osName: osName });
            }
            // e.stopPropagation();
            //When selecting all box to choose os is causing re rendering issue to version dropdown
            //and dropdown closes itself - you will need to click twice
            // setSelectedOs(osName);
            // setOsVersion(osVersion);
            // forceUpdate();
          }}
          sx={{
            mb: 6,
            backgroundColor:
              state.osName == osName
                ? theme.palette.background.default
                : "transparent",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            alignSelf: "center",
            p: "0.500em",
          }}
        >
          {/* <FormWrapperHook name="OsDetails"> */}
          <Grid container spacing={3}>
            <Grid item xs={8} sm={4}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <CustomAvatar
                  onClick={() => {}}
                  skin="light"
                  color="info"
                  variant="rounded"
                  sx={{ mr: 3, width: 48, height: 48 }}
                >
                  <img
                    width="48"
                    height="48"
                    style={{ background: "white" }}
                    src={osImage}
                    alt={`${cachedOsName.current} ${cachedOsVersion.current} operating system`}
                  />
                </CustomAvatar>
                <OsDetails />
              </Box>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  ml: 10,
                  alignItems: "flex-start",
                }}
              >
                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                  Version
                </InputLabel>

                <NativeSelect
                  {...register("osVersion", {
                    value: cachedOsVersion.current,
                    onchange: selectOsVersion,
                  })}
                  // value={cachedOsVersion}
                  defaultValue={
                    cachedOsVersion.current == "" &&
                    cachedOsName.current == state.osName
                      ? "1"
                      : cachedOsVersion.current
                  }
                  inputProps={{
                    name: "osVersion",
                    id: "uncontrolled-native",
                  }}
                  sx={{
                    width: "100%",
                  }}
                  onChange={(e) => {
                    e.preventDefault();
                    selectOsVersion(e);
                  }}
                  disabled={osName != state.osName}
                  aria-details="form-select"
                >
                  <OsVersionOptions osVersions={osVersions} />
                </NativeSelect>
              </Box>
            </Grid>
          </Grid>

          <Radio
            checked={state && state.osName === osName}
            // onChange={handleChangeOS}
            name="osName"
            {...register("osName", {
              value: osName,
              onChange: handleChangeOS,
            })}
          />
        </Box>
      );

      return <></>;
    };

    return <RenderBody />;
  };

  const NetworkDetails = () => {
    const maxAllowedIpv4: number = 16;
    const maxAllowedIpv6: number = 64;

    const renderIpOptions = (maxIP: number) => {
      return Array.from(Array(maxIP).keys()).map((key) => {
        return <option value={key}>{key}</option>;
      });
    };

    return (
      <Grid container spacing={0}>
        <Grid item xs={8} sm={3}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              // textAlign: "center",
              ml: 5,
              // alignSelf: "flex-end",
              // justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              IPV4 addresses
            </InputLabel>

            <NativeSelect
              defaultValue="1"
              inputProps={{
                name: "ipQnty",
                id: "uncontrolled-native",
              }}
              sx={
                {
                  // display: "flex",
                  // alignItems: "center",
                  // width: "100%",
                  // height: "auto",
                }
              }
            >
              {renderIpOptions(maxAllowedIpv4).map((option) => {
                return option;
              })}
            </NativeSelect>
          </Box>
        </Grid>
        <Grid item xs={8} sm={3}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              // textAlign: "center",
              ml: 5,
              // alignSelf: "flex-end",
              // justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              IPV6 addresses
            </InputLabel>

            <NativeSelect
              defaultValue="1"
              inputProps={{
                name: "ipQnty",
                id: "uncontrolled-native",
              }}

              // sx={{ display: "flex", alignItems: "center" }}
            >
              {renderIpOptions(maxAllowedIpv6).map((option) => {
                return option;
              })}
            </NativeSelect>
          </Box>
        </Grid>
      </Grid>
    );
  };

  const renderOperatingSystems = () => {
    return osList.map((os) => {
      return (
        <OperationSystems
          key={os.osName}
          osName={os.osName}
          osVersions={os.osVersions}
          osDesc={os.osDesc}
          osImage={os.osImage}
        />
      );
    });
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 4 }}>
        Virtual Machine details
      </Typography>
      <FormWrapperHook
        name={"FORM TO DO SMTH"}
        formHook={formHook}
        fields={["vmName", "rootPw", "osName", "osVersion"]}
      >
        <Box sx={{ mb: 8 }}>
          <TextField
            name="vmName"
            sx={{ mb: 4 }}
            label="Virtual machine name"
            placeholder=""
            aria-details="form-input"
          />

          <Typography variant="h6" sx={{ mb: 4 }}>
            Account details
          </Typography>

          <Grid container spacing={6}>
            <Grid item xs={8} sm={6}>
              <TextField
                name="rootPw"
                sx={{ mb: 4 }}
                label="Root Password"
                placeholder=""
                aria-details="form-input"
              />
            </Grid>
            {/* <Grid item xs={8} sm={3}>
            <TextField sx={{ mb: 4 }} label="Root Password" placeholder="" />
          </Grid>
          <Grid item xs={4} sm={3}>
            <TextField sx={{ mb: 4 }} label="Root Password" placeholder="" />
          </Grid> */}
          </Grid>

          <Typography variant="h6" sx={{ mb: 4 }}>
            Operating System Details
          </Typography>

          {renderOperatingSystems()}
          {/* <Typography variant="h6" sx={{ mb: 4 }}>
            Network Details
          </Typography> */}
          {/* <NetworkDetails></NetworkDetails> */}
        </Box>
      </FormWrapperHook>
    </Box>
  );
});

export default TabDetails;
