import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'

import { Center, Heading, ScrollView, Text, VStack, Image, useToast } from '@gluestack-ui/themed';

import BackgroundImg from '@assets/background2x.png';
import LogoSVG from '@assets/logo.svg';

import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { ToastMessagem } from '@components/ToastMessage';

import { api } from '@services/api';
import { AppError } from '@utils/AppError';

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

const singUpSchema = yup.object({
  name: yup.string().required("Informe o nome!"),
  email: yup.string().required("Informe o e-mail!").email("E-mail inválido!"),
  password: yup
    .string()
    .required("Informe a senha!")
    .min(6, "A senha deve ter no mínimo 6 dígitos!"),
  passwordConfirm: yup
    .string()
    .required("Informe a confirmação da senha!")
    .oneOf([yup.ref("password"), ""], "As senhas precisam ser iguais!"),
});

export function SingUp() {
  const toast = useToast();

  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    resolver: yupResolver(singUpSchema)
  });

  const navigation = useNavigation();

  function handleGoBack() {
    navigation.goBack();
  };

  async function handleSignUp({ name, email, password }: FormDataProps) {
    try {
      const response = await api.post('/users', { name, email, password });

      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastMessagem
            id={id}
            title="Usuário cadastrado com sucesso!"
            action="success"
            onClose={() => toast.close(id)} />
        )
      });
    }
    catch (error) {
      const isAppError = error instanceof AppError;

      const title = isAppError ? error.message : 'Não foi possível criar a conta.';

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

          <Center flex={1} gap={'$2'}>
            <Heading color='$gray100' fontSize={'$xl'} mb={6} fontFamily='$heading'>
              Acesse sua conta
            </Heading>

            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder='Nome'
                  onChangeText={onChange}
                  value={value}
                  erroMessage={errors.name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
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
              name="password"
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

            <Controller
              control={control}
              name="passwordConfirm"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder='Confirme a senha'
                  secureTextEntry
                  onChangeText={onChange}
                  value={value}
                  onSubmitEditing={handleSubmit(handleSignUp)}
                  returnKeyType='send'
                  erroMessage={errors.passwordConfirm?.message}
                />
              )}
            />

            <Button
              title='Criar e acessar'
              onPress={handleSubmit(handleSignUp)}
              mb='$8'
            />

            <Button
              title='Voltar para o login'
              variant='outline'
              onPress={handleGoBack}
            />
          </Center>
        </VStack>
      </VStack>
    </ScrollView>
  );
}