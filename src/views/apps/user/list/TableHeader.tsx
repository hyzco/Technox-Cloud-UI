// ** MUI Imports
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

interface TableHeaderProps {
  value: string;
  handleFilter: (val: string) => void;
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { handleFilter, value } = props;

  return (
    <Box
      sx={{
        p: 5,
        pb: 3,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* <Button sx={{ mr: 4, mb: 2 }} color='secondary' variant='outlined' startIcon={<ExportVariant fontSize='small' />}>
        Export
      </Button> */}
      <Box sx={{ display: "flex", width: "100%" }}>
        <TextField
          size="small"
          value={value}
          sx={{ mr: 6, mb: 2, width: "100%" }}
          placeholder="Search"
          onChange={(e) => handleFilter(e.target.value)}
        />

        {/* <Button sx={{ mb: 2 }} onClick={toggle} variant="contained">
          Add User
        </Button> */}
      </Box>
    </Box>
  );
};

export default TableHeader;
