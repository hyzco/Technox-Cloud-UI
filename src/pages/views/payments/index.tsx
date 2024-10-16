import React, { useState, useMemo } from "react";
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import {
  Button,
  Card,
  CardHeader,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Typography,
  CircularProgress,
  Grid,
  Box,
  Chip,
  Paper,
  Tooltip,
  AppBar,
  Toolbar,
  InputAdornment,
  CardContent,
} from "@mui/material";
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  FilterList as FilterListIcon,
  Save as SaveIcon,
  Search as SearchIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  MonetizationOn as MonetizationOnIcon,
  DateRange as DateRangeIcon,
} from "@mui/icons-material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// Define types
type PaymentStatus = "Paid" | "Unpaid" | "Overdue";
type PaymentMethod =
  | "Credit Card"
  | "Bank Transfer"
  | "PayPal"
  | "Cryptocurrency";

interface Payment {
  id: number;
  customerName: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  date: string;
  serviceName: string;
}

const initialPayments: Payment[] = [
  {
    id: 1,
    customerName: "John Doe",
    amount: 100,
    paymentMethod: "Credit Card",
    status: "Paid",
    date: "2024-09-10",
    serviceName: "VPS Hosting",
  },
  {
    id: 2,
    customerName: "Jane Smith",
    amount: 50,
    paymentMethod: "PayPal",
    status: "Unpaid",
    date: "2024-09-12",
    serviceName: "DNS Hosting",
  },
  {
    id: 3,
    customerName: "Michael Brown",
    amount: 200,
    paymentMethod: "Bank Transfer",
    status: "Overdue",
    date: "2024-08-01",
    serviceName: "Dedicated Server",
  },
  {
    id: 4,
    customerName: "Emily Johnson",
    amount: 150,
    paymentMethod: "Credit Card",
    status: "Paid",
    date: "2024-09-15",
    serviceName: "Cloud Storage",
  },
  {
    id: 5,
    customerName: "David Lee",
    amount: 75,
    paymentMethod: "Cryptocurrency",
    status: "Unpaid",
    date: "2024-09-18",
    serviceName: "Email Hosting",
  },
];

const PaymentsView: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isViewingPayment, setIsViewingPayment] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<PaymentStatus | "">("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredPayments = useMemo(() => {
    return payments.filter(
      (payment) =>
        (filterStatus === "" || payment.status === filterStatus) &&
        (searchTerm === "" ||
          payment.customerName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          payment.serviceName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [payments, filterStatus, searchTerm]);

  const totalPaid = payments
    .filter((p) => p.status === "Paid")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalDue = payments.reduce((sum, p) => sum + p.amount, 0);
  const unpaid = payments.filter((p) => p.status === "Unpaid").length;
  const overdue = payments.filter((p) => p.status === "Overdue").length;

  const balanceData = [
    { name: "Paid", value: totalPaid },
    { name: "Due", value: totalDue - totalPaid },
  ];

  const statusData = [
    { name: "Paid", value: payments.filter((p) => p.status === "Paid").length },
    { name: "Unpaid", value: unpaid },
    { name: "Overdue", value: overdue },
  ];

  const COLORS = ["#4caf50", "#ff9800", "#f44336"];

  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsViewingPayment(true);
  };

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case "Paid":
        return "#4caf50";
      case "Unpaid":
        return "#ff9800";
      case "Overdue":
        return "#f44336";
      default:
        return "#9e9e9e";
    }
  };

  const paymentColumns: GridColDef[] = [
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params: any) => (
        <Tooltip title="View Details">
          <IconButton onClick={() => handleViewPayment(params.row as Payment)}>
            <VisibilityIcon color="primary" />
          </IconButton>
        </Tooltip>
      ),
    },
    { field: "customerName", headerName: "Customer", flex: 1 },
    {
      field: "amount",
      headerName: "Amount",
      width: 120,
      renderCell: (params: GridValueGetterParams) => (
        <Typography>${params.value}</Typography>
      ),
    },
    { field: "paymentMethod", headerName: "Method", width: 150 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params: GridValueGetterParams) => (
        <Chip
          label={params.value}
          style={{
            backgroundColor: getStatusColor(params.value as PaymentStatus),
            color: "white",
          }}
        />
      ),
    },
    { field: "date", headerName: "Date", width: 120 },
    { field: "serviceName", headerName: "Service", flex: 1 },
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}
      >
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            Payment Dashboard
          </Typography>
          {/* <Button startIcon={<AddIcon />} variant="contained" color="primary">
            Add Payment
          </Button> */}
        </Toolbar>
      </AppBar>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader
              title="Current Balance"
              avatar={<MonetizationOnIcon />}
            />
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={balanceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {balanceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <Typography variant="body2" align="center">
                Total Paid: ${totalPaid} | Total Due: ${totalDue - totalPaid}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Payment Status" avatar={<PieChartIcon />} />
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Monthly Payments" avatar={<BarChartIcon />} />
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={[
                    { name: "Jan", amount: 4000 },
                    { name: "Feb", amount: 3000 },
                    { name: "Mar", amount: 5000 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="amount" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(e.target.value as PaymentStatus)
                }
                displayEmpty
                size="small"
                startAdornment={<FilterListIcon />}
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Unpaid">Unpaid</MenuItem>
                <MenuItem value="Overdue">Overdue</MenuItem>
              </Select>
            </Box>
            <DataGrid
              rows={filteredPayments}
              columns={paymentColumns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              checkboxSelection
              disableSelectionOnClick
              autoHeight
            />
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        open={isViewingPayment}
        onClose={() => setIsViewingPayment(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Payment Details</DialogTitle>
        <DialogContent>
          {selectedPayment && (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Customer</Typography>
                <Typography variant="body1">
                  {selectedPayment.customerName}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Amount</Typography>
                <Typography variant="body1">
                  ${selectedPayment.amount}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Payment Method</Typography>
                <Typography variant="body1">
                  {selectedPayment.paymentMethod}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Status</Typography>
                <Chip
                  label={selectedPayment.status}
                  style={{
                    backgroundColor: getStatusColor(selectedPayment.status),
                    color: "white",
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Date</Typography>
                <Typography variant="body1">{selectedPayment.date}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Service</Typography>
                <Typography variant="body1">
                  {selectedPayment.serviceName}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsViewingPayment(false)}>Close</Button>
          <Button variant="contained" color="primary" startIcon={<SaveIcon />}>
            Edit Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentsView;
