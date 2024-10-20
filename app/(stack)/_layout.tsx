import { Styles } from '@/lib/ui';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Appbar, useTheme } from 'react-native-paper';

const AppHeader = (props: NativeStackHeaderProps) => {
	const { colors } = useTheme();
	const isTransparent = props.options.headerTransparent;

	const headerStyle = !isTransparent
		? { backgroundColor: colors.elevation.level2 }
		: { backgroundColor: 'transparent' };

	return (
		<Appbar.Header style={headerStyle}>
			<Appbar.BackAction onPress={() => props.navigation.goBack()} style={Styles.mr_md} />
			<Appbar.Content title={props.options.title || props.route.name} />
		</Appbar.Header>
	);
};

const StackLayout = () => {
	const client = new QueryClient();
	return (
		<QueryClientProvider client={client}>
			<GestureHandlerRootView>
				<Stack
					screenOptions={{
						animation: 'ios',
						header(props) {
							return <AppHeader {...props} />;
						},
					}}
					initialRouteName='Recipes'
				>
					<Stack.Screen name='Recipes' />
					<Stack.Screen name='Ingredients' options={{ headerTransparent: true, title: ' ' }} />
					<Stack.Screen name='Directions' />
				</Stack>
			</GestureHandlerRootView>
		</QueryClientProvider>
	);
};

export default StackLayout;
