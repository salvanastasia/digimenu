export type Allergen = {
  id: number;
  name: string;
  description: string;
};

export type MenuItem = {
  id: string;
  name: string;
  description?: string;
  price?: number;
  measureUnit?: string;
  allergens?: Allergen[];
  tags?: string[];
};

export type MenuCategory = {
  id: string;
  name: string;
  description?: string;
  notes?: string;
  items: MenuItem[];
};

export type RestaurantConfig = {
  name: string;
  subtitle?: string;
  notes?: string;
  showAllergens: boolean;
  address?: string;
  phone?: string;
  impactStats?: {
    treesSaved: number;
    oxygenProducedKg: number;
  };
};
