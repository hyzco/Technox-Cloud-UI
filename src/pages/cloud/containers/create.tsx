// THIS IS EXAMPLE FOR PRICING PER UNIT PER MONTH
import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Typography,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import useAxiosFunction from "src/@core/hooks/useAxiosFunction";
import { HTTP_METHOD } from "src/@core/enums/axios.enum";
import userConfig from "src/configs/user";
import axios from "axios";
import backendConfig from "src/configs/backendConfig";
import { useRouter } from "next/router";

const CreateVMDashboard = () => {
  const [config, setConfig] = useState({
    osType: "debian",
    osVersion: "12.2-1",
    arch: "amd64",
    cores: 1,
    memory: 1024,
    swap: 512,
    diskSize: 8,
  });

  const [price, setPrice] = useState(0);
  const router = useRouter();

  const { response, error, loading, axiosFetch } = useAxiosFunction() as any;
  const axiosInstance = axios.create({ baseURL: backendConfig.api });
  const storedToken = window.localStorage.getItem(
    userConfig.storageTokenKeyName
  )!;

  const handleChange = (name: string, value: string | number | number[]) => {
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  const calculatePrice = () => {
    // This is a simple pricing model. Adjust as needed.
    const corePrice = config.cores * 5;
    const memoryPrice = (config.memory / 1024) * 10;
    const diskPrice = config.diskSize * 0.1;
    return corePrice + memoryPrice + diskPrice;
  };

  useEffect(() => {
    setPrice(calculatePrice());
  }, [config]);

  const handleSubmit = () => {
    axiosFetch({
      axiosInstance,
      method: HTTP_METHOD.POST,
      url: "/server/prx/lxc/create",
      headers: { Authorization: storedToken },
      body: { ...config, password: "123456" }, // You might want to add a password field to the form
    });
  };

  useEffect(() => {
    // Redirect to the container details page after creating the VM
    if (!loading && !error && response) {
      if (response.id) {
        router.push(`/cloud/containers/${response.id}`);
      }
    }
  }, [response, loading, error]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={8}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            VM Configuration
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel>OS Type</InputLabel>
            <Select
              value={config.osType}
              onChange={(e) => handleChange("osType", e.target.value)}
            >
              <MenuItem value="debian">Debian</MenuItem>
              <MenuItem value="ubuntu">Ubuntu</MenuItem>
              <MenuItem value="centos">CentOS</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>OS Version</InputLabel>
            <Select
              value={config.osVersion}
              onChange={(e) => handleChange("osVersion", e.target.value)}
            >
              <MenuItem value="12.2-1">12.2-1</MenuItem>
              <MenuItem value="11.0">11.0</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Architecture</InputLabel>
            <Select
              value={config.arch}
              onChange={(e) => handleChange("arch", e.target.value)}
            >
              <MenuItem value="amd64">amd64</MenuItem>
              <MenuItem value="arm64">arm64</MenuItem>
            </Select>
          </FormControl>
          <Box mt={3}>
            <Typography gutterBottom>CPU Cores: {config.cores}</Typography>
            <Slider
              value={config.cores}
              onChange={(e, newValue) => handleChange("cores", newValue)}
              min={1}
              max={16}
              step={1}
              marks
              valueLabelDisplay="auto"
            />
          </Box>
          <Box mt={3}>
            <Typography gutterBottom>Memory (MB): {config.memory}</Typography>
            <Slider
              value={config.memory}
              onChange={(e, newValue) => handleChange("memory", newValue)}
              min={512}
              max={16384}
              step={512}
              marks
              valueLabelDisplay="auto"
            />
          </Box>
          <Box mt={3}>
            <Typography gutterBottom>Swap (MB): {config.swap}</Typography>
            <Slider
              value={config.swap}
              onChange={(e, newValue) => handleChange("swap", newValue)}
              min={0}
              max={8192}
              step={512}
              marks
              valueLabelDisplay="auto"
            />
          </Box>
          <Box mt={3}>
            <Typography gutterBottom>
              Disk Size (GB): {config.diskSize}
            </Typography>
            <Slider
              value={config.diskSize}
              onChange={(e, newValue) => handleChange("diskSize", newValue)}
              min={5}
              max={500}
              step={1}
              marks
              valueLabelDisplay="auto"
            />
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Pricing
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1">CPU: ${config.cores * 5}/mo</Typography>
            <Typography variant="body1">
              Memory: ${((config.memory / 1024) * 10).toFixed(2)}/mo
            </Typography>
            <Typography variant="body1">
              Disk: ${(config.diskSize * 0.1).toFixed(2)}/mo
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6">Total: ${price.toFixed(2)}/mo</Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create VM"}
            </Button>
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error.response.data}
              </Typography>
            )}
            {response && (
              <Typography color="success" sx={{ mt: 2 }}>
                VM created successfully!
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default CreateVMDashboard;

// import React, { useState } from 'react';
// import {
//   Grid, Paper, Typography, Tabs, Tab, Button, Checkbox,
//   RadioGroup, Radio, FormControlLabel, TextField, Box
// } from '@mui/material';

// const CreateVMDashboard = () => {
//   const [osType, setOsType] = useState('ubuntu');
//   const [osVersion, setOsVersion] = useState('22.10 x64');
//   const [cpuType, setCpuType] = useState('shared');
//   const [resourceProfile, setResourceProfile] = useState('basic');
//   const [selectedPlan, setSelectedPlan] = useState(0);
//   const [backupEnabled, setBackupEnabled] = useState(false);
//   const [authMethod, setAuthMethod] = useState('ssh');

//   const plans = [
//     { cpu: 1, ram: 1, storage: 25, priceHour: 0.010, priceMonth: 7 },
//     { cpu: 1, ram: 2, storage: 50, priceHour: 0.021, priceMonth: 14 },
//     // ... more plans
//   ];

//   return (
//     <Grid container spacing={2}>
//       <Grid item xs={12}>
//         <Paper elevation={3} sx={{ p: 3 }}>
//           <Typography variant="h5" gutterBottom>Choose an image</Typography>
//           {/* OS selection buttons here */}
//           {/* Version dropdown here */}
//         </Paper>
//       </Grid>

//       <Grid item xs={12}>
//         <Paper elevation={3} sx={{ p: 3 }}>
//           <Tabs value={cpuType} onChange={(e, newValue) => setCpuType(newValue)}>
//             <Tab label="SHARED CPU" value="shared" />
//             <Tab label="DEDICATED CPU" value="dedicated" />
//           </Tabs>

//           {cpuType === 'shared' && (
//             <>
//               <Tabs value={resourceProfile} onChange={(e, newValue) => setResourceProfile(newValue)}>
//                 <Tab label="Basic" value="basic" />
//                 <Tab label="General Purpose" value="general" />
//                 {/* More resource profile tabs */}
//               </Tabs>

//               <Grid container spacing={2} sx={{ mt: 2 }}>
//                 {plans.map((plan, index) => (
//                   <Grid item xs={12} sm={6} md={4} key={index}>
//                     <Paper
//                       elevation={selectedPlan === index ? 3 : 1}
//                       sx={{ p: 2, cursor: 'pointer' }}
//                       onClick={() => setSelectedPlan(index)}
//                     >
//                       <Typography variant="h6">${plan.priceMonth}/mo</Typography>
//                       <Typography variant="body2">${plan.priceHour}/hour</Typography>
//                       <Typography>{plan.cpu} CPU, {plan.ram} GB RAM, {plan.storage} GB SSD</Typography>
//                     </Paper>
//                   </Grid>
//                 ))}
//               </Grid>
//             </>
//           )}
//         </Paper>
//       </Grid>

//       <Grid item xs={12}>
//         <Paper elevation={3} sx={{ p: 3 }}>
//           <Typography variant="h6">Backups</Typography>
//           <FormControlLabel
//             control={<Checkbox checked={backupEnabled} onChange={(e) => setBackupEnabled(e.target.checked)} />}
//             label="Enable automated backup plan"
//           />
//         </Paper>
//       </Grid>

//       <Grid item xs={12}>
//         <Paper elevation={3} sx={{ p: 3 }}>
//           <Typography variant="h6">Choose Authentication Method</Typography>
//           <RadioGroup value={authMethod} onChange={(e) => setAuthMethod(e.target.value)}>
//             <FormControlLabel value="ssh" control={<Radio />} label="SSH Key" />
//             <FormControlLabel value="password" control={<Radio />} label="Password" />
//           </RadioGroup>
//           {authMethod === 'ssh' && (
//             <Box mt={2}>
//               {/* SSH key selection/input here */}
//             </Box>
//           )}
//           {authMethod === 'password' && (
//             <TextField
//               fullWidth
//               type="password"
//               label="Root Password"
//               variant="outlined"
//               margin="normal"
//             />
//           )}
//         </Paper>
//       </Grid>

//       <Grid item xs={12}>
//         <Button variant="contained" color="primary" fullWidth>
//           Create Droplet
//         </Button>
//       </Grid>
//     </Grid>
//   );
// };

// export default CreateVMDashboard;
