import { StyleSheet, ViewStyle } from 'react-native';

// Define spacing constants
const constant = {
	0: 0,
	xs: 5,
	sm: 10,
	md: 18,
	lg: 30,
	xl: 40,
} as const;

// Create a union type for the spacing keys
type SpacingKeys = keyof typeof constant;

// Define a type for all possible styles
type Styles = {
	[key in
		| `p_${SpacingKeys}`
		| `ph_${SpacingKeys}`
		| `pv_${SpacingKeys}`
		| `pt_${SpacingKeys}`
		| `pr_${SpacingKeys}`
		| `pb_${SpacingKeys}`
		| `pl_${SpacingKeys}`
		| `m_${SpacingKeys}`
		| `mh_${SpacingKeys}`
		| `mv_${SpacingKeys}`
		| `mt_${SpacingKeys}`
		| `mr_${SpacingKeys}`
		| `mb_${SpacingKeys}`
		| `ml_${SpacingKeys}`
		| `rounded_${SpacingKeys}`]: ViewStyle;
};

// Create spacing styles dynamically
const spacingStyles = Object.keys(constant).reduce<Styles>((acc, key) => {
	const k = key as SpacingKeys;
	acc[`p_${k}`] = { padding: constant[k] };
	acc[`ph_${k}`] = { paddingHorizontal: constant[k] };
	acc[`pv_${k}`] = { paddingVertical: constant[k] };
	acc[`pt_${k}`] = { paddingTop: constant[k] };
	acc[`pr_${k}`] = { paddingRight: constant[k] };
	acc[`pb_${k}`] = { paddingBottom: constant[k] };
	acc[`pl_${k}`] = { paddingLeft: constant[k] };

	acc[`m_${k}`] = { margin: constant[k] };
	acc[`mh_${k}`] = { marginHorizontal: constant[k] };
	acc[`mv_${k}`] = { marginVertical: constant[k] };
	acc[`mt_${k}`] = { marginTop: constant[k] };
	acc[`mr_${k}`] = { marginRight: constant[k] };
	acc[`mb_${k}`] = { marginBottom: constant[k] };
	acc[`ml_${k}`] = { marginLeft: constant[k] };

	acc[`rounded_${k}`] = { borderRadius: constant[k] };

	return acc;
}, {} as Styles);

// Define base styles
const BaseStyle = StyleSheet.create({
	flex: { display: 'flex' },
	flex_1: { flex: 1 },
	flex_shrink: { flexShrink: 1 },
	flex_row: { flexDirection: 'row' },
	flex_col: { flexDirection: 'column' },
	items_center: { alignItems: 'center' },
	justify_center: { justifyContent: 'center' },
	justify_end: { justifyContent: 'flex-end' },
	between: { justifyContent: 'space-between' },
	absolute: { position: 'absolute' },
	relative: { position: 'relative' },
	z_1: { zIndex: 1 },
	z_2: { zIndex: 2 },
	z_3: { zIndex: 3 },
	z_4: { zIndex: 4 },
	z_5: { zIndex: 5 },
	hide_excess: { overflow: 'hidden' },
	textBold: { fontWeight: 'bold' },
	textNormal: { fontWeight: 'thin' },
	textItalic: { fontStyle: 'italic' },
	textCenter: { textAlign: 'center' },
	w_full: { width: '100%' },
	h_full: { height: '100%' },
	relative_fill: { position: 'relative', top: 0, left: 0, bottom: 0, right: 0 },
	mh_auto: { marginHorizontal: 'auto' },
	mv_auto: { marginVertical: 'auto' },
	unround_bottom: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
	unround_top: { borderTopRightRadius: 0, borderTopLeftRadius: 0 },
	bgc: { backgroundColor: 'red' },
	bgc2: { backgroundColor: 'green' },
	bgc3: { backgroundColor: 'yellow' },
});

// Combine all styles into one export
export const Styles = StyleSheet.create({
	...BaseStyle,
	...spacingStyles,
	centered_view: { ...BaseStyle.flex, ...BaseStyle.items_center, ...BaseStyle.justify_center },
	flex_wide: {
		...BaseStyle.flex,
		...BaseStyle.items_center,
		...BaseStyle.between,
		...BaseStyle.flex_row,
	},
	absolute_fill: StyleSheet.absoluteFillObject,
});
