import bcrypt from 'bcryptjs';
import { prisma } from '../src/lib/prisma';

const CATEGORIES = [
  { name: 'Phones', slug: 'phones' },
  { name: 'Phone Accessories', slug: 'phone-accessories' },
  { name: 'Laptops', slug: 'laptops' },
  { name: 'Laptop Accessories', slug: 'laptop-accessories' },
  { name: 'AirPods', slug: 'airpods' },
  { name: 'AirPods Cases', slug: 'airpods-cases' },
  { name: 'Ring Lights', slug: 'ring-lights' },
  { name: 'Microphones', slug: 'microphones' },
];

const UNSPLASH = (id: string) => `https://images.unsplash.com/photo-${id}?w=600&h=600&fit=crop&q=80`;

const PRODUCTS = [
  {
    slug: 'iphone-13',
    name: 'iPhone 13 (128GB)',
    categorySlug: 'phones',
    description: 'Refurbished, unlocked, good condition.',
    price: 380000,
    stock: 5,
    images: [UNSPLASH('1616348436168-de43ad0db179')],
  },
  {
    slug: 'samsung-galaxy-a54',
    name: 'Samsung Galaxy A54',
    categorySlug: 'phones',
    description: 'Brand new, sealed box, 1 year warranty.',
    price: 320000,
    stock: 8,
    images: [UNSPLASH('1580910051074-3eb694886505')],
  },
  {
    slug: '20w-fast-charger',
    name: '20W USB-C Fast Charger',
    categorySlug: 'phone-accessories',
    description: 'Compatible with iPhone and Android USB-C devices.',
    price: 12000,
    stock: 30,
    images: [UNSPLASH('1583863788434-e58a36330cf0')],
  },
  {
    slug: 'dell-xps-13',
    name: 'Dell XPS 13',
    categorySlug: 'laptops',
    description: 'Core i7, 16GB RAM, 512GB SSD. Refurbished.',
    price: 850000,
    stock: 3,
    images: [UNSPLASH('1587614382346-4ec70e388b28')],
  },
  {
    slug: 'hp-pavilion-15',
    name: 'HP Pavilion 15',
    categorySlug: 'laptops',
    description: 'Core i5, 8GB RAM, 256GB SSD. Brand new.',
    price: 620000,
    stock: 6,
    images: [UNSPLASH('1618410320928-25228d811631')],
  },
  {
    slug: 'laptop-sleeve-15-inch',
    name: '15" Laptop Sleeve',
    categorySlug: 'laptop-accessories',
    description: 'Padded protective sleeve, water resistant.',
    price: 9000,
    stock: 25,
    images: [UNSPLASH('1553062407-98eeb64c6a62')],
  },
  {
    slug: 'wireless-mouse',
    name: 'Wireless Mouse',
    categorySlug: 'laptop-accessories',
    description: 'Compact, USB receiver, long battery life.',
    price: 6500,
    stock: 40,
    images: [UNSPLASH('1527864550417-7fd91fc51a46')],
  },
  {
    slug: 'airpods-pro-2',
    name: 'AirPods Pro (2nd Gen)',
    categorySlug: 'airpods',
    description: 'Active noise cancellation, MagSafe charging case.',
    price: 195000,
    stock: 10,
    images: [UNSPLASH('1600294037681-c80b4cb5b434')],
  },
  {
    slug: 'airpods-3',
    name: 'AirPods (3rd Gen)',
    categorySlug: 'airpods',
    description: 'Spatial audio, sweat and water resistant.',
    price: 145000,
    stock: 12,
    images: [UNSPLASH('1588872657578-7efd1f1555ed')],
  },
  {
    slug: '18-inch-ring-light-stand',
    name: '18" LED Ring Light with Stand',
    categorySlug: 'ring-lights',
    description: 'Adjustable brightness and color temperature, tripod stand, phone holder included.',
    price: 45000,
    stock: 8,
    images: [UNSPLASH('1761446812455-300d231f2df6')],
  },
  {
    slug: '10-inch-ring-light-phone-holder',
    name: '10" Ring Light with Phone Holder',
    categorySlug: 'ring-lights',
    description: 'Compact desktop ring light, 3 lighting modes, USB powered.',
    price: 22000,
    stock: 15,
    images: [UNSPLASH('1500252124339-44ed473934dd')],
  },
  {
    slug: 'mini-clip-on-selfie-ring-light',
    name: 'Mini Clip-On Selfie Ring Light',
    categorySlug: 'ring-lights',
    description: 'Clips onto your phone for instant fill light. USB rechargeable.',
    price: 8000,
    stock: 25,
    images: [UNSPLASH('1541913299-273fd84d10c4')],
  },
  {
    slug: 'usb-condenser-microphone',
    name: 'USB Condenser Microphone',
    categorySlug: 'microphones',
    description: 'Plug-and-play studio mic for streaming, voiceovers, and calls. Includes desktop stand.',
    price: 35000,
    stock: 10,
    images: [UNSPLASH('1589903308904-1010c2294adc')],
  },
  {
    slug: 'podcast-dynamic-microphone',
    name: 'Podcast Dynamic Microphone',
    categorySlug: 'microphones',
    description: 'Broadcast-quality dynamic mic favored by podcasters and YouTubers. XLR/USB.',
    price: 65000,
    stock: 6,
    images: [UNSPLASH('1588800347304-ec7e6f353327')],
  },
  {
    slug: 'boom-arm-studio-microphone',
    name: 'Studio Microphone with Boom Arm',
    categorySlug: 'microphones',
    description: 'Condenser mic with adjustable boom arm, shock mount, and pop filter.',
    price: 50000,
    stock: 7,
    images: [UNSPLASH('1590602847861-f357a9332bbc')],
  },
];

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in .env before seeding.');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.admin.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });

  console.log(`Admin seeded: ${email}`);
}

async function seedCatalog() {
  const categoryIds: Record<string, string> = {};

  for (const category of CATEGORIES) {
    const record = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: category,
    });
    categoryIds[category.slug] = record.id;
  }
  console.log(`Categories seeded: ${CATEGORIES.length}`);

  for (const { categorySlug, ...product } of PRODUCTS) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: { ...product, categoryId: categoryIds[categorySlug] },
      create: { ...product, categoryId: categoryIds[categorySlug] },
    });
  }
  console.log(`Products seeded: ${PRODUCTS.length}`);
}

async function main() {
  await seedAdmin();
  await seedCatalog();
}

main().finally(() => process.exit());
