// ** React Imports
import { ReactElement } from "react";

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
import ChevronUp from "mdi-material-ui/ChevronUp";
import TrendingUp from "mdi-material-ui/TrendingUp";
import DotsVertical from "mdi-material-ui/DotsVertical";
import AccountOutline from "mdi-material-ui/AccountOutline";

// ** Types
import { ThemeColor } from "src/@core/layouts/types";

// ** Custom Components Imports
import CustomAvatar from "src/@core/components/mui/avatar";

const CURRENCY = {
  symbol: "₺",
  name: "Turk Lirasi",
  shortName: "TRY",
};

interface SaleDataType {
  stats: string;
  title: string;
  color: ThemeColor;
  icon: ReactElement;
}

const salesData: SaleDataType[] = [
  {
    stats: "100" + CURRENCY.symbol,
    color: "primary",
    title: "Hesap Bakiyesi",
    icon: <AccountOutline />,
  },
  {
    icon: <Poll />,
    stats: "Odemeniz Yok",
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

const renderStats = () => {
  return salesData.map((sale: SaleDataType, index: number) => (
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
};

const CloudBalanceOverview = () => {
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
          {renderStats()}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CloudBalanceOverview;