// ** React Imports
import { useState, ElementType, SyntheticEvent } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import Select from "@mui/material/Select";
import { styled } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import AlertTitle from "@mui/material/AlertTitle";
import IconButton from "@mui/material/IconButton";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import Button, { ButtonProps } from "@mui/material/Button";

// ** Icons Imports
import Close from "mdi-material-ui/Close";
import { Radio } from "@mui/material";

const ImgStyled = styled("img")(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(5),
  borderRadius: theme.shape.borderRadius,
}));

const ButtonStyled = styled(Button)<
  ButtonProps & { component?: ElementType; htmlFor?: string }
>(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    textAlign: "center",
  },
}));

const TabAccount = () => {
  // ** State
  const [openAlert, setOpenAlert] = useState<boolean>(true);
  const [individual, setIndividual] = useState<boolean>(true);
  const [imgSrc, setImgSrc] = useState<string>("/images/avatars/1.png");

  return (
    <CardContent>
      <form>
        <Grid container spacing={6}>
          <Grid item xs={12} sx={{ my: 5 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <ImgStyled src={imgSrc} alt="Profile Pic" />
              <Box
                sx={{ width: "100%", display: "flex", flexDirection: "row" }}
              >
                <Grid item xs={12} sm={2}>
                  <Radio
                    checked={individual}
                    onChange={() => setIndividual(true)}
                  />
                  <label>Individual</label>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Radio
                    checked={!individual}
                    onChange={() => setIndividual(false)}
                  />
                  <label>Corporate</label>
                </Grid>
              </Box>
            </Box>
          </Grid>

          {individual === false ? (
            <>
              {/* Kurumsal */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company Name"
                  placeholder="ABC Pvt. Ltd."
                  defaultValue="ABC Pvt. Ltd."
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company Email"
                  placeholder="test@abc.com"
                  defaultValue="test@abc.com"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company Phone"
                  placeholder="+1 (609) 933-44-22"
                  defaultValue="+1 (609) 933-44-22"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company Website"
                  placeholder="https://www.abc.com"
                  defaultValue="https://www.abc.com"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company Address"
                  placeholder="New York, USA"
                  defaultValue="New York, USA"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company Personel Name"
                  placeholder="John Doe"
                  defaultValue="John Doe"
                />
              </Grid>
              {/* Kurumsal */}
            </>
          ) : (
            <>
              {/* Bireysel  */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Username"
                  placeholder="johnDoe"
                  defaultValue="johnDoe"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  placeholder="John Doe"
                  defaultValue="John Doe"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="email"
                  label="Email"
                  placeholder="johnDoe@example.com"
                  defaultValue="johnDoe@example.com"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select label="Role" defaultValue="admin">
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="author">Author</MenuItem>
                    <MenuItem value="editor">Editor</MenuItem>
                    <MenuItem value="maintainer">Maintainer</MenuItem>
                    <MenuItem value="subscriber">Subscriber</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select label="Status" defaultValue="active">
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company"
                  placeholder="ABC Pvt. Ltd."
                  defaultValue="ABC Pvt. Ltd."
                />
              </Grid>
              {/* Bireysel  */}
            </>
          )}

          {/* {openAlert ? (
            <Grid item xs={12}>
              <Alert
                severity="warning"
                sx={{ "& a": { fontWeight: 400 } }}
                action={
                  <IconButton
                    size="small"
                    color="inherit"
                    aria-label="close"
                    onClick={() => setOpenAlert(false)}
                  >
                    <Close fontSize="inherit" />
                  </IconButton>
                }
              >
                <AlertTitle sx={{ mb: ".15rem" }}>
                  Your email is not confirmed. Please check your inbox.
                </AlertTitle>
                <Link
                  href="/"
                  onClick={(e: SyntheticEvent) => e.preventDefault()}
                >
                  Resend Confirmation
                </Link>
              </Alert>
            </Grid>
          ) : null} */}
          <Grid item xs={12}>
            <Button variant="contained" sx={{ mr: 4 }}>
              Save Changes
            </Button>
            <Button type="reset" variant="outlined" color="secondary">
              Reset
            </Button>
          </Grid>
        </Grid>
      </form>
    </CardContent>
  );
};

export default TabAccount;
