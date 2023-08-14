// ** React Imports
import { useState, useEffect } from "react";

// ** MUI Imports
import Grid from "@mui/material/Grid";

// ** Styles Import
import "react-credit-cards/es/styles-compiled.css";

import PackagesCard, {
  IPackagesCardData,
} from "src/views/ui/cards/basic/PackagesCard";

interface IPackagesProps {
  callback: Function;
  tabFooter?: (props: any) => JSX.Element;
}

const TabPackages = (props: IPackagesProps) => {
  // ** States
  const [selectedPackage, setPackage] = useState<number>();

  // ** Props
  const { callback, tabFooter } = props;

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
    {
      id: 4,
      title: "Package 4",
      price: 150,
      description: {
        cpu: "16 Core vCPU",
        memory: "8GB Memory",
        storage: "100GB SSD Disk",
        traffic: "7000GB Bandwith",
      },
    },
    {
      id: 5,
      title: "Package 5",
      price: 150,
      description: {
        cpu: "16 Core vCPU",
        memory: "8GB Memory",
        storage: "100GB SSD Disk",
        traffic: "7000GB Bandwith",
      },
    },
    {
      id: 6,
      title: "Package 6",
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
    // callback(selectedPackage);
  };

  const renderPackageCards = () => {
    return fakeCardData.map((val: any, _index: number) => {
      return (
        <Grid item xs={3} md={4} xl={6}>
          <PackagesCard
            key={_index}
            data={val}
            onSelect={onSelectPackage}
            selected={selectedPackage === val.id ? true : false}
          />
        </Grid>
      );
    });
  };

  return (
    <>
      <Grid container spacing={3}>
        {renderPackageCards()}
      </Grid>
      {tabFooter &&
        tabFooter({
          enableDefaultOnClick: false,
          onClick: () => {
            callback(selectedPackage);
          },
        })}
    </>
  );
};

export default TabPackages;
