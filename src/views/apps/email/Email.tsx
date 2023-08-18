// ** React Imports
import { useState, useEffect, useRef, useMemo } from "react";

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
import { fetchData, fetchTotalRequest } from "src/store/apps/support";
import MailDetails from "./MailDetails";
import select from "src/@core/theme/overrides/select";
import { useRouter } from "next/router";

// ** Variables
const labelColors: MailLabelColors = {
  private: "error",
  personal: "success",
  company: "primary",
  important: "warning",
};

const EmailAppLayout = ({ folder, label }: MailLayoutType) => {
  const store = useSelector((state: RootState) => state.support);

  // ** States
  const [query, setQuery] = useState<string>("");
  const [composeOpen, setComposeOpen] = useState<boolean>(false);
  const [mailDetailsOpen, setMailDetailsOpen] = useState<boolean>(false);
  const [selectedMail, setSelectedMail] = useState<any>({});
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false);

  const [emails, setEmails] = useState<any>(store.supportList);
  const [totalEmailCount, setTotalEmailCount] = useState<any>(
    store.totalRequestCount
  );
  const [fetchedEmailCount, setFetchedEmailCount] = useState<number>(0);

  const [offset, setOffset] = useState<number>(0);
  const limit = 15;
  // const attemptLimit = 10;

  // ** Hooks
  const theme = useTheme();
  const { settings } = useSettings();
  const dispatch = useDispatch<AppDispatch>();
  const lgAbove = useMediaQuery(theme.breakpoints.up("lg"));
  const mdAbove = useMediaQuery(theme.breakpoints.up("md"));
  const smAbove = useMediaQuery(theme.breakpoints.up("sm"));
  const hidden = useMediaQuery(theme.breakpoints.down("lg"));
  // const store = useSelector((state: RootState) => state.support);

  // ** Vars
  const leftSidebarWidth = 260;
  const composePopupWidth = mdAbove ? 754 : smAbove ? 520 : "100%";
  const { skin, appBar, footer, layout, navHidden } = settings;

  useEffect(() => {
    // @ts-ignore

    dispatch(fetchTotalRequest({})).then((response) => {
      setTotalEmailCount(response.payload);
    });
    // setOffset(1);
  }, []);

  useEffect(() => {
    fetchMails();
  }, [totalEmailCount]);

  const toggleComposeOpen = () => setComposeOpen(!composeOpen);
  const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen);

  const calculateAppHeight = () => {
    return `(${
      (appBar === "hidden" ? 0 : (theme.mixins.toolbar.minHeight as number)) *
        (layout === "horizontal" && !navHidden ? 2 : 1) +
      (footer === "hidden" ? 0 : 56)
    }px + ${theme.spacing(6)} * 2)`;
  };

  const containerRef = useRef<HTMLDivElement | null>(null);

  const fetchMails = async () => {
    console.log("Email.length: " + emails.length);
    console.log("Total Email Count: " + totalEmailCount);
    if (
      emails.length < totalEmailCount ||
      (emails.length === 0 && totalEmailCount === 0) ||
      fetchedEmailCount < totalEmailCount
    ) {
      // Fetch data only if we haven't fetched all possible emails
      // if (offset <= attemptLimit) {
      dispatch(
        fetchData({
          offset: fetchedEmailCount,
          limit: limit,
          isParents: true,
        })
      ).then((data: any) => {
        // Append the fetched data to the existing emails
        setEmails((prevEmails: any) => {
          console.log("Prev emails: " + prevEmails.length);
          console.log("Data payload length: " + data.payload.length);
          console.log("\n");
          if (prevEmails.length + data.payload.length <= totalEmailCount) {
            setFetchedEmailCount(
              (prevCount) => prevCount + data.payload.length
            );
            setOffset(offset + limit);

            const newEmailArr = [...prevEmails, ...data.payload];
            newEmailArr.sort((a, b) => {
              if (a.createdAt > b.createdAt) {
                return 1;
              } else {
                return 0;
              }
            });
            return newEmailArr;
          } else {
            return prevEmails;
          }
        });
      });
    } else {
      console.log("All emails have been fetched.");
      dispatch(fetchTotalRequest({})).then((response) => {
        setTotalEmailCount(response.payload);
      });
    }
  };

  const memoizedFetchMails = useMemo(
    () => fetchMails,
    [offset, totalEmailCount]
  );

  if (true) {
    // return <></>;
  }

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
      {!mailDetailsOpen && (
        <SidebarLeft
          store={emails}
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
      )}
      {!mailDetailsOpen && (
        <MailLog
          totalMailCount={totalEmailCount}
          supportList={emails}
          setMailDetailsOpen={setMailDetailsOpen}
          setSelectedMail={setSelectedMail}
          scrollRef={containerRef}
          fetchMails={memoizedFetchMails}
          fetchTotalRequestCount={fetchTotalRequest}
        />
      )}

      {mailDetailsOpen && (
        <Box
        // sx={{
        //   flex: 1,

        //   flexDirection: "column",
        //   alignItems: "center",
        //   justifyContent: "center",
        // }}
        >
          {selectedMail && (
            <MailDetails
              mail={selectedMail}
              mailDetailsOpen={mailDetailsOpen}
              setMailDetailsOpen={setMailDetailsOpen}
              refreshData={() => {
                // @ts-ignore
                dispatch(fetchData());
                // setMailDetailsOpen(true);
              }}
            />
          )}
        </Box>
      )}

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
