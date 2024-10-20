// DrawerComponents.tsx

import { Strings } from '@/lib/constants';
import { Styles } from '@/lib/ui';
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Asset } from 'expo-asset';
import { ImageBackground } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Divider, Icon, Text, useTheme } from 'react-native-paper';

const BANNER_IMAGE = require('@/assets/images/dish-8723519_1920-min.jpg');

/**
 * CustomDrawerContent component for displaying a custom drawer layout.
 * Includes a banner with a gradient, drawer navigation items, and a settings button.
 *
 * @param {DrawerContentComponentProps & { openBottomSheet: () => void }} props - Drawer props and a function to open the bottom sheet.
 * @returns {JSX.Element} - The custom drawer content component.
 */
const CustomDrawerContent = (props: DrawerContentComponentProps & { openBottomSheet: () => void }): JSX.Element => {
	const { colors } = useTheme();
	const { state, navigation, descriptors, openBottomSheet } = props;

	// Memoize the banner image URI to avoid recalculating it on every render
	const bannerImage = useMemo(() => Asset.fromModule(BANNER_IMAGE).uri, []);

	// Memoize the drawer items to improve performance by preventing unnecessary re-renders
	const drawerItems = useMemo(
		() =>
			state.routes.map((route: any, index: number) => (
				<DrawerItem
					key={route.key} // Use route key for unique identification
					label={route.name} // Use the route's name as the drawer item label
					icon={descriptors[route.key].options.drawerIcon} // Set the icon from drawer options
					focused={state.index === index} // Highlight the item if it's the focused route
					activeTintColor={colors.onSecondaryContainer} // Color for active item text
					activeBackgroundColor={colors.secondaryContainer} // Background color for active item
					inactiveTintColor={colors.secondary} // Color for inactive item text
					onPress={() => navigation.navigate(route.name)} // Navigate to the route when pressed
				/>
			)),
		[state, navigation, descriptors, colors], // Dependencies to re-memoize when changed
	);

	return (
		<>
			{/* Banner image section with gradient overlay */}
			<View style={{ maxHeight: 230, height: '100%' }}>
				<ImageBackground source={{ uri: bannerImage }} style={Styles.flex_1}>
					<LinearGradient
						style={[Styles.absolute_fill, Styles.centered_view]}
						colors={['transparent', colors.secondaryContainer]}
					>
						<Text
							variant='displayMedium'
							style={[Styles.textBold, { letterSpacing: -2, color: colors.onSecondaryContainer }]}
						>
							{Strings.app_title.toUpperCase()}
						</Text>
					</LinearGradient>
				</ImageBackground>
			</View>

			{/* Scrollable section for the drawer items */}
			<DrawerContentScrollView contentContainerStyle={Styles.pt_md} {...props}>
				{drawerItems} {/* Render the memoized drawer items */}
			</DrawerContentScrollView>

			{/* Bottom section with a settings button */}
			<View style={Styles.pb_xs}>
				<Divider />
				<DrawerItem
					label='Settings' // Label for the settings button
					icon={({ color, size }) => <Icon source='cog' color={color} size={size} />} // Settings icon
					onPress={() => {
						openBottomSheet(); // Open the bottom sheet when settings is pressed
						navigation.closeDrawer(); // Close the drawer
					}}
					activeTintColor={colors.primary} // Active text color
					inactiveTintColor={colors.onSurfaceVariant} // Inactive text color
					activeBackgroundColor={colors.secondaryContainer} // Background color for active state
					inactiveBackgroundColor='transparent' // No background color when inactive
				/>
			</View>
		</>
	);
};

export default React.memo(CustomDrawerContent);
