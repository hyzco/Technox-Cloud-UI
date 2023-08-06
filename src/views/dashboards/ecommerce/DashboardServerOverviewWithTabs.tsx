// ** React Imports
import {
  HTMLAttributes,
  SyntheticEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

// ** MUI Import
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Card from "@mui/material/Card";
import TabList from "@mui/lab/TabList";
import Table from "@mui/material/Table";
import TabPanel from "@mui/lab/TabPanel";
import Avatar from "@mui/material/Avatar";
import TabContext from "@mui/lab/TabContext";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";

// ** Icons Imports
import Plus from "mdi-material-ui/Plus";
import DotsVertical from "mdi-material-ui/DotsVertical";

// ** Type Imports
import { ThemeColor } from "src/@core/layouts/types";

// ** Custom Components
import CustomChip from "src/@core/components/mui/chip";

// ** Util Import
import { hexToRGBA } from "src/@core/utils/hex-to-rgba";
import { useAuth } from "src/hooks/useAuth";
import useAxiosFunction from "src/@core/hooks/useAxiosFunction";

import userConfig from "src/configs/user";
import vmApi from "src/@core/apis/vmApi";
import { HTTP_METHOD } from "src/@core/enums/axios.enum";
import React from "react";

interface StatusObj {
  [ke: string]: {
    text: string;
    color: ThemeColor;
  };
}
interface TabAvatarType {
  imgWidth: number;
  category: string;
  imgHeight: number;
}
interface TabContentType {
  imgAlt: string;
  imgSrc: string;
  product: string;
  usage: string;
  conversion: string;
  conversionDifference?: "positive" | "negative";
  status: "powered-on" | "powered-off" | "suspended";
}
interface TabContentDataType {
  virtualMachine: TabContentType[];
  // desktop: TabContentType[];
  // console: TabContentType[];
}

const statusObj: StatusObj = {
  "powered-on": { text: "Powered On", color: "success" },
  "powered-off": { text: "Powered Off", color: "primary" },
  suspended: { text: "Suspended", color: "warning" },
};

const tabAvatars: TabAvatarType[] = [
  {
    imgWidth: 30,
    imgHeight: 58,
    category: "virtualMachine",
  },
  {
    imgWidth: 52,
    imgHeight: 42,
    category: "desktop",
  },
  {
    imgWidth: 60,
    imgHeight: 42,
    category: "console",
  },
];

const tabContentData: TabContentDataType = {
  virtualMachine: [
    {
      usage: "3d 15h",
      conversion: "+24",
      imgAlt: "samsung-s22",
      status: "powered-off",
      product: "theycloud - zabbix server",
      imgSrc: "/images/logos/theycloud.png",
    },
    {
      usage: "7d 18h 45m 10s",
      conversion: "-18",
      status: "powered-on",
      imgAlt: "apple-iPhone-13-pro",
      product: "theycloud - blog",
      conversionDifference: "negative",
      imgSrc: "/images/logos/theycloud.png",
    },
    {
      usage: "1d 10h",
      conversion: "+55",
      status: "suspended",
      imgAlt: "oneplus-9-pro",
      product: "theycloud - dns server",
      imgSrc: "/images/logos/theycloud.png",
    },
  ],
  // desktop: [
  //   {
  //     usage: "$94.6k",
  //     conversion: "+16",
  //     status: "in-stock",
  //     imgAlt: "apple-mac-mini",
  //     product: "Apple Mac Mini",
  //     imgSrc: "/images/logos/theycloud.png",
  //   },
  //   {
  //     usage: "$76.5k",
  //     conversion: "+27",
  //     status: "coming-soon",
  //     imgAlt: "hp-envy-x360",
  //     product: "Newest HP Envy x360",
  //     imgSrc: "/images/logos/theycloud.png",
  //   },
  //   {
  //     usage: "$69.3k",
  //     conversion: "-9",
  //     status: "out-of-stock",
  //     imgAlt: "dell-inspiron-3000",
  //     product: "Dell Inspiron 3000",
  //     conversionDifference: "negative",
  //     imgSrc: "/images/logos/theycloud.png",
  //   },
  // ],
  // console: [
  //   {
  //     usage: "$18.6k",
  //     conversion: "+34",
  //     status: "coming-soon",
  //     imgAlt: "sony-play-station-5",
  //     product: "Sony Play Station 5",
  //     imgSrc: "/images/logos/theycloud.png",
  //   },
  //   {
  //     usage: "$29.7k",
  //     conversion: "-21",
  //     status: "out-of-stock",
  //     imgAlt: "xbox-series-x",
  //     product: "XBOX Series X",
  //     conversionDifference: "negative",
  //     imgSrc: "/images/logos/theycloud.png",
  //   },
  //   {
  //     usage: "$10.4k",
  //     conversion: "+38",
  //     status: "in-stock",
  //     imgAlt: "nintendo-switch",
  //     product: "Nintendo Switch",
  //     imgSrc: "/images/logos/theycloud.png",
  //   },
  // ],
};

const getVirtualMachineList: React.FunctionComponent = (): JSX.Element => {
  const [response, error, loading, axiosFetch] = useAxiosFunction();
  // const { user } = useAuth();

  const storedToken = window.localStorage.getItem(
    userConfig.storageTokenKeyName
  )!;

  axiosFetch({
    axiosInstance: vmApi,
    method: HTTP_METHOD.GET,
    url: "/user/server",
    requestConfig: {
      headers: {
        Authorization: storedToken,
      },
    },
  });

  useEffect(() => {
    console.log("response in getVirtualMachineList");
    console.log(response);
    console.log(error);
  }, [response, error]);

  return <></>;
};

// const memoizedVirtualMachineList = React.memo(getVirtualMachineList);

const RenderTabContent = ({ data }: { data: TabContentType[] }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow
            sx={{
              "& .MuiTableCell-root": {
                py: (theme) => `${theme.spacing(2.5)} !important`,
              },
            }}
          >
            <TableCell>Type</TableCell>
            <TableCell sx={{ whiteSpace: "nowrap" }}>Name</TableCell>
            <TableCell align="right">Status</TableCell>
            <TableCell align="right">Usage</TableCell>
            {/* <TableCell align="right">Conversion</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row: TabContentType, index: number) => (
            <TableRow
              key={index}
              sx={{
                "& .MuiTableCell-root": {
                  border: 0,
                  py: (theme) => `${theme.spacing(1.5)} !important`,
                },
                "&:first-child .MuiTableCell-body": {
                  pt: (theme) => `${theme.spacing(3)} !important`,
                },
                "&:last-child .MuiTableCell-body": {
                  pb: (theme) => `${theme.spacing(3)} !important`,
                },
              }}
            >
              <TableCell>
                <Avatar
                  alt={row.imgAlt}
                  src={row.imgSrc}
                  variant="rounded"
                  sx={{ width: 34, height: 34 }}
                />
              </TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    color: "text.primary",
                  }}
                >
                  {row.product}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <CustomChip
                  skin="light"
                  size="small"
                  label={statusObj[row.status].text}
                  color={statusObj[row.status].color}
                  sx={{
                    height: 20,
                    fontWeight: 500,
                    "& .MuiChip-label": { px: 1.625, lineHeight: 1.539 },
                  }}
                />
              </TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    textAlign: "right",
                    whiteSpace: "nowrap",
                    color: "text.primary",
                  }}
                >
                  {row.usage}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    textAlign: "right",
                    color:
                      row.conversionDifference === "negative"
                        ? "error.main"
                        : "success.main",
                  }}
                >{`${row.conversion}%`}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const renderVertialVmList = (
  value: String,
  handleChange: (event: SyntheticEvent, newValue: string) => void
) => {
  return (
    <TabList
      variant="scrollable"
      scrollButtons="auto"
      onChange={handleChange}
      aria-label="Inventory Item List"
      sx={{
        mb: 2.5,
        px: 5,
        "& .MuiTab-root:not(:last-child)": { mr: 4 },
        "& .MuiTabs-indicator": { display: "none" },
      }}
    >
      <Tab
        value="virtualMachine"
        sx={{ p: 0 }}
        label={<RenderTabAvatar data={tabAvatars[0]} />}
      />
      {/* <Tab
    value="desktop"
    sx={{ p: 0 }}
    label={<RenderTabAvatar data={tabAvatars[1]} />}
  />
  <Tab
    value="console"
    sx={{ p: 0 }}
    label={<RenderTabAvatar data={tabAvatars[2]} />}
  /> */}
      <Tab
        disabled
        value="add"
        sx={{ p: 0 }}
        label={
          <Avatar
            variant="rounded"
            sx={{
              width: 100,
              height: 92,
              backgroundColor: "transparent",
              border: (theme) =>
                value === "add"
                  ? `2px solid ${theme.palette.primary.main}`
                  : `2px dashed ${theme.palette.divider}`,
            }}
          >
            <Box
              sx={{
                width: 30,
                height: 30,
                display: "flex",
                borderRadius: "8px",
                alignItems: "center",
                color: "action.active",
                justifyContent: "center",
                backgroundColor: (theme) =>
                  hexToRGBA(theme.palette.secondary.main, 0.12),
              }}
            >
              <Plus />
            </Box>
          </Avatar>
        }
      />
    </TabList>
  );
};

