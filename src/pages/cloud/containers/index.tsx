import { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Box,
  Collapse,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RefreshIcon from "@mui/icons-material/Refresh";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import useAxiosFunction from "src/@core/hooks/useAxiosFunction";
import { HTTP_METHOD } from "src/@core/enums/axios.enum";
import userConfig from "src/configs/user";
import axios from "axios";
import backendConfig from "src/configs/backendConfig";
import ApexChartWrapper from "src/@core/styles/libs/react-apexcharts";

interface Container {
  node: string;
  vmid: number;
  status: string;
  hostname: string;
  memory: number;
  swapMemory: number;
  cores: number;
  ostype: string;
  arch: string;
  network: NetworkInfo[];
  disk: string;
}

interface NetworkInfo {
  name: string;
  bridge: string;
  ip: string;
  gw: string;
  hwaddr: string;
  firewall: string;
}

const parseNetworkInfo = (networkInfo: any) => {
  if (typeof networkInfo !== "object" || networkInfo === null) {
    return [];
  }

  return Object.keys(networkInfo)
    .filter((key) => key.startsWith("net"))
    .map((key) => {
      const netData = networkInfo[key];
      const network = Object.fromEntries(
        netData.split(",").map((item: string) => item.split("="))
      );
      return {
        name: network.name,
        bridge: network.bridge,
        ip: network.ip,
        gw: network.gw,
        hwaddr: network.hwaddr,
        firewall: network.firewall,
      };
    });
};
const NetworkInfoCard = ({ networkInfo }: { networkInfo: any }) => {
  // Parse the networkInfo using the custom function
  const validNetworkInfo = parseNetworkInfo(networkInfo);

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Network Details
        </Typography>
        <Grid container spacing={1} alignItems="center">
          {validNetworkInfo.map((network, index) => (
            <Grid container item xs={12} spacing={2} key={index}>
              <Grid item xs={2}>
                <Typography variant="subtitle2" color="primary">
                  Interface
                </Typography>
                <Typography variant="body2">{network.name}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="subtitle2" color="primary">
                  Bridge
                </Typography>
                <Typography variant="body2">{network.bridge}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="subtitle2" color="primary">
                  IP Address
                </Typography>
                <Typography variant="body2">{network.ip}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="subtitle2" color="primary">
                  Gateway
                </Typography>
                <Typography variant="body2">{network.gw}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="subtitle2" color="primary">
                  MAC Address
                </Typography>
                <Typography variant="body2">{network.hwaddr}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="subtitle2" color="primary">
                  Firewall
                </Typography>
                <Chip
                  label={network.firewall === "0" ? "Disabled" : "Enabled"}
                  color={network.firewall === "0" ? "error" : "success"}
                  size="small"
                />
              </Grid>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

// New Metrics Component
const AggregatedMetrics = ({
  containerData,
}: {
  containerData: Container[];
}) => {
  const totalCores = containerData.reduce(
    (sum, container) => sum + container.cores,
    0
  );
  const totalMemory = containerData.reduce(
    (sum, container) => sum + container.memory,
    0
  );
  const totalDisk = containerData.reduce(
    (sum, container) => sum + parseFloat(container.disk),
    0
  );

  return (
    <Card sx={{ mt: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Aggregated Metrics
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle2" color="primary">
              Total Cores
            </Typography>
            <Typography variant="body1">{totalCores}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle2" color="primary">
              Total Memory
            </Typography>
            <Typography variant="body1">{`${totalMemory} MB`}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle2" color="primary">
              Total Disk Usage
            </Typography>
            <Typography variant="body1">{`${totalDisk.toFixed(
              2
            )} GB`}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const ContainerDashboard = () => {
  const { response, error, loading, axiosFetch } = useAxiosFunction() as any;

  const [containerData, setContainerData] = useState<Container[]>([]);
  const [expandedNode, setExpandedNode] = useState<string | false>(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const axiosInstance = axios.create({ baseURL: backendConfig.api });
  const storedToken = window.localStorage.getItem(
    userConfig.storageTokenKeyName
  )!;

  const fetchData = () => {
    axiosFetch({
      axiosInstance,
      method: HTTP_METHOD.GET,
      url: "/server/prx/lxc/list/all",
      headers: { Authorization: storedToken },
    });
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  useEffect(() => {
    if (response && Array.isArray(response)) {
      setContainerData(response);
    }
  }, [response]);

  const handleNodeExpand =
    (node: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedNode(isExpanded ? node : false);
    };

  const groupContainersByNode = () => {
    const grouped: { [key: string]: Container[] } = {};
    if (!containerData) return grouped;
    containerData.forEach((container: Container) => {
      if (!grouped[container.node]) {
        grouped[container.node] = [];
      }
      grouped[container.node].push(container);
    });
    return grouped;
  };

  const getStatusColor = (active: boolean) => (active ? "success" : "error");
  const getStatusLabel = (active: boolean) => (active ? "Running" : "Stopped");

  const handleStopContainer = async (vmid: number) => {
    try {
      await axiosFetch({
        axiosInstance,
        method: HTTP_METHOD.POST,
        url: `/server/prx/lxc/stop`,
        headers: { Authorization: storedToken },
        body: { vmid },
      });
      setContainerData((prevData) =>
        prevData.map((container) =>
          container.vmid === vmid
            ? { ...container, status: "stopped" }
            : container
        )
      );
    } catch (error) {
      console.error("Failed to stop container:", error);
    }
  };

  const handleStartContainer = async (vmid: number) => {
    try {
      await axiosFetch({
        axiosInstance,
        method: HTTP_METHOD.POST,
        url: `/server/prx/lxc/start`,
        headers: { Authorization: storedToken },
        body: { vmid },
      });
      setContainerData((prevData) =>
        prevData.map((container) =>
          container.vmid === vmid
            ? { ...container, status: "running" }
            : container
        )
      );
    } catch (error) {
      console.error("Failed to start container:", error);
    }
  };

  const handleRestartContainer = async (vmid: number) => {
    try {
      await axiosFetch({
        axiosInstance,
        method: HTTP_METHOD.POST,
        url: `/server/prx/lxc/restart`,
        headers: { Authorization: storedToken },
        body: { vmid },
      });
      setContainerData((prevData) =>
        prevData.map((container) =>
          container.vmid === vmid
            ? { ...container, status: "running" }
            : container
        )
      );
    } catch (error) {
      console.error("Failed to restart container:", error);
    }
  };

  const ContainerRow = ({ container }: { container: Container }) => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {loading ? (
                <CircularProgress size={10} />
              ) : open ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {container.vmid}
          </TableCell>
          <TableCell>{container.hostname}</TableCell>
          <TableCell align="right">{container.cores}</TableCell>
          <TableCell align="right">{container.memory}</TableCell>
          <TableCell align="right">{container.swapMemory}</TableCell>
          <TableCell align="right">{container.disk}</TableCell>
          <TableCell align="right">
            <Chip
              label={getStatusLabel(container.status === "running")}
              color={getStatusColor(container.status === "running")}
            />
          </TableCell>
          <TableCell align="right">
            {container.status === "running" ? (
              <>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => handleStopContainer(container.vmid)}
                  sx={{ mr: 1 }}
                >
                  Stop
                </Button>
                <Button
                  variant="outlined"
                  color="info"
                  size="small"
                  onClick={() => handleRestartContainer(container.vmid)}
                >
                  Restart
                </Button>
              </>
            ) : (
              <Button
                variant="outlined"
                color="success"
                size="small"
                onClick={() => handleStartContainer(container.vmid)}
              >
                Start
              </Button>
            )}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <NetworkInfoCard networkInfo={container.network} />
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  };

  // if (loading) {
  //   return <CircularProgress />;
  // }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  const groupedContainers = groupContainersByNode();

  return (
    <ApexChartWrapper>
      <Grid container spacing={3}>
        {Object.keys(groupedContainers).map((node) => (
          <Grid item xs={12} key={node}>
            <Accordion
              expanded={expandedNode === node}
              onChange={handleNodeExpand(node)}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{node}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell />
                        <TableCell>VMID</TableCell>
                        <TableCell>Hostname</TableCell>
                        <TableCell align="right">Cores</TableCell>
                        <TableCell align="right">Memory (MB)</TableCell>
                        <TableCell align="right">Swap (MB)</TableCell>
                        <TableCell align="right">Disk (GB)</TableCell>
                        <TableCell align="right">Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {groupedContainers[node].map((container) => (
                        <ContainerRow
                          key={container.vmid}
                          container={container}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          </Grid>
        ))}
      </Grid>
      <AggregatedMetrics containerData={containerData} />
    </ApexChartWrapper>
  );
};

export default ContainerDashboard;
