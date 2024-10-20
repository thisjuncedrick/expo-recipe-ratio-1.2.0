// IngredientsChecklist.tsx

import { calculateQuantity, Strings } from '@/lib/constants';
import { CustomIngredient } from '@/lib/types';
import { Styles } from '@/lib/ui';
import React, { useEffect, useState } from 'react';
import { ToastAndroid, View } from 'react-native';
import {
	ActivityIndicator,
	Button,
	Checkbox,
	DataTable,
	Dialog,
	IconButton,
	Portal,
	Text,
	useTheme,
} from 'react-native-paper';

/**
 * Props for the IngredientsChecklist component.
 * @typedef {Object} IngredientsListProps
 * @property {CustomIngredient[] | null} ingredients - Array of ingredient objects, or null if no ingredients are provided.
 * @property {boolean} canCheck - Determines if the checkbox functionality should be enabled.
 * @property {number} servings - Number of servings used to calculate the ingredient quantity. Default is 1.
 * @property {Record<string, boolean>} checkedItems - Object mapping ingredient index to its checked state.
 * @property {(index: number) => void} toggleChecked - Callback function to toggle the checked state of ingredients.
 * @property {(id: number) => void} deleteIngredientCallback - Callback function to delete a custom ingredient by its ID.
 */
interface IngredientsListProps {
	ingredients: CustomIngredient[] | null;
	canCheck: boolean;
	servings: number;
	checkedItems: Record<string, boolean>;
	toggleChecked: (index: number) => void;
	deleteIngredientCallback: (id: number) => void;
}

/**
 * A checklist component to display and manage a list of ingredients.
 * Allows users to check off ingredients, delete custom ingredients,
 * and displays a confirmation dialog for deletions.
 *
 * @param {IngredientsListProps} props - The props for the component.
 * @returns {JSX.Element} - The ingredients checklist component.
 */
export const IngredientsChecklist = React.memo(
	({
		ingredients,
		canCheck,
		servings = 1,
		checkedItems,
		toggleChecked,
		deleteIngredientCallback,
	}: IngredientsListProps) => {
		// Access the theme's colors
		const { colors } = useTheme();

		// State to track if the component is loading
		const [loading, setLoading] = useState<boolean>(true);

		// State for dialog visibility and the selected ingredient to delete
		const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
		const [selectedIngredient, setSelectedIngredient] = useState<CustomIngredient | null>(null);

		/**
		 * Closes the deletion confirmation dialog and clears the selected ingredient.
		 */
		const closeDialog = () => {
			setDialogOpen(false);
			setSelectedIngredient(null); // Clear the selected ingredient after closing
		};

		/**
		 * Confirms deletion of the selected ingredient.
		 * If an ingredient is selected, it calls the `deleteIngredientCallback` and shows a toast notification.
		 */
		const confirmDelete = () => {
			if (selectedIngredient) {
				closeDialog();
				deleteIngredientCallback(selectedIngredient.id);
				ToastAndroid.show(`${selectedIngredient.name} deleted`, ToastAndroid.SHORT);
			}
		};

		/**
		 * Handles the request to delete an ingredient by opening the dialog.
		 * @param {CustomIngredient} ingredient - The ingredient to delete.
		 */
		const handleDeleteRequest = (ingredient: CustomIngredient) => {
			setSelectedIngredient(ingredient);
			setDialogOpen(true); // Open the dialog with the selected ingredient
		};

		// Effect to simulate loading state and trigger when ingredients change
		useEffect(() => {
			setLoading(false);
		}, [ingredients]);

		return (
			<View>
				{/* Display the title with a primary color */}
				<Text variant='titleMedium' style={{ color: colors.primary }}>
					Ingredients
				</Text>
				<View>
					{/* Show loading spinner if ingredients are still loading */}
					{loading ? (
						<ActivityIndicator />
					) : (
						<DataTable>
							{ingredients?.map((ingredient, i) => {
								const value = calculateQuantity(ingredient.quantity, servings);
								const unit = ingredient.unit;

								return (
									<DataTable.Row key={i} style={{ paddingHorizontal: 0 }}>
										<DataTable.Cell style={{ flex: !canCheck ? 0.5 : 1 }}>
											{canCheck ? (
												<Checkbox
													status={checkedItems[i] ? 'checked' : 'unchecked'}
													onPress={() => toggleChecked(i)}
												/>
											) : null}
										</DataTable.Cell>
										<DataTable.Cell style={{ flex: 3 }}>
											<Text
												style={
													checkedItems[i]
														? { textDecorationLine: 'line-through', opacity: 0.5 }
														: undefined
												}
											>
												{ingredient.name}
											</Text>
										</DataTable.Cell>
										<DataTable.Cell style={[Styles.justify_end, { flex: 2 }]}>
											<Text
												style={
													checkedItems[i]
														? { textDecorationLine: 'line-through', opacity: 0.5 }
														: undefined
												}
											>
												{value} {unit}
											</Text>
										</DataTable.Cell>
										<DataTable.Cell style={[Styles.justify_center]}>
											{ingredient.isCustom ? (
												<IconButton
													onPress={() => handleDeleteRequest(ingredient)}
													icon='trash-can'
													size={20}
												/>
											) : null}
										</DataTable.Cell>
									</DataTable.Row>
								);
							})}
						</DataTable>
					)}

					{/* Dialog for confirming ingredient deletion */}
					<Portal>
						<Dialog visible={isDialogOpen} onDismiss={closeDialog}>
							<Dialog.Title>{Strings.delete_dialog}</Dialog.Title>
							<Dialog.Content>
								<Text style={Styles.mb_sm}>{Strings.delete_warning}</Text>
								{selectedIngredient ? (
									<View style={[Styles.p_sm, { borderLeftColor: colors.error, borderLeftWidth: 2 }]}>
										<Text style={{ color: colors.error }}>{selectedIngredient.name}</Text>
									</View>
								) : null}
							</Dialog.Content>
							<Dialog.Actions>
								<Button onPress={closeDialog}>Cancel</Button>
								<Button onPress={confirmDelete}>Delete</Button>
							</Dialog.Actions>
						</Dialog>
					</Portal>
				</View>
			</View>
		);
	},
);
