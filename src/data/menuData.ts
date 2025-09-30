export interface MenuItem {
  id: number;
  name: string;
  subtitle?: string;
  price: number;
  emoji: string;
  description: string;
  category: string;
  heat?: string;
  popular?: boolean;
  tagline?: string;
  needsCustomization?: boolean;
}

export const menuData: Record<string, MenuItem[]> = {
  featured: [
    { 
      id: 1, 
      name: "Buffalo Wings", 
      subtitle: "The OG", 
      price: 12.99, 
      emoji: "🍗", 
      description: "This is what made us famous. Crispy, saucy, perfect. If you're here for the first time, start here.", 
      category: "wings", 
      heat: "🔥🔥🔥",
      popular: true,
      tagline: "Can't go wrong with the classic",
      needsCustomization: true
    },
    { 
      id: 2, 
      name: "Honey BBQ Wings", 
      subtitle: "Sweet talker", 
      price: 12.99, 
      emoji: "🍗", 
      description: "Sweet, smoky, and dangerously addictive. People order these by the bucket. You'll see why.", 
      category: "wings", 
      heat: "🔥",
      popular: true,
      tagline: "For when you want flavor without the fire",
      needsCustomization: true
    },
    { 
      id: 3, 
      name: "Loaded Fries", 
      subtitle: "Don't skip these", 
      price: 7.99, 
      emoji: "🍟", 
      description: "Crispy fries buried under melted cheese, bacon, and ranch. Yeah, they're that good.",
      category: "sides",
      popular: true
    }
  ],
  wings: [
    { 
      id: 1, 
      name: "Buffalo Wings", 
      subtitle: "The OG", 
      price: 12.99, 
      emoji: "🍗", 
      description: "This is what made us famous. Crispy, saucy, perfect. If you're here for the first time, start here.", 
      needsCustomization: true, 
      heat: "🔥🔥🔥",
      popular: true,
      tagline: "Can't go wrong with the classic",
      category: "wings"
    },
    { 
      id: 4, 
      name: "Honey BBQ Wings", 
      subtitle: "Sweet talker", 
      price: 12.99, 
      emoji: "🍗", 
      description: "Sweet, smoky, and dangerously addictive. People order these by the bucket. You'll see why.", 
      needsCustomization: true, 
      heat: "🔥",
      popular: true,
      tagline: "For when you want flavor without the fire",
      category: "wings"
    },
    { 
      id: 5, 
      name: "Lemon Pepper Wings", 
      subtitle: "Bright & zesty", 
      price: 12.99, 
      emoji: "🍗", 
      description: "Tangy lemon, cracked pepper, no sauce needed. These hit different.", 
      needsCustomization: true, 
      heat: "🔥",
      tagline: "Flavor without the mess",
      category: "wings"
    },
    { 
      id: 6, 
      name: "Teriyaki Wings", 
      subtitle: "East meets heat", 
      price: 12.99, 
      emoji: "🍗", 
      description: "Sweet, savory, with a little soy glaze magic. Not your typical wing joint flavor.", 
      needsCustomization: true, 
      heat: "🔥",
      tagline: "When you want something different",
      category: "wings"
    },
    { 
      id: 7, 
      name: "Mango Habanero Wings", 
      subtitle: "Tropical trouble", 
      price: 13.99, 
      emoji: "🍗", 
      description: "Sweet mango upfront, habanero heat on the back end. It's a ride.", 
      needsCustomization: true, 
      heat: "🔥🔥🔥🔥",
      tagline: "Sweet now, regret later (worth it)",
      category: "wings"
    },
    { 
      id: 8, 
      name: "Garlic Parmesan Wings", 
      subtitle: "Rich & savory", 
      price: 13.99, 
      emoji: "🍗", 
      description: "Buttery garlic, fresh parmesan, zero regrets. These disappear fast.", 
      needsCustomization: true, 
      heat: "🔥",
      tagline: "For the garlic lovers",
      category: "wings"
    },
    { 
      id: 9, 
      name: "Boneless Wings", 
      subtitle: "No bones about it", 
      price: 10.99, 
      emoji: "🍗", 
      description: "All the flavor, none of the work. Perfect for kids or people who like their wings easy.", 
      needsCustomization: true,
      tagline: "Less mess, same obsession",
      category: "wings"
    }
  ],
  sides: [
    { 
      id: 3, 
      name: "Loaded Fries", 
      subtitle: "Don't skip these", 
      price: 7.99, 
      emoji: "🍟", 
      description: "Crispy fries buried under melted cheese, bacon, and ranch. Yeah, they're that good.",
      popular: true,
      category: "sides"
    },
    { 
      id: 10, 
      name: "Regular Fries", 
      subtitle: "Simple perfection", 
      price: 4.99, 
      emoji: "🍟", 
      description: "Golden, crispy, salty. Sometimes basic is best.",
      category: "sides"
    },
    { 
      id: 11, 
      name: "Onion Rings", 
      subtitle: "Crispy circles of joy", 
      price: 5.99, 
      emoji: "🧅", 
      description: "Beer-battered, fried crispy, exactly how you want them.",
      category: "sides"
    },
    { 
      id: 12, 
      name: "Mozzarella Sticks", 
      subtitle: "Melty goodness", 
      price: 6.99, 
      emoji: "🧀", 
      description: "Breaded mozzarella, fried until the cheese pulls. Comes with marinara.",
      category: "sides"
    },
    { 
      id: 13, 
      name: "Coleslaw", 
      subtitle: "Cool & crunchy", 
      price: 3.99, 
      emoji: "🥗", 
      description: "Fresh, creamy, homemade. The perfect cool-down between wings.",
      category: "sides"
    }
  ],
  drinks: [
    { 
      id: 14, 
      name: "Soft Drinks", 
      subtitle: "The usual suspects", 
      price: 2.49, 
      emoji: "🥤", 
      description: "Coke, Sprite, Dr Pepper, or Fanta. Ice cold.",
      category: "drinks"
    },
    { 
      id: 15, 
      name: "Sweet Tea", 
      subtitle: "Southern classic", 
      price: 2.49, 
      emoji: "🍵", 
      description: "Brewed fresh, sweetened right. This is the real deal.",
      category: "drinks"
    },
    { 
      id: 16, 
      name: "Bottled Water", 
      subtitle: "Stay hydrated", 
      price: 1.99, 
      emoji: "💧", 
      description: "Cold bottled water. Sometimes you just need water.",
      category: "drinks"
    },
    { 
      id: 17, 
      name: "Lemonade", 
      subtitle: "Fresh squeezed", 
      price: 2.99, 
      emoji: "🍋", 
      description: "Tart, sweet, refreshing. Made here, not from a mix.",
      category: "drinks"
    }
  ],
  combos: [
    { 
      id: 18, 
      name: "Wing Lover Combo", 
      subtitle: "Solo mission", 
      price: 16.99, 
      emoji: "🎁", 
      description: "10 wings your way, fries, and a drink. Everything you need for a serious wing session.", 
      needsCustomization: true,
      tagline: "Built for one hungry person",
      category: "combos"
    },
    { 
      id: 19, 
      name: "Family Pack", 
      subtitle: "Feed the crew", 
      price: 39.99, 
      emoji: "👨‍👩‍👧‍👦", 
      description: "30 wings, 2 large fries, 4 drinks. Game day solved.", 
      needsCustomization: true,
      tagline: "Feeds 4-5 people (or 2 really hungry ones)",
      category: "combos"
    },
    { 
      id: 20, 
      name: "Date Night Special", 
      subtitle: "Share (or don't)", 
      price: 24.99, 
      emoji: "❤️", 
      description: "20 wings, loaded fries, 2 drinks. Perfect for two, or just you if you're really hungry.", 
      needsCustomization: true,
      tagline: "Romance is overrated, wings are forever",
      category: "combos"
    }
  ]
};