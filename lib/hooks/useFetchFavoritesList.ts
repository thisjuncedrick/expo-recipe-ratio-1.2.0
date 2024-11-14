import { FavoriteRecipe } from '@/lib/types';
import { SQLiteDatabase } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';

const BATCH_SIZE = 10;

export const useFetchFavoritesList = (db: SQLiteDatabase) => {
	const [recipes, setRecipes] = useState<FavoriteRecipe[]>([]);
	const [offset, setOffset] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
	const [isError, setIsError] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const [hasMore, setHasMore] = useState(true);

	const fetchFavorites = async (reset = false) => {
		if (reset) {
			setIsLoading(true);
			setOffset(0);
			setRecipes([]); // Reset recipes on new fetch
		} else {
			setIsFetchingNextPage(true);
		}
		setIsError(false);
		setError(null);

		try {
			const newOffset = reset ? 0 : offset;
			const result = await db.getAllAsync<FavoriteRecipe>(
				'SELECT * FROM Favorites ORDER BY date_favorited DESC LIMIT ? OFFSET ?',
				[BATCH_SIZE, newOffset],
			);

			if (result && result.length > 0) {
				setRecipes((prevRecipes) => (reset ? result : [...prevRecipes, ...result]));
				setOffset((prevOffset) => prevOffset + result.length);
				setHasMore(result.length === BATCH_SIZE);
			} else {
				setHasMore(false);
			}
		} catch (err) {
			setIsError(true);
			setError(err instanceof Error ? err : new Error('An unknown error occurred'));
		} finally {
			setIsLoading(false);
			setIsFetchingNextPage(false);
		}
	};

	const loadMoreData = useCallback(() => {
		if (!isLoading && !isFetchingNextPage && hasMore) {
			fetchFavorites(false);
		}
	}, [isLoading, isFetchingNextPage, hasMore, fetchFavorites]);

	useEffect(() => {
		fetchFavorites(true);
	}, []);

	const refetch = useCallback(() => {
		fetchFavorites(true);
	}, [fetchFavorites]);

	return {
		recipes,
		loadMoreData,
		isFetchingNextPage,
		isLoading,
		refetch,
		isError,
		error,
		hasMore,
	};
};
