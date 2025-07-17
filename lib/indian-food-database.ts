// Comprehensive Indian Food Database for DietInt Chatbot
// Organized by food categories with nutritional information and health benefits

export interface FoodItem {
  name: string;
  category: string;
  calories_per_100g: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  key_nutrients: string[];
  health_benefits: string[];
  best_for: string[];
  preparation_methods: string[];
  ayurvedic_properties: string;
  regional_origin: string;
  season: string;
  therapeutic_uses: string[];
}

export const INDIAN_FOOD_DATABASE: FoodItem[] = [
  // GRAINS & CEREALS
  {
    name: "Brown Rice",
    category: "Grains",
    calories_per_100g: 123,
    protein: 2.6,
    carbs: 23,
    fat: 0.9,
    fiber: 1.8,
    key_nutrients: ["B vitamins", "Manganese", "Selenium", "Magnesium"],
    health_benefits: ["Sustained energy", "Heart health", "Digestive health"],
    best_for: ["Diabetes management", "Weight management", "Digestive issues"],
    preparation_methods: ["Steaming", "Pressure cooking", "Absorption method"],
    ayurvedic_properties: "Cooling, easy to digest",
    regional_origin: "Pan-Indian",
    season: "All seasons",
    therapeutic_uses: ["Diabetes", "Hypertension", "Digestive disorders"]
  },
  {
    name: "Whole Wheat Roti",
    category: "Grains",
    calories_per_100g: 297,
    protein: 11.8,
    carbs: 58,
    fat: 1.7,
    fiber: 11.2,
    key_nutrients: ["B vitamins", "Iron", "Magnesium", "Zinc"],
    health_benefits: ["Sustained energy", "Heart health", "Digestive health"],
    best_for: ["Weight management", "Diabetes", "Heart health"],
    preparation_methods: ["Dry roasting", "Tawa cooking", "Tandoor"],
    ayurvedic_properties: "Warming, grounding",
    regional_origin: "North India",
    season: "All seasons",
    therapeutic_uses: ["Diabetes", "Constipation", "Weight management"]
  },
  {
    name: "Oats",
    category: "Grains",
    calories_per_100g: 379,
    protein: 13.2,
    carbs: 67,
    fat: 6.5,
    fiber: 10.1,
    key_nutrients: ["Beta-glucan", "Manganese", "Phosphorus", "Magnesium"],
    health_benefits: ["Cholesterol reduction", "Heart health", "Blood sugar control"],
    best_for: ["Heart disease", "Diabetes", "Weight loss"],
    preparation_methods: ["Cooking", "Soaking", "Steaming"],
    ayurvedic_properties: "Cooling, nourishing",
    regional_origin: "Modern Indian cuisine",
    season: "All seasons",
    therapeutic_uses: ["High cholesterol", "Diabetes", "Hypertension"]
  },

  // LEGUMES & PULSES
  {
    name: "Moong Dal",
    category: "Legumes",
    calories_per_100g: 334,
    protein: 25,
    carbs: 56,
    fat: 1.3,
    fiber: 16.3,
    key_nutrients: ["Folate", "Manganese", "Phosphorus", "Magnesium"],
    health_benefits: ["Protein source", "Heart health", "Digestive health"],
    best_for: ["Muscle building", "Heart health", "Digestive issues"],
    preparation_methods: ["Pressure cooking", "Slow cooking", "Sprouting"],
    ayurvedic_properties: "Cooling, light, easy to digest",
    regional_origin: "Pan-Indian",
    season: "Summer (cooling)",
    therapeutic_uses: ["Fever", "Digestive disorders", "Detoxification"]
  },
  {
    name: "Masoor Dal",
    category: "Legumes",
    calories_per_100g: 358,
    protein: 26,
    carbs: 60,
    fat: 1.1,
    fiber: 11.5,
    key_nutrients: ["Iron", "Folate", "Potassium", "Magnesium"],
    health_benefits: ["Iron absorption", "Heart health", "Blood building"],
    best_for: ["Anemia", "Heart health", "Pregnancy"],
    preparation_methods: ["Pressure cooking", "Slow cooking", "Sprouting"],
    ayurvedic_properties: "Heating, nourishing",
    regional_origin: "North India",
    season: "Winter (warming)",
    therapeutic_uses: ["Anemia", "Weakness", "Low energy"]
  },
  {
    name: "Chana Dal",
    category: "Legumes",
    calories_per_100g: 364,
    protein: 22,
    carbs: 57,
    fat: 6.7,
    fiber: 12.2,
    key_nutrients: ["Folate", "Iron", "Magnesium", "Phosphorus"],
    health_benefits: ["Protein source", "Heart health", "Blood sugar control"],
    best_for: ["Diabetes", "Heart health", "Weight management"],
    preparation_methods: ["Pressure cooking", "Slow cooking", "Roasting"],
    ayurvedic_properties: "Neutral, grounding",
    regional_origin: "Central India",
    season: "All seasons",
    therapeutic_uses: ["Diabetes", "High cholesterol", "Digestive health"]
  },
  {
    name: "Rajma",
    category: "Legumes",
    calories_per_100g: 127,
    protein: 9,
    carbs: 22,
    fat: 0.5,
    fiber: 6.4,
    key_nutrients: ["Folate", "Iron", "Potassium", "Magnesium"],
    health_benefits: ["Heart health", "Blood sugar control", "Weight management"],
    best_for: ["Heart disease", "Diabetes", "Weight loss"],
    preparation_methods: ["Pressure cooking", "Slow cooking", "Sprouting"],
    ayurvedic_properties: "Cooling, heavy",
    regional_origin: "Kashmir/North India",
    season: "Winter",
    therapeutic_uses: ["Diabetes", "Heart disease", "High blood pressure"]
  },

  // VEGETABLES
  {
    name: "Bitter Gourd (Karela)",
    category: "Vegetables",
    calories_per_100g: 19,
    protein: 0.9,
    carbs: 4.3,
    fat: 0.2,
    fiber: 2.6,
    key_nutrients: ["Vitamin C", "Folate", "Potassium", "Iron"],
    health_benefits: ["Blood sugar control", "Liver health", "Immunity"],
    best_for: ["Diabetes", "Liver disorders", "Immunity"],
    preparation_methods: ["Stir-frying", "Stuffing", "Juicing"],
    ayurvedic_properties: "Cooling, bitter, detoxifying",
    regional_origin: "Pan-Indian",
    season: "Summer",
    therapeutic_uses: ["Diabetes", "Liver disorders", "Skin problems"]
  },
  {
    name: "Okra (Bhindi)",
    category: "Vegetables",
    calories_per_100g: 31,
    protein: 2.0,
    carbs: 7.1,
    fat: 0.1,
    fiber: 3.2,
    key_nutrients: ["Vitamin C", "Folate", "Vitamin K", "Magnesium"],
    health_benefits: ["Blood sugar control", "Heart health", "Digestive health"],
    best_for: ["Diabetes", "Heart health", "Digestive issues"],
    preparation_methods: ["Stir-frying", "Stuffing", "Curry"],
    ayurvedic_properties: "Cooling, lubricating",
    regional_origin: "Pan-Indian",
    season: "Summer",
    therapeutic_uses: ["Diabetes", "Constipation", "Joint problems"]
  },
  {
    name: "Spinach (Palak)",
    category: "Vegetables",
    calories_per_100g: 23,
    protein: 2.9,
    carbs: 3.6,
    fat: 0.4,
    fiber: 2.2,
    key_nutrients: ["Iron", "Vitamin K", "Folate", "Vitamin A"],
    health_benefits: ["Iron absorption", "Bone health", "Eye health"],
    best_for: ["Anemia", "Bone health", "Eye problems"],
    preparation_methods: ["Sautéing", "Steaming", "Blanching"],
    ayurvedic_properties: "Cooling, nourishing",
    regional_origin: "Pan-Indian",
    season: "Winter",
    therapeutic_uses: ["Anemia", "Weakness", "Eye disorders"]
  },
  {
    name: "Drumstick (Moringa)",
    category: "Vegetables",
    calories_per_100g: 26,
    protein: 2.5,
    carbs: 3.7,
    fat: 0.2,
    fiber: 4.8,
    key_nutrients: ["Vitamin C", "Calcium", "Iron", "Potassium"],
    health_benefits: ["Immunity", "Bone health", "Anti-inflammatory"],
    best_for: ["Immunity", "Bone health", "Inflammation"],
    preparation_methods: ["Curry", "Sambar", "Soup"],
    ayurvedic_properties: "Warming, nourishing",
    regional_origin: "South India",
    season: "All seasons",
    therapeutic_uses: ["Weakness", "Bone disorders", "Infections"]
  },

  // FRUITS
  {
    name: "Amla",
    category: "Fruits",
    calories_per_100g: 44,
    protein: 0.9,
    carbs: 10.2,
    fat: 0.6,
    fiber: 4.3,
    key_nutrients: ["Vitamin C", "Antioxidants", "Polyphenols", "Tannins"],
    health_benefits: ["Immunity", "Hair health", "Liver health"],
    best_for: ["Immunity", "Hair problems", "Liver disorders"],
    preparation_methods: ["Juicing", "Chutney", "Pickle", "Candy"],
    ayurvedic_properties: "Cooling, sour, rejuvenating",
    regional_origin: "Pan-Indian",
    season: "Winter",
    therapeutic_uses: ["Immunity", "Hair loss", "Acidity", "Diabetes"]
  },
  {
    name: "Papaya",
    category: "Fruits",
    calories_per_100g: 43,
    protein: 0.5,
    carbs: 11,
    fat: 0.3,
    fiber: 1.7,
    key_nutrients: ["Vitamin C", "Papain", "Folate", "Potassium"],
    health_benefits: ["Digestive health", "Immunity", "Anti-inflammatory"],
    best_for: ["Digestive issues", "Immunity", "Inflammation"],
    preparation_methods: ["Raw consumption", "Salad", "Smoothie"],
    ayurvedic_properties: "Cooling, digestive",
    regional_origin: "Tropical India",
    season: "All seasons",
    therapeutic_uses: ["Digestive disorders", "Constipation", "Inflammation"]
  },
  {
    name: "Pomegranate (Anar)",
    category: "Fruits",
    calories_per_100g: 83,
    protein: 1.7,
    carbs: 19,
    fat: 1.2,
    fiber: 4.0,
    key_nutrients: ["Vitamin C", "Antioxidants", "Folate", "Potassium"],
    health_benefits: ["Heart health", "Antioxidant", "Blood building"],
    best_for: ["Heart disease", "Anemia", "Immunity"],
    preparation_methods: ["Raw consumption", "Juice", "Salad"],
    ayurvedic_properties: "Cooling, sweet-sour, nourishing",
    regional_origin: "North India",
    season: "Winter",
    therapeutic_uses: ["Heart disease", "Anemia", "Diarrhea"]
  },

  // SPICES & HERBS
  {
    name: "Turmeric (Haldi)",
    category: "Spices",
    calories_per_100g: 312,
    protein: 9.7,
    carbs: 67,
    fat: 3.2,
    fiber: 22.7,
    key_nutrients: ["Curcumin", "Manganese", "Iron", "Potassium"],
    health_benefits: ["Anti-inflammatory", "Immunity", "Liver health"],
    best_for: ["Inflammation", "Immunity", "Liver disorders"],
    preparation_methods: ["Powder", "Fresh paste", "Milk"],
    ayurvedic_properties: "Heating, bitter, purifying",
    regional_origin: "Pan-Indian",
    season: "All seasons",
    therapeutic_uses: ["Inflammation", "Wounds", "Infections", "Liver disorders"]
  },
  {
    name: "Ginger (Adrak)",
    category: "Spices",
    calories_per_100g: 80,
    protein: 1.8,
    carbs: 18,
    fat: 0.8,
    fiber: 2.0,
    key_nutrients: ["Gingerol", "Vitamin C", "Magnesium", "Potassium"],
    health_benefits: ["Digestive health", "Anti-nausea", "Anti-inflammatory"],
    best_for: ["Digestive issues", "Nausea", "Cold"],
    preparation_methods: ["Fresh", "Dried", "Tea", "Paste"],
    ayurvedic_properties: "Heating, pungent, digestive",
    regional_origin: "Pan-Indian",
    season: "All seasons",
    therapeutic_uses: ["Digestive disorders", "Nausea", "Cold", "Arthritis"]
  },
  {
    name: "Cumin (Jeera)",
    category: "Spices",
    calories_per_100g: 375,
    protein: 18,
    carbs: 44,
    fat: 22,
    fiber: 10.5,
    key_nutrients: ["Iron", "Manganese", "Calcium", "Magnesium"],
    health_benefits: ["Digestive health", "Iron absorption", "Metabolism"],
    best_for: ["Digestive issues", "Anemia", "Weight management"],
    preparation_methods: ["Tempering", "Powder", "Water", "Roasting"],
    ayurvedic_properties: "Cooling, digestive, carminative",
    regional_origin: "Pan-Indian",
    season: "All seasons",
    therapeutic_uses: ["Digestive disorders", "Bloating", "Poor appetite"]
  },
  {
    name: "Coriander (Dhania)",
    category: "Spices",
    calories_per_100g: 298,
    protein: 12,
    carbs: 55,
    fat: 17,
    fiber: 41.9,
    key_nutrients: ["Vitamin C", "Folate", "Iron", "Manganese"],
    health_benefits: ["Digestive health", "Cooling", "Detoxification"],
    best_for: ["Digestive issues", "Heat", "Detox"],
    preparation_methods: ["Seeds", "Powder", "Fresh leaves", "Water"],
    ayurvedic_properties: "Cooling, digestive, diuretic",
    regional_origin: "Pan-Indian",
    season: "All seasons",
    therapeutic_uses: ["Digestive disorders", "Urinary problems", "Fever"]
  },
  {
    name: "Fenugreek (Methi)",
    category: "Spices",
    calories_per_100g: 323,
    protein: 23,
    carbs: 58,
    fat: 6.4,
    fiber: 24.6,
    key_nutrients: ["Fiber", "Iron", "Magnesium", "Manganese"],
    health_benefits: ["Blood sugar control", "Digestive health", "Lactation"],
    best_for: ["Diabetes", "Digestive issues", "Breastfeeding"],
    preparation_methods: ["Seeds", "Powder", "Leaves", "Sprouting"],
    ayurvedic_properties: "Heating, bitter, digestive",
    regional_origin: "Pan-Indian",
    season: "All seasons",
    therapeutic_uses: ["Diabetes", "Digestive disorders", "Low milk production"]
  },

  // DAIRY & ALTERNATIVES
  {
    name: "Yogurt (Dahi)",
    category: "Dairy",
    calories_per_100g: 61,
    protein: 3.5,
    carbs: 4.7,
    fat: 3.3,
    fiber: 0,
    key_nutrients: ["Probiotics", "Calcium", "Protein", "Vitamin B12"],
    health_benefits: ["Digestive health", "Bone health", "Immunity"],
    best_for: ["Digestive issues", "Bone health", "Immunity"],
    preparation_methods: ["Fresh", "Lassi", "Buttermilk", "Raita"],
    ayurvedic_properties: "Cooling, sour, nourishing",
    regional_origin: "Pan-Indian",
    season: "All seasons",
    therapeutic_uses: ["Digestive disorders", "Diarrhea", "Constipation"]
  },
  {
    name: "Buttermilk (Chaas)",
    category: "Dairy",
    calories_per_100g: 40,
    protein: 3.1,
    carbs: 4.8,
    fat: 0.9,
    fiber: 0,
    key_nutrients: ["Probiotics", "Calcium", "Potassium", "Phosphorus"],
    health_benefits: ["Digestive health", "Hydration", "Cooling"],
    best_for: ["Digestive issues", "Heat", "Hydration"],
    preparation_methods: ["Churning", "Spiced", "Sweet", "Salted"],
    ayurvedic_properties: "Cooling, digestive, hydrating",
    regional_origin: "Pan-Indian",
    season: "Summer",
    therapeutic_uses: ["Digestive disorders", "Heat stroke", "Dehydration"]
  },
  {
    name: "Paneer",
    category: "Dairy",
    calories_per_100g: 265,
    protein: 18.3,
    carbs: 1.2,
    fat: 20.8,
    fiber: 0,
    key_nutrients: ["Protein", "Calcium", "Phosphorus", "Selenium"],
    health_benefits: ["Protein source", "Bone health", "Muscle building"],
    best_for: ["Muscle building", "Bone health", "Vegetarian protein"],
    preparation_methods: ["Fresh", "Grilled", "Curry", "Stuffing"],
    ayurvedic_properties: "Cooling, heavy, nourishing",
    regional_origin: "North India",
    season: "All seasons",
    therapeutic_uses: ["Weakness", "Malnutrition", "Bone disorders"]
  },

  // TRADITIONAL PREPARATIONS
  {
    name: "Idli",
    category: "Fermented Foods",
    calories_per_100g: 166,
    protein: 4.4,
    carbs: 35,
    fat: 0.7,
    fiber: 0.8,
    key_nutrients: ["Probiotics", "B vitamins", "Carbohydrates", "Protein"],
    health_benefits: ["Digestive health", "Probiotic", "Easy digestion"],
    best_for: ["Digestive issues", "Gut health", "Easy digestion"],
    preparation_methods: ["Steaming", "Fermentation", "Batter"],
    ayurvedic_properties: "Cooling, light, easily digestible",
    regional_origin: "South India",
    season: "All seasons",
    therapeutic_uses: ["Digestive disorders", "Weakness", "Fever"]
  },
  {
    name: "Dosa",
    category: "Fermented Foods",
    calories_per_100g: 168,
    protein: 4.5,
    carbs: 28,
    fat: 4.5,
    fiber: 1.2,
    key_nutrients: ["Probiotics", "B vitamins", "Iron", "Folate"],
    health_benefits: ["Digestive health", "Probiotic", "Iron absorption"],
    best_for: ["Digestive issues", "Anemia", "Gut health"],
    preparation_methods: ["Fermentation", "Crepe-making", "Tawa"],
    ayurvedic_properties: "Cooling, light, digestive",
    regional_origin: "South India",
    season: "All seasons",
    therapeutic_uses: ["Digestive disorders", "Anemia", "Weakness"]
  },
  {
    name: "Sambar",
    category: "Traditional Dishes",
    calories_per_100g: 85,
    protein: 4.8,
    carbs: 12,
    fat: 2.5,
    fiber: 3.2,
    key_nutrients: ["Protein", "Fiber", "Folate", "Vitamin C"],
    health_benefits: ["Protein source", "Digestive health", "Immunity"],
    best_for: ["Protein needs", "Digestive health", "Immunity"],
    preparation_methods: ["Pressure cooking", "Tempering", "Simmering"],
    ayurvedic_properties: "Warming, nourishing, digestive",
    regional_origin: "South India",
    season: "All seasons",
    therapeutic_uses: ["Malnutrition", "Digestive disorders", "Weakness"]
  },
  {
    name: "Rasam",
    category: "Traditional Dishes",
    calories_per_100g: 45,
    protein: 2.1,
    carbs: 8,
    fat: 1.2,
    fiber: 1.8,
    key_nutrients: ["Vitamin C", "Antioxidants", "Curcumin", "Piperine"],
    health_benefits: ["Digestive health", "Immunity", "Anti-inflammatory"],
    best_for: ["Digestive issues", "Cold", "Immunity"],
    preparation_methods: ["Boiling", "Tempering", "Simmering"],
    ayurvedic_properties: "Heating, digestive, stimulating",
    regional_origin: "South India",
    season: "Monsoon/Winter",
    therapeutic_uses: ["Cold", "Digestive disorders", "Poor appetite"]
  }
];

