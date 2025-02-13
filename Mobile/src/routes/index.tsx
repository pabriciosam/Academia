import { Box, useTheme } from '@gluestack-ui/themed';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'

import { useAuth } from '@hooks/useAuth';

import { AuthRoutes } from './auth.routes'
import { AppRouters } from './app.routes';
import { Loading } from '@components/Loading';

export function Routes() {
  const colors = useTheme();
  const { user, isLoadingUserStorageData } = useAuth();

  const theme = DefaultTheme;

  theme.colors.background = colors.$gray700;

  if (isLoadingUserStorageData)
    return <Loading/>

  return (
    <Box flex={1} bg="$gray700">
      <NavigationContainer theme={theme}>
        {user.id ? <AppRouters/> : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  )
}