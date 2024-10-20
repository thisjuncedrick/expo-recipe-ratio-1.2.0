import { SettingsProvider, useSettings } from '@/lib/components';
import { DB_NAME } from '@/lib/constants';
import { useLoadResources } from '@/lib/hooks';
import { SplashScreen, Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';

// Prevents splash screen from hiding prematurely
SplashScreen.preventAutoHideAsync();

/**
 * RootLayout component is the entry point of the application.
 * It handles loading of resources, displaying the splash screen,
 * and providing context for settings.
 *
 * @component
 * @returns {JSX.Element} The RootLayout component.
 */
const RootLayout = (): JSX.Element => {
	// Loads necessary resources for the app
	const loaded = useLoadResources();

	/**
	 * useEffect hook to hide the splash screen once the resources are loaded.
	 */
	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]); // Only runs when `loaded` changes

	return (
		<SQLiteProvider databaseName={DB_NAME}>
			<SettingsProvider>
				<InnerLayout />
			</SettingsProvider>
		</SQLiteProvider>
	);
};

/**
 * InnerLayout component that wraps the app in a theme provider (PaperProvider)
 * and sets up the navigation stack.
 *
 * @component
 * @returns {JSX.Element} The InnerLayout component.
 */
const InnerLayout = (): JSX.Element => {
	// Access theme from settings
	const { theme } = useSettings();

	return (
		<PaperProvider theme={theme}>
			<Stack screenOptions={{ headerShown: false, animation: 'ios' }}>
				<Stack.Screen name='index' />
			</Stack>
		</PaperProvider>
	);
};

export default RootLayout;
