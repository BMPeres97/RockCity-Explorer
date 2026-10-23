/**
 * RockCity Explorer - Kurunegala Seed Data
 * Curated authentic destinations in and around Kurunegala, Sri Lanka
 * Reference Location: 7.4692807, 80.4424776
 */

const categoriesData = [
  {
    name: 'Religious',
    slug: 'religious',
    description: 'Sacred Buddhist shrines, hilltop statues, cave temples, and peaceful places of worship.',
    icon: 'landmark',
    color: '#0d9488',
    displayOrder: 1
  },
  {
    name: 'Nature',
    slug: 'nature',
    description: 'Scenic rock outcrops, serene lakes, lush forest reserves, and wildlife nature trails.',
    icon: 'mountain',
    color: '#16a34a',
    displayOrder: 2
  },
  {
    name: 'Heritage',
    slug: 'heritage',
    description: 'Ancient rock fortresses, historic ruins, colonial architecture, and monastic remnants.',
    icon: 'castle',
    color: '#d97706',
    displayOrder: 3
  },
  {
    name: 'Cultural',
    slug: 'cultural',
    description: 'Local artisanal crafts, cultural centers, historic city quarters, and Sri Lankan heritage.',
    icon: 'palette',
    color: '#8b5cf6',
    displayOrder: 4
  }
];

