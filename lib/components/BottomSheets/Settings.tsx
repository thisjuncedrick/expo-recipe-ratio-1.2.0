// Settings.tsx

import { BottomSheetContainer, SheetContainerProps } from '@/lib/components/BottomSheets/';
import { SETTINGS_KEY, Strings } from '@/lib/constants';
import { Setting } from '@/lib/types';
import { Styles } from '@/lib/ui';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { ToastAndroid, View } from 'react-native';
import {
	Button,
	Dialog,
	Divider,
	Icon,
	Portal,
	RadioButton,
	Switch,
	Text,
	TouchableRipple,
	useTheme,
} from 'react-native-paper';

import { DB_NAME } from '@/lib/constants';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

// Path where the SQLite database will be stored
const DB_ASSET_PATH = `${FileSystem.documentDirectory}SQLite/${DB_NAME}`;

/**
 * Initializes the database by copying the asset from the bundled location to the file system.
 * If the database already exists, it does nothing.
 */
const initDatabaseAsset = async () => {
	// FileSystem.deleteAsync(assetPath);
	const fileInfo = await FileSystem.getInfoAsync(DB_ASSET_PATH);
	if (!fileInfo.exists) {
		console.log('Database copied successfully');
		try {
			const asset = Asset.fromModule(require('@/assets/database/recipe_ratio_db.db'));
			await asset.downloadAsync();

			if (asset.localUri) {
				await FileSystem.copyAsync({
					from: asset.localUri,
					to: DB_ASSET_PATH,
				});
			} else {
				throw new Error('Failed to get local URI for asset');
			}
		} catch (error) {
			console.error('Error copying database:', error);
		}
	} else {
		console.log('Database already exists');
	}
};

/**
 * Props for the RenderRadioButton component.
 * @typedef {Object} RenderRadioButtonProps
 * @property {string} label - The label to display next to the radio button.
 * @property {string} icon - The icon to display beside the label.
 * @property {boolean} isChecked - Whether the radio button is checked.
 * @property {Setting['theme']} value - The value for the radio button.
 * @property {(string: Setting['theme']) => void} onChange - Function to handle the radio button change.
 */

interface RenderRadioButtonProps {
	label: string;
	icon: string;
	isChecked: boolean;
	value: Setting['theme'];
	onChange: (string: Setting['theme']) => void;
}

/**
 * Renders a radio button item with an icon and label.
 * @param {RenderRadioButtonProps} props - The props for the radio button.
 * @returns {JSX.Element} - The rendered radio button component.
 */
const RenderRadioButton = ({ label, icon, value, isChecked, onChange }: RenderRadioButtonProps): JSX.Element => {
	return (
		<TouchableRipple
			style={[Styles.flex_row, Styles.items_center, Styles.ph_md, Styles.pv_sm, { gap: 15 }]}
			onPress={() => onChange(value)}
		>
			<>
				<Icon source={icon} size={35} />
				<View style={[Styles.flex_wide, Styles.flex_1]}>
					<Text variant='bodyLarge'>{label}</Text>
					<RadioButton.Android value={value} status={isChecked ? 'checked' : 'unchecked'} />
				</View>
			</>
		</TouchableRipple>
	);
};

/**
 * Settings component that allows users to manage application preferences.
 * Users can switch between themes, enable/disable ingredient checklists, and reset the database.
 *
 * @param {SheetContainerProps} props - The props for the settings sheet.
 * @returns {JSX.Element} - The settings component inside a bottom sheet.
 */
