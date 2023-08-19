// ** React Imports
import {
  Fragment,
  useState,
  SyntheticEvent,
  ReactNode,
  useEffect,
  useMemo,
  memo,
} from "react";

// ** MUI Imports
import List from "@mui/material/List";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import ListItem from "@mui/material/ListItem";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Box, { BoxProps } from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ListItemIcon from "@mui/material/ListItemIcon";

// ** Icons Import
import Circle from "mdi-material-ui/Circle";
import Attachment from "mdi-material-ui/Attachment";
import StarOutline from "mdi-material-ui/StarOutline";
import ChevronLeft from "mdi-material-ui/ChevronLeft";
import ChevronRight from "mdi-material-ui/ChevronRight";
import ShareOutline from "mdi-material-ui/ShareOutline";
import LabelOutline from "mdi-material-ui/LabelOutline";
import DotsVertical from "mdi-material-ui/DotsVertical";
import ReplyOutline from "mdi-material-ui/ReplyOutline";
import EmailOutline from "mdi-material-ui/EmailOutline";
import DeleteOutline from "mdi-material-ui/DeleteOutline";
import FolderOutline from "mdi-material-ui/FolderOutline";
import ArrowExpandVertical from "mdi-material-ui/ArrowExpandVertical";
import ArrowCollapseVertical from "mdi-material-ui/ArrowCollapseVertical";

// ** Third Party Imports
import PerfectScrollbar from "react-perfect-scrollbar";

// ** Hooks
import { useSettings } from "src/@core/hooks/useSettings";

// ** Custom Components Imports
import Sidebar from "src/@core/components/sidebar";
import CustomChip from "src/@core/components/mui/chip";

// ** Types
import { ThemeColor } from "src/@core/layouts/types";
import {
  MailType,
  MailLabelType,
  MailDetailsType,
  MailFoldersArrType,
  MailAttachmentType,
} from "src/types/apps/emailTypes";
import { useAuth } from "src/hooks/useAuth";
import TextField from "@mui/material/TextField";
import React from "react";
import { useRouter } from "next/router";
import vmApi from "src/@core/apis/vmApi";
import { HTTP_METHOD } from "src/@core/enums/axios.enum";
import useAxiosFunction from "src/@core/hooks/useAxiosFunction";
import userConfig from "src/configs/user";

const HiddenReplyBack = styled(Box)<BoxProps>(({ theme }) => ({
  height: 11,
  width: "90%",
  opacity: 0.5,
  borderWidth: 1,
  borderBottom: 0,
  display: "block",
  marginLeft: "auto",
  marginRight: "auto",
  borderStyle: "solid",
  borderTopLeftRadius: theme.shape.borderRadius,
  borderTopRightRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  borderColor: `rgba(${theme.palette.customColors.main}, 0.12)`,
}));

const HiddenReplyFront = styled(Box)<BoxProps>(({ theme }) => ({
  height: 12,
  width: "95%",
  opacity: 0.7,
  borderWidth: 1,
  borderBottom: 0,
  display: "block",
  marginLeft: "auto",
  marginRight: "auto",
  borderStyle: "solid",
  borderTopLeftRadius: theme.shape.borderRadius,
  borderTopRightRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  borderColor: `rgba(${theme.palette.customColors.main}, 0.12)`,
}));

