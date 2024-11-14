import { FontAwesome5, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { Asset } from 'expo-asset';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';

import { DB_NAME } from '@/lib/constants';
import * as FileSystem from 'expo-file-system';

export const useLoadResources = () => {
	const [isAssetsLoaded, setAssetsLoaded] = useState(false);
	const [isDBLoaded, setIsDBLoaded] = useState(false);

	//* Load fonts
	const [fontsLoaded, error] = useFonts({
		...MaterialCommunityIcons.font,
		...FontAwesome5.font,
		...FontAwesome6.font,
	});

	//* Expo Router uses Error Boundaries to catch errors in the navigation tree.
	useEffect(() => {
		if (error) throw error;
	}, [error]);

	//* Function to load assets asynchronously
	const loadAssetsAsync = async () => {
		try {
			await Asset.loadAsync([
				require('@/assets/images/dish-8723519_1920-min.jpg'),
				require('@/assets/images/adaptive-icon.png'),
				require('@/assets/images/icon.png'),
				require('@/assets/images/blank_image_placeholder.png'),
				require('@/assets/audio/bedside-clock-alarm-95792.mp3'),
			]);
			setAssetsLoaded(true);
		} catch (error) {
			console.error('Error loading assets:', error);
		}
	};

	const initDatabaseAsset = async () => {
		const assetPath = `${FileSystem.documentDirectory}SQLite/${DB_NAME}`;

		// FileSystem.deleteAsync(assetPath);
		const fileInfo = await FileSystem.getInfoAsync(assetPath);
		if (!fileInfo.exists) {
			try {
				const asset = Asset.fromModule(require('@/assets/database/recipe_ratio_db.db'));
				await asset.downloadAsync();

				if (asset.localUri) {
					await FileSystem.copyAsync({
						from: asset.localUri,
						to: assetPath,
					});
					// console.log('Database copied successfully');
				} else {
					throw new Error('Failed to get local URI for asset');
				}
			} catch (error) {
				console.error('Error copying database:', error);
			}
		} else {
			// console.log('Database already exists');
		}

		// Indicate that the database has been loaded
		setIsDBLoaded(true);
	};

	//* Load assets when fonts are loaded
	useEffect(() => {
		if (fontsLoaded) {
			loadAssetsAsync();
			initDatabaseAsset();
		}
	}, [fontsLoaded]);

	//* Return asset loading status
	return fontsLoaded && isAssetsLoaded && isDBLoaded;
};
