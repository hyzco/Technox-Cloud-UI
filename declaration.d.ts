declare module "react-to-pdf";
declare module "react-beautiful-dnd";
declare module "*.png" {
  const value: import("react-native").ImageSourcePropType;
  export = value;
}
