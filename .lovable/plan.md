

# Add Real Product Photos and Nature Design Elements

## What will change

### 1. Generate Real-Looking Product Images (AI-Generated)
Use the AI image generation API to create realistic photos for all 7 products and the hero background:
- **Janthikalu** - crispy spiral rice flour snack on a traditional plate
- **Bellam Gavvalu** - shell-shaped jaggery sweets
- **Kobbari Laddu** - coconut laddus on a brass plate
- **Boondi Laddu** - golden boondi laddus
- **Tomato Pickle** - red tomato pickle in a clay jar
- **Cauliflower Pickle** - cauliflower pickle in traditional bowl
- **Chicken Pickle** - spicy chicken pickle
- **Hero background** - traditional Andhra food spread with natural greenery

### 2. Add Nature-Themed Design Sections to Homepage
Add decorative nature elements to the homepage:
- A **nature banner section** between Best Sellers and All Products with a lush green/farm background image and text like "From Farm to Your Table"
- Subtle **leaf/botanical decorative elements** in section dividers
- A **"Why Choose Us"** section with nature-inspired icons (leaf, sun, farm) highlighting organic/natural ingredients

### 3. Files to Modify
- `src/assets/` - Replace all 8 image files with AI-generated realistic photos
- `src/pages/Index.tsx` - Add nature banner section and "Why Choose Us" section
- `src/components/HeroSection.tsx` - Update with new hero image featuring nature elements

### Technical Details
- Use `google/gemini-2.5-flash-image` model to generate each product image with detailed prompts for realistic Indian food photography
- Save generated images as base64 to replace existing asset files
- Add new sections using existing Tailwind theme colors and typography classes
- Nature sections will use green accent tones alongside the existing maroon/cream palette

