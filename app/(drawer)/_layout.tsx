import { SettingsSheet } from '@/lib/components';
import DrawerComponents from '@/lib/components/Containers/DrawerComponents';
import { Strings } from '@/lib/constants';
import { Styles } from '@/lib/ui';
import { DrawerHeaderProps } from '@react-navigation/drawer';
import { Drawer } from 'expo-router/drawer';
import React, { ReactNode, useCallback, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Appbar, Icon, useTheme } from 'react-native-paper';

/**
 * AppHeader Component
 *
 * Renders a custom app header for the drawer navigation.
 *
 * @param {Object} props - Component props.
 * @param {DrawerHeaderProps} props.props - The drawer header properties.
 * @param {ReactNode} props.children - The children components to be rendered inside the header.
 * @returns {JSX.Element} - The rendered AppHeader component.
 */
const AppHeader = ({ props, children }: { props: DrawerHeaderProps; children: ReactNode }): JSX.Element => {
	const { colors } = useTheme();

	// Change header style if not on the home screen.
	const headerStyle = props.route.name === Strings.home_label ? {} : { backgroundColor: colors.elevation.level2 };

	return (
		<Appbar.Header style={headerStyle}>
			<Appbar.Action icon='menu' size={25} style={Styles.mr_md} onPress={props.navigation.openDrawer} />
			{children}
		</Appbar.Header>
	);
};

/**
 * DrawerLayout Component
 *
 * Provides the layout for the app, including the drawer navigation and the bottom settings sheet.
 *
 * @returns {JSX.Element} - The rendered DrawerLayout component.
 */
const DrawerLayout = () => {
	const { colors } = useTheme();
	const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

	/**
	 * Opens the bottom sheet when triggered.
	 */
	const openBottomSheet = useCallback(() => {
		setIsBottomSheetVisible(true);
	}, []);

	/**
	 * Closes the bottom sheet when triggered.
	 */
	const closeBottomSheet = useCallback(() => {
		setIsBottomSheetVisible(false);
	}, []);

	return (
		<GestureHandlerRootView style={Styles.flex_1}>
			<Drawer
				initialRouteName='Home'
				screenOptions={{
					drawerStyle: { backgroundColor: colors.background },
					swipeEdgeWidth: 120,
					header(props: DrawerHeaderProps) {
						return (
							<AppHeader props={props}>
								<Appbar.Content title={props.route.name} />
							</AppHeader>
						);
					},
					drawerType: 'slide',
				}}
				drawerContent={(props) => <DrawerComponents {...props} openBottomSheet={openBottomSheet} />}
			>
				<Drawer.Screen
					name='Home'
					options={{
						title: Strings.home_label,
						drawerIcon(props) {
							return <Icon source='home' {...props} />;
						},
						header(props: DrawerHeaderProps) {
							return (
								<AppHeader props={props}>
									<Appbar.Content title={''} />
									<Appbar.Action
										icon='information'
										onPress={() => props.navigation.navigate(Strings.about_label)}
									/>
								</AppHeader>
							);
						},
					}}
				/>
				<Drawer.Screen
					name='Favorites'
					options={{
						title: Strings.favorites_label,
						drawerIcon(props) {
							return <Icon source='bookmark' {...props} />;
						},
					}}
				/>
				<Drawer.Screen
					name='About'
					options={{
						title: Strings.about_label,
						drawerIcon(props) {
							return <Icon source='information' {...props} />;
						},
					}}
				/>
			</Drawer>
			<SettingsSheet isVisible={isBottomSheetVisible} onClose={closeBottomSheet} />
		</GestureHandlerRootView>
	);
};

export default DrawerLayout;
