/* Week 7 sample data: today's calendar for a made-up company, the plan-my-day prompt, and the plan
   an AI handed back. No real people. The plan leaves one task out without saying so, on purpose:
   catching it is the lesson. */
window.OH_SAMPLE = window.OH_SAMPLE || {}; window.OH_SAMPLE.cc = window.OH_SAMPLE.cc || {};
(function () {
  const cc = window.OH_SAMPLE.cc;
  cc.calendar = { date: OH.today(), events: [
    { time: "07:30", what: "Crew leaves the yard" },
    { time: "10:00", what: "Site visit: Ruth Delgado, hedges along the driveway" },
    { time: "13:30", what: "Call with the insurance agent about the auto policy" } ] };
  cc.calendarText = "7:30 Crew leaves the yard\n10:00 Site visit: Ruth Delgado, hedges along the driveway\n1:30 PM Call with the insurance agent about the auto policy";

  cc.planPrompt = [
    "You plan the owner's day. Read the four lists below and write today's plan.",
    "",
    "Do this:",
    "1. Pick the ONE thing to do first.",
    "2. List the rest in the order to do them. Put anything with a time at its time.",
    "3. Write every message that needs writing, ready to copy. Short, friendly, direct.",
    "4. Say what you left out and why, and what you were unsure about.",
    "",
    "Rules:",
    "- Use only what is in the lists. Do not add a task, a time, a price or a promise.",
    "- Every line says which list it came from: board, pipeline, email or calendar.",
    "- At most seven lines after the first one.",
    "- You draft. I send. Never send, pay, post or delete.",
    "",
    "Hand it back in exactly this shape, with nothing before or after:",
    "",
    "DAY PLAN",
    "FIRST | what to do | from: email",
    "THEN | 10:00 | what to do | from: calendar",
    "THEN | | what to do | from: pipeline",
    "MESSAGES",
    "MESSAGE | To: the name | Subject: the subject",
    "the message, in plain text",
    "END",
    "LEFT OUT",
    "- what you left out, and why",
    "UNSURE",
    "- anything you were not sure about",
    "",
    "Today's lists:"
  ].join("\n");

  const FIRST = ["Call Dana Whitfield, say sorry and offer a new date", "email"];
  const THEN = [
    ["07:30", "Crew leaves the yard. Tell Luis yes or no about Thursday afternoon", "calendar"],
    ["", "Send Marcus Oyelaran two weekend times for the patio visit", "pipeline"],
    ["", "Check Thursday or Monday with the crew, then answer Priya Raman", "email"],
    ["10:00", "Site visit: Ruth Delgado, hedges along the driveway", "calendar"],
    ["", "Phone Gloria Stein at Maple Court Homeowners. The notes say she prefers a call", "pipeline"],
    ["13:30", "Call with the insurance agent about the auto policy", "calendar"],
    ["", "Follow up with Hartwell Dental about the lawn care note", "pipeline"]
  ];
  const MESSAGES = [
    ["Marcus Oyelaran", "Your patio", "Hi Marcus, I would like to come and look at the backyard before I say anything about the patio. Would Saturday morning or Sunday afternoon suit you?\nJordan, Greenline Landscaping"],
    ["Priya Raman", "Re: Can we move Friday?", "Hi Priya, I am checking Thursday and Monday with the crew, and I will confirm one of them with you today.\nJordan, Greenline Landscaping"],
    ["Nina Hartwell", "Lawn care for the office", "Hi Nina, I wanted to make sure my note reached you and answered your questions. You asked about starting in spring. I am happy to talk that through whenever suits you.\nJordan, Greenline Landscaping"]
  ];
  const LEFT = ["Review the vehicles and the drivers. The policy is not due for 20 days.", "Visit the Oyelaran site and measure. The visit is not booked yet."];
  const UNSURE = ["Priya Raman has no next step in the pipeline. I used the email short list for her."];

  cc.day = {
    date: OH.today(),
    first: { text: FIRST[0], from: FIRST[1], done: false },
    then: THEN.map((t) => ({ time: t[0], text: t[1], from: t[2], done: false })),
    messages: MESSAGES.map((m) => ({ to: m[0], subject: m[1], body: m[2] })),
    left: LEFT.slice(), unsure: UNSURE.slice()
  };
  /* The same plan as the text an AI hands back. The page reads this shape. */
  cc.dayAnswer = "DAY PLAN\nFIRST | " + FIRST[0] + " | from: " + FIRST[1] + "\n" + THEN.map((t) => "THEN | " + t[0] + " | " + t[1] + " | from: " + t[2]).join("\n")
    + "\n\nMESSAGES\n" + MESSAGES.map((m) => "MESSAGE | To: " + m[0] + " | Subject: " + m[1] + "\n" + m[2] + "\nEND").join("\n")
    + "\n\nLEFT OUT\n" + LEFT.map((x) => "- " + x).join("\n") + "\n\nUNSURE\n" + UNSURE.map((x) => "- " + x).join("\n");
})();
