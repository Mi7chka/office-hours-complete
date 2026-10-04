/* Week 4 · the pipeline.
   The one question it answers: which deals have gone quiet, and what is the next step for each?
   A list of clients and deals, a board with one column per stage, and a follow-up checklist with
   message templates. Drafts only: this page never sends. Works with the sample business or your own deals. */
(function () {
  const h = OH.h, STAGES = ["New", "Site visit", "Quoted", "Won", "Lost"], pick = {};
  const closed = (d) => d.stage === "Won" || d.stage === "Lost";
  const firstName = (d) => String(d.contact || d.client || "").trim().split(" ")[0];
  const lower = (s) => (s ? s.charAt(0).toLowerCase() + s.slice(1) : "");
  const uid = (i) => "D" + Date.now().toString(36) + (i || 0);

  /* Where a deal stands today. An open deal needs you when it has no next step, no date, or a date that is today or has passed. */
  function status(d) {
    if (closed(d)) return { need: false, text: d.stage, tone: d.stage === "Won" ? "ok" : "", rank: -1 };
    if (!d.next_step) return { need: true, text: "No next step", tone: "bad", rank: 9000 };
    if (!d.next_date) return { need: true, text: "No date", tone: "bad", rank: 8000 };
    const late = OH.daysBetween(d.next_date, OH.today());
    if (late > 0) return { need: true, text: late + (late === 1 ? " day late" : " days late"), tone: "bad", rank: late };
    if (late === 0) return { need: true, text: "Due today", tone: "warn", rank: 0 };
    return { need: false, text: "Due " + OH.niceDate(d.next_date), tone: "", rank: -1 };
  }
  const needing = (list) => list.filter((d) => status(d).need).sort((a, b) => status(b).rank - status(a).rank);
  const quiet = (d) => (d.last_touch ? Math.max(0, OH.daysBetween(d.last_touch, OH.today())) : null);
  function fill(text, d) {
    const b = OH.cc.biz();
    return text.replace(/\{first\}/g, firstName(d)).replace(/\{what\}/g, lower(d.what) || "the work we talked about")
      .replace(/\{owner\}/g, String(b.owner || "").split(" ")[0] || "Your name").replace(/\{business\}/g, b.name || "your business");
  }
  const HEAD = ["client", "contact", "email", "phone", "what", "stage", "next step", "next date", "last contact", "source", "notes"];
  const isDate = (s) => /^\d{4}-\d\d-\d\d$/.test(s || "");
  function parseDeals(text) {
    return OH.rows(text).filter((r) => r.client).map((r, i) => ({ id: uid(i), client: r.client, contact: r.contact || r.client, email: r.email || "", phone: r.phone || "", what: r.what || "",
      stage: STAGES.find((s) => s.toLowerCase() === String(r.stage || "").toLowerCase()) || "New", next_step: r["next step"] || "", next_date: isDate(r["next date"]) ? r["next date"] : "",
      last_touch: isDate(r["last contact"]) ? r["last contact"] : "", source: r.source || "", notes: r.notes || "" }));
  }
  const dealsCSV = (list) => OH.toCSV([HEAD].concat(list.map((d) => [d.client, d.contact, d.email, d.phone, d.what, d.stage, d.next_step, d.next_date, d.last_touch, d.source, d.notes])));

  function boardTab(panel, list, save) {
    panel.appendChild(h("div", { class: "piles" }, STAGES.map((stage) => { const cards = list.filter((d) => d.stage === stage);
      return h("div", { class: "pile" }, h("h3", null, stage, h("span", { class: "badge" }, cards.length)), cards.map((d) => { const st = status(d);
        return h("div", { class: "item" + (st.need && st.tone === "bad" ? " flag" : "") }, h("b", null, d.client), h("span", { class: "sub" }, d.what),
          d.next_step && !closed(d) ? h("span", { class: "sub" }, "Next: " + d.next_step) : null,
          h("div", { class: "row", style: "gap:4px;margin-top:5px" }, OH.badge(st.text, st.tone), d.source ? OH.badge(d.source) : null),
          h("select", { "aria-label": "Move the deal: " + d.client, onchange: (ev) => { d.stage = ev.target.value; if (closed(d)) OH.cc.log((d.stage === "Won" ? "Won: " : "Closed with a no: ") + d.client, d.what); save(); } },
            STAGES.map((x) => h("option", { value: x, selected: x === stage }, x === stage ? "In " + x : "Move to " + x)))); })); })));
  }

  function listTab(panel, list, ctx) {
    const own = OH.cc.own();
    if (list) panel.appendChild(OH.table([
      { h: "Client", f: (d) => h("span", null, h("b", null, d.client), d.contact && d.contact !== d.client ? h("div", { class: "mut" }, d.contact) : null), s: (d) => d.client },
      { h: "What they want", f: (d) => d.what }, { h: "Stage", f: (d) => d.stage, s: (d) => STAGES.indexOf(d.stage) },
      { h: "Next step", f: (d) => (closed(d) ? h("span", { class: "mut" }, "Closed") : d.next_step || OH.badge("No next step", "bad")) },
      { h: "Date", f: (d) => (closed(d) ? "" : OH.badge(status(d).text, status(d).tone)), s: (d) => d.next_date || "9999" },
      { h: "Last contact", f: (d) => (d.last_touch ? OH.niceDate(d.last_touch) : ""), s: (d) => d.last_touch || "" },
      { h: "Source", f: (d) => d.source || h("span", { class: "mut" }, "Not known") }
    ], list, { rowClass: (d) => (status(d).need ? "hot" : ""), empty: "No deals yet." }));
    // add a deal
    const f = { client: h("input", { type: "text", placeholder: "Who it is for" }), contact: h("input", { type: "text", placeholder: "The person you talk to" }), what: h("input", { type: "text", placeholder: "What they want" }),
      source: h("input", { type: "text", placeholder: "Where the lead came from" }), step: h("input", { type: "text", placeholder: "The next step" }), date: h("input", { type: "date" }) };
    panel.appendChild(h("details", { class: "card", style: "margin-top:14px", open: !list }, h("summary", { style: "font-weight:700;cursor:pointer" }, "Add a deal"),
      h("div", { class: "grid g3" }, OH.field("Client", f.client), OH.field("Contact", f.contact), OH.field("What they want", f.what)),
      h("div", { class: "grid g3" }, OH.field("Source", f.source), OH.field("Next step", f.step), OH.field("Date of the next step", f.date)),
      h("div", { class: "row", style: "margin-top:8px" }, h("button", { class: "primary", onclick: () => {
        if (!f.client.value.trim()) return OH.toast("Say who the deal is for first");
        const all = list || []; all.push({ id: uid(), client: f.client.value.trim(), contact: f.contact.value.trim() || f.client.value.trim(), email: "", phone: "", what: f.what.value.trim(), stage: "New",
          next_step: f.step.value.trim(), next_date: f.date.value || "", last_touch: OH.today(), source: f.source.value.trim(), notes: "" });
        OH.cc.set("deals", all); OH.cc.log("Added the deal: " + f.client.value.trim(), f.what.value.trim()); OH.toast("Deal added to New"); ctx.redraw(); } }, "Add the deal"))));
    // bring deals in, save the file
    panel.appendChild(h("details", { class: "card", style: "margin-top:14px" }, h("summary", { style: "font-weight:700;cursor:pointer" }, "Bring in my deals"),
      OH.bringIn({ label: "A deals file from a spreadsheet", hint: "A sheet saved as CSV. The first row has the headings: " + HEAD.join(", ") + ". Dates look like 2026-10-28.",
        placeholder: "Or paste the rows here, with the heading row first", sample: own ? null : dealsCSV(OH.sample.cc.deals.slice(0, 3)), useLabel: "Add these deals",
        onText: (text) => { const rows = parseDeals(text); if (!rows.length) return OH.toast("I could not find any deals. The first row needs a heading named client.");
          OH.cc.set("deals", (list || []).concat(rows)); OH.cc.log("Brought in " + rows.length + (rows.length === 1 ? " deal" : " deals"), "From a file or pasted rows"); OH.toast(rows.length + " deals added"); ctx.redraw(); } }),
      list ? h("div", { class: "row", style: "margin-top:10px" }, h("button", { onclick: () => OH.download("deals.csv", dealsCSV(list), "text/csv") }, "Save my deals file"), h("span", { class: "mut", style: "font-size:13px" }, "A file for a spreadsheet, named deals.csv.")) : null));
  }

  function followTab(panel, list, save, ctx) {
    const todo = needing(list), T = OH.sample.cc.templates;
    panel.appendChild(OH.note("Drafts only. This page never sends. Copy a draft, read it against the notes, and send it yourself.", ""));
    if (!todo.length) panel.appendChild(OH.note("Every open deal has a next step and a date that has not passed. Nothing to follow up today.", "ok"));
    todo.forEach((d) => {
      const st = status(d), q = quiet(d), t = T.find((x) => x.id === (pick[d.id] || "first")) || T[0], draft = fill(t.text, d);
      const step = h("input", { type: "text", placeholder: "What happens next" }), date = h("input", { type: "date" });
      panel.appendChild(h("div", { class: "card", style: "margin-top:12px" },
        h("div", { class: "row" }, h("h2", { style: "margin:0" }, d.client), OH.badge(st.text, st.tone), q != null ? OH.badge("Last contact " + q + (q === 1 ? " day ago" : " days ago")) : null, h("span", { class: "spacer" }), OH.badge(d.stage)),
        h("p", { style: "margin:6px 0" }, d.what + ". ", d.next_step ? "The next step was: " + d.next_step + "." : "No next step is written down."),
        h("p", { class: "mut", style: "margin:0 0 8px" }, h("b", null, "The notes: "), d.notes || "No notes."),
        OH.field("Message template", h("select", { onchange: (ev) => { pick[d.id] = ev.target.value; ctx.redraw(); } }, T.map((x) => h("option", { value: x.id, selected: x.id === t.id }, x.name)))),
        h("pre", { class: "code", style: "margin-top:8px" }, draft),
        h("div", { class: "row", style: "margin-top:8px" }, h("button", { class: "small", onclick: () => OH.copy(draft, "Draft copied") }, "Copy the draft")),
        h("div", { class: "grid g2", style: "margin-top:6px" }, OH.field("After you followed up: the next step", step), OH.field("Its date", date)),
        h("div", { class: "row", style: "margin-top:8px" }, h("button", { class: "primary", onclick: () => {
          if (!step.value.trim() || !date.value) return OH.toast("A next step and a date, both, please");
          d.next_step = step.value.trim(); d.next_date = date.value; d.last_touch = OH.today();
          OH.cc.log("Followed up with " + d.client, "Next: " + d.next_step + ", " + OH.niceDate(d.next_date)); save(); } }, "Save the next step"))));
    });
    const text = todo.map((d) => d.client + " (" + firstName(d) + ")\nWants: " + d.what + "\nStage: " + d.stage + "\nNotes: " + (d.notes || "none")).join("\n\n");
    if (todo.length) panel.appendChild(h("details", { class: "card", style: "margin-top:14px" }, h("summary", { style: "font-weight:700;cursor:pointer" }, "Ask an AI to draft from the notes"),
      h("p", { class: "mut" }, "Then find the draft that says something the notes do not."),
      OH.promptBox({ height: 150, dataLabel: "deals", data: text, prompt: "Draft a short follow-up for each deal below. Use only what is in the notes. Do not quote a price. Do not promise a date. If the notes say the person prefers a call, write three lines to say on the phone, not an email. Under 80 words each. I will send them myself. End with what you were unsure about." }).el));
  }

  function render(root, ctx) {
    const list = OH.cc.get("deals");
    const save = () => { OH.cc.set("deals", list); ctx.redraw(); };
    if (!list) {
      root.appendChild(OH.cc.setup("No deals are brought in yet, so there is no board and no number to show.", ["Add one deal below, or", "open Bring in my deals and drop in a sheet saved as CSV."]));
      return listTab(root, null, ctx);
    }
    root.appendChild(OH.tabs("p4", [
      { id: "follow", label: "Follow-ups", count: needing(list).length, render: (p) => followTab(p, list, save, ctx) },
      { id: "board", label: "Board", count: list.filter((d) => !closed(d)).length, render: (p) => boardTab(p, list, save) },
      { id: "list", label: "Clients and deals", count: list.length, render: (p) => listTab(p, list, ctx) }
    ]));
  }

  OH.register({
    piece: 4, id: "week-4-pipeline", title: "The pipeline",
    intro: "Every lead on one board, with a next step and a date. Work goes quiet. It is not lost.",
    data: ["deals"],
    render: render,
    summary: function () {
      const list = OH.cc.get("deals"); if (!list) return { label: "Deals to follow up today", value: "Needs setup", tone: "warn" };
      const n = needing(list).length; return { label: "Deals to follow up today", value: n, tone: n ? "warn" : "ok" };
    }
  });
})();
