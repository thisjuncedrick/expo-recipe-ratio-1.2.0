import { SETTINGS_KEY } from '@/lib/constants';
import { Setting } from '@/lib/types';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { MD3DarkTheme, MD3LightTheme, MD3Theme } from 'react-native-paper';

/**
 * Type definition for the SettingsContext value.
 * @typedef {Object} SettingsContextType
 * @property {Setting} settings - The user's settings, including theme and checkList.
 * @property {boolean} checkList - Indicates if the checklist feature is enabled.
 * @property {MD3Theme} theme - The selected theme based on the settings and color scheme.
 */
interface SettingsContextType {
	settings: Setting;
	checkList: boolean;
	theme: MD3Theme;
}

// Create the Settings context
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

/**
 * SettingsProvider component to manage and provide user settings across the app.
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components to be wrapped by the provider.
 * @returns {JSX.Element} - The provider component for SettingsContext.
 */
export const SettingsProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
	const [settings, setSettings] = useState<Setting>({
		theme: 'light',
		checkList: true,
	});

	// Hook to detect user's system color scheme (dark/light)
	const colorScheme = useColorScheme();

	/**
	 * Load settings from secure storage or use default settings if none found.
	 * Updates the settings state based on saved values.
	 */
	useEffect(() => {
		const loadSettings = async () => {
			SecureStore.getItemAsync(SETTINGS_KEY).then((result) => {
				// If no settings are found, save the default settings
				if (result === null) {
					SecureStore.setItemAsync(SETTINGS_KEY, JSON.stringify(settings));
				}
				// Set the settings to either the saved ones or default values
				setSettings(JSON.parse(result ?? JSON.stringify(settings)));
			});
		};
		loadSettings();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/**
	 * Determine the selected theme based on the user's settings and system color scheme.
	 * @returns {MD3Theme} - The selected theme (MD3DarkTheme or MD3LightTheme).
	 */
	const SELECTED_THEME = settings.theme === 'auto' ? (colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme) : settings.theme === 'dark' ? MD3DarkTheme : MD3LightTheme;

	// Provide the settings and theme to child components
	return <SettingsContext.Provider value={{ settings, checkList: settings.checkList, theme: SELECTED_THEME }}>{children}</SettingsContext.Provider>;
};

/**
 * Hook to access the settings context.
 * Throws an error if used outside of the SettingsProvider.
 * @returns {SettingsContextType} - The current settings and theme.
 * @throws {Error} - If the hook is used outside of a SettingsProvider.
 */
export const useSettings = (): SettingsContextType => {
	const context = useContext(SettingsContext);
	if (!context) {
		throw new Error('useSettings must be used within a SettingsProvider');
	}
	return context;
};
