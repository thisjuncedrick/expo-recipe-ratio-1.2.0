import { requestAPI } from '@/lib/api/AxiosInstance';
import { RecipePreview } from '@/lib/types';
import { useInfiniteQuery } from '@tanstack/react-query';

export const useRecipesQuery = (meatType: string, searchQuery: string = '') => {
	return useInfiniteQuery({
		queryKey: ['recipes', meatType, searchQuery],
		queryFn: async ({ pageParam = 1 }) => {
			const endpoint = searchQuery
				? `meat/recipes/${meatType}?page=${pageParam}&search=${searchQuery}`
				: `meat/recipes/${meatType}?page=${pageParam}`;

			const response = await requestAPI(endpoint);
			return response as RecipePreview;
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage) => {
			if (lastPage.page < lastPage.total_pages) {
				return lastPage.page + 1;
			}
			return undefined;
		},
		staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
		gcTime: 1000 * 60 * 10, // Cache data for 10 minutes
		retry: false, // Disable retries for timeout errors
		refetchOnMount: false, // Don't refetch on component mount
		refetchOnWindowFocus: false, // Don't refetch when window gains focus
		enabled: meatType !== undefined,
	});
};
