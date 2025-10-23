// Physics
export const MAX_FORWARD_SPEED = 1.25;
export const MAX_REVERSE_SPEED = 0.18;
export const TURN_RATE = 0.007;
export const ACCELERATION_RATE = 0.18;
export const DECAY_RATE = 0.97;

// Ferry Model
export const SHIP_LENGTH = 70;
export const SHIP_WIDTH = 25;
export const SHIP_HEIGHT = 15;
export const SUPERSTRUCTURE_WIDTH = 10;
export const SUPERSTRUCTURE_HEIGHT = 8;
export const SUPERSTRUCTURE_LENGTH = 25;
export const ANTENNA_RADIUS = 0.5;
export const ANTENNA_HEIGHT = 10;
export const RADAR_RADIUS = 2;
export const RADAR_HEIGHT = 0.2;

// Particles
export const MAX_PARTICLES = 400;
export const PARTICLE_LIFETIME = 1.8;
export const WAKE_MIN_EMIT = 30;
export const WAKE_MAX_EMIT = 120;
export const WAKE_MIN_SPREAD = 3.5;
export const WAKE_MAX_SPREAD = 12.0;
export const BOW_MIN_EMIT = 50;
export const BOW_MAX_EMIT = 100;

// Game
export const SCATTER_RADIUS = 1000;
export const NUM_CHECKPOINTS = 25;

// Questions
export const CATEGORY_ICONS = {
    Navigation: "images/category-buque.png",
    Safety: "images/category-electric.png",
    General: "images/category-ambiente.png",
};

