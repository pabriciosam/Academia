import { Text } from "@gluestack-ui/themed";
import { Heading, HStack, Image, VStack, Icon } from "@gluestack-ui/themed";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

import { ChevronRight } from 'lucide-react-native'
import { ExerciseDTO } from "@dtos/ExercisesDTO";
import { api } from "@services/api";

type Props = TouchableOpacityProps & {
  data: ExerciseDTO;
}

export function ExercisesCard({data, ...rest}:Props){
  return(
    <TouchableOpacity {...rest}>
      <HStack
        bg="$gray500"
        alignItems="center"
        p="$2"
        pr="$4"
        rounded="$md"
        mb="$3"
      >
        <Image
          alt="Imagem do exercício"
          source={{
            uri: `${api.defaults.baseURL}/exercise/thumb/${data.thumb}`
          }}
          w="$16"
          h="$16"
          rounded="$md"
          mr="$4"
          resizeMode="cover"
        />

        <VStack flex={1}>
          <Heading fontSize="$lg" color="$white" fontFamily="$heading">
           {data.name}
          </Heading>

          <Text fontSize="$sm" color="$gray200" mt="$1" numberOfLines={2}>
            {data.series} series x {data.repetitions} repetições
          </Text>
        </VStack>

        <Icon as={ChevronRight} color="$gray300"/>
      </HStack>
    </TouchableOpacity>
  );
}