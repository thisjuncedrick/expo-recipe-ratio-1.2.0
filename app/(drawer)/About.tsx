import { Container } from '@/lib/components';
import { Strings } from '@/lib/constants';
import { Styles } from '@/lib/ui';
import { Asset } from 'expo-asset';
import * as WebBrowser from 'expo-web-browser';
import { Image, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { Text, useTheme } from 'react-native-paper';

/**
 * @typedef {Object} Credits
 * @property {string} name - The name of the contributor.
 * @property {string} social - The social media link of the contributor.
 * @property {string} contribution - The role or contribution of the contributor.
 */
type Credits = {
	name: string;
	social: string;
	contribution: string;
};

/** @type {Credits[]} - List of team members involved in the project. */
const TEAM: Credits[] = [
	{
		name: 'Lance Christian S. Caisip',
		social: 'https://m.facebook.com/lance.caisip.12',
		contribution: 'Researcher',
	},
	{
		name: 'NAME 1',
		social: 'https://facebook.com/',
		contribution: 'Researcher',
	},
	{
		name: 'NAME 1',
		social: 'https://facebook.com/',
		contribution: 'Researcher',
	},
	{
		name: 'Erl Xander G. Labung',
		social: 'https://m.facebook.com/erlxander.labung',
		contribution: 'Capstone Adviser',
	},
];

/** @type {Credits[]} - List of individuals or organizations credited for specific assets or resources. */
const THANKS: Credits[] = [
	{
		name: 'floraphonic',
		social: 'https://pixabay.com/users/38928062/',
		contribution: 'For the sound effects',
	},
	{
		name: 'Vu_Pham',
		social: 'https://pixabay.com/users/vu_pham-23678517/',
		contribution: 'For the banner image',
	},
];

/**
 * CreditsPanel Component
 *
 * Displays a list of contributors with their names, roles, and links to social media profiles.
 *
 * @param {Object} props - The component props.
 * @param {Credits[]} props.names - Array of contributor objects.
 * @param {string} props.title - The title to display for the group of contributors.
 * @returns {JSX.Element} - The rendered CreditsPanel component.
 */
const CreditsPanel = ({ names, title }: { names: Credits[]; title: string }): JSX.Element => {
	const { colors } = useTheme();

	/**
	 * Opens the provided URL in the browser.
	 *
	 * @param {string} link - The URL to open.
	 * @returns {Promise<void>} - A promise that resolves when the browser is opened.
	 */
	const _handlePressButtonAsync = async (link: string): Promise<void> => {
		await WebBrowser.openBrowserAsync(link);
	};

	return (
		<View style={Styles.mb_md}>
			<Text variant='titleMedium' style={[Styles.mb_md, Styles.textCenter, { color: colors.primary }]}>
				{title}
			</Text>
			{names.map((team: Credits, i) => (
				<View key={i} style={[Styles.mb_sm, Styles.centered_view]}>
					<TouchableOpacity onPress={() => _handlePressButtonAsync(team.social)}>
						<Text
							variant='bodyMedium'
							style={[Styles.textBold, Styles.textCenter, { textDecorationLine: 'underline' }]}
						>
							{team.name}
						</Text>
					</TouchableOpacity>
					<Text style={Styles.textCenter}>{team.contribution}</Text>
				</View>
			))}
		</View>
	);
};

/**
 * About Component
 *
 * Displays information about the application, including the app icon, title, version, and a list of contributors.
 *
 * @returns {JSX.Element} - The rendered About component.
 */
const About = (): JSX.Element => {
	const { colors } = useTheme();

	// Load the app icon from Asset as a URI for rendering.
	const APP_ICON = Asset.fromModule(require('@/assets/images/icon.png')).uri;

	return (
		<Container>
			<GestureHandlerRootView>
				<ScrollView overScrollMode='never'>
					<View style={[Styles.pv_md, Styles.centered_view]}>
						<View style={[Styles.hide_excess, Styles.rounded_sm, Styles.mb_md, { height: 100, width: 100 }]}>
							<Image source={{ uri: APP_ICON }} style={Styles.h_full} />
						</View>
						<Text
							variant='headlineMedium'
							style={[Styles.textBold, { color: colors.primary, letterSpacing: -1 }]}
						>
							{Strings.app_title.toUpperCase()}
						</Text>
						<Text style={[Styles.textItalic, { color: colors.secondary }]}>{Strings.version}</Text>
						<View style={Styles.mt_lg}>
							<CreditsPanel title={Strings.created} names={TEAM} />
							{/* TODO Might Remove */}
							{/* <CreditsPanel title={Strings.credits} names={THANKS} /> */}
						</View>
					</View>
				</ScrollView>
			</GestureHandlerRootView>
		</Container>
	);
};

export default About;
