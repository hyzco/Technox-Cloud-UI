import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Button,
  Chip,
  useTheme,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  AttachMoney,
  CreditCard,
  History,
  Subscriptions,
  ShoppingCart,
  CalendarToday,
} from "@mui/icons-material";
import { HTTP_METHOD } from "src/@core/enums/axios.enum";
import vmApi from "src/@core/apis/vmApi";
import useAxiosFunction from "src/@core/hooks/useAxiosFunction";
import userConfig from "src/configs/user";
import { useAuth } from "src/hooks/useAuth";

interface PurchaseHistory {
  id: number;
  service_name: string;
  plan_name: string;
  price: string;
  purchase_date: string;
}

interface ActiveSubscription {
  subscription_id: number;
  service_name: string;
  plan_name: string;
  start_date: string;
  expiry_date: string;
  status: string;
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return new Date(dateString).toLocaleString(undefined, options);
};

const PaymentsView: React.FC = () => {
  const theme = useTheme();
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistory[]>([]);
  const [activeSubscriptions, setActiveSubscriptions] = useState<
    ActiveSubscription[]
  >([]);
  const [totalSpent, setTotalSpent] = useState<number>(0);
  const {
    response: purchaseResponse,
    error: purchaseError,
    loading: purchaseLoading,
    axiosFetch: fetchPurchaseHistory,
  } = useAxiosFunction();
  const {
    response: subscriptionsResponse,
    error: subscriptionsError,
    loading: subscriptionsLoading,
    axiosFetch: fetchSubscriptions,
  } = useAxiosFunction();

  const storedToken = window.localStorage.getItem(
    userConfig.storageTokenKeyName
  )!;
  const { user } = useAuth();

  const fetchData = () => {
    fetchPurchaseHistory({
      axiosInstance: vmApi,
      method: HTTP_METHOD.GET,
      url: "/user/purchase/history",
      headers: { Authorization: storedToken },
    });
    fetchSubscriptions({
      axiosInstance: vmApi,
      method: HTTP_METHOD.GET,
      url: "/user/subscriptions/active",
      headers: { Authorization: storedToken },
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (purchaseResponse) {
      setPurchaseHistory(purchaseResponse);
      const total = purchaseResponse.reduce(
        (sum: number, purchase: { price: string }) =>
          sum + parseFloat(purchase.price),
        0
      );
      setTotalSpent(total);
    }
  }, [purchaseResponse]);

  useEffect(() => {
    if (subscriptionsResponse) {
      setActiveSubscriptions(subscriptionsResponse);
    }
  }, [subscriptionsResponse]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 3,
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ mb: 4, color: theme.palette.text.primary }}
      >
        Payment Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card
            elevation={3}
            sx={{
              height: "100%",
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                  <AttachMoney />
                </Avatar>
                <Typography variant="h6" color="text.primary">
                  Balance
                </Typography>
              </Box>
              <Typography variant="h4" color="text.primary">
                ${user?.balance}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            elevation={3}
            sx={{
              height: "100%",
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: theme.palette.background.paper, mr: 2 }}>
                  <ShoppingCart />
                </Avatar>
                <Typography variant="h6" color="text.primary">
                  Total Purchases
                </Typography>
              </Box>
              <Typography variant="h4" color="text.primary">
                ${totalSpent.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            elevation={3}
            sx={{
              height: "100%",
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: theme.palette.background.paper, mr: 2 }}>
                  <Subscriptions />
                </Avatar>
                <Typography variant="h6" color="text.primary">
                  Active Subscriptions
                </Typography>
              </Box>
              <Typography variant="h4" color="text.primary">
                {activeSubscriptions.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Card
            elevation={3}
            sx={{ backgroundColor: theme.palette.background.paper }}
          >
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: theme.palette.text.primary,
                }}
              >
                <History sx={{ mr: 1 }} /> Purchase History
              </Typography>
              {purchaseLoading ? (
                <CircularProgress />
              ) : purchaseError ? (
                <Typography color="error">
                  Failed to load purchase history
                </Typography>
              ) : purchaseHistory.length === 0 ? (
                <Typography color="text.secondary">
                  You have no purchase history.
                </Typography>
              ) : (
                <List>
                  {purchaseHistory.map((purchase, index) => (
                    <React.Fragment key={purchase.id}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                            <CreditCard />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography
                              variant="subtitle1"
                              color="text.primary"
                            >
                              {purchase.service_name} - {purchase.plan_name}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.secondary"
                              >
                                ${purchase.price}
                              </Typography>
                              {" — "}
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.secondary"
                              >
                                {formatDate(purchase.purchase_date)}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                      {index < purchaseHistory.length - 1 && (
                        <Divider variant="inset" component="li" />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card
            elevation={3}
            sx={{ backgroundColor: theme.palette.background.paper }}
          >
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: theme.palette.text.primary,
                }}
              >
                <Subscriptions sx={{ mr: 1 }} /> Active Subscriptions
              </Typography>
              {subscriptionsLoading ? (
                <CircularProgress />
              ) : subscriptionsError ? (
                <Typography color="error">
                  Failed to load active subscriptions
                </Typography>
              ) : activeSubscriptions.length === 0 ? (
                <Typography color="text.secondary">
                  You have no active subscriptions.
                </Typography>
              ) : (
                <List>
                  {activeSubscriptions.map((subscription, index) => (
                    <React.Fragment key={subscription.subscription_id}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar
                            sx={{ bgcolor: theme.palette.secondary.main }}
                          >
                            <CalendarToday />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography
                              variant="subtitle1"
                              color="text.primary"
                            >
                              {subscription.service_name} -{" "}
                              {subscription.plan_name}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.secondary"
                              >
                                Status:{" "}
                                <Chip
                                  label={subscription.status}
                                  color={
                                    subscription.status === "active"
                                      ? "primary"
                                      : "warning"
                                  }
                                  size="small"
                                />
                              </Typography>
                              <br />
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.secondary"
                              >
                                Expires: {formatDate(subscription.expiry_date)}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                      {index < activeSubscriptions.length - 1 && (
                        <Divider variant="inset" component="li" />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={fetchData}
          startIcon={<Subscriptions />}
        >
          Refresh Data
        </Button>
      </Box> */}
    </Box>
  );
};

export default PaymentsView;
