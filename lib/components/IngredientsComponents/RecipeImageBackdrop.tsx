// RecipeImageBackdrop.tsx

import { Styles } from '@/lib/ui';
import { ImageBackground } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { useTheme } from 'react-native-paper';

interface RecipeImageBackdropProps {
	uri: string;
	setToDefault: () => void;
	height: number;
	locations?: number[];
}

/**
 * A component to render the recipe image with a gradient backdrop.
 *
 * @param {RecipeImageBackdropProps} props - The props for the component.
 * @param {string} props.uri - The URI for the image to display.
 * @param {() => void} props.setToDefault - Function to call if loading the image fails.
 * @param {number} props.height - Height of the backdrop.
 * @param {number[]} [props.locations=[0.5, 1]] - Gradient location stops for the linear gradient.
 * @returns {JSX.Element} - The recipe image backdrop component.
 */
export const RecipeImageBackdrop = ({
	uri,
	setToDefault,
	height,
	locations = [0.5, 1],
}: RecipeImageBackdropProps): JSX.Element => {
	const { colors } = useTheme();

	return (
		<ImageBackground
			source={{ uri: uri }}
			onError={setToDefault}
			contentFit='cover'
			contentPosition='center'
			style={[{ height: height }]}
			transition={200}
			cachePolicy='memory-disk'
		>
			<LinearGradient style={Styles.flex_1} colors={['transparent', colors.background]} locations={locations} />
		</ImageBackground>
	);
};
