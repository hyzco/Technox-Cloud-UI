// ** React Imports
import {
  useState,
  useEffect,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactFragment,
  ReactPortal,
  useMemo,
  useCallback,
} from "react";

// ** MUI Imports
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

// ** Third Party Imports
import { ApexOptions } from "apexcharts";
import ReactApexcharts from "src/@core/components/react-apexcharts";

// ** Styled Component Import
import ApexChartWrapper from "src/@core/styles/libs/react-apexcharts";
import useAxiosFunction from "src/@core/hooks/useAxiosFunction";
import vmApi from "src/@core/apis/vmApi";
import { HTTP_METHOD } from "src/@core/enums/axios.enum";
import userConfig from "src/configs/user";
import Logout from "src/pages/auth/logout";

import axios from "axios";
import backendConfig from "src/configs/backendConfig";
import { IconButton } from "@mui/material";
import { ArrowLeft } from "mdi-material-ui";
import { useRouter } from "next/router";

const CPUUsageChart = ({ cpuUsage, nodeNames }: any) => {
  const options: ApexOptions = {
    chart: { type: "line" },
    series: [{ name: "CPU Usage", data: cpuUsage }],
    xaxis: { categories: nodeNames },
    yaxis: {
      title: {
        text: "CPU Usage (%)",
      },
      min: 0,
      max: 100,
    },
    annotations: {
      yaxis: [
        {
          y: 75,
          borderColor: "#FF0000",
          label: {
            borderColor: "#FF0000",
            style: {
              color: "#fff",
              background: "#FF0000",
            },
            text: "High Usage",
          },
        },
      ],
    },
  };

  return (
    <ReactApexcharts
      options={options}
      series={options.series}
      type="line"
      height={350}
    />
  );
};

const MemoryUsageChart = ({ memoryUsage, nodeNames }: any) => {
  const options: ApexOptions = {
    chart: { type: "area" },
    series: [{ name: "Memory Usage", data: memoryUsage }],
    xaxis: { type: "category", categories: nodeNames },
    yaxis: {
      title: {
        text: "Memory Usage (%)",
      },
      min: 0,
      max: 100,
    },
    annotations: {
      yaxis: [
        {
          y: 75,
          borderColor: "#FF0000",
          label: {
            borderColor: "#FF0000",
            style: {
              color: "#fff",
              background: "#FF0000",
            },
            text: "High Usage",
          },
        },
      ],
    },
  };

  return (
    <ReactApexcharts
      options={options}
      series={options.series}
      type="area"
      height={350}
    />
  );
};

const DiskUsageChart = ({ diskUsage }: any) => {
  const options: ApexOptions = {
    chart: { type: "pie" },
    series: diskUsage,
    labels: ["Used Disk", "Free Disk"],
  };

  return (
    <ReactApexcharts
      options={options}
      series={diskUsage}
      type="pie"
      height={350}
    />
  );
};

const NetworkTrafficChart = ({ networkTraffic, nodeNames }: any) => {
  const options: ApexOptions = {
    chart: { type: "bar" },
    series: [
      { name: "Inbound", data: networkTraffic.inbound },
      { name: "Outbound", data: networkTraffic.outbound },
    ],
    xaxis: { categories: nodeNames },
  };

  return (
    <ReactApexcharts
      options={options}
      series={options.series}
      type="bar"
      height={350}
    />
  );
};

