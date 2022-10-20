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
import useGetUser from "src/hooks/useGetUser";
import { UserServerDataType } from "src/context/types";
import CircularProgress from "@mui/material/CircularProgress";
import { isNullOrUndefined } from "util";

interface AssetDataType {
  stats: string;
  title: string;
  color: ThemeColor;
  icon: ReactElement;
}

const STATS_ARR = ["[TOTAL_SERVER]", "[ACTIVE_SERVER]", "[DEACTIVE_SERVER]"];

const AssetsOverview: AssetDataType[] = [
  {
    stats: "[TOTAL_SERVER]",
    color: "primary",
    title: "Total Sunucular",
    icon: <AccountOutline />,
  },
  {
    icon: <Poll />,
    stats: "[ACTIVE_SERVER]",
    color: "warning",
    title: "Aktif Sunucular",
  },
  {
    color: "info",
    stats: "[DEACTIVE_SERVER]",
    icon: <TrendingUp />,
    title: "Pasif Sunucular",
  },
];

const renderStats = (userServer: UserServerDataType | null) => {
  if (isNullOrUndefined(userServer)) {
    userServer = {
      totalServer: 0,
      activeServerID: {},
      deactiveServerID: {},
    };
  }

  const userServerData: any = [
    userServer.totalServer,
    userServer.activeServerID,
    userServer.deactiveServerID,
  ];

  AssetsOverview.forEach((val, i) => {
    AssetsOverview[i].stats = val.stats.replace(
      STATS_ARR[i],
      userServerData[i]
    );
  });

  return AssetsOverview.map((sale: AssetDataType, index: number) => (
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

const CloudAssetsOverview = () => {
  const { userServer, loading } = useGetUser();

  return (
    <Card>
      <CardHeader
        sx={{ pb: 3.25 }}
        title="Varliklarim"
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
          {!loading ? renderStats(userServer) : renderLoading()}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CloudAssetsOverview;
