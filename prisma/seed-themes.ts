import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Landing Page Themes...');

  const themes = [
    {
      category: 'nutrition',
      heroTitle: 'Automate Nutrition slides that actually drive traffic',
      heroSubtitle: 'Create viral nutrition TikTok slides in seconds. Evidence-based, visually stunning, and built to convert.',
      metaTitle: 'SlidesCockpit - Nutrition TikTok Slides',
      metaDescription: 'Erstelle virale TikTok Slides zum Thema Ernährung. Automatisiert, professionell und konversionsstark.',
      description: 'Landing Page Theme für Nutrition-Kategorie',
      isActive: true,
    },
    {
      category: 'fitness',
      heroTitle: 'Automate Fitness slides that actually drive traffic',
      heroSubtitle: 'Create viral fitness TikTok slides in seconds. Workout plans, tips, and motivation that converts.',
      metaTitle: 'SlidesCockpit - Fitness TikTok Slides',
      metaDescription: 'Erstelle virale TikTok Slides zum Thema Fitness. Automatisiert, professionell und konversionsstark.',
      description: 'Landing Page Theme für Fitness-Kategorie',
      isActive: true,
    },
    {
      category: 'wellness',
      heroTitle: 'Automate Wellness slides that actually drive traffic',
      heroSubtitle: 'Create viral wellness TikTok slides in seconds. Self-care, mindfulness, and healthy living content.',
      metaTitle: 'SlidesCockpit - Wellness TikTok Slides',
      metaDescription: 'Erstelle virale TikTok Slides zum Thema Wellness. Automatisiert, professionell und konversionsstark.',
      description: 'Landing Page Theme für Wellness-Kategorie',
      isActive: true,
    },
  ];

  for (const theme of themes) {
    const created = await prisma.landingPageTheme.upsert({
      where: { category: theme.category },
      update: theme,
      create: theme,
    });
    console.log(`✓ Created/Updated theme: ${created.category}`);
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

