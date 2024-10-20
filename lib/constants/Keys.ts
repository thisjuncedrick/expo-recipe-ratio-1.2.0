import * as SecureStore from 'expo-secure-store';

export const FIRST_LAUNCH_KEY = 'first_launch';
export const FAVORITES_KEY = 'favorites';
export const SETTINGS_KEY = 'settings';
export const DB_NAME = 'recipe_ratio_db.db';
export const DB_VERSION = 1;

export const RESET_FIRST_LAUNCH = () => {
	SecureStore.deleteItemAsync(FIRST_LAUNCH_KEY);
};

export const RESET_FAVORITES = () => {
	SecureStore.deleteItemAsync(FAVORITES_KEY);
};

export const RESET_SETTINGS = () => {
	SecureStore.deleteItemAsync(SETTINGS_KEY);
};
