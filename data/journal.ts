// Pulse Journal — SEO articles. One source of truth for metadata, content, and FAQs.
// Each article renders through app/(marketing)/journal/[slug]/page.tsx.
// Keep copy plain-text (no HTML). Internal links live in `internalLinks` and the
// per-section `links` field so the article page renders real <Link> elements.

import type { FaqItem } from "./faqs";

export type JournalLink = { label: string; href: string };

export type JournalSection = {
  heading: string;
  // Each string is one paragraph.
  paragraphs: ReadonlyArray<string>;
  // Optional unordered list rendered under the paragraphs.
  bullets?: ReadonlyArray<string>;
};

export type JournalArticle = {
  slug: string;
  title: string; // SEO <title>
  h1: string;
  description: string; // SEO meta description
  category: string;
  datePublished: string; // ISO date
  dateModified?: string;
  readMinutes: number;
  primaryKeyword: string;
  keywords: ReadonlyArray<string>;
  // Short standfirst shown under the H1 and in the index card.
  excerpt: string;
  intro: ReadonlyArray<string>;
  sections: ReadonlyArray<JournalSection>;
  faqs: ReadonlyArray<FaqItem>;
  internalLinks: ReadonlyArray<JournalLink>;
  cta: { heading: string; body: string };
};

export const ARTICLES: ReadonlyArray<JournalArticle> = [
  {
    slug: "world-cup-2026-miami-travel-planning-guide",
    title: "World Cup 2026 in Miami: A Travel Planning Guide for Match Week",
    h1: "World Cup 2026 in Miami: A Travel Planning Guide for Match Week",
    description:
      "How to plan a World Cup 2026 trip to Miami: when the matches are, where to stay, getting to Hard Rock Stadium, flying in, match access, and building the rest of the week.",
    category: "World Cup",
    datePublished: "2026-06-25",
    readMinutes: 8,
    primaryKeyword: "World Cup 2026 Miami travel guide",
    keywords: [
      "World Cup 2026 Miami travel guide",
      "World Cup Miami travel planning",
      "how to plan World Cup 2026 Miami trip",
      "Hard Rock Stadium World Cup transportation",
      "World Cup Miami where to stay",
    ],
    excerpt:
      "Miami is one of the host cities for the 2026 World Cup, and match week is unlike any normal weekend here. This is how to plan the trip so the football is the only thing you have to think about.",
    intro: [
      "Miami is one of the North American host cities for the 2026 World Cup, with matches played at Hard Rock Stadium up in Miami Gardens through the summer. For anyone flying in for a fixture, the football is the easy part. The hard part is everything around it: where to stay, how to get to a stadium that sits well outside the parts of Miami most visitors picture, and how to handle a city that is running at full capacity for weeks.",
      "We plan these weeks for clients constantly, so this guide is built from how it actually works on the ground, not a brochure version. It covers the timing, the stay, the stadium run, flying in, match access, and how to fit the rest of Miami around the games without spending your trip stuck in logistics.",
    ],
    sections: [
      {
        heading: "Know where the matches actually are",
        paragraphs: [
          "Hard Rock Stadium is in Miami Gardens, in the north of Miami-Dade County. It is not in South Beach, not in Brickell, and not in the Design District, which is where most visitors imagine themselves spending the week. Depending on where you stay and what the traffic is doing, the stadium is anywhere from 25 minutes to well over an hour away on a match day.",
          "That single fact drives most of the planning. The neighborhood you sleep in, the way you get to the ground, and how you time your day all flow from the gap between where the city is fun and where the football is played. Plan the stay and the transport together, not separately.",
        ],
      },
      {
        heading: "Where to stay for match week",
        paragraphs: [
          "There is no single right answer, only trade-offs. Miami Beach and South Beach put you on the water and near the nightlife, but they are the furthest from the stadium and the most congested on a match day. Brickell and Downtown sit more central, with a shorter run north and a denser cluster of restaurants. Aventura and the Sunny Isles stretch are the closest to Hard Rock, quieter, and the easy choice if the football is the whole reason you came.",
          "For a group or a family staying several nights, a private residence often makes more sense than a block of hotel rooms. You get the space, a kitchen, and somewhere to regroup between matches. Pulse arranges private residences across these areas through vetted partners, placed to match how far you are willing to sit in a car on game day.",
        ],
        bullets: [
          "South Beach and Miami Beach: best for nightlife and the water, furthest and busiest on match day.",
          "Brickell and Downtown: central, strong dining, a shorter run to the stadium.",
          "Aventura and Sunny Isles: closest to Hard Rock, calmer, best if the football is the priority.",
        ],
      },
      {
        heading: "Getting to Hard Rock Stadium on match day",
        paragraphs: [
          "This is where most trips succeed or fall apart. On a match day the roads around Miami Gardens tighten, parking near the stadium is limited and expensive, and the drive back into the city afterward moves slowly while tens of thousands of people leave at once. Driving yourself and parking a car you care about is rarely worth it.",
          "A private chauffeur is the move almost everyone settles on. You get dropped at the stadium, the driver waits or returns, and you leave when you want without circling for parking or standing in a rideshare line with the whole crowd. For a group, one larger vehicle keeps everyone together on both legs. Sort the drop-off and pickup points when you book, because stadium access changes on event days and a driver who knows the routing saves you the headache.",
        ],
      },
      {
        heading: "Flying in: private or commercial",
        paragraphs: [
          "Miami International and Fort Lauderdale both handle the inbound crowds, and both get heavy during a tournament. If you are arriving for a single fixture on a tight schedule, or moving between host cities as the rounds progress, flying private is worth pricing out. It skips the main terminals, runs on your clock, and lands you closer to a fast transfer.",
          "Pulse coordinates private jet travel through vetted operators, matched to the route, the group size, and the dates. Aircraft and slots are subject to availability and move quickly during a tournament, so if private flying is on the table, it is one of the first things to lock rather than the last.",
        ],
      },
      {
        heading: "Match tickets and access",
        paragraphs: [
          "Pulse is an independent concierge company and is not affiliated with FIFA. We do not sell official tickets and we do not imply access we cannot deliver. What we do is take match access requests and work them through our network on a best-efforts basis, subject to availability, and tell you honestly what is realistic for a given fixture before you build a trip around it.",
          "The practical advice is to settle your match plan first and let the rest of the week follow it. Knowing which fixtures you are committed to, and on which dates, is what lets everything else fall into place without guessing.",
        ],
      },
      {
        heading: "Building the rest of the week around the football",
        paragraphs: [
          "A World Cup trip is rarely only the matches. There are days between fixtures, evenings after the final whistle, and people who came along for the city as much as the football. Miami gives you a lot to work with: a day on the water, dinner at the tables worth sitting at, a night out after a result goes your way, and a car worth driving on the days you are not at the stadium.",
          "These pieces are easier to run as one plan than to chase separately once you have landed. A yacht for an afternoon, restaurant and nightlife reservations for the evenings, an exotic car for a free day, and the chauffeur tying it all together. When one team holds the whole itinerary, the handoffs between each part stop being your problem.",
        ],
      },
      {
        heading: "Book the moving parts early",
        paragraphs: [
          "Match week compresses demand for everything at once. The good residences, the chauffeurs who know the stadium routing, the private aircraft, and the popular cars all book out well ahead, and the closer you get to a fixture the thinner the options become. This is the opposite of a quiet week in Miami, where you can decide on the day.",
          "The clients who have the smoothest tournaments are the ones who lock the fixed points first: where they sleep, how they get to the ground, and how they fly in. The flexible extras can be added later, but the backbone of the week should be settled as soon as your matches are.",
        ],
      },
      {
        heading: "How Pulse handles World Cup week in Miami",
        paragraphs: [
          "Pulse owns part of its exotic fleet directly and arranges chauffeur, jets, yachts, residences, dining, and nightlife through vetted partners, so a full match week can be run as one plan rather than a dozen separate bookings. You tell us your fixtures and your dates, and a specialist maps the stay, the stadium transfers, and anything you want around them.",
          "Everything is quote-only and depends on your dates and live availability, and match access is handled as a request on a best-efforts basis. The earlier in the tournament you ask, the stronger the answer, because the calendar only tightens from here.",
        ],
      },
    ],
    faqs: [
      {
        q: "Where are the World Cup 2026 matches played in Miami?",
        a: "Miami's matches are at Hard Rock Stadium in Miami Gardens, in the north of Miami-Dade County. It is well outside South Beach and Brickell, so depending on where you stay and the traffic, the stadium can be 25 minutes to over an hour away on a match day. Plan your stay and transport around that distance.",
      },
      {
        q: "Where should I stay in Miami for the World Cup?",
        a: "It depends on your priority. South Beach is best for the water and nightlife but furthest from the stadium and busiest on match days. Brickell and Downtown are more central with a shorter run north. Aventura and Sunny Isles are closest to Hard Rock and calmer. For groups and families, a private residence often beats a block of hotel rooms.",
      },
      {
        q: "What is the best way to get to Hard Rock Stadium on match day?",
        a: "A private chauffeur is what most visitors settle on. Stadium-area roads tighten on match days, parking is limited and expensive, and leaving with the crowd is slow. A driver drops you at the stadium and returns on your schedule, with no parking or rideshare line. Confirm drop-off and pickup points when you book, since stadium access changes on event days.",
      },
      {
        q: "Can Pulse get me World Cup match tickets?",
        a: "Pulse is independent and not affiliated with FIFA, and we do not sell official tickets. We take match access requests and work them through our network on a best-efforts basis, subject to availability, and we tell you honestly what is realistic for a given fixture before you build a trip around it.",
      },
      {
        q: "How far in advance should I plan a World Cup trip to Miami?",
        a: "As early as your fixtures are confirmed. Match week compresses demand for residences, chauffeurs, private aircraft, and cars all at once, and options thin out closer to each fixture. Lock the fixed points first, where you stay, how you get to the stadium, and how you fly in, then add the flexible extras later.",
      },
    ],
    internalLinks: [
      { label: "World Cup 26 experiences", href: "/experiences/world-cup" },
      { label: "Private chauffeur service in Miami", href: "/chauffeur" },
      { label: "Private jet coordination", href: "/jets" },
      {
        label: "What international visitors should know about renting an exotic car",
        href: "/journal/international-visitors-renting-exotic-car-miami",
      },
      {
        label: "Renting an exotic car during Miami event weekends",
        href: "/journal/rent-exotic-car-miami-event-weekends",
      },
      { label: "Multi-service luxury experiences", href: "/experiences" },
    ],
    cta: {
      heading: "Plan your match week before the calendar tightens.",
      body: "Tell Pulse your fixtures and dates. A specialist maps the stay, the stadium transfers, and anything you want around the football, and works match access as a request, subject to availability. Quote-only, and a specialist responds within 15 minutes.",
    },
  },
  {
    slug: "international-visitors-renting-exotic-car-miami",
    title: "What International Visitors Should Know Before Renting an Exotic Car in Miami",
    h1: "What International Visitors Should Know Before Renting an Exotic Car in Miami",
    description:
      "What international visitors need before renting an exotic car in Miami: which license works, how insurance is handled, the deposit, the age and document rules, and airport delivery.",
    category: "Guides",
    datePublished: "2026-06-25",
    readMinutes: 7,
    primaryKeyword: "exotic car rental Miami international visitors",
    keywords: [
      "exotic car rental Miami international visitors",
      "rent a luxury car Miami foreign license",
      "international driver Miami supercar rental",
      "Miami exotic car rental requirements tourists",
      "renting a Lamborghini Miami without a US license",
    ],
    excerpt:
      "Renting a supercar in Miami as a visitor from abroad is straightforward once you know the rules. Here is what to have ready on your license, your insurance, the deposit, and delivery.",
    intro: [
      "Miami draws visitors from all over the world, and a large share of them want to drive something they cannot get easily at home. A Lamborghini for the weekend, a Rolls-Royce for the arrival, a convertible for the drive down Collins Avenue. The good news is that renting an exotic car here as an international visitor is normal and common. The rules are just a little different from booking a regular rental at the airport counter.",
      "This guide covers the questions visitors from abroad actually ask before they land: whether their license works, how the insurance side is handled, what the deposit really is, the age and document requirements, and how to get the car delivered so you are not figuring out logistics on your first day in the city.",
    ],
    sections: [
      {
        heading: "Which license you can drive on",
        paragraphs: [
          "If your license is printed in English and valid, you can usually drive in Florida on it as a visitor. Florida does not require an International Driving Permit for short-term visitors, but it does help in two ways: it translates your details into a standard format, and it makes verification faster when the license is in another language or alphabet. If your license is not in English, bring an International Driving Permit alongside it.",
          "The practical point for exotic rentals is verification. The driver named on the rental has to match the license and the payment card. Send a clear photo of your license ahead of time so any questions get sorted before you arrive, not at the curb when the car shows up.",
        ],
      },
      {
        heading: "How insurance works when you are visiting",
        paragraphs: [
          "This is the question that trips up most international visitors, because car insurance works differently in the United States than in many other countries. A personal policy from home usually does not extend to a rental here, and you cannot assume it does. Coverage for the rental itself is arranged at the time of booking, and the specifics depend on the car and the terms of that particular reservation.",
          "Some visitors also carry coverage through a premium credit card, but card benefits frequently exclude exotic and high-value vehicles, so do not count on that without checking the fine print first. The cleaner approach is to confirm exactly how the car is covered when you book, ask what your responsibility is in the event of damage, and get that in writing on your reservation summary. A serious operator will walk you through it rather than leave it vague.",
        ],
      },
      {
        heading: "The deposit, and why it is held",
        paragraphs: [
          "Every exotic rental carries a refundable security deposit held against damage, tolls, and traffic fines. It is not a charge, it is a hold, and it is released after the car comes back clean and the tolls clear. The amount scales with the value of the car, so a Huracán sits higher than an entry-level sports car, and the figure is confirmed on your reservation summary before you commit.",
          "For international visitors, two things matter here. The hold needs to fit within your card limit, and it is placed on a card in the renter's name. Tell your bank you are traveling so the hold does not get flagged as fraud and declined, which is a common and avoidable hiccup. If the deposit amount is unclear at any point, ask for the exact number before you sign.",
        ],
      },
      {
        heading: "Age, documents, and what to have ready",
        paragraphs: [
          "Exotic rentals carry a higher minimum age than standard cars, typically 25 or older, because of the value and performance of the vehicles. Have your documents ready as a small packet so the handoff takes minutes rather than a back-and-forth.",
          "Sorting this before you land is the difference between driving the same day and losing an afternoon. Send everything ahead of time and the car can be waiting when you arrive.",
        ],
        bullets: [
          "A valid driver's license, plus an International Driving Permit if your license is not in English.",
          "A passport for identity verification.",
          "A credit card in the driver's name that can hold the security deposit.",
          "Confirmation of how the car is insured for your reservation.",
        ],
      },
      {
        heading: "Delivery to the airport or your hotel",
        paragraphs: [
          "You do not need to find a rental office. The standard way exotic cars are handled in Miami is delivery: the car is brought to Miami International or the private terminal, your hotel, or the residence where you are staying, fueled and ready, and collected the same way at the end of your trip.",
          "For someone arriving from a long flight, this is the part that makes the difference. You clear customs, the car is there, and you drive. Confirm the delivery point and the time window when you book so it lines up with your landing, and give a realistic arrival time so nobody is waiting on either side.",
        ],
      },
      {
        heading: "Driving in Miami as a visitor",
        paragraphs: [
          "A few local details are worth knowing before you take the keys. Miami uses electronic tolls on several expressways with no cash booths, so tolls are handled through the car's transponder and settled against your deposit afterward. You will not be stopping to pay anything, but the charges are real and they add up on a busy weekend.",
          "Beyond that, plan for the city itself. Valet is everywhere and reliable at the hotels and restaurants you will want, which is the easiest way to park a six-figure car. Traffic on Miami Beach and around Brickell is heavy at peak hours, and parking a supercar on the street is not worth the risk. Use valet, use delivery, and keep the car doing what it is good at.",
        ],
      },
      {
        heading: "Planning around an event or the World Cup",
        paragraphs: [
          "If you are visiting for a specific event, the timing changes. During the Grand Prix in May, World Cup match weeks at Hard Rock Stadium through the summer of 2026, and Art Basel in December, the city fills and the best cars book out well ahead. International visitors arriving for those weekends should reserve earlier, because you are competing with everyone else who flew in for the same dates.",
          "Event weeks also tend to be when visitors want more than the car. A chauffeur for match day, a jet between host cities, a table after the final whistle. Those are easier to arrange as one plan than to chase separately once you are on the ground, especially when you are new to the city.",
        ],
      },
      {
        heading: "How Pulse handles international clients",
        paragraphs: [
          "Pulse owns part of its exotic fleet directly and arranges additional vehicles and services through vetted partners, so we handle visitors from abroad regularly and know which questions to answer before you land. You send your license and dates, a specialist confirms what works, explains the deposit and how the car is covered, and delivers it to the airport or your hotel so there is nothing to sort out when you arrive.",
          "If you want the rest of the trip handled, the same team can add a chauffeur, a jet, a yacht, a residence, or dinner reservations around the car. Everything is quote-only and depends on your dates and live availability, and a specialist responds quickly so you can plan with a real answer.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can I rent an exotic car in Miami with a foreign driver's license?",
        a: "Yes. If your license is valid and printed in English, you can generally drive in Florida as a visitor on it. If it is in another language, bring an International Driving Permit alongside it. The driver named on the rental has to match the license and the payment card, so send a clear photo ahead of time to speed up verification.",
      },
      {
        q: "Do I need an International Driving Permit to rent a supercar in Miami?",
        a: "Florida does not require an International Driving Permit for short-term visitors with a valid license. It is recommended if your license is not in English, because it puts your details in a standard format and makes verification faster. Carry it together with your original license, not instead of it.",
      },
      {
        q: "How does insurance work for international visitors renting a luxury car?",
        a: "Car insurance works differently in the US, and a personal policy from home usually does not extend to a rental here. Credit card coverage often excludes exotic vehicles. Coverage for the car is arranged at booking and depends on the vehicle and terms, so confirm exactly how it is handled and what your responsibility is, in writing, before you sign.",
      },
      {
        q: "What deposit do I need to rent an exotic car as a tourist in Miami?",
        a: "Exotic rentals carry a refundable security deposit held against damage, tolls, and fines, not a charge. The amount scales with the value of the car and is confirmed on your reservation summary. It is held on a card in the renter's name, so make sure it fits your limit and tell your bank you are traveling so the hold is not declined.",
      },
      {
        q: "Can the car be delivered to Miami airport when I land?",
        a: "Yes. Delivery is the standard way exotic cars are handled in Miami. Pulse brings the car to Miami International or the private terminal, your hotel, or your residence, fueled and ready, and collects it the same way at the end. Confirm the delivery point and time window when you book and give a realistic arrival time.",
      },
    ],
    internalLinks: [
      { label: "Browse the Pulse exotic fleet", href: "/fleet" },
      {
        label: "Renting an exotic car during Miami event weekends",
        href: "/journal/rent-exotic-car-miami-event-weekends",
      },
      { label: "Private chauffeur service in Miami", href: "/chauffeur" },
      { label: "World Cup 26 experiences", href: "/experiences/world-cup" },
      { label: "Pulse concierge", href: "/concierge" },
    ],
    cta: {
      heading: "Send your dates before you fly.",
      body: "Tell Pulse when you land and the car you want. A specialist confirms what works, explains the deposit and how the car is covered, and delivers it to the airport or your hotel. Quote-only, and a specialist responds within 15 minutes.",
    },
  },
  {
    slug: "rent-exotic-car-miami-event-weekends",
    title: "How to Rent an Exotic Car in Miami During Major Event Weekends",
    h1: "How to Rent an Exotic Car in Miami During Major Event Weekends",
    description:
      "A practical guide to renting an exotic car in Miami during F1, Art Basel, and World Cup week: when to book, what gets taken first, deposits, delivery, and driving the city when it's full.",
    category: "Guides",
    datePublished: "2026-06-24",
    readMinutes: 7,
    primaryKeyword: "exotic car rental Miami event weekends",
    keywords: [
      "exotic car rental Miami event weekends",
      "rent a supercar Miami F1",
      "Art Basel exotic car rental Miami",
      "World Cup Miami car rental",
      "luxury car rental Miami event week",
    ],
    excerpt:
      "Event weekends are the hardest time to get the car you actually want in Miami. Here is how the timing, the deposits, and the logistics really work, and how to avoid the cars that are left over.",
    intro: [
      "Miami runs on event weekends. The Grand Prix in early May, World Cup matches at Hard Rock Stadium through the summer of 2026, Art Basel and Miami Art Week in early December, plus a steady run of fights, concerts, and boat shows in between. On those weekends the city fills, the calendar tightens, and the best exotic cars go first.",
      "Renting a supercar in Miami on a quiet Tuesday is simple. Renting one the same weekend a hundred thousand visitors land is a different job. This guide covers what actually changes during a major event, when to book, and how to end up with the car you want instead of whatever is left.",
    ],
    sections: [
      {
        heading: "Why event weekends change the rules",
        paragraphs: [
          "During a normal week, most reputable fleets in Miami have cars sitting idle. You can call on Thursday and drive a Lamborghini on Friday. Event weekends remove that slack. Demand spikes, the popular models book out, and rates move up with the season because everyone is chasing the same short window.",
          "The cars people fight over are predictable: the loud, photogenic ones. Lamborghini Huracán and Urus, Ferrari, McLaren, the Rolls-Royce and Bentley for arrivals. Those are the first to go. The deeper into an event weekend you book, the more you are choosing from what nobody else wanted.",
        ],
      },
      {
        heading: "Book earlier than you think",
        paragraphs: [
          "The single biggest mistake is treating an event-weekend rental like a normal one. For a marquee weekend, two to four weeks out is the right window. That is enough time to lock the exact model, color, and dates before they are gone, and to sort the deposit and driver verification without a rush.",
          "If you are inside a week, you can still get a car, but you are negotiating with the leftovers. Reserve the vehicle first and confirm the surrounding details after. Holding the car is what matters; everything else can be finalized once it is yours.",
        ],
      },
      {
        heading: "What gets booked first, and what is left if you wait",
        paragraphs: [
          "Think of it in tiers. The headline supercars and the chauffeur-friendly luxury sedans go first because they cover both jobs people want during an event: be seen, and arrive clean. Mid-tier sports cars hold availability a little longer. By the final days before a big weekend, you are usually left with higher mileage, less popular trims, or nothing at all in the category you wanted.",
          "If a specific car matters to you, name it early. If the experience matters more than the badge, stay flexible on model and you will have more room even close to the date.",
        ],
        bullets: [
          "Goes first: Lamborghini Huracán and Urus, Ferrari, McLaren, Rolls-Royce, Bentley.",
          "Holds longer: mid-tier sports cars, convertibles outside peak color choices.",
          "Last to go: higher-mileage units and less requested trims.",
        ],
      },
      {
        heading: "Delivery usually beats pickup during event traffic",
        paragraphs: [
          "Event weekends turn Miami traffic into a problem. Road closures around the autodrome during the Grand Prix, stadium routing during World Cup matches, and convention and beach congestion during Art Basel all make a trip to a rental counter a waste of your day.",
          "Delivery solves it. A good operator brings the car to your hotel, residence, or the airport corridor, fueled and ready, and collects it the same way at the end. You skip the counter, the parking, and the detour. When you book, confirm the delivery window and the exact handoff point so it lines up with your arrival.",
        ],
      },
      {
        heading: "Know the deposit, the deductible, and the mileage before you sign",
        paragraphs: [
          "Exotic rentals carry a refundable security deposit held against damage and tolls. The amount scales with the value of the car and is confirmed when you get your reservation summary, so there are no surprises at handoff. Expect to show a valid license, proof of insurance, and a matching payment card.",
          "Two numbers decide whether a rate is actually good: the daily mileage allowance and the cost per mile over it. Event weekends mean a lot of short hops across the city, and those miles add up faster than people expect. Ask for the included mileage and the overage rate up front, and ask how fuel and tolls are handled on return.",
        ],
      },
      {
        heading: "Driving the city when it is full",
        paragraphs: [
          "A supercar is the wrong tool for some parts of an event weekend. Stadium and circuit areas have heavy security, limited parking, and tow risk. For the match itself or a packed Art Basel evening, parking a six-figure car on the street is not worth it.",
          "The move most experienced visitors make is to split the weekend. Keep the exotic for the daytime drives, the photos, and the dinners where valet is reliable, and hand the harder logistics to a driver. That keeps the car doing what it is good at without turning your night into a parking problem.",
        ],
      },
      {
        heading: "When a chauffeur makes more sense than the keys",
        paragraphs: [
          "If your weekend is built around a single event with a fixed start time, a chauffeur is often the smarter booking for those hours. No parking, no DUI risk after dinner, no circling a closed stadium. You arrive at the door and leave when you want.",
          "Plenty of Pulse clients run both: an exotic car for the part of the weekend that is about the drive, and a chauffeur for match day or the late nights. The two are easy to combine when one team is handling the whole itinerary.",
        ],
      },
      {
        heading: "How Pulse handles event-weekend rentals",
        paragraphs: [
          "Pulse owns part of its exotic fleet directly and arranges additional vehicles and services through vetted partners, so availability during a busy weekend is handled across our network rather than a single lot. You tell us the dates and the car, and a specialist confirms what is realistic, delivers it where you are staying, and adds a chauffeur, jet, yacht, residence, or dinner reservations around it if you want the rest of the weekend handled too.",
          "Everything is quote-only and depends on the dates, the car, and live availability. The earlier you ask during an event window, the stronger the answer.",
        ],
      },
    ],
    faqs: [
      {
        q: "How far in advance should I rent an exotic car in Miami for an event weekend?",
        a: "For a marquee weekend like the Grand Prix, World Cup matches, or Art Basel, two to four weeks out is ideal. That window lets you lock the exact model and dates before they sell out. Inside a week you can still get a car, but you are choosing from what is left.",
      },
      {
        q: "Which exotic cars book out first during Miami event weekends?",
        a: "The headline supercars and luxury arrivals go first: Lamborghini Huracán and Urus, Ferrari, McLaren, Rolls-Royce, and Bentley. Mid-tier sports cars hold availability longer. If a specific car matters, reserve it early.",
      },
      {
        q: "Can the car be delivered to my hotel during an event weekend?",
        a: "Yes. Delivery is the better option during event traffic. Pulse delivers across Miami, Miami Beach, Brickell, and the airport corridor, fueled and ready, and collects the car the same way. Confirm the delivery window and handoff point when you book.",
      },
      {
        q: "What deposit and documents do I need to rent a supercar in Miami?",
        a: "Expect a refundable security deposit that scales with the value of the car, confirmed on your reservation summary. You will need a valid license, proof of insurance, and a matching payment card. Drivers are typically 25 or older.",
      },
      {
        q: "Is it better to rent an exotic car or hire a chauffeur for a major event?",
        a: "It depends on the day. A chauffeur is usually smarter for the event itself, with no parking, no closed-stadium routing, and no late-night driving. An exotic car is best for daytime drives, photos, and dinners. Many clients book both and combine them.",
      },
    ],
    internalLinks: [
      { label: "Browse the Pulse exotic fleet", href: "/fleet" },
      { label: "Private chauffeur service in Miami", href: "/chauffeur" },
      { label: "World Cup 26 experiences", href: "/experiences/world-cup" },
      { label: "Multi-service luxury experiences", href: "/experiences" },
      { label: "Pulse concierge", href: "/concierge" },
    ],
    cta: {
      heading: "Lock your car before the weekend fills.",
      body: "Tell Pulse the dates and the car you want. A specialist confirms availability, delivers it where you are staying, and handles the rest of the weekend if you want it. Quote-only, and a specialist responds within 15 minutes.",
    },
  },
];

export function getArticle(slug: string): JournalArticle | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

// Newest first for the index.
export const ARTICLES_BY_DATE: ReadonlyArray<JournalArticle> = [...ARTICLES].sort(
  (a, b) => +new Date(b.datePublished) - +new Date(a.datePublished),
);
