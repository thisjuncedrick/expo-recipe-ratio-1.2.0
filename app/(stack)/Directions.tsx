import { useRecipeDirections } from '@/lib/api';
import { Container, DirectionsSlides, ErrorDialog, LoadingDialog, RecipeImageBackdrop } from '@/lib/components';
import { isValidUrl, Strings } from '@/lib/constants';
import { Styles } from '@/lib/ui';
import { Asset } from 'expo-asset';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, View } from 'react-native';

// Constants
const SCREEN_HEIGHT = Dimensions.get('window').height;
const PLACEHOLDER = Asset.fromModule(require('@/assets/images/blank_image_placeholder.png')).uri;

/**
 * Component for rendering the recipe directions page.
 *
 * It displays the recipe directions, including a cover image, directions slides,
 * and handles loading and error states.
 *
 * @component
 * @returns {JSX.Element} The UI for displaying recipe directions.
 */
const Directions = (): JSX.Element => {
	// Extract recipeId, recipeName, and fromFave params from local search params.
	const { recipeId, recipeName, fromFave } = useLocalSearchParams<{
		recipeId: string;
		recipeName: string;
		fromFave: string;
	}>();

	// Fetch directions data using a custom hook from react-query.
	const { data, isLoading, refetch, isError, error } = useRecipeDirections(recipeId); // Fetch data using React Query

	// State for managing the cover image URI.
	const [imageUri, setImageUri] = useState<string>(); // Set recipe cover image, default to PLACEHOLDER

	// Check if the data is valid and has content.
	const isDataValid = data && Object.keys(data).length > 0;

	/**
	 * Effect to set the recipe image URI when data is loaded.
	 * Defaults to PLACEHOLDER if no valid cover image is found.
	 */
	useEffect(() => {
		if (isDataValid && data) {
			setImageUri(isValidUrl(data.cover_image) ? data.cover_image : PLACEHOLDER);
		}
	}, [data]);

	return (
		<>
			{/* Set the screen title to the recipe name */}
			<Stack.Screen options={{ title: recipeName }} />

			{/* Show loading dialog while recipes are being fetched */}
			<LoadingDialog visible={isLoading} />

			{/* Show error dialog if an error occurs and allow retrying the fetch */}
			<ErrorDialog visible={isError} errorMessage={error?.message || Strings.error_message} onRetry={refetch} />

			{/* Main container for the page content */}
			<Container>
				{/* Render the recipe directions if data is valid */}
				{isDataValid && data && imageUri ? (
					<>
						{/* Display the recipe image */}
						<RecipeImageBackdrop
							uri={imageUri}
							setToDefault={() => setImageUri(PLACEHOLDER)}
							height={SCREEN_HEIGHT / 1.5}
							locations={[0, 1]}
						/>

						{/* Display the directions */}
						<View style={Styles.absolute_fill}>
							<View style={[Styles.flex_1, Styles.flex, Styles.flex_row, Styles.items_center]}>
								<DirectionsSlides directions={data.directions} fromFavorites={fromFave} />
							</View>
						</View>
					</>
				) : null}
			</Container>
		</>
	);
};

export default Directions;
