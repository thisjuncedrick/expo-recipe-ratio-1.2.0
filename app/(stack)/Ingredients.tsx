import { Asset } from 'expo-asset';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, ToastAndroid, View } from 'react-native';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
import { Button, Divider, Paragraph, Surface, Text, useTheme } from 'react-native-paper';

import { useRecipeIngredients } from '@/lib/api';
import {
	AddIngredientsSheet,
	Container,
	ErrorDialog,
	FavoriteButton,
	IngredientsChecklist,
	LoadingDialog,
	RecipeImageBackdrop,
	ServingsInput,
	useSettings,
} from '@/lib/components';
import { formatDate, isValidUrl, Strings } from '@/lib/constants';
import { deleteIngredient, fetchCustomIngredients, insertIngredient } from '@/lib/database';
import { useCheckList, useFavorites, useServingsCounter } from '@/lib/hooks';
import { CustomIngredient } from '@/lib/types';
import { Styles } from '@/lib/ui';

// Constants
const SCREEN_HEIGHT = Dimensions.get('window').height;
const PLACEHOLDER = Asset.fromModule(require('@/assets/images/blank_image_placeholder.png')).uri;

const Ingredients = () => {
	// Hook for params passed to the screen
	const { recipeId, recipeName, fromFave } = useLocalSearchParams<{
		recipeId: string;
		recipeName: string;
		fromFave: string;
	}>();

	// Theme-related styles
	const { colors } = useTheme();
	const { checkList } = useSettings();

	// Navigation router instance
	const router = useRouter();

	// SQLite database instance
	const db = useSQLiteContext();

	// State variables
	const [isIngredientsSheetVisible, setIsIngredientsSheetVisible] = useState(false);
	const [imageUri, setImageUri] = useState('');
	const [ingredientsList, setIngredientsList] = useState<CustomIngredient[]>([]);

	// Fetch ingredients data from API
	const { data, isLoading, isRefetching, refetch, isError, error } = useRecipeIngredients(recipeId);

	// Hook for managing the favorite status of the recipe
	const {
		isFavorite,
		dateFavorited,
		saveToFavorites,
		removeFromFavorites,
		isLoading: isCheckingIfFavorited,
		isError: favoriteError,
		error: faveErrorMessage,
	} = useFavorites(data, db);

	// Hook for managing checked ingredients in the checklist
	const { checkedItems, toggleChecked, allChecked } = useCheckList(ingredientsList, checkList);

	// Hook for managing servings count and validation
	const { servings, inputValue, setInputValue, validateAndSetServings } = useServingsCounter();

	// Fetch ingredients data and merge with custom ingredients from local DB3
	const refetchIngredients = useCallback(async () => {
		if (data) {
			const customIngredients = await fetchCustomIngredients(db, recipeId); // Call query function
			const regularIngredients: CustomIngredient[] = data.ingredients.map((ingredient, i) => ({
				...ingredient,
				isCustom: false,
				id: i,
			}));
			setIngredientsList([...regularIngredients, ...customIngredients]);
		}
	}, [data, db, recipeId]);

	// Update image and ingredients list when data is fetched
	useEffect(() => {
		if (data) {
			setImageUri(isValidUrl(data.cover_image) ? data.cover_image : PLACEHOLDER);
			refetchIngredients();
		}
	}, [data, refetchIngredients]);

	// Handle bookmark toggle between save and remove from favorites
	const handleBookmarkPress = () => {
		isFavorite ? removeFromFavorites() : saveToFavorites();
	};

	// Handle start cooking when all ingredients are checked, then proceed to `Directions` screen
	const handleStartCooking = () => {
		if (allChecked) {
			router.push({
				pathname: '/(stack)/Directions',
				params: { recipeId, recipeName, fromFave },
			});
		} else {
			ToastAndroid.show('Check all ingredients to proceed.', ToastAndroid.SHORT);
		}
	};

	return (
		<>
			{/* Loading indicator while data is being fetched */}
			<LoadingDialog visible={isLoading || isCheckingIfFavorited} />

			{/* Error dialog if fetching data or favorites status fails */}
			<ErrorDialog
				visible={isError || favoriteError}
				errorMessage={error?.message || faveErrorMessage || Strings.error_message}
				onRetry={refetch}
			/>

			<Container>
				{data && (
					<ScrollView
						overScrollMode='never'
						contentContainerStyle={{ flexGrow: 1 }}
						refreshControl={
							<RefreshControl
								refreshing={isRefetching}
								onRefresh={refetch}
								colors={[colors.onSecondaryContainer]}
								progressBackgroundColor={colors.secondaryContainer}
							/>
						}
					>
						{/* Recipe image with backdrop */}
						<RecipeImageBackdrop
							uri={imageUri}
							setToDefault={() => setImageUri(PLACEHOLDER)}
							height={SCREEN_HEIGHT / 2}
						/>

						<View style={Styles.flex_1}>
							<Surface
								style={[
									Styles.flex_1,
									Styles.mh_md,
									Styles.p_md,
									Styles.rounded_md,
									Styles.unround_bottom,
									{ marginTop: -1 * (SCREEN_HEIGHT / 8) },
								]}
							>
								<View style={[Styles.flex_wide, { alignItems: 'flex-start', columnGap: 25 }]}>
									<Text
										variant='titleLarge'
										style={[Styles.flex_shrink, Styles.mb_sm, { color: colors.primary }]}
									>
										{data.name}
									</Text>
									<FavoriteButton isFavorite={isFavorite} onToggleFavorite={handleBookmarkPress} />
								</View>

								{/* Recipe description */}
								<View
									style={[
										Styles.pl_sm,
										Styles.pv_xs,
										Styles.mb_sm,
										{ borderLeftWidth: 2, borderLeftColor: colors.primary, maxWidth: '85%' },
									]}
								>
									<Paragraph style={{ color: colors.onSurfaceVariant, textAlign: 'justify' }}>
										{data.description}
									</Paragraph>
								</View>

								{/* Display favorited date if applicable */}
								{isFavorite && dateFavorited ? <Text>Date Favorited: {formatDate(dateFavorited)}</Text> : null}

								{/* Servings input and checklist */}
								<View>
									<Divider style={Styles.mv_md} bold={true} />
									<ServingsInput
										value={inputValue}
										setInput={setInputValue}
										validateInput={validateAndSetServings}
									/>
									<Divider style={Styles.mv_md} bold={true} />

									{/* Ingredients checklist */}
									<View>
										{ingredientsList.length > 0 && (
											<IngredientsChecklist
												ingredients={ingredientsList}
												deleteIngredientCallback={(id) => deleteIngredient(db, id, refetchIngredients)}
												canCheck={checkList}
												servings={servings}
												checkedItems={checkedItems}
												toggleChecked={toggleChecked}
											/>
										)}

										{/* Button to add custom ingredients */}
										<Button
											style={[Styles.mv_md]}
											onPress={() => setIsIngredientsSheetVisible(true)}
											mode='text'
											uppercase
										>
											{Strings.add_ingredient}
										</Button>
									</View>

									{/* Navigation button for Directions screen */}
									<Button onPress={handleStartCooking} mode='contained-tonal' uppercase>
										{Strings.start_cooking}
									</Button>
								</View>
							</Surface>
						</View>
					</ScrollView>
				)}

				{/* Bottom sheet for adding custom ingredients */}
				<AddIngredientsSheet
					isVisible={isIngredientsSheetVisible}
					onClose={() => setIsIngredientsSheetVisible(false)}
					callbackDataPush={(ingredient) => insertIngredient(db, recipeId, ingredient, refetchIngredients)}
				/>
			</Container>
		</>
	);
};

export default Ingredients;
