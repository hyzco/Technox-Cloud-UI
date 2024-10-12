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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Snackbar,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ApexChartWrapper from "src/@core/styles/libs/react-apexcharts";
import useAxiosFunction from "src/@core/hooks/useAxiosFunction";
import { HTTP_METHOD } from "src/@core/enums/axios.enum";
import userConfig from "src/configs/user";
import axios from "axios";
import backendConfig from "src/configs/backendConfig";

interface NetworkInterface {
  id: string; // Assuming each interface has a unique ID
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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentInterface, setCurrentInterface] = useState<NetworkInterface | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  const axiosInstance = axios.create({ baseURL: backendConfig.api });
  const storedToken = window.localStorage.getItem(userConfig.storageTokenKeyName)!;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Handlers for Add Interface
  const handleAddInterface = () => {
    setCurrentInterface(null);
    setIsAddDialogOpen(true);
  };

  // Handlers for Edit Interface
  const handleEditInterface = (iface: NetworkInterface) => {
    setCurrentInterface(iface);
    setIsEditDialogOpen(true);
  };

  // Handlers for Delete Interface
  const handleDeleteInterface = async (node: string, ifaceId: string) => {
    try {
      await axiosInstance.delete(`/server/prx/node/network/interface/${ifaceId}`, {
        headers: { Authorization: storedToken },
      });
      // Optimistically update UI
      setNetworkData((prevData) =>
        prevData.map((n) =>
          n.node === node
            ? { ...n, network: n.network.filter((iface) => iface.id !== ifaceId) }
            : n
        )
      );
      setSnackbar({ open: true, message: "Interface deleted successfully.", severity: "success" });
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || "Failed to delete interface.", severity: "error" });
    }
  };

  // Handler for form submission (Add/Edit)
  const handleFormSubmit = async (iface: NetworkInterface) => {
    if (currentInterface) {
      // Update existing interface
      try {
        const res = await axiosInstance.put(`/server/prx/node/network/interface/${iface.id}`, iface, {
          headers: { Authorization: storedToken },
        });
        // Update UI
        setNetworkData((prevData) =>
          prevData.map((n) =>
            n.node === res.data.node
              ? {
                  ...n,
                  network: n.network.map((item) => (item.id === iface.id ? res.data.interface : item)),
                }
              : n
          )
        );
        setSnackbar({ open: true, message: "Interface updated successfully.", severity: "success" });
      } catch (err: any) {
        setSnackbar({ open: true, message: err.message || "Failed to update interface.", severity: "error" });
      }
    } else {
      // Add new interface
      try {
        const res = await axiosInstance.post(`/server/prx/node/network/interface`, iface, {
          headers: { Authorization: storedToken },
        });
        // Update UI
        setNetworkData((prevData) =>
          prevData.map((n) =>
            n.node === res.data.node
              ? { ...n, network: [...n.network, res.data.interface] }
              : n
          )
        );
        setSnackbar({ open: true, message: "Interface added successfully.", severity: "success" });
      } catch (err: any) {
        setSnackbar({ open: true, message: err.message || "Failed to add interface.", severity: "error" });
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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
          <Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddInterface}
              sx={{ mr: 2 }}
            >
              Add Interface
            </Button>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={fetchData}
            >
              Refresh Data
            </Button>
          </Box>
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
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {nodeNetwork.network.map((iface: NetworkInterface) => (
                      <TableRow key={iface.id}>
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
                            {iface.bridge_ports && `, Bridge Ports: ${iface.bridge_ports}`}
                            {iface["vlan-raw-device"] && `, VLAN Device: ${iface["vlan-raw-device"]}`}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            color="primary"
                            onClick={() => handleEditInterface(iface)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteInterface(nodeNetwork.node, iface.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Grid container spacing={3} sx={{ mt: 2 }}>
                {nodeNetwork.network.map((iface: NetworkInterface) => (
                  <Grid item xs={12} md={6} key={iface.id}>
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
                            <strong>Method:</strong> <span>{iface.method}</span>
                            <strong>IPv4 Address:</strong> <span>{iface.address || "N/A"}</span>
                            <strong>Netmask:</strong> <span>{iface.netmask || "N/A"}</span>
                            <strong>Gateway:</strong> <span>{iface.gateway || "N/A"}</span>
                            <strong>Families:</strong> <span>{iface.families.join(", ")}</span>
                            <strong>Priority:</strong> <span>{iface.priority}</span>
                            {iface.bridge_ports && (
                              <>
                                <strong>Bridge Ports:</strong> <span>{iface.bridge_ports}</span>
                              </>
                            )}
                            {iface.bridge_stp && (
                              <>
                                <strong>Bridge STP:</strong> <span>{iface.bridge_stp}</span>
                              </>
                            )}
                            {iface["vlan-raw-device"] && (
                              <>
                                <strong>VLAN Raw Device:</strong> <span>{iface["vlan-raw-device"]}</span>
                              </>
                            )}
                          </Box>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))}

        {/* Add/Edit Dialog */}
        <Dialog
          open={isAddDialogOpen || isEditDialogOpen}
          onClose={() => {
            setIsAddDialogOpen(false);
            setIsEditDialogOpen(false);
            setCurrentInterface(null);
          }}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>{currentInterface ? "Edit Interface" : "Add New Interface"}</DialogTitle>
          <DialogContent>
            <NetworkInterfaceForm
              initialData={currentInterface}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setIsAddDialogOpen(false);
                setIsEditDialogOpen(false);
                setCurrentInterface(null);
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={snackbar.message}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        />
      </Box>
    </ApexChartWrapper>
  );
};

// Form Component for Add/Edit Interface
interface NetworkInterfaceFormProps {
  initialData: NetworkInterface | null;
  onSubmit: (iface: NetworkInterface) => void;
  onCancel: () => void;
}

const NetworkInterfaceForm: React.FC<NetworkInterfaceFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [iface, setIface] = useState<NetworkInterface>(
    initialData || {
      id: "", // Will be set by backend for new interfaces
      iface: "",
      type: "",
      method: "",
      address: "",
      active: true,
      cidr: "",
      bridge_ports: "",
      "vlan-raw-device": "",
      netmask: "",
      gateway: "",
      families: [],
      priority: 0,
      bridge_stp: "",
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (name === "active") {
      setIface({ ...iface, active: checked });
    } else if (name === "families") {
      setIface({ ...iface, families: value.split(",").map((f) => f.trim()) });
    } else if (name === "priority") {
      setIface({ ...iface, priority: parseInt(value, 10) });
    } else {
      setIface({ ...iface, [name]: value });
    }
  };

  const handleSubmit = () => {
    // Basic validation
    if (!iface.iface || !iface.type || !iface.method) {
      alert("Please fill in all required fields.");
      return;
    }
    onSubmit(iface);
  };

  return (
    <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
      <TextField
        margin="normal"
        label="Interface Name"
        name="iface"
        fullWidth
        required
        value={iface.iface}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        label="Type"
        name="type"
        fullWidth
        required
        value={iface.type}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        label="Method"
        name="method"
        fullWidth
        required
        value={iface.method}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        label="IPv4 Address"
        name="address"
        fullWidth
        value={iface.address}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        label="CIDR"
        name="cidr"
        fullWidth
        value={iface.cidr}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        label="Netmask"
        name="netmask"
        fullWidth
        value={iface.netmask}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        label="Gateway"
        name="gateway"
        fullWidth
        value={iface.gateway}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        label="Families (comma separated)"
        name="families"
        fullWidth
        value={iface.families.join(", ")}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        label="Priority"
        name="priority"
        type="number"
        fullWidth
        value={iface.priority}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        label="Bridge Ports"
        name="bridge_ports"
        fullWidth
        value={iface.bridge_ports}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        label="Bridge STP"
        name="bridge_stp"
        fullWidth
        value={iface.bridge_stp}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        label="VLAN Raw Device"
        name="vlan-raw-device"
        fullWidth
        value={iface["vlan-raw-device"] || ""}
        onChange={handleChange}
      />
      <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
        <Chip
          label={iface.active ? "Active" : "Inactive"}
          color={iface.active ? "success" : "error"}
          onClick={() => setIface({ ...iface, active: !iface.active })}
          clickable
          sx={{ mr: 2 }}
        />
        <Typography variant="body1">Toggle Status</Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <Button onClick={onCancel} sx={{ mr: 2 }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          {initialData ? "Update" : "Add"}
        </Button>
      </Box>
    </Box>
  );
};

NetworkDashboard.acl = {
  action: "read",
  subject: "networkDashboard",
};

export default NetworkDashboard;
