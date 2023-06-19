// ** React Imports
import { useState, ReactNode } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Backdrop from "@mui/material/Backdrop";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import ListItem, { ListItemProps } from "@mui/material/ListItem";

// ** Icons Import
import AlertCircleOutline from "mdi-material-ui/AlertCircleOutline";

// ** Third Party Imports
import PerfectScrollbar from "react-perfect-scrollbar";

// ** Types
import { MailListType } from "src/types/apps/emailTypes";

const MailItem = styled(ListItem)<ListItemProps>(({ theme }) => ({
  zIndex: 1,
  cursor: "pointer",
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  justifyContent: "space-between",
  [theme.breakpoints.up("xs")]: {
    paddingLeft: theme.spacing(2.5),
    paddingRight: theme.spacing(2.5),
  },
  [theme.breakpoints.up("sm")]: {
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5),
  },
}));

const ScrollWrapper = ({
  children,
  hidden,
}: {
  children: ReactNode;
  hidden: boolean;
}) => {
  if (hidden) {
    return (
      <Box sx={{ height: "100%", overflowY: "auto", overflowX: "hidden" }}>
        {children}
      </Box>
    );
  } else {
    return (
      <PerfectScrollbar
        options={{ wheelPropagation: false, suppressScrollX: true }}
      >
        {children}
      </PerfectScrollbar>
    );
  }
};

const MailLog = (props: MailListType) => {
  // ** Props
  const { supportList } = props;

  // ** State
  const [refresh, setRefresh] = useState<boolean>(false);

  return (
    <Box
      sx={{
        width: "100%",
        overflow: "hidden",
        position: "relative",
        "& .ps__rail-y": { zIndex: 5 },
      }}
    >
      <Box sx={{ height: "100%", backgroundColor: "background.paper" }}>
        <Box sx={{ px: 5, py: 3 }}></Box>
        <Divider sx={{ m: 0 }} />
        <Box
          sx={{
            p: 0,
            position: "relative",
            overflowX: "hidden",
            height: "calc(100% - 7rem)",
          }}
        >
          <ScrollWrapper hidden={true}>
            {supportList ? (
              <List sx={{ p: 0 }}>
                {supportList.map((support: any, index: number) => {
                  return (
                    <Box
                      key={support.id}
                      sx={{
                        transition: "all 0.15s ease-in-out",
                        "&:hover": {
                          zIndex: 2,
                          boxShadow: "3",
                          transform: "translateY(-2px)",
                          "& .mail-info-right": {
                            display: "none",
                          },
                          "& .mail-actions": {
                            display: "flex",
                          },
                        },
                      }}
                    >
                      <MailItem
                        sx={{
                          py: 2.75,
                          backgroundColor: "background.paper",
                        }}
                        // onClick={() => {
                        //   setMailDetailsOpen(true);
                        //   dispatch(getCurrentMail(mail.id));
                        //   dispatch(
                        //     updateMail({
                        //       emailIds: [mail.id],
                        //       dataToUpdate: { isRead: true },
                        //     })
                        //   );
                        //   setTimeout(() => {
                        //     dispatch(handleSelectAllMail(false));
                        //   }, 600);
                        // }}
                      >
                        <Box
                          sx={{
                            mr: 4,
                            width: "100%",
                            display: "flex",
                            overflow: "hidden",
                            alignItems: "center",
                          }}
                        >
                          {/* <Checkbox
                            onClick={(e) => e.stopPropagation()}
                            // onChange={() => dispatch(handleSelectMail(mail.id))}
                            checked={
                              support.selectedMails.includes(support.id) || false
                            }
                          /> */}
                          {/* <Avatar
                            alt={mail.from.name}
                            src={mail.from.avatar}
                            sx={{ mr: 3.5, width: "2rem", height: "2rem" }}
                          /> */}
                          <Box
                            sx={{
                              display: "flex",
                              width: "40%",
                              overflow: "hidden",
                              flexDirection: { xs: "column", sm: "row" },
                              alignItems: { xs: "flex-start", sm: "center" },
                            }}
                          >
                            <Typography
                              sx={{
                                mr: 4,
                                fontWeight: 600,
                                whiteSpace: "nowrap",
                                width: ["100%", "auto"],
                                overflow: ["hidden", "unset"],
                                textOverflow: ["ellipsis", "unset"],
                              }}
                            >
                              {support.title}
                            </Typography>
                            <Typography
                              noWrap
                              variant="body2"
                              sx={{ width: "100%" }}
                            >
                              {support.description}
                            </Typography>
                            <Typography
                              noWrap
                              variant="body2"
                              sx={{ width: "100%" }}
                            >
                              {support.departmentName}
                            </Typography>
                          </Box>
                        </Box>
                      </MailItem>
                    </Box>
                  );
                })}
              </List>
            ) : (
              <Box
                sx={{
                  mt: 6,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <AlertCircleOutline fontSize="small" sx={{ mr: 2 }} />
                <Typography>No Request Data</Typography>
              </Box>
            )}
          </ScrollWrapper>
          <Backdrop
            open={refresh}
            onClick={() => setRefresh(false)}
            sx={{
              zIndex: 5,
              position: "absolute",
              color: (theme) => theme.palette.common.white,
              backgroundColor: "action.disabledBackground",
            }}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </Box>
      </Box>

      {/* @ts-ignore */}
      {/* <MailDetails {...mailDetailsProps} /> */}
    </Box>
  );
};

export default MailLog;
