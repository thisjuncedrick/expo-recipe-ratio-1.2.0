// DoubleBackExit.tsx

import { useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';
import { BackHandler, ToastAndroid } from 'react-native';

/**
 * DoubleBackExit component prevents the user from accidentally exiting the app.
 * It requires the user to press the back button twice within 2 seconds to exit.
 *
 * - On the first press, it shows a toast message prompting the user to press back again.
 * - On the second press within 2 seconds, it exits the app.
 *
 * This component does not render any UI.
 */
export const DoubleBackExit = () => {
	// Ref to store the timestamp of the last back button press
	const lastBackPressed = useRef(0);

	/**
	 * Function to handle the back button press.
	 * It checks the time between the current and the last back press.
	 * If the time interval is less than 2 seconds, the app is exited.
	 * Otherwise, a toast message is shown.
	 */
	const handleBackPress = useCallback(() => {
		const now = new Date().getTime();
		if (now - lastBackPressed.current < 2000) {
			// If the back button is pressed within 2 seconds, exit the app
			BackHandler.exitApp();
			return true;
		}

		// Update the lastBackPressed timestamp and show a toast message
		lastBackPressed.current = now;
		ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
		return true;
	}, []);

	/**
	 * useFocusEffect hook to add and remove the back button listener.
	 * When the component is focused, the back button press event is handled.
	 * The event listener is cleaned up when the component loses focus.
	 */
	useFocusEffect(
		useCallback(() => {
			BackHandler.addEventListener('hardwareBackPress', handleBackPress);

			return () => {
				BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
			};
		}, [handleBackPress]),
	);

	// This component doesn't render any UI
	return null;
};
