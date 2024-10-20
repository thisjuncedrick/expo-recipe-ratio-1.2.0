import { useRecipesQuery } from '@/lib/api';
import React, { useCallback } from 'react';

export const useFetchRecipes = (meatType: string) => {
	const [searchQuery, setSearchQuery] = React.useState<string>('');
	const [submittedQuery, setSubmittedQuery] = React.useState<string>('');
	const [isSearching, setIsSearching] = React.useState<boolean>(false);

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isRefetching, refetch, isError, error } = useRecipesQuery(
		meatType,
		isSearching ? submittedQuery : '',
	);

	const recipes = data?.pages.flatMap((page) => page.recipes) || [];

	const onClearSearch = useCallback(() => {
		setSearchQuery('');
		setSubmittedQuery('');
		setIsSearching(false);
	}, []);

	const onSubmitSearch = useCallback(() => {
		if (searchQuery === '') {
			onClearSearch();
		} else {
			setSubmittedQuery(searchQuery);
			setIsSearching(true);
		}
	}, [searchQuery, onClearSearch]);

	const loadMoreData = useCallback(() => {
		if (hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	}, [hasNextPage, isFetchingNextPage, fetchNextPage]);

	return {
		recipes,
		searchQuery,
		setSearchQuery,
		onSubmitSearch,
		onClearSearch,
		loadMoreData,
		isFetchingNextPage,
		isLoading,
		isRefetching,
		refetch,
		isError,
		error,
	};
};
