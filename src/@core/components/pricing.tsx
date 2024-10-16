// PricingPage.tsx

// ** React Imports
import React, { useState, ChangeEvent, SyntheticEvent } from "react";

// ** MUI Imports
import {
  Box,
  Button,
  Grid,
  Switch,
  Typography,
  InputLabel,
  Accordion as MuiAccordion,
  AccordionSummary,
  AccordionDetails,
  CardContent as MuiCardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputAdornment,
  Avatar,
  Card,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Slider,
  Collapse,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// ** Icons Imports
import ChevronDown from "@mui/icons-material/ExpandMore";
import CheckCircle from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import TimerIcon from "@mui/icons-material/Timer";
import SecurityIcon from "@mui/icons-material/Security";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CloudIcon from "@mui/icons-material/Cloud";
import PeopleIcon from "@mui/icons-material/People";

// ** Util Import (Assuming hexToRGBA is defined elsewhere)
import { alpha } from "@mui/material/styles";

// ** Types
interface PricingPlanType {
  id: string;
  title: string;
  price: number;
  features: string[];
  isPopular?: boolean;
  type: "cloud" | "vps";
}

interface PricingFaqType {
  id: string;
  question: string;
  answer: string;
}

interface PaymentHistoryType {
  id: string;
  date: string;
  amount: number;
  status: "Completed" | "Pending" | "Failed";
  method: string;
}

interface TestimonialType {
  id: string;
  name: string;
  role: string;
  avatar: string;
  feedback: string;
}

interface PricingDataType {
  pricingPlans: PricingPlanType[];
  faq: PricingFaqType[];
  paymentHistory: PaymentHistoryType[];
  testimonials: TestimonialType[];
}

// ** Styled Components
const CardContentStyled = styled(MuiCardContent)(({ theme }) => ({
  padding: `${theme.spacing(5, 8)} !important`,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  [theme.breakpoints.down("lg")]: {
    padding: `${theme.spacing(3, 5)} !important`,
  },
  [theme.breakpoints.down("sm")]: {
    padding: `${theme.spacing(2, 2)} !important`,
  },
}));

const Accordion = styled(MuiAccordion)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:before": {
    height: 0,
  },
  "&.Mui-expanded": {
    boxShadow: "none",
  },
}));

const BoxWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(15, 35),
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  [theme.breakpoints.down("lg")]: {
    padding: theme.spacing(15, 20),
  },
  [theme.breakpoints.down("md")]: {
    textAlign: "center",
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(15, 5),
  },
}));

const GridStyled = styled(Grid)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  [theme.breakpoints.down("md")]: {
    order: -1,
  },
}));

const Img = styled("img")(({ theme }) => ({
  bottom: 0,
  right: 144,
  width: 219,
  position: "absolute",
  [theme.breakpoints.down("md")]: {
    width: 200,
    position: "static",
  },
  [theme.breakpoints.down("sm")]: {
    width: 180,
  },
}));

const TableContainerStyled = styled(TableContainer)(({ theme }) => ({
  maxWidth: 1000,
  margin: "0 auto",
  [theme.breakpoints.down("sm")]: {
    maxWidth: "100%",
  },
}));

const TestimonialCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4),
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius,
  textAlign: "center",
  height: "100%",
}));

const StepContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

