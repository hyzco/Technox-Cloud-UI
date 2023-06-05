// ** MUI Imports
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import { useState } from "react";

interface IPackagesCardData {
  [x: string]: any;
  title: string;
  description: {
    cpu: string;
    memory: string;
    storage: string;
    traffic: string;
  };
  price: number;
}

const generateDescription = (values: any) => {
  return values.map((value: any, index: number) => (
    <Typography key={index} sx={{ mb: 2 }} variant="body2">
      {value}
    </Typography>
  ));
};

const PackagesCard = (props: {
  data: IPackagesCardData;
  onSelect: (selectedPackage: any) => void;
  selected: boolean;
}) => {
  const descriptionValues = Object.values(props.data.description);
  return (
    <Card>
      <CardContent
        sx={{
          p: (theme) => `${theme.spacing(4, 5)} !important`,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          {props.data.title}
        </Typography>
        <Typography sx={{ mb: 2 }}>${props.data.price}</Typography>
        {generateDescription(descriptionValues)}
      </CardContent>
      <Button
        size="medium"
        variant="contained"
        color={props.selected ? "secondary" : "primary"}
        sx={{ width: "100%", borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
        onClick={() => {
          props.onSelect(props.data.id);
          // setPackage(props.data.id);
        }}
      >
        {props.selected ? "Selected" : "Select"}
      </Button>
    </Card>
  );
};

export default PackagesCard;
export type { IPackagesCardData };
