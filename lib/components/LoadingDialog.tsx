// loadingDialog.tsx

import { Strings } from '@/lib/constants';
import React, { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { ActivityIndicator, Dialog, Portal, Text } from 'react-native-paper';

/**
 * Props for the LoadingDialog component.
 * @interface LoadingDialogProp
 * @property {string} [title] - Optional title for the loading dialog.
 * @property {boolean} visible - Control visibility of the loading dialog.
 */
interface LoadingDialogProp {
	visible: boolean;
}

/**
 * LoadingDialog component that displays a loading indicator and a message to the user.
 *
 * This dialog is non-dismissible using the back button to ensure the user waits
 * until the loading process is complete.
 *
 * @param {LoadingDialogProp} props - The props for the LoadingDialog component.
 * @returns {JSX.Element} The rendered LoadingDialog component.
 */
export const LoadingDialog = ({ visible }: LoadingDialogProp): JSX.Element => {
	/**
	 * Effect that handles the hardware back button press.
	 * Prevents the dialog from being dismissed when visible.
	 */
	useEffect(() => {
		const onBackPress = () => {
			return true; // Prevent back button from dismissing the dialog
		};

		if (visible) {
			// Add the back button listener when the dialog is visible
			BackHandler.addEventListener('hardwareBackPress', onBackPress);
		}

		// Clean up the event listener on unmount or when dialog is not visible
		return () => {
			BackHandler.removeEventListener('hardwareBackPress', onBackPress);
		};
	}, [visible]);

	return (
		<Portal>
			<Dialog visible={visible} dismissable={false}>
				<Dialog.Title>{Strings.loading_title}</Dialog.Title>
				<Dialog.Content style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
					<ActivityIndicator size='large' />
					<Text variant='bodyMedium' style={{ flexShrink: 1 }}>
						{Strings.loading_message}
					</Text>
				</Dialog.Content>
			</Dialog>
		</Portal>
	);
};
