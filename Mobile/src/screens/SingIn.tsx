import { useNavigation } from '@react-navigation/native';
import { Center, Heading, ScrollView, Text, VStack, Image } from '@gluestack-ui/themed';

import { AuthNavigatorRoutesProps } from '@routes/auth.routes';

import LogoSVG from '@assets/logo.svg';
import BackgroundImg from '@assets/background.png';

import { Input } from '@components/Input';
import { Button } from '@components/Button';

export function SingIn(){
  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  function handleNewAccount(){
    navigation.navigate('singUp');
  }

  return(
    <ScrollView contentContainerStyle={{ flexGrow:1 }} showsVerticalScrollIndicator={false}>
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

            <Input
              placeholder='E-mail'
              keyboardType='email-address'
              autoCapitalize='none'
            />
            <Input
              placeholder='Senha'
              secureTextEntry
            />

            <Button title='Acessar'/>
          </Center>

          <Center flex={1} justifyContent='flex-end' mt='$4'>
            <Text color='$gray100' fontSize='$sm' fontFamily='$body'>
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