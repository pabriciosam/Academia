import { Heading, HStack, Icon, useToast } from "@gluestack-ui/themed";
import { VStack, Text, Image, Box } from "@gluestack-ui/themed";
import { ScrollView, TouchableOpacity } from "react-native";

import { ArrowLeft } from "lucide-react-native";

import { useNavigation, useRoute } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";

import BodySVG from '@assets/body.svg'
import SeriesSVG from '@assets/series.svg'
import RepetitionsSVG from '@assets/repetitions.svg'
import { Button } from "@components/Button";
import { AppError } from "@utils/AppError";
import { ToastMessagem } from "@components/ToastMessage";
import { api } from "@services/api";
import { useEffect, useState } from "react";
import { ExerciseDTO } from "@dtos/ExercisesDTO";
import { Loading } from "@components/Loading";

type RouterParamsProps = {
  exerciseId: string;
}

export function Exercise() {
  const [isLoading, setIsLoading] = useState(true);
  const [sendingRegister, setSendingRegister] = useState(false);
  const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO);

  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const route = useRoute();

  const { exerciseId } = route.params as RouterParamsProps;

  const toast = useToast();

  function handleGoBack() {
    navigation.goBack();
  }

  async function fetchExerciseDetails()
  {
    try {
      setIsLoading(true);
      const response = await api.get(`/exercises/${exerciseId}`);

      setExercise(response.data);
      setIsLoading(false);
    } catch (error) {
          const isAppError = error instanceof AppError;
          const title = isAppError ? error.message : 'Não foi possível carregar os detalhes do exercício.';
    
          toast.show({
            placement: 'top',
            render: ({ id }) => (
              <ToastMessagem
                id={id}
                title={title}
                action="error"
                onClose={() => toast.close(id)} />
            )
          });
        }
  }

  async function handleExerciseHistoryRegistre(){
    try {
      setSendingRegister(true);

      await api.post('/history', {exercise_id: exerciseId});

      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastMessagem
            id={id}
            title="Parabéns! Exercício concluído com sucesso!"
            action="success"
            onClose={() => toast.close(id)} />
        )
      });

      navigation.navigate('history');
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar os detalhes do exercício.';

      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastMessagem
            id={id}
            title={title}
            action="error"
            onClose={() => toast.close(id)} />
        )
      });
    }
    finally{
      setSendingRegister(false);
    }
  }

  useEffect(() => {
    fetchExerciseDetails();
  },[exerciseId])

  return (
    <VStack flex={1}>
      <VStack px="$8" bg="$gray600" pt="$12">
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={ArrowLeft} color="$green500" size="xl" />
        </TouchableOpacity>

        <HStack
          justifyContent="space-between"
          alignItems="center"
          mt="$4"
          mb="$8"
        >
          <Heading
            color="$gray100"
            fontFamily="$heading"
            fontSize="$lg"
            flexShrink={1}
          >
            {exercise.name}
          </Heading>
          <HStack alignItems="center">
            <BodySVG />

            <Text color="$gray200" ml="$1" textTransform="capitalize">
              {exercise.group}
            </Text>
          </HStack>
        </HStack>
      </VStack>

      {
        isLoading ? <Loading></Loading> :
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          <VStack p="$8">
            <Box rounded="$lg" mb="$3" overflow="hidden">
              <Image
                alt="Exercício"
                source={{
                  uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}`
                }}
                resizeMode="cover"
                w="$full"
                h="$80"
              />
            </Box>

            <Box bg="$gray600" rounded="$md" pb="$4" px="$4">
              <HStack alignItems="center" justifyContent="space-around" mb="$6" mt="$5">
                <HStack>
                  <SeriesSVG />
                  <Text color="$gray200" ml="$2">
                    {exercise.series} séries
                  </Text>
                </HStack>

                <HStack>
                  <RepetitionsSVG />
                  <Text color="$gray200" ml="$2">
                    {exercise.repetitions} repetições
                  </Text>
                </HStack>
              </HStack>

              <Button title="Marcar como realizado" isLoading={sendingRegister} onPress={handleExerciseHistoryRegistre} />
            </Box>
          </VStack>
        </ScrollView >
      }
    </VStack>
  );
}