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

const navigation = (): VerticalNavItemsType => {
  return [
    {
      sectionTitle: "Cloud Control Panel",
    },
    {
      title: "Kontrol Paneli",
      icon: HomeOutline,
      path: "/dashboards/ecommerce",
    },
    {
      title: "Sunucularım",
      icon: GoogleCirclesExtended,
      path: "/views/servers",
    },
    // {
    //   title: "Servislerim",
    //   icon: FormSelect,
    //   path: "/views/services",
    // },
    {
      title: "DNS Kayıtları",
      icon: ArchiveOutline,
      path: "/views/records",
    },
    {
      title: "Ödemeler",
      icon: CreditCardSettingsOutline,
      path: "/views/payments",
    },
    {
      title: "Talepler",
      icon: MessageOutline,
      path: "/views/requests",
    },
    {
      title: "Hesabım",
      icon: AccountOutline,
      path: "/views/account",
    },
    {
      title: "Sıkça Sorulan Sorular",
      icon: HelpCircleOutline,
      path: "/views/faq",
    },
  ];
};

export default navigation;
