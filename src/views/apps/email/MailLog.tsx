// ** React Imports
import { useState, ReactNode, useEffect, useMemo } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Backdrop from "@mui/material/Backdrop";
import Checkbox from "@mui/material/Checkbox";
import Avatar from "@mui/material/Avatar";
import { styled, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import ListItem, { ListItemProps } from "@mui/material/ListItem";
import MailDetails from "./MailDetails";

// ** Icons Import
import AlertCircleOutline from "mdi-material-ui/AlertCircleOutline";

// ** Third Party Imports
import PerfectScrollbar from "react-perfect-scrollbar";

// ** Types
import { MailListType } from "src/types/apps/emailTypes";
import { useSettings } from "src/@core/hooks/useSettings";
import { useDispatch, useSelector } from "react-redux";
import useMediaQuery from "@mui/material/useMediaQuery";
import { AppDispatch, RootState } from "src/store";
import Badge from "@mui/material/Badge";
import React from "react";

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

const ScrollWrapper = React.memo(
  ({
    children,
    hidden,
    onYReachStart,
    onYReachEnd,
    onScrollY,
    onScrollDown,
    scrollRef,
  }: {
    children: ReactNode;
    hidden: boolean;
    onYReachStart: () => void;
    onYReachEnd: () => void;
    onScrollY: () => void;
    onScrollDown: () => void;
    scrollRef: any;
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
          onScrollY={onScrollY}
          onYReachEnd={onYReachEnd}
          onYReachStart={onYReachStart}
          onScrollDown={onScrollDown}
          containerRef={(ref) => (scrollRef.current = ref)} // Set the container ref
          options={{
            // wheelPropagation: true,
            suppressScrollX: true,
            // minScrollbarLength: 1500,
          }}
        >
          {children}
        </PerfectScrollbar>
      );
    }
  }
);

const MailLog = React.memo((props: MailListType) => {
  // ** Props
  const {
    totalMailCount,
    supportList,
    setMailDetailsOpen,
    setSelectedMail,
    fetchMails,
    fetchTotalRequestCount,
    scrollRef,
  } = props;

  const delay = (milliseconds: number) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  let apiCallCount_start = 0;
  let apiCallInProgress_start = false;

  const handleScrollStart = () => {
    if (!apiCallInProgress_start) {
      apiCallInProgress_start = true;

      delay(3000)
        .then(() => {
          if (apiCallCount_start < 3) {
            fetchMails();
            apiCallCount_start++;
          }
        })
        .finally(() => {
          apiCallInProgress_start = false;
          apiCallCount_start = 0;
        });
    } else {
      console.log("You can refresh it in 3 seconds..");
    }
  };

  let apiCallCount = 0;
  let apiCallInProgress = false;

  const handleScrollEnd = async () => {
    if (scrollRef.current != null) {
      if (scrollRef.current.scrollTop == scrollRef.current.scrollTopMax) {
        scrollRef.current.scrollTop = scrollRef.current.scrollTop - 10;

        if (!apiCallInProgress) {
          apiCallInProgress = true;

          delay(3000)
            .then(() => {
              if (apiCallCount < 3) {
                fetchMails();
                apiCallCount++;
              }
            })
            .finally(() => {
              apiCallInProgress = false;
              apiCallCount = 0;
            });
        } else {
          console.log("You can refresh it in 3 seconds..");
        }
      }
    }
  };

  const handleScroll = () => {
    const scrollContainer = scrollRef.current;

    if (scrollContainer) {
      const thresholdStart =
        scrollContainer.scrollHeight - scrollContainer.clientHeight - 80;
      const thresholdEnd =
        scrollContainer.scrollHeight - scrollContainer.clientHeight - 40;

      if (
        scrollContainer.scrollTop >= thresholdStart ||
        scrollContainer.scrollTop === scrollContainer.scrollTopMax
      ) {
        console.log("Scrolled with threshold");
        // fetchMails();
      }
    }
  };

  const onScrollDown = () => {
    console.log("scrolling down");
  };

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
        <Box sx={{ px: 5, py: 3, display: "flex", alignItems: "center" }}>
          <Typography variant="h6">Support Requests</Typography>
          <Badge badgeContent={totalMailCount} color="primary" sx={{ ml: 6 }} />
        </Box>
        <Divider sx={{ m: 0 }} />
        <Box
          sx={{
            p: 0,
            position: "relative",
            overflowX: "hidden",
            height: "calc(100% - 7rem)",
          }}
        >
          <ScrollWrapper
            hidden={false}
            onYReachStart={handleScrollStart}
            onYReachEnd={handleScrollEnd}
            onScrollY={handleScroll}
            onScrollDown={onScrollDown}
            scrollRef={scrollRef}
          >
            {supportList ? (
              <List sx={{ p: 0 }}>
                {supportList.map((support: any, index: number) => {
                  return (
                    <Box
                      key={index + "SI"}
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
                        onClick={() => {
                          setMailDetailsOpen(true);
                          setSelectedMail(support);
                          // dispatch(getCurrentMail(mail.id));
                          // dispatch(
                          //   updateMail({
                          //     emailIds: [mail.id],
                          //     dataToUpdate: { isRead: true },
                          //   })
                          // );
                          // setTimeout(() => {
                          //   dispatch(handleSelectAllMail(false));
                          // }, 600);
                        }}
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
                          <Checkbox
                          // onClick={(e) => e.stopPropagation()}
                          // onChange={() => dispatch(handleSelectMail(mail.id))}
                          // checked={
                          //   support.selectedMails.includes(support.id) ||
                          //   false
                          // }
                          />
                          <Avatar
                            // alt={mail.from.name}
                            // src={mail.from.avatar}
                            sx={{ mr: 3.5, width: "2rem", height: "2rem" }}
                          />
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
            open={false}
            // onClick={() => setRefresh(false)}
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
    </Box>
  );
});

export default MailLog;
