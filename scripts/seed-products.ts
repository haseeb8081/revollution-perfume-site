// Run with: node --loader ts-node/esm scripts/seed-products.ts
// Or: ts-node scripts/seed-products.ts

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/revollution-store";

const sampleProducts = [
  {
    name: "Emerald Dawn",
    slug: "emerald-dawn",
    description:
      "A bright, green opening with citrus and white florals. Ideal for early meetings, coffee catch-ups, and daylight confidence. Fresh bergamot meets jasmine petals in a clean, energizing composition.",
    price: 89,
    category: "unisex",
    notes: {
      top: "Green bergamot, Lemon zest, Fresh mint",
      middle: "White jasmine, Green tea, Orange blossom",
      base: "White musk, Cedarwood, Amber",
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800",
        alt: "Emerald Dawn perfume bottle",
      },
    ],
    variants: [
      {
        sizeMl: 50,
        stockQuantity: 100,
        sku: "REV-ED-50",
      },
      {
        sizeMl: 100,
        stockQuantity: 75,
        sku: "REV-ED-100",
      },
    ],
    featured: true,
  },
  {
    name: "Azure Ember",
    slug: "azure-ember",
    description:
      "Smokey woods, blue iris, and a hint of spice. Built for nights that go beyond the plan and moments that deserve to linger. Deep, warm, and unforgettable.",
    price: 95,
    category: "unisex",
    notes: {
      top: "Blue iris, Black pepper, Cardamom",
      middle: "Incense, Violet leaf, Tobacco",
      base: "Smoked woods, Patchouli, Vanilla",
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800",
        alt: "Azure Ember perfume bottle",
      },
    ],
    variants: [
      {
        sizeMl: 50,
        stockQuantity: 80,
        sku: "REV-AE-50",
      },
      {
        sizeMl: 100,
        stockQuantity: 60,
        sku: "REV-AE-100",
      },
    ],
    featured: true,
  },
  {
    name: "Neon Mirage",
    slug: "neon-mirage",
    description:
      "A layered green-blue accord that reads different on everyone — truly unisex, undeniably modern, unapologetically Revollution. Electric yet grounded.",
    price: 92,
    category: "unisex",
    notes: {
      top: "Aquatic notes, Grapefruit, Artemisia",
      middle: "Sea salt, Sage, Lavender",
      base: "Driftwood, Ambergris, Oakmoss",
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=800",
        alt: "Neon Mirage perfume bottle",
      },
    ],
    variants: [
      {
        sizeMl: 50,
        stockQuantity: 90,
        sku: "REV-NM-50",
      },
      {
        sizeMl: 100,
        stockQuantity: 70,
        sku: "REV-NM-100",
      },
    ],
    featured: true,
  },
  {
    name: "Velvet Cascade",
    slug: "velvet-cascade",
    description:
      "A luxurious floral-green blend with velvety rose and soft moss. Elegant, refined, and perfect for those who appreciate timeless sophistication with a green twist.",
    price: 98,
    category: "women",
    notes: {
      top: "Green mandarin, Pear, Freesia",
      middle: "Rose absolute, Peony, Magnolia",
      base: "Velvet moss, Sandalwood, Cashmeran",
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1528662768781-e34ec5440e89?w=800",
        alt: "Velvet Cascade perfume bottle",
      },
    ],
    variants: [
      {
        sizeMl: 50,
        stockQuantity: 65,
        sku: "REV-VC-50",
      },
      {
        sizeMl: 100,
        stockQuantity: 50,
        sku: "REV-VC-100",
      },
    ],
    featured: false,
  },
  {
    name: "Midnight Fern",
    slug: "midnight-fern",
    description:
      "A bold, masculine scent with aromatic fern and dark woods. Crisp green freshness transitions into deep, earthy undertones — perfect for confident, modern men.",
    price: 88,
    category: "men",
    notes: {
      top: "Fern, Lavender, Pine needles",
      middle: "Geranium, Clary sage, Vetiver",
      base: "Dark woods, Leather, Tonka bean",
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800",
        alt: "Midnight Fern perfume bottle",
      },
    ],
    variants: [
      {
        sizeMl: 50,
        stockQuantity: 85,
        sku: "REV-MF-50",
      },
      {
        sizeMl: 100,
        stockQuantity: 65,
        sku: "REV-MF-100",
      },
    ],
    featured: false,
  },
  {
    name: "Citrus Horizon",
    slug: "citrus-horizon",
    description:
      "An invigorating citrus explosion with green undertones. Light, energetic, and perfect for daytime wear. A burst of sunshine in a bottle.",
    price: 79,
    category: "unisex",
    notes: {
      top: "Yuzu, Lime, Green apple",
      middle: "Basil, Ginger, Neroli",
      base: "White cedar, Light musk, Vetiver",
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800",
        alt: "Citrus Horizon perfume bottle",
      },
    ],
    variants: [
      {
        sizeMl: 50,
        stockQuantity: 120,
        sku: "REV-CH-50",
      },
      {
        sizeMl: 100,
        stockQuantity: 95,
        sku: "REV-CH-100",
      },
    ],
    featured: false,
  },
];

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected!");

    const Product = mongoose.model(
      "Product",
      new mongoose.Schema({
        name: String,
        slug: { type: String, unique: true },
        description: String,
        price: Number,
        category: String,
        notes: {
          top: String,
          middle: String,
          base: String,
        },
        images: [
          {
            url: String,
            alt: String,
          },
        ],
        variants: [
          {
            sizeMl: Number,
            stockQuantity: Number,
            sku: String,
          },
        ],
        featured: Boolean,
      }, { timestamps: true })
    );

    console.log("Clearing existing products...");
    await Product.deleteMany({});

    console.log("Seeding products...");
    await Product.insertMany(sampleProducts);

    console.log(`✅ Successfully seeded ${sampleProducts.length} products!`);
    console.log("\nSample products:");
    sampleProducts.forEach((p) => {
      console.log(`  - ${p.name} (${p.category}) - $${p.price}`);
    });

    await mongoose.connection.close();
    console.log("\nDatabase connection closed.");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