// ** PaymentHistoryTable Component
const PaymentHistoryTable: React.FC<{ data: PaymentHistoryType[] }> = ({
  data,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const filteredData = data.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.method.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Box sx={{ mt: 15, mb: 15, px: { xs: 2, md: 0 } }}>
      <Typography variant="h5" align="center" gutterBottom>
        Payment History
      </Typography>
      <Typography variant="body2" align="center" gutterBottom>
        Review your past transactions and manage your billing details.
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 4,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <TextField
          label="Search Transactions"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <TimerIcon />
              </InputAdornment>
            ),
          }}
        />
        <FormControl variant="outlined" size="small">
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Failed">Failed</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <TableContainerStyled sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Date</strong>
              </TableCell>
              <TableCell>
                <strong>Amount</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
              <TableCell>
                <strong>Method</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.date}</TableCell>
                <TableCell>${payment.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Tooltip title={payment.status}>
                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "4px 8px",
                        borderRadius: "12px",
                        backgroundColor:
                          payment.status === "Completed"
                            ? "success.main"
                            : payment.status === "Pending"
                            ? "warning.main"
                            : "error.main",
                        color: "common.white",
                        fontSize: "0.75rem",
                      }}
                    >
                      {payment.status === "Completed" && (
                        <CheckCircle sx={{ mr: 0.5 }} />
                      )}
                      {payment.status === "Pending" && (
                        <TimerIcon sx={{ mr: 0.5 }} />
                      )}
                      {payment.status === "Failed" && (
                        <CloseIcon sx={{ mr: 0.5 }} />
                      )}
                      {payment.status}
                    </Box>
                  </Tooltip>
                </TableCell>
                <TableCell>{payment.method}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainerStyled>
    </Box>
  );
};

