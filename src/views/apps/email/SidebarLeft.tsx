// ** React Imports
import { ElementType, ReactNode } from "react";

// ** Next Import
import Link from "next/link";

// ** MUI Imports
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItem, { ListItemProps } from "@mui/material/ListItem";

// ** Icons Imports
import Circle from "mdi-material-ui/Circle";
import EmailOutline from "mdi-material-ui/EmailOutline";

// ** Third Party Imports
import PerfectScrollbar from "react-perfect-scrollbar";

// ** Custom Components Imports
import CustomBadge from "src/@core/components/mui/badge";

// ** Types
import { CustomBadgeProps } from "src/@core/components/mui/badge/types";
import {
  MailFolderType,
  MailLabelType,
  MailSidebarType,
} from "src/types/apps/emailTypes";

// ** Styled Components
const ListItemStyled = styled(ListItem)<
  ListItemProps & { component?: ElementType; to?: string }
>(({ theme }) => ({
  borderLeftWidth: "3px",
  borderLeftStyle: "solid",
  padding: theme.spacing(0, 5),
  marginBottom: theme.spacing(2),
}));

const ListBadge = styled(CustomBadge)<CustomBadgeProps>(() => ({
  "& .MuiBadge-badge": {
    height: "18px",
    minWidth: "18px",
    transform: "none",
    position: "relative",
    transformOrigin: "none",
  },
}));

