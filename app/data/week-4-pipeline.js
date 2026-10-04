/* Week 4 sample data: the clients and deals of a made-up company, and three message templates.
   No real people. Dates are counted from today, so the quiet deals are always quiet. */
window.OH_SAMPLE = window.OH_SAMPLE || {}; window.OH_SAMPLE.cc = window.OH_SAMPLE.cc || {};
window.OH_SAMPLE.cc.deals = [
  { id: "D1", client: "Marcus Oyelaran", contact: "Marcus Oyelaran", email: "marcus.oyelaran@example.com", phone: "555-0142", what: "Paver patio and planting along the fence", stage: "New",
    next_step: "Offer two weekend times for a site visit", next_date: OH.day(0), last_touch: OH.day(-1), source: "Website form", notes: "Just bought the house. About 300 square feet. Weekends are best." },
  { id: "D2", client: "Hartwell Dental", contact: "Nina Hartwell", email: "nina@hartwell-dental.example.com", phone: "555-0117", what: "Weekly lawn care for the office", stage: "Quoted",
    next_step: "Call to ask if the quote answers their questions", next_date: OH.day(-3), last_touch: OH.day(-10), source: "Referral", notes: "Quote sent. Nina asked whether the work could start in spring." },
  { id: "D3", client: "Priya Raman", contact: "Priya Raman", email: "priya.raman@example.com", phone: "555-0126", what: "Fall cleanup and leaf removal", stage: "Quoted",
    next_step: "", next_date: "", last_touch: OH.day(-12), source: "Repeat customer", notes: "Liked last year's cleanup. Wants a date before the first frost." },
  { id: "D4", client: "Cedar Hollow Library", contact: "Owen Banks", email: "owen.banks@cedarhollow-library.example.org", phone: "555-0133", what: "New beds by the front entrance", stage: "Site visit",
    next_step: "Walk the site with Owen", next_date: OH.day(2), last_touch: OH.day(-2), source: "Phone call", notes: "The board meets on the first Monday. They need a quote before then." },
  { id: "D5", client: "Tessa Alvarez", contact: "Tessa Alvarez", email: "tessa.alvarez@example.com", phone: "555-0109", what: "Sprinkler repair", stage: "Won",
    next_step: "Put the job on the crew calendar", next_date: OH.day(1), last_touch: OH.day(0), source: "Referral", notes: "Said yes by phone." },
  { id: "D6", client: "Ben Kowalski", contact: "Ben Kowalski", email: "ben.kowalski@example.com", phone: "555-0151", what: "Retaining wall", stage: "Lost",
    next_step: "", next_date: "", last_touch: OH.day(-20), source: "Website form", notes: "Went with another company. Said our start date was too far out." },
  { id: "D7", client: "Maple Court Homeowners", contact: "Gloria Stein", email: "gloria@maplecourt.example.org", phone: "555-0164", what: "Common area mowing for the season", stage: "Quoted",
    next_step: "Follow up a second time", next_date: OH.day(-8), last_touch: OH.day(-15), source: "Website form", notes: "No answer to the first follow-up. Gloria prefers a phone call." },
  { id: "D8", client: "Ruth Delgado", contact: "Ruth Delgado", email: "ruth.delgado@example.com", phone: "555-0172", what: "Hedge trimming twice a year", stage: "New",
    next_step: "Call back with two dates", next_date: OH.day(1), last_touch: OH.day(0), source: "Google Business Profile", notes: "Found us through a search. Hedges along the driveway." }
];
/* Message templates. Drafts only: the page fills in the names and copies. A person sends. */
window.OH_SAMPLE.cc.templates = [
  { id: "first", name: "First follow-up", text: "Hi {first}, I wanted to make sure my note about {what} reached you and answered your questions. Is there anything you would like changed? I am happy to talk it through.\n{owner}, {business}" },
  { id: "second", name: "Second nudge", text: "Hi {first}, I am checking in once more about {what}. If the timing is not right, just say so and I will check back when it suits you.\n{owner}, {business}" },
  { id: "last", name: "The polite last note", text: "Hi {first}, I have not heard back about {what}, so I will close this out on my side for now. If it comes back up, reply to this note and I will pick it up from here. Thank you for thinking of us.\n{owner}, {business}" }
];
