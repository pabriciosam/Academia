import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Center, Heading, ScrollView, Text, VStack, Image, useToast } from '@gluestack-ui/themed';
import { useForm, Controller } from 'react-hook-form'

import { AuthNavigatorRoutesProps } from '@routes/auth.routes';

import LogoSVG from '@assets/logo.svg';
import BackgroundImg from '@assets/background.png';

import { Input } from '@components/Input';
import { Button } from '@components/Button';

import { useAuth } from '@hooks/useAuth';
import { yupResolver } from '@hookform/resolvers/yup';

import * as yup from 'yup';
import { AppError } from '@utils/AppError';
import { ToastMessagem } from '@components/ToastMessage';

type FormDataProps = {
  email: string;
  password: string;
}

const singInSchema = yup.object({
  email: yup.string().required("Informe o e-mail!").email("E-mail inválido!"),
  password: yup
    .string()
    .required("Informe a senha!")
    .min(6, "A senha deve ter no mínimo 6 dígitos!")
});

const toast = useToast();

export function SingIn() {
  //const [isLoading, setIsLoading] = useState(false);
  const { singIn } = useAuth();

  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    resolver: yupResolver(singInSchema)
  });

  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  function handleNewAccount() {
    navigation.navigate('singUp');
  }

  async function handleSignIn({ email, password }: FormDataProps) {
    try{
      //setIsLoading(true);
      await singIn(email, password);
    }
    catch (error) {
      const isAppError = error instanceof AppError;

      const title = isAppError ? error.message : "Não foi possível entrar. Tente novamente!";

      //setIsLoading(false);

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
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
      <VStack flex={1}>
        <Image
          source={BackgroundImg}
          w='$full'
          h={624}
          defaultSource={BackgroundImg}
          alt='Pessoas treinando'
          position='absolute'
        />

        <VStack flex={1} px='$10' pb={'$16'}>
          <Center my='$24'>
            <LogoSVG />

            <Text color='$gray100' fontSize={'$sm'}>
              Treine sua mente e seu corpo
            </Text>
          </Center>

          <Center gap={'$2'}>
            <Heading color='$gray100' fontSize={'$xl'} mb={6} fontFamily='$heading'>
              Acesse sua conta
            </Heading>

            <Controller
              control={control}
              name='email'
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder='E-mail'
                  keyboardType='email-address'
                  autoCapitalize='none'
                  onChangeText={onChange}
                  value={value}
                  erroMessage={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name='password'
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder='Senha'
                  secureTextEntry
                  onChangeText={onChange}
                  value={value}
                  erroMessage={errors.password?.message}
                />
              )}
            />

            <Button title='Acessar' onPress={handleSubmit(handleSignIn)} />
          </Center>

          <Center flex={1} justifyContent='flex-end' mt='$4'>
            <Text color='$gray100' fontSize='$sm' fontFamily='$body' mb='$4'>
              Ainda não tem acesso?
            </Text>

            <Button
              title='Criar conta'
              variant='outline'
              onPress={handleNewAccount}
            />
          </Center>
        </VStack>
      </VStack>
    </ScrollView>
  );
}