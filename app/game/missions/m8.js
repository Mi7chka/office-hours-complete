/* Save Greenline · mission 8, the finale: the story around week 8's tool (The when-it-breaks sheet and your 90-day plan).
   The format and the rules for the words are in GAME.md. Everything here is made up. The last mission has no `next`. */
if (window.OH && OH.game && OH.game.mission) OH.game.mission({
  week: 8,
  title: "The Friday the card reader died",
  badge: { name: "The Calm One", icon: "✚" },
  briefer: "Jordan",
  scene: [
    "The numbers agree, the leads have dates, and the posts go out on schedule. Then it is Friday, 4:41 PM, and Luis texts from the Whitfield house: the card thing is not working again.",
    "It just spins, he says, and then says something about connection. It worked fine this morning. Mrs. Whitfield is standing right there and wants to pay before the weekend, and the Whitfields have waited on Greenline before.",
    "Again is the word to notice. This happened earlier this month, somebody got it working, and nobody wrote down how. There is no written plan for taking a payment when a reader is down."
  ],
  stakes: "Leave it, and every breakdown starts from zero, with a customer watching.",
  quiz: [
    { q: "Something stops working. What comes first?",
      options: ["Restart everything at once", "Five calm questions, before anyone presses anything", "A group text that says it is broken"], answer: 1,
      why: "What you see, who it affects, what changed, whether it repeats and what it stops: answer those and support can act." },
    { q: "A message has a deadline, a link, and asks for your password. What do you do?",
      options: ["Click quickly, before the deadline", "Reply with the password so they can check", "Do not click. Go to the site the way you always do"], answer: 2,
      why: "Pressure, a link and a request for a password or a payment are the three signs of phishing." },
    { q: "What goes on the one-page when-it-breaks sheet?",
      options: ["Who owns each login, who to call, and what to do meanwhile", "Every password, so anyone can get in", "Only the tools that broke last year"], answer: 0,
      why: "Names and phone numbers go on the page, and passwords never do: they live in the password manager." }
  ],
  reward: { hours: 2, leads: 0, money: 0 },
  debrief: [
    "A panicked text became a request support can act on, and the next bad day has one page that says who to call.",
    "That is all eight. The whole business is on one screen, and Jordan gets the evenings back. Tonight, turn on two-step login for your own email."
  ]
});
