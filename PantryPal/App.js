import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, StatusBar, ActivityIndicator,
  SafeAreaView, Platform, Dimensions, Animated, Alert
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import * as Font from 'expo-font';
import { useFonts, DMSans_400Regular, DMSans_500Medium, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { Lora_700Bold, Lora_700Bold_Italic } from '@expo-google-fonts/lora';
import { auth } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth';

const { width, height } = Dimensions.get('window');

// Color Constants
const GREEN       = '#1D9E75';  
const GREEN_DARK  = '#085041';  
const GREEN_LIGHT = '#EAF3DE';  
const GREEN_TEXT  = '#27500A';  
const BG          = '#F5F3EE';  
const WHITE       = '#FFFFFF';  
const TEXT        = '#2C2C2A';  
const MUTED       = '#888780';  
const BORDER      = '#E0DDD6';  
const BLUE        = '#5B6AF0';

// Data Arrays
const DIETS      = ['Any','Vegetarian','Vegan','Non-veg','Gluten-free'];
const CUISINES   = ['Any','Nepali','Indian','Chinese','Italian','Mexican'];
const TIMES      = ['Any','15 min','30 min','1 hour'];
const QUICK_INGS = ['rice','egg','tomato','onion','garlic','potato','chicken','dal'];

export default function App() {
  let [fontsLoaded] = useFonts({
    'DMSans-Regular': DMSans_400Regular,
    'DMSans-Medium': DMSans_500Medium,
    'DMSans-Bold': DMSans_700Bold,
    'Lora-Bold': Lora_700Bold,
    'Lora-BoldItalic': Lora_700Bold_Italic,
  });

  const [screen, setScreen] = useState('splash'); // splash, auth, home, results, detail
  const [navOpen, setNavOpen] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      if (usr) {
        setUser(usr);
        setScreen('home');
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  const handleAuth = async () => {
    try {
      if (isLoginView) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (name.trim()) {
          await updateProfile(userCredential.user, { displayName: name.trim() });
          setUser({ ...userCredential.user, displayName: name.trim() });
        }
      }
    } catch (err) {
      Alert.alert("Authentication Error", err.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setNavOpen(false);
      setScreen('auth');
    } catch (err) {
      Alert.alert("Sign Out Error", err.message);
    }
  };
  const [filters, setFilters] = useState({diet:'Any', cuisine:'Any', time:'Any'});
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [error, setError] = useState('');
  const [newIngredient, setNewIngredient] = useState('');

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color={GREEN} style={{ flex: 1, justifyContent: 'center' }} />;
  }

  const addIngredient = () => {
    if (newIngredient.trim().length > 0 && !ingredients.includes(newIngredient.trim().toLowerCase())) {
      setIngredients([...ingredients, newIngredient.trim().toLowerCase()]);
      setNewIngredient('');
    }
  };

  const removeIngredient = (ing) => {
    setIngredients(ingredients.filter(i => i !== ing));
  };

  const toggleSave = (recipe) => {
    if (savedRecipes.find(r => r.name === recipe.name)) {
      setSavedRecipes(savedRecipes.filter(r => r.name !== recipe.name));
    } else {
      setSavedRecipes([...savedRecipes, recipe]);
    }
  };

  const findRecipes = async () => {
    setScreen('results');
    setLoading(true);
    setError('');
    
    // MOCK API CALL - Replace with real Claude API
    setTimeout(() => {
      const allRecipes = [
        {
                "name": "Tomato Egg Fried Rice",
                "emoji": "🍳",
                "desc": "A quick and comforting meal using basic pantry staples.",
                "time": "15 min",
                "diet": "Vegetarian",
                "difficulty": "Easy",
                "servings": "1",
                "ingredients": [
                        "1 cup cooked rice",
                        "2 eggs",
                        "1 large tomato, diced",
                        "1 tbsp oil",
                        "Salt to taste"
                ],
                "steps": [
                        "Beat the eggs in a bowl with a pinch of salt.",
                        "Heat oil in a pan, scramble eggs, remove and set aside.",
                        "Add tomatoes to pan and cook until soft.",
                        "Add rice and mix well.",
                        "Return eggs into the pan, toss together and serve hot."
                ],
                "nutrition": {
                        "kcal": 350,
                        "protein": "15g",
                        "carbs": "45g",
                        "fat": "12g"
                }
        },
        {
                "name": "Classic Tomato Omelette",
                "emoji": "🍅",
                "desc": "A fluffy omelette filled with fresh tomatoes, perfect for breakfast.",
                "time": "10 min",
                "diet": "Vegetarian",
                "difficulty": "Easy",
                "servings": "1",
                "ingredients": [
                        "2 eggs",
                        "1/2 tomato, diced",
                        "Salt & pepper",
                        "1 tsp butter"
                ],
                "steps": [
                        "Whisk eggs, salt, and pepper.",
                        "Melt butter in a skillet over medium heat.",
                        "Pour in eggs, let set slightly, then add tomatoes on one side.",
                        "Fold omelette over and cook to desired doneness."
                ],
                "nutrition": {
                        "kcal": 200,
                        "protein": "12g",
                        "carbs": "4g",
                        "fat": "14g"
                }
        },
        {
                "name": "Savory Tomato Rice Bowl",
                "emoji": "🍚",
                "desc": "A super simple bowl blending the umami of tomatoes and egg over rice.",
                "time": "20 min",
                "diet": "Vegetarian",
                "difficulty": "Intermediate",
                "servings": "1",
                "ingredients": [
                        "1 cup rice",
                        "1 egg",
                        "2 tomatoes",
                        "Soy sauce (optional)",
                        "Green onion"
                ],
                "steps": [
                        "Cook rice according to instructions.",
                        "Fry an egg sunny side up.",
                        "Sauté diced tomatoes until they form a sauce.",
                        "Serve tomatoes over rice, topped with the fried egg."
                ],
                "nutrition": {
                        "kcal": 400,
                        "protein": "10g",
                        "carbs": "50g",
                        "fat": "10g"
                }
        },
        {
                "name": "Garlic Butter Rice",
                "emoji": "🧄",
                "desc": "A flavorful and rich side dish or simple meal.",
                "time": "15 min",
                "diet": "Vegetarian",
                "difficulty": "Easy",
                "servings": "2",
                "ingredients": [
                        "2 cups cooked rice",
                        "4 cloves garlic, minced",
                        "2 tbsp butter",
                        "Salt to taste",
                        "Cilantro for garnish"
                ],
                "steps": [
                        "Melt butter in a pan.",
                        "Sauté minced garlic until fragrant.",
                        "Add cooked rice and mix thoroughly.",
                        "Season with salt and garnish with cilantro."
                ],
                "nutrition": {
                        "kcal": 320,
                        "protein": "5g",
                        "carbs": "45g",
                        "fat": "14g"
                }
        },
        {
                "name": "Simple Dal Tadka",
                "emoji": "🍲",
                "desc": "A staple Indian comfort food made with lentils and tempered spices.",
                "time": "30 min",
                "diet": "Vegan",
                "difficulty": "Intermediate",
                "servings": "4",
                "ingredients": [
                        "1 cup yellow lentils (Toor Dal)",
                        "1 onion, chopped",
                        "1 tomato, chopped",
                        "1 tsp cumin seeds",
                        "1/2 tsp turmeric"
                ],
                "steps": [
                        "Boil lentils with turmeric and salt until soft.",
                        "Heat oil in a pan, add cumin seeds.",
                        "Sauté onions and tomatoes until soft.",
                        "Mix the tempered spices into the cooked lentils."
                ],
                "nutrition": {
                        "kcal": 250,
                        "protein": "14g",
                        "carbs": "35g",
                        "fat": "5g"
                }
        },
        {
                "name": "Aloo Bhujia (Potato Stir-fry)",
                "emoji": "🥔",
                "desc": "Crispy and spicy potato stir-fry, a Nepali household favorite.",
                "time": "20 min",
                "diet": "Vegan",
                "difficulty": "Easy",
                "servings": "2",
                "ingredients": [
                        "3 potatoes, thinly sliced",
                        "1 onion, sliced",
                        "1/2 tsp turmeric",
                        "1/2 tsp cumin powder",
                        "2 tbsp oil"
                ],
                "steps": [
                        "Heat oil in a pan.",
                        "Add onions and sauté until translucent.",
                        "Add potatoes, turmeric, cumin, and salt.",
                        "Cook uncovered until crispy and tender."
                ],
                "nutrition": {
                        "kcal": 210,
                        "protein": "4g",
                        "carbs": "30g",
                        "fat": "9g"
                }
        },
        {
                "name": "Chicken Curry (Nepali Style)",
                "emoji": "🍗",
                "desc": "A rustic and hearty chicken curry perfect with rice.",
                "time": "45 min",
                "diet": "Non-veg",
                "difficulty": "Intermediate",
                "servings": "4",
                "ingredients": [
                        "500g chicken, cut into pieces",
                        "2 onions, finely chopped",
                        "2 tomatoes, puréed",
                        "1 tbsp ginger-garlic paste",
                        "Chicken masala powder"
                ],
                "steps": [
                        "Sauté onions until golden brown.",
                        "Add ginger-garlic paste and stir.",
                        "Add chicken pieces and brown them.",
                        "Mix in tomatoes and spices, simmer until cooked."
                ],
                "nutrition": {
                        "kcal": 350,
                        "protein": "28g",
                        "carbs": "10g",
                        "fat": "20g"
                }
        },
        {
                "name": "Pasta Aglio e Olio",
                "emoji": "🍝",
                "desc": "A classic Italian spaghetti dish with garlic and olive oil.",
                "time": "15 min",
                "diet": "Vegan",
                "difficulty": "Easy",
                "servings": "2",
                "ingredients": [
                        "200g spaghetti",
                        "4 cloves garlic, thinly sliced",
                        "1/4 cup olive oil",
                        "Red pepper flakes",
                        "Parsley"
                ],
                "steps": [
                        "Boil pasta in salted water until al dente.",
                        "In a pan, gently sauté garlic in olive oil.",
                        "Add red pepper flakes.",
                        "Toss pasta in the oil with a bit of pasta water. Garnish with parsley."
                ],
                "nutrition": {
                        "kcal": 450,
                        "protein": "10g",
                        "carbs": "60g",
                        "fat": "18g"
                }
        },
        {
                "name": "Masala Omelette",
                "emoji": "🍳",
                "desc": "A spicy Indian-style omelette with onions, tomatoes, and chilies.",
                "time": "10 min",
                "diet": "Vegetarian",
                "difficulty": "Easy",
                "servings": "1",
                "ingredients": [
                        "2 eggs",
                        "1/4 onion, finely chopped",
                        "1/4 tomato, finely chopped",
                        "1 green chili, chopped",
                        "Pinch of turmeric"
                ],
                "steps": [
                        "Whisk eggs with all ingredients and salt.",
                        "Heat oil in a pan.",
                        "Pour mixture and spread evenly.",
                        "Cook both sides until golden brown."
                ],
                "nutrition": {
                        "kcal": 220,
                        "protein": "13g",
                        "carbs": "5g",
                        "fat": "15g"
                }
        },
        {
                "name": "Vegetable Fried Rice",
                "emoji": "🍚",
                "desc": "A quick stir-fried rice with assorted crispy vegetables.",
                "time": "20 min",
                "diet": "Vegan",
                "difficulty": "Easy",
                "servings": "2",
                "ingredients": [
                        "2 cups day-old cooked rice",
                        "1 cup mixed veggies (carrots, peas, beans)",
                        "2 cloves garlic, minced",
                        "2 tbsp soy sauce",
                        "1 tbsp oil"
                ],
                "steps": [
                        "Heat oil in a wok and sauté garlic.",
                        "Add mixed vegetables and stir-fry until tender.",
                        "Add rice and soy sauce.",
                        "Toss well on high heat for 3 minutes."
                ],
                "nutrition": {
                        "kcal": 310,
                        "protein": "6g",
                        "carbs": "55g",
                        "fat": "8g"
                }
        },
        {
                "name": "Tomato Soup",
                "emoji": "🥣",
                "desc": "Warm, comforting, and simple tomato soup.",
                "time": "25 min",
                "diet": "Vegetarian",
                "difficulty": "Easy",
                "servings": "2",
                "ingredients": [
                        "4 large tomatoes",
                        "1/2 onion, chopped",
                        "2 cloves garlic",
                        "1 cup vegetable broth",
                        "1 tbsp butter"
                ],
                "steps": [
                        "Roast or sauté tomatoes, onion, and garlic with butter.",
                        "Add vegetable broth and simmer for 15 minutes.",
                        "Blend until smooth.",
                        "Season with salt and pepper."
                ],
                "nutrition": {
                        "kcal": 150,
                        "protein": "4g",
                        "carbs": "20g",
                        "fat": "7g"
                }
        },
        {
                "name": "Spicy Garlic Noodles",
                "emoji": "🍜",
                "desc": "Slurpy noodles tossed in a savory and spicy garlic sauce.",
                "time": "15 min",
                "diet": "Vegan",
                "difficulty": "Easy",
                "servings": "2",
                "ingredients": [
                        "200g noodles",
                        "4 cloves garlic, minced",
                        "2 tbsp soy sauce",
                        "1 tbsp chili sauce",
                        "1 tsp sesame oil"
                ],
                "steps": [
                        "Boil noodles as per packet instructions.",
                        "Heat oil in a pan and sauté garlic.",
                        "Mix in soy sauce, chili sauce, and sesame oil.",
                        "Toss the noodles in the sauce."
                ],
                "nutrition": {
                        "kcal": 380,
                        "protein": "12g",
                        "carbs": "65g",
                        "fat": "10g"
                }
        },
        {
                "name": "Egg Curry",
                "emoji": "🥘",
                "desc": "Hard-boiled eggs simmered in a spiced onion-tomato gravy.",
                "time": "30 min",
                "diet": "Non-veg",
                "difficulty": "Intermediate",
                "servings": "2",
                "ingredients": [
                        "4 hard-boiled eggs",
                        "1 large onion, pureed",
                        "2 tomatoes, pureed",
                        "1 tsp garam masala",
                        "2 tbsp oil"
                ],
                "steps": [
                        "Make small slits on eggs and lightly fry them, set aside.",
                        "Sauté onion and tomato purees with oil.",
                        "Add garam masala and salt, cook until oil separates.",
                        "Add water to form a gravy, add eggs, and simmer."
                ],
                "nutrition": {
                        "kcal": 280,
                        "protein": "14g",
                        "carbs": "12g",
                        "fat": "19g"
                }
        },
        {
                "name": "Aloo Gobi",
                "emoji": "🥦",
                "desc": "A classic Indian vegetarian dish consisting of potatoes and cauliflower.",
                "time": "30 min",
                "diet": "Vegan",
                "difficulty": "Intermediate",
                "servings": "3",
                "ingredients": [
                        "1 cauliflower, cut into florets",
                        "2 potatoes, cubed",
                        "1/2 tsp cumin seeds",
                        "1/2 tsp turmeric",
                        "1 tsp coriander powder"
                ],
                "steps": [
                        "Heat oil, add cumin seeds.",
                        "Add potatoes and cauliflower florets with turmeric and salt.",
                        "Cover and cook on low heat until tender.",
                        "Add coriander powder and toss."
                ],
                "nutrition": {
                        "kcal": 180,
                        "protein": "5g",
                        "carbs": "25g",
                        "fat": "7g"
                }
        },
        {
                "name": "Spinach Dal",
                "emoji": "🌿",
                "desc": "Lentils cooked with fresh spinach for a nutritious meal.",
                "time": "35 min",
                "diet": "Vegan",
                "difficulty": "Intermediate",
                "servings": "4",
                "ingredients": [
                        "1 cup lentils (Masoor/Toor)",
                        "2 cups chopped spinach",
                        "1 tomato, chopped",
                        "2 cloves garlic",
                        "1/2 tsp mustard seeds"
                ],
                "steps": [
                        "Boil lentils until cooked.",
                        "In another pan, temper mustard seeds and garlic in oil.",
                        "Add tomatoes and spinach, cook until wilted.",
                        "Mix into the cooked dal."
                ],
                "nutrition": {
                        "kcal": 220,
                        "protein": "16g",
                        "carbs": "35g",
                        "fat": "4g"
                }
        },
        {
                "name": "Chicken Fried Rice",
                "emoji": "🍗",
                "desc": "A flavorful mix of rice, chicken chunks, and veggies.",
                "time": "25 min",
                "diet": "Non-veg",
                "difficulty": "Easy",
                "servings": "2",
                "ingredients": [
                        "2 cups cooked rice",
                        "150g chicken breast, cubed",
                        "1/2 cup veggies",
                        "2 tbsp soy sauce",
                        "1/2 tsp black pepper"
                ],
                "steps": [
                        "Stir fry chicken cubes until cooked.",
                        "Add vegetables and sauté.",
                        "Add rice, soy sauce, and black pepper.",
                        "Stir fry on high heat until well mixed."
                ],
                "nutrition": {
                        "kcal": 400,
                        "protein": "25g",
                        "carbs": "45g",
                        "fat": "12g"
                }
        },
        {
                "name": "Lemon Rice",
                "emoji": "🍋",
                "desc": "Tangy southern Indian style rice with a crunchy tempering.",
                "time": "15 min",
                "diet": "Vegan",
                "difficulty": "Easy",
                "servings": "2",
                "ingredients": [
                        "2 cups cooked rice",
                        "2 tbsp lemon juice",
                        "1 tsp mustard seeds",
                        "2 tbsp peanuts",
                        "1/4 tsp turmeric"
                ],
                "steps": [
                        "Heat oil, add mustard seeds and peanuts, roast until crunchy.",
                        "Add turmeric and turn off heat.",
                        "Pour the tempering over cooked rice.",
                        "Mix well with lemon juice and salt."
                ],
                "nutrition": {
                        "kcal": 330,
                        "protein": "7g",
                        "carbs": "48g",
                        "fat": "12g"
                }
        },
        {
                "name": "Potato Curry (Aloo Tarkari)",
                "emoji": "🥔",
                "desc": "A simple, mildly spiced saucy potato dish.",
                "time": "25 min",
                "diet": "Vegan",
                "difficulty": "Easy",
                "servings": "2",
                "ingredients": [
                        "3 potatoes, boiled and cubed",
                        "1 tomato, chopped",
                        "1/4 tsp fenugreek seeds",
                        "1/2 tsp turmeric",
                        "1.5 cups water"
                ],
                "steps": [
                        "Heat oil, crackle fenugreek seeds.",
                        "Add tomatoes and turmeric, cook until soft.",
                        "Add potatoes and mash slightly.",
                        "Pour water, bring to boil, and simmer to a thick gravy."
                ],
                "nutrition": {
                        "kcal": 190,
                        "protein": "4g",
                        "carbs": "33g",
                        "fat": "5g"
                }
        },
        {
                "name": "Black Chickpea Curry (Kala Chana)",
                "emoji": "🍛",
                "desc": "A protein-rich and robust curry made of black chickpeas.",
                "time": "40 min",
                "diet": "Vegan",
                "difficulty": "Intermediate",
                "servings": "3",
                "ingredients": [
                        "1 cup black chickpeas (soaked overnight)",
                        "1 onion, chopped",
                        "1 tomato, chopped",
                        "1 tsp cumin powder",
                        "Fresh coriander"
                ],
                "steps": [
                        "Pressure cook the chickpeas until tender.",
                        "Sauté onions and tomatoes with spices.",
                        "Add the boiled chickpeas along with its water.",
                        "Simmer for 10 minutes and garnish with coriander."
                ],
                "nutrition": {
                        "kcal": 270,
                        "protein": "15g",
                        "carbs": "45g",
                        "fat": "4g"
                }
        },
        {
                "name": "Paneer Bhurji",
                "emoji": "🧀",
                "desc": "Spiced scrambled Indian cottage cheese.",
                "time": "15 min",
                "diet": "Vegetarian",
                "difficulty": "Easy",
                "servings": "2",
                "ingredients": [
                        "200g crumbled paneer",
                        "1 onion, chopped",
                        "1 tomato, chopped",
                        "1/2 tsp garam masala",
                        "1 tbsp butter"
                ],
                "steps": [
                        "Melt butter in a pan.",
                        "Sauté chopped onion and tomato until mushy.",
                        "Add spices and crumbled paneer.",
                        "Mix gently and cook for 2-3 minutes."
                ],
                "nutrition": {
                        "kcal": 320,
                        "protein": "18g",
                        "carbs": "8g",
                        "fat": "24g"
                }
        },
        {
                "name": "Mushroom Matar",
                "emoji": "🍄",
                "desc": "Earthy mushrooms and sweet peas cooked in a rich gravy.",
                "time": "30 min",
                "diet": "Vegan",
                "difficulty": "Intermediate",
                "servings": "3",
                "ingredients": [
                        "200g mushrooms, sliced",
                        "1 cup green peas",
                        "2 onions, pureed",
                        "2 tomatoes, pureed",
                        "Cashew paste (optional)"
                ],
                "steps": [
                        "Sauté mushrooms until browned and set aside.",
                        "Cook onion puree and tomato puree with spices until oil separates.",
                        "Add peas, mushrooms, and water.",
                        "Simmer for 10 minutes (stir in cashew paste if using)."
                ],
                "nutrition": {
                        "kcal": 180,
                        "protein": "6g",
                        "carbs": "16g",
                        "fat": "10g"
                }
        },
        {
                "name": "Beef Steak with Garlic Butter",
                "emoji": "🥩",
                "desc": "Juicy pan-seared steak bathed in rich garlic butter.",
                "time": "20 min",
                "diet": "Non-veg",
                "difficulty": "Intermediate",
                "servings": "2",
                "ingredients": [
                        "2 beef steaks (Sirloin/Ribeye)",
                        "3 tbsp butter",
                        "4 cloves garlic, crushed",
                        "Rosemary sprigs",
                        "Salt and pepper"
                ],
                "steps": [
                        "Season steaks generously with salt and pepper.",
                        "Heat oil in a skillet until smoking hot.",
                        "Sear steaks for 3-4 minutes per side.",
                        "Add butter, garlic, and rosemary; baste the steak constantly.",
                        "Rest for 5 minutes before slicing."
                ],
                "nutrition": {
                        "kcal": 550,
                        "protein": "45g",
                        "carbs": "2g",
                        "fat": "40g"
                }
        },
        {
                "name": "Chilli Chicken",
                "emoji": "🌶️",
                "desc": "Spicy, tangy, and slightly sweet Indo-Chinese chicken dish.",
                "time": "35 min",
                "diet": "Non-veg",
                "difficulty": "Intermediate",
                "servings": "3",
                "ingredients": [
                        "300g boneless chicken, diced",
                        "1 bell pepper, cubed",
                        "1 onion, cubed",
                        "2 tbsp soy sauce",
                        "1 tbsp chilli sauce",
                        "2 tbsp cornstarch"
                ],
                "steps": [
                        "Marinate chicken in soy sauce and coat with cornstarch, then fry until crispy.",
                        "Sauté onion and bell pepper in oil.",
                        "Add sauces and toss.",
                        "Add fried chicken and mix well until coated."
                ],
                "nutrition": {
                        "kcal": 420,
                        "protein": "28g",
                        "carbs": "20g",
                        "fat": "25g"
                }
        },
        {
                "name": "Pork Belly Stir-fry",
                "emoji": "🥓",
                "desc": "Crispy pork belly strips stir-fried with garlic and soy.",
                "time": "25 min",
                "diet": "Non-veg",
                "difficulty": "Intermediate",
                "servings": "2",
                "ingredients": [
                        "300g pork belly, sliced thinly",
                        "3 cloves garlic, minced",
                        "1 tbsp soy sauce",
                        "1/2 tsp sugar",
                        "Spring onions"
                ],
                "steps": [
                        "Cook pork belly slices in a pan without oil until golden and fat has rendered.",
                        "Drain excess fat if preferred.",
                        "Add garlic and stir until fragrant.",
                        "Add soy sauce and sugar, cook until caramelized.",
                        "Garnish with spring onions."
                ],
                "nutrition": {
                        "kcal": 600,
                        "protein": "20g",
                        "carbs": "5g",
                        "fat": "55g"
                }
        },
        {
                "name": "Mutton Curry (Nepali Style)",
                "emoji": "🍲",
                "desc": "Slow-cooked goat meat in a traditional rich and spicy gravy.",
                "time": "90 min",
                "diet": "Non-veg",
                "difficulty": "Hard",
                "servings": "4",
                "ingredients": [
                        "500g mutton/goat meat",
                        "3 onions, finely chopped",
                        "2 tomatoes, chopped",
                        "2 tbsp ginger-garlic paste",
                        "Meat masala powder"
                ],
                "steps": [
                        "Heat oil and sauté onions until dark brown.",
                        "Add ginger-garlic paste and meat, fry well for 15 minutes.",
                        "Add tomatoes and spices, cook until oil separates.",
                        "Add water and slow cook for an hour or pressure cook for 5-6 whistles until meat is tender."
                ],
                "nutrition": {
                        "kcal": 480,
                        "protein": "35g",
                        "carbs": "10g",
                        "fat": "32g"
                }
        },
        {
                "name": "Garlic Butter Mussels",
                "emoji": "🦪",
                "desc": "Fresh mussels steamed in a fragrant garlic, butter, and white wine sauce.",
                "time": "20 min",
                "diet": "Non-veg",
                "difficulty": "Intermediate",
                "servings": "2",
                "ingredients": [
                        "500g mussels, cleaned",
                        "3 tbsp butter",
                        "4 cloves garlic, minced",
                        "1/4 cup broth or white wine",
                        "Parsley"
                ],
                "steps": [
                        "Melt butter in a large pot and sauté garlic.",
                        "Add mussels and broth.",
                        "Cover the pot and let steam for 5-7 minutes until all mussels open.",
                        "Discard any that do not open. Garnish with parsley and serve with crusty bread."
                ],
                "nutrition": {
                        "kcal": 350,
                        "protein": "22g",
                        "carbs": "8g",
                        "fat": "24g"
                }
        },
        {
                "name": "Spicy Meatballs",
                "emoji": "🍝",
                "desc": "Homemade ground beef meatballs in a rich marinara sauce.",
                "time": "40 min",
                "diet": "Non-veg",
                "difficulty": "Intermediate",
                "servings": "4",
                "ingredients": [
                        "400g ground beef",
                        "1/4 cup breadcrumbs",
                        "1 egg",
                        "1/2 cup parmesan cheese",
                        "2 cups marinara sauce"
                ],
                "steps": [
                        "Mix ground beef, breadcrumbs, egg, salt, pepper, and cheese.",
                        "Form into 1.5 inch balls.",
                        "Brown meatballs in a skillet with oil.",
                        "Pour marinara sauce over them and simmer for 20 minutes until cooked through."
                ],
                "nutrition": {
                        "kcal": 450,
                        "protein": "30g",
                        "carbs": "15g",
                        "fat": "28g"
                }
        },
        {
                "name": "Grilled Lamb Chops",
                "emoji": "🥩",
                "desc": "Tender lamb chops marinated in rosemary and garlic, then grilled to perfection.",
                "time": "30 min",
                "diet": "Non-veg",
                "difficulty": "Intermediate",
                "servings": "2",
                "ingredients": [
                        "4 lamb chops",
                        "2 tbsp olive oil",
                        "3 cloves garlic, crushed",
                        "Fresh rosemary",
                        "Salt & pepper"
                ],
                "steps": [
                        "Marinate lamb chops with oil, garlic, rosemary, salt, and pepper for at least 15 minutes.",
                        "Heat a grill or grill pan over high heat.",
                        "Grill chops for 3-4 minutes per side for medium-rare.",
                        "Let them rest before serving."
                ],
                "nutrition": {
                        "kcal": 520,
                        "protein": "35g",
                        "carbs": "2g",
                        "fat": "40g"
                }
        }
      ];

      // Filter based on user ingredients
      const searchTerms = ingredients.map(ing => ing.toLowerCase());
      
      const filtered = allRecipes.filter(recipe => {
        if (searchTerms.length === 0) return true;

        const nameMatch = searchTerms.some(term => recipe.name.toLowerCase().includes(term));
        const ingMatch = recipe.ingredients.some(recipeIng => 
          searchTerms.some(term => recipeIng.toLowerCase().includes(term))
        );

        return nameMatch || ingMatch;
      });

      setRecipes(filtered);
      setLoading(false);
    }, 2000);
  };

  // --- UI Components ---
  const TopBar = ({ title, showBack = false }) => (
    <View style={styles.topBar}>
      <TouchableOpacity onPress={() => showBack ? setScreen('home') : setNavOpen(true)}>
        <Text style={{ fontSize: 24 }}>{showBack ? '←' : '☰'}</Text>
      </TouchableOpacity>
      <Text style={styles.topBarTitle}>{title}</Text>
      <View style={styles.avatar}><Text style={styles.avatarText}>{user?.displayName ? user.displayName.substring(0, 2).toUpperCase() : 'PP'}</Text></View>
    </View>
  );

  const FilterRow = ({ title, options, active, onSelect }) => (
    <View style={styles.filterSection}>
      <Text style={styles.filterLabel}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
        {options.map(opt => (
          <TouchableOpacity 
            key={opt}
            style={[styles.filterChip, active === opt && styles.filterChipActive]}
            onPress={() => onSelect(opt)}>
            <Text style={[styles.filterChipText, active === opt && styles.filterChipTextActive]}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const DonutChart = ({ pct }) => {
    const size = 60;
    const strokeWidth = 6;
    const radius = (size - strokeWidth) / 2;
    const circum = radius * 2 * Math.PI;
    const svgProgress = 100 - pct;

    return (
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          <Circle stroke={BORDER} cx={size/2} cy={size/2} r={radius} strokeWidth={strokeWidth} fill="none" />
          <Circle 
            stroke={GREEN} cx={size/2} cy={size/2} r={radius} strokeWidth={strokeWidth} fill="none"
            strokeDasharray={`${circum} ${circum}`} strokeDashoffset={circum * (svgProgress/100)}
            strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}
          />
        </Svg>
        <View style={styles.donutTextContainer}>
          <Text style={styles.donutText}>{pct}%</Text>
        </View>
      </View>
    );
  };

  // --- Screens ---

  const Splash = () => (
    <LinearGradient colors={[GREEN, GREEN_DARK]} style={styles.splashContainer}>
      <View style={styles.splashContent}>
        <Text style={styles.splashEmoji}>🍳</Text>
        <Text style={styles.splashTitle}>PantryPal</Text>
        <Text style={styles.splashTagline}>Turn ingredients into delicious meals — powered by AI</Text>
      </View>
      <TouchableOpacity style={styles.splashButton} onPress={() => setScreen('auth')}>
        <Text style={styles.splashButtonText}>Get Started</Text>
      </TouchableOpacity>
    </LinearGradient>
  );

  const Auth = () => (
    <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', paddingHorizontal: 24, backgroundColor: WHITE }]}>
      <Text style={[styles.detailTitle, { textAlign: 'center', fontSize: 32 }]}>
        {isLoginView ? 'Welcome Back 👋' : 'Create Account ✨'}
      </Text>
      <Text style={[styles.recipeDesc, { textAlign: 'center', marginBottom: 40 }]}>
        {isLoginView ? 'Login to access your saved recipes and settings.' : 'Sign up to start saving and discovering new recipes!'}
      </Text>
      
      {!isLoginView && (
        <View style={{ marginBottom: 16 }}>
          <Text style={styles.inputLabel}>Full Name</Text>
          <TextInput
            style={styles.formInput}
            placeholder="John Doe"
            placeholderTextColor={MUTED}
            value={name}
            onChangeText={setName}
          />
        </View>
      )}
      
      <View style={{ marginBottom: 16 }}>
        <Text style={styles.inputLabel}>Email Address</Text>
        <TextInput
          style={styles.formInput}
          placeholder="john@example.com"
          placeholderTextColor={MUTED}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      
      <View style={{ marginBottom: 32 }}>
        <Text style={styles.inputLabel}>Password</Text>
        <TextInput
          style={styles.formInput}
          placeholder="••••••••"
          placeholderTextColor={MUTED}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      
      <TouchableOpacity style={styles.saveBtnFull} onPress={handleAuth}>
        <Text style={styles.saveBtnFullText}>{isLoginView ? 'Login' : 'Sign Up'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsLoginView(!isLoginView)} style={{ marginTop: 24, alignItems: 'center' }}>
        <Text style={{ fontFamily: 'DMSans-Medium', color: GREEN, fontSize: 16 }}>
          {isLoginView ? "Don't have an account? Sign up" : 'Already have an account? Login'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );

  const Home = () => (
    <SafeAreaView style={styles.safeArea}>
      <TopBar title="PantryPal 🍳" />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>Good morning 👋, {user?.displayName || 'Chef'}</Text>
        </View>

        {/* Hero Card */}
        <View style={styles.paddingH}>
          <LinearGradient colors={[GREEN, GREEN_DARK]} style={styles.heroCard}>
            <Text style={styles.heroTag}>Today's Suggestion</Text>
            <Text style={styles.heroTitle}>Spicy Garlic Noodles</Text>
            <Text style={styles.heroDesc}>Ready in 15 mins using basic pantry staples.</Text>
          </LinearGradient>
        </View>

        {/* Stats Row */}
        <View style={[styles.paddingH, styles.statsRow]}>
          <View style={[styles.statBox, { backgroundColor: GREEN_LIGHT }]}>
            <Text style={[styles.statNum, { color: GREEN_TEXT }]}>12</Text>
            <Text style={styles.statLabel}>Recipes Found</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: '#EEF0FF' }]}>
            <Text style={[styles.statNum, { color: BLUE }]}>{savedRecipes.length}</Text>
            <Text style={styles.statLabel}>Saved Recipes</Text>
          </View>
        </View>

        {/* Ingredients Section */}
        <View style={[styles.paddingH, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>What's in your pantry?</Text>
          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.input} 
              placeholder="e.g. Chicken, Rice, Onion" 
              placeholderTextColor={MUTED}
              value={newIngredient}
              onChangeText={setNewIngredient}
              onSubmitEditing={addIngredient}
            />
            <TouchableOpacity style={styles.addButton} onPress={addIngredient}>
              <Text style={styles.addButtonText}>+ Add</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.chipContainer}>
            {ingredients.map(ing => (
              <TouchableOpacity key={ing} style={styles.ingChip} onPress={() => removeIngredient(ing)}>
                <Text style={styles.ingChipText}>{ing}  ✕</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.quickAddLabel}>Quick Add:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {QUICK_INGS.map(q => (
              <TouchableOpacity key={q} style={styles.quickAddBtn} onPress={() => { setNewIngredient(q); addIngredient(); }}>
                <Text style={styles.quickAddBtnText}>+ {q}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Filters */}
        <View style={{ marginTop: 24, paddingBottom: 100 }}>
          <FilterRow title="Dietary Preference" options={DIETS} active={filters.diet} onSelect={(d) => setFilters({...filters, diet: d})} />
          <FilterRow title="Cuisine Type" options={CUISINES} active={filters.cuisine} onSelect={(c) => setFilters({...filters, cuisine: c})} />
          <FilterRow title="Cook Time" options={TIMES} active={filters.time} onSelect={(t) => setFilters({...filters, time: t})} />
        </View>
      </ScrollView>

      {/* Floating Action Button for Finding Results */}
      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.findBtn} onPress={findRecipes}>
          <Text style={styles.findBtnText}>Find Recipes →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  const Results = () => (
    <SafeAreaView style={styles.safeArea}>
      <TopBar title="Recipe Ideas" showBack />
      <View style={styles.contextBanner}>
        <Text style={styles.contextText}>Using: {ingredients.join(', ')}</Text>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={GREEN} />
          <Text style={styles.loadingText}>Claude is thinking...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {recipes.map((r, i) => (
            <TouchableOpacity key={i} style={styles.recipeCard} onPress={() => { setSelectedRecipe(r); setScreen('detail'); }}>
              <View style={styles.recipeHeader}>
                <Text style={styles.recipeEmoji}>{r.emoji}</Text>
                <TouchableOpacity onPress={() => toggleSave(r)}>
                  <Text style={styles.heartIcon}>{savedRecipes.find(fav => fav.name === r.name) ? '💚' : '🤍'}</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.recipeName}>{r.name}</Text>
              <Text style={styles.recipeDesc} numberOfLines={2}>{r.desc}</Text>
              <View style={styles.recipeMeta}>
                <Text style={styles.recipeMetaText}>⏱ {r.time}   •   🍽 {r.diet}</Text>
              </View>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.retryBtn} onPress={findRecipes}>
            <Text style={styles.retryBtnText}>Try Different Recipes ↻</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );

  const Detail = () => (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: WHITE }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.detailHero}>
          <View style={styles.detailHeroNav}>
            <TouchableOpacity style={styles.detailBackBtn} onPress={() => setScreen('results')}>
              <Text style={{ fontSize: 20 }}>← Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.detailBackBtn} onPress={() => toggleSave(selectedRecipe)}>
              <Text style={{ fontSize: 20 }}>{savedRecipes.find(r => r.name === selectedRecipe.name) ? '💚' : '🤍'}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.detailEmoji}>{selectedRecipe.emoji}</Text>
          <Text style={styles.detailTitle}>{selectedRecipe.name}</Text>
          <Text style={styles.detailHeroDesc}>{selectedRecipe.desc}</Text>
        </View>

        <View style={styles.detailContent}>
          <View style={styles.pillRow}>
            <View style={styles.infoPill}><Text style={styles.infoPillText}>⏱ {selectedRecipe.time}</Text></View>
            <View style={styles.infoPill}><Text style={styles.infoPillText}>🔥 {selectedRecipe.difficulty}</Text></View>
            <View style={styles.infoPill}><Text style={styles.infoPillText}>🍽 {selectedRecipe.servings} serve</Text></View>
          </View>

          <Text style={styles.sectionHeader}>Ingredients</Text>
          <View style={styles.ingList}>
            {selectedRecipe.ingredients.map((ing, i) => (
              <View key={i} style={styles.ingItem}>
                <View style={styles.ingDot} />
                <Text style={styles.ingText}>{ing}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionHeader}>Steps</Text>
          <View style={styles.stepList}>
            {selectedRecipe.steps.map((step, i) => (
              <View key={i} style={styles.stepItem}>
                <View style={styles.stepCircle}>
                  <Text style={styles.stepNum}>{i + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionHeader}>Nutrition (Est.)</Text>
          <View style={styles.nutritionRow}>
            {Object.entries(selectedRecipe.nutrition).map(([k, v]) => (
              <View key={k} style={styles.nutriBox}>
                <Text style={styles.nutriVal}>{v}</Text>
                <Text style={styles.nutriLabel}>{k}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.detailBottomBar}>
        <TouchableOpacity 
          style={[styles.saveBtnFull, savedRecipes.find(r => r.name === selectedRecipe.name) && { backgroundColor: GREEN_DARK }]}
          onPress={() => toggleSave(selectedRecipe)}>
          <Text style={styles.saveBtnFullText}>
            {savedRecipes.find(r => r.name === selectedRecipe.name) ? '✔ Saved to Favorites' : 'Save Recipe'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  // --- Render Router ---
  return (
    <>
      <StatusBar barStyle={screen === 'splash' ? 'light-content' : 'dark-content'} />
      {screen === 'splash' && Splash()}
      {screen === 'auth' && Auth()}
      {screen === 'home' && Home()}
      {screen === 'results' && Results()}
      {screen === 'detail' && selectedRecipe && Detail()}

      {/* Side Nav overlay */}
      {navOpen && (
        <View style={styles.navOverlay}>
          <TouchableOpacity style={styles.navUnderlay} onPress={() => setNavOpen(false)} />
          <View style={styles.navDrawer}>
            <View style={styles.navHeader}>
              <Text style={styles.navTitle}>PantryPal</Text>
              <TouchableOpacity onPress={() => setNavOpen(false)}><Text style={{ fontSize: 20 }}>✕</Text></TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.navItem} onPress={() => { setScreen('home'); setNavOpen(false); }}>
              <Text style={styles.navItemText}>🏠 Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => { setNavOpen(false); }}>
              <Text style={styles.navItemText}>💚 Saved Recipes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => { setNavOpen(false); }}>
              <Text style={styles.navItemText}>⚙️ Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.navItem, { borderBottomWidth: 0 }]} onPress={handleSignOut}>
              <Text style={[styles.navItemText, { color: '#E53E3E' }]}>🚪 Sign Out</Text>
            </TouchableOpacity>
            
            <View style={styles.navProgress}>
              <Text style={styles.navItemText}>Cooking Progress</Text>
              <View style={{ marginTop: 10, alignItems: 'center' }}>
                <DonutChart pct={65} />
                <Text style={styles.navMuted}>Goal: 3 meals / week</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BG, paddingTop: Platform.OS === 'android' ? 30 : 0 },
  paddingH: { paddingHorizontal: 16 },
  
  // TopBar
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  topBarTitle: { fontFamily: 'DMSans-Bold', fontSize: 18, color: TEXT },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: GREEN_LIGHT, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: 'DMSans-Bold', color: GREEN_TEXT },

  // Splash
  splashContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  splashContent: { alignItems: 'center', marginBottom: 60 },
  splashEmoji: { fontSize: 80, marginBottom: 20 },
  splashTitle: { fontFamily: 'DMSans-Bold', fontSize: 42, color: WHITE, marginBottom: 10 },
  splashTagline: { fontFamily: 'DMSans-Regular', fontSize: 18, color: WHITE, textAlign: 'center', opacity: 0.9 },
  splashButton: { backgroundColor: WHITE, paddingVertical: 16, paddingHorizontal: 40, borderRadius: 30, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, elevation: 5 },
  splashButtonText: { fontFamily: 'DMSans-Bold', fontSize: 18, color: GREEN },

  // Home
  greetingContainer: { paddingHorizontal: 16, marginTop: 10, marginBottom: 20 },
  greetingText: { fontFamily: 'DMSans-Bold', fontSize: 24, color: TEXT },
  heroCard: { borderRadius: 22, padding: 20, shadowColor: GREEN_DARK, shadowOpacity: 0.3, shadowRadius: 15, elevation: 6 },
  heroTag: { fontFamily: 'DMSans-Medium', fontSize: 12, color: WHITE, opacity: 0.8, marginBottom: 8 },
  heroTitle: { fontFamily: 'Lora-BoldItalic', fontSize: 22, color: WHITE, marginBottom: 8 },
  heroDesc: { fontFamily: 'DMSans-Regular', fontSize: 14, color: WHITE, opacity: 0.9 },
  
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  statBox: { flex: 0.48, borderRadius: 16, padding: 16, backgroundColor: WHITE, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  statNum: { fontFamily: 'DMSans-Bold', fontSize: 28, marginBottom: 4 },
  statLabel: { fontFamily: 'DMSans-Medium', fontSize: 12, color: MUTED },

  sectionTitle: { fontFamily: 'DMSans-Bold', fontSize: 18, color: TEXT, marginBottom: 12 },
  
  // Form
  formInput: { backgroundColor: WHITE, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 16, fontFamily: 'DMSans-Regular', fontSize: 16, color: TEXT, borderWidth: 1, borderColor: BORDER },
  inputLabel: { fontFamily: 'DMSans-Medium', fontSize: 14, color: TEXT, marginBottom: 8 },

  inputContainer: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  input: { flex: 1, backgroundColor: WHITE, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontFamily: 'DMSans-Regular', fontSize: 16, color: TEXT, shadowColor: '#000', shadowOpacity: 0.05, elevation: 2 },
  addButton: { backgroundColor: GREEN, borderRadius: 12, paddingHorizontal: 20, justifyContent: 'center' },
  addButtonText: { fontFamily: 'DMSans-Bold', color: WHITE },

  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  ingChip: { backgroundColor: GREEN, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20 },
  ingChipText: { fontFamily: 'DMSans-Medium', color: WHITE, fontSize: 14 },
  
  quickAddLabel: { fontFamily: 'DMSans-Medium', fontSize: 13, color: MUTED, marginBottom: 8 },
  quickAddBtn: { backgroundColor: WHITE, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, marginRight: 8, borderWidth: 1, borderColor: BORDER },
  quickAddBtnText: { fontFamily: 'DMSans-Medium', color: TEXT, fontSize: 13 },

  filterSection: { marginBottom: 20 },
  filterLabel: { fontFamily: 'DMSans-Bold', fontSize: 16, color: TEXT, paddingHorizontal: 16, marginBottom: 10 },
  filterChip: { backgroundColor: WHITE, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: BORDER },
  filterChipActive: { backgroundColor: GREEN_LIGHT, borderColor: GREEN },
  filterChipText: { fontFamily: 'DMSans-Medium', color: MUTED, fontSize: 14 },
  filterChipTextActive: { color: GREEN_TEXT },

  fabContainer: { position: 'absolute', bottom: 30, left: 0, right: 0, alignItems: 'center' },
  findBtn: { backgroundColor: GREEN, paddingVertical: 16, paddingHorizontal: 40, borderRadius: 25, shadowColor: GREEN_DARK, shadowOpacity: 0.4, shadowRadius: 15, elevation: 8 },
  findBtnText: { fontFamily: 'DMSans-Bold', fontSize: 18, color: WHITE },

  // Results
  contextBanner: { backgroundColor: GREEN_LIGHT, padding: 12, marginHorizontal: 16, borderRadius: 12, marginBottom: 16 },
  contextText: { fontFamily: 'DMSans-Medium', color: GREEN_TEXT, fontSize: 13, textAlign: 'center' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontFamily: 'DMSans-Medium', marginTop: 16, color: GREEN, fontSize: 16 },
  recipeCard: { backgroundColor: WHITE, padding: 16, borderRadius: 18, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 3 },
  recipeHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  recipeEmoji: { fontSize: 32 },
  heartIcon: { fontSize: 24 },
  recipeName: { fontFamily: 'Lora-Bold', fontSize: 18, color: TEXT, marginBottom: 6 },
  recipeDesc: { fontFamily: 'DMSans-Regular', fontSize: 14, color: MUTED, marginBottom: 12, lineHeight: 20 },
  recipeMeta: { flexDirection: 'row', alignItems: 'center' },
  recipeMetaText: { fontFamily: 'DMSans-Medium', fontSize: 12, color: TEXT, backgroundColor: BG, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 10 },
  retryBtn: { marginTop: 10, alignItems: 'center', padding: 16 },
  retryBtnText: { fontFamily: 'DMSans-Bold', color: GREEN, fontSize: 16 },

  // Details
  detailHero: { backgroundColor: GREEN_LIGHT, padding: 20, paddingBottom: 40, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  detailHeroNav: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  detailBackBtn: { backgroundColor: WHITE, padding: 8, borderRadius: 20, paddingHorizontal: 16 },
  detailEmoji: { fontSize: 50, marginBottom: 12 },
  detailTitle: { fontFamily: 'Lora-Bold', fontSize: 28, color: TEXT, marginBottom: 8 },
  detailHeroDesc: { fontFamily: 'DMSans-Regular', fontSize: 16, color: TEXT, opacity: 0.8, lineHeight: 24 },
  
  detailContent: { padding: 20, top: -20 },
  pillRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  infoPill: { backgroundColor: WHITE, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  infoPillText: { fontFamily: 'DMSans-Medium', fontSize: 13, color: TEXT },
  
  sectionHeader: { fontFamily: 'DMSans-Bold', fontSize: 20, color: TEXT, marginTop: 10, marginBottom: 16 },
  ingList: { backgroundColor: WHITE, padding: 16, borderRadius: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  ingItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  ingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: GREEN, marginRight: 12 },
  ingText: { fontFamily: 'DMSans-Regular', fontSize: 15, color: TEXT },

  stepList: { marginBottom: 16 },
  stepItem: { flexDirection: 'row', marginBottom: 16, backgroundColor: WHITE, padding: 16, borderRadius: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  stepCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: GREEN_LIGHT, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  stepNum: { fontFamily: 'DMSans-Bold', color: GREEN_TEXT, fontSize: 14 },
  stepText: { flex: 1, fontFamily: 'DMSans-Regular', fontSize: 15, color: TEXT, lineHeight: 22 },

  nutritionRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: WHITE, padding: 16, borderRadius: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  nutriBox: { alignItems: 'center' },
  nutriVal: { fontFamily: 'DMSans-Bold', fontSize: 16, color: GREEN, marginBottom: 4 },
  nutriLabel: { fontFamily: 'DMSans-Medium', fontSize: 12, color: MUTED, textTransform: 'capitalize' },

  detailBottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: WHITE, borderTopWidth: 1, borderColor: BORDER },
  saveBtnFull: { backgroundColor: GREEN, paddingVertical: 18, borderRadius: 16, alignItems: 'center' },
  saveBtnFullText: { fontFamily: 'DMSans-Bold', fontSize: 16, color: WHITE },

  // Nav Drawer
  navOverlay: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, flexDirection: 'row' },
  navUnderlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  navDrawer: { width: width * 0.75, backgroundColor: WHITE, height: '100%', padding: 20, paddingTop: Platform.OS === 'android' ? 50 : 60, position: 'absolute', left: 0, borderTopRightRadius: 28, borderBottomRightRadius: 28, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 15, elevation: 20 },
  navHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 },
  navTitle: { fontFamily: 'DMSans-Bold', fontSize: 22, color: TEXT },
  navItem: { paddingVertical: 16, borderBottomWidth: 1, borderColor: BORDER },
  navItemText: { fontFamily: 'DMSans-Medium', fontSize: 18, color: TEXT },
  navProgress: { marginTop: 40, alignItems: 'center', backgroundColor: BG, padding: 20, borderRadius: 16 },
  navMuted: { fontFamily: 'DMSans-Regular', fontSize: 12, color: MUTED, marginTop: 8 },

  donutTextContainer: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, justifyContent: 'center', alignItems: 'center' },
  donutText: { fontFamily: 'DMSans-Bold', fontSize: 14, color: TEXT },
});
