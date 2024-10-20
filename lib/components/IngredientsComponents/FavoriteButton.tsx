// FavoriteButton.tsx

import { useRef } from 'react';
import { Animated, TouchableOpacity } from 'react-native';
import { Icon, useTheme } from 'react-native-paper';

/**
 * Props for the FavoriteButton component.
 * @typedef {Object} FavoriteButtonProps
 * @property {boolean} isFavorite - Determines if the button is in the "favorite" state (true if favorited).
 * @property {() => void} onToggleFavorite - Callback function to toggle the favorite state.
 */
interface FavoriteButtonProps {
	isFavorite: boolean;
	onToggleFavorite: () => void;
}

/**
 * FavoriteButton component allows users to toggle between "favorite" and "not favorite" states.
 * It includes an animation on press for a scaling effect.
 *
 * @param {FavoriteButtonProps} props - The props for the FavoriteButton component.
 * @returns {JSX.Element} - The favorite button with scaling animation.
 */
export const FavoriteButton = ({ isFavorite, onToggleFavorite }: FavoriteButtonProps): JSX.Element => {
	// Access theme colors from react-native-paper
	const { colors } = useTheme();

	// Ref for handling scale animation (starts at scale 1)
	const scaleAnim = useRef(new Animated.Value(1)).current;

	/**
	 * Handles the press-in action for the button, shrinking it.
	 */
	const handlePressIn = () => {
		Animated.spring(scaleAnim, {
			toValue: 0.5, // Scale down to 50%
			useNativeDriver: true, // Use native driver for better performance3
		}).start();
	};

	/**
	 * Handles the press-out action for the button, returning it to normal size.
	 */
	const handlePressOut = () => {
		Animated.spring(scaleAnim, {
			toValue: 1, // Return to normal size
			friction: 3, // Adds some resistance to the animation
			tension: 20, // Controls the speed of the bounce
			useNativeDriver: true,
		}).start();
	};

	return (
		<TouchableOpacity
			activeOpacity={1} // Disable opacity change on press
			onPress={onToggleFavorite} // Toggle favorite state on press
			onPressIn={handlePressIn} // Start scale-down animation on press-in
			onPressOut={handlePressOut} // Return to normal size on press-out
		>
			<Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
				<Icon
					source={isFavorite ? 'bookmark-check' : 'bookmark-minus'} // Check or minus bookmark icon
					size={30}
					color={isFavorite ? colors.primary : colors.surfaceVariant} // Change color based on favorite state
				/>
			</Animated.View>
		</TouchableOpacity>
	);
};
