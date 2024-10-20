// AddIngredients.tsx

import { BottomSheetContainer, SheetContainerProps } from '@/lib/components/BottomSheets/BottomSheetContainer';
import { Strings } from '@/lib/constants';
import { Styles } from '@/lib/ui';
import React, { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { Button, Checkbox, Divider, HelperText, Text, TextInput, useTheme } from 'react-native-paper';
import { Dropdown } from 'react-native-paper-dropdown';

// Initial state for the form inputs
const initialState = {
	name: '', // Ingredient name
	quantity: '', // Ingredient quantity
	unit: '', // Measurement unit
	isCustomUnit: false, // Boolean to track if a custom unit is being used
	customUnit: '', // Custom unit (if applicable)
};

// Initial state for form errors
const initialErrors = {
	name: false,
	quantity: false,
	unit: false,
	customUnit: false,
};

/**
 * Props for the AddIngredients component.
 * @typedef {Object} AddIngredientsProps
 * @property {boolean} isVisible - Controls the visibility of the bottom sheet.
 * @property {() => void} onClose - Callback to close the bottom sheet.
 * @property {(data: { name: string; quantity: string; unit: string }) => void} callbackDataPush - Callback to push ingredient data to parent component.
 */
interface AddIngredientsProps extends SheetContainerProps {
	callbackDataPush: (data: { name: string; quantity: string; unit: string }) => void;
}

/**
 * AddIngredients component is used to add a new ingredient to a list.
 * It provides input fields for name, quantity, and unit, along with options for custom units.
 * The form validates required fields and passes data to the parent via callback when saved.
 *
 * @param {AddIngredientsProps} props - The props for the component.
 * @returns {JSX.Element} - The Add Ingredients form component inside a BottomSheet.
 */
export const AddIngredients = ({ isVisible, onClose, callbackDataPush }: AddIngredientsProps): JSX.Element => {
	const { colors } = useTheme(); // Retrieve theme colors
	const [state, setState] = useState(initialState); // Manage form inputs
	const [errors, setErrors] = useState(initialErrors); // Manage form errors

	/**
	 * Handles changes to form inputs, updating the state and resetting errors for the changed field.
	 * @param {string} key - The state key to update.
	 * @param {string | boolean | undefined} value - The new value for the key.
	 */
	const handleChange = useCallback((key: string, value: string | boolean | undefined) => {
		setState((prevState) => ({ ...prevState, [key]: value }));
		setErrors((prevErrors) => ({ ...prevErrors, [key]: false }));
	}, []);

	/**
	 * Validates the form inputs, ensuring all required fields are filled.
	 * Sets appropriate error messages if validation fails.
	 * @returns {boolean} - Whether the form inputs are valid.
	 */
	const validateInputs = useCallback(() => {
		const newErrors = { ...initialErrors };
		let isValid = true;

		// Validate name
		if (!state.name.trim()) {
			newErrors.name = true;
			isValid = false;
		}

		// Validate quantity
		if (!state.quantity.trim()) {
			newErrors.quantity = true;
			isValid = false;
		}

		// Validate unit or custom unit based on selection
		if (!state.isCustomUnit && !state.unit) {
			newErrors.unit = true;
			isValid = false;
		}
		if (state.isCustomUnit && !state.customUnit.trim()) {
			newErrors.customUnit = true;
			isValid = false;
		}

		setErrors(newErrors);
		return isValid;
	}, [state]);

	/**
	 * Handles the save button press, validating inputs and calling the callback to push data if valid.
	 */
	const handleSave = useCallback(() => {
		if (validateInputs()) {
			const { name, quantity, unit, isCustomUnit, customUnit } = state;
			const data = { name, quantity, unit: isCustomUnit ? customUnit : unit };
			callbackDataPush(data); // Push data to parent component
			handleCancel(); // Reset and close form
		}
	}, [state, validateInputs]);

	/**
	 * Resets the form and closes the bottom sheet.
	 */
	const handleCancel = useCallback(() => {
		setState(initialState);
		setErrors(initialErrors);
		onClose();
	}, [onClose]);

	/**
	 * Toggles the use of a custom unit, resetting unit fields and errors accordingly.
	 */
	const toggleCustomUnit = useCallback(() => {
		setState((prevState) => ({
			...prevState,
			isCustomUnit: !prevState.isCustomUnit,
			unit: '',
			customUnit: '',
		}));
		setErrors((prevErrors) => ({
			...prevErrors,
			unit: false,
			customUnit: false,
		}));
	}, []);

	// List of common units used for measurement, memoized for performance
	const commonUnits = useMemo(
		() => [
			{ label: 'Gram (g)', value: 'g' },
			{ label: 'Kilogram (kg)', value: 'kg' },
			{ label: 'Milligram (mg)', value: 'mg' },
			{ label: 'Ounce (oz)', value: 'oz' },
			{ label: 'Pound (lb)', value: 'lb' },
			{ label: 'Fluid Ounce (fl oz)', value: 'fl oz' },
			{ label: 'Gallon (gal)', value: 'gal' },
			{ label: 'Liter (L)', value: 'L' },
			{ label: 'Milliliter (mL)', value: 'mL' },
			{ label: 'Pint (pt)', value: 'pt' },
			{ label: 'Quart (qt)', value: 'qt' },
			{ label: 'Cup', value: 'cup' },
			{ label: 'Tablespoon (tbsp)', value: 'tbsp' },
			{ label: 'Teaspoon (tsp)', value: 'tsp' },
			{ label: 'Dash', value: 'dash' },
			{ label: 'Pinch', value: 'pinch' },
			{ label: 'Piece (pc)', value: 'pc' },
		],
		[], // Memoized to avoid recalculating on every render
	);

	return (
		<BottomSheetContainer isVisible={isVisible} onClose={handleCancel} showIndicator={false} snapToIndex={2}>
			<View style={Styles.ph_md}>
				<Text variant='titleMedium' style={{ color: colors.primary }}>
					{Strings.add_ingredient}
				</Text>
				<Text>{Strings.add_ingredient_desc}</Text>
			</View>
			<Divider style={Styles.mv_sm} />
			<View style={Styles.ph_md}>
				{/* Input for ingredient name */}
				<TextInput
					selectTextOnFocus
					label={Strings.input_ingredient}
					mode='outlined'
					value={state.name}
					onChangeText={(value) => handleChange('name', value)}
					style={Styles.mb_md}
					error={errors.name}
				/>

				{/* Input for ingredient quantity */}
				<TextInput
					selectTextOnFocus
					label={Strings.input_quantity}
					keyboardType='numeric'
					mode='outlined'
					value={state.quantity}
					onChangeText={(value) => handleChange('quantity', value)}
					style={Styles.mb_md}
					error={errors.quantity}
				/>

				{/* Checkbox to toggle custom unit */}
				<View style={Styles.flex_wide}>
					<Text>{Strings.label_is_custom_unit}</Text>
					<Checkbox status={state.isCustomUnit ? 'checked' : 'unchecked'} onPress={toggleCustomUnit} />
				</View>

				{/* Dropdown for selecting a common unit or input for custom unit */}
				{!state.isCustomUnit ? (
					<View style={Styles.mb_md}>
						<Dropdown
							label={Strings.dropown_unit}
							placeholder='Select unit'
							options={commonUnits}
							value={state.unit}
							onSelect={(value) => handleChange('unit', value)}
							mode='outlined'
							error={errors.unit}
						/>
					</View>
				) : (
					<>
						<TextInput
							selectTextOnFocus
							label={Strings.input_custom_unit}
							mode='outlined'
							value={state.customUnit}
							onChangeText={(value) => handleChange('customUnit', value)}
							error={errors.customUnit}
						/>
						<HelperText type='info' visible style={Styles.mb_md}>
							{Strings.custom_unit_helper}
						</HelperText>
					</>
				)}

				{/* Save and Cancel buttons */}
				<Button mode='contained' onPress={handleSave} style={Styles.mb_sm}>
					{Strings.add_ingredient}
				</Button>
				<Button mode='text' onPress={handleCancel} style={Styles.mb_lg}>
					Cancel
				</Button>
			</View>
		</BottomSheetContainer>
	);
};
