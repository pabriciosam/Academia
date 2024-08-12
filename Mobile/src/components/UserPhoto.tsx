import { Image } from "@gluestack-ui/themed"
import { ComponentProps } from "react";

type Props = ComponentProps<typeof Image>

export function UserPhoto({...rest}: Props){
  return(
    <Image
      rounded={"$full"}
      borderWidth={"$2"}
      borderColor="$trueGray600"
      backgroundColor="$trueGray600"
      {...rest}
    />
  );
}