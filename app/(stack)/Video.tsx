import { useRecipeInfo } from '@/lib/api';
import { Container, ErrorDialog, FavoriteButton, LoadingDialog, RecipeImageBackdrop } from '@/lib/components';
import { extractYouTubeId, formatDate, isValidUrl, Strings } from '@/lib/constants';
import { useFavorites } from '@/lib/hooks';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import { Dimensions, View } from 'react-native';
import { Button, Paragraph, Surface, Text, useTheme } from 'react-native-paper';

import { RecipeIngredients } from '@/lib/types';
import { Styles } from '@/lib/ui';
import { Asset } from 'expo-asset';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
import YoutubeIframe from 'react-native-youtube-iframe';

// Constants
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
const PLACEHOLDER = Asset.fromModule(require('@/assets/images/blank_image_placeholder.png')).uri;

const ASPECT_RATIO = 16 / 9;
const VIDEO_WIDTH = SCREEN_WIDTH - Number(Styles.m_md.margin) * 4;
const VIDEO_HEIGHT = VIDEO_WIDTH / ASPECT_RATIO;

const Video = () => {
	const { recipeId, recipeName, fromFave } = useLocalSearchParams<{
		recipeId: string;
		recipeName: string;
		fromFave: string;
	}>();

	const router = useRouter();
	const { colors } = useTheme();
	const [imageUri, setImageUri] = useState('');
	const [videoId, setVideoId] = useState<string | null>('');

	// SQLite database instance
	const db = useSQLiteContext();

	// Fetch ingredients data from API
	const { data, isLoading, isRefetching, refetch, isError, error } = useRecipeInfo(recipeId);

	// Hook for managing the favorite status of the recipe
	const {
		isFavorite,
		dateFavorited,
		saveToFavorites,
		removeFromFavorites,
		isLoading: isCheckingIfFavorited,
		isError: favoriteError,
		error: faveErrorMessage,
	} = useFavorites(data as RecipeIngredients, db);

	useEffect(() => {
		if (data) {
			setImageUri(isValidUrl(data.cover_image) ? data.cover_image : PLACEHOLDER);
			setVideoId(extractYouTubeId(data.video_tutorial));
		}
	}, [data]);

	// Handle bookmark toggle between save and remove from favorites
	const handleBookmarkPress = () => {
		isFavorite ? removeFromFavorites() : saveToFavorites();
	};

	const handleTextGuide = () => {
		router.replace({
			pathname: '/(stack)/Ingredients',
			params: { recipeId: recipeId, recipeName: recipeName, fromFave: 'false' },
		});
	};

	return (
		<>
			{/* Loading indicator while data is being fetched */}
			<LoadingDialog visible={isLoading || isCheckingIfFavorited} />

			{/* Error dialog if fetching data or favorites status fails */}
			<ErrorDialog
				visible={isError || favoriteError}
				errorMessage={error?.message || faveErrorMessage || Strings.error_message}
				onRetry={refetch}
			/>
			<Container>
				{data ? (
					<ScrollView
						overScrollMode='never'
						contentContainerStyle={{ flexGrow: 1 }}
						refreshControl={
							<RefreshControl
								refreshing={isRefetching}
								onRefresh={refetch}
								colors={[colors.onSecondaryContainer]}
								progressBackgroundColor={colors.secondaryContainer}
							/>
						}
					>
						<RecipeImageBackdrop
							uri={imageUri}
							setToDefault={() => setImageUri(PLACEHOLDER)}
							height={SCREEN_HEIGHT / 2}
						/>

						<View style={Styles.flex_1}>
							<Surface
								style={[
									Styles.flex_1,
									Styles.mh_md,
									Styles.p_md,
									Styles.rounded_md,
									Styles.unround_bottom,
									{ marginTop: -1 * (SCREEN_HEIGHT / 8) },
								]}
							>
								<View style={[Styles.flex_wide, { alignItems: 'flex-start', columnGap: 25 }]}>
									<Text
										variant='titleLarge'
										style={[Styles.flex_shrink, Styles.mb_sm, { color: colors.primary }]}
									>
										{data.name}
									</Text>
									<FavoriteButton isFavorite={isFavorite} onToggleFavorite={handleBookmarkPress} />
								</View>

								{/* Recipe description */}
								<View
									style={[
										Styles.pl_sm,
										Styles.pv_xs,
										Styles.mb_sm,
										{ borderLeftWidth: 2, borderLeftColor: colors.primary, maxWidth: '85%' },
									]}
								>
									<Paragraph style={{ color: colors.onSurfaceVariant, textAlign: 'justify' }}>
										{data.description}
									</Paragraph>
								</View>

								{/* Display favorited date if applicable */}
								{isFavorite && dateFavorited ? <Text>Date Favorited: {formatDate(dateFavorited)}</Text> : null}

								<View style={Styles.mt_md}>
									{videoId ? (
										<YoutubeIframe height={VIDEO_HEIGHT} width={VIDEO_WIDTH} videoId={videoId} />
									) : (
										<>
											<Text
												variant='titleMedium'
												style={[Styles.textCenter, Styles.mb_sm, { color: colors.error }]}
											>
												Video is unavailable
											</Text>
											<Button mode='text' onPress={handleTextGuide}>
												Proceed to {Strings.text_guide_btn}?
											</Button>
										</>
									)}
								</View>
							</Surface>
						</View>
					</ScrollView>
				) : null}
			</Container>
		</>
	);
};

export default Video;
