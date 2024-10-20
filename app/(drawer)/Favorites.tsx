// Favorites.tsx

import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback } from 'react';
import { View } from 'react-native';
import { Icon, Text } from 'react-native-paper';

import { Container, ErrorDialog, LoadingDialog, RecipesList } from '@/lib/components';
import { Strings } from '@/lib/constants';
import { useFetchFavoritesList } from '@/lib/hooks';
import { Styles } from '@/lib/ui';
import { useFocusEffect, useRouter } from 'expo-router';

/**
 * Favorites Component
 * This component displays a list of favorite recipes, handles fetching data from the SQLite database,
 * and manages user interactions like refreshing and selecting a recipe.
 */
const Favorites = () => {
	// Router hook from expo-router for navigating between pages.
	const router = useRouter();

	// Access the SQLite database context provided by the app.
	const db = useSQLiteContext();

	// Custom hook to fetch favorite recipes list from the database.
	// Destructuring various states returned by the hook.
	const { recipes, loadMoreData, isFetchingNextPage, isLoading, refetch, isError, error } = useFetchFavoritesList(db);

	/**
	 * Triggers a refetch of the favorite recipes list.
	 */
	const handleRefresh = () => {
		refetch();
	};

	/**
	 *
	 * Handles the selection of a recipe from the list.
	 * Navigates to the Ingredients page with the selected recipe's ID and name.
	 *
	 * @param {number} id - The unique ID of the selected recipe.
	 * @param {string} recipeName - The name of the selected recipe.
	 */
	const handleRecipePick = useCallback((id: number, recipeName: string) => {
		const params = { recipeId: id.toString(), recipeName: recipeName, fromFave: 'true' };
		router.push({ pathname: '/(stack)/Ingredients', params: params });
	}, []);

	/**
	 * useFocusEffect
	 * This hook triggers the refetch of the favorites list when the component is focused (e.g., on navigation).
	 */
	useFocusEffect(
		useCallback(() => {
			handleRefresh();
		}, []),
	);

	// Render an empty state if no recipes are found and the data is not currently loading or in an error state.
	if (recipes.length === 0 && !isLoading && !isError) {
		return (
			<Container centered>
				<View style={[Styles.items_center, Styles.ph_lg]}>
					<Icon source='food-takeout-box-outline' size={70} />
					<Text style={Styles.textCenter}>{Strings.favorite_empty}</Text>
				</View>
			</Container>
		);
	}

	// Main UI rendering the list of favorite recipes, loading, or error dialogs based on the current state.
	return (
		<>
			<LoadingDialog visible={isLoading} />
			<ErrorDialog errorMessage={error?.message.toString() || Strings.error_message} visible={isError && Boolean(error)} onRetry={refetch} />
			<Container>
				{!isLoading ? (
					<View style={[Styles.flex_1, Styles.p_md]}>
						<RecipesList
							recipes={recipes} // Array of favorite recipes.
							loadMoreData={loadMoreData} // Function to load more recipes when reaching the end.
							isFetchingNextPage={isFetchingNextPage} // Whether more data is being fetched.
							isRefetching={isLoading} // Indicates if a refetch is happening.
							refetch={refetch} // Function to trigger a manual refetch.
							onRecipePick={handleRecipePick} //  Callback function when a recipe is selected.
						/>
					</View>
				) : null}
			</Container>
		</>
	);
};

export default Favorites;
