// ErrorDialog.tsx

import { Strings } from '@/lib/constants';
import React, { useEffect, useState } from 'react';
import { BackHandler } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';

/**
 * Props for the ErrorDialog component.
 * @interface ErrorDialogProps
 * @property {boolean} visible - Control visibility based on error state.
 * @property {string} errorMessage - Message to display in case of error.
 * @property {() => void} onRetry - Callback for refresh button (`refetch`).
 */
interface ErrorDialogProps {
	visible: boolean;
	errorMessage: string;
	onRetry: () => void;
}

/**
 * ErrorDialog component that displays an error message to the user and provides options to cancel or retry.
 *
 * This dialog is non-dismissible using the back button to ensure the user acknowledges the error.
 *
 * @param {ErrorDialogProps} props - The props for the ErrorDialog component.
 * @returns {JSX.Element} The rendered ErrorDialog component.
 */
export const ErrorDialog = ({ visible, errorMessage, onRetry }: ErrorDialogProps): JSX.Element => {
	const [dialogVisible, setDialogVisible] = useState(visible);

	/**
	 * Effect that handles the hardware back button press.
	 * Prevents the dialog from being dismissed when visible.
	 */
	useEffect(() => {
		const onBackPress = () => {
			return true; // Prevent back button from dismissing the dialog
		};

		if (dialogVisible) {
			BackHandler.addEventListener('hardwareBackPress', onBackPress);
		}

		return () => {
			BackHandler.removeEventListener('hardwareBackPress', onBackPress);
		};
	}, [dialogVisible]);

	/**
	 * Effect that updates the internal dialog visibility state
	 * based on the provided visible prop.
	 */
	useEffect(() => {
		setDialogVisible(visible);
	}, [visible]);

	/**
	 * Function to close the dialog.
	 * Updates the dialog visibility state to false.
	 */
	const close = () => {
		setDialogVisible(false);
	};

	return (
		<Portal>
			<Dialog visible={dialogVisible} dismissable={false}>
				<Dialog.Title>{Strings.error_title}</Dialog.Title>
				<Dialog.Content>
					<Text>{errorMessage}</Text>
				</Dialog.Content>
				<Dialog.Actions>
					<Button onPress={close}>Close</Button>
					<Button
						onPress={() => {
							onRetry();
							close();
						}}
					>
						Refresh
					</Button>
				</Dialog.Actions>
			</Dialog>
		</Portal>
	);
};
