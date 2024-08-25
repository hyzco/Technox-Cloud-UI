// ** React Imports
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// ** MUI Imports
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

// ** Icons Imports
import ServerIcon from '@mui/icons-material/Storage';
import ContainerIcon from '@mui/icons-material/ViewInAr';
import VirtualMachineIcon from '@mui/icons-material/Computer';
import NetworkIcon from '@mui/icons-material/Hub';
import MemoryIcon from '@mui/icons-material/Memory';
import DiskIcon from '@mui/icons-material/Save';
import CpuIcon from '@mui/icons-material/Memory';

// ** Styled Component Import
import KeenSliderWrapper from "src/@core/styles/libs/keen-slider";
import ApexChartWrapper from "src/@core/styles/libs/react-apexcharts";
import { UrlObject } from 'url';

const OverviewCard = ({ title, value, icon, onClick }: { title: string, value: string, icon: JSX.Element, onClick?: () => void }) => {
  return (
    <Card sx={{ cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        {icon}
        <Typography variant="h6" sx={{ mt: 2 }}>{title}</Typography>
        <Typography variant="h4" sx={{ mt: 1 }}>{value}</Typography>
      </CardContent>
    </Card>
  );
};

const CloudOverviewDashboard = () => {
  const router = useRouter();
  const [data, setData] = useState({
    nodes: 0,
    activeNodes: 0,
    containers: 0,
    runningContainers: 0,
    virtualMachines: 0,
    runningVirtualMachines: 0,
    privateNetworkAdapters: 0,
    totalMemory: '0 GB',
    totalDisk: '0 GB',
    totalCPU: '0 cores'
  });

  useEffect(() => {
    // Fetch cloud overview data here
    setData({
      nodes: 10,
      activeNodes: 8,
      containers: 25,
      runningContainers: 20,
      virtualMachines: 15,
      runningVirtualMachines: 10,
      privateNetworkAdapters: 5,
      totalMemory: '128 GB',
      totalDisk: '2 TB',
      totalCPU: '32 cores'
    });
  }, []);

  const navigateTo = (path: string | UrlObject) => {
    router.push(path);
  };

  return (
    <ApexChartWrapper>
      <KeenSliderWrapper>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4">Cloud Overview Dashboard</Typography>
        </Box>
        <Grid container spacing={6} className="match-height">
          <Grid item xs={12} md={4}>
            <OverviewCard 
              title="Nodes" 
              value={`${data.activeNodes} / ${data.nodes}`} 
              icon={<ServerIcon sx={{ fontSize: 40 }} />}
              onClick={() => navigateTo('/cloud/nodes')}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <OverviewCard 
              title="Containers" 
              value={`${data.runningContainers} / ${data.containers}`} 
              icon={<ContainerIcon sx={{ fontSize: 40 }} />}
              onClick={() => navigateTo('/cloud/containers')}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <OverviewCard 
              title="Virtual Machines" 
              value={`${data.runningVirtualMachines} / ${data.virtualMachines}`} 
              icon={<VirtualMachineIcon sx={{ fontSize: 40 }} />}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <OverviewCard 
              title="Network Adapters" 
              value={data.privateNetworkAdapters.toString()} 
              icon={<NetworkIcon sx={{ fontSize: 40 }} />}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <OverviewCard 
              title="Memory in Use" 
              value={data.totalMemory} 
              icon={<MemoryIcon sx={{ fontSize: 40 }} />}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <OverviewCard 
              title="Disk in Use" 
              value={data.totalDisk} 
              icon={<DiskIcon sx={{ fontSize: 40 }} />}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <OverviewCard 
              title="CPU in Use" 
              value={data.totalCPU} 
              icon={<CpuIcon sx={{ fontSize: 40 }} />}
            />
          </Grid>
        </Grid>
      </KeenSliderWrapper>
    </ApexChartWrapper>
  );
};

CloudOverviewDashboard.acl = {
  action: "read",
  subject: "cloud-dashboard",
};

export default CloudOverviewDashboard;