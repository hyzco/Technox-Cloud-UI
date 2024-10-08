// ** React Imports
import {
  useState,
  useEffect,
  MouseEvent,
  useCallback,
  ReactElement,
} from "react";

// ** Next Import
import Link from "next/link";

// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Menu from "@mui/material/Menu";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

import { DataGrid } from "@mui/x-data-grid";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { SelectChangeEvent } from "@mui/material/Select";

// ** Icons Imports
import Laptop from "mdi-material-ui/Laptop";
import ChartDonut from "mdi-material-ui/ChartDonut";
import CogOutline from "mdi-material-ui/CogOutline";
import EyeOutline from "mdi-material-ui/EyeOutline";
import DotsVertical from "mdi-material-ui/DotsVertical";
import PencilOutline from "mdi-material-ui/PencilOutline";
import DeleteOutline from "mdi-material-ui/DeleteOutline";
import AccountOutline from "mdi-material-ui/AccountOutline";

// ** Store Imports
import { useDispatch, useSelector } from "react-redux";

// ** Custom Components Imports
import CustomChip from "src/@core/components/mui/chip";
import CustomAvatar from "src/@core/components/mui/avatar";

// ** Utils Import
import { getInitials } from "src/@core/utils/get-initials";

// ** Actions Imports
import { fetchData } from "src/store/apps/server";

// ** Types Imports
import { RootState, AppDispatch } from "src/store";
import { ThemeColor } from "src/@core/layouts/types";
import { UsersType } from "src/types/apps/userTypes";

// ** Custom Components Imports
import TableHeader from "src/views/apps/user/list/TableHeader";
import AddUserDrawer from "src/views/apps/user/list/AddUserDrawer";
import useGetUser from "src/hooks/useGetUser";
import TableBasic from "src/views/table/data-grid/TableBasic";

// import DialogCreateServer from "src/views/pages/dialog-examples/DialogCreateServer";
import { useRouter } from "next/router";

interface UserRoleType {
  [key: string]: ReactElement;
}

interface UserStatusType {
  [key: string]: ThemeColor;
}

// ** Vars
const userRoleObj: UserRoleType = {
  admin: <Laptop sx={{ mr: 2, color: "error.main" }} />,
  author: <CogOutline sx={{ mr: 2, color: "warning.main" }} />,
  editor: <PencilOutline sx={{ mr: 2, color: "info.main" }} />,
  maintainer: <ChartDonut sx={{ mr: 2, color: "success.main" }} />,
  subscriber: <AccountOutline sx={{ mr: 2, color: "primary.main" }} />,
};

interface CellType {
  row: UsersType;
}

const userStatusObj: UserStatusType = {
  active: "success",
  pending: "warning",
  inactive: "secondary",
};

// ** Styled component for the link for the avatar with image
const AvatarWithImageLink = styled(Link)(({ theme }) => ({
  marginRight: theme.spacing(3),
}));

// ** Styled component for the link for the avatar without image
const AvatarWithoutImageLink = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  marginRight: theme.spacing(3),
}));

// ** renders client column
const renderClient = (row: UsersType) => {
  if (row.avatar.length) {
    return (
      <AvatarWithImageLink href={`/apps/user/view/${row.id}`}>
        <CustomAvatar src={row.avatar} sx={{ mr: 3, width: 34, height: 34 }} />
      </AvatarWithImageLink>
    );
  } else {
    return (
      <AvatarWithoutImageLink href={`/apps/user/view/${row.id}`}>
        <CustomAvatar
          skin="light"
          color={row.avatarColor || "primary"}
          sx={{ mr: 3, width: 34, height: 34, fontSize: "1rem" }}
        >
          {getInitials(row.fullName ? row.fullName : "John Doe")}
        </CustomAvatar>
      </AvatarWithoutImageLink>
    );
  }
};

// ** Styled component for the link inside menu
const MenuItemLink = styled("a")(({ theme }) => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
  padding: theme.spacing(1.5, 4),
  color: theme.palette.text.primary,
}));

const RowOptions = ({ id }: { id: number | string }) => {
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>();

  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const rowOptionsOpen = Boolean(anchorEl);

  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleRowOptionsClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    // dispatch(deleteUser(id));
    handleRowOptionsClose();
  };

  return (
    <>
      <IconButton size="small" onClick={handleRowOptionsClick}>
        <DotsVertical />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{ style: { minWidth: "8rem" } }}
      >
        <MenuItem sx={{ p: 0 }}>
          <Link href={`/apps/user/view/${id}`} passHref>
            <MenuItemLink>
              <EyeOutline fontSize="small" sx={{ mr: 2 }} />
              View
            </MenuItemLink>
          </Link>
        </MenuItem>
        <MenuItem onClick={handleRowOptionsClose}>
          <PencilOutline fontSize="small" sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <DeleteOutline fontSize="small" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Menu>
    </>
  );
};

