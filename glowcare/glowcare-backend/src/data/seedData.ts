export interface ISeedCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface ISeedProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  price: number;
  salePrice?: number;
  onSale: boolean;
  rating: number;
  reviewCount: number;
  description: string;
  shortDescription: string;
  images: string[];
  ingredients: string[];
  benefits: string[];
  usageInstructions: string;
  skinTypes: string[];
  skinConcerns: string[];
  stock: number;
  isFeatured: boolean;
  isBestseller: boolean;
  isNewArrival: boolean;
  size: string;
}

export interface ISeedCoupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiresAt: string;
  isActive: boolean;
}

export const SEED_CATEGORIES: ISeedCategory[] = [
  {
    id: 'cat_cleansers',
    name: 'Cleansers',
    slug: 'cleansers',
    description: 'Gentle, pH-balanced facial cleansers that melt away impurities without stripping moisture.',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cat_toners',
    name: 'Toners & Essences',
    slug: 'toners',
    description: 'Hydrating, balancing toners enriched with botanical extracts to prime and prep your skin.',
    image: 'https://images.unsplash.com/photo-1608248597359-5484839e99eb?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cat_serums',
    name: 'Serums & Ampoules',
    slug: 'serums',
    description: 'Targeted active formulations engineered with Vitamin C, Niacinamide, and Hyaluronic Acid.',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cat_moisturizers',
    name: 'Moisturizers & Creams',
    slug: 'moisturizers',
    description: 'Ceramide-rich barrier repair creams and weightless gel hydrators for all skin types.',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cat_sunscreens',
    name: 'Sun Protection',
    slug: 'sunscreens',
    description: 'Broad-spectrum mineral and chemical SPF formulations with invisible, weightless finishes.',
    image: 'https://images.unsplash.com/photo-1598662957563-ee4965d4d72c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cat_masks',
    name: 'Face Masks',
    slug: 'masks',
    description: 'Revitalizing overnight masks, soothing clay treatments, and bio-cellulose sheet masks.',
    image: 'https://images.unsplash.com/photo-1567928815116-f36894086ea7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cat_lipcare',
    name: 'Lip Care',
    slug: 'lip-care',
    description: 'Peptide-infused balms and nourishing lip sleeping masks for plush, hydrated lips.',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80'
  }
];

