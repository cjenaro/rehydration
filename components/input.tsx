import * as React from "react";
import { IInputProps, Input as NInput } from "native-base";
import { Control, FieldValues, useController } from "react-hook-form";

type InputProps = {
  control: Control<FieldValues, object> | undefined;
  name: string;
} & IInputProps;

export default function Input({
  control,
  name,
  defaultValue,
  ...rest
}: InputProps) {
  const { field } = useController({
    control,
    defaultValue: defaultValue || "",
    name,
  });
  return <NInput {...rest} value={field.value} onChangeText={field.onChange} defaultValue={defaultValue} />;
}
