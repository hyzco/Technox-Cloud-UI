// ** React Imports
import {
  useState,
  ChangeEvent,
  SyntheticEvent,
  useEffect,
  useMemo,
  useLayoutEffect,
} from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Radio from "@mui/material/Radio";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

// ** Icons Imports
import LicenseIcon from "mdi-material-ui/LicenseIcon";
import CartOutline from "mdi-material-ui/CartOutline";
import BriefcaseOutline from "mdi-material-ui/BriefcaseOutline";

// ** Custom Avatar Component
import CustomAvatar from "src/@core/components/mui/avatar";
import Grid from "@mui/material/Grid";
import NativeSelect from "@mui/material/NativeSelect";
import InputLabel from "@mui/material/InputLabel";
import { Key } from "mdi-material-ui";
import React from "react";
import { ThemeColor } from "src/@core/layouts/types";
import { useTheme } from "@mui/material/styles";

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

const TabDetails = React.memo((propsDetails: IDetailsProps) => {
  useEffect(() => {
    // This effect runs after every render
    console.log("rendering TabDetails...");
  });

  const OperationSystems = React.memo((props: renderOsProps) => {
    const [osVersion, setOsVersion] = useState<string>("");
    let { osName, osVersions, osDesc, osImage } = props;
    const [desc, setOsDesc] = useState<string>(osDesc);
    const [selectedOs, setSelectedOs] = useState<string>("");

    const theme = useTheme();

    const handleChangeOS = (event: ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      console.log(event);
      setSelectedOs(event.target.value);
    };

    const selectOsVersion = (event: ChangeEvent<HTMLSelectElement>) => {
      event.preventDefault();
      console.log(event.target.value);
      setOsVersion(event.target.value);
    };

    useEffect(() => {
      // This effect runs after every render
      console.log("rendering OperationSystems...");
      return () => {
        // setSelectedOs("");
        console.log("unmounting Operation..");
      };
    });

    const replaceDesc = (osVersion: string) => {
      const replacedDesc = osDesc.replace("<version>", osVersion);
      setOsDesc(replacedDesc);
      // return replacedDesc;
    };

    useEffect(() => {
      if (osDesc.includes("<version>")) {
        replaceDesc(osVersions[0]);
      }
      setSelectedOs("");
    }, []);

    useLayoutEffect(() => {
      // setSelectedOs(osName);
      replaceDesc(osVersion);
    }, [osVersion]);

    useEffect(() => {
      if (osVersion && selectedOs) {
        console.log(osVersion);
        console.log(selectedOs);
      }
    }, [osVersion, selectedOs]);

    const OperatingSystem = React.memo((props: any) => {
      return (
        <>
          {props.osVersions.map((version: string) => {
            return React.createElement("option", { value: version }, version);
          })}
        </>
      );
    });

    return (
      <Box
        onChange={() => {
          // setSelectedOs(osName);
          // setOsVersion(osVersion);
        }}
        sx={{
          mb: 6,
          backgroundColor:
            selectedOs == osName
              ? theme.palette.background.default
              : "transparent",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          alignSelf: "center",
          p: "0.500em",
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={8} sm={4}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <CustomAvatar
                onClick={() => setSelectedOs(osName)}
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
                  alt={`${osName} ${osVersion} operating system`}
                />
              </CustomAvatar>
              <Box>
                <Typography sx={{ color: "text.secondary" }}>
                  {osName}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.disabled" }}>
                  {desc}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                // textAlign: "center",
                ml: 10,
                // alignSelf: "flex-end",
                // justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Version
              </InputLabel>

              <NativeSelect
                value={osVersion}
                inputProps={{
                  name: "osVersion",
                  id: "uncontrolled-native",
                }}
                sx={{
                  width: "100%",
                }}
                onChange={selectOsVersion}
                // sx={{ display: "flex", alignItems: "center" }}
              >
                <OperatingSystem osVersions={osVersions} />
              </NativeSelect>
            </Box>
          </Grid>
        </Grid>

        <Radio
          value={osName}
          onChange={handleChangeOS}
          checked={selectedOs === osName}
        />
      </Box>
    );
  });

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
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 4 }}>
        Virtual Machine details
      </Typography>
      <Box sx={{ mb: 8 }}>
        <TextField
          fullWidth
          sx={{ mb: 4 }}
          label="Virtual machine name"
          placeholder=""
        />

        <Typography variant="h6" sx={{ mb: 4 }}>
          Account details
        </Typography>
        <Grid container spacing={6}>
          <Grid item xs={8} sm={6}>
            <TextField sx={{ mb: 4 }} label="Root Password" placeholder="" />
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
        {osList.map((os) => {
          return (
            <OperationSystems
              key={os.osName}
              osName={os.osName}
              osVersions={os.osVersions}
              osDesc={os.osDesc}
              osImage={os.osImage}
            />
          );
        })}

        <Typography variant="h6" sx={{ mb: 4 }}>
          Network Details
        </Typography>
        <NetworkDetails></NetworkDetails>
      </Box>
    </Box>
  );
});

export default TabDetails;
