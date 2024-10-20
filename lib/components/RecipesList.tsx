// RecipesList.tsx

import { formatData, getItemMargins, isValidUrl } from '@/lib/constants';
import { BaseRecipe, FavoriteRecipe } from '@/lib/types';
import { Styles } from '@/lib/ui';
import { Asset } from 'expo-asset';
import { Image } from 'expo-image';
import React, { useCallback, useMemo } from 'react';
import { Dimensions, TouchableOpacity, View } from 'react-native';
import { FlatList, RefreshControl } from 'react-native-gesture-handler';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';

/* Constants */
const SCREEN_WIDTH = Dimensions.get('window').width;
const COLUMN_COUNT = 2;
const H_PADDING_SIZE = Number(Styles.p_md.padding);
const ITEM_SIZE = (SCREEN_WIDTH - H_PADDING_SIZE * 2) / COLUMN_COUNT;
const PLACEHOLDER = Asset.fromModule(require('@/assets/images/blank_image_placeholder.png')).uri;

/**
 * Props for the RecipeFrame component.
 *
 * @typedef {Object} RecipeFrameProps
 * @property {any} item - The current item being rendered, typically a recipe or placeholder.
 * @property {number} index - The index of the current item in the list.
 * @property {number} totalItems - Total number of items in the list.
 * @property {function} onRecipePick - Callback function when a recipe is selected.
 */

interface RecipeFrameProps {
	item: any;
	index: number;
	totalItems: number;
	onRecipePick: (id: number, name: string) => void;
}

/**
 * RenderRecipeFrame is a memoized component that renders individual recipe frames.
 * It displays a recipe image and title or an empty space if the item is empty.
 *
 * @param {RecipeFrameProps} props - The props for the RecipeFrame component.
 * @returns {JSX.Element} The rendered frame for a recipe or an empty space.
 */
const RenderRecipeFrame = React.memo(({ item, index, totalItems, onRecipePick }: RecipeFrameProps) => {
	const { colors } = useTheme();
	const gridMargins = useMemo(() => getItemMargins(index, totalItems), [index, totalItems]);

	// Render an empty frame if item is marked as empty
	if (item.empty) {
		return <View style={[Styles.flex_1, gridMargins, { height: ITEM_SIZE, backgroundColor: 'transparent' }]} />;
	}

	// Determine image URL (or placeholder if invalid)
	const imageUri = isValidUrl(item.cover_image) ? item.cover_image : PLACEHOLDER;

	/**
	 * Handle the user tapping on a recipe, invoking the onRecipePick callback.
	 */
	const handlePress = useCallback(() => {
		onRecipePick(item.id | item.recipe_id, item.name);
	}, [onRecipePick, item.id, item.recipe_id, item.name]);

	return (
		<TouchableOpacity
			style={[
				Styles.flex_1,
				Styles.rounded_xs,
				Styles.hide_excess,
				gridMargins,
				{ backgroundColor: colors.elevation.level1 },
			]}
			onPress={handlePress}
			activeOpacity={0.7}
		>
			<Image
				source={{ uri: imageUri }}
				style={[{ height: ITEM_SIZE, backgroundColor: colors.elevation.level3 }]}
				cachePolicy='memory-disk'
			/>
			<View style={[Styles.p_sm, { minHeight: 30 }]}>
				<Text variant='titleSmall' numberOfLines={2}>
					{item.name}
				</Text>
			</View>
		</TouchableOpacity>
	);
});

/**
 * Props for the RecipesList component.
 *
 * @typedef {Object} RecipeListProps
 * @property {BaseRecipe[]} recipes - List of recipe items to display.
 * @property {function} loadMoreData - Callback to load more recipe data (pagination).
 * @property {boolean} isFetchingNextPage - Flag indicating if more data is being fetched.
 * @property {boolean} isRefetching - Flag indicating if data is being refreshed.
 * @property {function} refetch - Function to manually refetch the recipe data.
 * @property {function} onRecipePick - Callback for when a recipe is selected.
 */
interface RecipeListProps {
	recipes: BaseRecipe[] | FavoriteRecipe[];
	loadMoreData: () => void;
	isFetchingNextPage: boolean;
	isRefetching: boolean;
	refetch: () => void;
	onRecipePick: (id: number, name: string) => void;
}

/**
 * RecipesList renders a list of recipes in a 2-column grid, handling pagination, refreshing, and empty states.
 *
 * @param {RecipeListProps} props - The props for the RecipesList component.
 * @returns {JSX.Element} The rendered list of recipes.
 */
export const RecipesList = ({
	recipes,
	loadMoreData,
	isFetchingNextPage,
	isRefetching,
	refetch,
	onRecipePick,
}: RecipeListProps): JSX.Element => {
	const { colors } = useTheme();

	// Format the data for display in the grid, ensuring proper layout for empty items
	const formattedData = useMemo(() => formatData(recipes), [recipes]);

	/**
	 * Render individual recipe frames in the grid.
	 */
	const renderItem = useCallback(
		({ item, index }: any) => (
			<RenderRecipeFrame item={item} index={index} totalItems={formattedData.length} onRecipePick={onRecipePick} />
		),
		[formattedData.length, onRecipePick],
	);

	/**
	 * Key extractor to uniquely identify each recipe in the list.
	 */
	const keyExtractor = useCallback((item: BaseRecipe, index: number) => item.id?.toString() || index.toString(), []);

	return (
		<FlatList
			data={formattedData}
			renderItem={renderItem}
			keyExtractor={keyExtractor}
			showsVerticalScrollIndicator={false}
			ListEmptyComponent={
				<Text variant='titleSmall' style={Styles.textCenter}>
					No recipes available.
				</Text>
			}
			ListFooterComponent={isFetchingNextPage ? <ActivityIndicator size='small' style={Styles.mt_md} /> : null}
			ListFooterComponentStyle={Styles.pb_xl}
			numColumns={COLUMN_COUNT}
			onEndReached={loadMoreData}
			onEndReachedThreshold={0.5}
			overScrollMode='never'
			refreshControl={
				<RefreshControl
					refreshing={isRefetching}
					onRefresh={refetch}
					colors={[colors.onSecondaryContainer]}
					progressBackgroundColor={colors.secondaryContainer}
				/>
			}
		/>
	);
};
