// ServingsInput.tsx

import { Strings } from '@/lib/constants';
import { Styles } from '@/lib/ui';
import React from 'react';
import { View } from 'react-native';
import { Text, TextInput, useTheme } from 'react-native-paper';

interface ServingsInputProps {
	value: string;
	setInput: (text: string) => void;
	validateInput: () => void;
}

/**
 * A component that renders an input field for setting the number of servings.
 *
 * @param {ServingsInputProps} props - The component's props.
 * @param {string} props.value - The current value of the input field.
 * @param {(text: string) => void} props.setInput - Callback to update the input field's value.
 * @param {() => void} props.validateInput - Callback to validate the input when editing ends or form is submitted.
 * @returns {JSX.Element} The UI for servings input.
 */
export const ServingsInput = ({ value, setInput, validateInput }: ServingsInputProps): JSX.Element => {
	const { colors } = useTheme();

	return (
		<View style={[Styles.centered_view, Styles.flex_row, Styles.between]}>
			<Text variant='titleMedium' style={{ color: colors.primary }}>
				{[Strings.servings]}
			</Text>
			<TextInput
				contextMenuHidden={true}
				mode='outlined'
				value={value} // Bind input value for real-time typing
				selectTextOnFocus={true}
				inputMode='numeric'
				maxLength={3}
				onChangeText={setInput} // Let the user type freely
				onBlur={validateInput} // Validate input on blur
				onSubmitEditing={() => validateInput()} // Validate on submit
				style={{ height: 35, textAlign: 'right' }}
			/>
		</View>
	);
};
