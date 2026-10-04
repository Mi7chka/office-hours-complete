/* Week 6 sample data: a month of posts for a made-up company, the content pack prompt, and a
   sample answer. No real people. The sample answer holds one invented claim on purpose:
   finding it is the lesson. */
window.OH_SAMPLE = window.OH_SAMPLE || {}; window.OH_SAMPLE.cc = window.OH_SAMPLE.cc || {};
(function () {
  const cc = window.OH_SAMPLE.cc;
  cc.platforms = ["Facebook", "Instagram", "Google Business Profile", "Email"];
  cc.posts = [
    { id: "P1", date: OH.day(-9), platform: "Facebook", idea: "Before and after: the Alvarez front beds", text: "Three days, forty plants, one very happy front walk. Before and after from last week.", status: "Posted" },
    { id: "P2", date: OH.day(-6), platform: "Google Business Profile", idea: "Fall cleanup dates are open", text: "Fall cleanup dates are open for Cedar Hollow. Leaves, beds and a last mow. Call to pick a day.", status: "Posted" },
    { id: "P3", date: OH.day(-3), platform: "Instagram", idea: "Luis and the new trailer", text: "Luis picked up the new trailer this week. Same crew, more mulch per trip. #cedarhollow", status: "Posted" },
    { id: "P4", date: OH.day(0), platform: "Facebook", idea: "When to cut back hydrangeas", text: "A customer asked us this week when to cut back hydrangeas. Most kinds like a trim in late winter, before new growth starts. If yours blooms on old wood, wait until right after it flowers.", status: "Ready" },
    { id: "P5", date: OH.day(2), platform: "Instagram", idea: "When to cut back hydrangeas", text: "Late winter for most hydrangeas. Right after flowering for the old wood kind. #hydrangeas #gardentips", status: "Ready" },
    { id: "P6", date: OH.day(4), platform: "Email", idea: "The fall checklist", text: "Subject: Five things to do in the yard before the first frost. A short list from the crew, and how to book a cleanup.", status: "Drafted" },
    { id: "P7", date: OH.day(7), platform: "Google Business Profile", idea: "Mulch before winter", text: "A layer of mulch before winter keeps roots warm and beds tidy. Ask us about a delivery.", status: "Drafted" },
    { id: "P8", date: OH.day(10), platform: "Facebook", idea: "Meet the crew: Luis", text: "", status: "Idea" },
    { id: "P9", date: OH.day(14), platform: "Instagram", idea: "First frost photo", text: "", status: "Idea" }
  ];
  cc.graphic = { headline: "When to cut back hydrangeas", template: { colors: true, font: true, logo: false } };

  cc.packPrompt = [
    "You write posts for a small business. Turn the one idea below into a content pack.",
    "",
    "Write two options for each platform: Facebook, Instagram, Google Business Profile, Email.",
    "- Facebook: two or three friendly sentences.",
    "- Instagram: one or two short lines, and up to three hashtags.",
    "- Google Business Profile: one useful fact, and what to do next.",
    "- Email: a subject line, then three sentences.",
    "",
    "Rules:",
    "- Use only what is in the idea and the facts under it. Do not add a claim, a number, an award or a promise.",
    "- Write the way the owner talks: plain and friendly.",
    "- You draft. I post. Never post anything.",
    "- If you are unsure about a fact, say so under UNSURE.",
    "",
    "Hand it back in exactly this shape, with nothing before or after:",
    "",
    "CONTENT PACK",
    "FACEBOOK | 1 | the post",
    "FACEBOOK | 2 | the post",
    "INSTAGRAM | 1 | the post",
    "(and so on: one line for every option)",
    "UNSURE",
    "- anything you were not sure about",
    "",
    "The idea:"
  ].join("\n");
  cc.pack = { idea: "A customer asked when to cut back hydrangeas. Jordan's answer: most kinds in late winter, before new growth starts. The kind that blooms on old wood, right after it flowers.", options: [], unsure: [] };
  cc.packAnswer = [
    "CONTENT PACK",
    "FACEBOOK | 1 | A customer asked us this week when to cut back hydrangeas. Most kinds like a trim in late winter, before new growth starts. If yours blooms on old wood, wait until right after it flowers.",
    "FACEBOOK | 2 | Voted the best landscaper in Cedar Hollow three years running, and happy to tell you when to prune. Most hydrangeas want a trim in late winter. The old wood kind waits until after it flowers.",
    "INSTAGRAM | 1 | Late winter for most hydrangeas. Right after flowering for the old wood kind. #hydrangeas #cedarhollow #gardentips",
    "INSTAGRAM | 2 | When do you cut back hydrangeas? It depends on the kind. #hydrangeas #pruning",
    "GOOGLE BUSINESS PROFILE | 1 | Wondering when to cut back hydrangeas? Most kinds in late winter, before new growth. The kind that blooms on old wood, right after it flowers. Call us if you would like a hand.",
    "GOOGLE BUSINESS PROFILE | 2 | Hydrangea pruning depends on the kind. Late winter for most. Right after flowering for the old wood kind.",
    "EMAIL | 1 | Subject: When to cut back your hydrangeas. A customer asked this week, so here is the short answer. Most kinds get a trim in late winter, before new growth. The kind that blooms on old wood waits until right after it flowers.",
    "EMAIL | 2 | Subject: One pruning question, answered. A customer asked when to cut back hydrangeas. Most want a trim in late winter. If yours blooms on old wood, wait until it has flowered.",
    "UNSURE",
    "- I did not know which kinds of hydrangea are common in Cedar Hollow, so I did not name any."
  ].join("\n");
})();
