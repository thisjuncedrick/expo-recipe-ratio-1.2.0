import { Container, ErrorDialog, LoadingDialog, RecipesList } from '@/lib/components';
import { formatText, Strings } from '@/lib/constants';
import { useFetchRecipes } from '@/lib/hooks';
import { Styles } from '@/lib/ui';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { View } from 'react-native';
import { Searchbar } from 'react-native-paper';

/**
 * Recipes component renders a list of recipes based on the selected meat type.
 * It includes search functionality, error handling, and pagination for loading more data.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 */
const Recipes = (): JSX.Element => {
	// Fetch the meat type from the URL search parameters
	const { meat } = useLocalSearchParams<{ meat: string }>();

	// Router instance for navigation
	const router = useRouter();

	// Custom hook to fetch recipes based on the meat type and handle search, pagination, and errors
	const {
		recipes, // List of fetched recipes
		searchQuery, // Current search query
		setSearchQuery, // Setter for search query input
		onSubmitSearch, // Function to handle search submission
		onClearSearch, // Function to clear the search input
		loadMoreData, // Function to load additional recipes (pagination)
		isFetchingNextPage, // Boolean indicating if the next page of data is being fetched
		isLoading, // Boolean indicating if the data is being loaded initially
		isRefetching, // Boolean indicating if data is being refetched
		refetch, // Function to manually refetch data
		isError, // Boolean indicating if an error occurred during fetching
		error, // The error object containing error details
	} = useFetchRecipes(meat);

	/**
	 * Handle the selection of a recipe and navigate to the `Ingredients` screen.
	 *
	 * @param {number} id - The ID of the selected recipe.
	 * @param {string} recipeName - The name of the selected recipe.
	 */
	const handleRecipePick = useCallback((id: number, recipeName: string) => {
		const params = { recipeId: id.toString(), recipeName: recipeName, fromFave: 'false' };
		router.push({ pathname: '/(stack)/Ingredients', params: params });
	}, []);

	return (
		<>
			{/* Set the screen title dynamically based on the meat type */}
			<Stack.Screen options={{ title: `${formatText(meat)} Recipes` }} />

			{/* Show loading dialog while recipes are being fetched */}
			<LoadingDialog visible={isLoading} />

			{/* Show error dialog if an error occurs and allow retrying the fetch */}
			<ErrorDialog visible={isError} errorMessage={error?.message || Strings.error_message} onRetry={refetch} />

			{/* Main container for the content */}
			<Container>
				{/* Search bar component for searching recipes */}
				<View style={Styles.ph_md}>
					<Searchbar
						placeholder='Search'
						onChangeText={setSearchQuery}
						onSubmitEditing={onSubmitSearch}
						value={searchQuery}
						onIconPress={onSubmitSearch}
						onClearIconPress={onClearSearch}
						inputStyle={{ minHeight: 0 }}
						style={[Styles.rounded_xs, Styles.mv_sm, { height: 45 }]}
					/>
				</View>

				{/* List of recipes with pagination and refetch capabilities */}
				<View style={[Styles.flex_1, Styles.mb_sm, Styles.ph_md]}>
					<RecipesList
						recipes={recipes}
						loadMoreData={loadMoreData}
						isFetchingNextPage={isFetchingNextPage}
						isRefetching={isRefetching}
						refetch={refetch}
						onRecipePick={handleRecipePick}
					/>
				</View>
			</Container>
		</>
	);
};

export default Recipes;
