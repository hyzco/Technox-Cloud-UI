// ** React Imports
import { SyntheticEvent, useState } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import { styled } from "@mui/material/styles";
import MuiTab, { TabProps } from "@mui/material/Tab";

// ** Icons Imports
import BellOutline from "mdi-material-ui/BellOutline";
import AccountOutline from "mdi-material-ui/AccountOutline";
import LockOpenOutline from "mdi-material-ui/LockOpenOutline";
import BookmarkOutline from "mdi-material-ui/BookmarkOutline";
import InformationOutline from "mdi-material-ui/InformationOutline";

// ** Demo Tabs Imports
import TabInfo from "src/views/pages/account-settings/TabInfo";
import TabAccount from "src/views/pages/account-settings/TabAccount";
import TabBilling from "src/views/pages/account-settings/TabBilling";
import TabSecurity from "src/views/pages/account-settings/TabSecurity";
import TabNotifications from "src/views/pages/account-settings/TabNotifications";

// ** Third Party Styles Imports
import "react-datepicker/dist/react-datepicker.css";

const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    minWidth: 100,
  },
  [theme.breakpoints.down("sm")]: {
    minWidth: 67,
  },
}));

const TabName = styled("span")(({ theme }) => ({
  lineHeight: 1.71,
  marginLeft: theme.spacing(2.5),
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));

const AccountSettings = () => {
  // ** State
  const [value, setValue] = useState<string>("account");

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Card>
      <TabContext value={value}>
        <TabList
          onChange={handleChange}
          aria-label="account-settings tabs"
          sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
        >
          <Tab
            value="account"
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <AccountOutline sx={{ fontSize: "1.125rem" }} />
                <TabName>Account</TabName>
              </Box>
            }
          />
          <Tab
            value="security"
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <LockOpenOutline sx={{ fontSize: "1.125rem" }} />
                <TabName>Security</TabName>
              </Box>
            }
          />
          <Tab
            value="info"
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <InformationOutline sx={{ fontSize: "1.125rem" }} />
                <TabName>Info</TabName>
              </Box>
            }
          />
          <Tab
            value="billing"
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <BookmarkOutline sx={{ fontSize: "1.125rem" }} />
                <TabName>Billing</TabName>
              </Box>
            }
          />
          <Tab
            value="notifications"
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <BellOutline sx={{ fontSize: "1.125rem" }} />
                <TabName>Notifications</TabName>
              </Box>
            }
          />
        </TabList>

        <TabPanel sx={{ p: 0 }} value="account">
          <TabAccount />
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value="security">
          <TabSecurity />
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value="info">
          <TabInfo />
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value="billing">
          <TabBilling />
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value="notifications">
          <TabNotifications />
        </TabPanel>
      </TabContext>
    </Card>
  );
};

export default AccountSettings;
