import json
import os

recipes = [
    {
        'name': 'Tomato Egg Fried Rice',
        'emoji': '🍳',
        'desc': 'A quick and comforting meal using basic pantry staples.',
        'time': '15 min',
        'diet': 'Vegetarian',
        'difficulty': 'Easy',
        'servings': '1',
        'ingredients': ['1 cup cooked rice', '2 eggs', '1 large tomato, diced', '1 tbsp oil', 'Salt to taste'],
        'steps': ['Beat the eggs in a bowl with a pinch of salt.', 'Heat oil in a pan, scramble eggs, remove and set aside.', 'Add tomatoes to pan and cook until soft.', 'Add rice and mix well.', 'Return eggs into the pan, toss together and serve hot.'],
        'nutrition': { 'kcal': 350, 'protein': '15g', 'carbs': '45g', 'fat': '12g' }
    },
    {
        'name': 'Classic Tomato Omelette',
        'emoji': '🍅',
        'desc': 'A fluffy omelette filled with fresh tomatoes, perfect for breakfast.',
        'time': '10 min',
        'diet': 'Vegetarian',
        'difficulty': 'Easy',
        'servings': '1',
        'ingredients': ['2 eggs', '1/2 tomato, diced', 'Salt & pepper', '1 tsp butter'],
        'steps': ['Whisk eggs, salt, and pepper.', 'Melt butter in a skillet over medium heat.', 'Pour in eggs, let set slightly, then add tomatoes on one side.', 'Fold omelette over and cook to desired doneness.'],
        'nutrition': { 'kcal': 200, 'protein': '12g', 'carbs': '4g', 'fat': '14g' }
    },
    {
        'name': 'Savory Tomato Rice Bowl',
        'emoji': '🍚',
        'desc': 'A super simple bowl blending the umami of tomatoes and egg over rice.',
        'time': '20 min',
        'diet': 'Vegetarian',
        'difficulty': 'Intermediate',
        'servings': '1',
        'ingredients': ['1 cup rice', '1 egg', '2 tomatoes', 'Soy sauce (optional)', 'Green onion'],
        'steps': ['Cook rice according to instructions.', 'Fry an egg sunny side up.', 'Sauté diced tomatoes until they form a sauce.', 'Serve tomatoes over rice, topped with the fried egg.'],
        'nutrition': { 'kcal': 400, 'protein': '10g', 'carbs': '50g', 'fat': '10g' }
    },
    {
        'name': 'Garlic Butter Rice',
        'emoji': '🧄',
        'desc': 'A flavorful and rich side dish or simple meal.',
        'time': '15 min',
        'diet': 'Vegetarian',
        'difficulty': 'Easy',
        'servings': '2',
        'ingredients': ['2 cups cooked rice', '4 cloves garlic, minced', '2 tbsp butter', 'Salt to taste', 'Cilantro for garnish'],
        'steps': ['Melt butter in a pan.', 'Sauté minced garlic until fragrant.', 'Add cooked rice and mix thoroughly.', 'Season with salt and garnish with cilantro.'],
        'nutrition': { 'kcal': 320, 'protein': '5g', 'carbs': '45g', 'fat': '14g' }
    },
    {
        'name': 'Simple Dal Tadka',
        'emoji': '🍲',
        'desc': 'A staple Indian comfort food made with lentils and tempered spices.',
        'time': '30 min',
        'diet': 'Vegan',
        'difficulty': 'Intermediate',
        'servings': '4',
        'ingredients': ['1 cup yellow lentils (Toor Dal)', '1 onion, chopped', '1 tomato, chopped', '1 tsp cumin seeds', '1/2 tsp turmeric'],
        'steps': ['Boil lentils with turmeric and salt until soft.', 'Heat oil in a pan, add cumin seeds.', 'Sauté onions and tomatoes until soft.', 'Mix the tempered spices into the cooked lentils.'],
        'nutrition': { 'kcal': 250, 'protein': '14g', 'carbs': '35g', 'fat': '5g' }
    },
    {
        'name': 'Aloo Bhujia (Potato Stir-fry)',
        'emoji': '🥔',
        'desc': 'Crispy and spicy potato stir-fry, a Nepali household favorite.',
        'time': '20 min',
        'diet': 'Vegan',
        'difficulty': 'Easy',
        'servings': '2',
        'ingredients': ['3 potatoes, thinly sliced', '1 onion, sliced', '1/2 tsp turmeric', '1/2 tsp cumin powder', '2 tbsp oil'],
        'steps': ['Heat oil in a pan.', 'Add onions and sauté until translucent.', 'Add potatoes, turmeric, cumin, and salt.', 'Cook uncovered until crispy and tender.'],
        'nutrition': { 'kcal': 210, 'protein': '4g', 'carbs': '30g', 'fat': '9g' }
    },
    {
        'name': 'Chicken Curry (Nepali Style)',
        'emoji': '🍗',
        'desc': 'A rustic and hearty chicken curry perfect with rice.',
        'time': '45 min',
        'diet': 'Non-veg',
        'difficulty': 'Intermediate',
        'servings': '4',
        'ingredients': ['500g chicken, cut into pieces', '2 onions, finely chopped', '2 tomatoes, puréed', '1 tbsp ginger-garlic paste', 'Chicken masala powder'],
        'steps': ['Sauté onions until golden brown.', 'Add ginger-garlic paste and stir.', 'Add chicken pieces and brown them.', 'Mix in tomatoes and spices, simmer until cooked.'],
        'nutrition': { 'kcal': 350, 'protein': '28g', 'carbs': '10g', 'fat': '20g' }
    },
    {
        'name': 'Pasta Aglio e Olio',
        'emoji': '🍝',
        'desc': 'A classic Italian spaghetti dish with garlic and olive oil.',
        'time': '15 min',
        'diet': 'Vegan',
        'difficulty': 'Easy',
        'servings': '2',
        'ingredients': ['200g spaghetti', '4 cloves garlic, thinly sliced', '1/4 cup olive oil', 'Red pepper flakes', 'Parsley'],
        'steps': ['Boil pasta in salted water until al dente.', 'In a pan, gently sauté garlic in olive oil.', 'Add red pepper flakes.', 'Toss pasta in the oil with a bit of pasta water. Garnish with parsley.'],
        'nutrition': { 'kcal': 450, 'protein': '10g', 'carbs': '60g', 'fat': '18g' }
    },
    {
        'name': 'Masala Omelette',
        'emoji': '🍳',
        'desc': 'A spicy Indian-style omelette with onions, tomatoes, and chilies.',
        'time': '10 min',
        'diet': 'Vegetarian',
        'difficulty': 'Easy',
        'servings': '1',
        'ingredients': ['2 eggs', '1/4 onion, finely chopped', '1/4 tomato, finely chopped', '1 green chili, chopped', 'Pinch of turmeric'],
        'steps': ['Whisk eggs with all ingredients and salt.', 'Heat oil in a pan.', 'Pour mixture and spread evenly.', 'Cook both sides until golden brown.'],
        'nutrition': { 'kcal': 220, 'protein': '13g', 'carbs': '5g', 'fat': '15g' }
    },
    {
        'name': 'Vegetable Fried Rice',
        'emoji': '🍚',
        'desc': 'A quick stir-fried rice with assorted crispy vegetables.',
        'time': '20 min',
        'diet': 'Vegan',
        'difficulty': 'Easy',
        'servings': '2',
        'ingredients': ['2 cups day-old cooked rice', '1 cup mixed veggies (carrots, peas, beans)', '2 cloves garlic, minced', '2 tbsp soy sauce', '1 tbsp oil'],
        'steps': ['Heat oil in a wok and sauté garlic.', 'Add mixed vegetables and stir-fry until tender.', 'Add rice and soy sauce.', 'Toss well on high heat for 3 minutes.'],
        'nutrition': { 'kcal': 310, 'protein': '6g', 'carbs': '55g', 'fat': '8g' }
    },
    {
        'name': 'Tomato Soup',
        'emoji': '🥣',
        'desc': 'Warm, comforting, and simple tomato soup.',
        'time': '25 min',
        'diet': 'Vegetarian',
        'difficulty': 'Easy',
        'servings': '2',
        'ingredients': ['4 large tomatoes', '1/2 onion, chopped', '2 cloves garlic', '1 cup vegetable broth', '1 tbsp butter'],
        'steps': ['Roast or sauté tomatoes, onion, and garlic with butter.', 'Add vegetable broth and simmer for 15 minutes.', 'Blend until smooth.', 'Season with salt and pepper.'],
        'nutrition': { 'kcal': 150, 'protein': '4g', 'carbs': '20g', 'fat': '7g' }
    },
    {
        'name': 'Spicy Garlic Noodles',
        'emoji': '🍜',
        'desc': 'Slurpy noodles tossed in a savory and spicy garlic sauce.',
        'time': '15 min',
        'diet': 'Vegan',
        'difficulty': 'Easy',
        'servings': '2',
        'ingredients': ['200g noodles', '4 cloves garlic, minced', '2 tbsp soy sauce', '1 tbsp chili sauce', '1 tsp sesame oil'],
        'steps': ['Boil noodles as per packet instructions.', 'Heat oil in a pan and sauté garlic.', 'Mix in soy sauce, chili sauce, and sesame oil.', 'Toss the noodles in the sauce.'],
        'nutrition': { 'kcal': 380, 'protein': '12g', 'carbs': '65g', 'fat': '10g' }
    },
    {
        'name': 'Egg Curry',
        'emoji': '🥘',
        'desc': 'Hard-boiled eggs simmered in a spiced onion-tomato gravy.',
        'time': '30 min',
        'diet': 'Non-veg',
        'difficulty': 'Intermediate',
        'servings': '2',
        'ingredients': ['4 hard-boiled eggs', '1 large onion, pureed', '2 tomatoes, pureed', '1 tsp garam masala', '2 tbsp oil'],
        'steps': ['Make small slits on eggs and lightly fry them, set aside.', 'Sauté onion and tomato purees with oil.', 'Add garam masala and salt, cook until oil separates.', 'Add water to form a gravy, add eggs, and simmer.'],
        'nutrition': { 'kcal': 280, 'protein': '14g', 'carbs': '12g', 'fat': '19g' }
    },
    {
        'name': 'Aloo Gobi',
        'emoji': '🥦',
        'desc': 'A classic Indian vegetarian dish consisting of potatoes and cauliflower.',
        'time': '30 min',
        'diet': 'Vegan',
        'difficulty': 'Intermediate',
        'servings': '3',
        'ingredients': ['1 cauliflower, cut into florets', '2 potatoes, cubed', '1/2 tsp cumin seeds', '1/2 tsp turmeric', '1 tsp coriander powder'],
        'steps': ['Heat oil, add cumin seeds.', 'Add potatoes and cauliflower florets with turmeric and salt.', 'Cover and cook on low heat until tender.', 'Add coriander powder and toss.'],
        'nutrition': { 'kcal': 180, 'protein': '5g', 'carbs': '25g', 'fat': '7g' }
    },
    {
        'name': 'Spinach Dal',
        'emoji': '🌿',
        'desc': 'Lentils cooked with fresh spinach for a nutritious meal.',
        'time': '35 min',
        'diet': 'Vegan',
        'difficulty': 'Intermediate',
        'servings': '4',
        'ingredients': ['1 cup lentils (Masoor/Toor)', '2 cups chopped spinach', '1 tomato, chopped', '2 cloves garlic', '1/2 tsp mustard seeds'],
        'steps': ['Boil lentils until cooked.', 'In another pan, temper mustard seeds and garlic in oil.', 'Add tomatoes and spinach, cook until wilted.', 'Mix into the cooked dal.'],
        'nutrition': { 'kcal': 220, 'protein': '16g', 'carbs': '35g', 'fat': '4g' }
    },
    {
        'name': 'Chicken Fried Rice',
        'emoji': '🍗',
        'desc': 'A flavorful mix of rice, chicken chunks, and veggies.',
        'time': '25 min',
        'diet': 'Non-veg',
        'difficulty': 'Easy',
        'servings': '2',
        'ingredients': ['2 cups cooked rice', '150g chicken breast, cubed', '1/2 cup veggies', '2 tbsp soy sauce', '1/2 tsp black pepper'],
        'steps': ['Stir fry chicken cubes until cooked.', 'Add vegetables and sauté.', 'Add rice, soy sauce, and black pepper.', 'Stir fry on high heat until well mixed.'],
        'nutrition': { 'kcal': 400, 'protein': '25g', 'carbs': '45g', 'fat': '12g' }
    },
    {
        'name': 'Lemon Rice',
        'emoji': '🍋',
        'desc': 'Tangy southern Indian style rice with a crunchy tempering.',
        'time': '15 min',
        'diet': 'Vegan',
        'difficulty': 'Easy',
        'servings': '2',
        'ingredients': ['2 cups cooked rice', '2 tbsp lemon juice', '1 tsp mustard seeds', '2 tbsp peanuts', '1/4 tsp turmeric'],
        'steps': ['Heat oil, add mustard seeds and peanuts, roast until crunchy.', 'Add turmeric and turn off heat.', 'Pour the tempering over cooked rice.', 'Mix well with lemon juice and salt.'],
        'nutrition': { 'kcal': 330, 'protein': '7g', 'carbs': '48g', 'fat': '12g' }
    },
    {
        'name': 'Potato Curry (Aloo Tarkari)',
        'emoji': '🥔',
        'desc': 'A simple, mildly spiced saucy potato dish.',
        'time': '25 min',
        'diet': 'Vegan',
        'difficulty': 'Easy',
        'servings': '2',
        'ingredients': ['3 potatoes, boiled and cubed', '1 tomato, chopped', '1/4 tsp fenugreek seeds', '1/2 tsp turmeric', '1.5 cups water'],
        'steps': ['Heat oil, crackle fenugreek seeds.', 'Add tomatoes and turmeric, cook until soft.', 'Add potatoes and mash slightly.', 'Pour water, bring to boil, and simmer to a thick gravy.'],
        'nutrition': { 'kcal': 190, 'protein': '4g', 'carbs': '33g', 'fat': '5g' }
    },
    {
        'name': 'Black Chickpea Curry (Kala Chana)',
        'emoji': '🍛',
        'desc': 'A protein-rich and robust curry made of black chickpeas.',
        'time': '40 min',
        'diet': 'Vegan',
        'difficulty': 'Intermediate',
        'servings': '3',
        'ingredients': ['1 cup black chickpeas (soaked overnight)', '1 onion, chopped', '1 tomato, chopped', '1 tsp cumin powder', 'Fresh coriander'],
        'steps': ['Pressure cook the chickpeas until tender.', 'Sauté onions and tomatoes with spices.', 'Add the boiled chickpeas along with its water.', 'Simmer for 10 minutes and garnish with coriander.'],
        'nutrition': { 'kcal': 270, 'protein': '15g', 'carbs': '45g', 'fat': '4g' }
    },
    {
        'name': 'Paneer Bhurji',
        'emoji': '🧀',
        'desc': 'Spiced scrambled Indian cottage cheese.',
        'time': '15 min',
        'diet': 'Vegetarian',
        'difficulty': 'Easy',
        'servings': '2',
        'ingredients': ['200g crumbled paneer', '1 onion, chopped', '1 tomato, chopped', '1/2 tsp garam masala', '1 tbsp butter'],
        'steps': ['Melt butter in a pan.', 'Sauté chopped onion and tomato until mushy.', 'Add spices and crumbled paneer.', 'Mix gently and cook for 2-3 minutes.'],
        'nutrition': { 'kcal': 320, 'protein': '18g', 'carbs': '8g', 'fat': '24g' }
    },
    {
        'name': 'Mushroom Matar',
        'emoji': '🍄',
        'desc': 'Earthy mushrooms and sweet peas cooked in a rich gravy.',
        'time': '30 min',
        'diet': 'Vegan',
        'difficulty': 'Intermediate',
        'servings': '3',
        'ingredients': ['200g mushrooms, sliced', '1 cup green peas', '2 onions, pureed', '2 tomatoes, pureed', 'Cashew paste (optional)'],
        'steps': ['Sauté mushrooms until browned and set aside.', 'Cook onion puree and tomato puree with spices until oil separates.', 'Add peas, mushrooms, and water.', 'Simmer for 10 minutes (stir in cashew paste if using).'],
        'nutrition': { 'kcal': 180, 'protein': '6g', 'carbs': '16g', 'fat': '10g' }
    },
    {
        'name': 'Beef Steak with Garlic Butter',
        'emoji': '🥩',
        'desc': 'Juicy pan-seared steak bathed in rich garlic butter.',
        'time': '20 min',
        'diet': 'Non-veg',
        'difficulty': 'Intermediate',
        'servings': '2',
        'ingredients': ['2 beef steaks (Sirloin/Ribeye)', '3 tbsp butter', '4 cloves garlic, crushed', 'Rosemary sprigs', 'Salt and pepper'],
        'steps': ['Season steaks generously with salt and pepper.', 'Heat oil in a skillet until smoking hot.', 'Sear steaks for 3-4 minutes per side.', 'Add butter, garlic, and rosemary; baste the steak constantly.', 'Rest for 5 minutes before slicing.'],
        'nutrition': { 'kcal': 550, 'protein': '45g', 'carbs': '2g', 'fat': '40g' }
    },
    {
        'name': 'Chilli Chicken',
        'emoji': '🌶️',
        'desc': 'Spicy, tangy, and slightly sweet Indo-Chinese chicken dish.',
        'time': '35 min',
        'diet': 'Non-veg',
        'difficulty': 'Intermediate',
        'servings': '3',
        'ingredients': ['300g boneless chicken, diced', '1 bell pepper, cubed', '1 onion, cubed', '2 tbsp soy sauce', '1 tbsp chilli sauce', '2 tbsp cornstarch'],
        'steps': ['Marinate chicken in soy sauce and coat with cornstarch, then fry until crispy.', 'Sauté onion and bell pepper in oil.', 'Add sauces and toss.', 'Add fried chicken and mix well until coated.'],
        'nutrition': { 'kcal': 420, 'protein': '28g', 'carbs': '20g', 'fat': '25g' }
    },
    {
        'name': 'Pork Belly Stir-fry',
        'emoji': '🥓',
        'desc': 'Crispy pork belly strips stir-fried with garlic and soy.',
        'time': '25 min',
        'diet': 'Non-veg',
        'difficulty': 'Intermediate',
        'servings': '2',
        'ingredients': ['300g pork belly, sliced thinly', '3 cloves garlic, minced', '1 tbsp soy sauce', '1/2 tsp sugar', 'Spring onions'],
        'steps': ['Cook pork belly slices in a pan without oil until golden and fat has rendered.', 'Drain excess fat if preferred.', 'Add garlic and stir until fragrant.', 'Add soy sauce and sugar, cook until caramelized.', 'Garnish with spring onions.'],
        'nutrition': { 'kcal': 600, 'protein': '20g', 'carbs': '5g', 'fat': '55g' }
    },
    {
        'name': 'Mutton Curry (Nepali Style)',
        'emoji': '🍲',
        'desc': 'Slow-cooked goat meat in a traditional rich and spicy gravy.',
        'time': '90 min',
        'diet': 'Non-veg',
        'difficulty': 'Hard',
        'servings': '4',
        'ingredients': ['500g mutton/goat meat', '3 onions, finely chopped', '2 tomatoes, chopped', '2 tbsp ginger-garlic paste', 'Meat masala powder'],
        'steps': ['Heat oil and sauté onions until dark brown.', 'Add ginger-garlic paste and meat, fry well for 15 minutes.', 'Add tomatoes and spices, cook until oil separates.', 'Add water and slow cook for an hour or pressure cook for 5-6 whistles until meat is tender.'],
        'nutrition': { 'kcal': 480, 'protein': '35g', 'carbs': '10g', 'fat': '32g' }
    },
    {
        'name': 'Garlic Butter Mussels',
        'emoji': '🦪',
        'desc': 'Fresh mussels steamed in a fragrant garlic, butter, and white wine sauce.',
        'time': '20 min',
        'diet': 'Non-veg',
        'difficulty': 'Intermediate',
        'servings': '2',
        'ingredients': ['500g mussels, cleaned', '3 tbsp butter', '4 cloves garlic, minced', '1/4 cup broth or white wine', 'Parsley'],
        'steps': ['Melt butter in a large pot and sauté garlic.', 'Add mussels and broth.', 'Cover the pot and let steam for 5-7 minutes until all mussels open.', 'Discard any that do not open. Garnish with parsley and serve with crusty bread.'],
        'nutrition': { 'kcal': 350, 'protein': '22g', 'carbs': '8g', 'fat': '24g' }
    },
    {
        'name': 'Spicy Meatballs',
        'emoji': '🍝',
        'desc': 'Homemade ground beef meatballs in a rich marinara sauce.',
        'time': '40 min',
        'diet': 'Non-veg',
        'difficulty': 'Intermediate',
        'servings': '4',
        'ingredients': ['400g ground beef', '1/4 cup breadcrumbs', '1 egg', '1/2 cup parmesan cheese', '2 cups marinara sauce'],
        'steps': ['Mix ground beef, breadcrumbs, egg, salt, pepper, and cheese.', 'Form into 1.5 inch balls.', 'Brown meatballs in a skillet with oil.', 'Pour marinara sauce over them and simmer for 20 minutes until cooked through.'],
        'nutrition': { 'kcal': 450, 'protein': '30g', 'carbs': '15g', 'fat': '28g' }
    },
    {
        'name': 'Grilled Lamb Chops',
        'emoji': '🥩',
        'desc': 'Tender lamb chops marinated in rosemary and garlic, then grilled to perfection.',
        'time': '30 min',
        'diet': 'Non-veg',
        'difficulty': 'Intermediate',
        'servings': '2',
        'ingredients': ['4 lamb chops', '2 tbsp olive oil', '3 cloves garlic, crushed', 'Fresh rosemary', 'Salt & pepper'],
        'steps': ['Marinate lamb chops with oil, garlic, rosemary, salt, and pepper for at least 15 minutes.', 'Heat a grill or grill pan over high heat.', 'Grill chops for 3-4 minutes per side for medium-rare.', 'Let them rest before serving.'],
        'nutrition': { 'kcal': 520, 'protein': '35g', 'carbs': '2g', 'fat': '40g' }
    }
]

