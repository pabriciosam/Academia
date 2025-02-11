import { Box, useTheme } from '@gluestack-ui/themed';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'

import { useAuth } from '@hooks/useAuth';

import { AuthRoutes } from './auth.routes'
import { AppRouters } from './app.routes';

export function Routes() {
  const colors = useTheme();
  const { user } = useAuth();

  const theme = DefaultTheme;

  theme.colors.background = colors.$gray700;

  return (
    <Box flex={1} bg="$gray700">
      <NavigationContainer theme={theme}>
        {user.id ? <AppRouters/> : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  )
}