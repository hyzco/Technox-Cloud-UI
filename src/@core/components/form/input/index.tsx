import { Controller, useForm } from "react-hook-form";
import React from "react";
import TextField from "@mui/material/TextField";

export const FormInputText = ({
  inputKey,
  name,
  label,
  control,
  ...rest
}: any) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field: { onChange, value } }) => (
        <TextField onChange={onChange} value={value} label={label} {...rest} />
      )}
    />
  );
};
