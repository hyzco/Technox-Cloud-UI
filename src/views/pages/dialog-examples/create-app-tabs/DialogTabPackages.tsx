// ** React Imports
import { useState, useEffect } from "react";

// ** MUI Imports
import Grid from "@mui/material/Grid";

// ** Styles Import
import "react-credit-cards/es/styles-compiled.css";

import PackagesCard, {
  IPackagesCardData,
} from "src/views/ui/cards/basic/PackagesCard";

const TabPackages = () => {
  // ** States
  const [selectedPackage, setPackage] = useState<number>();

  // ** UseEffects
  useEffect(() => {
    //TODO : add it to redux state and save data
    console.log(selectedPackage);
  }, [selectedPackage]);

  //currency will need to be added from the redux
  const fakeCardData: IPackagesCardData[] = [
    {
      id: 1,
      title: "Package 1",
      price: 150,
      description: {
        cpu: "4 Core vCPU",
        memory: "2GB Memory",
        storage: "20GB SSD Disk",
        traffic: "1000GB Bandwith",
      },
    },
    {
      id: 2,
      title: "Package 2",
      price: 150,
      description: {
        cpu: "8 Core vCPU",
        memory: "4GB Memory",
        storage: "60GB SSD Disk",
        traffic: "5000GB Bandwith",
      },
    },
    {
      id: 3,
      title: "Package 3",
      price: 150,
      description: {
        cpu: "16 Core vCPU",
        memory: "8GB Memory",
        storage: "100GB SSD Disk",
        traffic: "7000GB Bandwith",
      },
    },
  ];

  const onSelectPackage = (selectedPackage: number) => {
    setPackage(selectedPackage);
  };

  const renderPackageCards = () => {
    return fakeCardData.map((val: any, _index: number) => {
      return (
        <Grid item xs={4}>
          <PackagesCard key={_index} data={val} onSelect={onSelectPackage} />
        </Grid>
      );
    });
  };

  return (
    <Grid container spacing={3}>
      {renderPackageCards()}
    </Grid>
  );
};

export default TabPackages;
