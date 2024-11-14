// BottomSheetContainer.tsx

import {
	BottomSheetBackdrop,
	BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetModalProvider,
	BottomSheetScrollView,
	useBottomSheetTimingConfigs,
} from '@gorhom/bottom-sheet';
import { BackdropPressBehavior } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import { useFocusEffect } from 'expo-router';
import React, { ReactNode, useCallback, useEffect, useMemo, useRef } from 'react';
import { BackHandler } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Easing } from 'react-native-reanimated';

/**
 * Props for the BottomSheetContainer.
 * @typedef {Object} SheetContainerProps
 * @property {boolean} isVisible - Controls the visibility of the bottom sheet.
 * @property {() => void} onClose - Callback to close the bottom sheet.
 */

export interface SheetContainerProps {
	isVisible: boolean;
	onClose: () => void;
}

interface BottomSheetContainer extends SheetContainerProps {
	backdropPress?: BackdropPressBehavior;
	children: ReactNode;
	panDownToClose?: boolean;
	showIndicator?: boolean;
	snapToIndex?: 0 | 1 | 2;
	flex?: number;
}

/**
 * A container component that wraps the BottomSheet modal functionality using the `@gorhom/bottom-sheet` library.
 * This component provides customizable backdrop behavior, indicator control, and the ability to handle hardware back press events.
 * It also automatically opens and closes based on the `isVisible` prop.
 *
 * @param {ReactNode} children - The content to display inside the bottom sheet.
 * @param {boolean} isVisible - A flag to determine whether the bottom sheet is visible or not.
 * @param {() => void} onClose - A callback function that gets called when the bottom sheet is closed.
 * @param {boolean} [showIndicator=true] - Determines whether the indicator handle on the bottom sheet is visible.
 * @param {boolean} [panDownToClose=false] - Enables or disables the ability to close the bottom sheet by swiping down.
 * @param {BackdropPressBehavior} [backdropPress='none'] - Defines the behavior when pressing the backdrop (e.g., close, none).
 *
 * @returns {JSX.Element} The rendered BottomSheetContainer component.
 */
export const BottomSheetContainer = ({
	children,
	isVisible,
	onClose,
	showIndicator = true,
	panDownToClose = false,
	backdropPress = 'none',
	snapToIndex = 0,
	flex = 0,
}: BottomSheetContainer) => {
	const { colors } = useTheme();
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const snapPoints = useMemo(() => ['35%', '50%', '70%'], []);

	/**
	 * Renders the backdrop component for the bottom sheet.
	 *
	 * @param props - The backdrop props.
	 * @returns A BottomSheetBackdrop component.
	 */
	const renderBackdrop = useCallback(
		(props: BottomSheetBackdropProps) => (
			<BottomSheetBackdrop
				{...props}
				style={props.style}
				appearsOnIndex={0}
				disappearsOnIndex={-1}
				pressBehavior={backdropPress}
				opacity={0.5}
			/>
		),
		[],
	);

	/**
	 * Handles changes in the bottom sheet's state.
	 *
	 * @param index - The index of the bottom sheet's state.
	 */
	const handleSheetChanges = useCallback(
		(index: number) => {
			if (index === -1) {
				onClose();
			}
		},
		[onClose],
	);

	// Effect to present or dismiss the bottom sheet based on visibility (`isVisible`)
	useEffect(() => {
		if (isVisible) {
			bottomSheetModalRef.current?.present();
		} else {
			bottomSheetModalRef.current?.dismiss();
		}
	}, [isVisible]);

	// Handle hardware back button press
	useFocusEffect(
		useCallback(() => {
			const onBackPress = () => {
				if (isVisible && bottomSheetModalRef && 'current' in bottomSheetModalRef) {
					bottomSheetModalRef.current?.close();
					return true; // Handle back press to close the bottom sheet when visible
				}
				return;
			};

			BackHandler.addEventListener('hardwareBackPress', onBackPress);

			return () => {
				BackHandler.removeEventListener('hardwareBackPress', onBackPress);
			};
		}, [isVisible, bottomSheetModalRef]),
	);

	return (
		<BottomSheetModalProvider>
			<BottomSheetModal
				backgroundStyle={{ backgroundColor: colors.elevation.level1 }}
				handleIndicatorStyle={{
					display: showIndicator ? undefined : 'none',
					backgroundColor: colors.surfaceVariant,
					width: '30%',
				}}
				backdropComponent={renderBackdrop}
				ref={bottomSheetModalRef}
				index={snapToIndex}
				snapPoints={snapPoints}
				enablePanDownToClose={panDownToClose}
				onChange={handleSheetChanges}
				animationConfigs={useBottomSheetTimingConfigs({
					duration: 250,
					easing: Easing.linear,
				})}
				keyboardBlurBehavior='restore'
			>
				<BottomSheetScrollView contentContainerStyle={{ flex: flex }}>{children}</BottomSheetScrollView>
			</BottomSheetModal>
		</BottomSheetModalProvider>
	);
};
