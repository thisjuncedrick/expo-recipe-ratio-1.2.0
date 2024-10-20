import { useState } from "react";

export const useServingsCounter = () => {
	const [servings, setServings] = useState<number>(1); // Holds the final valid value
	const [inputValue, setInputValue] = useState<string>(servings.toString()); // Tracks user input

	// Validates and sets the cleaned value
	const validateAndSetServings = () => {
		const cleanedValue = inputValue.replace(/[^0-9]/g, "");
		const servingsCount = cleanedValue && Number(cleanedValue) !== 0 ? Number(Number(cleanedValue).toString()) : 1;
		setServings(servingsCount);
		setInputValue(servingsCount.toString());
	};

	return { servings, inputValue, setInputValue, validateAndSetServings };
};
