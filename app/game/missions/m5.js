/* Save Greenline · mission 5, the story around week 5's tool (One idea, five pieces).
   The format and the rules for the words are in GAME.md. Everything here is made up. */
if (window.OH && OH.game && OH.game.mission) OH.game.mission({
  week: 5,
  title: "The marketing that quits on busy weeks",
  badge: { name: "Idea Stretcher", icon: "✎" },
  briefer: "Jordan",
  scene: [
    "People can find Greenline now. Scroll back through what they find: a good post about mulch in early October, then two weeks of nothing. That was the fall rush. Jordan was out on a crew, and the marketing stopped, the way it does every time the real work shows up.",
    "On Tuesday a customer, Priya Raman, asked Jordan on the phone whether it is too late to plant shrubs this fall. Jordan gave her a good answer. That one answer is a week of marketing, and right now it lives in a phone call nobody else heard.",
    "An AI can turn that answer into five pieces in a minute, in Jordan's own voice. Whether every line in them is true is a different question, and that one is yours."
  ],
  stakes: "Leave it, and Greenline goes silent every time the work picks up.",
  quiz: [
    { q: "Where does a week of marketing come from?",
      options: ["A new idea for every post", "One real lesson from your week, said five ways", "Whatever everyone else is posting"], answer: 1,
      why: "One real lesson, said five ways, still goes out on a busy week, and each customer only sees the piece that reached them." },
    { q: "The AI hands you five pieces. What do you ask it next?",
      options: ["Which one is the weakest?", "Are these good?", "Can you make them all longer?"], answer: 0,
      why: "Asking which one is weakest sends it back to check each piece against your facts, and gives you one piece to fix." },
    { q: "A piece is scheduled to post on Thursday. Is it approved?",
      options: ["Yes. Scheduling is approving", "Yes, as long as the AI checked it", "Not until a person has read the whole piece and said yes"], answer: 2,
      why: "It drafts, you approve, then it posts, and scheduling is not approving." }
  ],
  reward: { hours: 2, leads: 0, money: 0 },
  debrief: [
    "One customer question became five pieces, and the promise Jordan never made did not get out the door.",
    "This week: write down one question a customer asked you, run the same prompt on it, and approve one piece yourself."
  ],
  next: "Next: new people got in touch. Six of them are still waiting to hear back."
});
