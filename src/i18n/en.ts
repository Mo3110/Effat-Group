import type { Dict } from './ar'
import { solutionsEn } from './solutions.en'

/**
 * English. Typed against the Arabic dictionary, so any key missing here fails
 * `tsc` rather than rendering an empty string.
 *
 * Register: plain, direct B2B English — the audience is multinational plant
 * managers, consultants and Gulf buyers, not consumers.
 */
export const en: Dict = {
  meta: {
    title: 'Effat Group — Fire, Security & Safety Systems',
    template: '%s | Effat Group',
    description:
      'Supply, installation and maintenance of fire fighting, fire alarm, CCTV and industrial safety equipment. Published prices on consumables, engineered quotes for systems. Heliopolis, Cairo.',
  },

  common: {
    home: 'Home',
    requestQuote: 'Request a quote',
    askWhatsApp: 'Ask on WhatsApp',
    byQuote: 'On quote',
    currency: 'EGP',
    breadcrumb: 'Breadcrumb',
    switchTo: 'العربية',
    switchLocale: 'ar' as const,
  },

  header: {
    tagline: 'Heliopolis, Cairo · Supply · Install · Maintain',
    urgent: 'Urgent service',
    searchPlaceholder: 'Search extinguishers, detectors, cameras, safety boots…',
    services: 'Services',
  },

  footer: {
    about:
      'Supply, installation and maintenance of fire, security and safety systems for facilities, factories and buildings.',
    sections: 'Categories',
    refill: 'Extinguisher refill',
    contracts: 'Annual maintenance contracts',
    contact: 'Contact',
    address: 'Heliopolis, Cairo',
    whatsapp: 'WhatsApp',
    rights: 'All rights reserved',
  },

  fab: {
    label: 'Chat on WhatsApp',
    text: 'WhatsApp',
    message: 'Hello, I would like to ask about',
  },

  families: {
    'fire-fighting': {
      title: 'Fire Fighting',
      blurb: 'Extinguishers, hose reels and cabinets, hydrants, sprinklers, pumps and suppression systems',
    },
    'fire-alarm': {
      title: 'Fire Alarm',
      blurb: 'Conventional and addressable panels, smoke and heat detectors, call points, sounders and emergency lighting',
    },
    'security-systems': {
      title: 'Security & Low Current',
      blurb: 'CCTV cameras, recorders, biometric access control, gates and barriers',
    },
    'industrial-safety': {
      title: 'Industrial Safety',
      blurb: 'Helmets and eyewear, gloves and coveralls, safety footwear, road safety, first aid',
    },
  },

  hero: {
    navLabel: 'Sections',
    trustLine: 'Supply, install & maintain · Civil Defense approved · Cash on delivery available',
    acts: {
      hall: {
        eyebrow: 'Under one roof',
        title: 'One centre for fire, security and safety',
        body: 'Fire fighting, fire alarm, security and surveillance, and safety equipment — from one supplier, on one contract, with one warranty.',
        ctaLabel: 'Browse all categories',
        alt: 'Integrated security, fire fighting and safety systems centre — under one roof',
        chip: 'The centre',
      },
      plant: {
        eyebrow: 'Act one · Protection',
        title: 'We protect the building itself',
        body: 'Suppression networks and pipework, fire pumps, addressable and conventional alarm panels, smoke and heat detectors — designed, supplied and installed to Civil Defense standards.',
        ctaLabel: 'Browse alarm & fire fighting',
        alt: 'Fire pump room with red pipework and fire alarm control panels',
        chip: 'Alarm & suppression',
      },
      equipment: {
        eyebrow: 'Act two · Equipment',
        title: 'Every piece of fire equipment in one place',
        body: 'Extinguishers of every type, hose reels and cabinets, hydrants and valves, brass couplings — with published prices and delivery to every governorate in Egypt.',
        ctaLabel: 'Browse fire fighting',
        alt: 'Fire fighting equipment family: hydrants, hose reels, fire cabinets, extinguishers and valves',
        chip: 'Fire fighting',
      },
      ppe: {
        eyebrow: 'Act three · People',
        title: 'And we protect your team too',
        body: 'Coveralls and workwear, safety footwear, helmets, gloves and eyewear — always in stock, fast shipping nationwide, and the best quality at the lowest price.',
        ctaLabel: 'Browse industrial safety',
        alt: 'Industrial safety equipment: coveralls, safety boots, helmets, gloves and protective eyewear',
        chip: 'Industrial safety',
      },
    },
  },

  home: {
    trust: [
      { n: '4', l: 'product families under one roof' },
      { n: '140+', l: 'categories and products' },
      { n: 'Approved', l: 'by Civil Defense' },
      { n: '24/7', l: 'maintenance and emergency' },
    ],
    combinedTitle: 'All of it under one roof',
    combinedBody:
      'From the pump room to the safety boot — fire, alarm, surveillance and safety equipment from one supplier, with one warranty.',
    familiesTitle: 'Shop by category',
    familiesBody: 'Published prices on consumables and PPE; engineered quotes for systems.',
    browse: 'Browse category',
    servicesTitle: 'Maintenance & compliance services',
    servicesBody:
      'Every extinguisher needs a refill and inspection every year. Book it, and keep your facility compliant with Civil Defense requirements.',
    services: [
      {
        slug: 'extinguisher-refill',
        t: 'Extinguisher refill & testing',
        d: 'Inspection, refill and pressure test — on site or in our workshop.',
        urgent: true,
      },
      {
        slug: 'annual-inspection',
        t: 'Annual inspection & Civil Defense certificate',
        d: 'A full facility inspection report and the annual certificate.',
        urgent: false,
      },
      {
        slug: 'maintenance-contract',
        t: 'Annual maintenance contracts',
        d: 'Three tiers by facility size, with automatic reminders before each visit.',
        urgent: false,
      },
    ],
    bookNow: 'Book now',
    learnMore: 'Learn more',
    bundlesTitle: 'Ready-made bundles by facility type',
    bundlesBody: 'Everything your facility needs to pass inspection, in one package.',
    bundles: [
      ['restaurant', 'Restaurants & cafés'],
      ['warehouse', 'Warehouses'],
      ['factory', 'Factories'],
      ['school', 'Schools & nurseries'],
      ['clinic', 'Clinics & hospitals'],
      ['office', 'Offices'],
      ['datacenter', 'Server rooms'],
      ['residential', 'Residential'],
    ],
  },

  stock: {
    in_stock: 'In stock',
    low: 'Low stock',
    on_order: 'On order',
    out: 'Out of stock',
  },

  saleMode: {
    cart: 'Published prices',
    quote: 'On quote',
    hybrid: 'Published prices · quote for volume',
  },

  category: {
    metaDescription: (title: string, kw: string) =>
      `${title} — supplied, installed and maintained by Effat Group. ${kw}`,
    subcategories: 'Subcategories',
    products: 'Products',
    emptyTitle: 'No products in this category yet.',
    emptyBody: 'Request a quote and we will come back with availability and pricing within one working day.',
    waMessage: (title: string) => `Hello, I would like to ask about ${title}`,
    pagerLabel: 'Pagination',
    prev: 'Previous',
    next: 'Next',
    page: 'Page',
    of: 'of',
  },

  product: {
    sku: 'SKU',
    noImage: 'No image',
    quoteTitle: 'Priced to specification and quantity',
    quoteBody: 'Send us the specification or bill of quantities and we will return a quote within one working day.',
    vatIncl: 'Including VAT',
    vatExcl: 'ex. VAT',
    orderProduct: 'Order this product',
    waMessage: (title: string, sku?: string | null) =>
      `Hello, I would like to ask about ${title}${sku ? ` (${sku})` : ''}`,
    hybridNote: 'Special pricing for volume and projects — request a quote.',
    trustCod: 'Cash on delivery available',
    trustDelivery: 'Delivery to every governorate',
    trustInstall: 'Supply, install & maintain',
    warranty: (months: number) => `${months}-month warranty`,
    invoice: 'Tax invoice',
    specs: 'Specifications',
    refill: 'Refill',
    refillEvery: (months: number) => `every ${months} months`,
    bookMaintenance: 'Book maintenance',
    related: 'More from this category',
  },

  services: {
    title: 'Services',
    description:
      'Extinguisher refill and testing, annual inspection and Civil Defense certification, annual maintenance contracts, supply and installation, and emergency team training.',
    intro:
      'Every extinguisher needs a refill and inspection each year, and every facility needs a valid certificate. We handle all of it under one contract, with automatic reminders before each visit.',
    annual: 'Annual service',
    urgentNote:
      'Extinguishers must be inspected and refilled every 12 months under Civil Defense requirements. Book early to keep your facility compliant.',
    tiers: 'Tiers',
    from: 'From',
    bookAppointment: 'Book an appointment',
    bookWhatsApp: 'Book on WhatsApp',
    waMessage: (title: string) => `Hello, I would like to book ${title}`,
  },

  search: {
    title: 'Search results',
    emptyTitle: 'Search the catalogue',
    emptyHint: 'Type a product or category name in the search box above — for example “powder extinguisher” or “safety boots”.',
    resultsFor: (term: string) => `Results for “${term}”`,
    count: (p: number, c: number) => `${p} products · ${c} categories`,
    noResults: 'No matching results.',
    tryShorter: 'Try a shorter term, or request a quote and we will come back with availability and pricing.',
    categories: 'Categories',
    products: 'Products',
  },

  solutions: solutionsEn,

  quote: {
    title: 'Request a quote',
    description:
      'Request a quote for fire fighting, fire alarm, CCTV and industrial safety equipment. Reply within one working day.',
    intro:
      'For systems and projects we price to specification and quantity. Fill in the form and we will reply within one working day — or send us the bill of quantities directly on WhatsApp.',
    successTitle: 'Request received ✅',
    successBody: 'We will review it and send your quote within one working day. In a hurry? Message us on WhatsApp.',
    name: 'Name',
    phone: 'Mobile number',
    company: 'Company / facility',
    email: 'Email',
    governorate: 'Governorate',
    chooseGovernorate: 'Choose a governorate',
    details: 'Request details',
    detailsPlaceholder: 'List the items and quantities, the type of facility, and anything else that helps us price accurately.',
    submit: 'Send request',
    sending: 'Sending…',
    privacy: 'We use these details only to send your quote — nothing else.',
    governorates: [
      'Cairo', 'Giza', 'Qalyubia', 'Alexandria', 'Sharqia', 'Dakahlia', 'Gharbia',
      'Monufia', 'Beheira', 'Port Said', 'Suez', 'Ismailia', 'Asyut', 'Minya',
      'Sohag', 'Aswan', 'Luxor', 'Red Sea', 'Matrouh', 'North Sinai', 'South Sinai', 'Other',
    ],
    errors: {
      rateLimited: 'Too many requests in a short time. Please wait a moment and try again.',
      name: 'Please enter your name.',
      phone: 'Invalid mobile number. Example: 01012345678',
      email: 'Invalid email address.',
      generic: 'Something went wrong while sending. Please try again or message us on WhatsApp.',
    },
  },
}
