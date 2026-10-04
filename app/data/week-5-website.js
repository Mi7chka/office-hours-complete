/* Week 5 sample data: a messy form export from a made-up website, the three-second test, and
   search numbers. No real people. The search numbers are story numbers, not anyone's results. */
window.OH_SAMPLE = window.OH_SAMPLE || {}; window.OH_SAMPLE.cc = window.OH_SAMPLE.cc || {};
(function () {
  const cc = window.OH_SAMPLE.cc;
  /* Eight rows. One person is already in the pipeline, one row is in the file twice,
     one has no email and no phone, and one has a phone and no email. */
  cc.formExport = [
    "Submitted,Name,Email,Phone,Message,Page",
    OH.day(-2) + ",Marcus Oyelaran,marcus.oyelaran@example.com,555-0142,\"Paver patio in the backyard, plus planting along the fence.\",/patios",
    OH.day(-2) + ",Helen Brandt,helen.brandt@example.com,555-0155,Do you do weekly mowing? Corner lot.,/lawn-care",
    OH.day(-1) + ",Sunil Mehta,sunil.mehta@example.com,555-0161,Need the leaves cleared before Thanksgiving.,/fall-cleanup",
    OH.day(-1) + ",Helen Brandt,HELEN.BRANDT@example.com,555-0155,\"Sent this twice, not sure the first one went through.\",/lawn-care",
    OH.day(-1) + ",Carla Jimenez,,,Can you call me about a retaining wall?,/contact",
    OH.day(0) + ",Dev Patel,dev.patel@example.com,,\"A small front garden, please. What would you suggest?\",/garden-beds",
    OH.day(0) + ",Grace Lin,grace.lin@example.com,555-0178,\"New planting along the fence line, about 60 feet.\",/planting",
    OH.day(0) + ",Arthur Wynn,,555-0183,Sprinkler is leaking. Mornings are best to call.,/contact"
  ].join("\n");
  cc.inquiries = { last: null, held: [], pending: null };

  const month = (back) => { const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - back); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0"); };
  cc.site = {
    page: "greenline-sample.example.com",
    test: { what: "yes", where: "no", next: "yes", date: OH.day(-7), note: "The top of the page says what Greenline does and has a Get a quote button. It does not say Cedar Hollow." },
    search: [6, 5, 4, 3, 2, 1].map((back, i) => ({ month: month(back), clicks: [38, 44, 41, 57, 63, 71][i], impressions: [910, 1040, 980, 1320, 1480, 1610][i] }))
  };
})();
