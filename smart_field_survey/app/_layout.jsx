import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SurveyProvider } from '../context/SurveyContext';
export const unstable_settings = {
    anchor: '(drawer)',
};
export default function RootLayout() {
    return (<SurveyProvider>
      <ThemeProvider value={DefaultTheme}>
        <Stack>
          <Stack.Screen name="(drawer)" options={{ headerShown: false }}/>
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Details' }}/>
        </Stack>
        <StatusBar style="dark"/>
      </ThemeProvider>
    </SurveyProvider>);
}