// ** Testimonials Component
const Testimonials: React.FC<{ data: TestimonialType[] }> = ({ data }) => {
  return (
    <Box sx={{ mt: 15, mb: 15, px: { xs: 2, md: 0 } }}>
      <Typography variant="h5" align="center" gutterBottom>
        What Our Customers Say
      </Typography>
      <Typography variant="body2" align="center" gutterBottom>
        Hear from those who have experienced the difference.
      </Typography>
      <Grid container spacing={4} sx={{ mt: 4 }}>
        {data.map((testimonial) => (
          <Grid item xs={12} md={4} key={testimonial.id}>
            <TestimonialCard>
              <Avatar
                alt={testimonial.name}
                src={testimonial.avatar}
                sx={{ width: 64, height: 64, margin: "0 auto", mb: 2 }}
              />
              <Typography variant="h6" gutterBottom>
                {testimonial.name}
              </Typography>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                {testimonial.role}
              </Typography>
              <Typography variant="body2">{testimonial.feedback}</Typography>
            </TestimonialCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// ** FeatureComparisonTable Component
const FeatureComparisonTable: React.FC<{ data: PricingPlanType[] }> = ({
  data,
}) => {
  const allFeatures = Array.from(
    new Set(data.flatMap((plan) => plan.features))
  ).sort();

  return (
    <> </>
    // <Box sx={{ mt: 15, mb: 15, px: { xs: 2, md: 0 } }}>
    //   <Typography variant='h5' align='center' gutterBottom>
    //     Compare Plans
    //   </Typography>
    //   <Typography variant='body2' align='center' gutterBottom>
    //     Find the perfect plan that fits your needs.
    //   </Typography>
    //   <TableContainer component={Paper} sx={{ mt: 4, maxWidth: 1200, margin: '0 auto' }}>
    //     <Table>
    //       <TableHead>
    //         <TableRow>
    //           <TableCell><strong>Features</strong></TableCell>
    //           {data.map((plan) => (
    //             <TableCell key={plan.id} align='center'><strong>{plan.title}</strong></TableCell>
    //           ))}
    //         </TableRow>
    //       </TableHead>
    //       <TableBody>
    //         {allFeatures.map((feature, index) => (
    //           <TableRow key={index}>
    //             <TableCell>{feature}</TableCell>
    //             {data.map((plan) => (
    //               <TableCell key={plan.id} align='center'>
    //                 {plan.features.includes(feature) ? (
    //                   <CheckCircle color='success' />
    //                 ) : (
    //                   <CloseIcon color='error' />
    //                 )}
    //               </TableCell>
    //             ))}
    //           </TableRow>
    //         ))}
    //       </TableBody>
    //     </Table>
    //   </TableContainer>
    // </Box>
  );
};

// ** CostCalculator Component
const CostCalculator: React.FC = () => {
  const [users, setUsers] = useState<number>(1);
  const [storage, setStorage] = useState<number>(10); // in GB
  const [cpu, setCpu] = useState<number>(1); // Number of CPUs
  const [ram, setRam] = useState<number>(2); // in GB

  const calculateCost = () => {
    // Simple pricing logic: Base price + per user + per GB storage + CPU + RAM
    const basePrice = 0;
    const userPrice = users * 2;
    const storagePrice = storage * 0.5;
    const cpuPrice = cpu * 5;
    const ramPrice = ram * 3;
    return (basePrice + userPrice + storagePrice + cpuPrice + ramPrice).toFixed(
      2
    );
  };

  return (
    <Box sx={{ mt: 15, mb: 15, px: { xs: 2, md: 0 } }}>
      <Typography variant="h5" align="center" gutterBottom>
        Cost Calculator
      </Typography>
      <Typography variant="body2" align="center" gutterBottom>
        Estimate your potential costs based on your needs.
      </Typography>
      <Box
        sx={{
          maxWidth: 600,
          margin: "0 auto",
          mt: 4,
          p: 4,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography gutterBottom>Number of Users: {users}</Typography>
            <Slider
              value={users}
              min={1}
              max={10}
              step={1}
              onChange={(e, value) => setUsers(value as number)}
              valueLabelDisplay="auto"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography gutterBottom>Storage (GB): {storage} GB</Typography>
            <Slider
              value={storage}
              min={10}
              max={100}
              step={10}
              onChange={(e, value) => setStorage(value as number)}
              valueLabelDisplay="auto"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography gutterBottom>Number of CPUs: {cpu}</Typography>
            <Slider
              value={cpu}
              min={1}
              max={8}
              step={1}
              onChange={(e, value) => setCpu(value as number)}
              valueLabelDisplay="auto"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography gutterBottom>RAM (GB): {ram} GB</Typography>
            <Slider
              value={ram}
              min={2}
              max={32}
              step={2}
              onChange={(e, value) => setRam(value as number)}
              valueLabelDisplay="auto"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Estimated Monthly Cost:</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">${calculateCost()}</Typography>
          </Grid>
          {/* <Grid item xs={12}>
            <Button variant="contained" color="primary" fullWidth>
              Proceed to Checkout
            </Button>
          </Grid> */}
        </Grid>
      </Box>
    </Box>
  );
};

// ** Testimonials Data
const testimonialsData: TestimonialType[] = [
  {
    id: "test1",
    name: "Jane Doe",
    role: "CEO at TechCorp",
    avatar: "/images/avatars/jane-doe.jpg",
    feedback:
      "This platform has significantly boosted our productivity and scalability. Highly recommended!",
  },
  {
    id: "test2",
    name: "John Smith",
    role: "CTO at InnovateX",
    avatar: "/images/avatars/john-smith.jpg",
    feedback:
      "Exceptional service and support. The payment history feature is a game-changer for our billing processes.",
  },
  {
    id: "test3",
    name: "Alice Johnson",
    role: "Freelancer",
    avatar: "/images/avatars/alice-johnson.jpg",
    feedback:
      "Affordable and reliable. The cost calculator helped me choose the perfect plan for my needs.",
  },
];

// ** Pricing Component
const Pricing: React.FC = () => {
  // ** State
  const [plan, setPlan] = useState<"monthly" | "annually">("monthly");
  const [activeStep, setActiveStep] = useState<number>(0);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlanType | null>(
    null
  );

  // ** Sample Data (Replace with your actual data fetching logic)
  const data: PricingDataType = {
    pricingPlans: [
      {
        id: "basic",
        title: "Basic",
        price: 10,
        features: [
          "10 GB Storage",
          "100 GB Bandwidth",
          "Basic Support",
          "Single User",
          "Access to community forums",
        ],
        type: "vps",
      },
      {
        id: "standard",
        title: "Standard",
        price: 20,
        features: [
          "50 GB Storage",
          "500 GB Bandwidth",
          "Priority Support",
          "Up to 5 Users",
          "Access to community forums",
          "Advanced Analytics",
        ],
        isPopular: true,
        type: "vps",
      },
      {
        id: "premium",
        title: "Premium",
        price: 30,
        features: [
          "Unlimited Storage",
          "Unlimited Bandwidth",
          "24/7 Support",
          "Unlimited Users",
          "Advanced Security Features",
          "Dedicated Account Manager",
        ],
        type: "vps",
      },
      {
        id: "cloud-flex",
        title: "Cloud Flex",
        price: 0, // Price will be calculated dynamically
        features: [
          "Customizable Resources",
          "Pay-as-you-go",
          "High Availability",
          "Global Data Centers",
          "Scalable Infrastructure",
        ],
        type: "cloud",
      },
    ],
    faq: [
      {
        id: "faq1",
        question: "What is the refund policy?",
        answer: "You can request a refund within 30 days of purchase.",
      },
      {
        id: "faq2",
        question: "Can I upgrade my plan later?",
        answer:
          "Yes, you can upgrade your plan at any time from your account settings.",
      },
      {
        id: "faq3",
        question: "Do you offer discounts for annual subscriptions?",
        answer:
          "Yes, subscribing annually provides a 20% discount compared to monthly billing.",
      },
    ],
    paymentHistory: [
      {
        id: "pay1",
        date: "2023-09-15",
        amount: 20.0,
        status: "Completed",
        method: "Credit Card",
      },
      {
        id: "pay2",
        date: "2023-08-15",
        amount: 20.0,
        status: "Completed",
        method: "Credit Card",
      },
      {
        id: "pay3",
        date: "2023-07-15",
        amount: 20.0,
        status: "Completed",
        method: "Credit Card",
      },
      {
        id: "pay4",
        date: "2023-06-15",
        amount: 20.0,
        status: "Completed",
        method: "Credit Card",
      },
      {
        id: "pay5",
        date: "2023-05-15",
        amount: 20.0,
        status: "Failed",
        method: "Credit Card",
      },
    ],
    testimonials: testimonialsData,
  };

  // ** Handlers
  const handlePlanChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPlan(e.target.checked ? "annually" : "monthly");
  };

  const handleNextStep = () => {
    if (activeStep === 0 && selectedPlan) {
      setActiveStep((prev) => prev + 1);
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBackStep = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  // ** Additional Features Data
  const additionalFeatures = [
    {
      id: "feature1",
      icon: "mdi-server", // Replace with actual icon components if needed
      title: "Reliable Performance",
      description:
        "Experience high uptime and fast load times with our optimized infrastructure.",
    },
    {
      id: "feature2",
      icon: "mdi-shield-lock",
      title: "Robust Security",
      description:
        "Advanced security measures to protect your data around the clock.",
    },
    {
      id: "feature3",
      icon: "mdi-monitor-dashboard",
      title: "Comprehensive Monitoring",
      description:
        "Real-time insights into your usage and performance metrics.",
    },
  ];

  // ** Stepper Steps
  const steps = [
    {
      label: "Select Plan",
      content: (
        <>
          {/* Pricing Header */}
          <Box sx={{ mb: 12, textAlign: "center" }}>
            <Typography variant="h4">Pricing Plans</Typography>
            <Box sx={{ mt: 2.5, mb: 2.5 }}>
              <Typography variant="body2">
                All plans include 40+ advanced tools and features to boost your
                product.
              </Typography>
              <Typography variant="body2">
                Choose the best plan to fit your needs.
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
              }}
            >
              <InputLabel
                htmlFor="pricing-switch"
                sx={{
                  fontWeight: 500,
                  cursor: "pointer",
                  fontSize: "0.875rem",
                }}
              >
                Monthly
              </InputLabel>
              <Switch
                color="secondary"
                id="pricing-switch"
                onChange={handlePlanChange}
                checked={plan === "annually"}
              />
              <InputLabel
                htmlFor="pricing-switch"
                sx={{
                  fontWeight: 500,
                  cursor: "pointer",
                  fontSize: "0.875rem",
                }}
              >
                Annually
              </InputLabel>
            </Box>
          </Box>
          <Grid container spacing={6}>
            {data.pricingPlans.map((item: PricingPlanType) => (
              <Grid item xs={12} md={4} key={item.id}>
                <CardContentStyled
                  onClick={() => {
                    setSelectedPlan(item); // Set selected plan
                    handleNextStep(); // Proceed to the next step
                  }}
                  sx={{
                    border: item.isPopular ? "2px solid" : "1px solid",
                    borderColor: item.isPopular ? "primary.main" : "divider",
                    boxShadow: item.isPopular ? 3 : 1,
                    position: "relative",
                    transition: "transform 0.3s",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: 6,
                    },
                    cursor: "pointer",
                  }}
                >
                  {item.isPopular && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: -20,
                        right: -20,
                        color: "common.white",
                        padding: "4px 12px",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        boxShadow: 2,
                      }}
                    >
                      Most Popular
                    </Box>
                  )}
                  <Typography variant="h6" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="h4" color="primary" gutterBottom>
                    {item.type === "cloud"
                      ? "Flexible Pricing"
                      : `$${item.price}`}
                    {item.type === "vps" &&
                      (plan === "annually" ? "/year" : "/month")}
                  </Typography>
                  <Box
                    component="ul"
                    sx={{ listStyle: "none", padding: 0, mb: 3 }}
                  >
                    {item.features.map((feature, index) => (
                      <Typography
                        component="li"
                        key={index}
                        variant="body2"
                        sx={{ mb: 1 }}
                      >
                        • {feature}
                      </Typography>
                    ))}
                  </Box>
                  <Button
                    variant={item.isPopular ? "contained" : "outlined"}
                    fullWidth
                  >
                    Choose Plan
                  </Button>
                </CardContentStyled>
              </Grid>
            ))}
          </Grid>
        </>
      ),
    },
    {
      label: "Configure Resources",
      content: (
        <Box sx={{ mt: 4 }}>
          {/* Conditional Rendering based on selected plan type */}
          {/* For simplicity, assuming user selected 'cloud-flex' */}
          <Typography variant="h6" gutterBottom>
            Configure Your Cloud Flex Resources
          </Typography>
          <CostCalculator />
          {/* Add more resource configurations as needed */}
          <Button variant="contained" sx={{ mt: 4 }} onClick={handleNextStep}>
            Proceed to Payment
          </Button>
        </Box>
      ),
      enableOn: selectedPlan?.id !== "cloud-flex",
    },
    {
      label: "Payment Details",
      content: (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Enter Your Payment Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Full Name"
                variant="outlined"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email Address"
                variant="outlined"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Credit Card Number"
                variant="outlined"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="Expiry Date"
                variant="outlined"
                fullWidth
                required
                placeholder="MM/YY"
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField label="CVV" variant="outlined" fullWidth required />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleNextStep}
              >
                Complete Purchase
              </Button>
            </Grid>
          </Grid>
        </Box>
      ),
    },
    {
      label: "Confirmation",
      content: (
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="h5" gutterBottom>
            Thank You for Your Purchase!
          </Typography>
          <Typography variant="body1" gutterBottom>
            Your transaction has been successfully completed. You can view your
            payment history in your account settings.
          </Typography>
          <Button variant="contained" color="primary" onClick={handleReset}>
            Back to Pricing
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%", padding: { xs: 2, sm: 4, md: 6 } }}>
      {/* Additional Features */}
      {/* <Box sx={{ mt: 15, mb: 15, textAlign: "center" }}>
        <Typography variant="h5" align="center" gutterBottom>
          Why Choose Us
        </Typography>
        <Typography variant="body2" align="center" gutterBottom>
          Our platform offers a wide range of features designed to help you
          succeed.
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {additionalFeatures.map((feature) => (
            <Grid item xs={12} md={4} key={feature.id}>
              <Box sx={{ textAlign: "center", px: 2 }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    margin: "0 auto",
                    mb: 2,
                    backgroundColor: "primary.main",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "common.white",
                    fontSize: "2rem",
                    transition: "background-color 0.3s",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                  }}
                >
                  {feature.icon === "mdi-server" && <CloudIcon />}
                  {feature.icon === "mdi-shield-lock" && <SecurityIcon />}
                  {feature.icon === "mdi-monitor-dashboard" && (
                    <DashboardIcon />
                  )}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2">{feature.description}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box> */}

      {/* Stepper for Multi-Step Process */}
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps
          .filter((val) => !val.enableOn)
          .map((step, index) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
              <StepContent>
                <StepContainer>{step.content}</StepContainer>
                <Box sx={{ mb: 2 }}>
                  <div>
                    {activeStep !== 0 && activeStep !== steps.length - 1 && (
                      <Button onClick={handleBackStep} sx={{ mr: 1 }}>
                        Back
                      </Button>
                    )}
                  </div>
                </Box>
              </StepContent>
            </Step>
          ))}
      </Stepper>

      {/* Pricing Plans */}
      {/* {activeStep === 0 && (
        <Grid container spacing={6}>
          {data.pricingPlans.map((item: PricingPlanType) => (
            <Grid item xs={12} md={4} key={item.id}>
              <CardContentStyled
                sx={{
                  border: item.isPopular ? '2px solid' : '1px solid',
                  borderColor: item.isPopular ? 'primary.main' : 'divider',
                  boxShadow: item.isPopular ? 3 : 1,
                  position: 'relative',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 6,
                  },
                  cursor: 'pointer',
                }}
                onClick={() => handleNextStep()}
              >
                {item.isPopular && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -20,
                      right: -20,
                      backgroundColor: 'primary.main',
                      color: 'common.white',
                      padding: '4px 12px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      boxShadow: 2,
                    }}
                  >
                    Most Popular
                  </Box>
                )}
                <Typography variant='h6' gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant='h4' color='primary' gutterBottom>
                  {item.type === 'cloud' ? 'Flexible Pricing' : `$${item.price}`}
                  {item.type === 'vps' && (plan === 'annually' ? '/year' : '/month')}
                </Typography>
                <Box component='ul' sx={{ listStyle: 'none', padding: 0, mb: 3 }}>
                  {item.features.slice(0, 3).map((feature, index) => (
                    <Typography component='li' key={index} variant='body2' sx={{ mb: 1 }}>
                      • {feature}
                    </Typography>
                  ))}
                  {item.features.length > 3 && (
                    <Typography
                      component='li'
                      variant='body2'
                      sx={{ color: 'primary.main', cursor: 'pointer' }}
                      onClick={() => {}}
                    >
                      +{item.features.length - 3} more
                    </Typography>
                  )}
                </Box>
                <Button variant={item.isPopular ? 'contained' : 'outlined'} fullWidth>
                  Choose Plan
                </Button>
              </CardContentStyled>
            </Grid>
          ))}
        </Grid>
      )} */}

      {/* Feature Comparison Table */}
      {/* <FeatureComparisonTable data={data.pricingPlans} /> */}

      {/* Payment History */}
      {/* <PaymentHistoryTable data={data.paymentHistory} /> */}

      {/* Testimonials */}
      {/* <Testimonials data={data.testimonials} /> */}

      {/* Pricing FAQ */}
      <Box sx={{ mt: 15, mb: 12, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          FAQs
        </Typography>
        <Typography variant="body2" gutterBottom>
          Let us help answer the most common questions.
        </Typography>
        <Grid
          container
          spacing={2}
          sx={{ maxWidth: 800, margin: "0 auto", mt: 4 }}
        >
          {data.faq.map((item: PricingFaqType) => (
            <Grid item xs={12} key={item.id}>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ChevronDown />}
                  aria-controls={`faq-content-${item.id}`}
                  id={`faq-header-${item.id}`}
                >
                  <Typography>{item.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>{item.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Pricing CTA */}
      <BoxWrapper>
        <Grid container spacing={5} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h5" sx={{ mb: 2.5, color: "primary.main" }}>
              Still not convinced? Start with a 14-day FREE trial!
            </Typography>
            <Typography variant="body2" sx={{ mb: 10 }}>
              You will get full access with all the features for 14 days.
            </Typography>
            <Button variant="contained" size="large">
              Start 14-day FREE trial
            </Button>
          </Grid>
          <GridStyled item xs={12} md={4}>
            <Img
              alt="pricing-cta-avatar"
              src="/images/pages/pricing-cta-illustration.png"
            />
          </GridStyled>
        </Grid>
      </BoxWrapper>
    </Box>
  );
};

export default Pricing;
