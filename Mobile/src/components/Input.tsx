import { Input as GluestackInput, InputField, FormControl, FormControlErrorText, FormControlError } from "@gluestack-ui/themed";
import { ComponentProps } from "react";

type Props = ComponentProps<typeof InputField> & {
  erroMessage?: string | null
  isInvalid?: boolean
  isReadOnly?: boolean
}

export function Input({ isReadOnly = false, erroMessage = null, isInvalid = false, ...rest }: Props) {
  const invalid = !!erroMessage || isInvalid;

  return (
    <FormControl isInvalid={invalid} w="$full" mb="$4">
      <GluestackInput
        h="$14"
        borderWidth="$0"
        borderRadius="$md"
        $focus={{
          borderWidth: 1,
          borderColor: invalid ? "$red500" : "$green500"
        }}
        isReadOnly={isReadOnly}
        opacity={isReadOnly ? 0.5 : 1}
        $invalid={{
          borderWidth: 1,
          borderColor: "$red500"
        }}
      >
        <InputField
          px="$4"
          bg="$gray700"
          color="$white"
          fontFamily="$body"
          placeholderTextColor={"$gray300"}
          {...rest}
        />
      </GluestackInput>

      <FormControlError>
        <FormControlErrorText color="$red500">
          {erroMessage}
        </FormControlErrorText>
      </FormControlError>
    </FormControl>
  );
}