// Helper functions for chatbot integration
export const getFoodByCategory = (category: string): FoodItem[] => {
  return INDIAN_FOOD_DATABASE.filter(food => food.category.toLowerCase() === category.toLowerCase());
};

export const getFoodByTherapeuticUse = (condition: string): FoodItem[] => {
  return INDIAN_FOOD_DATABASE.filter(food => 
    food.therapeutic_uses.some(use => use.toLowerCase().includes(condition.toLowerCase()))
  );
};

export const getFoodBySeason = (season: string): FoodItem[] => {
  return INDIAN_FOOD_DATABASE.filter(food => 
    food.season.toLowerCase().includes(season.toLowerCase()) || food.season === "All seasons"
  );
};

export const getFoodByRegion = (region: string): FoodItem[] => {
  return INDIAN_FOOD_DATABASE.filter(food => 
    food.regional_origin.toLowerCase().includes(region.toLowerCase()) || food.regional_origin === "Pan-Indian"
  );
};

export const searchFoods = (query: string): FoodItem[] => {
  const lowerQuery = query.toLowerCase();
  return INDIAN_FOOD_DATABASE.filter(food => 
    food.name.toLowerCase().includes(lowerQuery) ||
    food.health_benefits.some(benefit => benefit.toLowerCase().includes(lowerQuery)) ||
    food.therapeutic_uses.some(use => use.toLowerCase().includes(lowerQuery))
  );
};

// Generate food recommendations based on health conditions
export const getFoodRecommendations = (condition: string): string => {
  const foods = getFoodByTherapeuticUse(condition);
  if (foods.length === 0) return "No specific foods found for this condition.";
  
  return foods.map(food => `${food.name}: ${food.health_benefits.join(', ')}`).join('\n');
};

// Generate seasonal eating guide
export const getSeasonalFoods = (season: string): string => {
  const foods = getFoodBySeason(season);
  if (foods.length === 0) return "No seasonal foods found.";
  
  return foods.map(food => `${food.name}: ${food.ayurvedic_properties}`).join('\n');
};