/* Week 3 sample data: a made-up inbox, the review prompt, and the review an AI handed back.
   No real people. The review has one email in the wrong pile on purpose: finding it is the lesson. */
window.OH_SAMPLE = window.OH_SAMPLE || {}; window.OH_SAMPLE.cc = window.OH_SAMPLE.cc || {};
(function () {
  const cc = window.OH_SAMPLE.cc;

  cc.inbox = [
    ["Dana Whitfield <dana.whitfield@example.com>", "Nobody showed up on Tuesday", "Hi, your crew was supposed to be here Tuesday morning for the hedge trimming and nobody came or called. I took the morning off work for this. Please tell me what happened and when you can come. I'd like this sorted this week."],
    ["Website form <forms@greenline-sample.example.com>", "New quote request: backyard patio", "Name: Marcus Oyelaran. Phone: 555-0142. Message: We just bought a house and want a paver patio in the backyard, roughly 300 square feet, plus some planting along the fence. Can someone come look at it? Weekends are best."],
    ["Priya Raman <priya.raman@example.com>", "Can we move Friday?", "Hi. We have family arriving Friday. Any chance the lawn visit could move to Thursday or to Monday instead? Either works for us. Thanks so much."],
    ["Northside Mulch Supply <billing@northside-mulch.example.com>", "Invoice 4471 for September delivery", "Please find attached invoice 4471 for 18 cubic yards of dark hardwood mulch delivered September 22. Terms are net 30."],
    ["Square <no-reply@square.example.com>", "You received a payment", "A payment from T. Alvarez was completed. View the details in your dashboard."],
    ["Account Security <security-alert@acc0unt-verify.example.net>", "URGENT: Your account is suspended", "We detected unusual activity. Your business account has been suspended. Click here within 24 hours to verify your password and card number or your account will be closed."],
    ["Google Business Profile <noreply@business-profile.example.com>", "You have a new review", "Sam K. left a 5-star review: \"Showed up on time, yard looks great.\""],
    ["Luis (crew lead) <luis@greenline-sample.example.com>", "Thursday off?", "Hey boss, my daughter has a school thing Thursday afternoon. OK if I leave at 1? I can cover Saturday morning to make it up. Also the trailer hitch light is out again."],
    ["Harbor Mutual Insurance <renewals@harbor-mutual.example.com>", "Your commercial auto policy renews next month", "Your policy renews on the 15th of next month. Review your vehicles and drivers and let your agent know of any changes."],
    ["The Small Biz Weekly <newsletter@smallbizweekly.example.com>", "7 trends every owner should watch this fall", "This week: seven trends, three podcasts and one webinar you won't want to miss."],
    ["QuickBooks <no-reply@quickbooks.example.com>", "3 invoices are overdue", "Three of your customer invoices are more than 30 days overdue. Open your account to send reminders."],
    ["ToolBarn Deals <deals@toolbarn.example.com>", "Trimmers on sale this weekend only", "Our biggest sale of the season. This weekend only."]
  ].map((e, i) => "EMAIL " + (i + 1) + "\nFrom: " + e[0] + "\nSubject: " + e[1] + "\n" + e[2]).join("\n\n");

  cc.emailPrompt = [
    "You are the office assistant for a small business. Review today's emails for the owner.",
    "",
    "Do these four things:",
    "1. Sort every email into one pile: REPLY TODAY, CAN WAIT, FYI or JUNK.",
    "2. Write the short list: only the things the owner must do themselves.",
    "3. Draft a reply for each email in REPLY TODAY. Friendly and direct, under 90 words.",
    "4. Say which emails look fake, and what you were unsure about.",
    "",
    "Rules:",
    "- You draft. I send. Never send anything.",
    "- Never quote a price or promise a date that is not in the emails.",
    "- Never click a link or open an attachment.",
    "- If you are unsure, say so under UNSURE. Do not guess.",
    "",
    "Hand it back in exactly this shape, with nothing before or after:",
    "",
    "REVIEW",
    "EMAIL 1 | REPLY TODAY | who it is from | the subject | why, in a few words",
    "(one line like that for every email)",
    "SHORT LIST",
    "EMAIL 1 | what the owner must do, starting with a verb | when",
    "DRAFTS",
    "DRAFT 1 | To: the name | Subject: the subject",
    "the reply, in plain text",
    "END",
    "LOOKS FAKE",
    "EMAIL 6 | why it looks fake",
    "UNSURE",
    "- anything you were not sure about",
    "",
    "Emails:"
  ].join("\n");

  const E = [
    [1, "REPLY TODAY", "Dana Whitfield", "Nobody showed up on Tuesday", "An upset customer who took the morning off work"],
    [2, "REPLY TODAY", "Website form", "New quote request: backyard patio", "A new lead. Weekends are best"],
    [3, "REPLY TODAY", "Priya Raman", "Can we move Friday?", "Needs a yes or no before Friday"],
    [4, "CAN WAIT", "Northside Mulch Supply", "Invoice 4471 for September delivery", "Terms are net 30"],
    [5, "FYI", "Square", "You received a payment", "Nothing to do"],
    [6, "JUNK", "Account Security", "URGENT: Your account is suspended", "Looks fake. Do not click"],
    [7, "FYI", "Google Business Profile", "You have a new review", "A 5-star review from Sam K."],
    [8, "CAN WAIT", "Luis (crew lead)", "Thursday off?", "Wants an answer by Wednesday"],
    [9, "CAN WAIT", "Harbor Mutual Insurance", "Your commercial auto policy renews next month", "Review before the 15th"],
    [10, "JUNK", "The Small Biz Weekly", "7 trends every owner should watch this fall", "A newsletter"],
    [11, "FYI", "QuickBooks", "3 invoices are overdue", "A reminder notice"],
    [12, "JUNK", "ToolBarn Deals", "Trimmers on sale this weekend only", "A promotion"]
  ];
  const SHORT = [
    [1, "Call Dana Whitfield, say sorry and offer a new date", "Today"],
    [2, "Offer Marcus Oyelaran two weekend times for a site visit", "Today"],
    [3, "Check Thursday or Monday with the crew, then answer Priya", "Today"],
    [8, "Tell Luis yes or no about Thursday afternoon", "By Wednesday"]
  ];
  const DRAFTS = [
    [1, "Dana Whitfield", "About Tuesday", "Hi Dana, I am sorry. Nobody came on Tuesday and nobody called, and you took the morning off for it. That is on us. I would like to make it right this week. Would Thursday morning or Friday morning work for the hedge trimming? Tell me which is better and I will confirm it with the crew today.\nJordan, Greenline Landscaping"],
    [2, "Marcus Oyelaran", "Your patio", "Hi Marcus, thank you for getting in touch, and congratulations on the new house. I would like to come and look at the backyard before I say anything about the patio or the planting. Would Saturday morning or Sunday afternoon suit you?\nJordan, Greenline Landscaping"],
    [3, "Priya Raman", "Re: Can we move Friday?", "Hi Priya, thanks for letting me know. I am checking Thursday and Monday with the crew, and I will confirm one of them with you today.\nJordan, Greenline Landscaping"]
  ];
  const FAKE = [[6, "The sender's address does not match any company you use, and it asks for a password and a card number"]];
  const UNSURE = [
    "I was not sure whether the QuickBooks notice about overdue invoices needs you today. I put it in FYI.",
    "Draft 1 offers Thursday or Friday morning. Those days are not in the emails, so check them before you send."
  ];

  cc.email = {
    at: OH.today(),
    emails: E.map((e) => ({ n: e[0], pile: e[1], from: e[2], subject: e[3], why: e[4] })),
    short: SHORT.map((s) => ({ n: s[0], task: s[1], due: s[2], done: false })),
    drafts: DRAFTS.map((d) => ({ n: d[0], to: d[1], subject: d[2], body: d[3], checked: false })),
    fake: FAKE.map((f) => ({ n: f[0], why: f[1] })),
    unsure: UNSURE.slice()
  };
  /* The same review as the text an AI hands back. The page reads this shape. */
  cc.emailAnswer = "REVIEW\n" + E.map((e) => "EMAIL " + e[0] + " | " + e.slice(1).join(" | ")).join("\n")
    + "\n\nSHORT LIST\n" + SHORT.map((s) => "EMAIL " + s[0] + " | " + s[1] + " | " + s[2]).join("\n")
    + "\n\nDRAFTS\n" + DRAFTS.map((d) => "DRAFT " + d[0] + " | To: " + d[1] + " | Subject: " + d[2] + "\n" + d[3] + "\nEND").join("\n")
    + "\n\nLOOKS FAKE\n" + FAKE.map((f) => "EMAIL " + f[0] + " | " + f[1]).join("\n")
    + "\n\nUNSURE\n" + UNSURE.map((u) => "- " + u).join("\n");
})();
