import { useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { Controller, useForm } from "react-hook-form";

import { Center, Heading, Text, useToast, VStack } from "@gluestack-ui/themed";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from 'expo-file-system';
import * as yup from 'yup';

import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { ToastMessagem } from "@components/ToastMessage";
import { useAuth } from "@hooks/useAuth";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import defaultUserPhotoImg from '@assets/userPhotoDefault.png';

type FormDataProps = {
  name: string;
  email: string;
  password?: string | null;
  old_password?: string | null;
  confirm_password?: string | null;
}

const confirmPasswordBase = yup
  .string()
  .nullable()
  .transform((value) => (!!value ? value : null))
  .oneOf([yup.ref('password'), null], 'A confirmação de senha não confere.');

const profileSchema = yup.object({
  name: yup
    .string()
    .required('Informe o nome.'),
  email: yup.string(),
  password: yup
    .string()
    .min(6, 'A senha deve ter pelo menos 6 dígitos.')
    .nullable()
    .transform((value) => !!value ? value : null),
  old_password: yup.string(),
  confirm_password: confirmPasswordBase.when('password', {
    is: (Field: any) => Field,
    then: (schema) => 
      schema
        .nullable()
        .required('Informe a confirmação da senha.')
        .transform((value) => (!!value ? value : null))
  })
});

export function Profile() {
  const [isUpdating, setUpdating] = useState(false);
  
  const toast = useToast();
  const { user, updateUserProfile } = useAuth();

  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email,
      password: "",
      old_password: "",
      confirm_password: ""
    },
    resolver: yupResolver<FormDataProps>(profileSchema)
  });

  async function handleUserPhotoSelect() {
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true
      });

      if (photoSelected.canceled)
        return;

      const photoURI = photoSelected.assets[0].uri;

      if (photoURI) {
        const photoInfo = (await FileSystem.getInfoAsync(photoURI)) as {
          size: number
        }

        if (photoInfo.size && (photoInfo.size / 1024 / 1024 > 5)) {
          return toast.show({
            placement: "top",
            render: ({ id }) => (
              <ToastMessagem
                id={id}
                title="Imagem grande"
                description="Esta imagem é muito grande. Escolha uma de até 5Mb."
                action="error"
                onClose={() => toast.close(id)} />
            )
          });
        }

        const fileExtension = photoURI.split('.').pop();

        const photoFile: any = {
          name: `${user.name}.${fileExtension}`.toLowerCase(),
          uri: photoURI,
          type: `${ photoSelected.assets[0].type}/${fileExtension}`
        }

        const userPhotoUploadForm = new FormData();

        userPhotoUploadForm.append('avatar', photoFile);

        const avatarUpdatedResponse = await api.patch('/users/avatar', userPhotoUploadForm, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        const userUpdated = user;
        userUpdated.avatar = avatarUpdatedResponse.data.avatar;
        updateUserProfile(userUpdated);

        toast.show({
          placement: "top",
          render: ({ id }) => (
            <ToastMessagem
              id={id}
              title="Foto atualizada!"
              action="success"
              onClose={() => toast.close(id)} />
          )
        });
      }
    }
    catch (erro) {

    }
  }

  async function handleProfileUpdate(data: FormDataProps){
    try {
      setUpdating(true);

      const userUpdated = user;
      userUpdated.name = data.name;

      await api.put('/users', data);

      await updateUserProfile(userUpdated);

      toast.show({
              placement: 'top',
              render: ({ id }) => (
                <ToastMessagem
                  id={id}
                  title="Perfil atualizado com sucesso!"
                  action="success"
                  onClose={() => toast.close(id)} />
              )
            });
    } catch (error) {
      const isAppError = error instanceof AppError;

      const title = isAppError ? error.message : "Não foi possível atualizar os dados.";

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
      setUpdating(false);
    }

    console.log("            ");
    console.log("            ");
    console.log(data);
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt="$6" px="$10">
          <UserPhoto
            alt="Foto do usuário"
            source=
            {
              user.avatar ?
              {uri: `${api.defaults.baseURL}/avatar/${user.avatar}`} :
              defaultUserPhotoImg
            }
            size="xl"
          />

          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text
              color="$green500"
              fontFamily="$heading"
              fontSize="$md"
              mt="$2"
              mb="$8"
            >
              Alterar Foto
            </Text>
          </TouchableOpacity>

          <Controller
            control={control}
            name="name"
            render={({ field : { value, onChange } }) => (
            <Center w="$full" gap="$4">
              <Input
                placeholder="Nome"
                bg="$gray600" 
                onChangeText={onChange}
                value={value}
                erroMessage={errors.name?.message}
              />
            </Center>
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field : { value, onChange } }) => (
            <Center w="$full" gap="$4">
              <Input
                placeholder="E-mail"
                isReadOnly
                bg="$gray600" 
                onChangeText={onChange}
                value={value}
              />
            </Center>
            )}
          />

          <Heading
            alignSelf="flex-start"
            fontFamily="$heading"
            color="$gray200"
            fontSize="$md"
            mt="$12"
            mb="$2"
          >
            Alterar Senha
          </Heading>

          <Controller
            control={control}
            name="old_password"
            render={({ field : { onChange } }) => (
            <Center w="$full" gap="$4">
              <Input
                placeholder="Senha antiga"
                bg="$gray600"
                secureTextEntry
                onChangeText={onChange}
              />
            </Center>
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field : { onChange } }) => (
            <Center w="$full" gap="$4">
              <Input
                placeholder="Nova senha"
                bg="$gray600"
                secureTextEntry
                onChangeText={onChange}
                erroMessage={errors.password?.message}
              />
            </Center>
            )}
          />

          <Controller
            control={control}
            name="confirm_password"
            render={({ field : { onChange } }) => (
            <Center w="$full" gap="$4">
              <Input
                placeholder="Confirme a nova senha"
                bg="$gray600"
                secureTextEntry
                onChangeText={onChange}
                erroMessage={errors.confirm_password?.message}
              />
            </Center>
            )}
          />

          <Center w="$full" gap="$4">
            <Button
              title="Atualizar"
              onPress={handleSubmit(handleProfileUpdate)}
              isLoading={isUpdating}
            />
          </Center>
        </Center>
      </ScrollView>
    </VStack>
  );
}