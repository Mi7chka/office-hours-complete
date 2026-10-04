/* Save Greenline · mission 4, the story around week 4's tool (The get-found checks).
   The format and the rules for the words are in GAME.md. Everything here is made up. */
if (window.OH && OH.game && OH.game.mission) OH.game.mission({
  week: 4,
  title: "The company nobody can find",
  badge: { name: "On the Map", icon: "⌕" },
  briefer: "Jordan",
  scene: [
    "The new home page passes the three-second test. Almost nobody is taking it. You search for a patio builder in Cedar Hollow, the way a stranger would, and Greenline is not on the first screen.",
    "You look at what a search engine has to work with. The patio page is titled Services. Its description is empty. The text says Greenline does it all and never names a town.",
    "Then you ask an AI assistant who builds patios in Cedar Hollow. Greenline is not in the answer. An assistant can only repeat what it can read, and there is nothing here to read."
  ],
  stakes: "Leave it, and every patio in Cedar Hollow goes to a company that is easier to find.",
  quiz: [
    { q: "A stranger wants a patio. What do they type into Google?",
      options: ["Greenline Landscaping", "premium outdoor living experiences", "paver patios Cedar Hollow"], answer: 2,
      why: "A stranger searches what you sell plus the town, not a name they have never heard." },
    { q: "An AI assistant gets a fact about your business wrong. What do you do?",
      options: ["Argue with it until it agrees", "Fix the page or listing it read, then check again", "Nothing. It will correct itself"], answer: 1,
      why: "Assistants repeat what they can read, so you correct the source and look again in a few weeks." },
    { q: "The Rank Booster Team is back: first place on Google, guaranteed. What do you tell them?",
      options: ["No. Nobody can promise the first position", "Yes, if it is quick", "Yes, but only for the patio page"], answer: 0,
      why: "Nobody can promise that spot, so put the effort into clear pages, a true listing and real reviews." }
  ],
  reward: { hours: 1, leads: 3, money: 0 },
  debrief: [
    "A page titled Services now names the service and the town, and no line goes on the site until it matches the facts.",
    "This week: search what you sell plus your town, then ask an AI assistant the same question."
  ],
  next: "Next: the marketing stops whenever Jordan gets busy. One idea, a week of posts."
});
