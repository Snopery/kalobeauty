/* ==========================================================
   KALOBEAUTY  -  EDIT THIS FILE to change what the site shows.
   See README.md for a step-by-step guide.
   ========================================================== */
window.KALO = {

  /* Your Acuity booking page (the "Book now" buttons open this) */
  bookUrl: 'https://kalobeauty.as.me/schedule/e03f0241/category/X19hbGxfXw%3D%3D',

  /* Calendar number from your Acuity links. Only change if you add a second calendar. */
  calendarId: '7815696',

  /* ---------- CATEGORIES (the pill buttons) ----------
     id    : a short word with no spaces, used by services below
     label : what customers see on the button
     note  : small line shown under the tiles
     Buttons appear in this order. */
  categories: [
    { id: 'lash', label: 'Lashes',      note: 'Refills depend on lash growth.' },
    { id: 'lift', label: 'Lifts',       note: 'A lift lasts 6 to 8 weeks.' },
    { id: 'brow', label: 'Brows',       note: 'Brow services include mapping and sculpting.' },
    { id: 'new',  label: 'New clients', note: 'Bundles are for first-time clients.' }
  ],

  /* ---------- SERVICES (the tiles) ----------
     id            : unique short name, no spaces
     category      : one of the category ids above
     appointmentId : the number in the Acuity link for that service
                     (.../appointment/51297509/calendar/... -> 51297509)
     short         : short name shown under the tile
     name          : full name shown in the big preview
     time, price   : shown on the tile and preview
     tag           : optional badge on the preview (e.g. 'Most popular'), or ''
     description   : text in the preview
     image         : file name inside the images/ folder (e.g. 'volume.jpg'),
                     or '' to show a drawn icon instead
     icon          : used only when image is ''. Choose from:
                     default, refill, removal, tint, liftext, liftbrow,
                     browwax, lipwax, chinwax, sidewax
     Tiles appear in the order listed. */
  services: [
    { id: 'glam-wispy', category: 'lash', appointmentId: 51297509, short: 'Glam wispy', name: 'Glam wispy', time: '2 hours', price: 'A$190', tag: 'Most popular',
      description: 'A balance of dramatic impact and glam volume, for a beautifully defined look.', image: 'glam-wispy.jpg', icon: 'default' },
    { id: 'light-wispy', category: 'lash', appointmentId: 51297404, short: 'Light wispy', name: 'Light wispy', time: '2 hours', price: 'A$170', tag: '',
      description: 'A subtle enhancement that gives your natural lashes a soft, dreamy finish. Elegant and effortless.', image: 'light-wispy.jpg', icon: 'default' },
    { id: 'volume', category: 'lash', appointmentId: 40463467, short: 'Volume', name: 'Volume', time: '2 hours', price: 'A$170', tag: '',
      description: 'A uniform finish of extensions. Request a natural, medium or glam volume finish.', image: 'volume.jpg', icon: 'default' },
    { id: 'refill-60', category: 'lash', appointmentId: 52879076, short: '60 min refill', name: '60 minute lash refill', time: '1 hour', price: 'A$110', tag: '',
      description: 'Suitable if you have about 2 weeks of lash growth.', image: '', icon: 'refill' },
    { id: 'refill-75', category: 'lash', appointmentId: 52879258, short: '75 min refill', name: '75 minute lash refill', time: '1 hour 15 minutes', price: 'A$120', tag: '',
      description: 'Suitable if you have about 2.5 weeks of lash growth.', image: '', icon: 'refill' },
    { id: 'refill-90', category: 'lash', appointmentId: 40918257, short: '90 min refill', name: '90 minute lash refill', time: '1 hour 30 minutes', price: 'A$130', tag: '',
      description: 'Suitable if you have about 3 weeks of lash growth.', image: '', icon: 'refill' },
    { id: 'foreign', category: 'lash', appointmentId: 94051998, short: 'Foreign refill', name: 'Foreign refill', time: '1 hour 30 minutes', price: 'A$130', tag: '',
      description: 'For lash extensions applied at another salon. We assess your current set first, then refill it for a balanced result.', image: '', icon: 'refill' },
    { id: 'removal', category: 'lash', appointmentId: 40918287, short: 'Removal', name: 'Extension removal', time: '35 minutes', price: 'A$30', tag: '',
      description: 'Taking a break from extensions? We remove them so your natural lashes are freshened up.', image: '', icon: 'removal' },

    { id: 'korean-lift', category: 'lift', appointmentId: 94313022, short: 'Lash lift + tint', name: 'Korean lash lift and tint', time: '1 hour 15 minutes', price: 'A$130', tag: '',
      description: 'Lifts and enhances your natural lashes with a glossy, low-maintenance finish. Lasts about 6 to 8 weeks, which is the natural lash cycle.', image: 'korean-lift.jpg', icon: 'default' },
    { id: 'lift-ext', category: 'lift', appointmentId: 95268319, short: 'Lift + extensions', name: 'Korean lash lift and extensions', time: '3 hours', price: 'A$170', tag: 'Signature',
      description: 'Our signature combination. A nourishing Korean lash lift, then custom extensions for added fullness and length. The balance of natural and glamorous.', image: '', icon: 'liftext' },
    { id: 'tint', category: 'lift', appointmentId: 77654176, short: 'Lash tint', name: 'Eyelash tint only', time: '20 minutes', price: 'A$30', tag: '',
      description: 'Long-lasting colour for a defined, mascara-free look.', image: '', icon: 'tint' },

    { id: 'wax-dye', category: 'brow', appointmentId: 86957063, short: 'Wax + dye', name: 'Eyebrow sculpt wax and hybrid dye', time: '50 minutes', price: 'A$60', tag: '',
      description: 'Hybrid dye gives a deeper, more defined brow. It lasts up to 2 weeks on the skin and about 6 weeks on the hair.', image: 'wax-dye.jpg', icon: 'default' },
    { id: 'dye', category: 'brow', appointmentId: 86957037, short: 'Dye only', name: 'Hybrid dye only', time: '35 minutes', price: 'A$50', tag: '',
      description: 'Hybrid dye tints both the skin and the hair. Results last up to 2 weeks on the skin and about 6 weeks on the hair.', image: 'dye.jpg', icon: 'default' },
    { id: 'wax', category: 'brow', appointmentId: 55862425, short: 'Brow wax', name: 'Eyebrow wax only', time: '35 minutes', price: 'A$35', tag: '',
      description: 'Strip or hard wax, depending on the client. Further wax add-ons are available.', image: '', icon: 'browwax' },
    { id: 'lip', category: 'brow', appointmentId: 77655042, short: 'Lip wax', name: 'Lip wax', time: '10 minutes', price: 'A$10', tag: '',
      description: 'A quick add-on service. Book online to choose a time that suits you.', image: '', icon: 'lipwax' },
    { id: 'chin', category: 'brow', appointmentId: 86957317, short: 'Chin wax', name: 'Chin wax', time: '10 minutes', price: 'A$10', tag: '',
      description: 'A quick add-on service. Book online to choose a time that suits you.', image: '', icon: 'chinwax' },
    { id: 'sideburn', category: 'brow', appointmentId: 86957336, short: 'Sideburn wax', name: 'Sideburn wax', time: '15 minutes', price: 'A$15', tag: '',
      description: 'A quick add-on service. Book online to choose a time that suits you.', image: '', icon: 'sidewax' },

    { id: 'bundle-lash', category: 'new', appointmentId: 95163328, short: 'Lashes + brows', name: 'Any lash extension set with eyebrow sculpt, wax and dye', time: '2 hours 45 minutes', price: 'A$210', tag: 'New clients only',
      description: 'Our luxury lash extension set paired with the signature eyebrow sculpt and dye, tailored to your natural features.', image: 'bundle-lash.jpg', icon: 'default' },
    { id: 'bundle-lift', category: 'new', appointmentId: 95163439, short: 'Lift + brows', name: 'Korean lash lift and tint with eyebrow sculpt, wax and dye', time: '1 hour 55 minutes', price: 'A$150', tag: 'New clients only',
      description: 'The signature Korean lash lift and tint, completed with a luxury eyebrow sculpt, wax and dye.', image: '', icon: 'liftbrow' }
  ],

  /* ---------- REFILL GUIDE (the "Which refill do you need?" section) ----------
     label   : button text
     service : id of a service above (its price, time and booking link are used)
     note    : sentence shown in the result card
     Set refillGuide to null to hide the whole section. */
  refillGuide: {
    title: 'Which lash refill do you need?',
    question: 'How much growth since your last set?',
    options: [
      { label: 'About 2 weeks',   service: 'refill-60', note: 'For about 2 weeks of lash growth.' },
      { label: 'About 2.5 weeks', service: 'refill-75', note: 'For about 2.5 weeks of lash growth.' },
      { label: 'About 3 weeks',   service: 'refill-90', note: 'For about 3 weeks of lash growth.' },
      { label: 'Another salon',   service: 'foreign',   note: 'We assess your current set and refill it for a seamless, balanced result.' }
    ]
  }
};