const placesData = [
  {
    name: 'Ethagala (Elephant Rock) & Samadhi Buddha',
    category: 'Religious',
    shortDescription: 'Kurunegala’s iconic 88-foot seated white Buddha statue perched atop the massive Elephant Rock with panoramic valley views.',
    description: 'Ethagala, meaning Elephant Rock in Sinhala, is the defining landmark of Kurunegala. Rising 316 meters above sea level, the rock resembles a colossal kneeling elephant. Perched at its peak is an impressive 88-foot tall white Buddha statue in the Samadhi posture, consecrated in 2003. Visitors can hike the shaded pathway or take a vehicle up to the summit to experience sweeping 360-degree vistas over Kurunegala town, the tranquil lake, and surrounding rocky outcrops.',
    address: 'Ethagala Peak Road, Kurunegala 60000, Sri Lanka',
    latitude: 7.4867,
    longitude: 80.3685,
    thumbnail: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1200&q=80'
    ],
    openingHours: {
      open: '05:30',
      close: '18:30',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      alwaysOpen: false
    },
    entryFee: {
      isFree: false,
      localPrice: 50,
      foreignPrice: 500,
      currency: 'LKR',
      note: 'Nominal donation towards summit temple maintenance'
    },
    dressCode: 'Strict modest dress required: shoulders and knees must be covered. Footwear and caps must be removed before entering the upper sanctuary.',
    peakHours: '06:00 - 08:00 (sunrise) and 16:30 - 18:30 (sunset and cool mountain breeze)',
    localTravelTips: [
      'Climb either early morning or late afternoon to avoid the intense midday rock heat.',
      'Wear socks if walking on stone tiles in the afternoon as surfaces become hot.',
      'Tuk-tuks are readily available from the Kurunegala Clock Tower for the uphill ride.',
      'Carry bottled water, although cold drinks are sold at the summit pavilion.'
    ],
    rating: 4.8,
    reviewsCount: 342,
    featured: true
  },
  {
    name: 'Ridi Viharaya (Silver Temple), Ridigama',
    category: 'Heritage',
    shortDescription: 'Magnificent 2nd-century BC cave temple built with silver from King Dutugemunu’s reign, decorated with Dutch Delft tiles and Kandyan murals.',
    description: 'Ridi Viharaya (The Silver Temple) dates back to the 2nd century BC during the reign of King Dutugemunu. According to the ancient Mahavamsa chronicle, a vein of silver ore discovered here supplied the silver required to complete the Great Ruwanwelisaya stupa in Anuradhapura. In gratitude, the king erected this splendid cave temple complex. It features the Maha Viharaya and Uda Viharaya filled with masterwork Kandyan frescoes, intricately carved wooden door frames, a gold-plated Buddha statue, and unique blue-and-white Biblical Dutch Delft tiles adorning the altar.',
    address: 'Ridigama Road, Ridigama, Kurunegala District, Sri Lanka',
    latitude: 7.5594,
    longitude: 80.4633,
    thumbnail: 'https://images.unsplash.com/photo-1596761226993-8c442e316e62?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1596761226993-8c442e316e62?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600100397608-f010e42f4c40?auto=format&fit=crop&w=1200&q=80'
    ],
    openingHours: {
      open: '06:30',
      close: '18:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      alwaysOpen: false
    },
    entryFee: {
      isFree: true,
      localPrice: 0,
      foreignPrice: 0,
      currency: 'LKR',
      note: 'Free entry; voluntary temple donation boxes available'
    },
    dressCode: 'White or modest light-colored attire covering shoulders and below the knee. Hats and shoes must be removed before entering caves.',
    peakHours: '09:30 - 11:30 during morning Pooja offerings and weekend pilgrimages',
    localTravelTips: [
      'Ask the resident monk or temple keeper to unlock the inner shrine room to see the historic Dutch Delft tiles.',
      'Inspect the stone inscriptions carved into the natural drip-ledge caves.',
      'Allow about 1.5 to 2 hours for a complete, unhurried exploration.'
    ],
    rating: 4.9,
    reviewsCount: 285,
    featured: true
  },
  {
    name: 'Kurunegala Lake Promenade (Kurunegala Wewa)',
    category: 'Nature',
    shortDescription: 'Peaceful artificial lake in the heart of Kurunegala with a scenic paved walking track, water lilies, and stunning rock silhouette views.',
    description: 'Surrounded by the iconic towering rock outcrops of Athugala, Ibbagala, and Andagala, the Kurunegala Lake (Kurunegala Wewa) is an ancient reservoir modernized with an attractive, shaded walking promenade. Stretching over 3.5 km around its banks, the lake is a favorite gathering spot for locals and visitors to stroll, jog, birdwatch, and soak in the evening breeze. The reflection of Elephant Rock upon the calm lake waters creates one of Sri Lanka’s most photogenic provincial scenes.',
    address: 'Circular Road, Kurunegala 60000, Sri Lanka',
    latitude: 7.4820,
    longitude: 80.3705,
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80'
    ],
    openingHours: {
      open: '00:00',
      close: '23:59',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      alwaysOpen: true
    },
    entryFee: {
      isFree: true,
      localPrice: 0,
      foreignPrice: 0,
      currency: 'LKR',
      note: 'Completely free public recreational area'
    },
    dressCode: 'Casual comfortable sportswear or daytime travel clothing',
    peakHours: '06:00 - 08:00 (morning walk) and 17:00 - 19:30 (lively sunset atmosphere)',
    localTravelTips: [
      'Great spot for fresh King Coconut (Thambili) and roadside roasted street snacks.',
      'Rent a paddleboat or relax at the lakeside cafes overlooking the water.',
      'Ideal starting or finishing place for an evening wind-down after touring rock temples.'
    ],
    rating: 4.6,
    reviewsCount: 410,
    featured: true
  },
  {
    name: 'Arankele Forest Monastery & Ancient Hospital',
    category: 'Heritage',
    shortDescription: 'Mystical 6th-century forest hermitage built for meditating monks, complete with stone meditation pathways and ancient Ayurvedic baths.',
    description: 'Nestled beneath a canopy of ancient tropical trees and creeping lianas, Arankele is a celebrated 6th-century BC forest hermitage (Tapovana) designed for the strict ascetic forest-dwelling monks known as Pansakulikas. Free of decorative sculptures according to their monastic vows, the complex is renowned for its architectural harmony with nature. It includes meditative stone walkways (Cankamanagaraya), unique double-platform monastic cells, natural hot-water Ayurvedic stone medicinal baths (Jantaghara), and stone conduits designed for cooling.',
    address: 'Arankele, Ibbagamuwa, Kurunegala District, Sri Lanka',
    latitude: 7.6533,
    longitude: 80.3883,
    thumbnail: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80'
    ],
    openingHours: {
      open: '07:00',
      close: '17:30',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      alwaysOpen: false
    },
    entryFee: {
      isFree: true,
      localPrice: 0,
      foreignPrice: 0,
      currency: 'LKR',
      note: 'Free admission; preserved by Sri Lanka Department of Archaeology'
    },
    dressCode: 'Modest respectful clothing; quiet contemplation is strictly maintained out of respect for resident forest monks.',
    peakHours: '08:30 - 11:00 before the tropical heat rises',
    localTravelTips: [
      'Maintain quiet voices as silent meditation is practiced nearby.',
      'Bring natural mosquito or insect repellent due to dense foliage.',
      'Stout walking shoes are recommended for walking on historic stone pathways.'
    ],
    rating: 4.8,
    reviewsCount: 195,
    featured: true
  },
  {
    name: 'Ibbagala (Tortoise Rock) Ancient Viharaya',
    category: 'Religious',
    shortDescription: 'Historic rock temple located on the rock outcrop resembling a tortoise shell, containing ancient rock inscriptions and drip ledges.',
    description: 'Ibbagala (The Tortoise Rock) is situated adjacent to Athugala in Kurunegala town. The rock formation bears a striking resemblance to a tortoise carapace. The ancient Ibbagala Viharaya possesses deep archaeological heritage dating back to the Kurunegala Kingdom period (13th-14th century). Cave shrines with drip ledges, sacred Bo trees growing amidst stone crevices, and ancient stone staircases make this an atmospheric spiritual retreat just minutes from the city center.',
    address: 'Ibbagala Vihara Road, Kurunegala 60000, Sri Lanka',
    latitude: 7.4842,
    longitude: 80.3662,
    thumbnail: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80'
    ],
    openingHours: {
      open: '06:00',
      close: '18:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      alwaysOpen: false
    },
    entryFee: {
      isFree: true,
      localPrice: 0,
      foreignPrice: 0,
      currency: 'LKR',
      note: 'Free entry; donations support temple upkeep'
    },
    dressCode: 'Conservative temple attire covering shoulders and knees. Footwear removed at temple precincts.',
    peakHours: 'Morning hours 07:00 - 09:30 during peaceful morning chanting',
    localTravelTips: [
      'Combine this visit with Athugala (Elephant Rock) as they are directly adjacent.',
      'Offers a vantage point of Elephant Rock that few tourists know about.',
      'Features ancient cave inscriptions and stone carvings.'
    ],
    rating: 4.5,
    reviewsCount: 160,
    featured: false
  },
  {
    name: 'Badagamuwa Conservation Forest & Nature Trail',
    category: 'Nature',
    shortDescription: 'Biodiverse secondary tropical rainforest sanctuary with towering canopy trees, endemic birds, and serene walking trails.',
    description: 'Badagamuwa Conservation Forest is located along the Kurunegala-Dambulla highway. Covering over 200 hectares, it is one of the few surviving patches of pristine dry-zone evergreen forest in the Kurunegala basin. The forest reserve is home to a rich variety of indigenous flora including majestic Ebony and Teak trees, over 100 species of resident and migratory birds, butterflies, and gentle troop of Toque Macaques and Gray Langurs. Well-maintained nature paths offer a tranquil nature walk.',
    address: 'Dambulla Road, Badagamuwa, Kurunegala, Sri Lanka',
    latitude: 7.4525,
    longitude: 80.3444,
    thumbnail: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80'
    ],
    openingHours: {
      open: '06:00',
      close: '18:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      alwaysOpen: false
    },
    entryFee: {
      isFree: true,
      localPrice: 0,
      foreignPrice: 0,
      currency: 'LKR',
      note: 'Public conservation reserve maintained by Department of Forest Conservation'
    },
    dressCode: 'Outdoor nature walk gear: sturdy sneakers or boots and lightweight breathable clothing.',
    peakHours: '06:30 - 09:00 for prime birdwatching and cooler temperatures',
    localTravelTips: [
      'Bring binoculars for birding; look out for Sri Lanka Grey Hornbills and Brown-capped Babblers.',
      'Stay on designated marked trails to protect sensitive flora.',
      'Take drinking water as there are no shops inside the sanctuary.'
    ],
    rating: 4.5,
    reviewsCount: 145,
    featured: false
  },
  {
    name: 'Panduwasnuwara Ancient Kingdom & Moated Citadel',
    category: 'Heritage',
    shortDescription: 'Magnificent ruins of the 12th-century secondary capital city featuring an intact circular palace moat, royal court, and stupas.',
    description: 'Panduwasnuwara is an extraordinarily well-preserved archaeological site that served as the capital of King Parakramabahu I in the 12th century before he unified Sri Lanka. The expansive city ruins sprawl across several square kilometers, featuring a colossal circular earthen rampart and moat surrounding the Royal Citadel. Excavations have revealed royal audience halls, carved stone pillars, a monastery complex, ancient bath ponds, and a museum holding unearthed coins, pottery, and weapons.',
    address: 'Panduwasnuwara, Kurunegala District, North Western Province, Sri Lanka',
    latitude: 7.5855,
    longitude: 80.1985,
    thumbnail: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80'
    ],
    openingHours: {
      open: '08:00',
      close: '17:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      alwaysOpen: false
    },
    entryFee: {
      isFree: false,
      localPrice: 100,
      foreignPrice: 650,
      currency: 'LKR',
      note: 'Archaeological entry ticket includes on-site archaeological museum'
    },
    dressCode: 'Casual comfortable clothing for extensive outdoor walking; hats and sunglasses recommended.',
    peakHours: '09:00 - 12:00 for exploring the ruins before afternoon sun',
    localTravelTips: [
      'Visit the archaeological museum at the entrance before walking the ruins.',
      'Rent an umbrella or wear a sun hat as there is open sun across the palace grounds.',
      'Take photos of the legendary "Ektamge" circular moat tower base.'
    ],
    rating: 4.7,
    reviewsCount: 220,
    featured: true
  },
  {
    name: 'Kurunegala Clock Tower & Heritage Quarter',
    category: 'Cultural',
    shortDescription: 'Historic 1922 stone landmark tower erected in memory of Wayamba Province soldiers, surrounded by vibrant local markets and spice stalls.',
    description: 'Built in 1922 in memory of local officers from Kurunegala and Wayamba who gave their lives during World War I, the Kurunegala Clock Tower stands proudly at the historical heart of the city. The tower is constructed from native granite dressed stone, showcasing classic British colonial civic architecture. Surrounding the clock tower is the bustling heritage quarter, packed with traditional Sri Lankan brassware sellers, spice merchants, handloom textile boutiques, and popular local bakeries.',
    address: 'Central Cross Street, Kurunegala 60000, Sri Lanka',
    latitude: 7.4855,
    longitude: 80.3648,
    thumbnail: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80'
    ],
    openingHours: {
      open: '00:00',
      close: '23:59',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      alwaysOpen: true
    },
    entryFee: {
      isFree: true,
      localPrice: 0,
      foreignPrice: 0,
      currency: 'LKR',
      note: 'Public urban landmark'
    },
    dressCode: 'Casual city street attire',
    peakHours: '10:00 - 18:00 when street markets and shops are fully vibrant',
    localTravelTips: [
      'Central navigation hub — all local buses and tuk-tuks congregate around this sector.',
      'Sample famous Kurunegala egg rotis and fresh fruit juice from nearby cafes.',
      'Photograph the tower against the dramatic backdrop of Athugala Elephant Rock.'
    ],
    rating: 4.4,
    reviewsCount: 310,
    featured: false
  },
  {
    name: 'Athkanda Viharaya Ancient Buddhist Monastery',
    category: 'Religious',
    shortDescription: 'Revered ancient temple where the famous Jataka stories were translated into the Sinhala language during the 14th century.',
    description: 'Athkanda Viharaya, located on the northern slope of Elephant Rock, holds supreme literary and cultural importance in Sri Lankan history. It was within this quiet monastery during the Kurunegala Kingdom period (King Panditha Parakramabahu IV) that 550 Buddhist Jataka tales were translated from Pali into Sinhala, creating the monumental literary classic "Pansiya Panas Jathaka Potha". The temple features an ancient image house, stupa, and an ancient sacred library site.',
    address: 'Kandy Road, Kurunegala 60000, Sri Lanka',
    latitude: 7.4811,
    longitude: 80.3640,
    thumbnail: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
    ],
    openingHours: {
      open: '06:00',
      close: '18:30',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      alwaysOpen: false
    },
    entryFee: {
      isFree: true,
      localPrice: 0,
      foreignPrice: 0,
      currency: 'LKR',
      note: 'Free admission; donations appreciated'
    },
    dressCode: 'Modest temple clothing covering shoulders and knees; remove footwear.',
    peakHours: '07:00 - 09:00 and 16:30 - 18:00',
    localTravelTips: [
      'Examine the ancient manuscript displays inside the monastery hall.',
      'The quiet courtyard is great for peaceful reading and contemplation.',
      'Very accessible, just 5 minutes walk from Kurunegala central bus station.'
    ],
    rating: 4.6,
    reviewsCount: 175,
    featured: false
  },
  {
    name: 'Andagala (Eel Rock) Scenic Ridge & Viewpoint',
    category: 'Nature',
    shortDescription: 'One of the seven famous animal rocks of Kurunegala offering scenic trekking trails and dramatic sunset photography.',
    description: 'Andagala, named for its elongated shape resembling an eel (Anda in Sinhala), is part of the legendary seven rocks that surround the ancient royal city. A favorite for outdoor enthusiasts and local hikers, the trail winds through scrub jungle and granite rock surfaces to a breezy summit. From the crest, hikers enjoy breathtaking panoramas of Athugala, Kurunegala Lake, and the distant Knuckles mountain range on clear mornings.',
    address: 'Andagala Ridge, Kurunegala 60000, Sri Lanka',
    latitude: 7.4950,
    longitude: 80.3600,
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
    ],
    openingHours: {
      open: '06:00',
      close: '18:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      alwaysOpen: false
    },
    entryFee: {
      isFree: true,
      localPrice: 0,
      foreignPrice: 0,
      currency: 'LKR',
      note: 'Free outdoor natural hiking area'
    },
    dressCode: 'Outdoor activewear and hiking shoes with good grip on granite stone.',
    peakHours: '06:00 - 08:30 (sunrise trek) and 16:30 - 18:00 (sunset view)',
    localTravelTips: [
      'Wear shoes with good traction as rock faces can be slippery after rain.',
      'Bring your own water bottle and sunscreen.',
      'Uncrowded alternative to Athugala for panoramic photography.'
    ],
    rating: 4.7,
    reviewsCount: 130,
    featured: false
  },
  {
    name: 'Dambadeniya Ancient Royal Palace Complex',
    category: 'Heritage',
    shortDescription: 'Fortified rock citadel that served as the capital of Sri Lanka during the mid-13th century under King Vijayabahu III and Parakramabahu II.',
    description: 'Located south-west of Kurunegala, Dambadeniya was chosen as the capital of Sri Lanka in 1232 AD following the fall of Polonnaruwa. The Royal Palace and Dalada Maligawa (Temple of the Tooth Relic) were built atop the massive Dambadeniya Rock for strategic defense. Today, visitors can explore the rock-cut steps, foundation stones of the royal bedchamber, ancient water cisterns cut into solid rock, and the revered Vijayasundararamaya temple at the base.',
    address: 'Dambadeniya Rock Complex, Giriulla-Kurunegala Road, Sri Lanka',
    latitude: 7.3592,
    longitude: 80.1478,
    thumbnail: 'https://images.unsplash.com/photo-1590059390047-975d0b90e9ff?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1590059390047-975d0b90e9ff?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80'
    ],
    openingHours: {
      open: '08:00',
      close: '17:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      alwaysOpen: false
    },
    entryFee: {
      isFree: false,
      localPrice: 50,
      foreignPrice: 500,
      currency: 'LKR',
      note: 'Archaeological heritage site entry ticket'
    },
    dressCode: 'Comfortable clothing for rock climb; temple dress required when visiting Vijayasundararamaya at base.',
    peakHours: '08:30 - 11:00 before afternoon heat',
    localTravelTips: [
      'Climbing the summit stairs takes about 25-35 minutes.',
      'Look for the natural rock ponds that provided fresh water to the royal court.',
      'Visit the ground-level museum displaying excavated artefacts.'
    ],
    rating: 4.6,
    reviewsCount: 180,
    featured: false
  },
  {
    name: 'Wayamba Traditional Pottery & Handloom Center',
    category: 'Cultural',
    shortDescription: 'Community artisan workshop showcasing authentic Sri Lankan pottery throwing, handloom textile weaving, and cane basketry.',
    description: 'Kurunegala and the Wayamba province boast a century-old tradition of artisanal handicrafts. At this lively cultural craft center, visitors can watch master artisans work traditional foot-pedal pottery wheels, witness intricate handloom sarongs and wall tapestries being woven, and observe cane reed weaving. Tourists are invited to try shaping clay on the wheel and purchase authentic handmade souvenirs directly supporting local craft families.',
    address: 'Negombo Road, Malkaduwawa, Kurunegala 60000, Sri Lanka',
    latitude: 7.4720,
    longitude: 80.3550,
    thumbnail: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80'
    ],
    openingHours: {
      open: '09:00',
      close: '18:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      alwaysOpen: false
    },
    entryFee: {
      isFree: true,
      localPrice: 0,
      foreignPrice: 0,
      currency: 'LKR',
      note: 'Free admission; purchases support local craftsmen'
    },
    dressCode: 'Casual everyday attire',
    peakHours: '10:30 - 15:30 when artisan live demonstrations are actively operating',
    localTravelTips: [
      'Try the hands-on pottery wheel workshop for a small token fee.',
      'Great place to purchase authentic Ceylon cinnamon, spice packs, and clay cookware.',
      'Credit cards and cash accepted at the fair-trade gift shop.'
    ],
    rating: 4.7,
    reviewsCount: 152,
    featured: true
  }
];

module.exports = {
  categoriesData,
  placesData
};
