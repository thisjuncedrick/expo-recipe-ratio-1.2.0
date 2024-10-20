import { requestAPI } from '@/lib/api/AxiosInstance';
import { RecipeDirections } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

export const useRecipeDirections = (recipeId: string) => {
	return useQuery({
		queryKey: ['recipeDirections', recipeId],
		queryFn: async () => {
			const response = await requestAPI(`recipe/${recipeId}?append=directions`);
			return response.recipe[0] as RecipeDirections;
		},
		staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
		gcTime: 1000 * 60 * 30, // Keep unused data in cache for 30 minutes
		retry: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
	});
};
