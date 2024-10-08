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
import { fetchData, deleteUser } from "src/store/apps/user";

// ** Types Imports
import { RootState, AppDispatch } from "src/store";
import { ThemeColor } from "src/@core/layouts/types";
import { UsersType } from "src/types/apps/userTypes";

// ** Custom Components Imports
import TableHeader from "src/views/apps/user/list/TableHeader";
import AddUserDrawer from "src/views/apps/user/list/AddUserDrawer";

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
    dispatch(deleteUser(id));
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

const columns = [
  {
    flex: 0.2,
    minWidth: 230,
    field: "fullName",
    headerName: "Alan Adı",
    renderCell: ({ row }: CellType) => {
      const { id, fullName, username } = row;

      return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {renderClient(row)}
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              flexDirection: "column",
            }}
          >
            <Link href={`/apps/user/view/${id}`} passHref>
              <Typography
                noWrap
                component="a"
                variant="subtitle2"
                sx={{ color: "text.primary", textDecoration: "none" }}
              >
                {fullName}
              </Typography>
            </Link>
            <Link href={`/apps/user/view/${id}`} passHref>
              <Typography
                noWrap
                component="a"
                variant="caption"
                sx={{ textDecoration: "none" }}
              >
                @{username}
              </Typography>
            </Link>
          </Box>
        </Box>
      );
    },
  },
  {
    flex: 0.2,
    minWidth: 250,
    field: "email",
    headerName: "Birinci Nameserver",
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap variant="body2">
          {row.email}
        </Typography>
      );
    },
  },
  {
    flex: 0.15,
    field: "role",
    minWidth: 150,
    headerName: "İkinci Nameserver",
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {userRoleObj[row.role]}
          <Typography
            noWrap
            sx={{ color: "text.secondary", textTransform: "capitalize" }}
          >
            {row.role}
          </Typography>
        </Box>
      );
    },
  },
  {
    flex: 0.1,
    minWidth: 110,
    field: "status",
    headerName: "Durumu",
    renderCell: ({ row }: CellType) => {
      return (
        <CustomChip
          skin="light"
          size="small"
          label={row.status}
          color={userStatusObj[row.status]}
          sx={{
            textTransform: "capitalize",
            "& .MuiChip-label": { lineHeight: "18px" },
          }}
        />
      );
    },
  },
  {
    flex: 0.1,
    minWidth: 90,
    sortable: false,
    field: "actions",
    headerName: "İşlemler",
    renderCell: ({ row }: CellType) => <RowOptions id={row.id} />,
  },
];

const Records: React.FC = () => {
  // ** State
  const [role, setRole] = useState<string>("");
  const [plan, setPlan] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false);

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>();
  const store = useSelector((state: RootState) => state.user) as any;
  useEffect(() => {
    dispatch(
      fetchData({
        role,
        status,
        q: value,
        currentPlan: plan,
      })
    );
  }, [dispatch, plan, role, status, value]);

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

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title="DNS Kayıtları"
            sx={{ pb: 4, "& .MuiCardHeader-title": { letterSpacing: ".15px" } }}
          />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item sm={6} xs={12}>
                <Button
                  variant="outlined"
                  fullWidth
                  style={{
                    color: "#17a2b8",
                    borderColor: "#17a2b8",
                  }}
                >
                  Toplu Kayıt Değiştirme İşlemi
                </Button>
              </Grid>
              <Grid item sm={6} xs={12}>
                <Button
                  variant="outlined"
                  fullWidth
                  style={{
                    color: "#28a745",
                    borderColor: "#28a745",
                  }}
                >
                  Yeni Alan Adı Ekleyin
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
              title="Alan Adları"
              sx={{
                pb: 4,
                "& .MuiCardHeader-title": { letterSpacing: ".15px" },
              }}
            />
            <span
              style={{
                letterSpacing: ".15px",
                fontSize: "12px",
                color: "#6c757d",
              }}
            >
              Kalan DNS Kullanım Hakkınız 0 Adettir
            </span>
          </Grid>

          <DataGrid
            autoHeight
            rows={store?.data ?? []}
            columns={columns}
            checkboxSelection
            pageSize={pageSize}
            disableSelectionOnClick
            rowsPerPageOptions={[10, 25, 50]}
            sx={{ "& .MuiDataGrid-columnHeaders": { borderRadius: 0 } }}
            onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
          />
        </Card>
      </Grid>

      <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} />
    </Grid>
  );
};

export default Records;
