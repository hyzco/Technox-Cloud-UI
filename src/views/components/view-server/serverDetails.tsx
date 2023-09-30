import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  PlayCircleOutline,
  RestartAlert,
  StopCircleOutline,
} from "mdi-material-ui";
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
        <strong>Power Status:&nbsp;</strong> Stopped
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

const ServerCapacitycard = (props?: any) => {
  return (
    <Box>
      <CardContent>
        <Typography variant="h6">Capacity and Usage</Typography>
        <Typography variant="caption" color="textSecondary">
          Last updated at 5:31 PM
        </Typography>

        <Box>
          <Typography variant="subtitle1">CPU</Typography>
          <Typography variant="body1">1.78 GHz used</Typography>
          <Typography variant="body2">16 CPUs allocated</Typography>
        </Box>

        <Box>
          <Typography variant="subtitle1">Memory</Typography>
          <Typography variant="body1">5.76 GB used</Typography>
          <Typography variant="body2">64 GB allocated</Typography>
        </Box>

        <Box>
          <Typography variant="subtitle1">Storage</Typography>
          <Typography variant="body1">111.83 GB used</Typography>
          <Typography variant="body2">649.28 GB allocated</Typography>
        </Box>
      </CardContent>
    </Box>
  );
};

const PowerOptions = () => {
  const handleStart = () => {
    // Add logic to start the server here
  };

  const handleStop = () => {
    // Add logic to stop the server here
  };

  const handleRestart = () => {
    // Add logic to restart the server here
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        height: "100%",
        marginLeft: 15,
        marginTop: 5,
      }}
    >
      <Typography variant="h6">Power Options</Typography>
      <Box
        id="guestOsField"
        sx={{
          marginTop: 3.75,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <IconButton color="secondary" onClick={handleStart}>
            <PlayCircleOutline />
          </IconButton>
          <Typography
            sx={{
              paddingLeft: 2,
            }}
          >
            Power On
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <IconButton color="secondary" onClick={handleStop}>
            <StopCircleOutline />
          </IconButton>
          <Typography
            sx={{
              paddingLeft: 2,
            }}
          >
            Power Off
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <IconButton color="secondary" onClick={handleRestart}>
            <RestartAlert />
          </IconButton>
          <Typography
            sx={{
              paddingLeft: 2,
            }}
          >
            Restart
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const ServerDetails = (props: any) => {
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
              flexDirection: "column",
              alignItems: "flex-start",
              height: "100%",
              marginLeft: 5,
              marginTop: 5,
            }}
          >
            <Typography variant="h6">OS Details</Typography>
            <Box
              id="guestOsField"
              sx={{
                marginTop: 5,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box sx={{ margin: 1 }}>
                {renderPowerStatus(data.power_state)}
              </Box>
              <Typography variant="body1" sx={{ margin: 1 }}>
                <strong>Operating system:</strong>&nbsp; {data.os_name}
              </Typography>
              <Typography variant="body1" sx={{ margin: 1 }}>
                <strong>DNS Name (1):</strong>&nbsp; {data.host_name}
              </Typography>
              <Box sx={{ margin: 1 }}>
                {renderIpAddress([{ ip: data.ip_address }])}
              </Box>
              {/* <Typography variant="body1">
    <strong>Encryption:</strong>&nbsp; Not encrypted
  </Typography> */}
            </Box>
          </Box>

          {PowerOptions()}
        </Box>

        <Box
          sx={{
            // backgroundColor: theme.palette.background.default,
            // padding: "16px",
            // marginLeft: "16px",
            borderRadius: "4px",
          }}
        ></Box>
      </Box>

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
        {ServerCapacitycard()}
      </Box>
    </Card>
  );
};

export default ServerDetails;