export const SEED_PRODUCTS: ISeedProduct[] = [
  {
    id: 'prod_01',
    name: 'Radiance C+ Brightening Elixir Serum',
    slug: 'radiance-c-brightening-elixir-serum',
    category: 'Serums & Ampoules',
    categorySlug: 'serums',
    price: 1499.0,
    salePrice: 1299.0,
    onSale: true,
    rating: 4.9,
    reviewCount: 142,
    shortDescription: '15% stabilized Vitamin C with Ferulic Acid and Kakadu Plum extract for radiant, even-toned skin.',
    description: 'An advanced clinical antioxidant treatment formulated with 15% pure L-Ascorbic Acid, Alpha Tocopherol, and Ferulic Acid. This powerhouse formula neutralizes free radicals, boosts collagen synthesis, and dramatically fades stubborn dark spots for an undeniable luminous glow.',
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608248597359-5484839e99eb?auto=format&fit=crop&w=800&q=80'
    ],
    ingredients: [
      'Aqua (Purified Water)',
      '15% L-Ascorbic Acid (Vitamin C)',
      '1% Alpha Tocopherol (Vitamin E)',
      '0.5% Ferulic Acid',
      'Kakadu Plum Fruit Extract',
      'Sodium Hyaluronate',
      'Panthenol (Pro-Vitamin B5)',
      'Glycerin'
    ],
    benefits: [
      'Fades dark spots, sun damage, and post-acne pigmentation',
      'Promotes cellular turnover and collagen production',
      'Shields against environmental pollutants and oxidants',
      'Imparts a youthful, lit-from-within glow'
    ],
    usageInstructions: 'In the morning after cleansing and toning, dispense 4-5 drops onto dry fingertips. Gently press into face, neck, and décolleté. Follow with your favorite moisturizer and SPF.',
    skinTypes: ['All Skin Types', 'Normal', 'Combination', 'Dull Skin'],
    skinConcerns: ['Dark Spots', 'Uneven Skin Tone', 'Dullness', 'Fine Lines'],
    stock: 45,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    size: '30 ml / 1.0 fl. oz.'
  },
  {
    id: 'prod_02',
    name: 'Cloud Hydration Barrier Repair Cream',
    slug: 'cloud-hydration-barrier-repair-cream',
    category: 'Moisturizers & Creams',
    categorySlug: 'moisturizers',
    price: 1599.0,
    salePrice: undefined,
    onSale: false,
    rating: 4.8,
    reviewCount: 98,
    shortDescription: 'Multi-ceramide and squalane restorative cloud cream that fortifies compromised skin barriers.',
    description: 'Formulated with a biomimetic lipid complex featuring 5 essential ceramides (EOP, NS, NP, AS, AP), pure plant-derived squalane, and soothing colloidal oatmeal. Deeply restores the moisture barrier without clogging pores or feeling greasy.',
    images: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
    ],
    ingredients: [
      'Aqua',
      'Ceramide NP, AP, EOP',
      'Phytosphingosine',
      'Pure Olive Squalane',
      'Colloidal Oat Flour',
      'Shea Butter (Fair Trade)',
      'Allantoin',
      'Centella Asiatica Leaf Extract'
    ],
    benefits: [
      'Repairs and strengthens damaged moisture barrier within 72 hours',
      'Provides 24-hour continuous moisture retention',
      'Calms redness, irritation, and sensitivity',
      'Velvety, non-greasy cloud-whip texture'
    ],
    usageInstructions: 'Warm a dime-sized amount between palms and smooth over face and neck morning and evening as the final step before sunscreen or overnight care.',
    skinTypes: ['Dry', 'Sensitive', 'Normal', 'Compromised Barrier'],
    skinConcerns: ['Dryness', 'Redness', 'Dehydration', 'Barrier Damage'],
    stock: 60,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    size: '50 ml / 1.7 oz.'
  },
  {
    id: 'prod_03',
    name: 'Gentle Calming Matcha Cleansing Gel',
    slug: 'gentle-calming-matcha-cleansing-gel',
    category: 'Cleansers',
    categorySlug: 'cleansers',
    price: 899.0,
    salePrice: 749.0,
    onSale: true,
    rating: 4.7,
    reviewCount: 86,
    shortDescription: 'Antioxidant-dense green tea cleanser that lifts impurities while maintaining natural pH 5.5 balance.',
    description: 'A soothing, sulfate-free jelly cleanser formulated with organic Uji matcha extract, willow bark (natural BHA), and hydrating hyaluronic acid. Thoroughly cleanses dirt, sunscreen, and excess sebum without causing tight or stripped sensations.',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1567928815116-f36894086ea7?auto=format&fit=crop&w=800&q=80'
    ],
    ingredients: [
      'Camellia Sinensis (Green Tea) Leaf Water',
      'Coco-Glucoside',
      'Glycerin',
      'Salix Alba (Willow) Bark Extract',
      'Centella Asiatica Extract',
      'Panthenol',
      'Tea Tree Leaf Oil'
    ],
    benefits: [
      'Sulfate-free, non-stripping micro-foaming formula',
      'Soothes active blemishes and calms inflamed pores',
      'Balances skin sebum and maintains natural microbiome',
      'Rinses completely clean with no residue'
    ],
    usageInstructions: 'Massage 1-2 pumps onto damp skin in circular motions for 60 seconds. Rinse thoroughly with lukewarm water. Use morning and night.',
    skinTypes: ['Oily', 'Combination', 'Sensitive', 'Acne-Prone'],
    skinConcerns: ['Acne', 'Clogged Pores', 'Excess Oil', 'Sensitivity'],
    stock: 50,
    isFeatured: true,
    isBestseller: false,
    isNewArrival: true,
    size: '150 ml / 5.1 fl. oz.'
  },
  {
    id: 'prod_04',
    name: 'Invisible Sheer Mineral Sunscreen SPF 50+',
    slug: 'invisible-sheer-mineral-sunscreen-spf-50',
    category: 'Sun Protection',
    categorySlug: 'sunscreens',
    price: 999.0,
    salePrice: undefined,
    onSale: false,
    rating: 4.9,
    reviewCount: 215,
    shortDescription: '100% non-nano zinc oxide sunscreen with zero white cast, satin matte finish, and blue light shield.',
    description: 'A featherlight, silky mineral sunscreen delivering PA++++ broad-spectrum UVA/UVB defense. Infused with 20% Non-Nano Zinc Oxide, Niacinamide, and Ectoin, it blends seamlessly across all skin tones with absolutely no ghostly cast or sticky residue.',
    images: [
      'https://images.unsplash.com/photo-1598662957563-ee4965d4d72c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80'
    ],
    ingredients: [
      'Zinc Oxide 20.4% (Non-Nano)',
      'Water',
      'Caprylic/Capric Triglyceride',
      'Niacinamide 2%',
      'Ectoin',
      'Polygonum Aviculare (Knotgrass) Extract',
      'Bisabolol',
      'Tocopherol'
    ],
    benefits: [
      'High-level broad-spectrum SPF 50+ PA++++ mineral defense',
      'Tested 100% white-cast free on diverse skin tones',
      'Water and sweat resistant for up to 80 minutes',
      'Reef-safe, fragrance-free, and non-comedogenic'
    ],
    usageInstructions: 'Apply generously and evenly as the last step of your skincare routine, 15 minutes before sun exposure. Reapply at least every 2 hours.',
    skinTypes: ['All Skin Types', 'Sensitive', 'Normal', 'Acne-Prone'],
    skinConcerns: ['Sun Damage', 'Hyperpigmentation', 'Premature Aging'],
    stock: 75,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    size: '50 ml / 1.7 fl. oz.'
  },
  {
    id: 'prod_05',
    name: 'Dewy Essence Milky Toner with Rice & Ceramide',
    slug: 'dewy-essence-milky-toner',
    category: 'Toners & Essences',
    categorySlug: 'toners',
    price: 949.0,
    salePrice: 799.0,
    onSale: true,
    rating: 4.8,
    reviewCount: 110,
    shortDescription: 'Nutrient-rich fermented rice water and ceramides in a deeply comforting milky liquid.',
    description: 'Inspired by ancient beauty rituals, this milky essence toner harnesses 77% fermented Yeoju Rice extract to drench thirsty skin cells with moisture, brighten dullness, and smooth rough texture. Absorbs instantly with a glass-skin finish.',
    images: [
      'https://images.unsplash.com/photo-1608248597359-5484839e99eb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80'
    ],
    ingredients: [
      'Oryza Sativa (Rice) Bran Water 77%',
      'Dipropylene Glycol',
      'Ceramide NP',
      'Adenosine',
      'Betaine',
      'Niacinamide',
      'Portulaca Oleracea Extract'
    ],
    benefits: [
      'Restores ideal skin hydration balance in a single layer',
      'Refines skin texture and minimizes enlarged pores',
      'Provides luminous, glass-like radiance',
      'Alcohol-free and soothing for sensitive barrier'
    ],
    usageInstructions: 'After cleansing, pour several drops into hands or onto a soft cotton pad and press gently into face until fully absorbed. Can be layered 2-3 times for maximum glow.',
    skinTypes: ['Dry', 'Normal', 'Combination', 'Dull'],
    skinConcerns: ['Dehydration', 'Dullness', 'Rough Texture', 'Flakiness'],
    stock: 55,
    isFeatured: false,
    isBestseller: true,
    isNewArrival: false,
    size: '180 ml / 6.0 fl. oz.'
  },
  {
    id: 'prod_06',
    name: 'Midnight Renewal Bakuchiol & Peptide Oil',
    slug: 'midnight-renewal-bakuchiol-peptide-oil',
    category: 'Serums & Ampoules',
    categorySlug: 'serums',
    price: 1799.0,
    salePrice: undefined,
    onSale: false,
    rating: 4.9,
    reviewCount: 78,
    shortDescription: 'Gentle plant retinol alternative paired with matrixyl peptides for overnight cellular transformation.',
    description: 'Experience retinol-like anti-aging results with zero redness, peeling, or sun sensitivity. Powered by 2% pure Ayurvedic Bakuchiol, Copper Tripeptide-1, and cold-pressed Rosehip Seed oil, this luxurious facial elixir smooths fine lines and restores bounce.',
    images: [
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80'
    ],
    ingredients: [
      'Rosa Canina (Rosehip) Seed Oil',
      'Pure Bakuchiol 2%',
      'Copper Tripeptide-1',
      'Simmondsia Chinensis (Jojoba) Oil',
      'Squalane',
      'Tocopherol',
      'Blue Tansy Essential Oil'
    ],
    benefits: [
      'Stimulates cellular renewal without retinoid irritation',
      'Fades fine expression lines and firms sagging skin',
      'Enhances natural elasticity and facial contour',
      'Deeply nourishes with rich essential fatty acids'
    ],
    usageInstructions: 'At night, warm 3-4 drops between palms and gently press onto clean face, neck, and chest after moisturizing.',
    skinTypes: ['Mature', 'Dry', 'Sensitive', 'Normal'],
    skinConcerns: ['Fine Lines', 'Loss of Firmness', 'Aging', 'Wrinkles'],
    stock: 35,
    isFeatured: true,
    isBestseller: false,
    isNewArrival: true,
    size: '30 ml / 1.0 fl. oz.'
  },
  {
    id: 'prod_07',
    name: 'Overnight Rosewater Plumping Jelly Mask',
    slug: 'overnight-rosewater-plumping-jelly-mask',
    category: 'Face Masks',
    categorySlug: 'masks',
    price: 1299.0,
    salePrice: 1099.0,
    onSale: true,
    rating: 4.7,
    reviewCount: 64,
    shortDescription: 'Cooling jelly sleeping mask infused with organic Damascus rosewater and multi-molecular hyaluronic acid.',
    description: 'Wake up to baby-soft, super-plump skin. This memory-gel overnight mask locks in active hydration while you sleep. Infused with organic Damask rose hydrosol, trembling snow mushroom extract, and marine collagen peptides.',
    images: [
      'https://images.unsplash.com/photo-1567928815116-f36894086ea7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80'
    ],
    ingredients: [
      'Rosa Damascena Flower Water',
      'Tremella Fuciformis (Snow Mushroom) Extract',
      'Sodium Hyaluronate',
      'Marine Collagen Peptides',
      'Aloe Barbadensis Leaf Juice',
      'Betaine',
      'Niacinamide'
    ],
    benefits: [
      'Seals in moisture with a breathable bouncy hydration matrix',
      'Soothes stressed skin and reduces morning puffiness',
      'Leaves skin dewy, cushiony, and energized',
      'Delicate, natural rose aroma with no artificial fragrance'
    ],
    usageInstructions: 'Apply an even layer as the final step in your evening routine. Leave on overnight and rinse off with warm water in the morning. Use 2-3 times weekly.',
    skinTypes: ['All Skin Types', 'Dehydrated', 'Tired Skin'],
    skinConcerns: ['Dehydration', 'Dullness', 'Loss of Bounce'],
    stock: 40,
    isFeatured: false,
    isBestseller: false,
    isNewArrival: true,
    size: '75 ml / 2.5 oz.'
  },
  {
    id: 'prod_08',
    name: 'Silk Peptide Glaze Lip Treatment',
    slug: 'silk-peptide-glaze-lip-treatment',
    category: 'Lip Care',
    categorySlug: 'lip-care',
    price: 599.0,
    salePrice: undefined,
    onSale: false,
    rating: 4.9,
    reviewCount: 180,
    shortDescription: 'Restorative peptide and shea butter lip glaze that plumps and softens dry lips.',
    description: 'A decadent yet lightweight lip therapy treatment formulated with biomimetic signal peptides, babassu seed oil, and cold-pressed shea butter. Restores suppleness, softens chapped lips, and leaves a high-shine glossy glaze with no stickiness.',
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80'
    ],
    ingredients: [
      'Butyrospermum Parkii (Shea) Butter',
      'Palmitoyl Tripeptide-38',
      'Orbignya Oleifera (Babassu) Seed Oil',
      'Sodium Hyaluronate',
      'Ricinus Communis (Castor) Seed Oil',
      'Tocopherol',
      'Vanilla Planifolia Extract'
    ],
    benefits: [
      'Visibly plumps and fills vertical lip lines',
      'Provides intense long-lasting cushiony moisture',
      'Glass-like shine without hair-sticking tackiness',
      'Subtle warm vanilla aroma'
    ],
    usageInstructions: 'Glide onto lips as needed throughout the day, or apply a thick coating before bed as an intensive overnight lip sleeping mask.',
    skinTypes: ['All Skin Types'],
    skinConcerns: ['Chapped Lips', 'Dryness', 'Lip Lines'],
    stock: 90,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    size: '15 ml / 0.5 fl. oz.'
  },
  {
    id: 'prod_09',
    name: 'Clarifying Niacinamide 10% + Zinc Pore Refiner',
    slug: 'clarifying-niacinamide-zinc-pore-refiner',
    category: 'Serums & Ampoules',
    categorySlug: 'serums',
    price: 999.0,
    salePrice: 849.0,
    onSale: true,
    rating: 4.8,
    reviewCount: 165,
    shortDescription: 'High-potency Vitamin B3 and Zinc PCA to balance excess shine and tighten congested pores.',
    description: 'Target enlarged pores, uneven skin texture, and excess oil with 10% pharmaceutical-grade Niacinamide combined with 1% Zinc PCA. Fast-absorbing, water-based serum that calms congestion and reduces post-blemish redness.',
    images: [
      'https://images.unsplash.com/photo-1608248597359-5484839e99eb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80'
    ],
    ingredients: [
      'Aqua',
      'Niacinamide 10%',
      'Zinc PCA 1%',
      'Tamarindus Indica Seed Polysaccharide',
      'Ethoxydiglycol',
      'Chlorphenesin',
      'Phenoxyethanol'
    ],
    benefits: [
      'Dramatically reduces visible pore size and congestion',
      'Regulates daily sebum production without dehydrating',
      'Fades post-inflammatory hyperpigmentation marks',
      'Strengthens surface skin barrier'
    ],
    usageInstructions: 'Apply 3-4 drops to the entire face morning and evening before heavier creams. Safe for daily use with gentle actives.',
    skinTypes: ['Oily', 'Combination', 'Acne-Prone'],
    skinConcerns: ['Large Pores', 'Oiliness', 'Blemishes', 'Uneven Texture'],
    stock: 65,
    isFeatured: false,
    isBestseller: true,
    isNewArrival: false,
    size: '30 ml / 1.0 fl. oz.'
  },
  {
    id: 'prod_10',
    name: 'Botanical Clay Detox Purifying Mask',
    slug: 'botanical-clay-detox-purifying-mask',
    category: 'Face Masks',
    categorySlug: 'masks',
    price: 1099.0,
    salePrice: undefined,
    onSale: false,
    rating: 4.6,
    reviewCount: 52,
    shortDescription: 'French green clay and activated bamboo charcoal that draws out impurities without cracking.',
    description: 'Unlike traditional drying clay masks, our non-drying formula blends rich French Montmorillonite clay with soothing Centella Asiatica, willow bark, and nourishing squalane to purify pores without cracking or drying out skin.',
    images: [
      'https://images.unsplash.com/photo-1567928815116-f36894086ea7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
    ],
    ingredients: [
      'Kaolin',
      'Montmorillonite (French Green Clay)',
      'Activated Charcoal Powder',
      'Centella Asiatica Extract',
      'Squalane',
      'Eucalyptus Leaf Oil',
      'Salicylic Acid 0.5%'
    ],
    benefits: [
      'Draws out trapped sebum, dirt, and heavy air pollutants',
      'Non-drying, creamy whipped texture washes off easily',
      'Tightens pores and leaves complexion clean and balanced',
      'Minimizes blackheads and whiteheads'
    ],
    usageInstructions: 'Apply an even layer over clean skin avoiding eyes and lips. Allow to rest for 10-12 minutes until nearly dry. Rinse thoroughly with warm water using a damp washcloth.',
    skinTypes: ['Oily', 'Combination', 'Congested'],
    skinConcerns: ['Blackheads', 'Clogged Pores', 'Dullness', 'T-Zone Shine'],
    stock: 48,
    isFeatured: false,
    isBestseller: false,
    isNewArrival: false,
    size: '100 ml / 3.4 oz.'
  },
  {
    id: 'prod_11',
    name: 'Hydro-Surge Multi-Molecular Hyaluronic Serum',
    slug: 'hydro-surge-hyaluronic-serum',
    category: 'Serums & Ampoules',
    categorySlug: 'serums',
    price: 1399.0,
    salePrice: 1199.0,
    onSale: true,
    rating: 4.9,
    reviewCount: 195,
    shortDescription: '5 distinct molecular weights of Hyaluronic Acid for deep-layer cellular plumping.',
    description: 'Formulated with ultra-low, low, medium, high, and cross-linked hyaluronic acid molecular weights that target multiple depths of the epidermis. Quenches thirsty skin, smoothing dehydration lines instantly.',
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608248597359-5484839e99eb?auto=format&fit=crop&w=800&q=80'
    ],
    ingredients: [
      'Aqua',
      'Multi-Molecular Sodium Hyaluronate Complex',
      'Hydrolyzed Hyaluronic Acid',
      'Polyglutamic Acid',
      'Panthenol',
      'Copper PCA',
      'Ahnfeltiopsis Concinna (Red Algae) Extract'
    ],
    benefits: [
      'Delivers immediate multi-level hydration',
      'Plumps fine dehydration lines within minutes',
      'Locks in moisture for up to 48 hours',
      'Weightless, non-sticky water-gel texture'
    ],
    usageInstructions: 'Apply 3-4 drops onto damp skin immediately after misting or toning. Follow with moisturizer to seal in hydration.',
    skinTypes: ['All Skin Types', 'Dehydrated', 'Dry', 'Sensitive'],
    skinConcerns: ['Dehydration', 'Tightness', 'Fine Lines'],
    stock: 80,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    size: '30 ml / 1.0 fl. oz.'
  },
  {
    id: 'prod_12',
    name: 'Hydrating Ceramide Barrier Cleansing Balm',
    slug: 'hydrating-ceramide-barrier-cleansing-balm',
    category: 'Cleansers',
    categorySlug: 'cleansers',
    price: 999.0,
    salePrice: undefined,
    onSale: false,
    rating: 4.8,
    reviewCount: 94,
    shortDescription: 'Sorbet-to-milk melting cleansing balm that effortlessly dissolves waterproof makeup and SPF.',
    description: 'Transform your first cleanse into a spa ritual. This silky cleansing balm melts effortlessly from a lush sorbet into a rich cleansing oil on skin contact, then emulsifies with water into a gentle milk. Easily lifts stubborn waterproof mascara and SPF.',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80'
    ],
    ingredients: [
      'Cetyl Ethylhexanoate',
      'Caprylic/Capric Triglyceride',
      'PEG-20 Glyceryl Triisostearate',
      'Oat Kernel Oil',
      'Ceramide NP',
      'Squalane',
      'Citrus Aurantium Dulcis (Orange) Peel Oil'
    ],
    benefits: [
      'Dissolves waterproof makeup, sunscreen, and stubborn excess sebum',
      'Emulsifies cleanly with no greasy film or cloudy eye residue',
      'Infused with oat lipid extract to preserve skin lipids',
      'Suitable for double cleansing routine'
    ],
    usageInstructions: 'Scoop a coin-sized amount onto dry hands and massage over dry face. Wet hands with warm water to emulsify into a milky texture. Rinse thoroughly.',
    skinTypes: ['All Skin Types', 'Dry', 'Sensitive', 'Normal'],
    skinConcerns: ['Makeup Removal', 'Waterproof SPF', 'Clogged Pores'],
    stock: 55,
    isFeatured: false,
    isBestseller: false,
    isNewArrival: true,
    size: '100 ml / 3.4 oz.'
  },
  {
    id: 'prod_13',
    name: 'Soothing Centella Cica Relief Gel Moisturizer',
    slug: 'soothing-centella-cica-relief-gel-moisturizer',
    category: 'Moisturizers & Creams',
    categorySlug: 'moisturizers',
    price: 1199.0,
    salePrice: 999.0,
    onSale: true,
    rating: 4.7,
    reviewCount: 73,
    shortDescription: 'Ultra-light oil-free cica gel that instantly cools, hydrates, and calms irritated or acne-prone skin.',
    description: 'Formulated with 70% Centella Asiatica leaf water and four isolated cica compounds (Madecassoside, Asiaticoside, Madecassic Acid, Asiatic Acid). Ideal for humid weather or oily, irritation-prone skin needing weightless calm.',
    images: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
    ],
    ingredients: [
      'Centella Asiatica Leaf Water 70%',
      'Madecassoside',
      'Asiaticoside',
      'Tea Tree Leaf Water',
      'Allantoin',
      'Sodium Hyaluronate',
      'Betaine'
    ],
    benefits: [
      'Instantly drops skin surface temperature by 3°C',
      'Soothes active breakouts and post-sun exposure redness',
      '100% oil-free, non-comedogenic gel-water texture',
      'Leaves a refreshed, matte-hydrated finish'
    ],
    usageInstructions: 'Apply generously to face and neck morning and night. Can be kept in the skincare fridge for an extra soothing cooling effect.',
    skinTypes: ['Oily', 'Sensitive', 'Acne-Prone', 'Combination'],
    skinConcerns: ['Redness', 'Breakouts', 'Sensitivity', 'Excess Oil'],
    stock: 45,
    isFeatured: false,
    isBestseller: false,
    isNewArrival: true,
    size: '80 ml / 2.7 fl. oz.'
  },
  {
    id: 'prod_14',
    name: 'AHA + BHA Resurfacing Glow Liquid Exfoliant',
    slug: 'aha-bha-resurfacing-glow-liquid-exfoliant',
    category: 'Toners & Essences',
    categorySlug: 'toners',
    price: 1099.0,
    salePrice: undefined,
    onSale: false,
    rating: 4.8,
    reviewCount: 130,
    shortDescription: '7% Glycolic Acid & 2% Salicylic Acid liquid that sweeps away dead cells for glassy smooth radiance.',
    description: 'A transformative chemical exfoliant pairing water-soluble Glycolic Acid with oil-soluble Salicylic Acid. Clears pore linings, dissolves dead skin cell glue, and reveals smoother, visibly clearer skin in just 2 weeks.',
    images: [
      'https://images.unsplash.com/photo-1608248597359-5484839e99eb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80'
    ],
    ingredients: [
      'Aqua',
      'Glycolic Acid 7%',
      'Salicylic Acid 2%',
      'Aloe Barbadensis Leaf Water',
      'Tasmanian Pepperberry Extract',
      'Glycerin',
      'Sodium Hydroxide'
    ],
    benefits: [
      'Dissolves dead skin cell buildup for glass-like texture',
      'Unclogs pores and prevents future breakouts',
      'Fades dullness and uneven pigmentation',
      'Buffered with Tasmanian Pepperberry to mitigate irritation'
    ],
    usageInstructions: 'Dispense onto a cotton pad and sweep across face and neck after cleansing at night. Start with 2-3 times per week. Always use SPF during the day.',
    skinTypes: ['Combination', 'Oily', 'Normal', 'Resilient'],
    skinConcerns: ['Texture', 'Blackheads', 'Dullness', 'Uneven Tone'],
    stock: 50,
    isFeatured: false,
    isBestseller: true,
    isNewArrival: false,
    size: '150 ml / 5.1 fl. oz.'
  },
  {
    id: 'prod_15',
    name: 'Revitalizing Caffeine & Peptide Eye Contour Gel',
    slug: 'revitalizing-caffeine-peptide-eye-contour-gel',
    category: 'Moisturizers & Creams',
    categorySlug: 'moisturizers',
    price: 1249.0,
    salePrice: 1049.0,
    onSale: true,
    rating: 4.7,
    reviewCount: 88,
    shortDescription: 'Cooling peptide cream targeting dark circles, under-eye puffiness, and crow feet.',
    description: 'Specially engineered for the delicate orbital eye area. Infused with 5% Green Tea Caffeine, Haloxyl peptide complex, and micro-algae extract to de-puff, brighten under-eye shadows, and smooth fine lines.',
    images: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80'
    ],
    ingredients: [
      'Aqua',
      'Caffeine 5%',
      'Epigallocatechin Gallatyl Glucoside (EGCG)',
      'Palmitoyl Tetrapeptide-7',
      'Chrysin',
      'Hyaluronic Acid',
      'Niacinamide'
    ],
    benefits: [
      'Reduces appearance of stubborn dark under-eye circles',
      'Drains fluid retention to alleviate morning puffiness',
      'Firms delicate under-eye skin and smooths fine crow feet',
      'Ophthalmologist-tested and safe for contact lens wearers'
    ],
    usageInstructions: 'Gently tap a pea-sized amount along the orbital bone using your ring finger morning and evening until absorbed.',
    skinTypes: ['All Skin Types'],
    skinConcerns: ['Dark Circles', 'Puffiness', 'Fine Lines', 'Eye Fatigue'],
    stock: 60,
    isFeatured: false,
    isBestseller: false,
    isNewArrival: true,
    size: '15 ml / 0.5 fl. oz.'
  },
  {
    id: 'prod_16',
    name: 'Illuminating Glow Daily Fluid SPF 50',
    slug: 'illuminating-glow-daily-fluid-spf-50',
    category: 'Sun Protection',
    categorySlug: 'sunscreens',
    price: 1099.0,
    salePrice: undefined,
    onSale: false,
    rating: 4.9,
    reviewCount: 145,
    shortDescription: 'Hybrid chemical SPF with pearl radiance pigments that primes and protects with a luminous sheen.',
    description: 'The ultimate skincare-makeup hybrid. Delivers high SPF 50 broad spectrum defense combined with light-reflecting rose gold micro-pearls that blur imperfections and give an instant dewy glow. Doubles as an exceptional makeup primer.',
    images: [
      'https://images.unsplash.com/photo-1598662957563-ee4965d4d72c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80'
    ],
    ingredients: [
      'Aqua',
      'Avobenzone 3%, Octisalate 5%, Octocrylene 7%',
      'Niacinamide',
      'Sodium Hyaluronate',
      'Mica (Ethically Sourced)',
      'Pyrus Malus (Apple) Fruit Extract',
      'Tocopheryl Acetate'
    ],
    benefits: [
      'Broad spectrum SPF 50 protection from UVA and UVB',
      'Instant ethereal dewy glow without greasy shine',
      'Perfect primer under makeup or worn solo for a fresh face',
      'Non-pilling and enriched with hydrating antioxidants'
    ],
    usageInstructions: 'Apply 2-3 finger lengths to face and neck as your morning moisturizer or after moisturizing. Reapply every 2 hours.',
    skinTypes: ['Normal', 'Dry', 'Combination', 'Dull'],
    skinConcerns: ['Sun Protection', 'Dullness', 'Uneven Tone'],
    stock: 70,
    isFeatured: true,
    isBestseller: false,
    isNewArrival: true,
    size: '50 ml / 1.7 fl. oz.'
  }
];