// const columns = [
//   {
//     flex: 0.2,
//     minWidth: 230,
//     field: "fullName",
//     headerName: "Sunucu Adı",
//     renderCell: ({ row }: CellType) => {
//       const { id, fullName, username } = row;

//       return (
//         <Box sx={{ display: "flex", alignItems: "center" }}>
//           {renderClient(row)}
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "flex-start",
//               flexDirection: "column",
//             }}
//           >
//             <Link href={`/apps/user/view/${id}`} passHref>
//               <Typography
//                 noWrap
//                 component="a"
//                 variant="subtitle2"
//                 sx={{ color: "text.primary", textDecoration: "none" }}
//               >
//                 {fullName}
//               </Typography>
//             </Link>
//             <Link href={`/apps/user/view/${id}`} passHref>
//               <Typography
//                 noWrap
//                 component="a"
//                 variant="caption"
//                 sx={{ textDecoration: "none" }}
//               >
//                 @{username}
//               </Typography>
//             </Link>
//           </Box>
//         </Box>
//       );
//     },
//   },
//   {
//     flex: 0.2,
//     minWidth: 250,
//     field: "email",
//     headerName: "IP Adresi",
//     renderCell: ({ row }: CellType) => {
//       return (
//         <Typography noWrap variant="body2">
//           {row.email}
//         </Typography>
//       );
//     },
//   },
//   {
//     flex: 0.15,
//     field: "role",
//     minWidth: 150,
//     headerName: "Trafik Kullanımı",
//     renderCell: ({ row }: CellType) => {
//       return (
//         <Box sx={{ display: "flex", alignItems: "center" }}>
//           {userRoleObj[row.role]}
//           <Typography
//             noWrap
//             sx={{ color: "text.secondary", textTransform: "capitalize" }}
//           >
//             {row.role}
//           </Typography>
//         </Box>
//       );
//     },
//   },
//   {
//     flex: 0.15,
//     minWidth: 120,
//     headerName: "Kullanım",
//     field: "currentPlan",
//     renderCell: ({ row }: CellType) => {
//       return (
//         <Typography
//           variant="subtitle1"
//           noWrap
//           sx={{ textTransform: "capitalize" }}
//         >
//           {row.currentPlan}
//         </Typography>
//       );
//     },
//   },
//   {
//     flex: 0.1,
//     minWidth: 110,
//     field: "status",
//     headerName: "Durumu",
//     renderCell: ({ row }: CellType) => {
//       return (
//         <CustomChip
//           skin="light"
//           size="small"
//           label={row.status}
//           color={userStatusObj[row.status]}
//           sx={{
//             textTransform: "capitalize",
//             "& .MuiChip-label": { lineHeight: "18px" },
//           }}
//         />
//       );
//     },
//   },
//   {
//     flex: 0.1,
//     minWidth: 90,
//     sortable: false,
//     field: "actions",
//     headerName: "Yönetim",
//     renderCell: ({ row }: CellType) => <RowOptions id={row.id} />,
//   },
// ];

const columns = [
  {
    flex: 0.1,
    field: "id",
    minWidth: 80,
    headerName: "ID",
    renderCell: (idState: any) => {
      console.log(idState.row);
      const router = useRouter();

      return (
        <Button
          onClick={() => {
            router.push(
              {
                pathname: `/views/servers/view-server/${idState.row.id}`,
                query: { ...idState.row },
              },
              `/views/servers/view-server/${idState.row.id}`
            );
          }}

          // href={`/views/servers/view-server/${idState.row.id}`}
        >
          {idState.row.id}
        </Button>
      );
    },
  },
  {
    flex: 0.25,
    minWidth: 200,
    field: "name",
    headerName: "Name",
  },
  {
    flex: 0.25,
    minWidth: 200,
    field: "ip_address",
    headerName: "IP Address",
    valueGetter: (ipState: any) => {
      console.log(ipState);
      if (ipState.value) {
        return ipState.value;
      } else {
        return "Not Set";
      }
    },
  },
  {
    flex: 0.25,
    minWidth: 230,
    field: "traffic_usage",
    headerName: "Traffic Usage",
    valueGetter: () => {
      return "NoN";
    },
  },
  {
    flex: 0.15,
    minWidth: 130,
    field: "usage",
    headerName: "Usage",
    valueGetter: () => {
      return "NoN";
    },
  },
  {
    flex: 0.15,
    minWidth: 120,
    field: "power_state",
    headerName: "Power Status",
    renderCell: (powerState: any) => {
      console.log(powerState);
      enum POWER_STATUS {
        POWERED_OFF = "POWERED_OFF",
        POWERED_ON = "POWERED_ON",
      }

      if (powerState.row.power_state === POWER_STATUS.POWERED_ON) {
        const element = (
          <Typography
            variant="body2"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <strong>Running </strong>
            <Box
              sx={{
                marginLeft: 1,
                width: 14,
                height: 14,
                backgroundColor: "green",
                borderRadius: "50%",
              }}
            ></Box>
          </Typography>
        );
        return element;
      } else if (powerState.row.power_state === POWER_STATUS.POWERED_OFF) {
        const element = (
          <Typography
            variant="body2"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <strong>Stopped </strong>
            <Box
              sx={{
                marginLeft: 1,
                width: 14,
                height: 14,
                backgroundColor: "red",
                borderRadius: "50%",
              }}
            ></Box>
          </Typography>
        );
        return element;
      } else {
        const element = (
          <Typography
            variant="body2"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <strong>Unknown </strong>
            <Box
              sx={{
                marginLeft: 1,
                width: 14,
                height: 14,
                backgroundColor: "grey",
                borderRadius: "50%",
              }}
            ></Box>
          </Typography>
        );
        return element;
      }
    },
  },
];

