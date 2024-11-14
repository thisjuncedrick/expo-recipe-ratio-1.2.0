import { requestAPI } from '@/lib/api/AxiosInstance';
import { BaseRecipe } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

export const useRecipeInfo = (recipeId: string) => {
	return useQuery({
		queryKey: ['recipeIngredients', recipeId],
		queryFn: async () => {
			const response = await requestAPI(`recipe/${recipeId}`);
			return response.recipe[0] as BaseRecipe;
		},
		staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
		gcTime: 1000 * 60 * 30, // Keep unused data in cache for 30 minutes
		retry: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
	});
};
