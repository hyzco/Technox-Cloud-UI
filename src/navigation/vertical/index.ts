// ** Icon imports
import FormSelect from "mdi-material-ui/FormSelect";
import HomeOutline from "mdi-material-ui/HomeOutline";
import AccountOutline from "mdi-material-ui/AccountOutline";
import ArchiveOutline from "mdi-material-ui/ArchiveOutline";
import MessageOutline from "mdi-material-ui/MessageOutline";
import GoogleCirclesExtended from "mdi-material-ui/GoogleCirclesExtended";
import CreditCardSettingsOutline from "mdi-material-ui/CreditCardSettingsOutline";
import HelpCircleOutline from "mdi-material-ui/HelpCircleOutline";

// ** Type import
import { VerticalNavItemsType } from "src/@core/layouts/types";
import { CloudOutline } from "mdi-material-ui";

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: "Home",
      icon: HomeOutline,
      path: "/dashboard",
    },
    {
      title: "Cloud Servers",
      icon: CloudOutline,
      path: "/cloud",
    },
    {
      title: "VPS Servers",
      icon: GoogleCirclesExtended,
      path: "/views/servers",
    },
    // {
    //   title: "Servislerim",
    //   icon: FormSelect,
    //   path: "/views/services",
    // },
    {
      title: "DNS Records",
      icon: ArchiveOutline,
      path: "/views/records",
    },
    {
      title: "Payments",
      icon: CreditCardSettingsOutline,
      path: "/views/payments",
    },
    {
      title: "Support",
      icon: MessageOutline,
      path: "/views/requests",
    },
    {
      title: "My Account",
      icon: AccountOutline,
      path: "/views/account",
    },
    {
      title: "F.A.Q.",
      icon: HelpCircleOutline,
      path: "/views/faq",
    },
  ];
};

export default navigation;
