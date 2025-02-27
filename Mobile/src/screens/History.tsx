import { useCallback, useState } from "react";
import { SectionList } from "react-native";

import { Heading, Text, useToast, VStack } from "@gluestack-ui/themed";
import { useFocusEffect } from "@react-navigation/native";

import { HistoryCard } from "@components/HistoryCard";
import { ScreenHeader } from "@components/ScreenHeader";
import { ToastMessagem } from "@components/ToastMessage";

import { AppError } from "@utils/AppError";
import { api } from "@services/api";
import { HistoryByDayDTO } from "@dtos/HistoryByDayDTO";


export function History() {
  const [isLoading, setIsLoading] = useState(true);
  const [exercises, setExercises] = useState<HistoryByDayDTO[]>([]);

  const toast = useToast();

  async function fetchHistory(){
    try {
      setIsLoading(true);

      const response = await api.get('/history');

      setExercises(response.data);
    }
    catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar o histórico.';

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

  useFocusEffect(useCallback(() => {
    fetchHistory();
  },[]))

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico" />

      <SectionList
        sections={exercises}
        keyExtractor={item => item.id}
        renderItem={({item}) => 
          <HistoryCard data={item}/>
        }
        renderSectionHeader={({ section }) => (
          <Heading
            color="$gray200"
            fontSize="$md"
            mt="$10"
            mb="$3"
            fontFamily="$heading"
          >
            {section.title}
          </Heading>
        )}
        style={{ paddingHorizontal: 32 }}
        contentContainerStyle={
          exercises.length === 0 && { flex:1, justifyContent: "center"}
        }
        ListEmptyComponent={() => (
          <Text>
            Não há exercícios regitrados ainda. {"\n"}
            Vamos fazer exercícios hoje?
          </Text>
        )}
        showsVerticalScrollIndicator={false}
      />
    </VStack>
  );
}