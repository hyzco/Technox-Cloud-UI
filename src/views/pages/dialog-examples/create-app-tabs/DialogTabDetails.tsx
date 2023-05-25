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

const TabDetails = () => {
  const [value, setValue] = useState<string>("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const OperationSystems = (props: renderOsProps) => {
    let { osName, osVersions, osDesc, osImage } = props;
    const [osVersion, setOsVersion] = useState<string>(osVersions[0]);
    const [desc, setOsDesc] = useState<string>("");

    const replaceDesc = (desc: string) => {
      const replacedDesc = desc.replace("<version>", osVersion);
      return replacedDesc;
    };

    useLayoutEffect(() => {
      const replacedDesc = replaceDesc(osDesc);
      setOsDesc(replacedDesc);
    }, [osVersion]);

    const selectOsVersion = (event: ChangeEvent<HTMLSelectElement>) => {
      event.preventDefault();
      setOsVersion(event.target.value);
    };

    return (
      <Box
        onClick={() => setValue(osName)}
        sx={{
          mb: 6,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
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
                skin="light"
                color="info"
                variant="rounded"
                sx={{ mr: 3, width: 48, height: 48 }}
              >
                <img
                  width="48"
                  height="48"
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
                defaultValue={osVersion}
                inputProps={{
                  name: "osVersion",
                  id: "uncontrolled-native",
                }}
                onChange={selectOsVersion}
                // sx={{ display: "flex", alignItems: "center" }}
              >
                {osVersions.map((version) => {
                  return <option value={version}>{version}</option>;
                })}
              </NativeSelect>
            </Box>
          </Grid>
        </Grid>

        <Radio
          value={osName}
          onChange={handleChange}
          checked={value === osName}
        />
      </Box>
    );
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

              // sx={{ display: "flex", alignItems: "center" }}
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
};

export default TabDetails;
