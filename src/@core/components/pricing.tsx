// PricingPage.tsx

// ** React Imports
import React, { useState, ChangeEvent, SyntheticEvent, useEffect } from "react";

// ** MUI Imports
import {
  Box,
  Button,
  Grid,
  Switch,
  Typography,
  InputLabel,
  CardContent as MuiCardContent,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Slider,
  Card,
  CardContent,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// ** Types
interface PricingPlanType {
  id: string;
  title: string;
  price: number;
  features?: string[];
  accounts?: number;
  hardware: {
    cpu: number;
    ram: number;
    storage: number;
  };
  isPopular?: boolean;
  type: "cloud" | "vps";
}

interface PricingDataType {
  pricingPlans: PricingPlanType[];
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

const StepContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

// ** CostCalculator Component
const CostCalculator = (props: {
  setResources(arg0: Object): void;
  setCost(arg0: number): void;
}) => {
  const [storage, setStorage] = useState<number>(10); // in GB
  const [cpu, setCpu] = useState<number>(1); // Number of CPUs
  const [ram, setRam] = useState<number>(2); // in GB
  const [calculatedCost, setCalculatedCost] = useState<string>("0.00");

  const calculateCost = () => {
    // Simple pricing logic: Base price + per user + per GB storage + CPU + RAM
    const basePrice = 0;
    const storagePrice = storage * 0.5;
    const cpuPrice = cpu * 5;
    const ramPrice = ram * 3;

    const cost = (basePrice + storagePrice + cpuPrice + ramPrice).toFixed(2);
    return cost;
  };

  useEffect(() => {
    props.setResources({ storage, cpu, ram });
    setCalculatedCost(calculateCost());
    props.setCost(Number(calculateCost()));
  }, [storage, cpu, ram, calculatedCost]);

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

// ** Pricing Component
const Pricing = (props: {
  onSelect: (selectedPackage: any) => void;
  goToNextPage: Function;
}) => {
  // ** State
  const [plan, setPlan] = useState<"monthly" | "annually">("monthly");
  const [activeStep, setActiveStep] = useState<number>(0);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlanType | null>(
    null
  );

  const [resources, setResources] = useState<PricingPlanType["hardware"]>();
  const [cost, setCost] = useState<number>(0);

  useEffect(() => {
    if (selectedPlan?.id === "cloud-flex") {
      setSelectedPlan({
        ...selectedPlan,
        hardware: resources as PricingPlanType["hardware"],
        price: cost,
      });
    }
  }, [cost, resources]);

  // ** Sample Data (Replace with your actual data fetching logic)
  const data: PricingDataType = {
    pricingPlans: [
      {
        id: "basic",
        title: "Basic",
        price: 10,
        hardware: {
          cpu: 1,
          ram: 1024,
          storage: 10,
        },
        features: [
          "1 VCPU",
          "10 GB Storage",
          "1 GB RAM",
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
        hardware: {
          cpu: 2,
          ram: 2048,
          storage: 20,
        },
        features: [
          "2 VCPUs",
          "20 GB Storage",
          "2 GB RAM",
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
        hardware: {
          cpu: 4,
          ram: 4096,
          storage: 50,
        },
        features: [
          "4 VCPUs",
          "50 GB Storage",
          "4 GB RAM",
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
        hardware: {
          cpu: 0,
          ram: 0,
          storage: 0,
        },
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
  };

  // ** Handlers
  const handlePlanChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPlan(e.target.checked ? "annually" : "monthly");
  };

  const handleNextStep = (isLastStep?: boolean) => {
    if (isLastStep) {
      props.goToNextPage({
        ...selectedPlan,
        price: cost,
        hardware: resources as PricingPlanType["hardware"],
      });
    }

    setActiveStep((prev) => prev + 1);
  };

  const handleBackStep = () => {
    setActiveStep((prev) => prev - 1);
  };

  // ** Stepper Steps
  const steps = [
    {
      label: "Select Plan",
      content: (
        <>
          {/* Pricing Header */}
          <Box sx={{ mb: 12, textAlign: "center" }}>
            {/* <Typography variant="h4">Pricing Plans</Typography> */}
            <Box sx={{ mt: 2.5, mb: 2.5 }}>
              {/* <Typography variant="body2">
                All plans include 40+ advanced tools and features to boost your
                product.
              </Typography> */}
              <Typography variant="h6">
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
                    const { features, ...rest } = item;
                    setSelectedPlan(rest); // Set selected plan
                    setCost(item.price);
                    setResources(item.hardware);
                    props.onSelect(rest);
                    handleNextStep();
                  }}
                  sx={{
                    border: item.isPopular ? "2px solid" : "1px solid",
                    borderColor:
                      selectedPlan?.id === item.id ? "primary.main" : "divider",
                    boxShadow: item.isPopular ? 3 : 1,
                    borderWidth: selectedPlan?.id === item.id ? 3 : 1,
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
                    {item.features ? (
                      item.features.map((feature, index) => (
                        <Typography
                          component="li"
                          key={index + "_feature"}
                          variant="body2"
                          sx={{ mb: 1 }}
                        >
                          • {feature}
                        </Typography>
                      ))
                    ) : (
                      <> </>
                    )}
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
          <CostCalculator
            setCost={(cost) => {
              setCost(cost);
            }}
            setResources={(resources) => {
              setResources(
                resources as { cpu: number; ram: number; storage: number }
              );
            }}
          />
          {/* Add more resource configurations as needed */}
          <Button
            variant="contained"
            sx={{ mt: 4 }}
            onClick={() => {
              handleNextStep();
            }}
          >
            Next
          </Button>
        </Box>
      ),
      enableOn: selectedPlan?.id !== "cloud-flex",
    },
    {
      label: "Configuration Summary",
      content: (
        <Box sx={{ mt: 4 }}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Review Your Configuration
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Plan:</strong> {selectedPlan?.title}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Type:</strong> {selectedPlan?.type}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Price:</strong> ${selectedPlan?.price}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Storage:</strong> {selectedPlan?.hardware?.storage}{" "}
                    GB
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>CPU:</strong> {selectedPlan?.hardware?.cpu} Core
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>RAM:</strong> {selectedPlan?.hardware?.ram} GB
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  display="flex"
                  justifyContent="flex-end"
                  alignItems="flex-end"
                >
                  <Button
                    variant="outlined"
                    sx={{ mt: 4, mr: 2 }}
                    onClick={() => handleBackStep()}
                  >
                    Back
                  </Button>

                  <Button
                    variant="contained"
                    sx={{ mt: 4 }}
                    onClick={() => handleNextStep(true)}
                  >
                    Confirm
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%", padding: { xs: 2, sm: 4, md: 6 } }}>
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
    </Box>
  );
};

export default Pricing;
