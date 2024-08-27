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
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Button,
  Box,
  TextField,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import { useRouter } from "next/router";
import useAxiosFunction from "src/@core/hooks/useAxiosFunction";
import { HTTP_METHOD } from "src/@core/enums/axios.enum";
import userConfig from "src/configs/user";
import axios from "axios";
import backendConfig from "src/configs/backendConfig";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import NetworkInfoCard from "src/@core/components/cloud/NetworkInfoCard";
import { ArrowLeft } from "mdi-material-ui";

interface ContainerData {
  mem: number;
  type: string;
  maxmem: number;
  vmid: number;
  disk: number;
  diskwrite: number;
  name: string;
  swap: number;
  diskread: number;
  uptime: number;
  maxdisk: number;
  cpu: number;
  ha: { managed: number };
  netin: number;
  cpus: number;
  netout: number;
  maxswap: number;
  status: string;
  network: Array<any>;
}

interface AxiosResponse {
  response: ContainerData | null;
  error: Error | null;
  loading: boolean;
  axiosFetch: (config: any) => void;
}

interface VNCResponse {
  vncUrl: string;
}

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = [
    "Bytes",
    "KiB",
    "MiB",
    "GiB",
    "TiB",
    "PiB",
    "EiB",
    "ZiB",
    "YiB",
  ];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const ResourceUsageBar: React.FC<{
  used: number;
  max: number;
  label: string;
}> = ({ used, max, label }) => {
  const percentage = (used / max) * 100;
  return (
    <Box sx={{ width: "100%", mb: 2 }}>
      <Typography variant="body2">{label}</Typography>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress variant="determinate" value={percentage} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography
            variant="body2"
            color="text.secondary"
          >{`${percentage.toFixed(1)}%`}</Typography>
        </Box>
      </Box>
      <Typography variant="caption">{`${formatBytes(used)} / ${formatBytes(
        max
      )}`}</Typography>
    </Box>
  );
};

