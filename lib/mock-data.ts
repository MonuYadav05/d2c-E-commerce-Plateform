import { hash } from 'bcryptjs'
import prismadb from './db'

export async function seedDatabase () {
  try {
    // Check if we already have categories to avoid duplicate seeding
    const categoriesCount = await prismadb.category.count()

    if (categoriesCount > 0) {
      console.log('Database already seeded.')
      return
    }

    // Create categories
    const categories = await Promise.all([
      prismadb.category.create({
        data: {
          name: 'Fresh Fruits',
          slug: 'fresh-fruits',
          imageUrl:
            'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg'
        }
      }),
      prismadb.category.create({
        data: {
          name: 'Vegetables',
          slug: 'vegetables',
          imageUrl:
            'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg'
        }
      }),
      prismadb.category.create({
        data: {
          name: 'Dairy & Eggs',
          slug: 'dairy-eggs',
          imageUrl:
            'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg'
        }
      }),
      prismadb.category.create({
        data: {
          name: 'Bakery',
          slug: 'bakery',
          imageUrl:
            'https://images.pexels.com/photos/1070946/pexels-photo-1070946.jpeg'
        }
      }),
      prismadb.category.create({
        data: {
          name: 'Snacks',
          slug: 'snacks',
          imageUrl:
            'https://images.pexels.com/photos/1536871/pexels-photo-1536871.jpeg'
        }
      })
    ])

    // Create products for each category
    for (const category of categories) {
      await createProductsForCategory(category.id, category.name)
    }

    // Create test user
    const hashedPassword = await hash('password123', 10)

    await prismadb.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        hashedPassword
      }
    })

    console.log('Database seeding completed successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  }
}

async function createProductsForCategory (
  categoryId: string,
  categoryName: string
) {
  const productsData = getProductsData(categoryId, categoryName)

  for (const productData of productsData) {
    const product = await prismadb.product.create({
      data: {
        name: productData.name,
        slug: productData.slug,
        description: productData.description,
        price: productData.price,
        discount: productData.discount,
        stock: productData.stock,
        featured: productData.featured,
        categoryId: productData.categoryId
      }
    })

    // Create images for product
    for (const imageUrl of productData.imageUrls) {
      await prismadb.productImage.create({
        data: {
          url: imageUrl,
          productId: product.id
        }
      })
    }
  }
}

