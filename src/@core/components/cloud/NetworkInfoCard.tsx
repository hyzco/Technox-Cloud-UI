import { Grid, Card, CardContent, Typography, Chip } from "@mui/material";

const parseNetworkInfo = (networkInfo: any) => {
  if (typeof networkInfo !== "object" || networkInfo === null) {
    return [];
  }

  return Object.keys(networkInfo)
    .filter((key) => key.startsWith("net"))
    .map((key) => {
      const netData = networkInfo[key];
      const network = Object.fromEntries(
        netData.split(",").map((item: string) => item.split("="))
      );
      return {
        name: network.name,
        bridge: network.bridge,
        ip: network.ip,
        gw: network.gw,
        hwaddr: network.hwaddr,
        firewall: network.firewall,
      };
    });
};
const NetworkInfoCard = ({ networkInfo }: { networkInfo: any }) => {
  // Parse the networkInfo using the custom function
  const validNetworkInfo = parseNetworkInfo(networkInfo);

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Network Details
        </Typography>
        <Grid container spacing={1} alignItems="center">
          {validNetworkInfo.map((network, index) => (
            <Grid container item xs={12} spacing={2} key={index}>
              <Grid item xs={2}>
                <Typography variant="subtitle2" color="primary">
                  Interface
                </Typography>
                <Typography variant="body2">{network.name}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="subtitle2" color="primary">
                  Bridge
                </Typography>
                <Typography variant="body2">{network.bridge}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="subtitle2" color="primary">
                  IP Address
                </Typography>
                <Typography variant="body2">{network.ip}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="subtitle2" color="primary">
                  Gateway
                </Typography>
                <Typography variant="body2">{network.gw}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="subtitle2" color="primary">
                  MAC Address
                </Typography>
                <Typography variant="body2">{network.hwaddr}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="subtitle2" color="primary">
                  Firewall
                </Typography>
                <Chip
                  label={network.firewall === "0" ? "Disabled" : "Enabled"}
                  color={network.firewall === "0" ? "error" : "success"}
                  size="small"
                />
              </Grid>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default NetworkInfoCard;
