const Category = require("../models/Category");

const seedCategories = async () => {
  try {
    const defaultCategories = [
      { name: "UI/UX", slug: "ui-ux", description: "User Interface and User Experience Design" },
      { name: "Photography", slug: "photography", description: "Art or practice of taking and processing photographs" },
      { name: "Illustration", slug: "illustration", description: "Visual explanation or representation of a text, concept or process" },
      { name: "Poster", slug: "poster", description: "Graphic designs for temporary promotion of an idea, product, or event" },
      { name: "Branding", slug: "branding", description: "Corporate visual identity and marketing designs" },
      { name: "Animation", slug: "animation", description: "Art of creating moving images" },
      { name: "Digital Art", slug: "digital-art", description: "Artistic work or practice that uses digital technology as part of the creative or presentation process" },
    ];

    for (const cat of defaultCategories) {
      const exists = await Category.findOne({ slug: cat.slug });
      if (!exists) {
        await Category.create(cat);
        console.log(`Seeded category: ${cat.name}`);
      }
    }
  } catch (error) {
    console.error("Failed to seed default categories:", error);
  }
};

module.exports = { seedCategories };
