import { useContext } from 'react';

import { gluestackUIConfig } from '../../config/gluestack-ui.config'

import { Box } from '@gluestack-ui/themed';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'

import { AuthContext } from '@contexts/AuthContext';

import { AuthRoutes } from './auth.routes'
import { AppRouters } from './app.routes';

export function Routes() {
  const theme = DefaultTheme;

  theme.colors.background = gluestackUIConfig.tokens.colors.gray700;

  const contextData = useContext(AuthContext);
  console.log("DADOS DO CLIENTE -> ", contextData)

  return (
    <Box flex={1} bg="$gray700">
      <NavigationContainer theme={theme}>
        <AuthRoutes />
      </NavigationContainer>
    </Box>
  )
}