/* Save Greenline · mission 3, the story around week 3's tool (The 3-second home page test).
   The format and the rules for the words are in GAME.md. Everything here is made up. */
if (window.OH && OH.game && OH.game.mission) OH.game.mission({
  week: 3,
  title: "The home page that says nothing",
  badge: { name: "Three-Second Pass", icon: "◷" },
  briefer: "Jordan",
  scene: [
    "The leads sheet is quiet today, and not in the good way. You open Greenline's home page on your phone, the way a homeowner in Cedar Hollow would, and count to three.",
    "Three seconds later you look away. You remember a welcome, something about family, and the word quality. You do not remember what the company does, and you work here.",
    "Nothing on the page is false. Jordan is proud of it. A stranger with a thumb on the back button is less patient."
  ],
  stakes: "Leave it, and visitors leave before they learn what Greenline does.",
  quiz: [
    { q: "A visitor lands on your home page. What are they asking before they scroll?",
      options: ["When was this company founded?", "What do you do, is it for me, what do I do next?", "What are the mission and the values?"], answer: 1,
      why: "Your history is a good second screen and a poor first one." },
    { q: "Which headline passes the three-second test?",
      options: ["Welcome to Our Website", "Quality. Integrity. Service.", "Roof repair for Maple Hill homeowners"], answer: 2,
      why: "A headline that passes says what you do, who it is for and where, in a customer's words." },
    { q: "The AI's headline mentions an award. You never gave it one. What do you do?",
      options: ["Cut it. Real proof, or none", "Keep it. It sounds good", "Keep it, but make the award smaller"], answer: 0,
      why: "It drafts and you publish, so anything you did not give it is something it made up." }
  ],
  reward: { hours: 0, leads: 2, money: 0 },
  debrief: [
    "The first screen went from a welcome to what Greenline does, who it is for and where, with one button.",
    "Tonight: hand your phone to someone for three seconds, then ask them what your business does."
  ],
  next: "Next: the home page is clear. Nobody searching for a patio can find it."
});