export const Settings = ({ isVisible, onClose }: SheetContainerProps): JSX.Element => {
	const { colors } = useTheme();
	const [isDialogOpen, setDialogOpen] = useState<boolean>(false);

	// State for settings (theme and checkList preferences)
	const [settings, setSettings] = useState<Setting>({
		theme: 'light',
		checkList: true,
	});

	/**
	 * Closes the confirmation dialog.
	 */
	const closeDialog = () => {
		setDialogOpen(false);
	};

	/**
	 * Confirms and resets the database by deleting the existing file and reinitializing it.
	 */
	const confirmReset = async () => {
		const fileInfo = await FileSystem.getInfoAsync(DB_ASSET_PATH);
		if (fileInfo.exists) {
			FileSystem.deleteAsync(DB_ASSET_PATH);
		} else {
			ToastAndroid.show('Database is already deleted', ToastAndroid.SHORT);
		}

		// Re-initialize the database asset after deletion
		initDatabaseAsset();
		closeDialog();
		ToastAndroid.show(Strings.restart_app, ToastAndroid.SHORT);
	};

	/**
	 * Loads the user's saved settings from SecureStore or initializes with default values.
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
	 * Handles the theme change by updating the settings state.
	 * @param {Setting['theme']} value - The selected theme value.
	 */
	const handleThemeChange = (value: Setting['theme']) => {
		setSettings((prevSettings) => ({
			...prevSettings,
			theme: value,
		}));
	};

	/**
	 * Handles the ingredient checklist toggle.
	 * @param {boolean} value - Whether the checklist feature is enabled or disabled.
	 */
	const handleIngredientsChecking = (value: boolean) => {
		setSettings((prevSettings) => ({
			...prevSettings,
			checkList: value,
		}));
	};

	/**
	 * Saves the updated settings to secure storage and closes the sheet.
	 */
	const handleSaveChanges = async () => {
		onClose();
		SecureStore.setItemAsync(SETTINGS_KEY, JSON.stringify(settings));
		ToastAndroid.show(Strings.restart_app, ToastAndroid.SHORT);
	};

	return (
		<>
			<BottomSheetContainer isVisible={isVisible} onClose={onClose} backdropPress='close'>
				<View style={Styles.ph_md}>
					<Text variant='titleMedium' style={{ color: colors.primary }}>
						{Strings.mode}
					</Text>
					<Text>{Strings.mode_desc}</Text>
				</View>

				<Divider style={Styles.mt_sm} />

				{/* Theme selection using radio buttons */}
				<RadioButton.Group
					onValueChange={(value) => handleThemeChange(value as Setting['theme'])}
					value={settings.theme}
				>
					<RenderRadioButton
						isChecked={settings.theme === 'dark'}
						value='dark'
						label={Strings.mode_dark}
						icon='circle'
						onChange={handleThemeChange}
					/>
					<RenderRadioButton
						isChecked={settings.theme === 'light'}
						value='light'
						label={Strings.mode_light}
						icon='circle-outline'
						onChange={handleThemeChange}
					/>
					<RenderRadioButton
						isChecked={settings.theme === 'auto'}
						value='auto'
						label={Strings.mode_auto}
						icon='circle-half-full'
						onChange={handleThemeChange}
					/>
				</RadioButton.Group>

				<Divider style={Styles.mb_sm} />

				{/* Ingredient checklist toggle */}
				<View style={[Styles.ph_md, Styles.flex, Styles.flex_row, Styles.items_center, Styles.between]}>
					<View>
						<Text variant='titleMedium' style={{ color: colors.primary }}>
							{Strings.check}
						</Text>
						<Text>{Strings.check_desc}</Text>
					</View>
					<Switch value={settings.checkList} onValueChange={handleIngredientsChecking} />
				</View>

				<View style={[Styles.ph_md]}>
					{/* Save button */}
					<Button
						onPress={handleSaveChanges}
						style={[Styles.mt_lg, Styles.mb_sm]}
						mode='contained'
						uppercase={true}
					>
						{Strings.save_settings}
					</Button>
					{/* Reset data button */}
					<Button onPress={() => setDialogOpen(true)} mode='text'>
						{Strings.reset_data}
					</Button>
				</View>
			</BottomSheetContainer>

			{/* Confirmation dialog for resetting data */}
			<Portal>
				<Dialog visible={isDialogOpen} onDismiss={closeDialog}>
					<Dialog.Title>{Strings.reset_data}?</Dialog.Title>
					<Dialog.Content>
						<Text style={Styles.mb_sm}>{Strings.reset_data_warning}</Text>
					</Dialog.Content>
					<Dialog.Actions>
						<Button onPress={closeDialog}>Cancel</Button>
						<Button labelStyle={{ color: colors.error }} onPress={confirmReset}>
							Proceed
						</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
		</>
	);
};
