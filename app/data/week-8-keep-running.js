/* Week 8 sample data: the knowledge page, the owner's own numbers, the backup record and the
   90-day roadmap of a made-up company. No real people. Every number here is a story number. */
window.OH_SAMPLE = window.OH_SAMPLE || {}; window.OH_SAMPLE.cc = window.OH_SAMPLE.cc || {};
window.OH_SAMPLE.cc.knowledge = {
  voice: "Friendly and direct, like talking over the fence. Short sentences. We say sorry plainly when we get it wrong. No slogans and no exclamation points.",
  facts: "Greenline Landscaping, Cedar Hollow. Owner: Jordan Reyes. Crew lead: Luis. Phone: 555-0100. The crew leaves the yard at 7:30. We never quote a price before a site visit, and we never promise a date the crew has not agreed to.",
  services: "Weekly lawn care\nSpring and fall cleanups\nHedge and shrub trimming\nPlanting and garden beds\nPaver patios and walks\nSprinkler repair"
};
/* Numbers the owner typed in. Each says what kind it is and how it was made. */
window.OH_SAMPLE.cc.numbers = [
  { id: "N1", kind: "estimated", label: "Hours a week the command center saves Jordan", value: "4", how: "Jordan's own guess after two weeks. Not timed." },
  { id: "N2", kind: "estimated", label: "Quotes that turn into jobs", value: "About 1 in 3", how: "From memory. The pipeline will measure it once more deals close." },
  { id: "N3", kind: "projected", label: "Leaf cleanups in November", value: "12", how: "Ten last November, plus the two already booked. A plan, not a fact." },
  { id: "N4", kind: "projected", label: "Posts in the next 30 days", value: "8", how: "Two a week on the content calendar." }
];
window.OH_SAMPLE.cc.backup = { last: OH.day(-9), restored: "", copies: { computer: true, drive: true, away: false } };
window.OH_SAMPLE.cc.roadmap = [
  { id: "R1", days: 30, how: "build", done: false, what: "Run plan my day every morning for two weeks" },
  { id: "R2", days: 30, how: "build", done: false, what: "Bring last quarter's quotes into the pipeline" },
  { id: "R3", days: 30, how: "build", done: true, what: "Restore one file from the backup on purpose" },
  { id: "R4", days: 60, how: "build", done: false, what: "Add a page for the crew schedule" },
  { id: "R5", days: 60, how: "hire", done: false, what: "Website inquiries that land in the pipeline by themselves" },
  { id: "R6", days: 90, how: "hire", done: false, what: "An Email agent that reviews the inbox morning and afternoon" },
  { id: "R7", days: 90, how: "hire", done: false, what: "Sign-in for Luis, so the crew lead sees the board" }
];