const SidebarLeft = (props: MailSidebarType) => {
  // ** Props
  const {
    store,
    hidden,
    lgAbove,
    leftSidebarOpen,
    leftSidebarWidth,
    setMailDetailsOpen,
    handleLeftSidebarToggle,
  } = props;

  const RenderBadge = (
    folder: "inbox" | "draft" | "spam" | "add" | "all",
    color:
      | "default"
      | "primary"
      | "secondary"
      | "success"
      | "error"
      | "warning"
      | "info"
  ) => {
    if (store && store.mailMeta && store.mailMeta[folder] > 0) {
      return (
        <ListBadge
          skin="light"
          color={color}
          sx={{ ml: 2 }}
          badgeContent={store.mailMeta[folder]}
        />
      );
    } else {
      return null;
    }
  };

  const handleActiveItem = (
    type: "folder" | "label",
    value: MailFolderType | MailLabelType
  ) => {
    if (store && store.filter[type] !== value) {
      return false;
    } else {
      return true;
    }
  };

  const handleListItemClick = () => {
    setMailDetailsOpen(false);
    handleLeftSidebarToggle();
  };

  const activeInboxCondition =
    store &&
    handleActiveItem("folder", "inbox") &&
    store.filter.folder === "inbox" &&
    store.filter.label === "";

  const ScrollWrapper = ({ children }: { children: ReactNode }) => {
    if (hidden) {
      return (
        <Box sx={{ height: "100%", overflowY: "auto", overflowX: "hidden" }}>
          {children}
        </Box>
      );
    } else {
      return (
        <PerfectScrollbar options={{ wheelPropagation: false }}>
          {children}
        </PerfectScrollbar>
      );
    }
  };

  return (
    <Drawer
      open={leftSidebarOpen}
      onClose={handleLeftSidebarToggle}
      variant={lgAbove ? "permanent" : "temporary"}
      ModalProps={{
        disablePortal: true,
        keepMounted: true, // Better open performance on mobile.
      }}
      sx={{
        zIndex: 9,
        display: "block",
        position: lgAbove ? "static" : "absolute",
        "& .MuiDrawer-paper": {
          boxShadow: "none",
          width: leftSidebarWidth,
          zIndex: lgAbove ? 2 : "drawer",
          position: lgAbove ? "static" : "absolute",
        },
        "& .MuiBackdrop-root": {
          position: "absolute",
        },
      }}
    >
      <Box sx={{ p: 5, overflowY: "hidden" }}>
        <Link href="/views/requests" passHref>
          <Button fullWidth variant="contained">
            <ListItemText
              primary="Yeni Talep Oluştur"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          </Button>
        </Link>
      </Box>
      <ScrollWrapper>
        <Box sx={{ pt: 1.25, overflowY: "hidden" }}>
          <List component="div">
            <Link href="/views/requests/inbox" passHref>
              <ListItemStyled
                component="a"
                onClick={handleListItemClick}
                sx={{
                  pt: 0.5,
                  borderLeftColor: (theme) =>
                    activeInboxCondition
                      ? theme.palette.primary.main
                      : "transparent",
                }}
              >
                <ListItemIcon
                  sx={{
                    color: activeInboxCondition
                      ? "primary.main"
                      : "text.secondary",
                  }}
                >
                  <EmailOutline sx={{ fontSize: "1.25rem" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Destek Talepleri"
                  primaryTypographyProps={{
                    noWrap: true,
                    sx: {
                      color: (theme) =>
                        activeInboxCondition ? theme.palette.primary.main : "",
                    },
                  }}
                />
                {RenderBadge("inbox", "primary")}
              </ListItemStyled>
            </Link>
          </List>
          <Typography
            component="h6"
            variant="caption"
            sx={{
              mx: 6,
              mb: 0,
              mt: 3.5,
              lineHeight: ".95rem",
              color: "text.disabled",
              letterSpacing: "0.4px",
              textTransform: "uppercase",
            }}
          >
            Departman
          </Typography>
          <List component="div" sx={{ pt: 1 }}>
            <Link href="/views/requests/label/personal" passHref>
              <ListItemStyled
                component="a"
                onClick={handleListItemClick}
                sx={{
                  mb: 1,
                  borderLeftColor: (theme) =>
                    handleActiveItem("label", "personal")
                      ? theme.palette.primary.main
                      : "transparent",
                }}
              >
                <ListItemIcon>
                  <Circle
                    sx={{ mr: 1, fontSize: "0.75rem", color: "success.main" }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary="Finans"
                  primaryTypographyProps={{
                    noWrap: true,
                    sx: {
                      color: (theme) =>
                        handleActiveItem("label", "personal")
                          ? theme.palette.primary.main
                          : "",
                    },
                  }}
                />
              </ListItemStyled>
            </Link>
            <Link href="/views/requests/label/company" passHref>
              <ListItemStyled
                component="a"
                onClick={handleListItemClick}
                sx={{
                  mb: 1,
                  borderLeftColor: (theme) =>
                    handleActiveItem("label", "company")
                      ? theme.palette.primary.main
                      : "transparent",
                }}
              >
                <ListItemIcon>
                  <Circle
                    sx={{ mr: 1, fontSize: "0.75rem", color: "primary.main" }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary="IT"
                  primaryTypographyProps={{
                    noWrap: true,
                    sx: {
                      color: (theme) =>
                        handleActiveItem("label", "company")
                          ? theme.palette.primary.main
                          : "",
                    },
                  }}
                />
              </ListItemStyled>
            </Link>
            <Link href="/views/requests/label/important" passHref>
              <ListItemStyled
                component="a"
                onClick={handleListItemClick}
                sx={{
                  mb: 1,
                  borderLeftColor: (theme) =>
                    handleActiveItem("label", "important")
                      ? theme.palette.primary.main
                      : "transparent",
                }}
              >
                <ListItemIcon>
                  <Circle
                    sx={{ mr: 1, fontSize: "0.75rem", color: "warning.main" }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary="Kurumsal"
                  primaryTypographyProps={{
                    noWrap: true,
                    sx: {
                      color: (theme) =>
                        handleActiveItem("label", "important")
                          ? theme.palette.primary.main
                          : "",
                    },
                  }}
                />
              </ListItemStyled>
            </Link>
          </List>
        </Box>
      </ScrollWrapper>
    </Drawer>
  );
};

export default SidebarLeft;