const NodeList = ({ nodes }: any) => (
  <TableContainer component={Paper}>
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>Node</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Uptime (seconds)</TableCell>
          <TableCell>Memory Used</TableCell>
          <TableCell>CPU Usage (%)</TableCell>
          <TableCell>Disk Used</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {nodes.map((node: any) => (
          <TableRow key={node.id}>
            <TableCell component="th" scope="row">
              {node.node}
            </TableCell>
            <TableCell>{node.status}</TableCell>
            <TableCell>{node.uptime}</TableCell>
            <TableCell>
              {((node.mem / node.maxmem) * 100).toFixed(2)}% (
              {node.mem.toLocaleString()} of {node.maxmem.toLocaleString()}{" "}
              bytes)
            </TableCell>
            <TableCell>{(node.cpu * 100).toFixed(2)}%</TableCell>
            <TableCell>
              {((node.disk / node.maxdisk) * 100).toFixed(2)}% (
              {node.disk.toLocaleString()} of {node.maxdisk.toLocaleString()}{" "}
              bytes)
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const NodeDashboard = () => {
  // Destructure the hook's returned values
  const { response, error, loading, axiosFetch } = useAxiosFunction();

  // Optional: Initialize Axios instance (if not using a global instance)
  const axiosInstance = axios.create({
    baseURL: backendConfig.api,
  });
  const storedToken = window.localStorage.getItem(
    userConfig.storageTokenKeyName
  )!;

  // Function to trigger the API call
  const fetchData = () => {
    axiosFetch({
      axiosInstance, // Axios instance
      method: HTTP_METHOD.GET, // HTTP method
      url: "/server/prx/node/list/all", // API endpoint
      headers: {
        Authorization: storedToken,
      },
    });
  };

  // Trigger fetchData when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  const [nodes, setNodes] = useState<any[]>(response?.nodes || []);
  const [cpuUsage, setCpuUsage] = useState<any>([]);
  const [memoryUsage, setMemoryUsage] = useState<any>([]);
  const [diskUsage, setDiskUsage] = useState<any>([]);
  const [networkTraffic, setNetworkTraffic] = useState<any>({
    inbound: [],
    outbound: [],
  });
  const [, setLoading] = useState(loading);
  const [, setError] = useState<string | null>(error);

  useEffect(() => {
    if (response) {
      setNodes(response.nodes);
    }
  }, [response]);

  const fetchDataAsync = useCallback(async () => {
    try {
      // Extracting and setting data for charts
      setCpuUsage(nodes.map((node: any) => (node.cpu * 100).toFixed(2)));
      setMemoryUsage(
        nodes.map((node: any) => ((node.mem / node.maxmem) * 100).toFixed(2))
      );
      setDiskUsage([
        nodes.reduce((acc: number, node: any) => acc + node.disk, 0), // Used Disk
        nodes.reduce(
          (acc: number, node: any) => acc + (node.maxdisk - node.disk),
          0
        ), // Free Disk
      ]);
      setNetworkTraffic({
        inbound: nodes.map(() => Math.random() * 100), // Mock data, replace with actual
        outbound: nodes.map(() => Math.random() * 100), // Mock data, replace with actual
      });

      setLoading(false);
    } catch (err) {
      setError("Failed to fetch data");
      setLoading(false);
    }
  }, [nodes]);

  useEffect(() => {
    fetchDataAsync();
  }, [fetchDataAsync]);

  const nodeNames = useMemo(() => nodes.map((node: any) => node.node), [nodes]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }
  const router = useRouter()

  return (
    <ApexChartWrapper>
         <IconButton
        color="inherit"
        aria-haspopup="true"
        style={{ marginBottom: "1rem" }}
        onClick={() => router.push("/cloud")}
      >
        <ArrowLeft />
      </IconButton>
      <Grid container spacing={6} className="match-height">
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Node List</Typography>
              <NodeList nodes={nodes} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">CPU Usage</Typography>
              <CPUUsageChart cpuUsage={cpuUsage} nodeNames={nodeNames} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Memory Usage</Typography>
              <MemoryUsageChart
                memoryUsage={memoryUsage}
                nodeNames={nodeNames}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Disk Usage</Typography>
              <DiskUsageChart diskUsage={diskUsage} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Network Traffic</Typography>
              <NetworkTrafficChart
                networkTraffic={networkTraffic}
                nodeNames={nodeNames}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ApexChartWrapper>
  );
};

NodeDashboard.acl = {
  action: "read",
  subject: "dashboard",
};

export default NodeDashboard;
