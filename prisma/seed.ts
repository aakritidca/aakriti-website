import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // --- Admin user ---
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@aakriti.example";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await prisma.user.create({
      data: {
        name: "Veerendra Patil",
        email: adminEmail,
        passwordHash,
        role: "SUPER_ADMIN",
      },
    });
    console.log(`Created admin user: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log("Admin user already exists, skipping.");
  }

  // --- Categories ---
  const categoryNames = [
    "Residential",
    "Commercial",
    "Industrial",
    "Infrastructure",
    "Renovation",
    "Interior",
    "Other",
  ];
  const categories: Record<string, string> = {};
  for (let i = 0; i < categoryNames.length; i++) {
    const name = categoryNames[i];
    const slug = name.toLowerCase();
    const category = await prisma.category.upsert({
      where: { slug },
      create: { name, slug, sortOrder: i },
      update: {},
    });
    categories[name] = category.id;
  }
  console.log("Categories ready.");

  // --- Company content ---
  await prisma.companyContent.upsert({
    where: { id: "main" },
    create: { id: "main" },
    update: {},
  });
  console.log("Company content ready.");

  // --- Services ---
  const serviceData = [
    { title: "Building Plans", description: "Approved layouts tailored to your plot size, budget, and local regulations." },
    { title: "Architectural Drawings", description: "Detailed working drawings that guide every stage of construction." },
    { title: "3D Elevation", description: "Photorealistic previews so you can see your project before it's built." },
    { title: "Interior Design", description: "Functional, elegant interior planning for homes and commercial spaces." },
    { title: "Consultancy", description: "Expert guidance on design, structure, and construction decisions." },
    { title: "Labour Contract", description: "Skilled labour management for civil work through to finishing." },
    { title: "Estimation", description: "Transparent, itemized cost estimation before work begins." },
    { title: "Supervision", description: "Dedicated on-site supervision to keep quality and timelines on track." },
    { title: "Waterproofing", description: "Long-term waterproofing solutions for terraces, basements, and walls." },
  ];
  for (let i = 0; i < serviceData.length; i++) {
    const existing = await prisma.service.findFirst({ where: { title: serviceData[i].title } });
    if (!existing) {
      await prisma.service.create({
        data: { ...serviceData[i], sortOrder: i, published: true },
      });
    }
  }
  console.log("Services ready.");

  // --- Sample projects (only if none exist yet) ---
  const projectCount = await prisma.project.count();
  if (projectCount === 0) {
    const sampleProjects = [
      {
        title: "Patil Residence",
        slug: "patil-residence",
        description:
          "A 3,200 sq. ft. family residence in Sirsi, designed to balance privacy from the street with open, naturally lit living spaces. The brief called for a joint-family layout with independent access for the ground and first floors.",
        additionalInfo:
          "Vaastu-aligned layout with a central courtyard for cross-ventilation. Exposed concrete detailing on the front elevation, paired with locally sourced Kota stone flooring throughout the ground floor.",
        location: "Sirsi, Karnataka",
        category: "Residential",
        year: 2024,
        status: "COMPLETED" as const,
        builtUpArea: "3,200 sq. ft.",
        floors: "G + 1",
        duration: "8 months",
        published: true,
        featured: true,
        coverImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
        images: [
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
          "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80",
          "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80",
        ],
      },
      {
        title: "HP Complex",
        slug: "hp-complex",
        description:
          "A mixed-use commercial block currently under construction in Banavasi, designed for flexible retail and office use with dedicated parking.",
        location: "Banavasi, Karnataka",
        category: "Commercial",
        year: 2025,
        status: "ONGOING" as const,
        published: true,
        featured: true,
        coverImage: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80",
        images: [
          "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80",
          "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80",
        ],
      },
      {
        title: "Family Home Interiors",
        slug: "family-home-interiors",
        description:
          "Full interior planning and execution for a three-bedroom family home, including modular kitchen, wardrobes, and living room design.",
        location: "Sirsi, Karnataka",
        category: "Interior",
        year: 2024,
        status: "COMPLETED" as const,
        published: true,
        featured: true,
        coverImage: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80",
        images: ["https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80"],
      },
      {
        title: "Heritage Villa Renovation",
        slug: "heritage-villa-renovation",
        description:
          "A sensitive renovation of a decades-old family villa, preserving original architectural character while upgrading structure, plumbing, and finishes.",
        location: "Sirsi, Karnataka",
        category: "Renovation",
        year: 2023,
        status: "COMPLETED" as const,
        published: true,
        featured: true,
        coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
        images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80"],
      },
      {
        title: "Kulkarni Duplex",
        slug: "kulkarni-duplex",
        description:
          "A ground-plus-one duplex for a joint family, currently under construction, with independent floor access and a shared courtyard.",
        location: "Banavasi, Karnataka",
        category: "Residential",
        year: 2025,
        status: "ONGOING" as const,
        published: true,
        featured: false,
        coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
        images: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80"],
      },
      {
        title: "Roadside Retail Block",
        slug: "roadside-retail-block",
        description:
          "A compact retail block along the Sirsi highway, built for quick tenant turnover with flexible shop-front units.",
        location: "Sirsi, Karnataka",
        category: "Commercial",
        year: 2022,
        status: "COMPLETED" as const,
        published: true,
        featured: false,
        coverImage: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80",
        images: ["https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80"],
      },
    ];

    for (const project of sampleProjects) {
      const { images, category, ...rest } = project;
      await prisma.project.create({
        data: {
          ...rest,
          categoryId: categories[category],
          images: {
            create: images.map((url, index) => ({
              imageUrl: url,
              altText: `${project.title} — photo ${index + 1}`,
              sortOrder: index,
            })),
          },
        },
      });
    }
    console.log(`Created ${sampleProjects.length} sample projects.`);
  } else {
    console.log("Projects already exist, skipping sample data.");
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
