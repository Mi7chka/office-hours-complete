/* Save Greenline · mission 2, the story around week 2's tool (Lead form to follow-up).
   The format and the rules for the words are in GAME.md. Everything here is made up. */
if (window.OH && OH.game && OH.game.mission) OH.game.mission({
  week: 2,
  title: "The lead that waited all night",
  badge: { name: "Lead Catcher", icon: "⇄" },
  briefer: "Jordan",
  scene: [
    "It is a little after 9 PM. Tomas has half an acre of oak leaves and one question, so he fills out the quote form on Greenline's website. Jordan has been up since five and is done for the day. Nobody will see it tonight.",
    "You open the leads sheet to see where his request will land. Hannah Brandt asked for weekly mowing on Monday evening, heard nothing, and asked again on Tuesday morning. Owen Fitzgerald has been waiting since last Thursday. One row is a sales pitch from the Rank Booster Team.",
    "Nobody at Greenline is lazy. The form works and the sheet works. The leads just sit there until a person happens to look."
  ],
  stakes: "Leave it, and Tomas hires whoever answers first.",
  quiz: [
    { q: "Every automation has three parts. When this happens, do that, and what?",
      options: ["Do it again, to be safe", "Send it straight to the customer", "Tell me"], answer: 2,
      why: "The notice to a person is the check, so quiet never means broken." },
    { q: "The quote form can email the owner about every new lead. It is a setting nobody turned on. Which level is that?",
      options: ["Level 1: built in", "Level 2: a connector", "Level 3: custom built"], answer: 0,
      why: "A feature inside an app you already pay for is level 1, and you start at the lowest level that does the job." },
    { q: "The AI has drafted a reply to a customer. What happens next?",
      options: ["It sends itself, to save time", "A person reads it, then sends it", "It waits an hour, then sends itself"], answer: 1,
      why: "Automate the carrying and keep the judgment: it drafts, you send." }
  ],
  reward: { hours: 2, leads: 1, money: 0 },
  debrief: [
    "One lead went from the form to a row, a notice and a checked draft, and nobody retyped a word. Nothing went out until you had read it.",
    "Tonight: fill out your own website form as a made-up customer and time the gap."
  ],
  next: "Next: Greenline's home page gets three seconds. It spends them saying welcome."
});
