import { Heading, HStack, Icon, Text, VStack } from "@gluestack-ui/themed";
import { UserPhoto } from "./UserPhoto";
import { LogOut } from "lucide-react-native";

import defaultUserPhotoImg from '@assets/userPhotoDefault.png';

import { useAuth } from "@hooks/useAuth";
import { TouchableOpacity } from "react-native";

export function HomeHeader(){
  const { user, singOut } = useAuth();

  return(
    <HStack
      bg="$trueGray600"
      pt={"$16"}
      pb={"$5"}
      px={"$8"}
      alignItems="center"
      gap={"$4"}
    >
      <UserPhoto
        alt="Imagem do usuário"
        w="$16"
        h="$16"
        source={ user.avatar ? {uri: user.avatar} : defaultUserPhotoImg}
      />
      <VStack flex={1}>
        <Text color="$trueGray100" fontSize={"$sm"}>
          Olá,
        </Text>
        <Heading color="$trueGray100" fontSize={"$md"}>
          {user.name}
        </Heading>
      </VStack>

      <TouchableOpacity onPress={singOut}>
        <Icon as={LogOut} color="$gray200" size="xl"/>
      </TouchableOpacity>
    </HStack>
  );
}