const bcrypt = require('bcryptjs');
const { db, query } = require('./database');
const { runMigrations } = require('./migrate');

function seedDatabase() {
  console.log('Seeding AccessiAid database...');
  runMigrations();

  // Clear existing data
  db.exec(`
    DELETE FROM feedback;
    DELETE FROM emergency_cards;
    DELETE FROM aac_items;
    DELETE FROM bookmarks;
    DELETE FROM progress;
    DELETE FROM quiz_attempts;
    DELETE FROM quiz_questions;
    DELETE FROM media;
    DELETE FROM content_blocks;
    DELETE FROM categories;
    DELETE FROM users;
  `);

  // 1. Seed Users (Admin & Standard Demo User)
  const salt = bcrypt.genSaltSync(10);
  const adminPasswordHash = bcrypt.hashSync('AdminPass123!', salt);
  const userPasswordHash = bcrypt.hashSync('UserPass123!', salt);

  const insertUser = db.prepare(`
    INSERT INTO users (id, name, email, password_hash, role, preferences_json)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertUser.run(
    'user-admin-01',
    'Accessibility Admin',
    'admin@sahay.org',
    adminPasswordHash,
    'admin',
    JSON.stringify({
      theme: 'light',
      fontSize: 16,
      fontFamily: 'readable',
      reduceMotion: false,
      easyRead: false
    })
  );

  insertUser.run(
    'user-admin-legacy',
    'Accessibility Admin',
    'admin@accessiaid.org',
    adminPasswordHash,
    'admin',
    JSON.stringify({
      theme: 'light',
      fontSize: 16,
      fontFamily: 'readable',
      reduceMotion: false,
      easyRead: false
    })
  );

  insertUser.run(
    'user-demo-01',
    'Aarav Sharma',
    'user@sahay.org',
    userPasswordHash,
    'user',
    JSON.stringify({
      theme: 'light',
      fontSize: 18,
      fontFamily: 'dyslexic',
      reduceMotion: false,
      easyRead: false
    })
  );

  // 2. Seed Categories
  const categories = [
    {
      id: 'cat-visual',
      slug: 'visual-impairment',
      title: 'Visual Impairment',
      icon: 'Eye',
      summary: 'Understanding blindness, low vision, and colour blindness—with optical simulations, screen-reading tools, and inclusive design solutions.',
      color: 'blue',
      display_order: 1
    },
    {
      id: 'cat-hearing',
      slug: 'hearing-impairment',
      title: 'Hearing & Auditory Impairment',
      icon: 'Ear',
      summary: 'Exploring deaf and hard-of-hearing experiences, frequency filters, sign language basics, and live assistive captioning technologies.',
      color: 'amber',
      display_order: 2
    },
    {
      id: 'cat-mobility',
      slug: 'mobility-physical',
      title: 'Mobility & Physical Disability',
      icon: 'Accessibility',
      summary: 'Navigating motor conditions, tremor adaptations, ergonomic switch controls, and wheelchair ergonomics in physical and digital spaces.',
      color: 'emerald',
      display_order: 3
    },
    {
      id: 'cat-speech',
      slug: 'speech-language',
      title: 'Speech & Language Impairment',
      icon: 'MessageSquare',
      summary: 'Supporting non-verbal communication, aphasia, and dysarthria through Augmentative and Alternative Communication (AAC) speech boards.',
      color: 'purple',
      display_order: 4
    },
    {
      id: 'cat-learning',
      slug: 'learning-disabilities',
      title: 'Learning Disabilities & Dyslexia',
      icon: 'BookOpen',
      summary: 'Understanding dyslexia, dysgraphia, and dyscalculia with reading ruler simulators, typography adjustments, and cognitive pacing tools.',
      color: 'indigo',
      display_order: 5
    },
    {
      id: 'cat-adhd',
      slug: 'adhd',
      title: 'ADHD & Executive Functioning',
      icon: 'Zap',
      summary: 'Managing attention, sensory distraction, and cognitive overwhelm with focus-mode layouts, task chunking, and calming timers.',
      color: 'orange',
      display_order: 6
    },
    {
      id: 'cat-autism',
      slug: 'autism-spectrum',
      title: 'Autism Spectrum & Neurodiversity',
      icon: 'Activity',
      summary: 'Sensory sensitivity awareness, respectful communication adaptations, routine predictability, and sensory-friendly digital environments.',
      color: 'teal',
      display_order: 7
    },
    {
      id: 'cat-mental-health',
      slug: 'mental-health',
      title: 'Mental Health & Emotional Well-being',
      icon: 'HeartHandshake',
      summary: 'Sensitive guidance, grounding exercises, supportive technology for anxiety and depression, and emergency mental health helplines.',
      color: 'rose',
      display_order: 8
    }
  ];

  const insertCategory = db.prepare(`
    INSERT INTO categories (id, slug, title, icon, summary, color, display_order)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  for (const cat of categories) {
    insertCategory.run(cat.id, cat.slug, cat.title, cat.icon, cat.summary, cat.color, cat.display_order);
  }

  // 3. Seed 8-Section Content Blocks for Core Categories
  const insertBlock = db.prepare(`
    INSERT INTO content_blocks (id, category_id, type, title, body_markdown, easy_read_body, language, display_order, sources_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Visual Impairment - All 8 Sections
  const visualBlocks = [
    {
      id: 'cb-vis-1',
      category_id: 'cat-visual',
      type: 'overview',
      title: 'What is Visual Impairment?',
      body_markdown: `Visual impairment covers a broad spectrum of sight reduction that cannot be fully corrected with standard glasses or contact lenses. It ranges from mild low vision to complete blindness.
      
### Key Types:
- **Low Vision:** Reduced visual acuity or contrast sensitivity where a person retains some functional sight.
- **Cataracts:** Clouding of the eye's natural lens, creating hazy, faded vision and heightened glare.
- **Glaucoma:** Gradual damage to the optic nerve, frequently resulting in severe peripheral vision loss ("tunnel vision").
- **Macular Degeneration:** Deterioration of the retina's central area, creating a dark or distorted blind spot directly in front of the viewer.
- **Colour Vision Deficiency (CVD):** Difficulty distinguishing between shades (e.g., red-green in Protanopia and Deuteranopia, or blue-yellow in Tritanopia).

### Facts & Epidemiology:
According to the World Health Organization (WHO), at least 2.2 billion people globally have a near or distant vision impairment. In India, under the Rights of Persons with Disabilities (RPwD) Act 2016, both Blindness and Low Vision are legally recognized benchmark disabilities.`,
      easy_read_body: `Visual impairment means someone has trouble seeing clearly, even with glasses. Some people can see shapes and light, some see like looking through a dark tube, and some cannot see at all. Special computer tools and large text help people read and learn.`,
      sources: JSON.stringify([
        { name: 'World Health Organization (WHO) - Blindness and Vision Impairment Fact Sheet', url: 'https://www.who.int/news-room/fact-sheets/detail/blindness-and-visual-impairment' },
        { name: 'Ministry of Social Justice and Empowerment, Government of India - RPwD Act 2016', url: 'https://disabilityaffairs.gov.in/' }
      ]),
      order: 1
    },
    {
      id: 'cb-vis-2',
      category_id: 'cat-visual',
      type: 'challenge',
      title: 'Daily-Life Challenges',
      body_markdown: `People with visual impairments experience distinct hurdles across physical and digital environments:
- **Digital Navigation:** Inaccessible websites with unlabeled buttons, missing image alt-text, or poor color contrast that cannot be parsed by screen readers.
- **Public Mobility:** Navigating unpaved footpaths, missing tactile paving (guiding tiles), and silent electric vehicles without audible signals.
- **Printed Material:** Reading medicine expiry dates, bills, restaurant menus, or instructional manuals without Braille or digital equivalents.
- **Lighting Extremes:** Difficulty adapting to abrupt transitions between dark interiors and harsh sunlight.`,
      easy_read_body: `Reading tiny print on paper or computer screens is hard. Walking on uneven roads without warning signs can be unsafe. Clear audio directions and large buttons make life easier.`,
      sources: JSON.stringify([{ name: 'National Institute for the Visually Handicapped (NIVH), Dehradun', url: 'https://nivh.gov.in' }]),
      order: 2
    },
    {
      id: 'cb-vis-3',
      category_id: 'cat-visual',
      type: 'simulation',
      title: 'Experience It: Interactive Vision Simulator',
      body_markdown: `Use our real-time interactive optical simulation controls below. You can apply Cataract blur, Glaucoma peripheral tunnel masking, Macular central scotoma, and Color-blindness matrices to sample interfaces to understand how visual information is perceived.
      
*Important Note:* Simulations provide an educational approximation to foster empathy and inclusive design awareness; they do not encompass the full perceptual adaptation of living with visual impairment.`,
      easy_read_body: `Try our vision simulator to see how words and pictures look when someone has low vision or color blindness.`,
      sources: JSON.stringify([{ name: 'Web Content Accessibility Guidelines (WCAG) 2.2', url: 'https://www.w3.org/WAI/standards-guidelines/wcag/' }]),
      order: 3
    },
    {
      id: 'cb-vis-4',
      category_id: 'cat-visual',
      type: 'solution',
      title: 'Solutions and Assistive Technologies',
      body_markdown: `Modern assistive hardware and software empower people with visual impairments to independently study, work, and commute:

### 1. Screen Readers & Audio Interfaces
Software such as **NVDA** (NonVisual Desktop Access, free and open-source), **JAWS**, **VoiceOver** (Apple), and **TalkBack** (Android) convert on-screen text and layout structures into synthesized speech or Braille outputs.

### 2. Refreshable Braille Displays
Hardware devices that use piezoelectric pins to dynamically raise and lower Braille cells corresponding to screen text lines.

### 3. Optical Character Recognition (OCR) & AI Glasses
Wearable devices like **Envision Glasses** or **OrCam MyEye** photograph text, recognise faces, and read banknotes directly into a discreet earpiece.

### 4. Accessible Digital Design (WCAG 2.2 AA)
- Minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text.
- Meaningful alternative text descriptions on all informational images.
- Full keyboard accessibility without requiring mouse pointer interaction.

### 5. Smart Canes & Electronic Travel Aids (ETAs)
Devices such as the **IIT Delhi SmartCane™** attach to standard white canes with dual ultrasonic sensors:
- **Blue Front Sensor:** Emits directional 40 kHz pulses to detect obstacles (stones, vehicles, waist-level tree branches) up to 1.5–2 meters away.
- **Purple Ground Sensor:** Angles downward at 45° to detect sudden ground drop-offs, potholes, and staircases before the cane tip even reaches them, providing auditory and haptic warnings.`,
      easy_read_body: `Screen reader apps read what is on the screen out loud. Braille devices allow reading with fingertips. Smart cameras can read books and recognize people.`,
      sources: JSON.stringify([
        { name: 'NV Access - NVDA Screen Reader', url: 'https://www.nvaccess.org/' },
        { name: 'W3C Web Accessibility Initiative (WAI)', url: 'https://www.w3.org/WAI/' }
      ]),
      order: 4
    },
    {
      id: 'cb-vis-5',
      category_id: 'cat-visual',
      type: 'tool',
      title: 'Try It: Built-in Speech & High Contrast Tools',
      body_markdown: `Try the tools integrated right here on AccessiAid:
- **Speech Reader:** Click the "Listen" button at the top of any section to have our browser-powered text-to-speech engine read content aloud with word highlighting.
- **Accessibility Toolbar:** Open the accessibility settings drawer to switch to High Contrast Mode (yellow-on-black) or scale text up to 200% without breaking page layouts.`,
      easy_read_body: `Press the audio button to listen to any text. You can also make letters bigger and change colors.`,
      sources: JSON.stringify([]),
      order: 5
    },
    {
      id: 'cb-vis-6',
      category_id: 'cat-visual',
      type: 'resource',
      title: 'Resources, Rights & Support in India',
      body_markdown: `### Legal Rights under the RPwD Act 2016:
- Mandates 4% reservation in government employment for persons with benchmark disabilities (including 1% specifically for blindness and low vision).
- Mandates accessibility standards in all public buildings, public transport, and digital services (aligned with GIGW - Guidelines for Indian Government Websites).
- Provision of the **UDID (Unique Disability ID) Card** via Swavlamban Card portal for nationwide benefits.

### Support Organisations & Schemes:
- **National Association for the Blind (NAB India):** Comprehensive rehabilitation, vocational training, and Braille library services.
- **Sugamya Pustakalaya:** An online library that provides accessible formats (DAISY, audio, Braille) to persons with print disabilities.
- **ADIP Scheme (Assistance to Disabled Persons for Purchase/Fitting of Aids and Appliances):** Subsidized or free smart canes, Braille kits, and daisy players through ALIMCO.`,
      easy_read_body: `The Indian government provides the UDID card for free travel discounts and assistive devices. The Sugamya Pustakalaya online library offers free audiobooks for people who cannot read standard print.`,
      sources: JSON.stringify([
        { name: 'Swavlamban Portal - Unique Disability ID (UDID)', url: 'https://www.swavlambancard.gov.in/' },
        { name: 'Sugamya Pustakalaya - Digital Accessible Library', url: 'https://sugamyapustakalaya.in/' }
      ]),
      order: 6
    },
    {
      id: 'cb-vis-7',
      category_id: 'cat-visual',
      type: 'myth_fact',
      title: 'Common Myths vs. Realities',
      body_markdown: `### Myth 1: "All blind people live in total, pitch-black darkness."
**Fact:** In reality, approximately 85% of people diagnosed with visual impairment or legal blindness have residual vision—they can perceive light, contrast, shadows, or colors.

### Myth 2: "People with visual impairments have superhuman hearing or sixth senses."
**Fact:** There is no biological magic; individuals simply learn to pay closer cognitive attention to subtle auditory, tactile, and echo cues around them through practice.

### Myth 3: "Braille is obsolete because we have voice assistants."
**Fact:** Braille remains crucial for literacy, spelling, grammar, mathematics, and independent note-taking, complementing audio rather than being replaced by it.`,
      easy_read_body: `Myth: Blind people cannot see anything. Fact: Most people with sight loss can still see light and shapes. Braille is still very important for learning.`,
      sources: JSON.stringify([{ name: 'American Foundation for the Blind - Myths and Facts', url: 'https://www.afb.org' }]),
      order: 7
    }
  ];

  for (const b of visualBlocks) {
    insertBlock.run(b.id, b.category_id, b.type, b.title, b.body_markdown, b.easy_read_body, 'en', b.order, b.sources);
  }

  // Hearing Impairment - Content Blocks
  const hearingBlocks = [
    {
      id: 'cb-hear-1',
      category_id: 'cat-hearing',
      type: 'overview',
      title: 'What is Hearing Impairment?',
      body_markdown: `Hearing impairment refers to the complete or partial inability to hear sounds in one or both ears. It can range in severity from mild, moderate, and severe to profound deafness.

### Clinical Types:
- **Conductive Hearing Loss:** Sound waves are blocked before reaching the inner ear, often due to fluid, ear infections, or perforated eardrums.
- **Sensorineural Hearing Loss:** Damage to the delicate hair cells in the cochlea or the auditory nerve, commonly causing difficulty distinguishing speech frequencies and voices in noisy environments.
- **Mixed Hearing Loss:** A combination of conductive and sensorineural conditions.
- **Tinnitus:** The perception of persistent ringing, buzzing, clicking, or hissing in the ears without an external sound source.

### Global & National Impact:
WHO reports over 1.5 billion people live with some degree of hearing loss worldwide. In India, hearing impairment is categorized under Deaf and Hard of Hearing in the RPwD Act 2016.`,
      easy_read_body: `Hearing loss means having difficulty hearing sounds or understanding people talking. Some people use hearing aids, some use sign language, and captions help everyone watch videos without missing words.`,
      sources: JSON.stringify([
        { name: 'WHO - Deafness and Hearing Loss Fact Sheet', url: 'https://www.who.int/news-room/fact-sheets/detail/deafness-and-hearing-loss' },
        { name: 'Indian Sign Language Research and Training Centre (ISLRTC)', url: 'https://islrtc.nic.in/' }
      ]),
      order: 1
    },
    {
      id: 'cb-hear-2',
      category_id: 'cat-hearing',
      type: 'challenge',
      title: 'Daily-Life Challenges',
      body_markdown: `Key barriers faced by individuals who are deaf or hard-of-hearing:
- **Audio-Only Announcements:** Train stations, airports, and hospitals relying strictly on loudspeaker calls without synchronized visual display screens.
- **Uncaptioned Videos & Streams:** Lectures, web videos, and emergency news broadcasts that lack accurate, synchronized closed captions (CC).
- **Social Fatigue & Cocktail Party Effect:** Straining to read lips in reverberant or dimly lit rooms causes immense cognitive exhaustion.
- **Emergency Situations:** Inability to hear smoke alarms, doorbells, or automobile horns without vibrating or flashing strobe alerts.`,
      easy_read_body: `Missing spoken announcements in stations or videos without captions is frustrating. Talking in loud places makes understanding words very tiring.`,
      sources: JSON.stringify([{ name: 'Ali Yavar Jung National Institute of Speech and Hearing Disabilities (AYJNISHD)', url: 'http://ayjnihh.nic.in/' }]),
      order: 2
    },
    {
      id: 'cb-hear-3',
      category_id: 'cat-hearing',
      type: 'simulation',
      title: 'Experience It: Frequency Attenuation & Tinnitus Filter',
      body_markdown: `Hear through our Web Audio API simulation below. You can dial down higher acoustic frequencies (low-pass attenuation) to experience how vowels remain loud while consonants (s, f, th, k) become unintelligible, and activate a calibrated high-pitched tinnitus frequency tone.
      
*Content Warning:* Start at low device volume. An instant "Stop Audio" button is provided.`,
      easy_read_body: `Listen to how sounds become muffled with hearing loss and how closed captions help you follow conversations clearly.`,
      sources: JSON.stringify([]),
      order: 3
    },
    {
      id: 'cb-hear-4',
      category_id: 'cat-hearing',
      type: 'solution',
      title: 'Solutions and Assistive Technologies',
      body_markdown: `Technological advances provide remarkable auditory and visual accommodations:

### 1. Digital Hearing Aids & Cochlear Implants
Modern hearing aids feature directional microphones, AI-driven background noise cancellation, and Bluetooth streaming directly to smartphones. Cochlear implants directly stimulate the auditory nerve for individuals with profound sensorineural deafness.

### 2. Live Automatic Speech-to-Text Captioning
Apps and browser tools (such as Google Live Transcribe) transcribe spoken dialogues into high-contrast captions on screen in real time.

### 3. Visual & Haptic Alerting Systems
Flashing strobe doorbells, vibrating bed-shakers linked to smoke alarms, and smartwatch vibration alerts for vehicle horns or door knocks.

### 4. Indian Sign Language (ISL)
ISL has its own independent grammar, syntax, and spatial vocabulary. ISLRTC recently standardized over 10,000 words in the official Indian Sign Language Dictionary.`,
      easy_read_body: `Hearing aids make sounds louder and clearer. Live speech-to-text turns voice into words on your phone screen. Sign language allows communication using hands and facial expressions.`,
      sources: JSON.stringify([
        { name: 'Indian Sign Language Dictionary (ISLRTC)', url: 'https://islrtc.nic.in/isl-dictionary' },
        { name: 'National Association of the Deaf (NAD India)', url: 'https://nadindia.org/' }
      ]),
      order: 4
    },
    {
      id: 'cb-hear-5',
      category_id: 'cat-hearing',
      type: 'tool',
      title: 'Try It: Built-in Live Captions & Sign Alphabet',
      body_markdown: `Experience our integrated tools:
- **Speech-to-Text Live Captioner:** Speak into your microphone and observe real-time captions rendered with high contrast on screen.
- **ISL Fingerspelling Visualizer:** Interactive cards demonstrating the Indian Sign Language alphabet and common conversational greetings.`,
      easy_read_body: `Try speaking into your computer to see words appear on screen like magic captions.`,
      sources: JSON.stringify([]),
      order: 5
    },
    {
      id: 'cb-hear-6',
      category_id: 'cat-hearing',
      type: 'resource',
      title: 'Resources & RPwD Act Provisions in India',
      body_markdown: `### Key Government Schemes & Protections:
- **RPwD Act 2016:** Guarantees sign language interpreters in judicial and public settings, barrier-free communication, and television news subtitling.
- **ADIP Scheme for Hearing Aids & Cochlear Implants:** Financial assistance up to ₹6,00,000 for pediatric cochlear implant surgeries in children with hearing loss from low-income families through designated empanelled hospitals.
- **AYJNISHD (Mumbai):** Pioneer national institute offering speech therapy, audiological evaluation, and assistive device fitment.`,
      easy_read_body: `The ADIP scheme helps eligible families receive free hearing aids or cochlear implants. The RPwD Act requires news and videos to provide sign language or subtitles.`,
      sources: JSON.stringify([
        { name: 'Department of Empowerment of Persons with Disabilities (DEPwD)', url: 'https://disabilityaffairs.gov.in' }
      ]),
      order: 6
    },
    {
      id: 'cb-hear-7',
      category_id: 'cat-hearing',
      type: 'myth_fact',
      title: 'Common Myths vs. Realities in Hearing & Deafness',
      body_markdown: `### Myth 1: "All deaf people can read lips accurately."
**Fact:** Lipreading is extremely difficult; only about 30% to 40% of English and Indian spoken speech sounds are visibly distinguishable on the lips, with many sounds (p/b/m, t/d) looking identical.

### Myth 2: "Hearing aids and cochlear implants completely restore normal hearing like glasses do for vision."
**Fact:** Hearing aids amplify sound, including background noise; cochlear implants deliver electrical auditory stimulation that requires months of dedicated auditory retraining.

### Myth 3: "Sign language is universal worldwide."
**Fact:** Sign languages are natural languages with independent grammars and regional variations. Indian Sign Language (ISL) is completely distinct from American Sign Language (ASL) or British Sign Language (BSL).`,
      easy_read_body: `Myth: Deaf people can easily read everyone's lips. Fact: Lipreading is very hard. Captions and sign language are much clearer.`,
      sources: JSON.stringify([{ name: 'World Federation of the Deaf (WFD)', url: 'https://wfdeaf.org/' }]),
      order: 7
    }
  ];

  for (const b of hearingBlocks) {
    insertBlock.run(b.id, b.category_id, b.type, b.title, b.body_markdown, b.easy_read_body, 'en', b.order, b.sources);
  }

  // Mobility / Physical Impairment - Content Blocks
  const mobilityBlocks = [
    {
      id: 'cb-mob-1',
      category_id: 'cat-mobility',
      type: 'overview',
      title: 'What is Mobility & Physical Disability?',
      body_markdown: `Mobility and physical impairments involve conditions that affect a person's physical capacity to move, coordinate actions, manipulate objects, or perform gross and fine motor activities.

### Diverse Forms:
- **Cerebral Palsy:** Neurological disorders affecting muscle tone, posture, balance, and fine motor skills.
- **Spinal Cord Injury (Paraplegia / Quadriplegia):** Loss of motor function or sensation below the site of injury.
- **Limb Loss / Amputation:** Congenital absence or surgical removal of limbs requiring ergonomic prosthetics.
- **Tremors & Parkinson's Disease:** Involuntary, rhythmic muscle contractions that make delicate finger targeting (such as clicking small touch targets) difficult.
- **Muscular Dystrophy:** Progressive weakness and degeneration of skeletal muscles.`,
      easy_read_body: `Physical disability means having trouble moving arms, legs, or hands. Some people use wheelchairs, crutches, or special mouse switches to use computers and move around.`,
      sources: JSON.stringify([
        { name: 'WHO - Physical Activity and Disability', url: 'https://www.who.int' },
        { name: 'National Institute for Locomotor Disabilities (NILD), Kolkata', url: 'http://www.nioh.in' }
      ]),
      order: 1
    },
    {
      id: 'cb-mob-2',
      category_id: 'cat-mobility',
      type: 'challenge',
      title: 'Daily-Life Challenges',
      body_markdown: `Major environmental and digital barriers include:
- **Physical Inaccessibility:** Buildings without ramps or elevators, non-standard ramp slopes (>1:12), heavy manual doors, and inaccessible toilets.
- **Digital Fine-Motor Barriers:** Web applications requiring tiny touch targets (less than 44x44px), time-limited security inputs (e.g., fast CAPTCHAs), or mandatory mouse gestures without keyboard alternatives.
- **Public Transport Inefficiency:** Lack of wheelchair-accessible buses, wide gaps between train platforms and coaches, and lack of curb ramps on sidewalks.`,
      easy_read_body: `Stairs without ramps stop wheelchairs. Websites with tiny buttons are hard to click if hands shake. Generous spacing helps everyone.`,
      sources: JSON.stringify([{ name: 'Accessible India Campaign (Sugamya Bharat Abhiyan)', url: 'http://accessibleindia.gov.in' }]),
      order: 2
    },
    {
      id: 'cb-mob-3',
      category_id: 'cat-mobility',
      type: 'simulation',
      title: 'Experience It: Tremor Simulator & Keyboard-Only Challenge',
      body_markdown: `Try our Motor Tremor Challenge below:
- Experience clicking small interface buttons while your cursor experiences simulated rhythmic jitter and delay.
- Alternatively, test your navigation by completing an entire checkout sequence using **only the Tab, Shift+Tab, and Enter keys** without touching your mouse or trackpad.`,
      easy_read_body: `Test how hard it is to click tiny buttons when your pointer is shaking, showing why large buttons are so important.`,
      sources: JSON.stringify([]),
      order: 3
    },
    {
      id: 'cb-mob-4',
      category_id: 'cat-mobility',
      type: 'solution',
      title: 'Solutions and Assistive Technologies',
      body_markdown: `Innovative engineering provides versatile ways to interact with computers and the physical world:

### 1. Alternative Input Devices
- **Sip-and-Puff Systems:** Allows individuals with high-level quadriplegia to send computer clicks and navigate powered wheelchairs using breath pressure.
- **Eye-Gaze Trackers (e.g., Tobii Dynavox):** High-precision infrared cameras track pupil movement to control mouse cursors and virtual keyboards.
- **Single-Switch Scanning:** Allows a user with movement in a single muscle (head, chin, or foot) to select letters through timed visual scanning.
- **Ergonomic Trackballs & Keyboards:** Oversized keys, keyguards to prevent accidental neighboring key presses, and filtered tremor-dampening software.

### 2. Motor-Accessible Web Design
- Minimum touch target size of 44x44 CSS pixels (WCAG 2.2 Target Size criterion).
- No time limits without an easy extension mechanism.
- Logical tab order and highly visible outline focus rings.`,
      easy_read_body: `People can control computers using eye movements, breath pressure (sip-and-puff), or voice commands. Large buttons and keyboard shortcuts are essential.`,
      sources: JSON.stringify([
        { name: 'Tobii Dynavox Assistive Technology', url: 'https://www.tobiidynavox.com/' },
        { name: 'ALIMCO - Artificial Limbs Manufacturing Corporation of India', url: 'https://www.alimco.in/' }
      ]),
      order: 4
    },
    {
      id: 'cb-mob-5',
      category_id: 'cat-mobility',
      type: 'resource',
      title: 'Schemes, Rights & Accessible India Campaign',
      body_markdown: `### Key Government Initiatives:
- **Sugamya Bharat Abhiyan (Accessible India Campaign):** National flagship campaign aimed at achieving universal accessibility in built environments, transport ecosystems, and ICT infrastructure.
- **ALIMCO (Kanpur):** State-owned enterprise manufacturing motorized tricycles, wheelchairs, modular artificial limbs, and crutches under the ADIP scheme.
- **UDID Card:** Concessions in Indian Railways (up to 75% for orthopedically impaired travelers and an escort).`,
      easy_read_body: `The Accessible India Campaign builds ramps in schools, offices, and train stations. The government provides free or low-cost wheelchairs and tricycles.`,
      sources: JSON.stringify([
        { name: 'Sugamya Bharat Abhiyan Official Portal', url: 'http://accessibleindia.gov.in' }
      ]),
      order: 5
    },
    {
      id: 'cb-mob-6',
      category_id: 'cat-mobility',
      type: 'tool',
      title: 'Try It: Built-in Single-Switch Scanning & Voice Navigation',
      body_markdown: `Experience our integrated assistive tools:
- **Single-Switch & Scanning Simulator:** Test how single-switch auto-scanning enables typing with just one button or spacebar press.
- **Voice Navigation:** Control Sahay completely hands-free by speaking commands ("scroll down", "open categories", "read").`,
      easy_read_body: `Try typing with only one button, or speak voice commands to navigate without using your hands.`,
      sources: JSON.stringify([]),
      order: 6
    },
    {
      id: 'cb-mob-7',
      category_id: 'cat-mobility',
      type: 'myth_fact',
      title: 'Common Myths vs. Realities in Physical Disability',
      body_markdown: `### Myth 1: "All wheelchair users are completely paralyzed and cannot walk at all."
**Fact:** Many wheelchair users are ambulatory wheelchair users—they can stand or walk short distances with canes or braces, but rely on wheelchairs for stamina and pain management.

### Myth 2: "People with motor tremors simply need to try harder to hold still."
**Fact:** Neurological tremors (such as in Parkinson's or essential tremor) are involuntary and often intensify with intentional effort. Assistive software filtering is essential.

### Myth 3: "Making websites accessible for motor disabilities requires complex redesigns."
**Fact:** Ensuring buttons are at least 44x44 pixels, providing clear focus indicators, and supporting full keyboard tab navigation benefits everyone.`,
      easy_read_body: `Myth: All wheelchair users can never stand up. Fact: Many can walk short distances but need wheels for longer travel. Big buttons help hands that shake.`,
      sources: JSON.stringify([{ name: 'United Spinal Association', url: 'https://unitedspinal.org/' }]),
      order: 7
    }
  ];

  for (const b of mobilityBlocks) {
    insertBlock.run(b.id, b.category_id, b.type, b.title, b.body_markdown, b.easy_read_body, 'en', b.order, b.sources);
  }

  
  // Speech & Language Impairment - Full Content Blocks
  const speechBlocks = [
    {
      id: 'cb-speech-1',
      category_id: 'cat-speech',
      type: 'overview',
      title: 'What is Speech & Language Impairment?',
      body_markdown: `Speech and language impairments cover conditions affecting spoken communication, verbal fluency, and linguistic comprehension. These conditions include:
- **Apraxia of Speech:** A motor neurological disorder where the brain has difficulty planning and sequencing the muscle movements needed to speak.
- **Dysarthria:** Muscle weakness, paralysis, or discoordination (often following stroke, cerebral palsy, or brain injury) causing slurred, quiet, or strained pronunciation.
- **Aphasia:** Language impairment affecting the ability to comprehend, retrieve words (anomia), or formulate spoken sentences.
- **Stuttering / Dysfluency:** Interruptions in the flow of speech, sound repetitions, and physical blocks.
- **Selective Mutism / Non-speaking Autism:** Inability to produce spoken speech in specific or all social settings.`,
      easy_read_body: `Some people have difficulty pronouncing words or speaking out loud. Picture cards, speech apps, and communication boards help them speak and share their feelings.`,
      sources: JSON.stringify([
        { name: 'AIISH Mysore - All India Institute of Speech and Hearing', url: 'https://aiishmysore.in/' },
        { name: 'American Speech-Language-Hearing Association (ASHA)', url: 'https://www.asha.org/' }
      ]),
      order: 1
    },
    {
      id: 'cb-speech-2',
      category_id: 'cat-speech',
      type: 'challenge',
      title: 'Daily-Life Communication Challenges & Barriers',
      body_markdown: `Individuals with speech and communication impairments face pervasive social and technological barriers:
- **Time Pressure in Social Interactions:** Listeners impatiently interrupting, speaking over, or attempting to finish sentences before an AAC user finishes constructing their message.
- **Voice-Only Automated Services (IVR):** Banking helplines, telecommunication support, and government hotlines that require verbal responses with no accessible keypad or digital chat fallback.
- **Emergency Situations:** Extreme vulnerability when attempting to dial emergency numbers (112/100) or report medical allergies without a voice communicator.
- **Misjudged Intelligence:** Strangers frequently mistaking speech disfluencies or slurring for cognitive impairment or lack of understanding.`,
      easy_read_body: `Talking fast or interrupting makes it hard for people using picture boards to answer. Automated phone calls that only listen to voices are impossible without typing options.`,
      sources: JSON.stringify([{ name: 'Communication Matters UK', url: 'https://www.communicationmatters.org.uk/' }]),
      order: 2
    },
    {
      id: 'cb-speech-3',
      category_id: 'cat-speech',
      type: 'simulation',
      title: 'Experience AAC Symbol Communication & Dysfluency',
      body_markdown: `Test how non-verbal individuals construct messages using high-contrast pictogram symbols, and experience how speech dysfluencies (stutter, dysarthria, apraxia) alter voice synthesis timing and clarity.`,
      easy_read_body: `Try building messages using picture cards and hear the computer speak them out loud.`,
      sources: JSON.stringify([]),
      order: 3
    },
    {
      id: 'cb-speech-4',
      category_id: 'cat-speech',
      type: 'solution',
      title: 'Solutions & Augmentative and Alternative Communication (AAC)',
      body_markdown: `Modern assistive technology empowers non-speaking individuals through multimodal communication:
- **High-Tech AAC Communicators:** Dedicated touchscreen devices or tablet apps (e.g., Avaz India, TouchChat) that synthesize natural spoken sentences from pictogram symbol grids.
- **Eye-Gaze Speech Synthesizers:** Specialized cameras tracking corneal reflections so users with ALS or cerebral palsy can type and speak entirely with eye movements.
- **Low-Tech Picture Exchange (PECS):** Tactile binders with removable velcro visual symbol cards for spontaneous communication across environments.
- **Voice Banking:** Recording and preserving an individual's natural vocal timbre before progressive neurodegenerative diseases impact verbal speech.`,
      easy_read_body: `Tablet computers that speak when you tap picture cards, eye-tracking screens that know what you look at, and voice apps help non-verbal people communicate easily.`,
      sources: JSON.stringify([
        { name: 'Avaz India AAC', url: 'https://www.avazapp.com/' },
        { name: 'Tobii Dynavox AAC Solutions', url: 'https://www.tobiidynavox.com/' }
      ]),
      order: 4
    },
    {
      id: 'cb-speech-5',
      category_id: 'cat-speech',
      type: 'tool',
      title: 'Try It: Built-in AAC Picture Board & Speech Synthesizer',
      body_markdown: `Experience Sahay's built-in AAC Picture Communication Board located in the Tools suite. You can build multi-symbol sentences ("I want food", "Please help", "Thank you") and hear them spoken aloud in Hindi, Telugu, or English with instant TTS synthesis.`,
      easy_read_body: `Click on symbol cards to build a sentence and press Speak to hear it spoken in Hindi, Telugu, or English.`,
      sources: JSON.stringify([]),
      order: 5
    },
    {
      id: 'cb-speech-6',
      category_id: 'cat-speech',
      type: 'resource',
      title: 'Resources, Rights & Support in India',
      body_markdown: `### Legal Recognition & National Institutions:
- **RPwD Act 2016:** Recognizes Speech and Language Disability as a specified disability eligible for Unique Disability ID (UDID) certification and 4% reservation in government employment.
- **AIISH Mysore (All India Institute of Speech and Hearing):** An autonomous institute under the Ministry of Health and Family Welfare offering diagnostic assessment, tele-speech therapy, and AAC prescription.
- **ADIP Scheme:** Government financial assistance providing free or subsidized electronic speech generating devices, communicators, and laptops for eligible individuals.`,
      easy_read_body: `The Indian government provides the UDID card and free speech communicators through AIISH Mysore and the ADIP scheme.`,
      sources: JSON.stringify([
        { name: 'AIISH Mysore Official Portal', url: 'https://aiishmysore.in/' },
        { name: 'DEPwD Speech Disability Guidelines', url: 'https://disabilityaffairs.gov.in/' }
      ]),
      order: 6
    },
    {
      id: 'cb-speech-7',
      category_id: 'cat-speech',
      type: 'myth_fact',
      title: 'Common Myths vs. Realities in Speech & Language',
      body_markdown: `### Myth 1: "If someone cannot speak verbally, they cannot understand what is being said."
**Fact:** Expressive speech (oral-motor muscle coordination) and receptive language (comprehension) are handled by completely different neurological systems. Non-verbal people often understand every word spoken.

### Myth 2: "Using an AAC device will stop a child from ever learning to talk."
**Fact:** Decades of clinical research show that AAC usage actually encourages and accelerates natural speech development by reducing frustration and reinforcing sentence construction.

### Myth 3: "Stuttering is caused by psychological nervousness or lack of confidence."
**Fact:** Stuttering is a neurodevelopmental motor speech difference involving genetic factors and brain wiring, not an emotional weakness.`,
      easy_read_body: `Myth: People who do not speak cannot understand you. Fact: They understand everything and use picture boards to express their thoughts.`,
      sources: JSON.stringify([{ name: 'National Stuttering Association', url: 'https://westutter.org/' }]),
      order: 7
    }
  ];

  // Learning Disabilities & Dyslexia - Full Content Blocks
  const learningBlocks = [
    {
      id: 'cb-learn-1',
      category_id: 'cat-learning',
      type: 'overview',
      title: 'Understanding Specific Learning Disabilities (SLD)',
      body_markdown: `Specific Learning Disabilities (SLDs) are neurodevelopmental conditions that affect how the brain processes, stores, and communicates information. SLDs are lifelong differences that are completely independent of intelligence:
- **Dyslexia:** Affects accurate and fluent word reading, decoding, and spelling due to differences in phonological processing.
- **Dysgraphia:** Affects handwriting legibility, spatial organization on paper, and fine-motor coordination during writing.
- **Dyscalculia:** Affects comprehension of numerical concepts, arithmetic calculations, time measurement, and spatial reasoning.
- **Non-Verbal Learning Disability (NVLD):** Involves challenges in visual-spatial, non-verbal social cueing, and motor planning.`,
      easy_read_body: `Learning differences like dyslexia mean letters or numbers can look confusing or jumbled. Clean fonts, reading rulers, and audiobooks make learning fun and easy.`,
      sources: JSON.stringify([
        { name: 'National Institute for the Empowerment of Persons with Intellectual Disabilities (NIEPID)', url: 'https://niepid.nic.in/' },
        { name: 'International Dyslexia Association', url: 'https://dyslexiaida.org/' }
      ]),
      order: 1
    },
    {
      id: 'cb-learn-2',
      category_id: 'cat-learning',
      type: 'challenge',
      title: 'Daily-Life Challenges & Systemic Barriers',
      body_markdown: `People with learning disabilities encounter significant friction in academic, professional, and civic spaces:
- **Dense, Low-Contrast Typography:** Crowded blocks of text with tight line-spacing cause visual crowding, letter reversals (b/d, p/q), and cognitive reading exhaustion.
- **Rigid Examination Systems:** Academic evaluations that strictly penalize handwriting and spelling errors rather than testing conceptual mastery.
- **Complex Bureaucratic Paperwork:** Dense government forms, legal contracts, and terms of service written in convoluted language without plain-English or easy-read summaries.
- **Underdiagnosis & Social Stigma:** Children frequently being wrongly labeled as "lazy" or "inattentive" before receiving timely diagnostic psycho-educational evaluation.`,
      easy_read_body: `Reading tiny crowded words causes eyes and brains to feel very tired. School exams that deduct marks for spelling make it hard for smart students to show what they know.`,
      sources: JSON.stringify([{ name: 'NCERT Guidelines for Children with Disabilities', url: 'https://ncert.nic.in/' }]),
      order: 2
    },
    {
      id: 'cb-learn-3',
      category_id: 'cat-learning',
      type: 'simulation',
      title: 'Experience Dyslexia Letter-Jitter & Reading Rulers',
      body_markdown: `Experience how letters dynamically jitter, rotate, and swap positions, demonstrating cognitive reading fatigue and how high-contrast reading rulers restore focus.`,
      easy_read_body: `See how text can look when letters jump around, and use a reading ruler to keep your place.`,
      sources: JSON.stringify([]),
      order: 3
    },
    {
      id: 'cb-learn-4',
      category_id: 'cat-learning',
      type: 'solution',
      title: 'Solutions & Assistive Technologies for Learning Differences',
      body_markdown: `Assistive technologies transform learning for individuals with SLD:
- **Dyslexia-Optimized Fonts:** Fonts with weighted bottoms and distinctive character shapes (e.g., OpenDyslexic, Lexend) that anchor letters and prevent mental rotation.
- **Digital Reading Rulers & Bionic Reading:** Highlighting one line at a time while tinting surrounding lines reduces visual crowding and tracks reading position.
- **Text-to-Speech (TTS) & Sugamya Pustakalaya:** Dual auditory and visual immersion reinforces decoding and vocabulary retention.
- **Speech-to-Text Dictation & Mind Mapping:** Voice dictation tools enable thinkers with dysgraphia to draft comprehensive essays without handwriting fatigue.`,
      easy_read_body: `Special fonts that do not jump, screen rulers that guide your eyes line by line, and speech readers make reading enjoyable for everyone.`,
      sources: JSON.stringify([
        { name: 'British Dyslexia Association Technology Guide', url: 'https://www.bdadyslexia.org.uk/' },
        { name: 'Sugamya Pustakalaya Audiobooks', url: 'https://sugamyapustakalaya.in/' }
      ]),
      order: 4
    },
    {
      id: 'cb-learn-5',
      category_id: 'cat-learning',
      type: 'tool',
      title: 'Try It: Built-in Text-to-Speech & Font Switcher',
      body_markdown: `Test Sahay's built-in Text-to-Speech reader and the Dyslexia Font toggle in the Accessibility Settings drawer. Click the "Listen" button on any topic to hear text read aloud while sentences are highlighted.`,
      easy_read_body: `Turn on the OpenDyslexic font or listen to any section using the speech reader button.`,
      sources: JSON.stringify([]),
      order: 5
    },
    {
      id: 'cb-learn-6',
      category_id: 'cat-learning',
      type: 'resource',
      title: 'Legal Accommodations & Rights in India',
      body_markdown: `### Rights under the RPwD Act 2016 & Examination Boards:
- **CBSE, ICSE & State Board Accommodations:** Mandatory 20 minutes compensatory extra time per hour, exemption from third language requirements, provision of scribes/readers, and use of calculators for dyscalculia.
- **Higher Education Rights:** 5% reservation in government higher education institutions under Section 32 of the RPwD Act.
- **UDID Certification:** Specific Learning Disabilities are assessed through NIMHANS index and standardized battery tests for certification.`,
      easy_read_body: `Indian school boards give extra time in exams, permission to use computers or writers, and calculator support for students with learning differences.`,
      sources: JSON.stringify([
        { name: 'CBSE Examination Bye-Laws for CWSN', url: 'https://www.cbse.gov.in/' },
        { name: 'NIEPID Secunderabad Portal', url: 'https://niepid.nic.in/' }
      ]),
      order: 6
    },
    {
      id: 'cb-learn-7',
      category_id: 'cat-learning',
      type: 'myth_fact',
      title: 'Common Myths vs. Realities in Dyslexia',
      body_markdown: `### Myth 1: "Dyslexia is an eye problem that can be cured with vision therapy or special tinted glasses."
**Fact:** Dyslexia is a neurobiological difference in the brain's language processing centers, not a physical defect in the eyes or optic nerves.

### Myth 2: "People with dyslexia are not intelligent."
**Fact:** Intelligence and dyslexia are completely unrelated. Many of history's greatest scientists, entrepreneurs, and artists (such as Albert Einstein, Steve Jobs, and Agatha Christie) had dyslexia.

### Myth 3: "Dyslexia is just writing letters backwards (like writing 'b' as 'd')."
**Fact:** While letter reversals are common in early childhood development, dyslexia is primarily a challenge with phoneme-grapheme association and rapid word naming.`,
      easy_read_body: `Myth: People with dyslexia cannot be smart. Fact: Many famous scientists and artists have dyslexia. It just means their brains think creatively in pictures.`,
      sources: JSON.stringify([{ name: 'Yale Center for Dyslexia & Creativity', url: 'https://dyslexia.yale.edu/' }]),
      order: 7
    }
  ];

  // ADHD & Executive Function - Full Content Blocks
  const adhdBlocks = [
    {
      id: 'cb-adhd-1',
      category_id: 'cat-adhd',
      type: 'overview',
      title: 'Understanding ADHD & Executive Functioning',
      body_markdown: `Attention Deficit Hyperactivity Disorder (ADHD) is a neurodevelopmental difference characterized by atypical dopamine and norepinephrine regulation in the brain's prefrontal cortex. This affects executive functioning:
- **Working Memory:** Holding information in mind while performing multistep operations.
- **Task Initiation & Sustained Attention:** Initiating tasks that lack immediate novelty or urgency, and sustaining focus through non-stimulating activities.
- **Hyperfocus:** Intense, absorption-level focus on deeply engaging tasks where awareness of time and surroundings disappears.
- **Impulse & Emotional Regulation:** Managing spontaneous reactions and experiencing intense emotional responses to rejection (Rejection Sensitive Dysphoria).`,
      easy_read_body: `ADHD makes it hard to sit still or keep attention when there are too many noises or popups. Breaking tasks into small steps and using timers helps a lot.`,
      sources: JSON.stringify([
        { name: 'NIMHANS Department of Child & Adolescent Psychiatry', url: 'https://nimhans.ac.in/' },
        { name: 'CHADD - Children and Adults with ADHD', url: 'https://chadd.org/' }
      ]),
      order: 1
    },
    {
      id: 'cb-adhd-2',
      category_id: 'cat-adhd',
      type: 'challenge',
      title: 'Daily-Life Challenges & Sensory Distractions',
      body_markdown: `Modern digital environments and workplaces present acute friction points for ADHD:
- **Notification Barrage & Context Switching:** Constant digital pings, flashing advertisements, and auto-playing videos derail trains of thought and trigger cognitive exhaustion.
- **Time Blindness:** Difficulty sensing the passage of time without external visual timers, causing chronic lateness and deadline stress.
- **Executive Dysfunction Paralysis:** Feeling completely overwhelmed when facing vague, unstructured assignments with multiple open-ended steps.
- **Workplace Stigma:** Being unfairly criticized as undisciplined, forgetful, or careless despite working under tremendous cognitive strain.`,
      easy_read_body: `Loud screens with flashing ads make it hard to focus on homework or jobs. Forgetting how fast time is passing creates stress.`,
      sources: JSON.stringify([{ name: 'ADHD Foundation Neurodiversity Charity', url: 'https://www.adhdfoundation.org.uk/' }]),
      order: 2
    },
    {
      id: 'cb-adhd-3',
      category_id: 'cat-adhd',
      type: 'simulation',
      title: 'Experience ADHD Focus Mode vs Distractions',
      body_markdown: `Test your comprehension when navigating a chaotic interface with simulated popups and sensory chatter, compared directly to a stripped-down Focus Mode reader.`,
      easy_read_body: `Compare reading with noisy pop-ups versus a calm, quiet reading page.`,
      sources: JSON.stringify([]),
      order: 3
    },
    {
      id: 'cb-adhd-4',
      category_id: 'cat-adhd',
      type: 'solution',
      title: 'Solutions, Organizational Tools & Focus Aids',
      body_markdown: `Effective accommodations remove friction and anchor attention:
- **Distraction-Free Reader Modes:** Stripping web pages down to essential typography without sidebars, advertisements, or animations.
- **Visual Timers (Time Timer):** Colored disappearing disks showing the visual volume of remaining time rather than abstract numbers.
- **Task Chunking & Kanban Boards:** Breaking complex projects into bite-sized, single-action checklist items.
- **Soundscapes & Brown Noise:** Continuous low-frequency audio that masks sudden unpredictable ambient noises without causing auditory fatigue.`,
      easy_read_body: `Visual timers that show time like a pie chart, checklists with one task at a time, and quiet background sounds help keep the brain calm and focused.`,
      sources: JSON.stringify([
        { name: 'ADDitude Magazine Assistive Tech Guide', url: 'https://www.additudemag.com/' }
      ]),
      order: 4
    },
    {
      id: 'cb-adhd-5',
      category_id: 'cat-adhd',
      type: 'tool',
      title: 'Try It: Built-in Easy-Read & Reduce Motion Controls',
      body_markdown: `Enable Easy-Read Mode at the top of any Sahay topic to instantly distill complex documentation into concise, bulleted explanations. You can also turn on Reduce Motion in accessibility settings to pause all CSS animations.`,
      easy_read_body: `Turn on Easy-Read or Reduce Motion to make pages cleaner, simpler, and free of moving graphics.`,
      sources: JSON.stringify([]),
      order: 5
    },
    {
      id: 'cb-adhd-6',
      category_id: 'cat-adhd',
      type: 'resource',
      title: 'Rights, Workplace Adjustments & Clinical Support',
      body_markdown: `### Support Frameworks in India:
- **RPwD Act 2016 & NEP 2020:** Mandates inclusive classroom practices, individualized education plans (IEPs), and positive behavioral supports.
- **Reasonable Accommodation:** Right to request quiet workspace allocation, noise-cancelling headphone allowances, and flexible task pacing in employment.
- **NIMHANS Tele-MANAS:** National mental health network offering clinical consultation and diagnostic guidance for executive functioning.`,
      easy_read_body: `Schools and offices can provide quiet desks, headphones, and flexible hours to help people with ADHD work at their best.`,
      sources: JSON.stringify([
        { name: 'NIMHANS Official Portal', url: 'https://nimhans.ac.in/' },
        { name: 'Tele-MANAS Government of India', url: 'https://telemanas.mohfw.gov.in/' }
      ]),
      order: 6
    },
    {
      id: 'cb-adhd-7',
      category_id: 'cat-adhd',
      type: 'myth_fact',
      title: 'Common Myths vs. Realities in ADHD',
      body_markdown: `### Myth 1: "ADHD is just an excuse for being lazy or undisciplined."
**Fact:** ADHD is a neurochemical condition involving dopamine receptor variances. Brain imaging scans clearly demonstrate physical differences in frontal lobe activation.

### Myth 2: "Only hyperactive boys have ADHD, and you outgrow it as an adult."
**Fact:** ADHD affects people of all genders and ages. In girls and adults, it frequently presents as inattentiveness, racing thoughts, and internal restlessness rather than physical hyperactivity.

### Myth 3: "If someone can play video games for 5 hours, they don't have ADHD."
**Fact:** Video games provide rapid, continuous dopamine feedback loops that stimulate ADHD brains. The difficulty is not a lack of attention, but an inability to voluntarily regulate attention toward low-stimulation tasks.`,
      easy_read_body: `Myth: ADHD means someone is lazy. Fact: Their brain simply needs the right kind of stimulation, structure, and calm tools to shine.`,
      sources: JSON.stringify([{ name: 'ADDitude Magazine Myths and Facts', url: 'https://www.additudemag.com/' }]),
      order: 7
    }
  ];

  // Autism Spectrum & Neurodiversity - Full Content Blocks
  const autismBlocks = [
    {
      id: 'cb-aut-1',
      category_id: 'cat-autism',
      type: 'overview',
      title: 'Understanding Autism Spectrum & Neurodiversity',
      body_markdown: `Autism Spectrum Disorder (ASD) is a lifelong neurodevelopmental variation characterized by distinct perceptual, social, and communicative patterns. Seen through the lens of neurodiversity, autism is a natural form of human cognitive variation:
- **Sensory Processing Differences:** Heightened sensitivity (hyper-reactivity) or reduced sensitivity (hypo-reactivity) to visual lights, auditory frequencies, tactile textures, or smells.
- **Direct & Honest Communication:** Preference for clear, unambiguous communication without subtext, sarcasm, or neurotypical unwritten social conventions.
- **Monotropic Focus & Deep Passions:** Exceptional capacity for intense, specialized focus on areas of deep passion and intellectual interest.
- **Need for Predictability:** Deriving comfort and psychological safety from clear schedules, predictable routines, and explicit transition notices.`,
      easy_read_body: `Autism means experiencing the world with unique senses. Loud noises and bright lights can feel very strong. Predictable routines and quiet spaces help autistic people feel safe and happy.`,
      sources: JSON.stringify([
        { name: 'National Trust for the Welfare of Persons with Autism (Govt of India)', url: 'https://thenationaltrust.gov.in/' },
        { name: 'Autistic Self Advocacy Network (ASAN)', url: 'https://autisticadvocacy.org/' }
      ]),
      order: 1
    },
    {
      id: 'cb-aut-2',
      category_id: 'cat-autism',
      type: 'challenge',
      title: 'Daily-Life Challenges & Sensory Overload',
      body_markdown: `Everyday public and digital spaces are frequently engineered without sensory accessibility:
- **Sensory Overload & Meltdowns:** Fluorescent lighting hums, echoey public buildings, flashing signs, and crowds can overwhelm the nervous system, leading to involuntary shutdowns or meltdowns.
- **The "Double Empathy Problem":** Mutual communication breakdowns occurring because neurotypical and autistic people naturally communicate differently, often wrongly blamed entirely on the autistic person.
- **Forced Eye Contact & Masking:** Social expectations requiring uncomfortable eye contact and "masking" (suppressing natural stimming behaviors like hand-flapping or rocking) which causes deep mental exhaustion.
- **Abrupt Routine Disruption:** Unexpected changes in plans or digital UI updates without advance warning create intense disorientation and anxiety.`,
      easy_read_body: `Crowded places with loud sounds and flashing lights can cause sensory overload. Having to hide your natural habits is very tiring.`,
      sources: JSON.stringify([{ name: 'National Autistic Society UK', url: 'https://www.autism.org.uk/' }]),
      order: 2
    },
    {
      id: 'cb-aut-3',
      category_id: 'cat-autism',
      type: 'simulation',
      title: 'Experience Sensory Overload Awareness',
      body_markdown: `Experience an educational simulation illustrating auditory and visual sensory sensitivities, featuring competing audio streams, flickering visuals, and an instant emergency stop button.`,
      easy_read_body: `See how overwhelming too many sounds and lights can feel, with a red button to stop anytime.`,
      sources: JSON.stringify([]),
      order: 3
    },
    {
      id: 'cb-aut-4',
      category_id: 'cat-autism',
      type: 'solution',
      title: 'Solutions, Sensory Spaces & Inclusive Design',
      body_markdown: `Creating autism-inclusive environments involves proactive accommodation:
- **Sensory De-Escalation Spaces:** Quiet sensory rooms with dimmed warm lighting, weighted blankets, and noise-dampening panels in airports, schools, and offices.
- **Visual Task Schedules & Social Stories:** Step-by-step visual roadmaps depicting exactly what will happen during an upcoming visit, medical procedure, or journey.
- **Digital Predictability:** Websites with stable layouts, zero auto-playing media, muted pastel or dark color options, and clear error messages without harsh red warning alarms.
- **Acceptance of Stimming:** Normalizing self-regulatory behaviors (stimming, fidget tools, wearing sunglasses indoors) as healthy nervous system regulation.`,
      easy_read_body: `Quiet rooms with soft lights, noise-cancelling headphones, and pictures showing what will happen next help autistic people participate comfortably.`,
      sources: JSON.stringify([
        { name: 'Sugamya Bharat Built Environment Guidelines', url: 'http://accessibleindia.gov.in/' }
      ]),
      order: 4
    },
    {
      id: 'cb-aut-5',
      category_id: 'cat-autism',
      type: 'tool',
      title: 'Try It: High-Contrast Themes & Emergency Assistance Cards',
      body_markdown: `Switch between Dark Mode and Yellow-on-Black themes using Sahay's top accessibility drawer to eliminate harsh white glare. You can also generate a customized Emergency Assistance Card in the Tools suite.`,
      easy_read_body: `Switch to dark screen themes to protect your eyes from bright glare, or make a personal helper card.`,
      sources: JSON.stringify([]),
      order: 5
    },
    {
      id: 'cb-aut-6',
      category_id: 'cat-autism',
      type: 'resource',
      title: 'Government Schemes & Legal Protection in India',
      body_markdown: `### National Schemes under The National Trust & RPwD Act:
- **Niramaya Health Insurance:** Comprehensive health insurance scheme providing up to ₹1,00,000 coverage per year for individuals with autism.
- **Samarth Respite Care Scheme:** Providing temporary relief and residential respite care for families and caregivers of autistic individuals.
- **RPwD Act 2016:** Recognizes Autism Spectrum Disorder as a specified benchmark disability with legal protections against discrimination in education and employment.`,
      easy_read_body: `The National Trust of India offers the Niramaya insurance card for free medical treatment up to ₹1,00,000 for people with autism.`,
      sources: JSON.stringify([
        { name: 'The National Trust Official Portal', url: 'https://thenationaltrust.gov.in/' },
        { name: 'Niramaya Scheme Portal', url: 'https://thenationaltrust.gov.in/content/scheme/niramaya.php' }
      ]),
      order: 6
    },
    {
      id: 'cb-aut-7',
      category_id: 'cat-autism',
      type: 'myth_fact',
      title: 'Common Myths vs. Realities in Autism',
      body_markdown: `### Myth 1: "Autistic people do not feel empathy or want social connections."
**Fact:** Autistic people often experience profound, overwhelming empathy (hyper-empathy). Communication styles differ, but the human desire for meaningful connection and love is universal.

### Myth 2: "Autism only affects children; there are no autistic adults."
**Fact:** Autism is a lifelong neurodevelopmental difference. Autistic children grow up to be autistic adults, contributing as programmers, writers, artists, and leaders.

### Myth 3: "All autistic people are either non-verbal or savants like Rain Man."
**Fact:** Autism is a wide spectrum with infinite combinations of strengths and support needs. Stereotypes fail to capture the rich diversity of the autistic community.`,
      easy_read_body: `Myth: Autistic people do not care about others. Fact: Autistic people care very deeply and feel emotions strongly.`,
      sources: JSON.stringify([{ name: 'Autistic Self Advocacy Network Myths & Facts', url: 'https://autisticadvocacy.org/' }]),
      order: 7
    }
  ];

  // Mental Health & Emotional Well-being - Full Content Blocks
  const mentalHealthBlocks = [
    {
      id: 'cb-mh-1',
      category_id: 'cat-mental-health',
      type: 'overview',
      title: 'Understanding Mental Health & Emotional Well-being',
      body_markdown: `Mental health conditions encompass conditions affecting mood, cognitive processing, stress response, and psychological equilibrium. These include major depressive disorder, generalized anxiety, panic disorder, bipolar disorder, and PTSD:
- **Energy & Cognitive Load:** Depression and acute stress severely deplete dopamine and serotonin, causing physical lethargy, brain fog, and executive paralysis.
- **Fight-or-Flight Hyperarousal:** Panic and anxiety trigger the sympathetic nervous system, inducing hyperventilation, racing heart, and catastrophic cognitive loops.
- **Autonomic Grounding:** Using the five physical senses and controlled respiration to down-regulate the nervous system and anchor attention into immediate safety.`,
      easy_read_body: `Mental health means feeling safe, calm, and emotionally balanced. When worry or sadness becomes too heavy, gentle breathing and friendly helplines provide comfort.`,
      sources: JSON.stringify([
        { name: 'World Health Organization (WHO) - Mental Health', url: 'https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response' },
        { name: 'National Institute of Mental Health and Neurosciences (NIMHANS)', url: 'https://nimhans.ac.in/' }
      ]),
      order: 1
    },
    {
      id: 'cb-mh-2',
      category_id: 'cat-mental-health',
      type: 'challenge',
      title: 'Daily-Life Challenges & Psychological Barriers',
      body_markdown: `Individuals navigating mental health conditions face both acute physiological symptoms and harsh societal barriers:
- **Panic Attacks in Crowded Public Spaces:** Sudden surges of fear in packed buses, subways, or high-pressure workplaces without access to calm de-escalation spaces.
- **Cognitive Exhaustion & Motivation Paralysis:** Tasks that seem simple to others (opening mail, responding to emails, eating meals) feeling like insurmountable mountains during depressive episodes.
- **High-Stress Digital Interfaces:** Websites with aggressive countdown timers, flashing alerts, and unhelpful error messages that trigger panic in users with anxiety.
- **Deep Social Stigma & Fear of Disclosing:** Pervasive fear of being judged as weak, unreliable, or unfit for employment, preventing millions from seeking timely clinical support.`,
      easy_read_body: `Feeling panic in crowded places or feeling too exhausted to get out of bed is very hard. Websites with loud countdown timers make anxiety worse.`,
      sources: JSON.stringify([{ name: 'The Lancet Commission on Stigma and Mental Health', url: 'https://www.thelancet.com/' }]),
      order: 2
    },
    {
      id: 'cb-mh-3',
      category_id: 'cat-mental-health',
      type: 'simulation',
      title: 'Experience 5-4-3-2-1 Sensory Grounding & Crisis Support',
      body_markdown: `Practice the clinically proven 5-4-3-2-1 multi-sensory grounding exercise with calming audio chimes, follow the 4-4-4-4 Box Breathing visual pacer, and create your own Emergency Assistance Card.`,
      easy_read_body: `Use our soothing breathing pacer and grounding exercise to feel calm and relaxed.`,
      sources: JSON.stringify([]),
      order: 3
    },
    {
      id: 'cb-mh-4',
      category_id: 'cat-mental-health',
      type: 'solution',
      title: 'Solutions, Low-Stress Interfaces & De-Escalation Aids',
      body_markdown: `Designing compassionate environments supports emotional resilience and healing:
- **Sensory Grounding & Box Breathing:** 4-4-4-4 diaphragmatic breathing (Inhale 4s, Hold 4s, Exhale 4s, Hold 4s) signals the vagus nerve to slow heart rate and lower cortisol.
- **Emergency Crisis / Assistance Cards:** Wallet cards or digital lock-screen cards detailing emergency contacts, psychiatrist information, and non-judgmental instructions for bystanders.
- **Calm, Forgiving UI Design:** Interfaces that offer generous session timeouts, auto-saving drafts, reversible actions ("Undo"), and reassuring microcopy.
- **24/7 Professional Helplines:** Instant access to qualified mental health counselors via toll-free national helplines.`,
      easy_read_body: `Box breathing exercises, soft soothing screen colors, and saving emergency phone numbers on a card help you stay calm and safe.`,
      sources: JSON.stringify([
        { name: 'NIMHANS Clinical Guidelines for Stress & Anxiety', url: 'https://nimhans.ac.in/' },
        { name: 'Tele-MANAS Guidelines', url: 'https://telemanas.mohfw.gov.in/' }
      ]),
      order: 4
    },
    {
      id: 'cb-mh-5',
      category_id: 'cat-mental-health',
      type: 'tool',
      title: 'Try It: Built-in Grounding Pacer & Emergency Medical Card',
      body_markdown: `Access Sahay's Emergency Medical ID tool in the Tools Hub to create an Emergency Crisis Card with your emergency contacts, calm de-escalation tips, and print-ready layout. You can also use our interactive Box Breathing pacer in the Mental Health Simulator.`,
      easy_read_body: `Create your free emergency helper card or try the calming breathing circle right now.`,
      sources: JSON.stringify([]),
      order: 5
    },
    {
      id: 'cb-mh-6',
      category_id: 'cat-mental-health',
      type: 'resource',
      title: 'Legal Rights, Mental Healthcare Act 2017 & 24/7 Helplines in India',
      body_markdown: `### 24/7 Free National Helplines:
- **KIRAN Mental Health Helpline:** **1800-599-0019** (24/7 National toll-free helpline by DEPwD, offering support in 13 Indian languages).
- **Tele-MANAS (Govt of India):** **14416** or **1800-891-4416** (24/7 tele-mental health counseling by Ministry of Health and Family Welfare).
- **Vandrevala Foundation:** **+91 9999 666 555** (24/7 crisis support).

### Key Legal Protections under the Mental Healthcare Act 2017:
- **Right to Advance Directive:** Every individual has the legal right to state in advance how they wish to be cared for during mental health crises and appoint a nominated representative.
- **Decriminalization of Suicide (Section 115):** Explicitly states that any person who attempts suicide is presumed to be under severe stress and shall not be prosecuted or punished.
- **RPwD Act 2016:** Recognizes Mental Illness as a specified disability eligible for equal workplace accommodations and non-discrimination.`,
      easy_read_body: `Call the free national helpline KIRAN at 1800-599-0019 or Tele-MANAS at 14416 anytime for free, kind help from a counselor.`,
      sources: JSON.stringify([
        { name: 'KIRAN Helpline Portal', url: 'http://disabilityaffairs.gov.in' },
        { name: 'Tele-MANAS Official Portal', url: 'https://telemanas.mohfw.gov.in/' }
      ]),
      order: 6
    },
    {
      id: 'cb-mh-7',
      category_id: 'cat-mental-health',
      type: 'myth_fact',
      title: 'Common Myths vs. Realities in Mental Health',
      body_markdown: `### Myth 1: "Mental health disorders are personal weaknesses; you can snap out of it if you try harder."
**Fact:** Mental health conditions are complex medical disorders involving neurobiology, genetics, and life stress. They require compassionate therapy, social support, and medical care—not willpower alone.

### Myth 2: "People with mental illness are unpredictable and dangerous."
**Fact:** The vast majority of people with mental health conditions are non-violent. In fact, they are over 10 times more likely to be victims of violence and discrimination than perpetrators.

### Myth 3: "Seeking psychological help means you are crazy or brings shame to your family."
**Fact:** Seeking support is an act of courage and self-awareness. Taking care of your mind is just as natural and necessary as visiting a doctor for a physical illness.`,
      easy_read_body: `Myth: Asking for help with sadness or worry is weak. Fact: Talking to a counselor is very brave and helps you feel better, just like seeing a doctor for a fever.`,
      sources: JSON.stringify([{ name: 'NIMHANS Mental Health Awareness & Myths', url: 'https://nimhans.ac.in/' }]),
      order: 7
    }
  ];

  const allEnhancedBlocks = [
    ...speechBlocks,
    ...learningBlocks,
    ...adhdBlocks,
    ...autismBlocks,
    ...mentalHealthBlocks
  ];

  for (const b of allEnhancedBlocks) {
    insertBlock.run(b.id, b.category_id, b.type, b.title, b.body_markdown, b.easy_read_body, 'en', b.order, b.sources);
  }


  // 4. Seed Interactive Quiz Questions (5-10 questions per core category)
  const insertQuiz = db.prepare(`
    INSERT INTO quiz_questions (id, category_id, question, options_json, correct_index, explanation)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const quizData = [
  {
    "id": "qz-v-1",
    "cat": "cat-visual",
    "question": "What percentage of people with visual impairment or legal blindness retain some functional sight?",
    "options": [
      "0% (All blind people see total darkness)",
      "Around 25%",
      "Around 85%",
      "Only 5%"
    ],
    "correct": 2,
    "explanation": "Approximately 85% of people diagnosed with visual impairment have residual vision such as light, shadow, or color perception."
  },
  {
    "id": "qz-v-2",
    "cat": "cat-visual",
    "question": "What is the minimum WCAG 2.2 AA contrast ratio required for normal body text against its background?",
    "options": [
      "2:1",
      "3:1",
      "4.5:1",
      "7:1"
    ],
    "correct": 2,
    "explanation": "WCAG 2.2 Level AA requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text."
  },
  {
    "id": "qz-v-3",
    "cat": "cat-visual",
    "question": "Which of the following is a popular, free, open-source screen reader for Windows?",
    "options": [
      "NVDA",
      "Photoshop",
      "ChromeVox Pro",
      "WinScribe"
    ],
    "correct": 0,
    "explanation": "NVDA (NonVisual Desktop Access) is a free, high-performance, open-source screen reader for Windows used globally."
  },
  {
    "id": "qz-v-4",
    "cat": "cat-visual",
    "question": "Which visual condition causes progressive loss of peripheral vision, often referred to as \"tunnel vision\"?",
    "options": [
      "Cataracts",
      "Glaucoma",
      "Macular Degeneration",
      "Myopia"
    ],
    "correct": 1,
    "explanation": "Glaucoma damages the optic nerve, frequently diminishing peripheral sight while central sight may initially remain."
  },
  {
    "id": "qz-v-5",
    "cat": "cat-visual",
    "question": "Under India's RPwD Act 2016, what is the employment reservation percentage in government jobs for persons with benchmark disabilities?",
    "options": [
      "1%",
      "2%",
      "4%",
      "10%"
    ],
    "correct": 2,
    "explanation": "The RPwD Act 2016 raised the reservation in government establishments from 3% to 4%, including specific quotas for visual and hearing disabilities."
  },
  {
    "id": "qz-v-6",
    "cat": "cat-visual",
    "question": "What is a refreshable Braille display?",
    "options": [
      "An electromechanical hardware device that raises and lowers rounded pins to produce dynamic tactile Braille from digital screen text",
      "A chemical cleaning cloth for computer monitors",
      "A digital magnifying lamp for reading printed paper books",
      "A high-speed optical printer that produces embossed braille sheets only"
    ],
    "correct": 0,
    "explanation": "Refreshable Braille displays translate on-screen digital text into tactile Braille cells in real time using movable electromechanical pins."
  },
  {
    "id": "qz-v-7",
    "cat": "cat-visual",
    "question": "Which type of color vision deficiency involves insensitivity or absence of green cone photoreceptors (most common form of red-green deficiency)?",
    "options": [
      "Protanopia",
      "Deuteranopia",
      "Tritanopia",
      "Monochromacy"
    ],
    "correct": 1,
    "explanation": "Deuteranopia (or deuteranomaly) affects green cone photoreceptors and represents the most prevalent hereditary color vision variation."
  },
  {
    "id": "qz-v-8",
    "cat": "cat-visual",
    "question": "In web accessibility (WCAG 1.1.1), why must informative <img> elements have accurate \"alt\" text attributes?",
    "options": [
      "To make graphics render faster over slow cellular networks",
      "So screen readers can vocalize the content and purpose of the visual element to blind and low-vision users",
      "To automatically convert images into downloadable vector PDF files",
      "To change the border color of image thumbnails"
    ],
    "correct": 1,
    "explanation": "Screen readers vocalize the alt attribute text to users who cannot see the graphic, conveying the same informational meaning as the visual image."
  },
  {
    "id": "qz-v-9",
    "cat": "cat-visual",
    "question": "On pedestrian pathways and railway platforms, what tactile ground indicator pattern signals a clear, continuous walking route for white cane users?",
    "options": [
      "Raised directional linear ridges / guiding bars",
      "Raised blister hazard dots / warning studs",
      "Smooth polished glazed granite tiles",
      "Cross-hatched diamond grid indentations"
    ],
    "correct": 0,
    "explanation": "Linear directional tactile bars guide cane users safely forward in a straight line, while blister warning bumps indicate hazards, turns, or curbs."
  },
  {
    "id": "qz-v-10",
    "cat": "cat-visual",
    "question": "What is the primary function of Orca in the Linux / GNOME computing ecosystem?",
    "options": [
      "A free, flexible, open-source screen reader and magnifier for graphical desktops",
      "A database server optimizer for web servers",
      "A video streaming encoder application",
      "An automated braille embossing driver utility"
    ],
    "correct": 0,
    "explanation": "Orca is the standard assistive technology providing speech synthesis and refreshable Braille navigation on Linux / GNOME desktops."
  },
  {
    "id": "qz-h-1",
    "cat": "cat-hearing",
    "question": "What is the official central institute for Indian Sign Language established by the Government of India?",
    "options": [
      "ISLRTC (New Delhi)",
      "IIT Bombay",
      "CSIR",
      "AIIMS Audio Cell"
    ],
    "correct": 0,
    "explanation": "The Indian Sign Language Research and Training Centre (ISLRTC) in New Delhi develops learning materials and standardizes the ISL dictionary."
  },
  {
    "id": "qz-h-2",
    "cat": "cat-hearing",
    "question": "In high-frequency sensorineural hearing loss, which components of speech are typically hardest to distinguish?",
    "options": [
      "Low vowel sounds (a, o, u)",
      "High-pitched consonants (s, f, th, sh)",
      "Loud musical bass",
      "All sounds equally"
    ],
    "correct": 1,
    "explanation": "Consonants like s, f, th, and sh carry high acoustic frequencies. Losing these frequencies makes speech sound muffled and indistinct."
  },
  {
    "id": "qz-h-3",
    "cat": "cat-hearing",
    "question": "What is the medical term for experiencing persistent ringing, clicking, or buzzing in the ears without an external sound?",
    "options": [
      "Presbycusis",
      "Tinnitus",
      "Aphasia",
      "Dyslexia"
    ],
    "correct": 1,
    "explanation": "Tinnitus is the perception of noise or ringing in the ears and affects millions of individuals with auditory conditions."
  },
  {
    "id": "qz-h-4",
    "cat": "cat-hearing",
    "question": "Which government scheme in India provides financial support for cochlear implant surgeries in young children from low-income families?",
    "options": [
      "ADIP Scheme",
      "PM-KISAN",
      "Swachh Bharat",
      "Ayushman Bharat PMJAY Only"
    ],
    "correct": 0,
    "explanation": "The ADIP (Assistance to Disabled Persons) scheme supports pediatric cochlear implants up to ₹6 Lakhs per beneficiary."
  },
  {
    "id": "qz-h-5",
    "cat": "cat-hearing",
    "question": "What component inside modern hearing aids allows them to directly receive audio from an induction hearing loop system in public venues?",
    "options": [
      "Telecoil (T-coil)",
      "Infrared receiver diode",
      "FM radio antenna only",
      "Piezoelectric crystal"
    ],
    "correct": 0,
    "explanation": "A Telecoil (T-coil) is a small magnetic coil that picks up audio signals directly from an induction loop system, filtering out ambient hall noise."
  },
  {
    "id": "qz-h-6",
    "cat": "cat-hearing",
    "question": "Under WCAG 2.2 AA (Criterion 1.2.2), what is mandated for all pre-recorded video media that contains speech?",
    "options": [
      "Accurate, synchronized closed captions including speaker IDs and sound effects",
      "Subtitles translated into Latin script only",
      "A high-volume background soundtrack",
      "Automatic 2x video playback acceleration"
    ],
    "correct": 0,
    "explanation": "Synchronized captions convey dialogue, identify active speakers, and transcribe critical sound effects (applause, alarms) for d/Deaf viewers."
  },
  {
    "id": "qz-h-7",
    "cat": "cat-hearing",
    "question": "In Indian Sign Language (ISL), what essential role do Non-Manual Markers (NMMs) like facial expressions and head tilts play?",
    "options": [
      "They serve purely as decorative emotional expressions",
      "They form indispensable grammatical structures that distinguish question types, negation, and adverbs",
      "They are only used during theatrical performances",
      "They eliminate the need for manual hand shapes entirely"
    ],
    "correct": 1,
    "explanation": "Non-manual markers such as eyebrow positions, head movements, and mouth morphemes serve syntactic roles indicating questions, conditions, and tone."
  },
  {
    "id": "qz-h-8",
    "cat": "cat-hearing",
    "question": "What is the defining distinction between Open Captions and Closed Captions on digital video platforms?",
    "options": [
      "Open captions are permanently embedded into the video frames and cannot be turned off, whereas closed captions can be toggled on/off by the viewer",
      "Closed captions can only be decoded when wearing wired headphones",
      "Open captions are restricted to displaying musical notes and lyrics only",
      "There is no technical difference between them"
    ],
    "correct": 0,
    "explanation": "Open captions are permanently burned into the video video stream, whereas closed captions exist as separate text tracks that viewers can enable or disable."
  },
  {
    "id": "qz-h-9",
    "cat": "cat-hearing",
    "question": "How do assistive environmental alert systems inform deaf residents of critical domestic events (doorbells, fire alarms, telephone calls)?",
    "options": [
      "Through high-intensity strobe flashes, vibrating bed-shakers, and mobile push notifications",
      "Through ultra-high frequency acoustic megaphones",
      "Through special air pressure whistles",
      "By automatically disconnecting household electricity"
    ],
    "correct": 0,
    "explanation": "Sensory alerting systems convert audible environmental alerts into vivid flashing strobe lights and tactile vibrating units."
  },
  {
    "id": "qz-h-10",
    "cat": "cat-hearing",
    "question": "In clinical audiology, hearing loss exceeding what decibel (dB) threshold is classified as \"Profound Hearing Loss\"?",
    "options": [
      "25 dB",
      "40 dB",
      "70 dB",
      "91 dB or greater"
    ],
    "correct": 3,
    "explanation": "Profound hearing loss begins at 91 dB or greater, where conversational speech is inaudible without advanced amplification or cochlear implants."
  },
  {
    "id": "qz-m-1",
    "cat": "cat-mobility",
    "question": "What is the recommended minimum touch target size according to WCAG 2.2 AA to support users with hand tremors?",
    "options": [
      "16x16 pixels",
      "24x24 pixels",
      "44x44 pixels",
      "80x80 pixels"
    ],
    "correct": 2,
    "explanation": "A minimum target size of 44x44 CSS pixels ensures individuals with tremors or motor limitations can tap controls accurately."
  },
  {
    "id": "qz-m-2",
    "cat": "cat-mobility",
    "question": "What assistive technology allows an individual with high-level quadriplegia to control a wheelchair or computer through breath pressure?",
    "options": [
      "Sip-and-Puff system",
      "Optic trackpad",
      "Haptic vest",
      "Voice synthesizer only"
    ],
    "correct": 0,
    "explanation": "Sip-and-puff technology translates inhalations and exhalations of air into directional mouse moves and clicks."
  },
  {
    "id": "qz-m-3",
    "cat": "cat-mobility",
    "question": "What is the maximum standard ramp slope recommended for safe wheelchair accessibility in public buildings?",
    "options": [
      "1:1 (45 degrees)",
      "1:4",
      "1:12",
      "1:30 only"
    ],
    "correct": 2,
    "explanation": "A 1:12 slope ratio (1 unit of vertical rise for every 12 units of horizontal run) is the standard accessible gradient."
  },
  {
    "id": "qz-m-4",
    "cat": "cat-mobility",
    "question": "Which assistive technology enables individuals with severe physical paralysis to navigate software interfaces solely using their eye gaze?",
    "options": [
      "Eye-tracking infrared camera systems with dwell-click selection",
      "Optical barcode scanners",
      "Standard red laser pointers",
      "Digital overhead projector lenses"
    ],
    "correct": 0,
    "explanation": "Eye trackers use near-infrared light to detect corneal reflections and pupil movement, moving the cursor and triggering selections via timed dwell clicks."
  },
  {
    "id": "qz-m-5",
    "cat": "cat-mobility",
    "question": "Why is a hidden \"Skip to Main Content\" link placed at the very top of accessible web pages?",
    "options": [
      "To reduce cellular network data bandwidth consumption",
      "To allow keyboard-only and switch users to bypass long, repetitive navigation bars and jump straight to primary content",
      "To automatically close all opened background tabs in the browser",
      "To convert web pages into printable PDF documents"
    ],
    "correct": 1,
    "explanation": "Skip links spare keyboard and switch-access users from having to press Tab through dozens of navigation links on every page load."
  },
  {
    "id": "qz-m-6",
    "cat": "cat-mobility",
    "question": "Under CPWD India Accessibility Norms and international standards, what is the minimum clear opening width for accessible doorways?",
    "options": [
      "500 mm (0.5 meter)",
      "650 mm",
      "900 mm (approx 36 inches / 3 feet)",
      "1600 mm"
    ],
    "correct": 2,
    "explanation": "A clear door opening width of at least 900 mm (36 inches) allows standard manual and motorized wheelchairs to pass without obstruction."
  },
  {
    "id": "qz-m-7",
    "cat": "cat-mobility",
    "question": "Which operating system accessibility feature prevents involuntary repeated key-presses caused by muscle tremors or spasticity?",
    "options": [
      "Filter Keys (or Bounce Keys)",
      "Sticky Keys",
      "Caps Lock Guard",
      "Turbo Scroll Lock"
    ],
    "correct": 0,
    "explanation": "Filter Keys instructs the operating system to disregard rapid, brief, or repeated keystrokes caused by muscle tremors or spasms."
  },
  {
    "id": "qz-m-8",
    "cat": "cat-mobility",
    "question": "How does the \"Sticky Keys\" accessibility feature assist computer users with single-hand or mouth-stick operation?",
    "options": [
      "It physically fastens loose mechanical keycaps to the keyboard board",
      "It locks modifier keys (Shift, Ctrl, Alt, Windows) in an active state so shortcut combos can be typed sequentially one key at a time",
      "It doubles the system CPU clock rate automatically",
      "It activates an inverted high-contrast screen magnifier"
    ],
    "correct": 1,
    "explanation": "Sticky Keys eliminates the need to press multiple keys simultaneously (e.g. Ctrl+Alt+Del), allowing each modifier key to be tapped in sequence."
  },
  {
    "id": "qz-m-9",
    "cat": "cat-mobility",
    "question": "What is an assistive \"Switch Device\" (such as a jelly bean or buddy switch) commonly used for in assistive tech?",
    "options": [
      "A specialized sensitive push-button activated by a hand, chin, cheek, or foot to operate scanning software interfaces",
      "A circuit breaker toggle in a building electrical panel",
      "A network switch routing internet ethernet cables",
      "A surge protector power strip toggle"
    ],
    "correct": 0,
    "explanation": "Assistive switches provide simple binary input (press/release) for individuals with limited motor control to operate computers via single-switch scanning."
  },
  {
    "id": "qz-m-10",
    "cat": "cat-mobility",
    "question": "Under the Harmonised Guidelines for Universal Accessibility in India (2021), what circular turning diameter is required for a manual wheelchair?",
    "options": [
      "800 mm",
      "1000 mm",
      "1500 mm (1.5 meters)",
      "2800 mm"
    ],
    "correct": 2,
    "explanation": "A circular landing or turning area with a diameter of 1500 mm (1.5 m) allows a 360-degree turn of standard manual wheelchairs."
  },
  {
    "id": "qz-s-1",
    "cat": "cat-speech",
    "question": "What does the abbreviation AAC stand for in the context of speech and language accommodations?",
    "options": [
      "Augmentative and Alternative Communication",
      "Automated Audio Captioning",
      "Auditory Aphasia Correction",
      "Advanced Articulation Coding"
    ],
    "correct": 0,
    "explanation": "AAC stands for Augmentative and Alternative Communication, encompassing picture boards, text-to-speech devices, and gestural systems."
  },
  {
    "id": "qz-s-2",
    "cat": "cat-speech",
    "question": "Which neurological condition typically caused by stroke or brain injury affects a person's ability to express and understand written and spoken language?",
    "options": [
      "Aphasia",
      "Astigmatism",
      "Alopecia",
      "Arthritis"
    ],
    "correct": 0,
    "explanation": "Aphasia is a language disorder resulting from damage to brain regions responsible for language expression and comprehension."
  },
  {
    "id": "qz-s-3",
    "cat": "cat-speech",
    "question": "When communicating with an individual who uses an AAC speech generating device or has a speech dysfluency, what is the best practice?",
    "options": [
      "Finish their sentences for them to speed up conversation",
      "Give them ample time to formulate and express their message without interrupting",
      "Speak loudly as if they have hearing loss",
      "Ask only questions requiring a nod"
    ],
    "correct": 1,
    "explanation": "Patience and allowing conversational partners sufficient time to select icons or type their message on an AAC system preserves dignity."
  },
  {
    "id": "qz-s-4",
    "cat": "cat-speech",
    "question": "What is the fundamental distinction between Unaided and Aided AAC communication systems?",
    "options": [
      "Unaided AAC relies strictly on the user’s body (facial expressions, gestures, manual signing), whereas Aided AAC uses external tools (boards, tablets, electronic speech devices)",
      "Unaided AAC requires a certified medical prescription to practice",
      "Aided AAC is only permitted for children under 10 years of age",
      "There is no technical difference between the two systems"
    ],
    "correct": 0,
    "explanation": "Unaided communication requires no external tools (body gestures, signs, vocal sounds), whereas aided communication utilizes physical boards or digital AAC devices."
  },
  {
    "id": "qz-s-5",
    "cat": "cat-speech",
    "question": "Which motor speech disorder involves difficulty in planning and sequencing the precise muscle movements necessary for speech production, despite normal muscle strength?",
    "options": [
      "Apraxia of Speech (CAS / AOS)",
      "Spina Bifida",
      "Cataract",
      "Presbyopia"
    ],
    "correct": 0,
    "explanation": "Apraxia of speech is a neurological motor-planning disorder where the brain struggles to coordinate lip, jaw, and tongue movements to produce intended sounds."
  },
  {
    "id": "qz-s-6",
    "cat": "cat-speech",
    "question": "What is Dysarthria?",
    "options": [
      "A motor speech disorder resulting from muscle weakness, paralysis, or discoordination that affects vocal articulation, breath control, and speech volume",
      "A complete congenital loss of auditory perception",
      "An inability to decipher numerical calculations",
      "A social phobia of public lectures"
    ],
    "correct": 0,
    "explanation": "Dysarthria occurs when neurological damage (stroke, cerebral palsy, ALS) weakens or paralyzes speech muscles, resulting in slurred or strained vocalization."
  },
  {
    "id": "qz-s-7",
    "cat": "cat-speech",
    "question": "Which of the following is a recognized open-source, web-based AAC communication tool featuring symbol boards and speech synthesis in Indian languages?",
    "options": [
      "Cboard",
      "AutoCAD",
      "Docker Compose",
      "VLC Media Player"
    ],
    "correct": 0,
    "explanation": "Cboard is an open-source progressive web application providing symbol boards and text-to-speech support in multiple Indian and international languages."
  },
  {
    "id": "qz-s-8",
    "cat": "cat-speech",
    "question": "In speech and language pathology, how does an Eye-Gaze AAC communication tablet assist non-verbal individuals with severe physical paralysis?",
    "options": [
      "It tracks ocular fixations with high-precision infrared sensors, allowing the user to select vocabulary tiles and speak sentences using their gaze",
      "It requires the user to wear heavy magnifying spectacles while talking",
      "It converts lip reading into closed captions without any display",
      "It trains the user to avoid eye contact in social situations"
    ],
    "correct": 0,
    "explanation": "Eye-gaze AAC devices empower non-verbal individuals with motor impairments (such as ALS or cerebral palsy) to produce synthetic speech solely by looking at display symbols."
  },
  {
    "id": "qz-s-9",
    "cat": "cat-speech",
    "question": "What is an Electrolarynx assistive speech device?",
    "options": [
      "A handheld battery-powered device held against the neck that generates acoustic vibrations that the speaker shapes into articulate words after vocal cord removal",
      "An electronic stethoscope used by cardiologists",
      "A studio condenser microphone used for vocal singing",
      "An ultrasonic neck massage wand"
    ],
    "correct": 0,
    "explanation": "Following surgical removal of the larynx (laryngectomy), an electrolarynx provides an external mechanical sound source vibrating through throat tissues."
  },
  {
    "id": "qz-s-10",
    "cat": "cat-speech",
    "question": "Why does accessible digital public service design require providing live chat or email contact options alongside telephone voice helplines?",
    "options": [
      "To guarantee that non-verbal citizens and individuals with speech disabilities can obtain services independently without vocalizing on the phone",
      "To cut telecommunication carrier expenses for call centers",
      "To substitute live support staff with automated spam bots",
      "To eliminate the necessity of saving textual customer logs"
    ],
    "correct": 0,
    "explanation": "Voice-only helplines erect insurmountable barriers for citizens with speech or hearing disabilities; accessible multimodal communication ensures universal access."
  },
  {
    "id": "qz-l-1",
    "cat": "cat-learning",
    "question": "Under the RPwD Act 2016 in India, Specific Learning Disabilities (SLD) legally encompass which conditions?",
    "options": [
      "Dyslexia, Dysgraphia, and Dyscalculia",
      "Only complete color blindness",
      "Peripheral hearing impairment",
      "Temporary memory fatigue"
    ],
    "correct": 0,
    "explanation": "The RPwD Act 2016 recognizes Specific Learning Disabilities (SLD), encompassing Dyslexia (reading), Dysgraphia (writing), and Dyscalculia (math)."
  },
  {
    "id": "qz-l-2",
    "cat": "cat-learning",
    "question": "How do specialized dyslexia-friendly typefaces (like OpenDyslexic or Lexend) assist readers with dyslexia?",
    "options": [
      "They invert colors every 5 seconds",
      "They feature heavier, weighted bottoms on letterforms to reduce perceived flipping and rotations",
      "They replace text with emoji icons",
      "They increase font size to 100pt automatically"
    ],
    "correct": 1,
    "explanation": "Dyslexia-friendly typefaces incorporate bottom-weighted letterforms and distinct shapes to prevent letters from appearing inverted."
  },
  {
    "id": "qz-l-3",
    "cat": "cat-learning",
    "question": "What digital assistive accommodation helps individuals with reading processing difficulties track one line of text at a time?",
    "options": [
      "Screen Magnifier with Inversion",
      "Digital Reading Ruler / Guiding Overlay",
      "Bass Audio Equalizer",
      "Mouse Cursor Jitter Filter"
    ],
    "correct": 1,
    "explanation": "Digital reading rulers highlight the active line of text while dimming surrounding paragraphs, reducing visual crowding."
  },
  {
    "id": "qz-l-4",
    "cat": "cat-learning",
    "question": "What is Dyscalculia?",
    "options": [
      "A specific learning disability affecting a person’s ability to understand numerical values, mathematical symbols, mental arithmetic, and time calculation",
      "Difficulty recognizing familiar human facial expressions",
      "A physical motor tremor affecting penmanship",
      "A loss of peripheral color visual field"
    ],
    "correct": 0,
    "explanation": "Dyscalculia is a neurodevelopmental learning difference involving persistent difficulty in understanding number relationships, arithmetic calculations, and clock time."
  },
  {
    "id": "qz-l-5",
    "cat": "cat-learning",
    "question": "What is Dysgraphia?",
    "options": [
      "A specific learning condition that impairs handwriting mechanics, pencil grip control, spelling accuracy, and spatial coherence of written text",
      "A severe phobia of speaking into an audio microphone",
      "An inability to perceive tonal pitch and musical melodies",
      "A temporary optical migraine"
    ],
    "correct": 0,
    "explanation": "Dysgraphia is a neurological learning condition affecting fine motor coordination and orthographic memory required for handwriting and organizing written thoughts."
  },
  {
    "id": "qz-l-6",
    "cat": "cat-learning",
    "question": "Which typographic layout formatting best supports comfortable reading for individuals with dyslexia and visual stress?",
    "options": [
      "Left-aligned text with generous line spacing (1.5x) and avoiding full justified alignment",
      "Fully justified text blocks with dense kerning and cursive fonts",
      "All-uppercase capitalized text rendered in tight italics",
      "Centering all multi-paragraph reading passages"
    ],
    "correct": 0,
    "explanation": "Fully justified text creates erratic inter-word gaps (\"rivers of white\") that impede visual tracking; left-aligned text ensures steady, predictable reading saccades."
  },
  {
    "id": "qz-l-7",
    "cat": "cat-learning",
    "question": "How does Text-to-Speech (TTS) bimodal presentation (synchronized dual-color highlighting) aid readers with learning difficulties?",
    "options": [
      "It synchronously highlights sentences and individual words as audio playback proceeds, strengthening visual-auditory phonological binding",
      "It flashes bright neon warnings over grammatically complex words",
      "It deletes unfamiliar multi-syllabic vocabulary words from the text",
      "It rotates confusing letter glyphs upside down"
    ],
    "correct": 0,
    "explanation": "Bimodal presentation pairs simultaneous auditory speech with synchronized visual text highlighting, significantly enhancing word recognition and comprehension."
  },
  {
    "id": "qz-l-8",
    "cat": "cat-learning",
    "question": "Under CBSE guidelines and RPwD Act regulations in India, what examination accommodations are granted to students with certified Specific Learning Disabilities?",
    "options": [
      "Compensatory extra time (20 minutes per hour) and the option of an adult scribe or reader",
      "Automatic award of 100% maximum grade without examination participation",
      "Total permanent exemption from attending educational classes",
      "Permission to bring personal academic textbooks into the examination hall"
    ],
    "correct": 0,
    "explanation": "National education boards grant certified SLD students compensatory extra time (20 minutes per hour of exam), scribes/readers, and exemption from third-language requirements."
  },
  {
    "id": "qz-l-9",
    "cat": "cat-learning",
    "question": "What is the purpose of an \"Easy Read\" (or Plain Language) document format?",
    "options": [
      "Presenting complex institutional and legal information through concise sentences, plain terminology, and supporting illustrative imagery",
      "A code minification tool that removes whitespace from source code",
      "An encrypted compression format for archival storage",
      "A software compiler for legacy computer mainframes"
    ],
    "correct": 0,
    "explanation": "Easy Read formats translate intricate policy, medical, and administrative documents into straightforward language paired with pictures to aid cognitive access."
  },
  {
    "id": "qz-l-10",
    "cat": "cat-learning",
    "question": "Which background color adjustment often helps individuals with visual stress (Meares-Irlen syndrome) read comfortably?",
    "options": [
      "Replacing stark glaring white backgrounds with warm off-white, cream, or pastel tint overlays",
      "Using pure black text on pure reflective white",
      "Flickering strobe backlights",
      "Fluorescent green font on yellow background"
    ],
    "correct": 0,
    "explanation": "Many individuals with visual stress experience glare or distortion on high-contrast white pages; soft pastel or sepia background overlays eliminate reading strain."
  },
  {
    "id": "qz-a-1",
    "cat": "cat-adhd",
    "question": "What are the primary executive functioning domains commonly affected in individuals with ADHD?",
    "options": [
      "Physical muscle strength and bone density",
      "Working memory, impulse control, task initiation, and sustained attention",
      "Optic nerve signal reception",
      "High-frequency sound discrimination"
    ],
    "correct": 1,
    "explanation": "ADHD is a neurodevelopmental condition involving executive dysfunction, affecting task initiation, working memory, and sustained attention."
  },
  {
    "id": "qz-a-2",
    "cat": "cat-adhd",
    "question": "Which web design and browser feature directly helps neurodivergent individuals and users with ADHD focus on content?",
    "options": [
      "Auto-playing background video ads",
      "Distraction-free Reader View / Focus Mode that strips extraneous sidebars and popups",
      "Flashing animated banners",
      "Infinite continuous scroll without headings"
    ],
    "correct": 1,
    "explanation": "Reader View and Focus Mode eliminate sidebar advertisements, animations, and non-essential visual clutter, significantly reducing cognitive load."
  },
  {
    "id": "qz-a-3",
    "cat": "cat-adhd",
    "question": "What is the productivity technique that breaks work into focused 25-minute intervals followed by short breaks, widely used by people with ADHD?",
    "options": [
      "The Pomodoro Technique",
      "The Waterfall Method",
      "The Boolean Search Loop",
      "The Weber-Fechner Cycle"
    ],
    "correct": 0,
    "explanation": "The Pomodoro Technique uses structured time-boxing (usually 25 minutes of focus followed by a 5-minute break) to maintain momentum."
  },
  {
    "id": "qz-a-4",
    "cat": "cat-adhd",
    "question": "What is \"Hyperfocus\" in the context of Attention Deficit Hyperactivity Disorder (ADHD)?",
    "options": [
      "A state of intense, deep absorption in a high-interest activity where external stimuli and the passage of time are completely tuned out",
      "An optometric prescription for high-magnification reading glasses",
      "The inability to sustain attention on anything for longer than two seconds",
      "A neurosurgical procedure performed on the cerebral cortex"
    ],
    "correct": 0,
    "explanation": "Hyperfocus is a recognized ADHD phenomenon where high stimulation or deep personal interest triggers intense, prolonged absorption in a single task."
  },
  {
    "id": "qz-a-5",
    "cat": "cat-adhd",
    "question": "What is \"Time Blindness\", commonly experienced by individuals with ADHD?",
    "options": [
      "A persistent difficulty in gauging, tracking, and sensing the passage of time or estimating task durations",
      "An eye injury resulting from directly looking into bright solar eclipses",
      "A malfunctioning electronic wrist watch mechanism",
      "A medical condition where a person can only awaken after dusk"
    ],
    "correct": 0,
    "explanation": "Time blindness stems from executive function differences, making it difficult to perceive the flow of time and plan future schedules reliably."
  },
  {
    "id": "qz-a-6",
    "cat": "cat-adhd",
    "question": "How do Visual Timers (such as the Time Timer) benefit neurodivergent individuals and people with ADHD?",
    "options": [
      "They represent remaining time as a diminishing colored disc, translating abstract numerical minutes into intuitive visual space",
      "They sound piercing high-decibel acoustic sirens every single minute",
      "They freeze digital desktop system clocks temporarily",
      "They accelerate real-world time by a factor of 10"
    ],
    "correct": 0,
    "explanation": "Visual timers convert abstract numerical clock figures into an intuitive decreasing slice of color, making the passage of time tangible and clear."
  },
  {
    "id": "qz-a-7",
    "cat": "cat-adhd",
    "question": "Which design pattern prevents cognitive fatigue and form abandonment for users with ADHD completing multi-step online forms?",
    "options": [
      "Segmenting forms into progressive step-by-step wizards with visible progress bars and auto-saving drafts",
      "Presenting a single massive unsegmented page containing 150 compulsory fields",
      "Hiding confirmation action buttons that change position upon every mouse hover",
      "Imposing an unextendable 45-second session timer on each question"
    ],
    "correct": 0,
    "explanation": "Progressive disclosure breaks lengthy procedures into manageable milestones, reducing cognitive load, working memory strain, and anxiety."
  },
  {
    "id": "qz-a-8",
    "cat": "cat-adhd",
    "question": "What is \"Body Doubling\" in ADHD support and productivity strategies?",
    "options": [
      "Working on tasks in the physical or virtual presence of another supportive individual to foster focus and gentle accountability",
      "Hiring an identical twin actor to attend examination halls",
      "Duplicating account credentials across social networking sites",
      "Practicing dual-handed calligraphy simultaneously"
    ],
    "correct": 0,
    "explanation": "Body doubling involves having another quiet, focused person present in the room or on video call, which helps reduce task paralysis and anchors attention."
  },
  {
    "id": "qz-a-9",
    "cat": "cat-adhd",
    "question": "Why are auto-playing background animations, looping GIFs, and animated marquees especially disruptive to users with ADHD?",
    "options": [
      "They trigger involuntary reflexive attention capture in the brain, continuously derailing focus from primary reading material",
      "They cause immediate liquid crystal burnout in flat-panel monitors",
      "They trigger mechanical failures in optical mouse peripherals",
      "They physically overheat room temperature settings"
    ],
    "correct": 0,
    "explanation": "Uncontrollable visual movement involuntarily stimulates the human orienting reflex, forcing the ADHD brain to repeatedly expend energy refocusing."
  },
  {
    "id": "qz-a-10",
    "cat": "cat-adhd",
    "question": "Under WCAG 2.2 Guideline 2.2.1 (Timing Adjustable), what accessibility accommodation must websites provide for time-limited activities?",
    "options": [
      "Advance warning before session expiry and a straightforward mechanism allowing the user to extend the time limit by at least 10 times",
      "Immediate sudden logout without any warning alerts",
      "Requiring the user to solve a complicated calculus equation before extending the session",
      "Restricting all user sessions strictly to a maximum of 30 seconds"
    ],
    "correct": 0,
    "explanation": "WCAG mandates that users who need more time due to cognitive or executive functioning differences must be warned and allowed to easily extend session timeouts."
  },
  {
    "id": "qz-aut-1",
    "cat": "cat-autism",
    "question": "What does the concept of \"Neurodiversity\" emphasize regarding autistic individuals?",
    "options": [
      "That neurological differences are natural variations of the human genome, not diseases to be cured",
      "That all individuals must think and process information identically",
      "That autism only affects children under 5 years old",
      "That sensory overload is purely psychological"
    ],
    "correct": 0,
    "explanation": "The Neurodiversity movement views neurological differences as valuable natural variations of human cognition deserving respect and accommodation."
  },
  {
    "id": "qz-aut-2",
    "cat": "cat-autism",
    "question": "Why are sudden strobe lights, loud unpredictable noises, and crowded digital banners challenging for many autistic individuals?",
    "options": [
      "Due to sensory processing differences where the nervous system experiences intense sensory overload",
      "Because they cause immediate physical loss of motor reflexes",
      "Because autistic individuals lack visual acuity",
      "Because of low blood sugar levels"
    ],
    "correct": 0,
    "explanation": "Autistic individuals often process sensory inputs with high sensitivity; intense lights or sounds can overwhelm sensory processing and trigger sensory overload."
  },
  {
    "id": "qz-aut-3",
    "cat": "cat-autism",
    "question": "Which communication accommodation supports autistic students and employees in navigating daily transitions and tasks?",
    "options": [
      "Unannounced last-minute schedule overhauls",
      "Clear visual schedules, predictable routines, and explicit written expectations",
      "Only communicating through metaphorical riddles",
      "Exclusively rapid verbal directives"
    ],
    "correct": 1,
    "explanation": "Visual schedules, clear advance notices of transitions, and concrete written communications provide predictability and reduce anxiety."
  },
  {
    "id": "qz-aut-4",
    "cat": "cat-autism",
    "question": "What is \"Stimming\" (self-stimulatory behavior) in autism?",
    "options": [
      "Repetitive physical movements or vocalizations (such as hand-flapping, rocking, or humming) used to self-regulate, calm emotions, or process sensory stimuli",
      "An esports video game competition tactic",
      "An aggressive interpersonal conversational debate technique",
      "A surgical intervention performed on the throat"
    ],
    "correct": 0,
    "explanation": "Stimming is a natural self-soothing and regulatory mechanism that assists autistic individuals in managing stress, processing sensory input, and expressing emotion."
  },
  {
    "id": "qz-aut-5",
    "cat": "cat-autism",
    "question": "What is the role of a \"Sensory Room\" or low-stimulation quiet space in inclusive schools and modern workplaces?",
    "options": [
      "A calm space equipped with dimmable lighting, noise dampening, and comfortable tactile seating for sensory decompression and recharge",
      "A sound recording studio with high-intensity audio monitors",
      "A corporate interrogation chamber",
      "An unventilated server equipment storage room"
    ],
    "correct": 0,
    "explanation": "Sensory rooms provide a soothing sanctuary with subdued lighting and muted acoustics where autistic individuals can decompress from sensory overwhelm."
  },
  {
    "id": "qz-aut-6",
    "cat": "cat-autism",
    "question": "What does the acronym PECS stand for in autism communication intervention?",
    "options": [
      "Picture Exchange Communication System",
      "Personal Electronic Computer Station",
      "Public Emergency Care Scheme",
      "Pediatric Ear Checking Standard"
    ],
    "correct": 0,
    "explanation": "PECS (Picture Exchange Communication System) is an evidence-based visual communication protocol enabling non-verbal individuals to initiate communication via picture cards."
  },
  {
    "id": "qz-aut-7",
    "cat": "cat-autism",
    "question": "Why is avoiding idioms, sarcasm, and ambiguous metaphors recommended when writing instructional guides and software copy?",
    "options": [
      "Many neurodivergent and autistic users interpret phrasing literally, making idioms confusing or misleading",
      "Idioms increase software file sizes tenfold",
      "Metaphors violate international copyright treaties",
      "Figurative language creates font rendering glitches"
    ],
    "correct": 0,
    "explanation": "Direct, transparent language avoids communicative misinterpretations for individuals who process language literally and appreciate explicit instructions."
  },
  {
    "id": "qz-aut-8",
    "cat": "cat-autism",
    "question": "What is \"Autistic Burnout\"?",
    "options": [
      "A state of severe chronic physical and cognitive exhaustion resulting from the cumulative toll of navigating unaccommodated environments and masking autistic traits",
      "A physical thermal burn from computer hardware",
      "Temporary muscle soreness following athletic jogging",
      "A brief, momentary behavioral tantrum"
    ],
    "correct": 0,
    "explanation": "Autistic burnout is a debilitating, long-term state of exhaustion, executive functioning decline, and sensory hypersensitivity caused by chronic environmental strain."
  },
  {
    "id": "qz-aut-9",
    "cat": "cat-autism",
    "question": "How do Active Noise-Cancelling (ANC) headphones assist autistic individuals in transit stations, malls, or open-plan offices?",
    "options": [
      "They attenuate chaotic background frequencies, preventing sensory overload and nervous system hyperarousal",
      "They transmit secret private radio communications",
      "They amplify all ambient speech by 200 decibels",
      "They replace interpersonal visual contact with sound effects"
    ],
    "correct": 0,
    "explanation": "ANC technology neutralizes low-frequency continuous ambient rumble and sharp background noise spikes, keeping sensory inputs within tolerable limits."
  },
  {
    "id": "qz-aut-10",
    "cat": "cat-autism",
    "question": "In India, which statutory body under the Ministry of Social Justice and Empowerment provides guardianship and welfare schemes for Autism Spectrum Disorder?",
    "options": [
      "The National Trust (for Welfare of Persons with Autism, Cerebral Palsy, Mental Retardation and Multiple Disabilities)",
      "Securities and Exchange Board of India (SEBI)",
      "The Medical Council of India",
      "Indian Space Research Organisation (ISRO)"
    ],
    "correct": 0,
    "explanation": "The National Trust Act 1999 created this statutory body to deliver empowerment, support schemes (like Niramaya health insurance), and legal guardianship."
  },
  {
    "id": "qz-mh-1",
    "cat": "cat-mental-health",
    "question": "What is the official toll-free national 24/7 mental health rehabilitation helpline in India launched by DEPwD, Government of India?",
    "options": [
      "KIRAN (1800-599-0019)",
      "UDID Line (1900-111-2222)",
      "ADIP Assist (100)",
      "Samarthya Web (1098)"
    ],
    "correct": 0,
    "explanation": "KIRAN (1800-599-0019) is a dedicated 24x7 toll-free helpline providing early screening, psychological first-aid, and distress management across 13 languages."
  },
  {
    "id": "qz-mh-2",
    "cat": "cat-mental-health",
    "question": "Under India's Rights of Persons with Disabilities (RPwD) Act 2016, how is Mental Illness recognized?",
    "options": [
      "It is not recognized legally",
      "As one of the 21 legally recognized benchmark disability categories with legal protection against discrimination",
      "Only if diagnosed prior to age 10",
      "Solely as a temporary medical condition"
    ],
    "correct": 1,
    "explanation": "The RPwD Act 2016 explicitly includes Mental Illness among its 21 recognized disabilities, entitling individuals to non-discrimination and safeguards."
  },
  {
    "id": "qz-mh-3",
    "cat": "cat-mental-health",
    "question": "Which digital accessibility principle particularly benefits users experiencing high anxiety, panic, or cognitive fatigue?",
    "options": [
      "Strict countdown timers with immediate account logout",
      "Clear undo options, auto-saving forms, and predictable navigation without aggressive timeouts",
      "Uncloseable modal alert sirens",
      "Randomly rearranging button positions"
    ],
    "correct": 1,
    "explanation": "WCAG 2.2 guidelines on Error Prevention and Timing Adjustable ensure users under stress can review inputs, recover from mistakes, and request more time."
  },
  {
    "id": "qz-mh-4",
    "cat": "cat-mental-health",
    "question": "What is the Tele-MANAS initiative launched by the Ministry of Health and Family Welfare (MoHFW), Government of India?",
    "options": [
      "A 24x7 comprehensive nationwide tele-mental health service accessible via toll-free number 14416 across all Indian States and UTs in regional languages",
      "A satellite meteorology forecasting system",
      "An online passport renewal appointment scheduler",
      "A hospital administrative accounting software"
    ],
    "correct": 0,
    "explanation": "Tele-MANAS provides free, round-the-clock tele-counselling, psychiatric consultation, and crisis intervention nationwide in over 20 languages via 14416."
  },
  {
    "id": "qz-mh-5",
    "cat": "cat-mental-health",
    "question": "Under India's Mental Healthcare Act 2017, which transformative human-rights provision was legally enacted?",
    "options": [
      "Decriminalization of suicide attempts and the legal right to create an Advance Directive detailing medical treatment choices",
      "Mandatory detention without patient consent or judicial oversight",
      "Immediate revocation of civil voting rights upon psychiatric diagnosis",
      "Strict prohibition of confidential psychotherapy sessions"
    ],
    "correct": 0,
    "explanation": "The Mental Healthcare Act 2017 protects patient autonomy, enshrines the right to Advance Directives, and decriminalized attempted suicide under Section 115."
  },
  {
    "id": "qz-mh-6",
    "cat": "cat-mental-health",
    "question": "Why is offering dark and low-contrast color themes essential for users with acute anxiety, sensory sensitivity, or migraines?",
    "options": [
      "It suppresses high-luminance monitor glare and harsh contrast spikes, creating a calm, low-glare reading environment",
      "It makes website text completely invisible to save battery life",
      "It accelerates internet browsing speeds by 50%",
      "It protects the operating system against malware infection"
    ],
    "correct": 0,
    "explanation": "Blinding white backgrounds can provoke photophobia, sensory strain, and heighten anxiety; gentle dark or warm palettes reduce visual excitation."
  },
  {
    "id": "qz-mh-7",
    "cat": "cat-mental-health",
    "question": "How does cognitive grounding (such as the 5-4-3-2-1 technique) help an individual during a panic attack or acute anxiety flare-up?",
    "options": [
      "It engages all five physical senses to reorient attention to immediate physical reality, interrupting catastrophic panic loops",
      "It requires memorizing mathematical multiplication tables backwards",
      "It induces an instantaneous hypnotic trance within 5 seconds",
      "It measures physical reflex sprint speeds"
    ],
    "correct": 0,
    "explanation": "The 5-4-3-2-1 grounding exercise engages sight, touch, sound, smell, and taste to ground consciousness in the present and deactivate autonomic panic surges."
  },
  {
    "id": "qz-mh-8",
    "cat": "cat-mental-health",
    "question": "Under WCAG 2.2 Success Criterion 3.3.4 (Error Prevention), what safeguards are required for digital legal, financial, or user data operations?",
    "options": [
      "Providing clear confirmation checkpoints, summary review steps, and reversible \"Undo\" mechanisms before finalized submission",
      "Eliminating all confirmation prompts so transactions execute immediately upon single click",
      "Displaying flashing red warning alerts with loud siren sounds",
      "Automatically wiping all form input fields after 15 seconds"
    ],
    "correct": 0,
    "explanation": "Requiring review before submission and permitting undo mechanisms eliminates panic and catastrophic mistakes for users under cognitive strain."
  },
  {
    "id": "qz-mh-9",
    "cat": "cat-mental-health",
    "question": "What is the function of an Emergency Crisis / Assistance Card carried by individuals with mental health or psychiatric conditions?",
    "options": [
      "To provide first responders and bystanders with instant, trusted emergency contacts, prescribed medications, and calm de-escalation guidelines",
      "To serve as a retail supermarket discount voucher",
      "To replace official state motor vehicle driver licenses",
      "To prove fitness gym membership status"
    ],
    "correct": 0,
    "explanation": "An Emergency Crisis Card communicates crucial medical facts, chosen emergency contacts, and personalized de-escalation instructions when a person is unable to speak."
  },
  {
    "id": "qz-mh-10",
    "cat": "cat-mental-health",
    "question": "What does \"Reasonable Accommodation\" encompass for employees with mental health conditions under the RPwD Act 2016?",
    "options": [
      "Tailored workplace modifications (such as flexible working hours, quiet workspaces, and break allowances) that enable equal participation without undue hardship",
      "Mandating immediate termination of employment contracts",
      "Doubling weekly work quotas without financial compensation",
      "Prohibiting communication with work colleagues"
    ],
    "correct": 0,
    "explanation": "Reasonable accommodation requires employers to furnish flexible, pragmatic workplace adaptations (e.g. quiet zones, modified schedules) to foster productive inclusion."
  },
  {
    "id": "qz-v-11",
    "cat": "cat-visual",
    "question": "Which braille grade uses contractions and abbreviations to save space and increase reading speed?",
    "options": [
      "Grade 1 Braille",
      "Grade 2 (Contracted) Braille",
      "Grade 3 (Shorthand) Braille",
      "Computer Braille"
    ],
    "correct": 1,
    "explanation": "Grade 2 Braille incorporates 189 contractions and short-form words, allowing faster finger tracking and reducing the bulk of embossed paper books."
  },
  {
    "id": "qz-v-12",
    "cat": "cat-visual",
    "question": "Under WCAG 2.2, which requirement ensures users can enlarge web text up to 200% without assistive technology?",
    "options": [
      "Success Criterion 1.4.4 Resize Text",
      "Success Criterion 2.1.1 Keyboard Navigation",
      "Success Criterion 3.1.1 Language of Page",
      "Success Criterion 1.1.1 Non-text Content"
    ],
    "correct": 0,
    "explanation": "WCAG 2.2 SC 1.4.4 requires that text can be magnified up to 200 percent without loss of content or functionality."
  },
  {
    "id": "qz-v-13",
    "cat": "cat-visual",
    "question": "What is the primary function of a Refreshable Braille Display connected to a computer or smartphone?",
    "options": [
      "It prints paper braille sheets using heat pins",
      "It raises and lowers round pins electronically to display screen text line-by-line as tactile braille cells",
      "It translates spoken audio directly into optical light flashes",
      "It magnifies screen characters up to 64 times"
    ],
    "correct": 1,
    "explanation": "Refreshable Braille displays use piezoelectric pins that rise and fall dynamically in 40 or 80 cell rows, enabling deafblind and blind individuals to read digital text tactually."
  },
  {
    "id": "qz-v-14",
    "cat": "cat-visual",
    "question": "Why must decorative or spacer images have an empty alt attribute (alt=\"\") in HTML?",
    "options": [
      "To prevent the web browser from downloading the image file",
      "So screen readers can silently skip irrelevant visual decoration instead of announcing unhelpful filenames",
      "To increase page loading speed in search engines",
      "Because HTML5 forbids having text on decorative photos"
    ],
    "correct": 1,
    "explanation": "An empty alt attribute (alt=\"\") instructs assistive screen readers like NVDA and TalkBack to bypass decorative graphics, preventing cognitive clutter."
  },
  {
    "id": "qz-v-15",
    "cat": "cat-visual",
    "question": "How does the IIT Delhi SmartCane assist a visually impaired user compared to a conventional white cane?",
    "options": [
      "It replaces the cane with an autonomous self-driving robot",
      "It detects knee-to-head level hanging obstacles and potholes up to 2–3 meters away using ultrasonic vibrations",
      "It reads GPS street names aloud through bone-conduction earbuds only",
      "It changes color to alert pedestrians nearby"
    ],
    "correct": 1,
    "explanation": "Standard white canes only scan ground obstacles within arm reach. The ultrasonic SmartCane detects knee, waist, and head-level hazards (like open truck beds and tree branches) up to 3 meters in advance."
  },
  {
    "id": "qz-h-11",
    "cat": "cat-hearing",
    "question": "What is the difference between Open Captions and Closed Captions (CC) in educational videos?",
    "options": [
      "Open captions are always burned into the video and cannot be turned off; closed captions can be toggled on/off by the user",
      "Open captions only contain music lyrics; closed captions only contain speech",
      "Closed captions only work on television sets, not internet browsers",
      "Open captions are automatically generated by AI without punctuation"
    ],
    "correct": 0,
    "explanation": "Open captions are permanently encoded on the video frames for universal viewing, whereas Closed Captions (CC) exist as separate timed text tracks that users can enable or disable."
  },
  {
    "id": "qz-h-12",
    "cat": "cat-hearing",
    "question": "Which frequency range is typically lost first in sensorineural hearing loss (Presbycusis)?",
    "options": [
      "Low frequencies (below 250 Hz)",
      "High frequencies (2000 Hz to 8000 Hz and above)",
      "Mid frequencies only (1000 Hz)",
      "Sub-bass frequencies (20 Hz to 60 Hz)"
    ],
    "correct": 1,
    "explanation": "High frequencies (2 kHz–8 kHz) are usually affected first, making it difficult to distinguish soft consonant sounds such as \"s\", \"f\", \"th\", and \"sh\", even when speech volume seems loud enough."
  },
  {
    "id": "qz-h-13",
    "cat": "cat-hearing",
    "question": "What is an Induction Hearing Loop (Audio Induction Loop System) used in public venues?",
    "options": [
      "A radio antenna that sends voice messages to FM radios",
      "A cable loop that generates an electromagnetic field transmitting sound directly to a hearing aid's Telecoil (T-coil) setting",
      "A loud public speaker placed at the center of the hall",
      "A vibrating seat cushion for movie theaters"
    ],
    "correct": 1,
    "explanation": "Hearing loops transmit audio magnetically straight to a hearing aid or cochlear implant equipped with a Telecoil (T-switch), cutting out background reverberation and room echo."
  },
  {
    "id": "qz-h-14",
    "cat": "cat-hearing",
    "question": "Why is Indian Sign Language (ISL) recognized as a complete, distinct visual-spatial natural language?",
    "options": [
      "It is simply a word-for-word translation of spoken English or Hindi",
      "It has its own independent grammar, syntax, spatial reference, and facial expression rules",
      "It uses only two finger positions for all words",
      "It was invented by telephone companies in 1995"
    ],
    "correct": 1,
    "explanation": "ISL is a rich natural human language with unique grammatical structures, spatial morphology, and non-manual markers (facial expressions) standardized by ISLRTC Government of India."
  },
  {
    "id": "qz-h-15",
    "cat": "cat-hearing",
    "question": "Which visual alert assistive device helps deaf individuals stay safe inside their homes?",
    "options": [
      "High-decibel sirens",
      "Strobe-light and vibrating smoke alarms, doorbell flashing flashers, and pillow-shaker alerts",
      "Infrared temperature sensors",
      "Automatic door openers"
    ],
    "correct": 1,
    "explanation": "Deaf-accessible domestic alerting systems convert acoustic doorbells, telephone rings, and emergency smoke detectors into intense flashing strobe lights and bed-shaker pads."
  },
  {
    "id": "qz-m-11",
    "cat": "cat-mobility",
    "question": "What is the minimum recommended touch target size under WCAG 2.2 Success Criterion 2.5.8 (Target Size - Minimum)?",
    "options": [
      "12 by 12 CSS pixels",
      "24 by 24 CSS pixels",
      "48 by 48 CSS pixels",
      "100 by 100 CSS pixels"
    ],
    "correct": 1,
    "explanation": "WCAG 2.2 SC 2.5.8 requires interactive targets to be at least 24x24 CSS pixels or have sufficient spacing, preventing accidental double-taps for users with tremors or motor limitations."
  },
  {
    "id": "qz-m-12",
    "cat": "cat-mobility",
    "question": "How does a Sip-and-Puff (SNP) assistive technology device operate for individuals with quadriplegia or high spinal cord injury?",
    "options": [
      "It measures hand grip pressure on a steering wheel",
      "It translates air pressure pulses (inhalation/sipping and exhalation/puffing) through a pneumatic straw into switch clicks and mouse movement",
      "It uses thermal breath temperature to type letters",
      "It requires foot pedal pressure to activate"
    ],
    "correct": 1,
    "explanation": "Sip-and-puff systems use precise micro-pressure sensors to detect soft and hard sips or puffs, allowing paralyzed individuals to drive powered wheelchairs and control operating systems."
  },
  {
    "id": "qz-m-13",
    "cat": "cat-mobility",
    "question": "Which keyboard feature built into Windows and macOS prevents accidental repeated keystrokes caused by muscle tremors?",
    "options": [
      "Sticky Keys",
      "Filter Keys (BounceKeys)",
      "Toggle Keys",
      "Mouse Keys"
    ],
    "correct": 1,
    "explanation": "Filter Keys (or BounceKeys) instructs the operating system to ignore rapid or repeated brief keystrokes caused by uncoordinated finger tremors or spasms."
  },
  {
    "id": "qz-m-14",
    "cat": "cat-mobility",
    "question": "What is the purpose of the \"Sticky Keys\" operating system accessibility feature?",
    "options": [
      "To clean dirty keyboard keys",
      "To allow modifier keys (Shift, Ctrl, Alt, Cmd) to remain active after one press, enabling single-finger shortcut execution",
      "To lock the mouse cursor to the center of the screen",
      "To automatically type the next predicted word"
    ],
    "correct": 1,
    "explanation": "Sticky Keys serializes keystrokes so users who type with one finger, a mouthstick, or a head pointer can press Ctrl, then Alt, then Del sequentially instead of holding all three simultaneously."
  },
  {
    "id": "qz-m-15",
    "cat": "cat-mobility",
    "question": "Under the RPwD Act 2016 and Harmonised Guidelines for Barrier-Free Built Environment in India, what is the maximum recommended ramp gradient for wheelchair access?",
    "options": [
      "1:1 (45 degrees)",
      "1:5 (steep slope)",
      "1:12 (gentle gradual slope) with handrails on both sides",
      "1:25 with steps"
    ],
    "correct": 2,
    "explanation": "Accessible Indian public building codes mandate a gradient ratio of 1:12 (or 1:15 for long runs) with continuous double handrails at 760mm and 900mm height, allowing safe unassisted wheelchair propulsion."
  },
  {
    "id": "qz-s-11",
    "cat": "cat-speech",
    "question": "In Augmentative and Alternative Communication (AAC), what is the difference between \"Unaided\" and \"Aided\" communication?",
    "options": [
      "Unaided relies only on the body (gestures, sign, body language); Aided uses external tools (picture boards, speech tablets)",
      "Unaided requires electricity; Aided does not",
      "Unaided is only for adults; Aided is only for children",
      "Unaided uses telephone relays; Aided uses handwritten letters"
    ],
    "correct": 0,
    "explanation": "Unaided communication involves no external equipment (facial gestures, vocalizations, manual signs), whereas Aided AAC uses physical tools ranging from low-tech communication books to high-tech eye-gaze speech synthesizers."
  },
  {
    "id": "qz-s-12",
    "cat": "cat-speech",
    "question": "What is \"Aphasia\", often acquired following a stroke or traumatic brain injury?",
    "options": [
      "A loss of muscle hearing sensitivity in the inner ear",
      "An acquired language impairment that affects the brain's ability to produce or comprehend spoken and written language",
      "A complete loss of physical vision",
      "An involuntary twitching of the eyelids"
    ],
    "correct": 1,
    "explanation": "Aphasia is a neurological condition caused by damage to brain language centers (e.g., Broca's or Wernicke's areas), impairing speech formulation while non-verbal cognition frequently remains intact."
  },
  {
    "id": "qz-s-13",
    "cat": "cat-speech",
    "question": "What is an Eye-Gaze Tracking AAC communication system?",
    "options": [
      "A camera and infrared light array that tracks where a person looks on screen, allowing them to select words and speak simply by lingering their gaze",
      "A pair of sunglasses that magnifies street signs",
      "A contact lens that measures blood sugar levels",
      "A laser pointer strapped to a handheld cane"
    ],
    "correct": 0,
    "explanation": "Eye-tracking devices (like Tobii Dynavox) illuminate the eye with near-infrared LEDs and calculate gaze dwell time, giving independent voice to individuals with ALS or locked-in syndrome."
  },
  {
    "id": "qz-s-14",
    "cat": "cat-speech",
    "question": "What is \"Dysarthria\" and how does it differ from Aphasia?",
    "options": [
      "Dysarthria is a motor speech disorder where speech muscles are weak or paralyzed, whereas Aphasia is a cognitive language processing impairment",
      "Dysarthria affects only written text; Aphasia affects only spoken text",
      "Dysarthria is caused by hearing loss; Aphasia is caused by throat infections",
      "They are identical medical terms with no difference"
    ],
    "correct": 0,
    "explanation": "In dysarthria, the brain knows exactly what words to say, but motor control of the lips, tongue, or vocal cords is impaired, leading to slurred speech."
  },
  {
    "id": "qz-s-15",
    "cat": "cat-speech",
    "question": "When communicating with someone who uses an AAC speech tablet or picture board, what is the best conversational etiquette?",
    "options": [
      "Finish their sentences for them quickly to save time",
      "Speak very loudly and avoid looking at them",
      "Give them adequate time to compose their thoughts, maintain natural eye contact, and never pretend to understand if you did not",
      "Take away the device and tell them to try speaking"
    ],
    "correct": 2,
    "explanation": "Patience and respect are paramount: never interrupt, do not touch their communication board without permission, maintain direct eye contact, and wait for their synthesized message."
  },
  {
    "id": "qz-l-11",
    "cat": "cat-learning",
    "question": "What is \"Dyscalculia\"?",
    "options": [
      "A specific learning disability that affects the ability to understand number-based facts, arithmetic calculation, and time estimation",
      "A difficulty in spelling English words only",
      "An inability to draw geometric straight lines",
      "A physical allergy to digital calculators"
    ],
    "correct": 0,
    "explanation": "Dyscalculia is a neurodevelopmental learning difference involving arithmetic concepts, math symbol decoding, and mental quantitative processing."
  },
  {
    "id": "qz-l-12",
    "cat": "cat-learning",
    "question": "How does a digital \"Reading Ruler\" or screen line-masking tool help students with dyslexia or visual tracking difficulties?",
    "options": [
      "It measures the physical diagonal width of the monitor in inches",
      "It dims or blocks the upper and lower portions of text, keeping a highlighted translucent horizontal band on the active line to prevent line skipping",
      "It changes the font from serif to italic",
      "It checks grammar and automatically submits assignments"
    ],
    "correct": 1,
    "explanation": "Reading rulers and line masks eliminate visual crowding by dimming adjacent paragraphs, allowing the reader's eye to stay anchored on the current line."
  },
  {
    "id": "qz-l-13",
    "cat": "cat-learning",
    "question": "What is \"Dysgraphia\" and which assistive tool provides the most direct classroom accommodation?",
    "options": [
      "A motor and cognitive difficulty with handwriting and organizing thoughts on paper; speech-to-text dictation and word prediction provide essential accommodations",
      "An inability to read road maps",
      "A severe stutter when speaking in public",
      "A sensitivity to fluorescent room lighting"
    ],
    "correct": 0,
    "explanation": "Dysgraphia affects fine-motor handwriting fluency and spatial spacing. Permitting digital keyboards, audio notes, and voice dictation removes the physical barrier."
  },
  {
    "id": "qz-l-14",
    "cat": "cat-learning",
    "question": "Why do specialized accessibility fonts like Lexend or OpenDyslexic incorporate bottom-heavy letter weighting and distinct apertures?",
    "options": [
      "To increase font file download sizes",
      "To give each letter a unique visual anchor and center of gravity, reducing accidental letter flips (like b/d/p/q) and word blurring",
      "To prevent search engines from indexing the document",
      "Because computer printers require heavy ink on the bottom"
    ],
    "correct": 1,
    "explanation": "Weighting the bottoms of glyphs gives them an apparent gravitational baseline, which helps the brain distinguish commonly rotated characters like \"p\", \"q\", \"b\", and \"d\"."
  },
  {
    "id": "qz-l-15",
    "cat": "cat-learning",
    "question": "Under the RPwD Act 2016 and CBSE guidelines in India, what accommodations are granted to students with Specific Learning Disabilities (SLD)?",
    "options": [
      "Exemption from taking any examinations",
      "Compensatory extra time (20 minutes per hour), permission for a scribe or reader, use of calculators, and alternative language options",
      "Mandatory transfer to isolated institutions",
      "Automatic 100% marks in mathematics"
    ],
    "correct": 1,
    "explanation": "The RPwD Act 2016 guarantees reasonable accommodation: Indian boards grant compensatory extra time, scribe/computer facility, and accommodations for spelling errors that do not alter meaning."
  },
  {
    "id": "qz-a-11",
    "cat": "cat-adhd",
    "question": "What is \"Time Blindness\" commonly experienced by individuals with ADHD?",
    "options": [
      "A medical eye disease that prevents reading digital clock faces",
      "Difficulty perceiving the passage of time or accurately estimating how long tasks will take, leading to chronic underestimation or hyperfocus time loss",
      "An inability to tell day from night",
      "A preference for working only at night"
    ],
    "correct": 1,
    "explanation": "Time blindness is an executive function difference in ADHD where the brain treats time as \"now\" or \"not now\", making duration estimation challenging without external visual timers."
  },
  {
    "id": "qz-a-12",
    "cat": "cat-adhd",
    "question": "How does a \"Visual Countdown Timer\" (e.g., Time Timer) assist individuals with ADHD more effectively than numeric digital clocks?",
    "options": [
      "It plays loud sirens every 30 seconds",
      "It represents remaining time as a shrinking colored disk or bar, translating an abstract numerical concept into a concrete visual cue",
      "It locks the computer until midnight",
      "It records audio memos secretly"
    ],
    "correct": 1,
    "explanation": "Visual timers show a diminishing colored arc. This concrete visual feedback stimulates self-monitoring and reduces anxiety without requiring mental math calculation."
  },
  {
    "id": "qz-a-13",
    "cat": "cat-adhd",
    "question": "What is the primary benefit of \"Focus Mode\" or \"Reader Mode\" on modern web browsers for users with ADHD?",
    "options": [
      "It strips away banner advertisements, autoplaying videos, animated sidebars, and cluttered headers, leaving only clean legible text",
      "It converts the page into audio only and shuts off the screen",
      "It blocks access to educational websites",
      "It automatically translates every page into Latin"
    ],
    "correct": 0,
    "explanation": "Cognitive overload and peripheral animations deplete ADHD dopamine and working memory. Reader view eliminates flashing sidebars and pop-ups, preserving focus."
  },
  {
    "id": "qz-a-14",
    "cat": "cat-adhd",
    "question": "What is \"Hyperfocus\" in ADHD and how can it best be balanced with daily deadlines?",
    "options": [
      "A complete lack of ability to concentrate on anything",
      "An intense state of deep absorption in an engaging activity, often managed using external alarms and transition checkpoints to avoid missing other priorities",
      "An eye vision condition where peripheral vision is enhanced",
      "A sudden burst of physical athletic running"
    ],
    "correct": 1,
    "explanation": "ADHD is not an absence of attention, but an inconsistency of attention regulation. Highly stimulating tasks can trigger deep hyperfocus, which benefits from gentle auditory or tactile alarms to bridge transitions."
  },
  {
    "id": "qz-a-15",
    "cat": "cat-adhd",
    "question": "What is \"Body Doubling\"—a popular and effective productivity strategy for ADHD?",
    "options": [
      "Hiring an actor to pretend to be you at work",
      "Working on tasks in the quiet physical or virtual presence of another person, providing passive accountability and grounding",
      "Exercising twice a day to reduce physical energy",
      "Printing duplicate copies of paper worksheets"
    ],
    "correct": 1,
    "explanation": "Body doubling creates gentle social accountability. Having a coworker, study partner, or virtual focus room participant nearby helps sustain focus on mundane tasks."
  },
  {
    "id": "qz-aut-11",
    "cat": "cat-autism",
    "question": "What is an Autistic \"Meltdown\" and how does it fundamentally differ from a temper tantrum?",
    "options": [
      "A deliberate behavioral tactic used to get treats",
      "An involuntary neurological response to intense sensory, emotional, or cognitive overwhelm where the nervous system is pushed past its capacity",
      "A mild headache caused by dehydration",
      "An intentional refusal to do homework"
    ],
    "correct": 1,
    "explanation": "Meltdowns are involuntary physiological cascades triggered by severe sensory or emotional overload, not goal-directed behavior. The person needs safety, reduced sensory input, and recovery time, not discipline."
  },
  {
    "id": "qz-aut-12",
    "cat": "cat-autism",
    "question": "What is an Autistic \"Shutdown\"?",
    "options": [
      "A deliberate computer reboot procedure",
      "An internalized response to sensory overload where the individual becomes non-verbal, unresponsive, or enters a deep withdrawal state to self-regulate",
      "A complete loss of physical hearing that requires surgery",
      "A temporary sleep disorder during daytime"
    ],
    "correct": 1,
    "explanation": "Shutdown is the internalized counterpart of a meltdown: communication shuts down, motor movements slow, and the person retreats inward to allow their nervous system to recover."
  },
  {
    "id": "qz-aut-13",
    "cat": "cat-autism",
    "question": "What is \"Stimming\" (self-stimulatory behavior) in neurodivergent individuals and why should it not be suppressed if safe?",
    "options": [
      "A harmful habit that should always be eliminated immediately",
      "Repetitive sensory-motor movements (e.g., rocking, hand-flapping, pacing, fidget toys) that help regulate the nervous system, release anxiety, and express joy",
      "A medical condition treated with antibiotic pills",
      "A refusal to participate in team sports"
    ],
    "correct": 1,
    "explanation": "Safe stimming is a healthy neurological coping mechanism that helps autistic people modulate overwhelming sensory inputs and manage emotional equilibrium."
  },
  {
    "id": "qz-aut-14",
    "cat": "cat-autism",
    "question": "Why are visual schedules and advance notices of routine changes crucial for autistic students and employees?",
    "options": [
      "Autistic people cannot read written text",
      "Predictability and structured timelines reduce anxiety caused by unexpected environmental surprises, allowing cognitive preparation for transitions",
      "Visual schedules are legally required by building construction codes",
      "To prevent people from arriving early to events"
    ],
    "correct": 1,
    "explanation": "Visual timelines and advance notice demystify ambiguous expectations, significantly reducing transition anxiety and executive functioning stress."
  },
  {
    "id": "qz-aut-15",
    "cat": "cat-autism",
    "question": "What is a \"Sensory Calm Room\" (or Quiet Space) in inclusive schools and workplaces?",
    "options": [
      "A punishment isolation cell for disruptive workers",
      "A designated low-stimulation environment with dimmable warm lighting, acoustic baffling, comfortable seating, and no loud machinery, where overwhelmed individuals can decompress",
      "A storage room for computer equipment",
      "A brightly lit gym with loud stereo speakers"
    ],
    "correct": 1,
    "explanation": "Sensory quiet spaces provide low sensory input (dim light, soft furniture, noise dampening) enabling neurodivergent individuals to reset their nervous systems and return to tasks productively."
  },
  {
    "id": "qz-mh-11",
    "cat": "cat-mental-health",
    "question": "What is the toll-free number for \"Tele-MANAS\"—the 24x7 National Tele Mental Health Programme of India launched by the Ministry of Health?",
    "options": [
      "100",
      "108",
      "14416 (or 1800-891-4416)",
      "1947"
    ],
    "correct": 2,
    "explanation": "Tele-MANAS provides 24/7 free, confidential psychological counselling in 20+ regional Indian languages via toll-free number 14416 or 1800-891-4416."
  },
  {
    "id": "qz-mh-12",
    "cat": "cat-mental-health",
    "question": "Under the Mental Healthcare Act 2017 (MHCA 2017) in India, what is an \"Advance Directive\"?",
    "options": [
      "A legal document where a person specifies in advance how they wish to be treated (and who should be their nominated representative) should they experience a severe mental health crisis",
      "A notice terminating an employee without benefits",
      "A court order forcing involuntary hospital stay",
      "A prescription for psychiatric medication"
    ],
    "correct": 0,
    "explanation": "Section 5 of MHCA 2017 empowers every adult to formulate an Advance Directive articulating their treatment preferences and care choices in case of future incapacitating mental illness."
  },
  {
    "id": "qz-mh-13",
    "cat": "cat-mental-health",
    "question": "In the 5-4-3-2-1 sensory grounding technique for panic attacks, what does the \"5\" stand for?",
    "options": [
      "Take 5 deep breaths without blinking",
      "Acknowledge 5 things you can see around you",
      "Call 5 close friends on the phone",
      "Count backwards from 5 to 0 loudly"
    ],
    "correct": 1,
    "explanation": "The 5-4-3-2-1 technique anchors panic: 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste, engaging physical senses to down-regulate the amygdala."
  },
  {
    "id": "qz-mh-14",
    "cat": "cat-mental-health",
    "question": "What is \"Box Breathing\" (Square Breathing) widely used for anxiety reduction and nervous system stabilization?",
    "options": [
      "Breathing inside a cardboard box for insulation",
      "A 4-part rhythmic pattern: Inhale for 4 seconds, Hold for 4 seconds, Exhale for 4 seconds, Hold empty for 4 seconds",
      "Rapid shallow panting for 60 seconds",
      "Holding your breath for as long as possible"
    ],
    "correct": 1,
    "explanation": "Box breathing (4-4-4-4) stimulates the vagus nerve and activates the parasympathetic nervous system, lowering heart rate and cortisol levels during acute stress."
  },
  {
    "id": "qz-mh-15",
    "cat": "cat-mental-health",
    "question": "Does the Rights of Persons with Disabilities (RPwD) Act 2016 include Mental Illness as a benchmark disability eligible for legal protection and reservation in India?",
    "options": [
      "No, the law only covers physical orthopedic conditions",
      "Yes, Mental Illness is explicitly recognized as one of the 21 specified benchmark disabilities under Section 2(s) of the RPwD Act 2016",
      "Only if diagnosed before the age of 5",
      "Only for government employees"
    ],
    "correct": 1,
    "explanation": "The RPwD Act 2016 formally expanded recognized disabilities from 7 to 21, explicitly incorporating Mental Illness as a benchmark disability entitled to non-discrimination and reasonable accommodation."
  }
];

  for (const q of quizData) {
    insertQuiz.run(q.id, q.cat, q.question, JSON.stringify(q.options), q.correct, q.explanation);
  }

  // 5. Seed Media Items with real captioned sources and placeholder indicators
  const insertMedia = db.prepare(`
    INSERT INTO media (id, category_id, type, url, title, alt_text, caption, transcript, source_credit)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // 1. Visual Impairment
  insertMedia.run(
    'med-vis-1',
    'cat-visual',
    'video',
    'https://www.youtube-nocookie.com/embed/g6j8FmHjG1E',
    'How a Blind Person Uses a Screen Reader and Smartphone',
    'Demonstration of a smartphone using VoiceOver screen reader at high speech rate with gestural navigation.',
    'Screen readers speak on-screen elements aloud and support gestural swipes for navigation.',
    'Transcript: The presenter explains how accessibility gestures work on modern touchscreens and demonstrates navigating apps using synthesized speech feedback.',
    'Tommy Edison Experience / Accessible Tech Channel'
  );

  // 2. Hearing Impairment
  insertMedia.run(
    'med-hear-1',
    'cat-hearing',
    'video',
    'https://www.youtube-nocookie.com/embed/d3e23N_p84w',
    'Basic Indian Sign Language (ISL) Conversational Phrases',
    'Instructor demonstrating standard Indian Sign Language handshapes and expressions for Namaste, Thank You, and How are you.',
    'Learn fundamental ISL greetings and finger signs developed by ISLRTC.',
    'Transcript: Instructor signs greeting: Namaste (hands joined), Aap kaise hain (pointing and open gesture), Shukriya (palm moving forward with slight bow).',
    'ISLRTC Government of India'
  );

  // 3. Mobility & Physical
  insertMedia.run(
    'med-mob-1',
    'cat-mobility',
    'video',
    'https://www.youtube-nocookie.com/embed/94r_Y8b7E6k',
    'Assistive Gaming and Adaptive Controllers in Action',
    'User playing a video game using the Xbox Adaptive Controller connected to large button switches and foot pedals.',
    'Adaptive switch interfaces allow custom mapping for different motor capabilities.',
    'Transcript: The video demonstrates connecting large external arcade buttons, sip-and-puff straws, and foot switches to control digital interfaces without fine hand grasping.',
    'Microsoft Inclusive Tech Lab'
  );

  // 4. Speech & Language Impairment
  insertMedia.run(
    'med-speech-1',
    'cat-speech',
    'video',
    'https://www.youtube-nocookie.com/embed/gZ9cZ4nS8nI',
    'How AAC Communication Devices Work in Everyday Life',
    'Non-verbal communicator selecting words and pictograms on an AAC speech generating tablet to hold fluent conversations.',
    'Augmentative and Alternative Communication (AAC) gives a natural voice to non-speaking children and adults.',
    'Transcript: The presenter demonstrates selecting core vocabulary words on an AAC grid, generating synthesized speech, and conversing seamlessly with peers in educational and social settings.',
    'Communication Matters / AssistiveWare'
  );

  // 5. Learning Disabilities & Dyslexia
  insertMedia.run(
    'med-learn-1',
    'cat-learning',
    'video',
    'https://www.youtube-nocookie.com/embed/zafiGBrFkRM',
    'What is Dyslexia and How Assistive Technology Empowers Readers?',
    'Educational animation illustrating how phonological processing differences affect reading, and how text-to-speech tools bridge the gap.',
    'Dyslexia is a neurobiological difference; assistive readers and audiobooks enable students to excel academically.',
    'Transcript: Kelli Sandman-Hurley explains the neurobiology of dyslexia, debunking letter-reversal myths and highlighting the vital role of multisensory structured language tools.',
    'TED-Ed'
  );

  // 6. ADHD & Focus
  insertMedia.run(
    'med-adhd-1',
    'cat-adhd',
    'video',
    'https://www.youtube-nocookie.com/embed/jhcn1_qsYmg',
    'How ADHD Affects Executive Function and Focus in Daily Life',
    'Visual guide illustrating executive dysfunction, working memory challenges, and the power of clutter-free focus tools.',
    'Understanding dopamine regulation in ADHD helps design calm, distraction-free digital environments.',
    'Transcript: Jessica McCabe illustrates how executive functions act like the conductor of a brain orchestra, and how external visual timers and structured checklists restore control.',
    'How to ADHD'
  );

  // 7. Autism Spectrum
  insertMedia.run(
    'med-autism-1',
    'cat-autism',
    'video',
    'https://www.youtube-nocookie.com/embed/aPknwW8m6Po',
    'Can You Make It To The End? Autism Sensory Overload Experience',
    'First-person sensory perspective inside a crowded shopping mall illustrating visual glare, loud overlapping noises, and cognitive overwhelm.',
    'Experiencing how sensory sensitivities can lead to overload highlights the critical need for calm sensory spaces.',
    'Transcript: First-person visual journey showing overwhelming fluorescent light flickers, loud escalator rumblings, and sensory input accumulation that triggers autistic shutdown.',
    'National Autistic Society UK'
  );

  // 8. Mental Health & Well-being
  insertMedia.run(
    'med-mental-1',
    'cat-mental-health',
    'video',
    'https://www.youtube-nocookie.com/embed/1vph8_KZZoM',
    'The 5-4-3-2-1 Coping Technique for Anxiety and Panic Attacks',
    'Mental health clinician explaining the physiological basis of panic and demonstrating the 5-4-3-2-1 sensory grounding technique.',
    'Sensory grounding engages physical perception to down-regulate the nervous system during acute anxiety.',
    'Transcript: Clinician guides viewers through identifying 5 things they can see, 4 they can touch, 3 they can hear, 2 they can smell, and 1 they can taste, grounding attention away from catastrophic thoughts.',
    'Therapy in a Nutshell / NIMHANS Clinical Resources'
  );

  // 6. Seed Default AAC Items (Picture symbols for non-verbal speech)
  const insertAAC = db.prepare(`
    INSERT INTO aac_items (id, user_id, label, symbol_icon, audio_phrase, category_group, display_order)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const aacDefaultItems = [
    { id: 'aac-1', label: 'Yes', icon: 'CheckCircle', phrase: 'Yes, I agree.', group: 'Basics', order: 1 },
    { id: 'aac-2', label: 'No', icon: 'XCircle', phrase: 'No, thank you.', group: 'Basics', order: 2 },
    { id: 'aac-3', label: 'Please', icon: 'Heart', phrase: 'Please help me.', group: 'Basics', order: 3 },
    { id: 'aac-4', label: 'Thank You', icon: 'Smile', phrase: 'Thank you very much.', group: 'Basics', order: 4 },
    { id: 'aac-5', label: 'Water', icon: 'Droplets', phrase: 'I would like a glass of water, please.', group: 'Needs', order: 5 },
    { id: 'aac-6', label: 'Food / Hungry', icon: 'Utensils', phrase: 'I am hungry and need something to eat.', group: 'Needs', order: 6 },
    { id: 'aac-7', label: 'Restroom', icon: 'DoorOpen', phrase: 'I need to use the restroom.', group: 'Needs', order: 7 },
    { id: 'aac-8', label: 'Pain / Hurt', icon: 'AlertTriangle', phrase: 'I am in pain. Please assist me.', group: 'Emergency', order: 8 },
    { id: 'aac-9', label: 'Call Family', icon: 'Phone', phrase: 'Please call my emergency family contact.', group: 'Emergency', order: 9 },
    { id: 'aac-10', label: 'Quiet Space', icon: 'VolumeX', phrase: 'I feel overwhelmed. I need a quiet, calm place.', group: 'Feelings', order: 10 }
  ];

  for (const item of aacDefaultItems) {
    insertAAC.run(item.id, null, item.label, item.icon, item.phrase, item.group, item.order);
  }

  console.log('Database seeded successfully with users, 8 categories, 8-section content blocks, quizzes, media, and AAC symbols!');
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
