/* Week 2 sample data: the task board and the change log of a made-up company. No real people.
   Dates are counted from today, so the board always looks like this morning. */
window.OH_SAMPLE = window.OH_SAMPLE || {}; window.OH_SAMPLE.cc = window.OH_SAMPLE.cc || {};
window.OH_SAMPLE.cc.tasks = [
  { id: "T1", title: "Fix the missed visit for Dana Whitfield", lane: "Doing", done_means: "Dana has a new date and has said yes to it", due: OH.day(0), steps: [
    { who: "ai", text: "Draft the apology and offer two dates", done: true },
    { who: "you", text: "Check the draft and send it", done: false },
    { who: "you", text: "Put the new date on the crew calendar", done: false } ] },
  { id: "T2", title: "Quote the Oyelaran patio", lane: "To do", done_means: "Marcus has a written quote and a site visit is booked", due: OH.day(2), steps: [
    { who: "you", text: "Visit the site and measure", done: false },
    { who: "ai", text: "Draft the quote from the measurements", done: false },
    { who: "you", text: "Check the quote and send it", done: false } ] },
  { id: "T3", title: "Chase the three overdue invoices", lane: "To do", done_means: "Each customer has had a reminder and a date to pay by", due: OH.day(1), steps: [
    { who: "ai", text: "List the three invoices and how late each one is", done: false },
    { who: "ai", text: "Draft a polite reminder for each", done: false },
    { who: "you", text: "Send the reminders", done: false } ] },
  { id: "T4", title: "Renew the commercial auto policy", lane: "To do", done_means: "The agent has the updated list of vehicles and drivers", due: OH.day(20), steps: [
    { who: "you", text: "Review the vehicles and the drivers", done: false },
    { who: "you", text: "Call the agent", done: false } ] },
  { id: "T5", title: "Order mulch for Friday's jobs", lane: "Doing", done_means: "18 cubic yards are confirmed for delivery on Thursday", due: OH.day(0), steps: [
    { who: "you", text: "Confirm the amount with Luis", done: true },
    { who: "you", text: "Place the order with Northside Mulch Supply", done: false } ] },
  { id: "T6", title: "Fix the trailer hitch light", lane: "To do", done_means: "The light works and Luis has checked it", due: OH.day(3), steps: [
    { who: "", text: "Book the repair", done: false } ] },
  { id: "T7", title: "Write the fall cleanup post", lane: "To do", done_means: "One post is ready for Jordan to check", due: OH.day(4), steps: [
    { who: "ai", text: "Draft three options", done: false },
    { who: "you", text: "Pick one and post it", done: false } ] },
  { id: "T8", title: "Thank Sam K. for the review", lane: "Done", done_means: "A short thank you is posted under the review", due: OH.day(-1), steps: [
    { who: "ai", text: "Draft a two-line thank you", done: true },
    { who: "you", text: "Post it under the review", done: true } ] }
];
window.OH_SAMPLE.cc.log = [
  { at: OH.day(-6), who: "Jordan", what: "Built the Today page", why: "I was retyping the morning list every day", decision: false },
  { at: OH.day(-5), who: "Jordan", what: "The AI drafts and I send", why: "A wrong date sent to a customer costs more than the time saved", decision: true },
  { at: OH.day(-3), who: "AI", what: "Drafted reminders for three overdue invoices", why: "Jordan asked for drafts to check", decision: false },
  { at: OH.day(-2), who: "Jordan", what: "Moved the mulch order to Doing", why: "Friday's jobs need it by Thursday", decision: false },
  { at: OH.day(-1), who: "Jordan", what: "Built the board", why: "Tasks were in my head, my inbox and on sticky notes", decision: false },
  { at: OH.day(-1), who: "Jordan", what: "Done: Thank Sam K. for the review", why: "Done means: A short thank you is posted under the review", decision: false }
];
/* A messy to-do list, the way it comes out of a head. Bringing it in makes one card per line. */
window.OH_SAMPLE.cc.messyList = "call the library back about the front beds\nfind out why the blower keeps stalling\nnew crew shirts??\nprice out the Maple Court mowing\nsharpen mower blades before Monday\nask Luis about a second helper for leaf season";
