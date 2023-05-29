import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import React, { ReactNode, useState, createContext, useEffect } from "react";

import { Controller, useForm } from "react-hook-form";
import { FormInputText } from "../input";
import { FormInputController } from "../input-controller";

interface IFormProps {
  name: string;
  children: ReactNode | ReactNode[];
  formHook: Array<any>;
  fields: Array<string>;
}

export const useFormHook = () => {
  const {
    handleSubmit,
    reset,
    control,
    register,
    getValues,
    setValue,
    formState,
    trigger,
  } = useForm();

  const [contextValue, setContextValue] = useState<any>({});

  useEffect(() => {
    setContextValue({ register: register });
  }, [register]);

  return [
    handleSubmit,
    reset,
    control,
    register,
    contextValue,
    setContextValue,
    getValues,
    setValue,
    formState,
    trigger,
  ];
};

export const FormWrapperHook = (props: IFormProps) => {
  const { name, children, formHook, fields } = props;

  const [
    handleSubmit,
    reset,
    control,
    register,
    contextValue,
    setContextValue,
  ] = formHook;

  const onSubmit = (data: any) => console.log(data);

  useEffect(() => {
    // console.log(contextValue);
  }, [contextValue]);

  {
    /* <Controller
  control={control}
  name="test"
  render={({
    field: { onChange, onBlur, value, name, ref },
    fieldState: { invalid, isTouched, isDirty, error },
    formState,
  }) => ( WHATEVER_INPUT_WE_WANT )} */
  }

  const renderChildren = (children: ReactNode): ReactNode => {
    return React.Children.map(children, (child: ReactNode) => {
      if (React.isValidElement(child)) {
        if (child.props.children) {
          return React.cloneElement(child, {
            ...child.props, // Include all existing props
            children: renderChildren(
              child.props.children
            ) as React.ReactElement<any>[],
          });
        }

        const ChildComponent = child.type as React.FunctionComponent<any>;
        // console.log(child.props);
        if (child.props["aria-details"] === "form-input") {
          console.log("yes");

          return (
            <FormInputController name={child.props.name} control={control}>
              <ChildComponent {...child.props} />
            </FormInputController>
          );
        }
      }
      return child;
    });
  };

  const prepareFieldsWithEmptyData = (inputFields: Array<string>) => {
    const fieldsObj: any = {};
    inputFields.forEach((field: any) => {
      fieldsObj[`${field}`] = "";
    });
    return fieldsObj;
  };

  if (contextValue.register) {
    return (
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "block" }}>
        {renderChildren(props.children)}
        <Button type="submit">Submit</Button>
        <Button
          onClick={() => reset(prepareFieldsWithEmptyData(fields))}
          variant={"outlined"}
        >
          Reset
        </Button>
      </form>
    );
  }

  return <></>;
};
