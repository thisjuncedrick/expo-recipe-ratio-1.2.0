import { checkStatus } from '@/.system/modules';
import { SettingsProvider, useSettings } from '@/lib/components';
import { DB_NAME } from '@/lib/constants';
import { useLoadResources } from '@/lib/hooks';
import { SplashScreen, Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { ToastAndroid } from 'react-native';
import { Dialog, PaperProvider, Portal, Text } from 'react-native-paper';

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
	const [status, setStatus] = useState({ message: '', status_code: 200 });

	// Check for the status of the app from vercel

	/**
	 * useEffect hook to hide the splash screen once the resources are loaded.
	 */
	useEffect(() => {
		const dismissSplash = async () => {
			const status = await checkStatus();
			setStatus(status);
			SplashScreen.hideAsync();
		};
		if (loaded) {
			dismissSplash();
		}
	}, [loaded]); // Only runs when `loaded` changes

	return (
		<SQLiteProvider databaseName={DB_NAME}>
			<SettingsProvider>
				<InnerLayout state={status} />
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
const InnerLayout = ({ state }: { state: any }): JSX.Element => {
	// Access theme from settings
	const { theme } = useSettings();

	const onBackDismiss = () => {
		ToastAndroid.show(state.message, ToastAndroid.SHORT);
	};

	const RenderDialog = () => {
		return (
			<Portal>
				<Dialog
					visible={state.status_code === 402}
					dismissable={false}
					dismissableBackButton={false}
					onDismiss={onBackDismiss}
					theme={{ roundness: 2 }}
				>
					<Dialog.Icon icon='alert' />
					<Dialog.Title>
						<Text style={{ textAlign: 'center' }}>Error {state.status_code}</Text>
					</Dialog.Title>
					<Dialog.Content>
						<Text style={{ textAlign: 'center' }}>{state.message}</Text>
					</Dialog.Content>
				</Dialog>
			</Portal>
		);
	};

	return (
		<PaperProvider theme={theme}>
			<Stack screenOptions={{ headerShown: false, animation: 'ios' }}>
				<Stack.Screen name='index' />
			</Stack>
			<RenderDialog />
		</PaperProvider>
	);
};

export default RootLayout;
