import { Container } from '@/lib/components/Containers/Container';
import { Strings } from '@/lib/constants';
import { Styles } from '@/lib/ui';
import { Asset } from 'expo-asset';
import { ImageBackground } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';

/**
 * Index screen component for the app's introductory screen.
 *
 * It displays a banner image with a gradient overlay and a call-to-action button
 * that navigates the user to the `Home` screen.
 *
 * @component
 * @returns {JSX.Element} The UI for the Welcome (index) screen.
 */
const Index = (): JSX.Element => {
	const { colors } = useTheme();
	const router = useRouter();

	// Load the app banner image.
	const APP_BANNER = Asset.fromModule(require('@/assets/images/dish-8723519_1920-min.jpg')).uri;

	/**
	 * Handle navigation to the home screen when the "Get Started" button is pressed.
	 */
	const handleHomeScreen = () => {
		router.replace({ pathname: '/(drawer)/Home' });
	};

	return (
		<>
			<Container>
				{/* Display a background image with a gradient overlay */}
				<View style={Styles.flex_1}>
					<ImageBackground style={Styles.h_full} source={{ uri: APP_BANNER }}>
						<LinearGradient
							colors={['transparent', colors.background]}
							locations={[0.5, 1]}
							style={Styles.h_full}
						/>
					</ImageBackground>
				</View>

				<View style={Styles.p_md}>
					{/* App header text */}
					<Text variant='headlineSmall' style={[Styles.textBold, { color: colors.primary }]}>
						{Strings.header}
					</Text>

					{/* Subheader text */}
					<Text variant='bodyLarge' style={Styles.mb_md}>
						{Strings.subheader}
					</Text>

					{/* CTA Button */}
					<Button
						mode='contained'
						onPress={handleHomeScreen}
						icon='chevron-right'
						contentStyle={{ flexDirection: 'row-reverse' }}
						uppercase={true}
					>
						{Strings.get_started}
					</Button>
				</View>
			</Container>
		</>
	);
};

export default Index;
