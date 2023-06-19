import { Box, Card, CardHeader, Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import FallbackSpinner from "src/@core/components/spinner";

const renderPowerStatus = (powerStatus: any) => {
  enum POWER_STATUS {
    POWERED_OFF = "POWERED_OFF",
    POWERED_ON = "POWERED_ON",
  }

  if (powerStatus === POWER_STATUS.POWERED_ON) {
    const element = (
      <Typography
        variant="body1"
        sx={{ display: "flex", alignItems: "center" }}
      >
        <>
          <strong>Power Status: </strong> Running
        </>
        <Box
          sx={{
            marginLeft: 1,
            width: 14,
            height: 14,
            backgroundColor: "green",
            borderRadius: "50%",
          }}
        ></Box>
      </Typography>
    );
    return element;
  } else if (powerStatus === POWER_STATUS.POWERED_OFF) {
    const element = (
      <Typography
        variant="body1"
        sx={{ display: "flex", alignItems: "center" }}
      >
        <>
          <strong>Power Status: </strong> Stopped
        </>

        <Box
          sx={{
            marginLeft: 1,
            width: 14,
            height: 14,
            backgroundColor: "red",
            borderRadius: "50%",
          }}
        ></Box>
      </Typography>
    );
    return element;
  } else {
    const element = (
      <Typography
        variant="body1"
        sx={{ display: "flex", alignItems: "center" }}
      >
        <>
          <strong>Power Status: </strong> Unknown
        </>

        <Box
          sx={{
            marginLeft: 1,
            width: 14,
            height: 14,
            backgroundColor: "grey",
            borderRadius: "50%",
          }}
        ></Box>
      </Typography>
    );
    return element;
  }
};

const renderIpAddress = (ipAddress: Array<Object>) => {
  const qntyIp = ipAddress.length;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        // marginLeft: "16px",
      }}
    >
      <Typography variant="body1">
        <strong>IP Addresses ({qntyIp}):</strong>
      </Typography>
      <Box sx={{ marginLeft: 5 }}>
        {ipAddress.map((address: any) => {
          return (
            <Typography key={address.ip} variant="body1">
              {address.ip}
            </Typography>
          );
        })}
      </Box>
    </Box>
  );
};

const ServerView = (props: any) => {
  const theme = useTheme();
  const { data } = props;

  if (data == null) {
    return (
      <Card
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <CardHeader
          title="Server View"
          titleTypographyProps={{ variant: "h6" }}
          subheaderTypographyProps={{ variant: "caption" }}
          subheader="View your server details."
        />
        <FallbackSpinner />
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Server View"
        titleTypographyProps={{ variant: "h6" }}
        subheaderTypographyProps={{ variant: "caption" }}
        subheader="View your server details."
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: theme.palette.background.default,
          padding: "16px",
          marginLeft: "20px",
          marginRight: "20px",
          marginBottom: "10px",
          borderRadius: "4px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: "250px",
            borderRadius: "4px",
            marginBottom: "10px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "400px",
              minWidth: "200px",
              height: "100%",
              backgroundColor: "black",
              marginRight: "16px",
            }}
          ></Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              height: "100%",
              marginLeft: 5,
              marginTop: 5,
            }}
          >
            <Typography variant="h6">Guest OS</Typography>
            <Box
              id="guestOsField"
              sx={{
                marginTop: 5,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {renderPowerStatus(data.power_state)}
              <Typography variant="body1">
                <strong>Guest OS:</strong>&nbsp; {data.os_name}
              </Typography>
              <Typography variant="body1">
                <strong>DNS Name (1):</strong>&nbsp; {data.host_name}
              </Typography>
              {renderIpAddress([{ ip: data.ip_address }])}
              {/* <Typography variant="body1">
                <strong>Encryption:</strong>&nbsp; Not encrypted
              </Typography> */}
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            // backgroundColor: theme.palette.background.default,
            // padding: "16px",
            // marginLeft: "16px",
            borderRadius: "4px",
          }}
        >
          <Typography variant="body1">Uptime: 1h 45s</Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default ServerView;
