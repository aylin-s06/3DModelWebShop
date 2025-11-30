# Product Images - Image URLs Reference

This document contains image URLs that can be used for products in the 3D Web Shop.

## Free Image Sources

### Lorem Picsum (Recommended - Always Works)
- **Base URL**: `https://picsum.photos/800/600?random=[NUMBER]`
- **Usage**: Replace `[NUMBER]` with unique number for each image
- **Example**: `https://picsum.photos/800/600?random=1`
- **Advantages**: Always loads, fast, reliable, different image per number

### Placeholder Services
- **Placeholder.com**: `https://via.placeholder.com/800x600/000000/FFFFFF?text=Product+Image`
- **Picsum Photos (No random)**: `https://picsum.photos/800/600` (same image always)
- **Lorem Picsum**: `https://loremflickr.com/800/600/3dprinting` (category-based)

### Unsplash (Alternative)
- **Base URL**: `https://images.unsplash.com/photo-[ID]?w=800&h=600&fit=crop`
- **Usage**: Replace `[ID]` with the photo ID from Unsplash
- **Example**: `https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop`
- **Note**: May require API key for production use

## Sample Product Images (Working URLs)

### Using Lorem Picsum (Recommended)
All images use unique random numbers to ensure different images per product:

- **Product 1 (Robot)**: 
  - Main: `https://picsum.photos/800/600?random=1`
  - Image 1: `https://picsum.photos/800/600?random=11`
  - Image 2: `https://picsum.photos/800/600?random=12`
  - Image 3: `https://picsum.photos/800/600?random=13`

- **Product 2 (Vase)**: 
  - Main: `https://picsum.photos/800/600?random=2`
  - Image 1: `https://picsum.photos/800/600?random=21`
  - Image 2: `https://picsum.photos/800/600?random=22`

- **Product 3 (Phone Stand)**: 
  - Main: `https://picsum.photos/800/600?random=3`
  - Image 1: `https://picsum.photos/800/600?random=31`
  - Image 2: `https://picsum.photos/800/600?random=32`

### Alternative: Placeholder with Text
- `https://via.placeholder.com/800x600/4A90E2/FFFFFF?text=3D+Printed+Robot`
- `https://via.placeholder.com/800x600/50C878/FFFFFF?text=3D+Printed+Vase`
- `https://via.placeholder.com/800x600/FF6B6B/FFFFFF?text=3D+Printed+Phone+Stand`

### Alternative: Category-based Images
- `https://loremflickr.com/800/600/robot`
- `https://loremflickr.com/800/600/vase`
- `https://loremflickr.com/800/600/phone`

## Image URL Parameters

### Lorem Picsum URL Parameters
- `800/600` - Width x Height in pixels
- `?random=[NUMBER]` - Unique seed for different images
- **Example**: `https://picsum.photos/800/600?random=1`

### Different Sizes
```
Thumbnail: https://picsum.photos/300/300?random=1
Medium: https://picsum.photos/600/600?random=1
Large: https://picsum.photos/1200/1200?random=1
Square: https://picsum.photos/800/800?random=1
```

### Placeholder.com Parameters
- `800x600` - Dimensions
- `/[COLOR]/[TEXT_COLOR]` - Background and text colors
- `?text=Text+Here` - Custom text
- **Example**: `https://via.placeholder.com/800x600/4A90E2/FFFFFF?text=Product`

## How to Add Images to Products

1. **Via Admin Panel**: 
   - Go to Admin Dashboard → Products → Edit Product
   - Add image URLs in the "Image URLs" field (one per line)

2. **Via Database**:
   - Use the `data.sql` file to insert products with images
   - Or manually insert into `product_images` table

3. **Via API**:
   - POST to `/api/products/{id}` with images array in the request body

## Notes

- All images should be publicly accessible URLs
- Recommended image size: 800x600 pixels for product listings
- Main product image should be set in `main_image_url` field
- Additional images are stored in `product_images` table
- Images are displayed in order based on `order_index` field

