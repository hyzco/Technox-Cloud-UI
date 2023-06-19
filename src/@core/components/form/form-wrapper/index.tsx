import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import React, { ReactNode, useState, createContext, useEffect } from "react";

import { Controller, useForm } from "react-hook-form";
import { FormInputText } from "../input";
import { FormInputController } from "../input-controller";

interface IFormHookProps {
  defaultValues?: {};
}

export const useFormHook = (props?: IFormHookProps) => {
  const {
    handleSubmit,
    reset,
    control,
    register,
    getValues,
    setValue,
    formState,
    trigger,
  } = useForm({ defaultValues: props && props.defaultValues && {} });

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

interface IFormProps {
  name: string;
  children: ReactNode | ReactNode[];
  formHook: Array<any>;
  fields: Array<string>;
  onSubmit: React.FormEventHandler<HTMLFormElement> | undefined;
  disableClear?: boolean;
}

export const FormWrapperHook = (props: IFormProps) => {
  const { name, children, formHook, fields, onSubmit, disableClear } = props;

  const [
    handleSubmit,
    reset,
    control,
    register,
    contextValue,
    setContextValue,
  ] = formHook;

  const onSubmitDefault = (data: any) => console.log(data);

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

  // const renderChildren = (children: ReactNode): ReactNode => {
  // return React.Children.map(children, (child: ReactNode) => {
  //   if (React.isValidElement(child)) {
  //     if (child.props.children) {
  //       return React.cloneElement(child, {
  //         ...child.props, // Include all existing props
  //         children: renderChildren(
  //           child.props.children
  //         ) as React.ReactElement<any>[],
  //       });
  //     }

  //     // const ChildComponent = child.type as React.FunctionComponent<any>;
  //     // // console.log(child.props);
  //     // if (child.props["aria-details"] === "form-input") {
  //     //   console.log("yes");

  //     //   return (
  //     //     <FormInputController name={child.props.name} control={control}>
  //     //       <ChildComponent {...child.props} />
  //     //     </FormInputController>
  //     //   );
  //     // }
  //   }
  //   return child;
  // });
  // };

  const prepareFieldsWithEmptyData = (inputFields: Array<string>) => {
    const fieldsObj: any = {};
    inputFields.forEach((field: any) => {
      fieldsObj[`${field}`] = "";
    });
    return fieldsObj;
  };

  if (contextValue.register) {
    return (
      <form
        onSubmit={
          onSubmit ? handleSubmit(onSubmit) : handleSubmit(onSubmitDefault)
        }
        style={{ display: "block" }}
      >
        {!disableClear && (
          <Button
            onClick={() => reset(prepareFieldsWithEmptyData(fields))}
            variant={"outlined"}
            sx={{
              float: "right",
            }}
          >
            Clear
          </Button>
        )}
        {props.children}
      </form>
    );
  }

  return <></>;
};
