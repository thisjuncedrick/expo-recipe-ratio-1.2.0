// Timer.tsx

import { BottomSheetContainer, SheetContainerProps } from '@/lib/components/BottomSheets/BottomSheetContainer';
import { SetTimer, TimerContext, Timer as TimerScreen } from '@/lib/components/Directions';
import { Styles } from '@/lib/ui';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';

const Tab = createMaterialTopTabNavigator();

interface TimerSheetProps extends SheetContainerProps {
	/** Total duration for the timer in seconds. */
	totalSeconds: number;
}

/**
 * A component that displays a timer interface within a bottom sheet.
 * It provides options to view and set a timer using tab navigation.
 *
 * @param {TimerSheetProps} props - The props for the Timer component.
 * @returns {JSX.Element} - The timer component within a bottom sheet.
 */
export const Timer = ({ isVisible, onClose, totalSeconds }: TimerSheetProps): JSX.Element => {
	const { colors } = useTheme();
	const [isRunning, setIsRunning] = useState(false);

	const handleBottomSheetClose = useCallback(() => {
		onClose();
	}, [onClose]);

	return (
		<BottomSheetContainer
			isVisible={isVisible}
			onClose={handleBottomSheetClose}
			showIndicator={false}
			snapToIndex={2}
		>
			<TimerContext.Provider value={{ isRunning, setIsRunning }}>
				<View style={[Styles.flex_1, { width: '100%' }]}>
					<Tab.Navigator
						screenOptions={{
							tabBarActiveTintColor: colors.primary,
							tabBarInactiveTintColor: colors.surfaceVariant,
							tabBarStyle: { backgroundColor: colors.elevation.level1 },
							tabBarIndicatorStyle: { backgroundColor: colors.primary },
						}}
						screenListeners={{
							tabPress: (e) => {
								if (isRunning) {
									// Prevent tab switch if timer is running
									e.preventDefault();
								}
							},
						}}
					>
						<Tab.Screen name='Timer' component={TimerScreen} initialParams={{ totalSeconds }} />
						<Tab.Screen name='Set Timer' component={SetTimer} />
					</Tab.Navigator>
				</View>
			</TimerContext.Provider>
		</BottomSheetContainer>
	);
};
