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

const defaultCustomScript = '#!/bin/bash \n echo "Hello World from TheyCloud!"';

const DialogTabCustomScript = () => {
  const [customScript, setCustomScript] = useState<string>("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCustomScript(event.target.value);
  };

  return (
    <Box>
      <Typography variant="h6" sx={{}}>
        Custom Script Details
      </Typography>
      <Typography variant="body2" sx={{ mb: 8 }}>
        Failure during initialization when custom scripts setted is out of
        support scope.
      </Typography>
      <Box sx={{ mb: 8 }}>
        <TextField
          fullWidth
          sx={{ mb: 4 }}
          label="Customization script name"
          placeholder=""
        />

        <Typography variant="body2" sx={{ mt: 3, mb: 4 }}>
          Bash script to be executed during initialization.
        </Typography>
        <TextField
          fullWidth
          placeholder={defaultCustomScript}
          value={customScript}
          onChange={handleChange}
          multiline
          rows={14}
          maxRows={14}
        />

        <Grid container spacing={6}>
          {/* <Grid item xs={8} sm={3}>
            <TextField sx={{ mb: 4 }} label="Root Password" placeholder="" />
          </Grid>
          <Grid item xs={4} sm={3}>
            <TextField sx={{ mb: 4 }} label="Root Password" placeholder="" />
          </Grid> */}
        </Grid>
      </Box>
    </Box>
  );
};

export default DialogTabCustomScript;
