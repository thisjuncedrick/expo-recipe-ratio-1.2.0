type Ingredient = {
	name: string;
	quantity: string;
	unit: string;
};

type Direction = {
	description: string;
	duration: number | null;
	duration_unit: null | string;
};

type Ingredients = Ingredient[]; // Ingredients as an array of Ingredient
type Directions = Direction[]; // Ingredients as an array of Ingredient

type BaseRecipe = {
	id: number;
	name: string;
	description: string;
	cover_image: string;
	date_created: Date;
};

type IngredientsPreview = {
	blurHash: string;
	coverImage: string;
	description: string;
	id: number;
	ingredients: Ingredients;
	name: string;
};

type RecipePreview = {
	page: number;
	recipes: BaseRecipe[];
	total_recipes: number;
	total_pages: number;
};

type CustomIngredient = Ingredient & {
	isCustom: boolean;
	id: number;
};

type RecipeIngredients = BaseRecipe & { ingredients: Ingredients };
type RecipeDirections = BaseRecipe & { directions: Directions };

type FavoriteRecipe = Omit<BaseRecipe, 'id' | 'date_created'> & {
	recipe_id: number;
	date_favorited: string;
};

export { BaseRecipe, CustomIngredient, Direction, FavoriteRecipe, Ingredient, IngredientsPreview, RecipeDirections, RecipeIngredients, RecipePreview };