const RenderTabAvatar = ({ data }: { data: TabAvatarType }) => (
  <Avatar
    variant="rounded"
    alt={`tabs-${data.category}`}
    src={`/images/logos/theycloud.png`}
    sx={{
      // width: 100,
      // height: 92,
      backgroundColor: "transparent",
      // "& img": { width: data.imgWidth, height: data.imgHeight },
      // border: (theme) =>
      // value === data.category
      // ? `2px solid ${theme.palette.primary.main}`
      // : `2px dashed ${theme.palette.divider}`,
    }}
  />
);

const DashboardServerOverviewWithTabs = () => {
  // ** State
  const [value, setValue] = useState<string>("virtualMachine");

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  // memoizedVirtualMachineList();

  return (
    <Card>
      <CardHeader
        title="Active Inventory"
        subheader="View overview of your current virtual machines"
        action={
          <IconButton
            size="small"
            aria-label="settings"
            className="card-more-options"
          >
            <DotsVertical />
          </IconButton>
        }
      />
      <TabContext value={value}>
        {renderVertialVmList(value, handleChange)}
        <TabPanel sx={{ p: 0 }} value="virtualMachine">
          <RenderTabContent data={tabContentData["virtualMachine"]} />
        </TabPanel>
        {/* <TabPanel sx={{ p: 0 }} value="desktop">
          <RenderTabContent data={tabContentData["desktop"]} />
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value="console">
          <RenderTabContent data={tabContentData["console"]} />
        </TabPanel> */}
      </TabContext>
    </Card>
  );
};

export default DashboardServerOverviewWithTabs;
