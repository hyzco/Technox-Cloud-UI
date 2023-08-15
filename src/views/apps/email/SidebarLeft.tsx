// ** React Imports
import { ElementType, ReactNode, useState, useEffect } from "react";

// ** Next Import
import Link from "next/link";

// ** MUI Imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import Drawer from "@mui/material/Drawer";
import TextField from "@mui/material/TextField";
import { styled, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import MuiDialog from "@mui/material/Dialog";
import ListItemIcon from "@mui/material/ListItemIcon";
import useMediaQuery from "@mui/material/useMediaQuery";
import ListItemText from "@mui/material/ListItemText";
import ListItem, { ListItemProps } from "@mui/material/ListItem";

// ** Icons Imports
import Circle from "mdi-material-ui/Circle";
import EmailOutline from "mdi-material-ui/EmailOutline";

// ** Third Party Imports
import PerfectScrollbar from "react-perfect-scrollbar";

// ** Custom Components Imports
import CustomBadge from "src/@core/components/mui/badge";
import useFormReducer from "src/@core/hooks/useFormReducer";
import {
  FormWrapperHook,
  useFormHook,
} from "src/@core/components/form/form-wrapper";
import useAxiosFunction from "src/@core/hooks/useAxiosFunction";
import userConfig from "src/configs/user";

// ** Types
import { CustomBadgeProps } from "src/@core/components/mui/badge/types";
import {
  MailFolderType,
  MailLabelType,
  MailSidebarType,
} from "src/types/apps/emailTypes";
import vmApi from "src/@core/apis/vmApi";
import { HTTP_METHOD } from "src/@core/enums/axios.enum";
import React from "react";
import user from "src/configs/user";

enum REDUCER_ACTIONS {
  SET_REQUEST_DETAILS = "SET_REQUEST_DETAILS",
}

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

// ** Styled Dialog component
const Dialog = styled(MuiDialog)({
  "& .MuiBackdrop-root": {
    backdropFilter: "blur(4px)",
  },
  "& .MuiDialog-paper": {
    overflow: "hidden",
    "&:not(.MuiDialog-paperFullScreen)": {
      height: "100%",
      maxHeight: 550,
    },
  },
});

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

  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const fullScreenDialog = useMediaQuery(theme.breakpoints.down("xs"));

  const [fullName, setFullName] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [department, setDepartment] = useState<string | unknown>("");

  const formHook = useFormHook();
  const [
    handleSubmit,
    reset,
    control,
    register,
    getValues,
    // setValue,
    formState,
    trigger,
  ] = formHook;

  const [state, dispatch]: any = useFormReducer({
    reducer: (state: any, action: any) => {
      switch (action.type) {
        case REDUCER_ACTIONS.SET_REQUEST_DETAILS:
          console.log(action);
          return { ...state, support: action.payload.support };
      }
    },
    reducerState: {
      support: {
        fullName: "",
        title: "",
        description: "",
        department: "",
      },
    },
  });

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

  const handleRequestSupport = () => {
    dispatch({
      type: REDUCER_ACTIONS.SET_REQUEST_DETAILS,
      payload: {
        support: {
          fullName,
          title,
          description,
          department: department ? department : "finance",
        },
      },
    });
    setOpenDialog(false);
    axiosFetch({
      axiosInstance: vmApi,
      method: HTTP_METHOD.POST,
      url: "/support/request",
      body: {
        fullName,
        title,
        description,
        department: department ? department : "finance",
        sentBy: "user",
        isParent: 1,
      },
      requestConfig: {
        headers: {
          Authorization: storedToken,
        },
      },
    });
  };

  const [response, error, loading, axiosFetch] = useAxiosFunction();
  // const { user } = useAuth();

  const storedToken = window.localStorage.getItem(
    userConfig.storageTokenKeyName
  );

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
        <Button
          fullWidth
          variant="contained"
          onClick={() => setOpenDialog(true)}
        >
          <ListItemText
            primary="Yeni Talep Oluştur"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        </Button>
        <Dialog
          fullWidth
          open={openDialog}
          fullScreen={fullScreenDialog}
          onClose={() => setOpenDialog(false)}
        >
          <FormWrapperHook
            name={"supportDatabase"}
            disableClear={true}
            formHook={formHook}
            fields={["fullName", "title", "description", "department"]}
            onSubmit={undefined}
          >
            <Box sx={{ p: 5, overflowY: "hidden" }}>
              <Typography variant="h6" gutterBottom>
                Yeni Talep Oluştur
              </Typography>
              <Typography variant="body2" gutterBottom>
                Talep oluşturmak için lütfen aşağıdaki formu doldurunuz.
              </Typography>
              <Box sx={{ mt: 5 }}>
                <Grid container spacing={8}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      {...register("fullName")}
                      fullWidth
                      label="Ad Soyad"
                      variant="outlined"
                      size="medium"
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      {...register("title")}
                      fullWidth
                      label="Başlık"
                      variant="outlined"
                      size="medium"
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <FormControl fullWidth>
                      <InputLabel>Departman</InputLabel>
                      <Select
                        {...register("department")}
                        label="Departman"
                        defaultValue="finance"
                        onChange={(e) => setDepartment(e.target.value)}
                      >
                        <MenuItem value="finance">Finans</MenuItem>
                        <MenuItem value="it">IT</MenuItem>
                        <MenuItem value="corporate">Kurumsal</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      {...register("description")}
                      rows={6}
                      multiline
                      fullWidth
                      label="Detay"
                      variant="outlined"
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleRequestSupport}
                    >
                      <ListItemText primary="Talep Oluştur" />
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </FormWrapperHook>
        </Dialog>
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
