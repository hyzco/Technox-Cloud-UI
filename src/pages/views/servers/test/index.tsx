import { FormInputText } from "src/@core/components/form/input";
import { FormWrapperHook } from "src/@core/components/form/form-wrapper";

const TabDetails = () => {
  return (
    <FormWrapperHook name={"FORM TO DO SMTH"}>
      <FormInputText inputKey="test" name="input-1" label="label 1" />
      <FormInputText inputKey="test2" name="input-2" label="label 1" />
      <FormInputText inputKey="test3" name="input-3" label="label 1" />
    </FormWrapperHook>
  );
};

export default TabDetails;
