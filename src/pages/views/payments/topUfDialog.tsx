import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  Tab,
  Tabs,
  Radio,
  RadioGroup,
  FormControlLabel,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Switch,
  Alert,
  CircularProgress,
  Stack,
  Divider,
  useTheme,
  alpha,
} from "@mui/material";
import {
  CreditCard,
  Add as AddIcon,
  Close as CloseIcon,
  AccountBalance as BankIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Payment as PaymentIcon,
  NavigateNext as ChevronRightIcon,
  Wallet as WalletIcon,
} from "@mui/icons-material";

// Types and Interfaces
interface PaymentMethod {
  id: string;
  type: "visa" | "mastercard" | "amex";
  last4: string;
  expiry: string;
  isDefault: boolean;
  cardholderName: string;
}

interface CardFormData {
  number: string;
  expiry: string;
  cvc: string;
  name: string;
}

interface TopUpDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (amount: number) => void;
  currentBalance?: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Custom components
const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const PaymentMethodCard: React.FC<{
  method: PaymentMethod;
  selected: boolean;
  onClick: () => void;
}> = ({ method, selected, onClick }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        mb: 2,
        cursor: "pointer",
        border: "1px solid",
        borderColor: selected ? "primary.main" : "divider",
        backgroundColor: selected
          ? alpha(theme.palette.primary.main, 0.05)
          : "background.paper",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          borderColor: selected ? "primary.main" : theme.palette.primary.light,
          backgroundColor: selected
            ? alpha(theme.palette.primary.main, 0.05)
            : alpha(theme.palette.primary.main, 0.02),
        },
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Radio checked={selected} color="primary" />
            <Box>
              <Box display="flex" alignItems="center" gap={1}>
                <CreditCard color={selected ? "primary" : "action"} />
                <Typography
                  variant="subtitle1"
                  color={selected ? "primary" : "textPrimary"}
                >
                  {method.type.toUpperCase()} •••• {method.last4}
                </Typography>
              </Box>
              <Typography variant="body2" color="textSecondary">
                Expires {method.expiry}
              </Typography>
            </Box>
          </Box>
          {method.isDefault && (
            <Typography variant="caption" color="primary">
              Default
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

// Main component
const TopUpDialog: React.FC<TopUpDialogProps> = ({
  open,
  onClose,
  onSuccess,
  currentBalance = 0,
}) => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [amount, setAmount] = useState<string>("");
  const [selectedMethodId, setSelectedMethodId] = useState<string>("");
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [status, setStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [error, setError] = useState<string>("");
  const [saveCard, setSaveCard] = useState<boolean>(true);

  const [cardForm, setCardForm] = useState<CardFormData>({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  });

  // Mock data
  useEffect(() => {
    const mockMethods: PaymentMethod[] = [
      {
        id: "1",
        type: "visa",
        last4: "4242",
        expiry: "12/24",
        isDefault: true,
        cardholderName: "John Doe",
      },
      {
        id: "2",
        type: "mastercard",
        last4: "8888",
        expiry: "09/25",
        isDefault: false,
        cardholderName: "John Doe",
      },
    ];
    setPaymentMethods(mockMethods);
  }, []);

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (
      value === "" ||
      (/^\d*\.?\d{0,2}$/.test(value) && parseFloat(value) <= 10000)
    ) {
      setAmount(value);
    }
  };

  const handleCardInputChange = (field: keyof CardFormData, value: string) => {
    setCardForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    setStatus("processing");
    setError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setStatus("success");
      onSuccess(parseFloat(amount));
    } catch (err) {
      setStatus("error");
      setError("Transaction failed. Please try again.");
    }
  };

  const handleAddNewCard = async () => {
    setStatus("processing");

    try {
      // Simulate adding new card
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newCard: PaymentMethod = {
        id: String(paymentMethods.length + 1),
        type: "visa",
        last4: cardForm.number.slice(-4),
        expiry: cardForm.expiry,
        isDefault: paymentMethods.length === 0,
        cardholderName: cardForm.name,
      };

      setPaymentMethods((prev) => [...prev, newCard]);
      setSelectedMethodId(newCard.id);
      setTabValue(0);
      setStatus("idle");
      setCardForm({
        number: "",
        expiry: "",
        cvc: "",
        name: "",
      });
    } catch (err) {
      setError("Failed to add card. Please try again.");
      setStatus("error");
    }
  };

  const isValid =
    parseFloat(amount) > 0 && parseFloat(amount) <= 10000 && selectedMethodId;

  const handleClose = () => {
    if (status !== "processing") {
      setAmount("");
      setSelectedMethodId("");
      setError("");
      setStatus("idle");
      setTabValue(0);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle sx={{ px: 3, py: 2, bgcolor: "background.default" }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6">Account Balance</Typography>
            <Typography variant="subtitle2" color="textSecondary">
              Current Balance: ${Number(currentBalance).toFixed(2)}
            </Typography>
          </Box>
          <IconButton
            onClick={handleClose}
            size="small"
            disabled={status === "processing"}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <Tabs
        value={tabValue}
        onChange={(_, newValue) => setTabValue(newValue)}
        sx={{ px: 3, bgcolor: "background.default" }}
      >
        <Tab label="Top Up" icon={<WalletIcon />} iconPosition="start" />
        <Tab
          label="Payment Methods"
          icon={<PaymentIcon />}
          iconPosition="start"
        />
      </Tabs>

      <DialogContent sx={{ p: 0 }}>
        <TabPanel value={tabValue} index={0}>
          {status === "processing" && (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              p={4}
            >
              <CircularProgress size={24} sx={{ mr: 2 }} />
              <Typography>Processing your payment...</Typography>
            </Box>
          )}

          {status === "success" && (
            <Alert
              icon={<CheckCircleIcon />}
              severity="success"
              sx={{ mx: 3, mb: 3 }}
            >
              <Typography variant="subtitle2">
                Success! Your balance has been updated.
              </Typography>
              <Typography variant="body2">
                New balance: ${(currentBalance + parseFloat(amount)).toFixed(2)}
              </Typography>
            </Alert>
          )}

          {status === "error" && (
            <Alert
              icon={<WarningIcon />}
              severity="error"
              sx={{ mx: 3, mb: 3 }}
            >
              {error}
            </Alert>
          )}

          {status === "idle" && (
            <Stack spacing={3} sx={{ p: 3 }}>
              <TextField
                fullWidth
                label="Amount"
                value={amount}
                onChange={handleAmountChange}
                type="number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
                helperText="Maximum amount: $10,000"
                error={
                  amount !== "" &&
                  (parseFloat(amount) <= 0 || parseFloat(amount) > 10000)
                }
              />

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Payment Method
                </Typography>
                {paymentMethods.map((method) => (
                  <PaymentMethodCard
                    key={method.id}
                    method={method}
                    selected={selectedMethodId === method.id}
                    onClick={() => setSelectedMethodId(method.id)}
                  />
                ))}
                <Button
                  startIcon={<AddIcon />}
                  variant="outlined"
                  fullWidth
                  onClick={() => setTabValue(1)}
                  sx={{ mt: 2 }}
                >
                  Add New Payment Method
                </Button>
              </Box>
            </Stack>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Cardholder Name"
              value={cardForm.name}
              onChange={(e) => handleCardInputChange("name", e.target.value)}
            />

            <TextField
              fullWidth
              label="Card Number"
              value={cardForm.number}
              onChange={(e) => handleCardInputChange("number", e.target.value)}
              inputProps={{ maxLength: 16 }}
            />

            <Box display="flex" gap={2}>
              <TextField
                fullWidth
                label="Expiry Date"
                value={cardForm.expiry}
                onChange={(e) =>
                  handleCardInputChange("expiry", e.target.value)
                }
                placeholder="MM/YY"
                inputProps={{ maxLength: 5 }}
              />

              <TextField
                fullWidth
                label="CVC"
                value={cardForm.cvc}
                onChange={(e) => handleCardInputChange("cvc", e.target.value)}
                inputProps={{ maxLength: 4 }}
              />
            </Box>

            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography>Save card for future use</Typography>
              <Switch
                checked={saveCard}
                onChange={(e) => setSaveCard(e.target.checked)}
                color="primary"
              />
            </Box>
          </Stack>
        </TabPanel>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 3 }}>
        {tabValue === 0 && (
          <>
            <Button
              onClick={handleClose}
              variant="outlined"
              disabled={status === "processing"}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={!isValid || status === "processing"}
              startIcon={
                status === "processing" ? (
                  <CircularProgress size={20} />
                ) : (
                  <WalletIcon />
                )
              }
            >
              {status === "processing" ? "Processing..." : `Top Up $${amount}`}
            </Button>
          </>
        )}

        {tabValue === 1 && (
          <>
            <Button
              onClick={() => setTabValue(0)}
              variant="outlined"
              disabled={status === "processing"}
            >
              Back
            </Button>
            <Button
              onClick={handleAddNewCard}
              variant="contained"
              disabled={
                !cardForm.number ||
                !cardForm.expiry ||
                !cardForm.cvc ||
                !cardForm.name ||
                status === "processing"
              }
              startIcon={
                status === "processing" ? (
                  <CircularProgress size={20} />
                ) : (
                  <AddIcon />
                )
              }
            >
              {status === "processing" ? "Adding Card..." : "Add Card"}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default TopUpDialog;
