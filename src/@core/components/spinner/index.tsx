// ** MUI Import
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

const FallbackSpinner = () => {
  // ** Hook
  const theme = useTheme();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {/* <Typography
        sx={{ fontSize: 32, fontWeight: "bold", color: "text.white" }}
      >
        TheyCloud
      </Typography> */}
      <img src="/images/logos/theycloud.png" />
      <CircularProgress disableShrink sx={{ mt: 6 }} />
    </Box>
  );
};

export default FallbackSpinner;
