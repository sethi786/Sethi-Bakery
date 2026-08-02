/**
 * Curated free stock photography (Unsplash) used until real shop photos are
 * uploaded through the admin. Every render goes through SmartImage, which
 * falls back to branded art if a link ever breaks.
 *
 * Unsplash license: free for commercial use, no attribution required.
 */

const u = (id: string, w: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const img = {
  // hero: rustic croissants & breads on a wooden table
  hero: u("1555507036-ab1f4038808a", 1800),
  // story: baker hands kneading dough
  story: u("1556910103-1c02745aae4d", 900),
  // cake CTA banner: celebration cake with candles
  cakeBanner: u("1464349095431-e9a21285b5f3", 1400),

  products: {
    "black-forest-cake": u("1578985545062-69928b1d9587", 800),
    "chocolate-truffle-cake": u("1481391319762-47dff72954d9", 800),
    "pineapple-cake": u("1464349095431-e9a21285b5f3", 800),
    "red-velvet-cake": u("1586788680434-30d324b2d46f", 800),
    "chocolate-pastry": u("1551024506-0bccd828d307", 800),
    "pineapple-pastry": u("1565958011703-44f9829ba187", 800),
    "jam-roll": u("1607478900766-efe13248b125", 800),
    "cream-roll": u("1509365465985-25d11c17e812", 800),
    "veg-patty": u("1601050690597-df0568f70950", 800),
    "paneer-patty": u("1606491956689-2ea866880c84", 800),
    "fresh-white-bread": u("1549931319-a545dcf3bc73", 800),
    "atta-rusk": u("1558961363-fa8fdf82db35", 800),
    "amul-butter-100g": u("1589985270826-4b7bb135bc9d", 800),
    "parle-g-family-pack": u("1558964352-1d2c8c8c2b74", 800),
    "punjabi-namkeen-mix": u("1613919113640-25732ec5e61f", 800),
  } as Record<string, string>,

  categories: {
    cakes: u("1578985545062-69928b1d9587", 700),
    pastries: u("1551024506-0bccd828d307", 700),
    "patties-snacks": u("1601050690597-df0568f70950", 700),
    breads: u("1509440159596-0249088772ff", 700),
    grocery: u("1542838132-92c53300491e", 700),
  } as Record<string, string>,

  gallery: [
    u("1486427944299-d1955d23e34d", 600),
    u("1517433670267-08bbd4be890f", 600),
    u("1563729784474-d77dbb933a9e", 600),
    u("1488477181946-6428a0291777", 600),
    u("1509440159596-0249088772ff", 600),
    u("1534432182912-63863115e106", 600),
  ],
};

export const productEmoji: Record<string, string> = {
  "cat-cakes": "🎂",
  "cat-pastries": "🍰",
  "cat-snacks": "🥟",
  "cat-breads": "🍞",
  "cat-grocery": "🛒",
};

export const productGradients = [
  "linear-gradient(140deg, #F3E3D0, #E7CBAA)",
  "linear-gradient(140deg, #EFE0E2, #DFC3C8)",
  "linear-gradient(140deg, #E8EAD9, #D3D9BC)",
  "linear-gradient(140deg, #F5E8CE, #EAD4A5)",
];
