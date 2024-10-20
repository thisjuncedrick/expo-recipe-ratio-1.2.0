import { CustomIngredient } from '@/lib/types';
import { SQLiteDatabase } from 'expo-sqlite';

export const fetchCustomIngredients = async (db: SQLiteDatabase, recipeId: string): Promise<CustomIngredient[]> => {
	try {
		const result = await db.getAllAsync(`SELECT * FROM Ingredients WHERE recipe_id = ?`, [recipeId]);

		if (result && result.length > 0) {
			return result.map((row: any) => ({
				id: row.id.toString(),
				isCustom: true,
				name: row.name,
				quantity: row.quantity.toString(),
				unit: row.unit,
			}));
		} else {
			return [];
		}
	} catch (error) {
		console.error('Error fetching custom ingredients:', error);
		throw error;
	}
};

export const insertIngredient = async (db: SQLiteDatabase, recipeId: string, ingredient: { name: string; quantity: string; unit: string }, refetchIngredients: () => Promise<void>) => {
	const { name, quantity, unit } = ingredient;

	try {
		await db.runAsync(
			`INSERT INTO Ingredients (recipe_id, name, quantity, unit)
      VALUES (?, ?, ?, ?)`,
			[recipeId, name, quantity, unit],
		);
		await refetchIngredients();
	} catch (error) {
		console.error('Error adding ingredient:', error);
		throw error;
	}
};

export const deleteIngredient = async (db: SQLiteDatabase, ingredientId: string | number, refetchIngredients: () => Promise<void>) => {
	try {
		await db.runAsync('DELETE FROM Ingredients WHERE id = ?', [ingredientId]);
		await refetchIngredients();
	} catch (error) {
		console.error('Error deleting ingredient:', error);
		throw error;
	}
};
