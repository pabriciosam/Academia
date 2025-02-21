import { useCallback, useEffect, useState } from "react";
import { FlatList } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";

import { HStack, useToast } from "@gluestack-ui/themed";
import { Text } from "@gluestack-ui/themed";

import { Group } from "@components/Group";
import { HomeHeader } from "@components/HomeHeader";
import { Heading, VStack } from "@gluestack-ui/themed";
import { ExercisesCard } from "@components/ExercisesCard";
import { AppError } from "@utils/AppError";
import { ToastMessagem } from "@components/ToastMessage";
import { api } from "@services/api";
import { ExerciseDTO } from "@dtos/ExercisesDTO";
import { Loading } from "@components/Loading";

export function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [exercise, setExercise] = useState<ExerciseDTO[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [groupSelected, setGroupSelected] = useState("Costas");

  const toast = useToast();
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  function handleOpenExerciseDetails() {
    navigation.navigate("exercise");
  }

  async function fetchGroups(){
    try {
      const response = await api.get('/groups');

      setGroups(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar os grupos musculares.';

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

  async function fetchExercisesByGroup(){
    try {
      setIsLoading(true);

      const response = await api.get(`/exercises/bygroup/${groupSelected}`);

      setExercise(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar os exercícios.';

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
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchGroups();
  },[]);

  useFocusEffect(useCallback(() => {
    fetchExercisesByGroup();
  }, [groupSelected]));

  return (
    <VStack flex={1} >
      <HomeHeader />

      <FlatList
        data={groups}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Group
            name={item}
            isActive={groupSelected.toLowerCase() === item.toLowerCase()}
            onPress={() => setGroupSelected(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 32 }}
        style={{ marginVertical: 40, maxHeight: 44, minHeight: 44 }}
      />

      { isLoading ? <Loading/> :
        <VStack px="$8" flex={1}>
          <HStack justifyContent="space-between" mb="$5" alignItems="center">
            <Heading color="$gray200" fontSize="$md" fontFamily="$heading">
              Exercícios
            </Heading>

            <Text color="$gray200" fontSize="$sm" fontFamily="$body">{exercise.length}</Text>
          </HStack>

          <FlatList
            data={exercise}
            keyExtractor={(item) => item.id}
            renderItem={({item}) => <ExercisesCard data={item} onPress={handleOpenExerciseDetails} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >

          </FlatList>
        </VStack>
      }
      </VStack>
  );
}