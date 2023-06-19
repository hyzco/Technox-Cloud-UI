// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import CardHeader from "@mui/material/CardHeader";
import { isNullOrUndefined } from "util";
import { Typography } from "@mui/material";

// ** Data Import
// import { rows } from 'src/@fake-db/table/static-data'

const TableBasic = (props: any) => {
  let { rows, columns } = props;
  console.log(props);
  // if (isNullOrUndefined(rows)) {
  //   rows = {
  //     id: "xxxx",
  //     name: "xx",
  //     ip: "xx",
  //     traffic_usage: 0,
  //     usage: 0,
  //     status: "working",
  //   };
  // }
  if (rows === undefined || columns === undefined) {
    return <Typography>No Data.</Typography>;
  }

  return (
    <Card>
      {/* <CardHeader title="Basic" /> */}
      <Box sx={{ height: 500 }}>
        <DataGrid columns={columns} rows={rows.slice(0, 10)} />
      </Box>
    </Card>
  );
};

export default TableBasic;