const Servers: React.FC = () => {
  // ** State
  const [role, setRole] = useState<string>("");
  const [plan, setPlan] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false);
  const [listData, setListData] = useState<Array<any>>([]);

  // ** Hooks
  const store = useSelector((state: RootState) => state.server);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  // const { userServer, loading } = useGetUser();

  useEffect(() => {
    dispatch(fetchData({})).then((val) => {
      console.log("here");
      console.log(val);
      setListData(val.payload);
    });
  }, []);

  //TODO: investivate why store doesn't have data
  useEffect(() => {
    if (store && store.serverList) {
      console.log("store serverList");
      console.log(store.serverList);
    }
  }, [store]);

  const handleFilter = useCallback((val: string) => {
    setValue(val);
  }, []);

  const handleRoleChange = useCallback((e: SelectChangeEvent) => {
    setRole(e.target.value);
  }, []);

  const handlePlanChange = useCallback((e: SelectChangeEvent) => {
    setPlan(e.target.value);
  }, []);

  const handleStatusChange = useCallback((e: SelectChangeEvent) => {
    setStatus(e.target.value);
  }, []);

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen);

  if (listData !== undefined && listData.length > 0) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="Manage"
              sx={{
                pb: 4,
                "& .MuiCardHeader-title": { letterSpacing: ".15px" },
              }}
            />
            <CardContent>
              <Grid container spacing={6}>
                <Grid item sm={4} xs={12}>
                  <Button
                    variant="outlined"
                    fullWidth
                    style={{
                      color: "#17a2b8",
                      borderColor: "#17a2b8",
                    }}
                  >
                    SSH Keys
                  </Button>
                </Grid>
                {/* <Grid item sm={4} xs={12}>
                  <Button
                    variant="outlined"
                    fullWidth
                    style={{
                      color: "#007bff",
                      borderColor: "#007bff",
                    }}
                  >
                    ISO Kütüphaneniz
                  </Button>
                </Grid> */}
                <Grid item sm={4} xs={12}>
                  <Button
                    variant="outlined"
                    fullWidth
                    style={{
                      color: "#28a745",
                      borderColor: "#28a745",
                    }}
                    onClick={() => {
                      router.push("servers/new");
                    }}
                  >
                    Create New Server
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <TableHeader value={value} handleFilter={handleFilter} />
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <Grid
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 3,
              }}
            >
              <CardHeader
                title="Virtual Servers"
                sx={{
                  pb: 4,
                  "& .MuiCardHeader-title": { letterSpacing: ".15px" },
                }}
              />
              <a
                href=""
                style={{
                  letterSpacing: ".15px",
                  fontSize: "20px",
                  color: "#007bff",
                }}
              >
                Closed Servers
              </a>
            </Grid>

            {/* <DataGrid
            autoHeight
            rows={store.serverList}
            columns={columns}
            checkboxSelection
            pageSize={pageSize}
            disableSelectionOnClick
            rowsPerPageOptions={[10, 25, 50]}
            sx={{ "& .MuiDataGrid-columnHeaders": { borderRadius: 0 } }}
            onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
          /> */}
            <TableBasic columns={columns} rows={listData} />
          </Card>
        </Grid>

        {/* <DialogCreateServer show={addUserOpen} toggle={toggleAddUserDrawer} /> */}

        {/* <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} /> */}
      </Grid>
    );
  } else {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardContent
              sx={{
                pt: 20,
                textAlign: "center",
                pb: (theme) => `${theme.spacing(25)} !important`,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  mb: 2.5,
                  color: "primary.main",
                  fontWeight: 600,
                  fontSize: "1.5rem !important",
                }}
              >
                You don't have any servers.
              </Typography>
              <Typography variant="body1" sx={{ mb: 6.5 }}>
                You can click the button bellow to create a new server.
              </Typography>
              <Button
                variant="outlined"
                // fullWidth
                style={
                  {
                    // color: "#28a745",
                    // borderColor: "#28a745",
                  }
                }
                onClick={() => {
                  router.push(`/views/servers/new`);
                }}
              >
                Create New Server
              </Button>
            </CardContent>
          </Card>
        </Grid>
        {/* <DialogCreateServer show={addUserOpen} toggle={toggleAddUserDrawer} /> */}
      </Grid>
    );
  }
};

export default Servers;