app_js_path = r'c:\Users\NITRO\Documents\HW App\PantryPal\App.js'

with open(app_js_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Update App.js
start_marker = "      setRecipes(["
start_idx = content.find(start_marker)

import re

if start_idx != -1:
    end_idx = content.find("      ]);", start_idx) + len("      ]);")
    recipes_json_str = json.dumps(recipes, indent=8)
    replacement_str = f"      setRecipes({recipes_json_str});"
    new_content = content[:start_idx] + replacement_str + content[end_idx:]
    with open(app_js_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('Updated App.js successfully.')

# Update app.html
app_html_path = r'c:\Users\NITRO\Documents\HW App\PantryPal\app.html'

cards_html = ""
for r in recipes:
    tag_class = "dtag veg" if r['diet'] == 'Vegan' else ("dtag" if r['diet'] == 'Vegetarian' else "dtag veg")
    if r['diet'] == 'Non-veg':
        tag_class = "dtag veg" # You can use any class, just reusing veg for visual style or modifying it in css. But wait, dtag without veg is green, veg is blue. I'll just use dtag for meat as well, it will be stylized somehow. Let's make it plain dtag.
        tag_class = "dtag"
    if r['diet'] == 'Vegan':
        tag_class = "dtag veg"

    # Some emojis don't render well or have different backgrounds. Let's randomly pick one.
    import random
    bg = random.choice(['g', 'a', 'p'])
    
    card = f"""    <div class="rcard" onclick="show('detail')">
      <div class="rthumb {bg}">{r['emoji']}</div>
      <div class="rinfo">
        <h4>{r['name']}</h4>
        <div class="rmeta">
          <span>{r['time']}</span><div class="ds"></div>
          <span>{r['difficulty']}</span><div class="ds"></div>
          <span class="{tag_class}">{r['diet']}</span>
          <button class="hrt">♡</button>
        </div>
      </div>
    </div>\n"""
    cards_html += card

with open(app_html_path, 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = '<div class="ctx"><span>Based on: rice · egg · tomato</span></div>\n'
end_marker = '    <div class="bnav">'

start_idx = content.find(start_marker)
if start_idx != -1:
    start_idx += len(start_marker)
    end_idx = content.find(end_marker, start_idx)
    new_content = content[:start_idx] + cards_html + content[end_idx:]
    with open(app_html_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('Updated app.html successfully.')

