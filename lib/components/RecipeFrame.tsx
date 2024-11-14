// RecipeFrame.tsx

import { getItemMargins, isValidUrl } from '@/lib/constants';
import { Styles } from '@/lib/ui';
import { Asset } from 'expo-asset';
import { Image } from 'expo-image';
import React, { useCallback, useMemo } from 'react';
import { Dimensions, TouchableOpacity, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

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
	onRecipePick: (id: number, name: string, video: string) => void;
}

/**
 * RecipeFrame is a memoized component that renders individual recipe frames.
 * It displays a recipe image and title or an empty space if the item is empty.
 *
 * @param {RecipeFrameProps} props - The props for the RecipeFrame component.
 * @returns {JSX.Element} The rendered frame for a recipe or an empty space.
 */
export const RecipeFrame = React.memo(({ item, index, totalItems, onRecipePick }: RecipeFrameProps) => {
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
		onRecipePick(item.id | item.recipe_id, item.name, item.video_tutorial);
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
