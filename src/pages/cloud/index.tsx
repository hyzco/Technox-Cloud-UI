import React, { useState, useEffect } from "react";
import router, { useRouter } from "next/router";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import ServerIcon from "@mui/icons-material/Storage";
import ContainerIcon from "@mui/icons-material/ViewInAr";
import VirtualMachineIcon from "@mui/icons-material/Computer";
import NetworkIcon from "@mui/icons-material/Hub";
import MemoryIcon from "@mui/icons-material/Memory";
import DiskIcon from "@mui/icons-material/Save";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { UrlObject } from "url";
import { useAuth } from "src/hooks/useAuth";
import { Button } from "@mui/material";

interface OverviewCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  onClick?: () => void;
  isLoading: boolean;
}

const OverviewCard = ({
  title,
  value,
  icon,
  onClick,
  isLoading,
}: OverviewCardProps) => {
  return (
    <Card
      sx={{ cursor: onClick ? "pointer" : "default", height: "100%" }}
      onClick={onClick}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          height: "100%",
        }}
      >
        {icon}
        <Typography variant="h6" sx={{ mt: 2 }}>
          {title}
        </Typography>
        {isLoading ? (
          <CircularProgress size={24} sx={{ mt: 1 }} />
        ) : (
          <Typography variant="h6" sx={{ mt: 1 }}>
            {value}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

const NoServers = () => {
  const router = useRouter();
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent
            sx={{
              pt: 20,
              textAlign: "center",
              pb: (theme) => `${theme.spacing(25)} !important`,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                mb: 2.5,
                color: "primary.main",
                fontWeight: 600,
                fontSize: "1.5rem !important",
              }}
            >
              You don't have any servers.
            </Typography>
            <Typography variant="body1" sx={{ mb: 6.5 }}>
              You can click the button bellow to create a new server.
            </Typography>
            <Button
              variant="outlined"
              // fullWidth
              style={
                {
                  // color: "#28a745",
                  // borderColor: "#28a745",
                }
              }
              onClick={() => {
                router.push(`/cloud/new`);
              }}
            >
              Create New Server
            </Button>
          </CardContent>
        </Card>
      </Grid>
      {/* <DialogCreateServer show={addUserOpen} toggle={toggleAddUserDrawer} /> */}
    </Grid>
  );
};

const formatUptime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds / 60) % 60);
  const remainingSeconds = seconds % 60;
  const hoursText = hours > 0 ? `${hours}h ` : "";
  return `${hoursText}${minutes}m ${remainingSeconds}s`;
};

const formatBytes = (bytes: number) => {
  const gigabytes = bytes / (1024 * 1024 * 1024);
  return `${gigabytes.toFixed(2)} GB`;
};

const CloudOverviewDashboard = () => {
  const { user } = useAuth();

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    nodes: 0,
    containers: 0,
    virtualMachines: 0,
    networks: 0,
    totalMemory: "0 GB",
    usedMemory: "0 GB",
    totalDisk: "0 GB",
    usedDisk: "0 GB",
    averageUptime: "0m 0s",
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "http://localhost:3001/cloud/dashboard/info"
      );
      const apiData = response.data;

      const totalMemory = apiData.memoryStats.reduce(
        (acc: number, node: { memory: { total: number } }) =>
          acc + node.memory.total,
        0
      );
      const usedMemory = apiData.memoryStats.reduce(
        (acc: number, node: { memory: { used: number } }) =>
          acc + node.memory.used,
        0
      );
      const totalDisk = apiData.diskStats.reduce(
        (acc: number, node: { disk: { total: number } }) =>
          acc + node.disk.total,
        0
      );
      const usedDisk = apiData.diskStats.reduce(
        (acc: number, node: { disk: { used: number } }) => acc + node.disk.used,
        0
      );
      const averageUptime = Math.floor(
        apiData.uptime.reduce(
          (acc: number, node: { uptime: number }) => acc + node.uptime,
          0
        ) / apiData.uptime.length
      );

      setData({
        nodes: apiData.nodeCount,
        containers: apiData.lxcCount,
        virtualMachines: apiData.qemuCount,
        networks: apiData.networkCount,
        totalMemory: formatBytes(totalMemory),
        usedMemory: formatBytes(usedMemory),
        totalDisk: formatBytes(totalDisk),
        usedDisk: formatBytes(usedDisk),
        averageUptime: formatUptime(averageUptime),
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const navigateTo = (path: string | UrlObject) => {
    router.push(path);
  };

  if (
    data.containers === 0 &&
    data.virtualMachines === 0 &&
    user?.role === "user"
  ) {
    return <NoServers />;
  }

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4">Cloud Overview </Typography>
      </Box>

      <Grid container spacing={3}>
        {user?.role === "admin" && (
          <Grid item xs={12} sm={6} md={3}>
            <OverviewCard
              title="Nodes"
              value={data.nodes.toString()}
              icon={<ServerIcon sx={{ fontSize: 40 }} />}
              onClick={() => navigateTo("/cloud/nodes")}
              isLoading={isLoading}
            />
          </Grid>
        )}
        <Grid item xs={12} sm={6} md={3}>
          <OverviewCard
            title="Containers"
            value={data.containers.toString()}
            icon={<ContainerIcon sx={{ fontSize: 40 }} />}
            onClick={() => navigateTo("/cloud/containers")}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <OverviewCard
            title="Virtual Machines"
            value={data.virtualMachines.toString()}
            icon={<VirtualMachineIcon sx={{ fontSize: 40 }} />}
            isLoading={isLoading}
          />
        </Grid>
        {user?.role === "admin" && (
          <Grid item xs={12} sm={6} md={3}>
            <OverviewCard
              title="Networks"
              value={data.networks.toString()}
              icon={<NetworkIcon sx={{ fontSize: 40 }} />}
              isLoading={isLoading}
              onClick={() => navigateTo("/cloud/nodes/network")}
            />
          </Grid>
        )}
        <Grid item xs={12} sm={6} md={3}>
          <OverviewCard
            title="Memory Usage"
            value={`${data.usedMemory} / ${data.totalMemory}`}
            icon={<MemoryIcon sx={{ fontSize: 40 }} />}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <OverviewCard
            title="Disk Usage"
            value={`${data.usedDisk} / ${data.totalDisk}`}
            icon={<DiskIcon sx={{ fontSize: 40 }} />}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <OverviewCard
            title="Average Uptime"
            value={data.averageUptime}
            icon={<AccessTimeIcon sx={{ fontSize: 40 }} />}
            isLoading={isLoading}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
CloudOverviewDashboard.acl = {
  action: "all",
  subject: "cloudOverviewDashboard",
};
export default CloudOverviewDashboard;
