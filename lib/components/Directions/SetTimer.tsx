// SetTimer.tsx

import { Container } from '@/lib/components/Containers';
import { Styles } from '@/lib/ui';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';

/**
 * Props for the `RenderInput` component.
 * @property {string} label - The label for the input field.
 * @property {string} value - The current value of the input field.
 * @property {(value: string) => void} onChange - Callback to update the input value.
 */
type InputProps = {
	label: string;
	value: string;
	onChange: (value: string) => void;
};

/**
 * Renders a styled numeric input for hours, minutes, or seconds.
 *
 * @param {InputProps} props - Props containing label, value, and onChange callback.
 * @returns {JSX.Element} A rendered TextInput component.
 */
const RenderInput = ({ label, value, onChange }: InputProps): JSX.Element => {
	/**
	 * Handles the input change and sanitizes the input value to ensure it's numeric
	 * and within a valid range (0-59).
	 */
	const handleInput = useCallback(() => {
		const cleanedValue = !value ? '00' : value.replace(/[^0-9]/g, '');
		const checkValue = Number(cleanedValue) > 59 ? '59' : cleanedValue;
		onChange(('0' + checkValue).slice(-2));
	}, [value, onChange]);

	return (
		<TextInput
			label={label}
			mode='outlined'
			style={{ fontSize: 40, height: 80 }}
			value={value}
			onChangeText={onChange}
			onSubmitEditing={handleInput}
			onBlur={handleInput}
			contextMenuHidden={true}
			selectTextOnFocus={true}
			maxLength={2}
			keyboardType='numeric'
		/>
	);
};

/**
 * A screen component that allows users to set a timer by inputting hours, minutes, and seconds.
 *
 * @returns {JSX.Element} The rendered SetTimer component.
 */
export const SetTimer = (): JSX.Element => {
	const { colors } = useTheme();
	const navigation = useNavigation();

	const [hours, setHours] = useState<string>('00');
	const [minutes, setMinutes] = useState<string>('00');
	const [seconds, setSeconds] = useState<string>('00');

	/**
	 * Resets the hour, minute, and second inputs to '00'.
	 */
	const resetInputs = useCallback(() => {
		setHours('00');
		setMinutes('00');
		setSeconds('00');
	}, []);

	/**
	 * Focus effect to reset inputs when the screen is focused or unfocused.
	 */
	useFocusEffect(
		useCallback(() => {
			resetInputs();
			return () => resetInputs(); // This will reset when leaving the screen
		}, [resetInputs]),
	);

	/**
	 * Handles setting the total time and navigating to the 'Timer' screen if the input time is valid.
	 */
	const handleSetTime = useCallback(() => {
		const totalSeconds = parseInt(hours, 10) * 3600 + parseInt(minutes, 10) * 60 + parseInt(seconds, 10);

		if (totalSeconds > 0) {
			navigation.navigate('Timer', { totalSeconds });
		}
	}, [hours, minutes, seconds, navigation]);

	return (
		<Container centered={true} styles={Styles.ph_md}>
			<View style={[Styles.flex_row, Styles.items_center, Styles.mb_md, { columnGap: 10 }]}>
				<View style={[Styles.flex_1]}>
					<RenderInput label='Hours' value={hours} onChange={setHours} />
				</View>
				<Text variant='headlineMedium' style={{ color: colors.primary }}>
					:
				</Text>
				<View style={[Styles.flex_1]}>
					<RenderInput label='Mins' value={minutes} onChange={setMinutes} />
				</View>
				<Text variant='headlineMedium' style={{ color: colors.primary }}>
					:
				</Text>
				<View style={[Styles.flex_1]}>
					<RenderInput label='Secs' value={seconds} onChange={setSeconds} />
				</View>
			</View>
			<Button
				onPress={handleSetTime}
				mode='contained'
				style={Styles.w_full}
				icon='clock-time-eight'
				contentStyle={{ flexDirection: 'row-reverse' }}
				uppercase
			>
				Set Time
			</Button>
		</Container>
	);
};
