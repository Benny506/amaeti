const fashionImageIds = [
  '1490481651871-ab68de25d43d', '1515886657613-9f3515b0c78f', '1509319117193-57bab727e09d',
  '1539109136881-3be0616acf4b', '1513094735237-8f2714d57c13', '1503342217505-b0a15ec3261c',
  '1483985988355-763728e1935b', '1551232864-3f0890e580d9', '1520006403909-838d6b92c22e',
  '1445205170230-053b83016050', '1512436991641-6745cdb1723f', '1507679799987-c73779587ccf',
  '1485968579580-b6d095142e6e', '1469334031218-e382a71b716b', '1492707892479-7bc8d5a4ee93'
];

const titles = ['Elegance', 'Summer', 'Accessories', 'Avant-Garde', 'Minimalist', 'Evening Wear', 'Streetwear', 'Athleisure', 'Vintage', 'Bespoke', 'High Fashion', 'Urban'];

export const generateDummyCategories = () => {
  return Array.from({ length: 24 }).map((_, i) => {
    const title = titles[i % titles.length] + (i >= titles.length ? ' Vol. ' + (Math.floor(i / titles.length) + 1) : '');
    return {
      id: `dummy-cat-${i}`,
      slug: `dummy-${i}`,
      title: title,
      description: i % 3 === 0
        ? 'This is a significantly longer description to test how the UI handles overflow. It should ideally be truncated gracefully using CSS line-clamp so that it does not disrupt the aesthetic balance of the card layout while still providing enough context.'
        : 'Explore our latest arrivals. Elevate your everyday look with crafted details and fine materials curated for the modern wardrobe.',
      coverImage: `https://images.unsplash.com/photo-${fashionImageIds[i % fashionImageIds.length]}?q=80&w=1200&auto=format&fit=crop`
    };
  });
};

export const generateDummyProducts = () => {
  const categories = generateDummyCategories();
  const products = [];
  
  categories.forEach((cat, index) => {
    // Generate 3 products per category
    for (let j = 0; j < 3; j++) {
      const pid = index * 3 + j;
      products.push({
        id: `dummy-prod-${pid}`,
        category_id: cat.id,
        category: cat, // Some joins might return nested
        title: `${cat.title} Product ${j + 1}`,
        slug: `${cat.slug}-prod-${j + 1}`,
        description: `This is a beautifully crafted dummy product for the ${cat.title} collection. Made from the finest placeholder materials.`,
        is_active: true,
        product_variants: [
          {
            id: `dummy-var-${pid}-1`,
            price: 150 + (pid * 10),
            is_active: true,
            product_media: [
              {
                media_type: 'image',
                // Reverse iterate the fashion images so they look different from the category cover
                media_url: `https://images.unsplash.com/photo-${fashionImageIds[(fashionImageIds.length - 1 - (pid % fashionImageIds.length))]}?q=80&w=1200&auto=format&fit=crop`
              }
            ]
          }
        ]
      });
    }
  });
  
  return products;
};

export const dummyCategoriesCache = generateDummyCategories();
export const dummyProductsCache = generateDummyProducts();
