// DirectionsSlide.tsx

import { TimerSheet } from '@/lib/components/BottomSheets';
import { Strings } from '@/lib/constants';
import { Direction } from '@/lib/types';
import { Styles } from '@/lib/ui';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, View } from 'react-native';
import { Button, Card, Divider, IconButton, Paragraph, Text, useTheme } from 'react-native-paper';
import Swiper from 'react-native-swiper';

// Constants
const { height, width } = Dimensions.get('window');
const SLIDE_WIDTH = width * 0.8;
const MIN_HEIGHT = height / 2.5;

/**
 * Props for the DirectionsSlidesProps component.
 * @interface DirectionsSlidesProps
 * @property {Direction[]} directions - Array consisting the timer and instructions of a recipe.
 * @property {string} fromFavorites - A "boolean" that checks whether it come from Favorites screen or Recipes screen.
 */
interface DirectionsSlidesProps {
	directions: Direction[];
	fromFavorites: string;
}

/**
 * Component for displaying a series of recipe directions as slides.
 * Each slide shows the description and optionally a timer button for timed steps.
 *
 * @param {DirectionsSlidesProps} props - The properties object.
 * @param {Direction[]} props.directions - Array of recipe directions, each with a description and optional duration.
 * @param {string} props.fromFavorites - Indicates whether the recipe is from the user's favorites.
 * @returns {JSX.Element} The UI for the directions slides.
 */
export const DirectionsSlides = ({ directions, fromFavorites }: DirectionsSlidesProps) => {
	const { colors } = useTheme();
	const router = useRouter();
	const [timerSeconds, setTimerSeconds] = useState<number>(0);
	const [isTimerSheetVisible, setIsTimerSheetVisible] = useState<boolean>(false);

	/**
	 * Navigate back to the previous screen or dismiss the current view.
	 */
	const handlePickOther = () => {
		if (fromFavorites === 'true') {
			router.dismissAll();
			router.back();
		} else {
			router.dismissAll();
		}
	};

	/**
	 * Opens the bottom sheet for the timer.
	 */
	const openBottomSheet = () => {
		setIsTimerSheetVisible(true);
	};

	/**
	 * Closes the bottom sheet for the timer.
	 */
	const closeBottomSheet = () => {
		setIsTimerSheetVisible(false);
	};

	/**
	 * Starts the timer based on the provided duration and unit (e.g., min, hr).
	 *
	 * @param {number | null} duration - The duration for the timer.
	 * @param {string | null} unit - The time unit for the duration (e.g., sec, min, hr).
	 * @throws Will throw an error if an invalid time unit is provided.
	 */
	const startTimer = (duration: number | null, unit: string | null) => {
		let seconds = 0;
		switch (unit?.toLowerCase()) {
			case 'min':
				seconds = (duration || 0) * 60;
				break;
			case 'hr':
				seconds = (duration || 0) * 60 * 60;
				break;
			case 'day':
			case 'days':
				seconds = (duration || 0) * 60 * 60 * 24;
				break;
			case 'sec':
				seconds = duration || 0;
				break;
			default:
				throw new Error('Invalid unit: ' + unit);
		}

		setTimerSeconds(seconds);
		openBottomSheet();
	};

	// Map over the directions to generate slides for each step.
	const directionsSlide = directions.map((direction, i) => (
		<Card
			key={i}
			style={[
				Styles.p_md,
				Styles.flex,
				Styles.flex_col,
				Styles.justify_center,
				Styles.mh_auto,
				Styles.mv_auto,
				{ width: SLIDE_WIDTH, minHeight: MIN_HEIGHT },
			]}
		>
			<Card.Content>
				<Text style={[Styles.textCenter, { color: colors.secondary }]}>
					Step {i + 1} of {directions.length}
				</Text>
				<Divider style={Styles.mv_sm} bold />
				<Paragraph style={[Styles.mb_lg, { textAlign: 'justify', fontSize: 16 }]}>
					{direction.description}
				</Paragraph>

				{direction.duration && direction.duration_unit && (
					<Button mode='contained' onPress={() => startTimer(direction.duration, direction.duration_unit)}>
						Start Timer ({direction.duration} {direction.duration_unit})
					</Button>
				)}
			</Card.Content>
		</Card>
	));

	// Final slide prompting the user to pick anothe recipe
	const returnSlide = (
		<Card
			style={[
				Styles.p_md,
				Styles.flex,
				Styles.flex_col,
				Styles.justify_center,
				Styles.mh_auto,
				Styles.mv_auto,
				{ width: SLIDE_WIDTH, minHeight: MIN_HEIGHT },
			]}
		>
			<Card.Content>
				<Text variant='titleLarge' style={[Styles.textBold, { color: colors.primary }]}>
					{Strings.cook_again_header}
				</Text>
				<Text variant='bodyMedium' style={[Styles.textNormal, Styles.mb_md]}>
					{Strings.cook_again_subheader}
				</Text>
				<Button
					onPress={handlePickOther}
					mode='outlined'
					icon='chevron-right'
					contentStyle={{ flexDirection: 'row-reverse' }}
					labelStyle={Styles.textBold}
					uppercase
				>
					{Strings.cook_again_button}
				</Button>
			</Card.Content>
		</Card>
	);

	// All slides including the final slide prompt.
	const allSlides = [...directionsSlide, returnSlide];

	return (
		<>
			<View>
				<Swiper
					overScrollMode='never'
					showsButtons={true}
					loop={false}
					activeDotColor={colors.primary}
					dotColor={colors.surfaceDisabled}
					activeDotStyle={{ transform: [{ scale: 1.3 }] }}
					nextButton={<IconButton icon='chevron-right' iconColor={colors.onSurface} />}
					prevButton={<IconButton icon='chevron-left' iconColor={colors.onSurface} />}
				>
					{allSlides.map((slide, index) => (
						<React.Fragment key={`slide-wrapper-${index}`}>{slide}</React.Fragment>
					))}
				</Swiper>
			</View>

			{/* Timer bottom sheet displayed when a timer is started */}
			<TimerSheet isVisible={isTimerSheetVisible} onClose={closeBottomSheet} totalSeconds={timerSeconds} />
		</>
	);
};
