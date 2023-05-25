// ** React Imports
import { Ref, useState, forwardRef, ReactElement, useEffect } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Card from "@mui/material/Card";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TabContext from "@mui/lab/TabContext";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Fade, { FadeProps } from "@mui/material/Fade";

// ** Icons Imports
import Close from "mdi-material-ui/Close";
import Check from "mdi-material-ui/Check";
import ArrowLeft from "mdi-material-ui/ArrowLeft";
import ArrowRight from "mdi-material-ui/ArrowRight";
import ChartDonut from "mdi-material-ui/ChartDonut";
import StarOutline from "mdi-material-ui/StarOutline";
import ClipboardOutline from "mdi-material-ui/ClipboardOutline";
import CreditCardOutline from "mdi-material-ui/CreditCardOutline";

// ** Hook Imports
import { useSettings } from "src/@core/hooks/useSettings";

// ** Tab Content Imports
import DialogTabPackages from "src/views/pages/dialog-examples/create-app-tabs/DialogTabPackages";
import DialogTabDetails from "src/views/pages/dialog-examples/create-app-tabs/DialogTabDetails";
import DialogTabBilling from "src/views/pages/dialog-examples/create-app-tabs/DialogTabBilling";
import DialogTabDatabase from "src/views/pages/dialog-examples/create-app-tabs/DialogTabDatabase";
import DialogTabFramework from "src/views/pages/dialog-examples/create-app-tabs/DialogTabFramework";

interface TabLabelProps {
  title: string;
  active: boolean;
  subtitle: string;
  icon: ReactElement;
}

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />;
});

const TabLabel = (props: TabLabelProps) => {
  const { icon, title, subtitle, active } = props;

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Avatar
          variant="rounded"
          sx={{
            mr: 3.5,
            ...(active
              ? { color: "common.white", backgroundColor: "primary.main" }
              : { color: "text.primary" }),
          }}
        >
          {icon}
        </Avatar>
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body2">{title}</Typography>
          <Typography
            variant="caption"
            sx={{ color: "text.disabled", textTransform: "none" }}
          >
            {subtitle}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const tabsArr = [
  "detailsTab",
  "frameworkTab",
  "DatabaseTab",
  "paymentTab",
  "submitTab",
];

const CreateServerPanel = () => {
  const [activeTab, setActiveTab] = useState<string>("packagesTab");

  // ** Hook
  const { settings } = useSettings();

  // ** Var
  const { direction } = settings;

  const NextArrow = direction === "ltr" ? ArrowRight : ArrowLeft;
  const PreviousArrow = direction === "ltr" ? ArrowLeft : ArrowRight;

  const renderTabFooter = () => {
    const prevTab = tabsArr[tabsArr.indexOf(activeTab) - 1];
    const nextTab = tabsArr[tabsArr.indexOf(activeTab) + 1];

    return (
      <Box
        sx={{
          mt: 8.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<PreviousArrow />}
          disabled={activeTab === "detailsTab"}
          onClick={() => setActiveTab(prevTab)}
        >
          Previous
        </Button>
        <Button
          variant="contained"
          endIcon={activeTab === "submitTab" ? <Check /> : <NextArrow />}
          color={activeTab === "submitTab" ? "success" : "primary"}
          onClick={() => {
            if (activeTab !== "submitTab") {
              setActiveTab(nextTab);
            } else {
              // handleClose();
            }
          }}
        >
          {activeTab === "submitTab" ? "Submit" : "Next"}
        </Button>
      </Box>
    );
  };

  return (
    <Card sx={{ height: "100%", p: 2 }}>
      <IconButton
        size="small"
        onClick={() => console.log("Clicked icon close")}
        sx={{ position: "absolute", right: "1rem", top: "1rem" }}
      >
        <Close />
      </IconButton>
      <Box sx={{ mb: 3, textAlign: "center" }}>
        <Typography variant="h5" sx={{ m: 4, lineHeight: "2rem" }}>
          Create Server
        </Typography>
        <Typography variant="body2">
          Provide data with this form to create your server.
        </Typography>
      </Box>
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexWrap: { xs: "wrap", md: "nowrap" },
          // background: "red",
        }}
      >
        <TabContext value={activeTab}>
          <TabList
            orientation="vertical"
            onChange={(e, newValue: string) => setActiveTab(newValue)}
            sx={{
              display: "flex",
              // height: "100%",
              // backgroundColor: "black",
              justifyContent: "space-between",
              border: 0,
              minWidth: 200,
              "& .MuiTabs-indicator": { display: "none" },
              "& .MuiTabs-flexContainer": {
                "& .MuiTab-root": {
                  width: "100%",
                  alignItems: "flex-start",
                },
              },
            }}
          >
            <Tab
              disableRipple
              value="packagesTab"
              label={
                <TabLabel
                  title="Package"
                  subtitle="Select package"
                  icon={<ClipboardOutline />}
                  active={activeTab === "packagesTab"}
                />
              }
            />
            <Tab
              disableRipple
              value="detailsTab"
              label={
                <TabLabel
                  title="Details"
                  subtitle="Enter Details"
                  icon={<ClipboardOutline />}
                  active={activeTab === "detailsTab"}
                />
              }
            />
            <Tab
              disableRipple
              value="frameworkTab"
              label={
                <TabLabel
                  title="Frameworks"
                  icon={<StarOutline />}
                  subtitle="Select Framework"
                  active={activeTab === "frameworkTab"}
                />
              }
            />
            <Tab
              disableRipple
              value="DatabaseTab"
              label={
                <TabLabel
                  title="Database"
                  active={activeTab === "DatabaseTab"}
                  subtitle="Select Database"
                  icon={<ChartDonut />}
                />
              }
            />
            <Tab
              disableRipple
              value="paymentTab"
              label={
                <TabLabel
                  title="Billing"
                  active={activeTab === "paymentTab"}
                  subtitle="Payment details"
                  icon={<CreditCardOutline />}
                />
              }
            />
            <Tab
              disableRipple
              value="submitTab"
              label={
                <TabLabel
                  title="Submit"
                  subtitle="Submit"
                  active={activeTab === "submitTab"}
                  icon={<Check />}
                />
              }
            />
          </TabList>
          <TabPanel value="packagesTab" sx={{ flexGrow: 1 }}>
            <DialogTabPackages />
            {renderTabFooter()}
          </TabPanel>
          <TabPanel value="detailsTab" sx={{ flexGrow: 1 }}>
            <DialogTabDetails />
            {renderTabFooter()}
          </TabPanel>
          <TabPanel value="frameworkTab" sx={{ flexGrow: 1 }}>
            <DialogTabFramework />
            {renderTabFooter()}
          </TabPanel>
          <TabPanel value="DatabaseTab" sx={{ flexGrow: 1 }}>
            <DialogTabDatabase />
            {renderTabFooter()}
          </TabPanel>
          <TabPanel value="paymentTab" sx={{ flexGrow: 1 }}>
            <DialogTabBilling />
            {renderTabFooter()}
          </TabPanel>
          <TabPanel value="submitTab" sx={{ flexGrow: 1 }}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h6">Submit</Typography>
              <Typography variant="body2">
                Submit to kickstart your project.
              </Typography>

              <Box sx={{ mt: 5, display: "flex", justifyContent: "center" }}>
                <img
                  alt="submit-img"
                  src={`/images/pages/create-app-dialog-illustration-${settings.mode}.png`}
                />
              </Box>
            </Box>
            {renderTabFooter()}
          </TabPanel>
        </TabContext>
      </Box>
    </Card>
  );
};

export default CreateServerPanel;
