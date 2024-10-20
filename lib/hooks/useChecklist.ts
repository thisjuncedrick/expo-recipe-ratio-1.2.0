import { Ingredient } from '@/lib/types';
import { useCallback, useMemo, useState } from 'react';

interface ExtendedIngredients extends Ingredient {
	isCustom: boolean;
}

export const useCheckList = (ingredients: ExtendedIngredients[] | null, checkList: boolean) => {
	const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

	const toggleChecked = useCallback((index: number) => {
		setCheckedItems((prev) => ({
			...prev,
			[index]: !prev[index],
		}));
	}, []);

	const allChecked = useMemo(() => {
		if (!checkList || !ingredients) return true;
		return ingredients.every((_, index) => checkedItems[index]);
	}, [ingredients, checkedItems, checkList]);

	return { checkedItems, toggleChecked, allChecked };
};
