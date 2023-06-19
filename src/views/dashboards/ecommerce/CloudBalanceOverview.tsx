// ** React Imports
import { ReactElement, useEffect, useState } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";

// ** Icons Imports
import Poll from "mdi-material-ui/Poll";
import TrendingUp from "mdi-material-ui/TrendingUp";
import DotsVertical from "mdi-material-ui/DotsVertical";
import AccountOutline from "mdi-material-ui/AccountOutline";

// ** Types
import { ThemeColor } from "src/@core/layouts/types";

// ** Spinner Import
import { CircularProgress } from "@mui/material";

// ** Custom Components Imports
import CustomAvatar from "src/@core/components/mui/avatar";

// ** Custom Data Hook
import useGetUser from "src/hooks/useGetUser";
import { UserFinanceDataType } from "src/context/types";
import { isNullOrUndefined } from "util";

const CURRENCY = {
  symbol: "₺",
  name: "Turk Lirasi",
  shortName: "TRY",
};

interface BalanceDataType {
  stats: string;
  title: string;
  color: ThemeColor;
  icon: ReactElement;
}

const BalanceOverviewData: BalanceDataType[] = [
  {
    stats: "N/A" + CURRENCY.symbol,
    color: "primary",
    title: "Hesap Bakiyesi",
    icon: <AccountOutline />,
  },
  {
    icon: <Poll />,
    stats: "Yok",
    color: "warning",
    title: "Sabit Aylik Odemeler",
  },
  {
    color: "info",
    stats: "Yok",
    icon: <TrendingUp />,
    title: "Kayitli Kredi Karti",
  },
];

const renderStats = (userFinance: UserFinanceDataType | null) => {
  if (isNullOrUndefined(userFinance)) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Account balance not found.
        </Typography>
        <Typography variant="caption">```</Typography>
      </Box>
    );
  } else {
    BalanceOverviewData[0].stats = BalanceOverviewData[0].stats.replace(
      "N/A",
      userFinance.balance.toString()
    );

    return BalanceOverviewData.map((sale: BalanceDataType, index: number) => (
      <Grid item xs={12} sm={4} key={index}>
        <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
          <CustomAvatar
            skin="light"
            variant="rounded"
            color={sale.color}
            sx={{ mr: 4 }}
          >
            {sale.icon}
          </CustomAvatar>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {sale.stats}
            </Typography>
            <Typography variant="caption">{sale.title}</Typography>
          </Box>
        </Box>
      </Grid>
    ));
  }
};

const renderLoading = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <CircularProgress
        disableShrink
        sx={{
          mt: 6,
        }}
      />
    </Box>
  );
};

const CloudBalanceOverview = () => {
  const { userFinance, loading } = useGetUser();
  useEffect(() => {
    console.log(userFinance);
    console.log(loading);
  }, [userFinance, loading]);

  return (
    <Card>
      <CardHeader
        sx={{ pb: 3.25 }}
        title="Bakiye Durumu"
        titleTypographyProps={{ variant: "h6" }}
        action={
          <IconButton aria-label="settings" className="card-more-options">
            <DotsVertical />
          </IconButton>
        }
        // subheader={
        //   <Box sx={{ display: "flex", alignItems: "center" }}>
        //     <Typography variant="caption" sx={{ mr: 1.5 }}>
        //       Total 42.5k Sales
        //     </Typography>
        //     <Typography variant="subtitle2" sx={{ color: "success.main" }}>
        //       +18%
        //     </Typography>
        //     <ChevronUp fontSize="small" sx={{ color: "success.main" }} />
        //   </Box>
        // }
      />
      <CardContent>
        <Grid container spacing={6}>
          {!loading ? renderStats(userFinance) : renderLoading()}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CloudBalanceOverview;
