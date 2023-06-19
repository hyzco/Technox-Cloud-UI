// ** MUI Imports
import Grid from "@mui/material/Grid";

// ** Styled Component Import
import KeenSliderWrapper from "src/@core/styles/libs/keen-slider";
import ApexChartWrapper from "src/@core/styles/libs/react-apexcharts";

// ** Demo Components Imports
import EcommerceTable from "src/views/dashboards/ecommerce/EcommerceTable";
import EcommerceActivityTimeline from "src/views/dashboards/ecommerce/EcommerceActivityTimeline";
import EcommerceSalesOverviewWithTabs from "src/views/dashboards/ecommerce/EcommerceSalesOverviewWithTabs";
import CloudBalanceOverview from "src/views/dashboards/ecommerce/CloudBalanceOverview";
import CloudAssetsOverview from "src/views/dashboards/ecommerce/CloudAssetsOverview";
import { Card, CardHeader } from "@mui/material";
import ServerView from "src/views/components/view-server/serverView";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ViewServer = () => {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const isRouterEmpty = Object.keys(router.query).length > 1 ? false : true;

  useEffect(() => {
    console.log("here");

    if (isRouterEmpty) {
      console.log("empty");
      //TODO: do caching for router.query data when user reloads page - for now redirection to prev page.
      router.push("/views/servers");
    } else {
      setData(router.query);
    }
  }, []);

  return (
    <ApexChartWrapper>
      <KeenSliderWrapper>
        <Grid container spacing={6} className="match-height">
          <Grid item xs={12} md={6}>
            <ServerView data={isRouterEmpty ? data : router.query} />
          </Grid>
          {/* <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                sx={{ pb: 3.25 }}
                title="Varliklarim"
                titleTypographyProps={{ variant: "h6" }}

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
              <p>Test Test Test</p>
              <p>Test Test Test</p>
              <p>Test Test Test</p>
            </Card>
          </Grid> */}
          {/* <Grid item xs={12} md={4}>
            <Card>
              <CardHeader
                sx={{ pb: 3.25 }}
                title="Varliklarim"
                titleTypographyProps={{ variant: "h6" }}

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
              <p>Test Test Test</p>
              <p>Test Test Test</p>
              <p>Test Test Test</p>
              <p>Test Test Test</p>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader
                sx={{ pb: 3.25 }}
                title="Varliklarim"
                titleTypographyProps={{ variant: "h6" }}

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
              <p>Test Test Test</p>
              <p>Test Test Test</p>
              <p>Test Test Test</p>
              <p>Test Test Test</p>
            </Card>{" "}
          </Grid>
          <Grid item xs={12} md={4} sx={{ order: 3 }}>
            <Card>
              <CardHeader
                sx={{ pb: 3.25 }}
                title="Varliklarim"
                titleTypographyProps={{ variant: "h6" }}

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
              <p>Test Test Test</p>
              <p>Test Test Test</p>
              <p>Test Test Test</p>
              <p>Test Test Test</p>
            </Card>
          </Grid> */}

          {/* <Grid item xs={12} sm={6} md={3}>
            <EcommerceImpressionsOrders />
          </Grid>
          <Grid item xs={12} md={5} sx={{ order: [2, 2, 1] }}>
            <EcommerceMarketingSales />
          </Grid>
          <Grid item xs={12} sm={6} md={4} sx={{ order: [1, 1, 2] }}>
            <EcommerceLiveVisitors />
          </Grid> */}
          {/* <Grid item xs={12} md={6}>
            <EcommerceWeeklySalesBg />
          </Grid> */}
          {/* <Grid item xs={12} sm={6}>
            <EcommerceTotalVisits />
          </Grid>
          <Grid item xs={12} sm={6}>
            <EcommerceSalesThisMonth />
          </Grid> */}

          {/* <Grid item xs={12} md={4} sx={{ order: 3 }}>
            <EcommerceVisitsByDay />
          </Grid> */}
        </Grid>
      </KeenSliderWrapper>
    </ApexChartWrapper>
  );
};

export default ViewServer;