// NEW: 50 placeholder questions
export const QUESTIONS = [
    // Navigation (17)
    { id: 1, q: "What's the right navigation side called?", options: ["Port", "Starboard", "Bow"], correct: 1, category: "Navigation" },
    { id: 2, q: "What is 'Port' on a boat?", options: ["Right side", "Front", "Left side"], correct: 2, category: "Navigation" },
    { id: 3, q: "A red buoy marks which side of the channel when returning from sea?", options: ["Starboard (Right)", "Port (Left)", "Center"], correct: 0, category: "Navigation" },
    { id: 4, q: "A green buoy marks which side of the channel?", options: ["Starboard (Right)", "Port (Left)", "Center"], correct: 1, category: "Navigation" },
    { id: 5, q: "What does 'Bow' refer to?", options: ["Front", "Back", "Left"], correct: 0, category: "Navigation" },
    { id: 6, q: "What does 'Stern' refer to?", options: ["Front", "Back", "Right"], correct: 1, category: "Navigation" },
    { id: 7, q: "What does one short blast from a horn mean?", options: ["Turning Starboard", "Turning Port", "Going Astern"], correct: 0, category: "Navigation" },
    { id: 8, q: "What do two short blasts from a horn mean?", options: ["Turning Starboard", "Turning Port", "Going Astern"], correct: 1, category: "Navigation" },
    { id: 9, q: "What do three short blasts from a horn mean?", options: ["Danger", "Turning Port", "Going Astern"], correct: 2, category: "Navigation" },
    { id: 10, q: "What is the 'stand-on' vessel?", options: ["Must give way", "Must maintain course", "Must stop"], correct: 1, category: "Navigation" },
    { id: 11, q: "What is the 'give-way' vessel?", options: ["Must give way", "Must maintain course", "Must stop"], correct: 0, category: "Navigation" },
    { id: 12, q: "At night, a green light indicates which side?", options: ["Starboard", "Port", "Stern"], correct: 0, category: "Navigation" },
    { id: 13, q: "At night, a red light indicates which side?", options: ["Starboard", "Port", "Stern"], correct: 1, category: "Navigation" },
    { id: 14, q: "What color is a masthead light?", options: ["Red", "Green", "White"], correct: 2, category: "Navigation" },
    { id: 15, q: "What is a 'Fathom'?", options: ["6 feet", "6 meters", "10 feet"], correct: 0, category: "Navigation" },
    { id: 16, q: "What is a 'Knot'?", options: ["Nautical mile per hour", "Statute mile per hour", "Kilometer per hour"], correct: 0, category: "Navigation" },
    { id: 17, q: "What is 'Leeway'?", options: ["Forward speed", "Sideways drift", "Vertical movement"], correct: 1, category: "Navigation" },
    
    // Safety (17)
    { id: 18, q: "What should you check before departure?", options: ["Weather", "Seats only", "Paint"], correct: 0, category: "Safety" },
    { id: 19, q: "Which flag signals 'Man Overboard'?", options: ["Flag O", "Flag A", "Flag C"], correct: 0, category: "Safety" },
    { id: 20, q: "What does PFD stand for?", options: ["Personal Flotation Device", "Port Ferry Duty", "Primary Fire Damper"], correct: 0, category: "Safety" },
    { id: 21, q: "Where should fire extinguishers be stored?", options: ["In a locked box", "Accessible location", "In the engine room only"], correct: 1, category: "Safety" },
    { id: 22, q: "What is a 'bilge pump' used for?", options: ["Removing water", "Pumping fuel", "Inflating life rafts"], correct: 0, category: "Safety" },
    { id: 23, q: "What does 'Mayday' signal?", options: ["Urgency", "Distress", "Safety"], correct: 1, category: "Safety" },
    { id: 24, q: "What does 'Pan-Pan' signal?", options: ["Urgency", "Distress", "Safety"], correct: 0, category: "Safety" },
    { id: 25, q: "What does 'Sécurité' signal?", options: ["Urgency", "Distress", "Safety (e.g., weather)"], correct: 2, category: "Safety" },
    { id: 26, q: "What is the primary cause of boating fatalities?", options: ["Speeding", "Collisions", "Drowning"], correct: 2, category: "Safety" },
    { id: 27, q: "What does a Type B fire extinguisher handle?", options: ["Wood/Paper", "Flammable Liquids", "Electrical"], correct: 1, category: "Safety" },
    { id: 28, q: "What does a Type C fire extinguisher handle?", options: ["Wood/Paper", "Flammable Liquids", "Electrical"], correct: 2, category: "Safety" },
    { id: 29, q: "What is 'Hypothermia'?", options: ["Low body temperature", "Sunstroke", "Dehydration"], correct: 0, category: "Safety" },
    { id: 30, q: "Which of these is a visual distress signal?", options: ["Red Flare", "White Flag", "Loud Music"], correct: 0, category: "Safety" },
    { id: 31, q: "What is a 'VHF' radio used for?", options: ["Music", "Communication", "Radar"], correct: 1, category: "Safety" },
    { id: 32, q: "What is VHF Channel 16?", options: ["Weather", "Distress/Calling", "Ship-to-Ship"], correct: 1, category: "Safety" },
    { id: 33, q: "What is an 'EPIRB'?", options: ["Engine Overheat Sensor", "Distress Beacon", "Navigation Light"], correct: 1, category: "Safety" },
    { id: 34, q: "How many PFDs should be on board?", options: ["One for each person", "Two total", "One for the captain"], correct: 0, category: "Safety" },

    // General (16)
    { id: 35, q: "What is the boat's main body called?", options: ["Mast", "Keel", "Hull"], correct: 2, category: "General" },
    { id: 36, q: "What is a nautical mile?", options: ["1,609 meters", "1,852 meters", "2,000 meters"], correct: 1, category: "General" },
    { id: 37, q: "What is the 'Galley'?", options: ["Kitchen", "Bathroom", "Engine Room"], correct: 0, category: "General" },
    { id: 38, q: "What is the 'Head'?", options: ["Kitchen", "Bathroom", "Captain's chair"], correct: 1, category: "General" },
    { id: 39, q: "What is the 'Keel'?", options: ["Main sail", "Steering wheel", "Boat's 'backbone'"], correct: 2, category: "General" },
    { id: 40, q: "What does 'Aft' mean?", options: ["Toward the front", "Toward the back", "On the left"], correct: 1, category: "General" },
    { id: 41, q: "What is the 'Helm'?", options: ["Steering equipment", "Anchor", "Main sail"], correct: 0, category: "General" },
    { id: 42, q: "What is 'Beam'?", options: ["Vessel's width", "Vessel's length", "Mast height"], correct: 0, category: "General" },
    { id: 43, q: "What is 'Draft'?", options: ["Wind speed", "Depth of water needed", "Fuel capacity"], correct: 1, category: "General" },
    { id: 44, q: "What is a 'Cleat' used for?", options: ["Securing ropes", "Starting engine", "Cooking food"], correct: 0, category: "General" },
    { id: 45, q: "What is a 'Fender'?", options: ["A cushion for the hull", "A type of sail", "A navigation tool"], correct: 0, category:"General" },
    { id: 46, q: "Who is the captain of the ferry?", options: ["Captain Smith", "Captain Jack", "Captain placeholder"], correct: 2, category: "General" },
    { id: 47, q: "What is the 'Rudder'?", options: ["Steering device", "Engine part", "Rope"], correct: 0, category: "General" },
    { id: 48, q: "What is the 'Anchor' used for?", options: ["Mooring", "Steering", "Signaling"], correct: 0, category: "General" },
    { id: 49, q: "What is 'Freeboard'?", options: ["Distance from water to deck", "Onboard Wi-Fi", "Free food"], correct: 0, category: "General" },
    { id: 50, q: "What is a 'Propeller'?", options: ["Steering wheel", "Radio antenna", "Propulsion device"], correct: 2, category: "General" },
];