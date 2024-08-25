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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RefreshIcon from "@mui/icons-material/Refresh";
import ApexChartWrapper from "src/@core/styles/libs/react-apexcharts";
import useAxiosFunction from "src/@core/hooks/useAxiosFunction";
import { HTTP_METHOD } from "src/@core/enums/axios.enum";
import userConfig from "src/configs/user";
import axios from "axios";
import backendConfig from "src/configs/backendConfig";

interface NetworkInterface {
  iface: string;
  type: string;
  method: string;
  address?: string;
  active: boolean;
  cidr?: string;
  bridge_ports?: string;
  "vlan-raw-device"?: string;
  netmask?: string;
  gateway?: string;
  families: string[];
  priority: number;
  bridge_stp?: string;
}

interface NodeNetwork {
  node: string;
  network: NetworkInterface[];
}

const NetworkDashboard = () => {
  const { response, error, loading, axiosFetch } = useAxiosFunction();
  const [networkData, setNetworkData] = useState<NodeNetwork[]>([]);
  const [expandedNode, setExpandedNode] = useState<string | false>(false);

  const axiosInstance = axios.create({ baseURL: backendConfig.api });
  const storedToken = window.localStorage.getItem(
    userConfig.storageTokenKeyName
  )!;

  const fetchData = () => {
    axiosFetch({
      axiosInstance,
      method: HTTP_METHOD.GET,
      url: "/server/prx/node/network/list/all",
      headers: { Authorization: storedToken },
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (response && response.networks) {
      response.networks.sort((a: NodeNetwork, b: NodeNetwork) => {
        return a.node.localeCompare(b.node);
      });
      setNetworkData(response.networks);
    }
  }, [response]);
  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  const getStatusColor = (active: boolean) => (active ? "success" : "error");
  const getStatusLabel = (active: boolean) => (active ? "Active" : "Inactive");

  const handleNodeExpand =
    (node: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedNode(isExpanded ? node : false);
    };

  return (
    <ApexChartWrapper>
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4">Network Interfaces Dashboard</Typography>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={fetchData}
          >
            Refresh Data
          </Button>
        </Box>
        {networkData.map((nodeNetwork: NodeNetwork) => (
          <Accordion
            key={nodeNetwork.node}
            expanded={expandedNode === nodeNetwork.node}
            onChange={handleNodeExpand(nodeNetwork.node)}
            style={{ marginBottom: "1rem" }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Node: {nodeNetwork.node}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Interface</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Method</TableCell>
                      <TableCell>IP Address</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Details</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {nodeNetwork.network.map(
                      (iface: NetworkInterface, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{iface.iface}</TableCell>
                          <TableCell>{iface.type}</TableCell>
                          <TableCell>{iface.method}</TableCell>
                          <TableCell>{iface.address || "N/A"}</TableCell>
                          <TableCell>
                            <Chip
                              label={getStatusLabel(iface.active)}
                              color={getStatusColor(iface.active)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {iface.cidr && `CIDR: ${iface.cidr}`}
                              {iface.bridge_ports &&
                                `, Bridge Ports: ${iface.bridge_ports}`}
                              {iface["vlan-raw-device"] &&
                                `, VLAN Device: ${iface["vlan-raw-device"]}`}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Grid container spacing={3} sx={{ mt: 2 }}>
                {nodeNetwork.network.map(
                  (iface: NetworkInterface, index: number) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {iface.iface} Details
                          </Typography>
                          <Typography variant="body2" component="div">
                            <Box
                              sx={{
                                display: "grid",
                                gridTemplateColumns: "auto 1fr",
                                gap: 1,
                              }}
                            >
                              <strong>Type:</strong> <span>{iface.type}</span>
                              <strong>Method:</strong>{" "}
                              <span>{iface.method}</span>
                              <strong>IPv4 Address:</strong>{" "}
                              <span>{iface.address || "N/A"}</span>
                              <strong>Netmask:</strong>{" "}
                              <span>{iface.netmask || "N/A"}</span>
                              <strong>Gateway:</strong>{" "}
                              <span>{iface.gateway || "N/A"}</span>
                              <strong>Families:</strong>{" "}
                              <span>{iface.families.join(", ")}</span>
                              <strong>Priority:</strong>{" "}
                              <span>{iface.priority}</span>
                              {iface.bridge_ports && (
                                <>
                                  <strong>Bridge Ports:</strong>{" "}
                                  <span>{iface.bridge_ports}</span>
                                </>
                              )}
                              {iface.bridge_stp && (
                                <>
                                  <strong>Bridge STP:</strong>{" "}
                                  <span>{iface.bridge_stp}</span>
                                </>
                              )}
                              {iface["vlan-raw-device"] && (
                                <>
                                  <strong>VLAN Raw Device:</strong>{" "}
                                  <span>{iface["vlan-raw-device"]}</span>
                                </>
                              )}
                            </Box>
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )
                )}
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </ApexChartWrapper>
  );
};

NetworkDashboard.acl = {
  action: "read",
  subject: "networkDashboard",
};

export default NetworkDashboard;