export const SEED_COUPONS: ISeedCoupon[] = [
  {
    code: 'RUBY10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 499,
    expiresAt: '2028-12-31T23:59:59.000Z',
    isActive: true
  },
  {
    code: 'GLOW10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 499,
    expiresAt: '2028-12-31T23:59:59.000Z',
    isActive: true
  },
  {
    code: 'WELCOME20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 999,
    maxDiscount: 500,
    expiresAt: '2028-12-31T23:59:59.000Z',
    isActive: true
  },
  {
    code: 'FREESHIP',
    discountType: 'fixed',
    discountValue: 99,
    minOrderValue: 499,
    expiresAt: '2028-12-31T23:59:59.000Z',
    isActive: true
  }
];

export const SEED_REVIEWS = [
  {
    productId: 'prod_01',
    userName: 'Elena Rostova',
    rating: 5,
    title: 'Holy grail Vitamin C!',
    comment: 'I have tried numerous vitamin C serums that either smelled metallic or broke me out. RubyCare’s Radiance C+ is in a league of its own. Within 3 weeks my post-acne marks faded considerably!',
    verifiedPurchase: true,
    createdAt: '2026-09-15T10:30:00.000Z'
  },
  {
    productId: 'prod_01',
    userName: 'Sophia Martinez',
    rating: 5,
    title: 'Unbelievable glow',
    comment: 'Gives my skin such a luminous look every morning. Sinks in immediately without any stickiness. Will definitely repurchase.',
    verifiedPurchase: true,
    createdAt: '2026-09-28T14:22:00.000Z'
  },
  {
    productId: 'prod_02',
    userName: 'David Chen',
    rating: 5,
    title: 'Saved my compromised barrier',
    comment: 'After over-exfoliating with harsh acids, my skin was red, peeling, and burning with everything. This cloud cream healed my barrier in 3 days flat. Truly remarkable texture.',
    verifiedPurchase: true,
    createdAt: '2026-10-02T09:12:00.000Z'
  },
  {
    productId: 'prod_04',
    userName: 'Aisha Khan',
    rating: 5,
    title: 'Zero white cast on dark skin!',
    comment: 'Finding a 100% mineral zinc sunscreen that does not look ashy on melanin-rich skin is practically a miracle. RubyCare did it! It leaves a silky satin finish.',
    verifiedPurchase: true,
    createdAt: '2026-10-08T18:45:00.000Z'
  }
];
