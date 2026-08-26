import { FirstAidTopic } from '../types';

export const FIRST_AID_TOPICS: FirstAidTopic[] = [
  {
    id: 'choking',
    title: 'Choking (Airway Obstruction)',
    category: 'Respiratory',
    iconName: 'Wind',
    summary: 'Rapid response for conscious child or adult whose airway is blocked by food or small objects.',
    emergency: true,
    color: 'amber',
    quickAction: 'Give 5 back blows between shoulder blades followed by 5 abdominal thrusts (Heimlich maneuver).',
    steps: [
      'Assess ability to cough or speak: If the person is coughing vigorously, encourage them to keep coughing without interfering.',
      'If coughing is ineffective or silent: Stand slightly behind to one side. Support their chest with one hand and lean them forward.',
      'Give 5 sharp back blows: Use the heel of your hand between the shoulder blades.',
      'Check mouth quickly: Remove any obvious loose obstruction with fingers (do not do blind finger sweeps).',
      'Give 5 abdominal thrusts: Stand behind, wrap arms around waist, place a fist just above the navel, grasp fist with other hand and pull sharply inward and upward.',
      'Alternate cycles: Repeat 5 back blows and 5 abdominal thrusts until the blockage clears or medical assistance arrives.'
    ],
    doNots: [
      'Do NOT perform blind finger sweeps in the throat — you may push the object deeper.',
      'Do NOT give water or liquids to a choking victim.',
      'Do NOT slap the back if the person is standing fully upright (always lean them forward so the object comes out).'
    ],
    warning: 'If the person becomes unresponsive or stops breathing, immediately lower them gently to the floor, call emergency services (911 / 112), and begin CPR chest compressions.',
    whenToCallAmbulance: [
      'Person cannot breathe, speak, or make sound',
      'Skin, lips, or fingernails turn blue or pale grey',
      'Person loses consciousness or collapses',
      'Child or infant under 1 year old experiencing airway obstruction'
    ]
  },
  {
    id: 'cpr',
    title: 'CPR (Cardiopulmonary Resuscitation)',
    category: 'Cardiac',
    iconName: 'HeartPulse',
    summary: 'Life-saving technique when heartbeat or breathing has stopped completely.',
    emergency: true,
    color: 'rose',
    quickAction: 'Push hard and fast in the center of the chest at 100–120 beats per minute (to the beat of "Stayin Alive").',
    steps: [
      'Check scene safety and responsiveness: Tap shoulders firmly and ask loudly "Are you okay?".',
      'Call for emergency medical help immediately: Put phone on speaker and get an AED if available.',
      'Check breathing: Look, listen, and feel for normal breathing for no more than 10 seconds. (Gasping is NOT normal breathing).',
      'Hand position: Place the heel of one hand in the center of the chest (lower half of sternum), interlock the fingers of your second hand on top.',
      'Deliver hard & fast compressions: Push straight down at least 2 inches (5 cm) deep, at a rate of 100 to 120 compressions per minute.',
      'Allow full chest recoil: Let the chest return completely between every compression.',
      'Give rescue breaths (if trained): After 30 compressions, tilt head, lift chin, pinch nose, and deliver 2 gentle breaths (1 second each). If untrained, continue Hands-Only CPR continuously.'
    ],
    doNots: [
      'Do NOT delay compressions to check for faint pulses if you are not a healthcare provider.',
      'Do NOT lean continuously on the patient\'s chest between pushes.',
      'Do NOT interrupt compressions for more than 10 seconds.'
    ],
    warning: 'Do not stop CPR until emergency medical professionals arrive and take over, the person starts breathing normally, or an automated external defibrillator (AED) instructs you to pause.',
    whenToCallAmbulance: [
      'Person is unresponsive and not breathing normally',
      'Sudden collapse or cardiac arrest',
      'Drowning, electrocution, or major trauma'
    ]
  },
  {
    id: 'burns',
    title: 'Burns & Scalds',
    category: 'Trauma & Bleeding',
    iconName: 'Flame',
    summary: 'First-aid care for thermal, hot liquid, steam, electrical, or chemical skin burns.',
    emergency: false,
    color: 'orange',
    quickAction: 'Cool the burn with cool running tap water for at least 10–20 minutes immediately.',
    steps: [
      'Remove heat source immediately: Ensure safety before approaching.',
      'Cool the burned area: Hold under cool (not icy) running tap water for 10 to 20 minutes. Cooling stops the burning process within deep tissue.',
      'Carefully remove constricting items: Take off tight clothing, rings, watches, or bracelets before swelling develops.',
      'Cover cleanly: Loosely apply a sterile non-stick bandage or clean transparent plastic cling wrap over the burn.',
      'Keep warm: Protect the patient from hypothermia, especially when cooling large burn surfaces on young children.',
      'Pain relief: Over-the-counter paracetamol/ibuprofen can be given per age dosage if needed.'
    ],
    doNots: [
      'Do NOT apply ice, ice water, butter, toothpaste, oil, or home ointments to a fresh burn.',
      'Do NOT pop, prick, or drain blisters.',
      'Do NOT peel off clothing that is stuck tightly to melted skin.'
    ],
    warning: 'Chemical burns require continuous flushing with copious running water for at least 20 minutes. Electrical burns often cause internal injury and need urgent hospital evaluation.',
    whenToCallAmbulance: [
      'Burn covers an area larger than the patient\'s palm',
      'Burns on face, hands, feet, joints, groin, or major airway',
      'Deep burn where skin appears charred white, brown, or leathery',
      'Burn caused by high-voltage electricity or caustic industrial chemicals'
    ]
  },
  {
    id: 'bleeding',
    title: 'Severe Cuts & Heavy Bleeding',
    category: 'Trauma & Bleeding',
    iconName: 'Droplets',
    summary: 'Direct pressure and wound stabilization for deep lacerations and arterial bleeding.',
    emergency: true,
    color: 'red',
    quickAction: 'Apply firm, continuous direct pressure with a clean cloth or sterile gauze over the wound.',
    steps: [
      'Protect yourself: Put on clean medical gloves or use a plastic barrier if available.',
      'Apply direct pressure: Place a clean dressing or cloth directly over the bleeding site and press firmly with both hands.',
      'Maintain pressure without lifting: Hold constant pressure for at least 5–10 minutes to allow clotting.',
      'Elevate if possible: Keep the injured limb elevated above heart level if no bone fracture is suspected.',
      'Bandage securely: Wrap a roller bandage firmly over the dressing to maintain pressure.',
      'If blood soaks through: Do NOT remove the original cloth; place additional absorbent pads directly over the top and press harder.'
    ],
    doNots: [
      'Do NOT remove deeply embedded objects (like glass or knives) — stabilize around the object with ring pads.',
      'Do NOT repeatedly lift the cloth to peek, as this tears away newly forming clots.',
      'Do NOT wash a severely bleeding deep wound before bleeding is controlled.'
    ],
    warning: 'Pulsing, spurting bright red blood indicates an arterial laceration. This is a life-threatening emergency requiring maximum direct pressure and immediate ambulance dispatch.',
    whenToCallAmbulance: [
      'Blood is spurting rhythmically from the wound',
      'Bleeding does not stop after 10 minutes of direct firm pressure',
      'Large deep gaping wound showing yellow fat, muscle, or bone',
      'Patient feels dizzy, confused, cold, or faints (signs of hemorrhagic shock)'
    ]
  },
  {
    id: 'snake-bite',
    title: 'Snake & Venomous Insect Bites',
    category: 'Bites & Stings',
    iconName: 'ShieldAlert',
    summary: 'Emergency immobilization and transport protocol for suspected venomous bites.',
    emergency: true,
    color: 'emerald',
    quickAction: 'Keep victim calm and completely still. Immobilize the bitten limb below heart level and rush to hospital.',
    steps: [
      'Move safely away from the snake: Do not attempt to catch or kill it.',
      'Reassure victim and keep them completely still: Movement speeds venom spread through lymph channels.',
      'Immobilize the limb: Apply a broad pressure bandage (if trained for neurotoxic/elapid species) or splint the limb to restrict all joint movement.',
      'Remove jewelry & tight items: Rings, shoes, and tight clothing must come off before severe swelling.',
      'Position limb: Keep the bitten body part level with or slightly below the heart.',
      'Transport promptly to nearest emergency hospital with antivenom capability.'
    ],
    doNots: [
      'Do NOT cut the wound, use suction devices, or try to suck venom out with your mouth.',
      'Do NOT apply a tight arterial tourniquet (which cuts off all blood flow and causes limb loss).',
      'Do NOT apply ice, herbal pastes, electrical shocks, or chemicals to the bite site.'
    ],
    warning: 'Note the snake\'s physical color and head shape from a safe distance or take a quick photo if safe. Never bring a live snake to the hospital.',
    whenToCallAmbulance: [
      'All suspected venomous snake bites',
      'Rapid swelling, severe pain, or dark discoloration around bite',
      'Difficulty breathing, slurred speech, drooping eyelids, or muscle paralysis',
      'Spontaneous bleeding from gums or needle marks'
    ]
  },
  {
    id: 'heat-stroke',
    title: 'Heat Exhaustion & Heat Stroke',
    category: 'Environmental',
    iconName: 'Sun',
    summary: 'Recognizing dangerous hyperthermia in hot conditions and active rapid cooling procedures.',
    emergency: true,
    color: 'amber',
    quickAction: 'Move to shade or air-conditioned room. Cool body with wet towels, fanning, and cold water.',
    steps: [
      'Recognize symptoms: Heat exhaustion causes heavy sweating, pale cold clammy skin, nausea, headache. Heat stroke causes hot dry skin (or profuse sweat), body temp > 40°C (104°F), confusion, and loss of consciousness.',
      'Move to cooler environment: Place patient in air-conditioned room or cool shade.',
      'Active cooling: Strip heavy clothes. Sponge or spray skin with cool water and fan vigorously. Place cold wet packs in armpits, groin, and neck.',
      'Hydration (ONLY if conscious): Sip small amounts of cool water or oral rehydration solution (ORS) if alert and not vomiting.',
      'Lie down and elevate legs slightly: Helps maintain blood flow to the brain.',
      'Monitor temperature until it drops below 38.3°C (101°F).'
    ],
    doNots: [
      'Do NOT give fluids to an unconscious, confused, or vomiting person.',
      'Do NOT give aspirin or paracetamol for environmental heat stroke (they do not lower environmental hyperthermia and stress liver/kidneys).'
    ],
    warning: 'Heat stroke is a medical emergency that can lead to permanent brain damage or organ failure within minutes without rapid cooling.',
    whenToCallAmbulance: [
      'Body temperature is over 39.5°C (103°F)',
      'Patient is delirious, confused, slurring words, or having seizures',
      'Patient loses consciousness or does not improve after 20 minutes of cooling'
    ]
  },
  {
    id: 'sprains',
    title: 'Sprains, Strains & Fractures',
    category: 'Trauma & Bleeding',
    iconName: 'Activity',
    summary: 'R.I.C.E. protocol for soft tissue injuries and limb stabilization for suspected broken bones.',
    emergency: false,
    color: 'blue',
    quickAction: 'Remember R.I.C.E.: Rest, Ice (15–20 min), Compress gently, Elevate above heart level.',
    steps: [
      'Rest: Stop activity immediately and protect the injured joint or limb.',
      'Ice: Apply a cloth-wrapped cold pack or ice bag for 15–20 minutes every 2–3 hours. Never put ice directly on bare skin.',
      'Compress: Wrap an elastic bandage around the injury with moderate tension. Ensure fingers/toes remain warm with pink capillary refill.',
      'Elevate: Prop the injured ankle/wrist higher than heart level to reduce swelling.',
      'If fracture suspected: Support limb in the position found using pillows, rolled towels, or a rigid splint. Do NOT try to straighten crooked bones.'
    ],
    doNots: [
      'Do NOT apply heat pads or hot baths during the first 48 hours (heat increases swelling).',
      'Do NOT massage vigorously over acutely injured swollen ligaments.',
      'Do NOT force the patient to walk on a limb that cannot bear weight.'
    ],
    warning: 'An open (compound) fracture where bone pierces through the skin is an emergency. Cover with sterile moist dressing and do not push bone back.',
    whenToCallAmbulance: [
      'Bone has penetrated through the skin or is visibly deformed',
      'Severe numbness, tingling, or cold, blue fingers/toes beyond the injury',
      'Extreme uncontrolled pain or inability to move joint at all'
    ]
  },
  {
    id: 'seizures',
    title: 'Febrile Seizures & Convulsions',
    category: 'Neurological',
    iconName: 'Zap',
    summary: 'Safe positioning and care for infants and young children experiencing fever convulsions.',
    emergency: true,
    color: 'purple',
    quickAction: 'Lay on side in recovery position on floor, clear dangerous objects, time the seizure. Do NOT put anything in mouth.',
    steps: [
      'Stay calm: Most febrile seizures last less than 2 to 3 minutes and resolve spontaneously.',
      'Protect from trauma: Place child on the floor on a soft blanket or rug away from hard furniture, sharp edges, and stairs.',
      'Turn into recovery position: Gently roll child onto their side to keep airway clear and prevent saliva aspiration.',
      'Loosen tight clothing: Unbutton collar and remove extra layers to assist cooling.',
      'Time the duration: Look at clock and note exactly how many minutes the seizure lasts.',
      'Stay beside the child: Reassure calmly as they wake up in a drowsy post-ictal state.'
    ],
    doNots: [
      'Do NOT place any fingers, spoons, or objects in the mouth (they will NOT swallow their tongue).',
      'Do NOT forcibly restrain shaking limbs.',
      'Do NOT give liquids or fever medication while the child is shaking or drowsy.'
    ],
    warning: 'If a seizure lasts longer than 5 continuous minutes, or if the child has multiple seizures back-to-back without regaining full consciousness, call emergency services immediately.',
    whenToCallAmbulance: [
      'Seizure lasts longer than 5 minutes',
      'Child has difficulty breathing or remains blue after shaking stops',
      'First-time seizure in a child or seizure following head injury',
      'Child has a stiff neck, persistent vomiting, or extreme lethargy'
    ]
  },
  {
    id: 'anaphylaxis',
    title: 'Severe Allergic Reaction (Anaphylaxis)',
    category: 'Respiratory',
    iconName: 'AlertCircle',
    summary: 'Rapid intervention for life-threatening allergy triggered by peanuts, stings, medications, or seafood.',
    emergency: true,
    color: 'rose',
    quickAction: 'Administer Epinephrine auto-injector (EpiPen) into outer mid-thigh immediately and call emergency 911/112.',
    steps: [
      'Identify signs: Swollen lips/tongue, difficulty breathing or wheezing, widespread hives, throat tightness, dizziness.',
      'Inject Epinephrine: Remove safety cap. Push auto-injector tip firmly into the outer mid-thigh until it clicks. Hold firmly for 3 seconds.',
      'Call emergency services immediately: State "Anaphylaxis, epinephrine administered".',
      'Position patient: Lay flat with legs elevated. If breathing is difficult, allow sitting upright. Do NOT make them stand or walk.',
      'Monitor and prepare second dose: If no improvement after 5–10 minutes and ambulance has not arrived, a second dose may be given in opposite thigh.'
    ],
    doNots: [
      'Do NOT delay epinephrine administration — antihistamines (like cetirizine/diphenhydramine) work too slowly to reverse life-threatening airway collapse.',
      'Do NOT allow the patient to suddenly stand up (can cause fatal blood pressure drop).'
    ],
    warning: 'Every person who receives an epinephrine auto-injector must go to the emergency room for observation because of possible biphasic (rebound) reactions.',
    whenToCallAmbulance: [
      'Any suspected anaphylaxis reaction',
      'Swelling of throat, mouth, or tongue causing stridor or wheeze',
      'Feeling dizzy, lightheaded, or fainting after allergen contact'
    ]
  },
  {
    id: 'poisoning',
    title: 'Poisoning & Accidental Ingestion',
    category: 'Environmental',
    iconName: 'Skull',
    summary: 'Immediate guidance for swallowed household chemicals, detergents, plants, or overdoses.',
    emergency: true,
    color: 'amber',
    quickAction: 'Call Poison Control / Emergency helpline immediately with the substance bottle in hand.',
    steps: [
      'Check responsiveness and airway: If unresponsive or not breathing, begin CPR immediately.',
      'Identify the substance: Safely collect container, chemical label, pill bottle, or plant sample to tell medical staff.',
      'Rinse mouth gently: If chemical is on lips or skin, flush with clean water.',
      'Call Poison Center / Emergency: Report victim’s age, weight, estimated amount swallowed, and time of ingestion.',
      'Follow poison specialist instructions carefully until emergency paramedics arrive.'
    ],
    doNots: [
      'Do NOT induce vomiting unless explicitly told to do so by a poison control specialist (vomiting corrosive chemicals burns esophagus twice).',
      'Do NOT give raw milk, raw eggs, or salt water as home antidotes.',
      'Do NOT give activated charcoal without medical authorization.'
    ],
    warning: 'Keep the original product container to show emergency responders and doctors in the hospital.',
    whenToCallAmbulance: [
      'Patient is drowsy, unresponsive, or having convulsions',
      'Ingested corrosive chemicals (bleach, drain cleaner, battery acid)',
      'Difficulty breathing or burns around mouth and throat'
    ]
  }
];

export const FIRST_AID_DISCLAIMER =
  "This guide is for quick reference only and does not replace professional medical training, diagnosis, or emergency medical services. In any life-threatening situation, call your local emergency services immediately.";