const NetworkUsageDisplay: React.FC<{ netin: number; netout: number }> = ({
  netin,
  netout,
}) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Network Traffic
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box display="flex" alignItems="center">
              <ArrowDownwardIcon color="primary" />
              <Box ml={1}>
                <Typography variant="body2" color="textSecondary">
                  Network In
                </Typography>
                <Typography variant="h6">{formatBytes(netin)}/s</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box display="flex" alignItems="center">
              <ArrowUpwardIcon color="secondary" />
              <Box ml={1}>
                <Typography variant="body2" color="textSecondary">
                  Network Out
                </Typography>
                <Typography variant="h6">{formatBytes(netout)}/s</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const VNCView: React.FC<{ vmid: number }> = ({ vmid }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [vncUrl, setVncUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(false);
  const openFullConsole = () => {
    setIsFullscreen(true);
  };

  useEffect(() => {
    const fetchVncUrl = async () => {
      setLoading(true);
      setError(null);
      try {
        const storedToken =
          window.localStorage.getItem(userConfig.storageTokenKeyName) ?? "";
        const response = await axios.get<VNCResponse>(
          `${backendConfig.api}/server/prx/lxc/${vmid}/console`,
          {
            headers: { Authorization: storedToken },
          }
        );
        setVncUrl(response.data.vncUrl);
      } catch (err) {
        setError("Failed to fetch VNC URL");
        console.error("Error fetching VNC URL:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVncUrl();
  }, [vmid]);

  const renderVNCContent = () => {
    if (loading) {
      return <CircularProgress />;
    }
    if (error || !vncUrl) {
      return <Typography color="error">No connection available</Typography>;
    }
    return (
      <iframe
        src={vncUrl}
        style={{ width: "100%", height: "100%", border: "none" }}
        title="VNC Console"
      />
    );
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          VNC Console
          <Button
            startIcon={<FullscreenIcon />}
            onClick={openFullConsole}
            sx={{ float: "right" }}
          >
            Full Screen
          </Button>
        </Typography>
        <Box
          sx={{
            width: "100%",
            height: "300px",
            bgcolor: "black",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {renderVNCContent()}
        </Box>
      </CardContent>
      <Dialog
        fullScreen
        open={isFullscreen}
        onClose={() => setIsFullscreen(false)}
      >
        <DialogTitle>
          Full VNC Console
          <Button
            onClick={() => setIsFullscreen(false)}
            sx={{ float: "right" }}
          >
            Close
          </Button>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              width: "100%",
              height: "calc(100vh - 100px)",
              bgcolor: "black",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {renderVNCContent()}
          </Box>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

const ContainerControls: React.FC<{
  status: any;
  onAction: (action: string) => void;
}> = ({ status, onAction }) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
      <Button
        variant="contained"
        color="success"
        startIcon={<PlayArrowIcon />}
        onClick={() => onAction("start")}
        disabled={status === "running" || status === "starting" || status === "stopping"}
      >
        Start
      </Button>
      <Button
        variant="contained"
        color="error"
        startIcon={<StopIcon />}
        onClick={() => onAction("stop")}
        disabled={status !== "running" || status === "stopping" || status === "starting"}
      >
        Stop
      </Button>
      <Button
        variant="contained"
        color="warning"
        startIcon={<RestartAltIcon />}
        onClick={() => onAction("restart")}
        disabled={status !== "running" || status === "restarting"}
      >
        Restart
      </Button>
    </Box>
  );
};

const ContainerDashboard: React.FC = () => {
  const router = useRouter();
  const { ctId } = router.query;
  const { response, error, loading, axiosFetch } =
    useAxiosFunction() as AxiosResponse;
  const [containerData, setContainerData] = useState<ContainerData | null>(
    null
  );
  const [localStatus, setLocalStatus] = useState<string>("");

  const axiosInstance = axios.create({ baseURL: backendConfig.api });
  const storedToken = window.localStorage.getItem(
    userConfig.storageTokenKeyName
  );

  const [reload, setReload] = useState(false);

  useEffect(() => {
    if (ctId) {
      fetchContainerData();
    }
  }, [ctId]);

  useEffect(() => {
    if (response) {
      setContainerData(response);
      setLocalStatus(response.status);
    }
  }, [response]);

  useEffect(() => {
    if (!containerData) return;
    if (containerData.status === "stopped") {
      const interval = setTimeout(() => {
        fetchContainerData();
      }, 7000);

      return () => clearInterval(interval);
    }
  }, [containerData]);

  const fetchContainerData = () => {
    axiosFetch({
      axiosInstance,
      method: HTTP_METHOD.GET,
      url: `/server/prx/lxc/${ctId}/status`,
      headers: { Authorization: storedToken },
    });
  };

  const handleContainerAction = async (action: string) => {
    let intermediateStatus = "";
    switch (action) {
      case "start":
        intermediateStatus = "starting";
        break;
      case "stop":
        intermediateStatus = "stopping";
        break;
      case "restart":
        intermediateStatus = "restarting";
        break;
      default:
        intermediateStatus = "updating";
    }
    setLocalStatus(intermediateStatus);

    try {
      await axiosInstance.post(
        `/server/prx/lxc/${action}`,
        { vmid: containerData?.vmid },
        { headers: { Authorization: storedToken || "" } }
      );

      // Simulate a delay before fetching updated data
      setTimeout(() => {
        fetchContainerData();
      }, 3000);
    } catch (error) {
      console.error(`Failed to ${action} container:`, error);
      setLocalStatus(containerData?.status || "");
    }
  };

  // if (loading) {
  //   return <CircularProgress />;
  // }

  // if (error) {
  //   return <Alert severity="error">{error.message}</Alert>;
  // }

  if (!containerData) {
    return null;
  }

  return (
    <>
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
          <IconButton
            onClick={() => {
              router.push(`/cloud/containers/${ctId}`);
            }}
            style={{ marginTop: "1rem" }}
          >
            <RestartAltIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        {/* Status Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Status
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>VMID</TableCell>
                      <TableCell>{containerData.vmid}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>{containerData.name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Status</TableCell>
                      <TableCell>
                        <Chip
                          label={
                            localStatus.charAt(0).toUpperCase() +
                            localStatus.slice(1)
                          }
                          color={
                            localStatus === "running"
                              ? "success"
                              : localStatus === "stopped"
                              ? "error"
                              : "warning"
                          }
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>
                        {containerData.type === "lxc" && "Container"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Uptime</TableCell>
                      <TableCell>{`${Math.floor(
                        containerData.uptime / 3600
                      )} hours ${Math.floor(
                        (containerData.uptime % 3600) / 60
                      )} minutes`}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <ContainerControls
                status={localStatus}
                onAction={handleContainerAction}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Resource Usage Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resource Usage
              </Typography>
              <ResourceUsageBar
                used={containerData.mem}
                max={containerData.maxmem}
                label="Memory"
              />
              <ResourceUsageBar
                used={containerData.disk}
                max={containerData.maxdisk}
                label="Disk"
              />
              <ResourceUsageBar
                used={containerData.swap}
                max={containerData.maxswap}
                label="Swap"
              />
              <Box sx={{ width: "100%", mb: 2 }}>
                <Typography variant="body2">CPU Usage</Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{ width: "100%", mr: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={containerData.cpu * 100}
                    />
                  </Box>
                  <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body2" color="text.secondary">{`${(
                      containerData.cpu * 100
                    ).toFixed(1)}%`}</Typography>
                  </Box>
                </Box>
                <Typography variant="caption">{`${containerData.cpus} CPUs`}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          {containerData && <VNCView vmid={containerData.vmid} />}
        </Grid>

        {/* Network Usage Section */}
        <Grid item xs={12}>
          <NetworkUsageDisplay
            netin={containerData.netin}
            netout={containerData.netout}
          />
        </Grid>

        <Grid item xs={12}>
          <NetworkInfoCard networkInfo={containerData.network} />
        </Grid>

        {/* Disk I/O Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Disk I/O
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Disk Read</TableCell>
                      <TableCell>
                        {formatBytes(containerData.diskread)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Disk Write</TableCell>
                      <TableCell>
                        {formatBytes(containerData.diskwrite)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Root Account Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Root Account
              </Typography>
              <TextField
                fullWidth
                label="Username"
                value="root"
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value="********"
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default ContainerDashboard;
