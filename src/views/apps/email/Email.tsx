// ** React Imports
import { useState, useEffect } from "react";

// ** Redux Imports
import { useDispatch, useSelector } from "react-redux";

// ** MUI Imports
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

// ** Hooks
import { useSettings } from "src/@core/hooks/useSettings";

// ** Types
import { RootState, AppDispatch } from "src/store";
import { MailLayoutType, MailLabelColors } from "src/types/apps/emailTypes";

// ** Email App Component Imports
import MailLog from "src/views/apps/email/MailLog";
import SidebarLeft from "src/views/apps/email/SidebarLeft";

// ** Actions
import { fetchData } from "src/store/apps/support";

// ** Variables
const labelColors: MailLabelColors = {
  private: "error",
  personal: "success",
  company: "primary",
  important: "warning",
};

const EmailAppLayout = ({ folder, label }: MailLayoutType) => {
  // ** States
  const [query, setQuery] = useState<string>("");
  const [composeOpen, setComposeOpen] = useState<boolean>(false);
  const [mailDetailsOpen, setMailDetailsOpen] = useState<boolean>(false);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false);

  // ** Hooks
  const theme = useTheme();
  const { settings } = useSettings();
  const dispatch = useDispatch<AppDispatch>();
  const lgAbove = useMediaQuery(theme.breakpoints.up("lg"));
  const mdAbove = useMediaQuery(theme.breakpoints.up("md"));
  const smAbove = useMediaQuery(theme.breakpoints.up("sm"));
  const hidden = useMediaQuery(theme.breakpoints.down("lg"));
  const store = useSelector((state: RootState) => state.support);
  const storeEmail = useSelector((state: RootState) => state.email);

  // ** Vars
  const leftSidebarWidth = 260;
  const composePopupWidth = mdAbove ? 754 : smAbove ? 520 : "100%";
  const { skin, appBar, footer, layout, navHidden } = settings;

  useEffect(() => {
    // @ts-ignore
    dispatch(fetchData());
  }, []);

  const toggleComposeOpen = () => setComposeOpen(!composeOpen);
  const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen);

  const calculateAppHeight = () => {
    return `(${
      (appBar === "hidden" ? 0 : (theme.mixins.toolbar.minHeight as number)) *
        (layout === "horizontal" && !navHidden ? 2 : 1) +
      (footer === "hidden" ? 0 : 56)
    }px + ${theme.spacing(6)} * 2)`;
  };

  return (
    <Box
      sx={{
        display: "flex",
        borderRadius: 1,
        overflow: "hidden",
        position: "relative",
        boxShadow: skin === "bordered" ? 0 : 6,
        height: `calc(100vh - ${calculateAppHeight()})`,
        ...(skin === "bordered" && {
          border: `1px solid ${theme.palette.divider}`,
        }),
      }}
    >
      <SidebarLeft
        store={storeEmail}
        hidden={hidden}
        lgAbove={lgAbove}
        dispatch={dispatch}
        mailDetailsOpen={mailDetailsOpen}
        leftSidebarOpen={leftSidebarOpen}
        leftSidebarWidth={leftSidebarWidth}
        toggleComposeOpen={toggleComposeOpen}
        setMailDetailsOpen={setMailDetailsOpen}
        // handleSelectAllMail={handleSelectAllMail}
        handleLeftSidebarToggle={handleLeftSidebarToggle}
      />
      <MailLog supportList={store.supportList} />
      {/* <ComposePopup
        mdAbove={mdAbove}
        composeOpen={composeOpen}
        composePopupWidth={composePopupWidth}
        toggleComposeOpen={toggleComposeOpen}
      /> */}
    </Box>
  );
};

export default EmailAppLayout;
