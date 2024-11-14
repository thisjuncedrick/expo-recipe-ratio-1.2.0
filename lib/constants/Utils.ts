import { Styles } from '../ui';

//! Capitalizes first letter of each word.
export const formatText = (ingredient: string): string => {
	return ingredient.replace(/\b[a-z]/g, function (char) {
		return char.toUpperCase();
	});
};

//! Checks if url is valid
export const isValidUrl = (url: string) => {
	return url.startsWith('http') || url.startsWith('https');
};

//! Format plain timestamp to readable date and time
export const formatDate = (timestamp: string) => {
	// Create a Date object from the input string
	const date = new Date(timestamp);

	// Format the date as MM/DD/YYYY
	const formattedDate = date.toLocaleDateString('en-US');

	// Format the time as hh:mm AM/PM
	const formattedTime = date.toLocaleTimeString('en-US', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: true,
	});

	// Combine both date and time with the required format
	return `${formattedDate} | ${formattedTime}`;
};

//! Function to get the current item's required margin in the grid.
export const getItemMargins = (index: number, totalItems: number, margin: number = Number(Styles.m_xs.margin)) => {
	const isLeftColumn = index % 2 === 0;
	const isFirstRow = index < 2;
	const isLastRow = index >= totalItems - 2;

	const top = isFirstRow ? 0 : margin;
	const right = isLeftColumn ? margin : 0;
	const bottom = isLastRow ? 0 : margin;
	const left = isLeftColumn ? 0 : margin;

	return { marginTop: top, marginRight: right, marginBottom: bottom, marginLeft: left };
};

//! Evenize data to have equal column
// Credits: https://www.youtube.com/watch?v=kukrkdk30g4
export const formatData = (data: any, numColumns: number = 2) => {
	const totalRows = Math.floor(data.length / numColumns);
	let totalLastRows = data.length - totalRows * numColumns;

	while (totalLastRows !== 0 && totalLastRows !== numColumns) {
		data.push({ key: 'blank', empty: true });
		totalLastRows++;
	}
	return data;
};

export const calculateQuantity = (quantity: string, servings: number) => {
	const numericQuantity = parseFloat(quantity);
	if (isNaN(numericQuantity)) return quantity;
	return (numericQuantity * servings).toLocaleString();
};

export const formatTime = (totalSeconds: number): string => {
	const days = Math.floor(totalSeconds / (3600 * 24));
	const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	return [
		days.toString().padStart(2, '0'),
		hours.toString().padStart(2, '0'),
		minutes.toString().padStart(2, '0'),
		seconds.toString().padStart(2, '0'),
	].join(':');
};
export function validateIntegerInput(input: string): number | null {
	// Regular expression to match only positive integers
	const positiveIntegerRegex = /^\d+$/;

	// Check if the input matches the positive integer regex
	if (!positiveIntegerRegex.test(input)) {
		return null; // Invalid input, not a positive integer
	}

	// Parse the input as an integer
	const intValue = parseInt(input);

	// Ensure the value is positive
	if (intValue < 0) {
		return null; // Invalid input, negative value
	}

	// Check if the parsed value is within the allowed range
	if (intValue > 59) {
		return 59; // Return the maximum value
	}

	return intValue; // Valid positive integer within the range
}

export const extractYouTubeId = (url: string): string | null => {
	const regex =
		/(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|v\/|embed\/|oembed\?url=http.*v%3D)|youtu\.be\/)([\w-]{11})(?:&|\?|$)/;
	const match = url.match(regex);
	return match ? match[1] : null;
};
