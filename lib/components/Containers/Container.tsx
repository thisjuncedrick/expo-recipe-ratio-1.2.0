// Container.tsx

import React, { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Styles } from '../../ui';

/**
 * Props for the Container component.
 * @typedef {Object} ContainerProp
 * @property {ReactNode} children - The content to be displayed inside the container.
 * @property {boolean} [centered=false] - If true, centers the content within the container.
 * @property {ViewStyle[] | ViewStyle} [styles] - Optional custom styles to be applied to the container.
 */
interface ContainerProp {
	children: ReactNode;
	centered?: boolean;
	styles?: ViewStyle[] | ViewStyle;
}

/**
 * A reusable container component that wraps children with optional styling and theming.
 * It can optionally center the content and applies the theme's background color.
 *
 * @param {ContainerProp} props - The props for the Container component.
 * @returns {JSX.Element} - The container component with applied styles.
 */
export const Container = ({ children, centered = false, styles }: ContainerProp): JSX.Element => {
	// Get the theme's colors from react-native-paper
	const { colors } = useTheme();

	return (
		<View
			style={[
				Styles.h_full, // Full height style from external Styles
				{ backgroundColor: colors.background }, // Apply background color from the theme
				centered && Styles.centered_view, // Conditionally apply centered view style
				styles, // Apply any additional styles passed as props
			]}
		>
			{children}
		</View>
	);
};