function getProductsData (categoryId: string, categoryName: string) {
  switch (categoryName) {
    case 'Fresh Fruits':
      return [
        {
          name: 'Fresh Apples',
          slug: 'fresh-apples',
          description:
            'Crisp and juicy apples freshly picked from organic farms. Rich in antioxidants and fiber, these apples are perfect for snacking or baking.',
          price: 149.99,
          discount: 0.1,
          stock: 100,
          featured: true,
          categoryId,
          imageUrls: [
            'https://images.pexels.com/photos/1453713/pexels-photo-1453713.jpeg',
            'https://images.pexels.com/photos/918643/pexels-photo-918643.jpeg'
          ]
        },
        {
          name: 'Organic Bananas',
          slug: 'organic-bananas',
          description:
            'Sweet and nutritious organic bananas. Excellent source of potassium and vitamin B6.',
          price: 79.99,
          discount: null,
          stock: 150,
          featured: false,
          categoryId,
          imageUrls: [
            'https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg',
            'https://images.pexels.com/photos/2116020/pexels-photo-2116020.jpeg'
          ]
        },
        {
          name: 'Sweet Oranges',
          slug: 'sweet-oranges',
          description:
            'Juicy and tangy oranges packed with vitamin C. Perfect for juicing or eating fresh.',
          price: 99.99,
          discount: 0.05,
          stock: 80,
          featured: true,
          categoryId,
          imageUrls: [
            'https://images.pexels.com/photos/691166/pexels-photo-691166.jpeg',
            'https://images.pexels.com/photos/327098/pexels-photo-327098.jpeg'
          ]
        }
      ]
    case 'Vegetables':
      return [
        {
          name: 'Fresh Tomatoes',
          slug: 'fresh-tomatoes',
          description:
            'Ripe and juicy tomatoes perfect for salads, sauces, or sandwiches. Grown in our partner farms with care.',
          price: 59.99,
          discount: null,
          stock: 120,
          featured: true,
          categoryId,
          imageUrls: [
            'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg',
            'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg'
          ]
        },
        {
          name: 'Organic Spinach',
          slug: 'organic-spinach',
          description:
            'Fresh leafy spinach rich in iron and vitamins. Perfect for salads, smoothies, or cooking.',
          price: 69.99,
          discount: 0.1,
          stock: 90,
          featured: false,
          categoryId,
          imageUrls: [
            'https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg',
            'https://images.pexels.com/photos/2255925/pexels-photo-2255925.jpeg'
          ]
        }
      ]
    case 'Dairy & Eggs':
      return [
        {
          name: 'Farm Fresh Eggs',
          slug: 'farm-fresh-eggs',
          description:
            'Free-range eggs from ethically raised hens. Rich in protein and perfect for breakfast or baking.',
          price: 119.99,
          discount: null,
          stock: 100,
          featured: true,
          categoryId,
          imageUrls: [
            'https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg',
            'https://images.pexels.com/photos/7815371/pexels-photo-7815371.jpeg'
          ]
        },
        {
          name: 'Organic Milk',
          slug: 'organic-milk',
          description:
            'Fresh organic milk from grass-fed cows. Rich and creamy texture with no additives.',
          price: 89.99,
          discount: 0.05,
          stock: 50,
          featured: true,
          categoryId,
          imageUrls: [
            'https://images.pexels.com/photos/5067565/pexels-photo-5067565.jpeg',
            'https://images.pexels.com/photos/3735153/pexels-photo-3735153.jpeg'
          ]
        }
      ]
    case 'Bakery':
      return [
        {
          name: 'Whole Wheat Bread',
          slug: 'whole-wheat-bread',
          description:
            'Freshly baked whole wheat bread made with organic flour. Soft, nutritious, and perfect for sandwiches.',
          price: 69.99,
          discount: null,
          stock: 40,
          featured: false,
          categoryId,
          imageUrls: [
            'https://images.pexels.com/photos/1756061/pexels-photo-1756061.jpeg',
            'https://images.pexels.com/photos/1070946/pexels-photo-1070946.jpeg'
          ]
        },
        {
          name: 'Butter Croissants',
          slug: 'butter-croissants',
          description:
            'Flaky, buttery croissants baked fresh daily. Perfect for breakfast or as a snack.',
          price: 129.99,
          discount: 0.1,
          stock: 30,
          featured: true,
          categoryId,
          imageUrls: [
            'https://images.pexels.com/photos/3724/food-morning-breakfast-orange-juice.jpg',
            'https://images.pexels.com/photos/2135/food-france-morning-breakfast.jpg'
          ]
        }
      ]
    case 'Snacks':
      return [
        {
          name: 'Mixed Nuts',
          slug: 'mixed-nuts',
          description:
            'Premium selection of roasted almonds, cashews, and walnuts. High in protein and healthy fats.',
          price: 249.99,
          discount: 0.15,
          stock: 70,
          featured: true,
          categoryId,
          imageUrls: [
            'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg',
            'https://images.pexels.com/photos/1049509/pexels-photo-1049509.jpeg'
          ]
        },
        {
          name: 'Potato Chips',
          slug: 'potato-chips',
          description:
            'Crispy potato chips with a perfect blend of salt and spices. Great for snacking or parties.',
          price: 99.99,
          discount: null,
          stock: 120,
          featured: false,
          categoryId,
          imageUrls: [
            'https://images.pexels.com/photos/568805/pexels-photo-568805.jpeg',
            'https://images.pexels.com/photos/4085109/pexels-photo-4085109.jpeg'
          ]
        }
      ]
    default:
      return []
  }
}
