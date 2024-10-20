import { FavoriteRecipe, RecipeIngredients } from '@/lib/types';
import { SQLiteDatabase } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import { ToastAndroid } from 'react-native';

interface FavoriteState {
	dateFavorited: string | undefined;
	isFavorite: boolean;
	isLoading: boolean;
	error: string | undefined;
}

export const useFavorites = (record: RecipeIngredients | null | undefined, db: SQLiteDatabase) => {
	const [state, setState] = useState<FavoriteState>({
		dateFavorited: undefined,
		isFavorite: false,
		isLoading: true,
		error: undefined,
	});

	const { id: recipeId, name: recipeName, cover_image, description } = record || { id: 0, name: null, cover_image: null, description: null };

	const checkIfFavorited = useCallback(async (id: number) => {
		if (!id) return false;
		setState((prev) => ({ ...prev, isLoading: true })); // Set loading to true at the beginning

		try {
			const result: FavoriteRecipe | null = await db.getFirstAsync('SELECT * FROM Favorites WHERE recipe_id = ?', [id]);
			setState((prev) => ({ ...prev, isFavorite: result != null, dateFavorited: result?.date_favorited }));
		} catch (err) {
			ToastAndroid.show('Error checking favorite status', ToastAndroid.LONG);
			console.error('Error checking favorite status:', err);
			setState((prev) => ({ ...prev, error: `Failed to check favorite status:\n\n${err}` }));
		} finally {
			// Moved the isLoading update outside of async calls
			setState((prev) => ({ ...prev, isLoading: false })); // Set loading to false when promise completes
		}
	}, []);

	const saveToFavorites = useCallback(async (): Promise<void> => {
		if (!recipeId && !record) return;

		try {
			if (record && record.ingredients) {
				const { ingredients, date_created, ...recipeDetails } = record;
				const { id, name, description, cover_image } = recipeDetails;
				const now = new Date().toJSON();

				db.runAsync('INSERT INTO Favorites (recipe_id, name, description, cover_image, date_favorited) VALUES (?, ?, ?, ?, ?)', [id, name, description, cover_image, now]);
			}

			ToastAndroid.show(`Added '${recipeName}' to Favorites`, ToastAndroid.SHORT);
			setState((prev) => ({ ...prev, isFavorite: true }));
		} catch (err) {
			ToastAndroid.show('Failed to save favorite', ToastAndroid.LONG);
			console.error('Error saving to favorites:', err);
			setState((prev) => ({ ...prev, error: `FAILED TO SAVE "${recipeName}" TO FAVORITES:\n\n${err}` }));
		} finally {
			setState((prev) => ({ ...prev, isLoading: false }));
		}
	}, [recipeId, recipeName, description, cover_image]);

	const removeFromFavorites = useCallback(async (): Promise<void> => {
		if (!recipeId) return;

		try {
			if (record && record.ingredients) {
				const { id } = record;
				db.runAsync('DELETE FROM Favorites WHERE recipe_id = ?', [id]);
			}

			ToastAndroid.show(`Removed '${recipeName}' from Favorites`, ToastAndroid.SHORT);

			setState((prev) => ({ ...prev, isFavorite: false }));
		} catch (err) {
			ToastAndroid.show('Error removing from favorites', ToastAndroid.LONG);
			console.error('Error removing from favorites:', err);
			setState((prev) => ({ ...prev, error: 'Failed to remove favorite' }));
		} finally {
			setState((prev) => ({ ...prev, isLoading: false }));
		}
	}, [recipeId, recipeName]);

	useEffect(() => {
		const checkFaveoriteStatus = async () => {
			if (recipeId) {
				checkIfFavorited(recipeId);
			} else {
				setState((prev) => ({ ...prev, isFavorite: false, isLoading: false }));
			}
		};

		checkFaveoriteStatus();
	}, [recipeId, checkIfFavorited]);

	return {
		isFavorite: state.isFavorite,
		dateFavorited: state.dateFavorited,
		saveToFavorites,
		removeFromFavorites,
		isLoading: state.isLoading,
		error: state.error,
		isError: Boolean(state.error),
	};
};
