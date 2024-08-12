import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'

import { Center, Heading, ScrollView, Text, VStack, Image } from '@gluestack-ui/themed';

import BackgroundImg from '@assets/background2x.png';
import LogoSVG from '@assets/logo.svg';

import { Input } from '@components/Input';
import { Button } from '@components/Button';

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
  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    resolver: yupResolver(singUpSchema)
  });

  const navigation = useNavigation();

  function handleGoBack() {
    navigation.goBack();
  };

  function handleSignUp({ name, email, password, passwordConfirm }: FormDataProps) {
    fetch('http://192.168.15.8:3333/users', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password })
    })
      .then(response => response.json())
      .then(data => console.log(data))
      ;
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
            />
          </Center>

          <Button
            title='Voltar para o login'
            variant='outline'
            onPress={handleGoBack}
          />
        </VStack>
      </VStack>
    </ScrollView>
  );
}