const MailCardMenu = () => {
  const [mailMenuAnchorEl, setMailMenuAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const openMailMenu = Boolean(mailMenuAnchorEl);

  const handleMailMenuClick = (event: SyntheticEvent) => {
    setMailMenuAnchorEl(event.currentTarget as HTMLElement);
  };
  const handleMailMenuClose = () => {
    setMailMenuAnchorEl(null);
  };

  return (
    <>
      <IconButton size="small" onClick={handleMailMenuClick}>
        <DotsVertical fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={mailMenuAnchorEl}
        open={openMailMenu}
        onClose={handleMailMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem>
          <ShareOutline fontSize="small" sx={{ mr: 2 }} />
          Reply
        </MenuItem>
        <MenuItem>
          <ReplyOutline fontSize="small" sx={{ mr: 2 }} />
          Forward
        </MenuItem>
      </Menu>
    </>
  );
};

const MailDetails = (props: MailDetailsType) => {
  // ** Props
  const { mail, mailDetailsOpen, setMailDetailsOpen } = props;
  const route = useRouter();

  if (!mail) {
    route.push("/");
  }

  // ** State
  const [showReplies, setShowReplies] = useState<boolean>(false);
  const [labelAnchorEl, setLabelAnchorEl] = useState<null | HTMLElement>(null);
  const [folderAnchorEl, setFolderAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [shouldRender, setShouldRender] = useState<boolean>(true);
  const [allItems, setAllItems] = useState<any>({});

  useEffect(() => {
    setAllItems(mail);
  }, [mail]);

  useEffect(() => {
    console.log("all items");
    console.log(allItems);
  }, [allItems]);
  // ** Hook
  const { settings } = useSettings();
  const { user } = useAuth();
  // ** Vars
  const openLabelMenu = Boolean(labelAnchorEl);
  const openFolderMenu = Boolean(folderAnchorEl);

  const handleLabelMenuClick = (event: SyntheticEvent) => {
    setLabelAnchorEl(event.currentTarget as HTMLElement);
  };
  const handleLabelMenuClose = () => {
    setLabelAnchorEl(null);
  };

  const handleFolderMenuClick = (event: SyntheticEvent) => {
    setFolderAnchorEl(event.currentTarget as HTMLElement);
  };
  const handleFolderMenuClose = () => {
    setFolderAnchorEl(null);
    setMailDetailsOpen(false);
  };

  const ScrollWrapper = ({ children }: { children: ReactNode }) => {
    return (
      <PerfectScrollbar options={{ wheelPropagation: false }}>
        {children}
      </PerfectScrollbar>
    );
  };

  const renderAllItems = (mail: any) => {
    const tmpParent = Object.assign({}, mail);

    delete tmpParent.children;

    if (showReplies && mail.children) {
      const items = [...mail.children, tmpParent];
      items.sort((a, b) =>
        new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime()
          ? 0
          : 1
      );
      const totalItems = items.length - 1;
      return items.map((child: any, index: number) => {
        return (
          <Box
            key={index + "MD"}
            sx={{
              mb: index == totalItems ? 40 : 4,
              boxShadow: 6,
              width: "100%",
              borderRadius: 1,
              backgroundColor: "background.paper",
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box sx={{ p: 5 }}>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    // alt={reply.me}
                    // src={reply.from.avatar}
                    sx={{
                      width: "2.375rem",
                      height: "2.375rem",
                      mr: 3,
                    }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography sx={{ color: "text.secondary" }}>
                      {child.sentBy === "user"
                        ? user?.name + " " + user?.surname
                        : "OPERATOR"}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.disabled" }}>
                      {child.sentBy === "user" ? user?.email : "OPERATOR EMAIL"}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    variant="body2"
                    sx={{ mr: 1.75, color: "text.disabled" }}
                  >
                    {new Date(child.createdAt).toUTCString()}
                  </Typography>
                  <IconButton size="small" sx={{ mr: 0.5 }}>
                    <Attachment fontSize="small" />
                  </IconButton>
                  <IconButton size="small">
                    <DotsVertical fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </Box>
            <Divider sx={{ m: 0 }} />
            <Box sx={{ px: 5, py: 0 }}>
              <Box sx={{ color: "text.secondary" }} />
            </Box>
            <Fragment>
              <Box sx={{ p: 5 }}>
                <Typography variant="body2">{child.description}</Typography>
              </Box>
              <Divider sx={{ m: 0 }} />
              <Box sx={{ p: 5 }}>
                <Typography variant="body2">Attachments</Typography>
                <List>
                  <ListItem disableGutters>
                    <ListItemIcon>
                      {/* <img width="24" height="24" /> */}
                    </ListItemIcon>
                    <Typography></Typography>
                  </ListItem>
                </List>
              </Box>
            </Fragment>
          </Box>
        );
      });
    }
  };

  const renderLastItem = () => {
    let item;
    console.log("RENDER LAST ITEM");

    if (mail.children.length > 0) {
      item = mail.children[mail.children.length - 1];
    } else {
      item = mail;
    }

    return (
      <Box
        sx={{
          mb: 4,
          width: "100%",
          borderRadius: 1,
          overflow: "visible",
          position: "relative",
          backgroundColor: "background.paper",
          boxShadow: settings.skin === "bordered" ? 0 : 6,
          border: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ p: 5 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                sx={{
                  width: "2.375rem",
                  height: "2.375rem",
                  mr: 3,
                }}
              />
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography sx={{ color: "text.secondary" }}>
                  {user?.name} {user?.surname}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.disabled" }}>
                  {user?.email}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="body2"
                sx={{ mr: 1.75, color: "text.disabled" }}
              >
                {new Date(item.createdAt).toUTCString()}
              </Typography>
              <IconButton size="small" sx={{ mr: 0.5, color: "action.active" }}>
                <Attachment sx={{ fontSize: "1.25rem" }} />
              </IconButton>
              <MailCardMenu />
            </Box>
          </Box>
        </Box>
        <Divider sx={{ m: 0 }} />
        <Box sx={{ px: 5, py: 0 }}>
          <Box sx={{ color: "text.secondary" }} />
        </Box>
        <Fragment>
          <Box sx={{ p: 5 }}>
            <Typography variant="body2">{item.description}</Typography>
          </Box>
          <Divider sx={{ m: 0 }} />
          <Box sx={{ p: 5 }}>
            <Typography variant="body2">Attachments</Typography>
            <List>
              <ListItem disableGutters>
                <ListItemIcon>
                  {/* <img width="24" height="24" /> */}
                </ListItemIcon>
                {/* <Typography>AA</Typography> */}
              </ListItem>
            </List>
          </Box>
        </Fragment>
      </Box>
    );
  };

  const renderSendNewMessage = () => {
    const [newMessage, setNewMessage] = useState<String>("");
    const [response, error, loading, axiosFetch] = useAxiosFunction();

    const onSendNewMessage = () => {
      axiosFetch({
        axiosInstance: vmApi,
        method: HTTP_METHOD.POST,
        url: "/support/request",
        body: {
          title: mail.title,
          description: newMessage,
          department: mail.departmentName,
          parentId: mail.id,
          sentBy: "user",
        },
        requestConfig: {
          headers: {
            Authorization: storedToken,
          },
        },
      });

      // setMailDetailsOpen(false);
      // setMailDetailsOpen(true);
      props.refreshData();
      setShouldRender(false);
      setTimeout(() => {
        setShouldRender(true);
      }, 0);

      // route.push("/views/requests", {
      //   query: { comeback: mail.id.toString() },
      // });
    };

    // const { user } = useAuth();

    const storedToken = window.localStorage.getItem(
      userConfig.storageTokenKeyName
    );

    return (
      <Box
        sx={{
          p: 5,
          width: "100%",
          borderRadius: 1,
          border: "1px solid",
          borderColor: "divider",
          backgroundColor: "background.paper",
          boxShadow: settings.skin === "bordered" ? 0 : 6,
          position: "absolute",
          bottom: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            // borderTop: "1px solid #ccc",
            padding: "8px",
          }}
        >
          <TextField
            key="newMessage"
            fullWidth
            label="Type your message..."
            variant="outlined"
            multiline
            minRows={3}
            autoFocus={true}
            value={newMessage}
            // focused={true}
            onChange={(e) => {
              setNewMessage(e.target.value);
            }}
          />
          <IconButton
            color="primary"
            disabled={false}
            onClick={onSendNewMessage}
          >
            <ChevronRight />
          </IconButton>
        </Box>
      </Box>
    );
  };

  useEffect(() => {
    console.log("SELECTED SUPPORT");
    console.log(mail);
  }, [mail]);

  useEffect(() => {
    console.log("current user");
    console.log(user);
  }, [user]);

  return (
    <Sidebar
      hideBackdrop
      direction="right"
      show={mailDetailsOpen}
      sx={{ zIndex: 1, width: "100%", overflow: "hidden" }}
      onClose={() => {
        setMailDetailsOpen(false);
        setShowReplies(false);
      }}
    >
      <Fragment>
        <Box
          sx={{
            px: 2.6,
            py: [2.25, 3],
            backgroundColor: "background.paper",
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: ["flex-start", "center"],
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                display: "flex",
                overflow: "hidden",
                alignItems: "center",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              <IconButton
                sx={{ mr: 3 }}
                onClick={() => {
                  // route.push("/views/requests");
                  setShowReplies(false);
                  setMailDetailsOpen(false);
                }}
              >
                <ChevronLeft />
              </IconButton>
              <Box
                sx={{
                  display: "flex",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  flexDirection: ["column", "row"],
                }}
              >
                <Typography noWrap sx={{ mr: 5 }}>
                  {mail.title}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CustomChip
                    key={"label"}
                    size="small"
                    skin="light"
                    label={"label"}
                    // color={labelColors[label] as ThemeColor}
                    sx={{
                      height: 20,
                      textTransform: "capitalize",
                      "&:not(:last-of-type)": { mr: 2 },
                      "& .MuiChip-label": { fontWeight: 500 },
                    }}
                  />
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: "flex" }}></Box>
          </Box>
        </Box>
        <Box
          sx={{
            backgroundColor: "background.paper",
            p: (theme) => theme.spacing(3, 2, 3, 3),
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton size="small">
                <DeleteOutline sx={{ mr: 1 }} />
              </IconButton>

              <IconButton size="small">
                <EmailOutline sx={{ mr: 1 }} />
              </IconButton>
              <IconButton size="small" onClick={handleFolderMenuClick}>
                <FolderOutline sx={{ mr: 1 }} />
              </IconButton>
              <Menu
                open={openLabelMenu}
                anchorEl={labelAnchorEl}
                onClose={handleLabelMenuClose}
                PaperProps={{ style: { minWidth: "9rem" } }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              ></Menu>
              <IconButton size="small" onClick={handleLabelMenuClick}>
                <LabelOutline />
              </IconButton>
              <Menu
                open={openFolderMenu}
                anchorEl={folderAnchorEl}
                onClose={() => setFolderAnchorEl(null)}
                PaperProps={{ style: { minWidth: "9rem" } }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              ></Menu>
            </Box>
            <Box>
              <IconButton
                size="small"
                sx={{
                  mr: 1,
                }}
              >
                <StarOutline />
              </IconButton>
              <IconButton
                size="small"
                onClick={() =>
                  showReplies ? setShowReplies(false) : setShowReplies(true)
                }
              >
                {showReplies ? (
                  <ArrowCollapseVertical sx={{ mr: 1, fontSize: "1.375rem" }} />
                ) : (
                  <ArrowExpandVertical sx={{ mr: 1, fontSize: "1.375rem" }} />
                )}
              </IconButton>
              {/* ) : null} */}
              <IconButton size="small">
                <DotsVertical />
              </IconButton>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            height: "calc(100% - 7.75rem)",
            backgroundColor: (theme) => theme.palette.action.hover,
          }}
        >
          <ScrollWrapper>
            <Box
              sx={{
                py: 4,
                px: 5,
                width: "100%",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              {!showReplies && mail.children.length > 0 && (
                <Typography
                  onClick={() => setShowReplies(true)}
                  sx={{
                    mt: 1,
                    mb: 5,
                    color: "text.secondary",
                    cursor: "pointer",
                  }}
                >
                  {mail.children && mail.children.length} Earlier Messages
                </Typography>
              )}

              {!showReplies && (
                <>
                  {mail.children.length > 0 && (
                    <Fragment>
                      <HiddenReplyBack
                        sx={{ cursor: "pointer" }}
                        onClick={() => setShowReplies(true)}
                      />
                      <HiddenReplyFront
                        sx={{ cursor: "pointer" }}
                        onClick={() => setShowReplies(true)}
                      />
                    </Fragment>
                  )}
                  {shouldRender && renderLastItem()}
                </>
              )}

              {shouldRender && renderAllItems(allItems)}
            </Box>
          </ScrollWrapper>
          {renderSendNewMessage()}
        </Box>
      </Fragment>
    </Sidebar>
  );
};

export default MailDetails;
