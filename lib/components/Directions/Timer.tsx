// Timer.tsx

import { Container } from '@/lib/components/Containers';
import { useTimerContext } from '@/lib/components/Directions/TimerContext';
import { formatTime } from '@/lib/constants';
import { Styles } from '@/lib/ui';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import { Asset } from 'expo-asset';
import { Audio } from 'expo-av';
import React, { useCallback, useEffect, useState } from 'react';
import { ToastAndroid, Vibration, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

/**
 * Navigation parameters for the Timer screen.
 * @typedef {Object} TimerScreenParams
 * @property {Object} Timer - Parameters specific to the Timer screen.
 * @property {number} Timer.totalSeconds - The initial total time in seconds for the timer.
 */
type TimerScreenParams = {
	Timer: {
		totalSeconds: number;
	};
};

/**
 * The Timer screen component that displays and controls a countdown timer.
 *
 * @returns {JSX.Element} The rendered Timer component.
 */
export const Timer = (): JSX.Element => {
	const route = useRoute<RouteProp<TimerScreenParams, 'Timer'>>();

	// Local state for managing the time left and the initial time set when the screen loads.
	const [timeLeft, setTimeLeft] = useState(route.params.totalSeconds);
	const [initialTime, setInitialTime] = useState(route.params.totalSeconds);

	const [sound, setSound] = useState<Audio.Sound | null>(null);

	// Timer context provides information on whether the timer is running and a setter to change that state.
	const { isRunning, setIsRunning } = useTimerContext();

	/**
	 * Load audio file for alarm
	 */
	useEffect(() => {
		const loadSound = async () => {
			const alarmSound = Asset.fromModule(require('@/assets/audio/bedside-clock-alarm-95792.mp3')).uri;
			const { sound } = await Audio.Sound.createAsync({ uri: alarmSound });
			setSound(sound);
		};
		loadSound();

		return () => {
			if (sound) sound.unloadAsync(); // Unload sound when component unmounts
		};
	}, []);

	/**
	 * Focus effect that runs when the Timer screen comes into focus.
	 * Resets the timer values and stops any ongoing vibration when navigating away from the screen.
	 */
	useFocusEffect(
		useCallback(() => {
			const newTotalSeconds = route.params.totalSeconds;
			setTimeLeft(newTotalSeconds);
			setInitialTime(newTotalSeconds);
			setIsRunning(false); // Ensure the timer is not running when screen gains focus.
			Vibration.cancel(); // Stop any ongoing vibration.
			if (sound) sound.stopAsync(); // Stop sound when refocusing
		}, [route.params.totalSeconds, sound]),
	);

	/**
	 * useEffect hook to handle the countdown logic when the timer is running.
	 * Decreases the timeLeft state by 1 every second, stops at 0, and triggers vibration and a toast notification.
	 */
	useEffect(() => {
		let intervalId: NodeJS.Timeout;

		if (isRunning && timeLeft > 0) {
			intervalId = setInterval(() => {
				setTimeLeft((prevTime) => prevTime - 1);
			}, 1000);
		} else if (timeLeft === 0) {
			setIsRunning(false);
			Vibration.vibrate([1000, 1500, 1000, 1500], true);
			ToastAndroid.show('TIME IS UP', ToastAndroid.LONG);
			if (sound) {
				sound.setIsLoopingAsync(true); // Loop the alarm sound
				sound.playAsync();
			}
		}

		return () => clearInterval(intervalId);
	}, [isRunning, timeLeft]);

	/**
	 * Starts or stops the timer based on its current state.
	 * If the timer is running, it will stop, and if it's stopped, it will start.
	 */
	const handleStartStop = () => {
		setIsRunning(!isRunning);
		if (!isRunning && sound) sound.stopAsync(); // Stop sound when stopping the timer
	};

	/**
	 * Resets the timer to its initial value, stops the countdown, and cancels any ongoing vibrations.
	 */
	const handleReset = () => {
		Vibration.cancel();
		setIsRunning(false);
		setTimeLeft(initialTime);
		if (sound) sound.stopAsync(); // Stop sound on reset
	};

	return (
		<Container centered styles={Styles.ph_md}>
			{/* Display the remaining time in a large text format */}
			<Text variant='displayLarge' style={[Styles.flex_shrink, Styles.mb_md]}>
				{formatTime(timeLeft)}
			</Text>

			{/* Buttons for controlling the timer */}
			<View style={[Styles.flex_row, Styles.items_center, { gap: 10 }]}>
				<Button mode='contained' onPress={handleStartStop} style={Styles.flex_1} disabled={timeLeft === 0}>
					{isRunning ? 'Stop' : 'Start'}
				</Button>
				<Button mode='contained-tonal' onPress={handleReset} style={Styles.flex_1}>
					Reset
				</Button>
			</View>
		</Container>
	);
};
