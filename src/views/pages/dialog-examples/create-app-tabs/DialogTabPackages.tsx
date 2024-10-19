// ** React Imports
import { useState, useEffect } from "react";

// ** MUI Imports
import Grid from "@mui/material/Grid";

// ** Styles Import
import "react-credit-cards/es/styles-compiled.css";

import PackagesCard, {
  IPackagesCardData,
} from "src/views/ui/cards/basic/PackagesCard";
import Pricing from "src/@core/components/pricing";

interface IPackagesProps {
  callback: Function;
  tabFooter?: (props: any) => JSX.Element;
}

const TabPackages = (props: IPackagesProps) => {
  // ** States
  const [selectedPackage, setPackage] = useState<Object>();

  // ** Props
  const { callback, tabFooter } = props;

  // ** UseEffects
  useEffect(() => {
    //TODO : add it to redux state and save data
    console.log(selectedPackage);
  }, [selectedPackage]);

  //currency will need to be added from the redux

  const onSelectPackage = (selectedPackage: Object) => {
    setPackage(selectedPackage);
    // callback(selectedPackage);
  };

  const renderPackageCards = () => {
    return <Pricing onSelect={onSelectPackage} goToNextPage={callback} />;
    // return fakeCardData.map((val: any, _index: number) => {
    //   return (
    //     <Grid item xs={3} md={4} xl={6}>
    //       <PackagesCard
    //         key={_index}
    //         data={val}
    //         onSelect={onSelectPackage}
    //         selected={selectedPackage === val.id ? true : false}
    //       />
    //     </Grid>
    //   );
    // });
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
