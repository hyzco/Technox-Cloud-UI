import { useState, useEffect, useCallback } from "react";
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
  Link,
} from "@mui/material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
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
import { LoadingButton } from "@mui/lab";
import NetworkInfoCard from "src/@core/components/cloud/NetworkInfoCard";
import StopIcon from "@mui/icons-material/Stop";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { ArrowLeft } from "mdi-material-ui";
import { useRouter } from "next/router";
import { useAuth } from "src/hooks/useAuth";

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
  const { user } = useAuth();
  const [containerData, setContainerData] = useState<Container[]>([]);
  const [expandedNode, setExpandedNode] = useState<string | true | false>(true);
  const [ctId, setCtId] = useState<number>(-1);
  const [loadingAction, setLoadingAction] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const axiosInstance = axios.create({ baseURL: backendConfig.api });
  const storedToken = window.localStorage.getItem(
    userConfig.storageTokenKeyName
  )!;

  const fetchContainers = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/server/prx/lxc/list/all", {
        headers: { Authorization: storedToken },
      });
      setContainerData(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [axiosInstance, storedToken]);

  useEffect(() => {
    fetchContainers();
  }, []);

  const handleNodeExpand =
    (node: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedNode(isExpanded ? node : true);
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

  const ContainerRow = ({ container }: { container: Container }) => {
    const { response, error, loading, axiosFetch } = useAxiosFunction() as any;

    const [open, setOpen] = useState(false);
    const [openRemoveDialog, setOpenRemoveDialog] = useState(false);
    const [confirmHostname, setConfirmHostname] = useState("");

    const handleAction = async (action: string, vmid: number) => {
      setCtId(vmid);
      setLoadingAction(true);
      try {
        await axiosFetch({
          axiosInstance,
          method: HTTP_METHOD.POST,
          url: `/server/prx/lxc/${action}`,
          headers: { Authorization: storedToken },
          body: { vmid },
        });
        setContainerData((prevData) =>
          prevData.map((c) =>
            c.vmid === vmid
              ? { ...c, status: action === "stop" ? "stopped" : "running" }
              : c
          )
        );
      } catch (error) {
        console.error(`Failed to ${action} container:`, error);
      } finally {
        setLoadingAction(false);
        setCtId(-1);
      }
    };

    useEffect(() => {
      console.log("Container ID: " + ctId);
    }, [ctId]);

    const handleRemove = async (vmId: number) => {
      console.log("Removing container with ID: " + vmId);
      if (confirmHostname === container.hostname) {
        try {
          axiosInstance.delete("/server/prx/lxc/remove", {
            headers: { Authorization: storedToken },
            data: { vmid: vmId },
          });
          setContainerData((prevData) =>
            prevData.filter((c) => c.vmid !== vmId)
          );
          // await axiosFetch({
          //   axiosInstance,
          //   method: HTTP_METHOD.DELETE,
          //   url: `/server/prx/lxc/remove`,
          //   headers: { Authorization: storedToken },
          //   body: { vmid: vmId },
          // });
          // setContainerData((prevData) =>
          //   prevData.filter((c) => c.vmid !== vmId)
          // );
        } catch (error) {
          console.error(`Failed to remove container:`, error);
        } finally {
          setOpenRemoveDialog(false);
          setConfirmHostname("");
        }
      }
    };

    if (error) {
      return <Alert severity="error">{error.message}</Alert>;
    }

    return (
      <>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {loading && container.vmid == ctId ? (
                <CircularProgress size={10} />
              ) : open ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            <Link href={`/cloud/containers/${container.vmid}`}>
              {container.vmid}
            </Link>
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
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => handleAction("stop", container.vmid)}
                  sx={{ mr: 1 }}
                >
                  <StopIcon />
                </IconButton>
                <IconButton
                  color="info"
                  size="small"
                  onClick={() => handleAction("restart", container.vmid)}
                  sx={{ mr: 1 }}
                >
                  <RestartAltIcon />
                </IconButton>
              </>
            ) : (
              <>
                <IconButton
                  color="success"
                  size="small"
                  onClick={() => handleAction("start", container.vmid)}
                  sx={{ mr: 1 }}
                >
                  <PlayArrowIcon />
                </IconButton>
              </>
            )}
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => setOpenRemoveDialog(true)}
            >
              Remove
            </Button>
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
        <Dialog
          open={openRemoveDialog}
          onClose={() => setOpenRemoveDialog(false)}
        >
          <DialogTitle>Confirm Container Removal</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {container.status === "running"
                ? "The container is currently running. \n Turn it off first."
                : `Are you sure you want to remove this container? This action cannot
              be undone. Please type the container's hostname "${container.hostname}" to confirm.`}
            </DialogContentText>
            {container.status !== "running" && (
              <TextField
                autoFocus
                margin="dense"
                label="Hostname"
                fullWidth
                variant="outlined"
                value={confirmHostname}
                onChange={(e) => setConfirmHostname(e.target.value)}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenRemoveDialog(false)} color="primary">
              Cancel
            </Button>
            {container.status !== "running " && (
              <Button
                onClick={() => handleRemove(container.vmid)}
                color="error"
                disabled={confirmHostname !== container.hostname}
              >
                Remove
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </>
    );
  };

  if (loading && !loadingAction) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        alignContent="center"
        style={{ marginBottom: "1rem" }}
      >
        <CircularProgress
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            justifySelf: "center",
            // height: "100vh",
            // width: "50%",
          }}
        />
      </Grid>
    );
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  const groupedContainers = groupContainersByNode();
  const router = useRouter();
  const createUrl = () => {
    return user?.role === "admin" ? "/cloud/containers/create" : "/cloud/new";
  };
  return (
    <ApexChartWrapper>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        style={{ marginBottom: "1rem" }}
      >
        <Grid item>
          <IconButton
            color="inherit"
            aria-haspopup="true"
            onClick={() => router.push("/cloud")}
          >
            <ArrowLeft />
          </IconButton>
        </Grid>
        <Grid item>
          <Button href={createUrl()} style={{ marginTop: "1rem" }}>
            New
          </Button>
        </Grid>
      </Grid>
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

      {user?.role === "admin" && (
        <AggregatedMetrics containerData={containerData} />
      )}
    </ApexChartWrapper>
  );
};

export default ContainerDashboard;
