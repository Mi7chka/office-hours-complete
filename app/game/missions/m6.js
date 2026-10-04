/* Save Greenline · mission 6, the story around week 6's tool (The pipeline board).
   The format and the rules for the words are in GAME.md. Everything here is made up. */
if (window.OH && OH.game && OH.game.mission) OH.game.mission({
  week: 6,
  title: "The six leads nobody called back",
  badge: { name: "Loop Closer", icon: "☰" },
  briefer: "Jordan",
  scene: [
    "The posts are going out again, and new people are getting in touch. Good. Now look at what happens to them. It is Wednesday, November 11, and of the ten leads on Greenline's list, six have gone quiet.",
    "Greg Tanaka has had a written quote for his stone walkway since October 16, and nobody has followed up. Renee Dubois left a voicemail eight days ago. Priya Raman sent her, which makes the silence worse.",
    "Nobody decided to ignore these people. Jordan got busy, and a lead with no next step and no date is easy to forget. An AI can draft the follow-ups from the notes. Not every draft deserves to go out."
  ],
  stakes: "Leave it, and six people take the silence as a no and call someone else.",
  quiz: [
    { q: "Where should a small business keep its leads?",
      options: ["In one list that somebody opens every working day", "Wherever they came in: texts, email, sticky notes", "In the biggest CRM on the market"], answer: 0,
      why: "A pipeline is one list, and a sheet somebody updates beats a CRM nobody does." },
    { q: "What does every open lead need?",
      options: ["A discount", "A second quote", "A next step and a date"], answer: 2,
      why: "If either one is blank, that lead is already going quiet." },
    { q: "A lead tells you no. What now?",
      options: ["Send the quote again next week", "Thank them, close the lead, and stop", "Keep them open, in case they change their mind"], answer: 1,
      why: "A no closes the loop, so thank them and stop: won and lost are both finished." }
  ],
  reward: { hours: 1, leads: 6, money: 0 },
  debrief: [
    "Six leads were quiet and now none are: the no is closed, every open lead has a next step and a date, and no bad draft went out.",
    "Tonight: put every open lead in one sheet, give each a next step and a date, and send the oldest follow-up yourself."
  ],
  next: "Next: October's totals are in. They do not agree, and nobody knows why."
});
