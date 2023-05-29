import React from "react";
import { Controller } from "react-hook-form";

interface IFormInputControllerProps {
  name: string;
  control: any;
  children: React.ReactNode;
  onChange?: any;
}

export const FormInputController = ({
  name,
  control,
  children,
  onChange,
}: IFormInputControllerProps) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field }) => {
        return React.cloneElement(children as React.ReactElement, {
          ...field,
        });
      }}
    />
  );
};
