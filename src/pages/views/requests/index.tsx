// ** Demo Components Imports
import Email from "src/views/apps/email/Email";

const EmailApp = () => <Email folder="inbox" />;

EmailApp.acl = {
  action: "read",
  subject: "support-page",
};
export default EmailApp;
