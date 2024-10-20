import { Container, DoubleBackExit } from '@/lib/components';
import { getItemMargins, Strings } from '@/lib/constants';
import { Styles } from '@/lib/ui';
import { FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { Dimensions, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Text, TouchableRipple, useTheme } from 'react-native-paper';

/** Constants */
const SCREEN_WIDTH = Dimensions.get('window').width;
const COLUMN_COUNT = 2;
const H_PADDING_SIZE = Number(Styles.p_lg.padding);
const ITEM_SIZE = (SCREEN_WIDTH - H_PADDING_SIZE * 2) / COLUMN_COUNT;

/**
 * Interface for meat item structure.
 * @typedef {Object} MeatItem
 * @property {string} label - The label of the meat item.
 * @property {string} icon - The name of the icon to be used.
 * @property {React.ComponentType<any>} iconPack - The icon pack component (e.g., MaterialCommunityIcons).
 */
interface MeatItem {
	label: string;
	icon: string;
	iconPack: React.ComponentType<any>;
}

/**
 * Home Screen component which allows users to pick a type of meat.
 * Displays a grid of meat items in a 2-column layout.
 *
 * @component
 * @returns {JSX.Element} The Home screen component.
 */
const Home = (): JSX.Element => {
	const { colors } = useTheme();
	const router = useRouter();

	/** Memoized meat types data */
	const MEAT_TYPES: MeatItem[] = useMemo(
		() => [
			{ label: 'Chicken', icon: 'food-drumstick', iconPack: MaterialCommunityIcons },
			{ label: 'Pork', icon: 'pig-variant', iconPack: MaterialCommunityIcons },
			{ label: 'Fish', icon: 'fish-fins', iconPack: FontAwesome6 },
			{ label: 'Beef', icon: 'cow', iconPack: FontAwesome6 },
		],
		[],
	);

	/** Callback to handle meat selection, proceed to next screen and pass the chosen meat type */
	const handlePickMeat = useCallback((meat: string) => {
		const param = meat.toLowerCase();
		router.push({ pathname: '/(stack)/Recipes', params: { meat: param } });
	}, []);

	/**
	 * RenderFrame component to render individual meat items.
	 * @param {Object} props - The properties for RenderFrame component.
	 * @param {MeatItem} props.item - The meat item to render.
	 * @param {number} props.index - The index of the item in the list.
	 * @param {number} props.totalItems - The total number of items in the list.
	 * @returns {JSX.Element} Rendered meat item frame.
	 */
	const RenderMeatFrame = React.memo(
		({ item, index, totalItems }: { item: MeatItem; index: number; totalItems: number }) => {
			const IconPack = item.iconPack;
			const gridMargins = getItemMargins(index, totalItems);

			return (
				<View
					style={[
						Styles.hide_excess,
						Styles.rounded_xs,
						Styles.flex_1,
						gridMargins,
						{
							height: ITEM_SIZE,
							backgroundColor: colors.elevation.level3,
							borderColor: colors.outlineVariant,
							borderWidth: 1,
						},
					]}
				>
					<TouchableRipple
						style={[Styles.flex_1, Styles.centered_view]}
						onPress={() => handlePickMeat(item.label)}
					>
						<View style={[Styles.centered_view, { rowGap: 10 }]}>
							<IconPack name={item.icon} size={35} color={colors.primary} />
							<Text variant='titleMedium'>{item.label}</Text>
						</View>
					</TouchableRipple>
				</View>
			);
		},
	);

	return (
		<>
			<DoubleBackExit />

			<Container styles={[Styles.justify_center]}>
				<View style={[Styles.absolute, Styles.w_full, { bottom: Number(Styles.m_md.margin) }]}>
					<Text style={[Styles.textCenter, { color: colors.surfaceVariant }]}>
						{Strings.app_title} v{Strings.version}
					</Text>
				</View>
				<View style={{ paddingHorizontal: H_PADDING_SIZE }}>
					<View style={Styles.mb_md}>
						<Text variant='displayMedium' style={[Styles.textBold, { color: colors.primary }]}>
							{Strings.pick_meat.split(' ').slice(0, 2).join(' ')}
						</Text>
						<Text
							variant='displayMedium'
							style={[Styles.textBold, { marginTop: -1 * Number(Styles.m_sm.margin) }]}
						>
							{Strings.pick_meat.split(' ').slice(-2).join(' ')}
						</Text>
					</View>

					<FlatList
						data={MEAT_TYPES}
						keyExtractor={(item, index) => index.toString()}
						renderItem={({ item, index }) => (
							<RenderMeatFrame item={item} index={index} totalItems={MEAT_TYPES.length} />
						)}
						numColumns={COLUMN_COUNT}
					/>
				</View>
			</Container>
		</>
	);
};

export default Home;
