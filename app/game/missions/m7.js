/* Save Greenline · mission 7, the story around week 7's tool (From a messy export to one screen).
   The format and the rules for the words are in GAME.md. Everything here is made up. */
if (window.OH && OH.game && OH.game.mission) OH.game.mission({
  week: 7,
  title: "The case of the extra 385 dollars",
  badge: { name: "Gap Finder", icon: "▦" },
  briefer: "Jordan",
  scene: [
    "The leads are moving and October is over, so Jordan asks a simple question: how did we do? The jobs export has thirty rows, and its amount column adds up to 27,040.",
    "Jordan does not trust that number. Good instinct. These rows were typed in a hurry, between jobs. Somewhere in there is a mistake, and November is about to be planned on top of it.",
    "A screen built on bad rows is a confident lie. So before any chart: find what is wrong, change no amount, and explain every dollar between the old total and the new one."
  ],
  stakes: "Leave it, and Jordan plans November on a number that is not true.",
  quiz: [
    { q: "Two places disagree about a customer's phone number. Which one wins?",
      options: ["The one you edited last", "Whichever looks more complete", "The one you chose as its home. Everything else is a copy"], answer: 2,
      why: "One home per thing: when two places disagree, the home wins and the rest are copies." },
    { q: "You clean up a list and the total changes. What do you do before you build on it?",
      options: ["Use the smaller total, to be safe", "Explain every dollar of the gap", "Split the difference"], answer: 1,
      why: "Check the total before and after, and if you cannot explain the gap, stop and build nothing." },
    { q: "Money that came in, your best guess, and what you hope to sign. How do they go on one screen?",
      options: ["In three boxes, each with its own label", "Added up into one big number", "Only the biggest one"], answer: 0,
      why: "Measured, estimated and projected are three kinds of number, and adding them makes one big number that means nothing." }
  ],
  reward: { hours: 1, leads: 0, money: 8775 },
  debrief: [
    "27,040 became 26,655, the gap of 385 is one job typed twice, and the one screen shows 8,775 still unpaid, most of it one patio.",
    "This week: export one list from an app you already pay for, work on a copy, and check the total before and after you clean it."
  ],
  next: "Next: Friday, 4:41 PM. The card reader dies with a customer waiting."
});
