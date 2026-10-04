/* Week 5 · website inquiries and the website tab.
   The one question it answers: what came in through the website, and is the website doing its job?
   The form export comes in by hand: drop the file or paste the rows. The page checks it first,
   counts before and after, and adds the good rows to the pipeline with their source.
   The website tab holds the three-second test and the search numbers, typed in or imported. */
(function () {
  const h = OH.h;
  const digits = (s) => String(s || "").replace(/\D/g, "");
  const same = (a, b) => (!!a.email && !!b.email && a.email.toLowerCase() === b.email.toLowerCase()) || (!!digits(a.phone) && digits(a.phone) === digits(b.phone));
  const fromWeb = (d) => /^website/i.test(d.source || "");
  const niceMonth = (m) => { const d = new Date(m + "-15T12:00:00"); return isNaN(d) ? m : d.toLocaleDateString(undefined, { month: "short", year: "numeric" }); };
  const count = (rows, v) => rows.filter((r) => r.verdict === v).length;

  /* Any website builder's export: find the columns by what their headings say. */
  function readExport(text) {
    return OH.rows(text).map((r) => { const col = (names) => { for (const k in r) { if (names.some((n) => k.indexOf(n) >= 0) && r[k]) return r[k]; } return ""; };
      return { name: col(["name"]), email: col(["email", "e-mail"]), phone: col(["phone", "tel"]), message: col(["message", "comment", "detail", "question"]), page: col(["page", "form", "source"]), date: col(["submitted", "date", "time"]) }; })
      .filter((r) => r.name || r.email || r.phone || r.message);
  }
  /* add = new person. dupe = already in the pipeline, or in the file twice. held = no way to reach them. */
  function classify(rows, deals) {
    const seen = [];
    return rows.map((r) => {
      let verdict = "add", why = r.email ? "" : "Phone only, no email";
      if (!r.email && !digits(r.phone)) { verdict = "held"; why = "No email and no phone, so there is no way to reach them yet"; }
      else if ((deals || []).some((d) => same(r, d))) { verdict = "dupe"; why = "Already in the pipeline"; }
      else if (seen.some((s) => same(r, s))) { verdict = "dupe"; why = "In this file twice"; }
      else seen.push(r);
      return Object.assign({ verdict: verdict, why: why }, r);
    });
  }

  function inquiriesTab(panel, ctx) {
    const own = OH.cc.own(), inq = OH.cc.get("inquiries"), deals = OH.cc.get("deals");
    if (!inq) panel.appendChild(OH.cc.setup("No website inquiries are brought in yet, so there is nothing to count.", ["Export the form submissions from your website as a CSV file.", "Drop the file in the box below, or paste the rows.", "Press Check this file. Nothing is added until you say so."]));
    panel.appendChild(OH.bringIn({ label: "The form export from your website", hint: "Export the form submissions as a CSV file and drop it here, or paste the rows. Any website builder that can export will do.",
      placeholder: "Or paste the rows here, with the heading row first", sample: own ? null : OH.sample.cc.formExport, useLabel: "Check this file",
      onText: (text, name) => { const rows = readExport(text); if (!rows.length) return OH.toast("I could not find any rows. The first row needs headings such as Name, Email, Phone, Message.");
        const st = inq || { last: null, held: [], pending: null }; st.pending = { file: name || "pasted rows", rows: classify(rows, deals) }; OH.cc.set("inquiries", st); ctx.redraw(); } }));

    if (inq && inq.pending) {
      const rows = inq.pending.rows, add = count(rows, "add"), dupe = count(rows, "dupe"), held = count(rows, "held"), before = (deals || []).length;
      panel.appendChild(h("div", { class: "card first", style: "margin-top:14px" }, h("h2", null, "Checked, and nothing added yet"),
        h("div", { class: "grid g4" }, OH.stat("Rows in the file", rows.length, inq.pending.file), OH.stat("To add", add, "New people", add ? "ok" : ""), OH.stat("Duplicates", dupe, "Not added twice", dupe ? "warn" : ""), OH.stat("Held back", held, "No way to reach them", held ? "bad" : "")),
        h("p", { style: "margin:10px 0" }, h("b", null, add + " plus " + dupe + " plus " + held + " is " + (add + dupe + held) + ". "), add + dupe + held === rows.length ? "That matches the " + rows.length + " rows in the file." : "That does not match the file. Stop and look."),
        OH.table([{ h: "Name", f: (r) => h("b", null, r.name || "No name") }, { h: "Email", f: (r) => r.email || h("span", { class: "mut" }, "none") }, { h: "Phone", f: (r) => r.phone || h("span", { class: "mut" }, "none") }, { h: "Page", f: (r) => r.page },
          { h: "What happens", f: (r) => h("span", null, OH.badge(r.verdict === "add" ? "Add" : r.verdict === "dupe" ? "Duplicate" : "Held back", r.verdict === "add" ? "ok" : r.verdict === "dupe" ? "warn" : "bad"), r.why ? h("div", { class: "mut", style: "font-size:12.5px" }, r.why) : null) }], rows),
        h("div", { class: "row", style: "margin-top:10px" }, h("button", { class: "primary", onclick: () => {
          const list = deals || [], t = OH.today();
          rows.filter((r) => r.verdict === "add").forEach((r, i) => list.push({ id: "W" + Date.now().toString(36) + i, client: r.name || r.email || r.phone, contact: r.name || "", email: r.email, phone: r.phone, what: r.message.length > 90 ? r.message.slice(0, 88) + "…" : r.message,
            stage: "New", next_step: "Reply to the website inquiry", next_date: t, last_touch: /^\d{4}-\d\d-\d\d/.test(r.date) ? r.date.slice(0, 10) : t, source: "Website form" + (r.page ? ": " + r.page : ""), notes: r.message }));
          OH.cc.set("deals", list);
          inq.last = { at: t, file: inq.pending.file, read: rows.length, added: add, dupes: dupe, held: held, before: before, after: list.length };
          inq.held = rows.filter((r) => r.verdict === "held"); inq.pending = null; OH.cc.set("inquiries", inq);
          OH.cc.log("Brought in " + add + " website inquiries", rows.length + " in the file, " + dupe + " duplicates, " + held + " held back"); OH.toast(add + " added to the pipeline"); ctx.redraw(); } }, "Add " + add + " to the pipeline"),
          h("button", { onclick: () => { inq.pending = null; OH.cc.set("inquiries", inq); ctx.redraw(); } }, "Not now"))));
    }
    if (inq && inq.last) { const l = inq.last;
      panel.appendChild(h("div", { class: "card", style: "margin-top:14px" }, h("h2", null, "The last import: before and after"),
        h("div", { class: "grid g4" }, OH.stat("In the file", l.read, OH.niceDate(l.at)), OH.stat("Added", l.added, "As New deals, with their source", "ok"), OH.stat("Pipeline before", l.before, "deals"), OH.stat("Pipeline after", l.after, "deals")),
        h("p", { style: "margin:10px 0 0" }, "The gap, explained: " + l.read + " rows came in and " + l.added + " were added. " + l.dupes + (l.dupes === 1 ? " was a duplicate" : " were duplicates") + " and " + l.held + (l.held === 1 ? " was held back." : " were held back."),
          " ", OH.pieces[4] ? h("a", { href: "#/p4" }, "Open the pipeline") : null)));
    }
    if (inq && inq.held && inq.held.length) panel.appendChild(h("div", { class: "card", style: "margin-top:14px" }, h("h2", null, "Held back: these need you"),
      h("p", { class: "mut", style: "margin:-4px 0 6px" }, "No email and no phone, so nothing was added. They are kept here, not dropped."),
      h("ul", { style: "margin:0;padding-left:20px" }, inq.held.map((r) => h("li", null, h("b", null, r.name || "No name"), ": " + r.message + (r.page ? " (" + r.page + ")" : ""))))));

    if (deals && deals.length) { const by = {}; deals.forEach((d) => { const k = String(d.source || "").split(":")[0].trim() || "Not known"; by[k] = (by[k] || 0) + 1; });
      panel.appendChild(h("div", { class: "card", style: "margin-top:14px" }, h("h2", null, "Where leads came from"), h("p", { class: "mut", style: "margin:-4px 0 8px" }, "Counted from the " + deals.length + " deals in the pipeline today."),
        OH.bars(Object.keys(by).sort((a, b) => by[b] - by[a]).map((k) => ({ label: k, value: by[k] })), { unit: "" }))); }
  }

  function websiteTab(panel, ctx) {
    const own = OH.cc.own(), site = OH.cc.get("site") || { page: "", test: null, search: [] }, has = OH.cc.has("site");
    const saveSite = () => { OH.cc.set("site", site); ctx.redraw(); };
    // the three-second test
    const t = site.test || { what: "", where: "", next: "", note: "", date: "" }, Q = [["what", "Does the top of the page say what you do?"], ["where", "Does it say where you work?"], ["next", "Does it say what to do next?"]];
    const yes = Q.filter((q) => t[q[0]] === "yes").length, tested = Q.every((q) => t[q[0]]);
    const page = h("input", { type: "text", value: site.page || "", placeholder: "yourbusiness.com" }), note = h("textarea", { style: "min-height:70px", placeholder: "What you saw in the first three seconds" }); note.value = t.note || "";
    const sel = {}; Q.forEach((q) => { sel[q[0]] = h("select", null, [["", "Not tested yet"], ["yes", "Yes"], ["no", "No"]].map((o) => h("option", { value: o[0], selected: t[q[0]] === o[0] }, o[1]))); });
    panel.appendChild(h("div", { class: "card" }, h("div", { class: "row" }, h("h2", { style: "margin:0" }, "The three-second test"), h("span", { class: "spacer" }),
      tested ? OH.badge(yes + " of 3", yes === 3 ? "ok" : "warn") : OH.badge(has ? "Not tested yet" : "Needs setup", "warn")),
      h("p", { class: "mut", style: "margin:6px 0" }, "Open your home page, look for three seconds, and look away. Then answer. " + (t.date ? "Last tested " + OH.niceDate(t.date) + "." : "")),
      OH.field("The page you tested", page), h("div", { class: "grid g3" }, Q.map((q) => OH.field(q[1], sel[q[0]]))), OH.field("What you saw", note),
      h("div", { class: "row", style: "margin-top:8px" }, h("button", { class: "primary", onclick: () => { site.page = page.value.trim(); site.test = { what: sel.what.value, where: sel.where.value, next: sel.next.value, note: note.value.trim(), date: OH.today() }; OH.toast("Test saved"); saveSite(); } }, "Save the test"))));
    // the search numbers
    const rows = (site.search || []).slice().sort((a, b) => (a.month < b.month ? -1 : 1));
    const put = (m, c, i) => { site.search = (site.search || []).filter((r) => r.month !== m); site.search.push({ month: m, clicks: c, impressions: i }); };
    const mo = h("input", { type: "text", placeholder: "2026-11" }), cl = h("input", { type: "number", min: "0", placeholder: "0" }), im = h("input", { type: "number", min: "0", placeholder: "0" });
    panel.appendChild(h("div", { class: "card", style: "margin-top:14px" }, h("div", { class: "row" }, h("h2", { style: "margin:0" }, "Search numbers"), h("span", { class: "spacer" }), rows.length ? OH.badge(own ? "Measured: typed in or imported by you" : "Sample numbers, made up", own ? "ok" : "blue") : null),
      rows.length ? h("div", null, h("p", { class: "mut", style: "margin:6px 0" }, "Clicks from search, by month."), OH.bars(rows.map((r) => ({ label: niceMonth(r.month), value: r.clicks })), { unit: "clicks" }),
        h("div", { style: "margin-top:10px" }, OH.table([{ h: "Month", f: (r) => niceMonth(r.month), s: (r) => r.month }, { h: "Clicks", f: (r) => r.clicks }, { h: "Times shown", f: (r) => r.impressions }], rows)))
        : OH.cc.setup("No search numbers are brought in, so no chart is shown.", ["In Search Console, open Performance and export the dates as a CSV file. Drop it below.", "Or type one month in by hand."]),
      h("details", { style: "margin-top:12px" }, h("summary", { style: "font-weight:700;cursor:pointer" }, "Type a month in, or import"),
        h("div", { class: "grid g3" }, OH.field("Month", mo, "Like 2026-11"), OH.field("Clicks", cl), OH.field("Times shown", im)),
        h("div", { class: "row", style: "margin:8px 0 12px" }, h("button", { onclick: () => { if (!/^\d{4}-\d\d$/.test(mo.value.trim())) return OH.toast("Write the month like 2026-11"); put(mo.value.trim(), +cl.value || 0, +im.value || 0); saveSite(); } }, "Save this month")),
        OH.bringIn({ label: "An export from Search Console", hint: "A CSV file with the headings Date, Clicks and Impressions. Days are added up into months.", placeholder: "Or paste the rows here", useLabel: "Import these numbers",
          onText: (text) => { const by = {}; OH.rows(text).forEach((r) => { const d = String(r.date || r.month || "").slice(0, 7); if (!/^\d{4}-\d\d$/.test(d)) return; by[d] = by[d] || [0, 0]; by[d][0] += +String(r.clicks || "0").replace(/,/g, "") || 0; by[d][1] += +String(r.impressions || "0").replace(/,/g, "") || 0; });
            const months = Object.keys(by); if (!months.length) return OH.toast("I could not find a Date column with dates like 2026-11-04");
            months.forEach((m) => put(m, by[m][0], by[m][1])); OH.toast(months.length + (months.length === 1 ? " month" : " months") + " imported"); saveSite(); } }))));
  }

  function render(root, ctx) {
    const deals = OH.cc.get("deals"), inq = OH.cc.get("inquiries");
    root.appendChild(OH.tabs("p5", [
      { id: "inq", label: "Inquiries", count: deals ? deals.filter(fromWeb).length : null, render: (p) => inquiriesTab(p, ctx) },
      { id: "site", label: "Website", render: (p) => websiteTab(p, ctx) }
    ]));
  }

  OH.register({
    piece: 5, id: "week-5-website", title: "Website inquiries",
    intro: "Bring the website's form export into the pipeline by hand, with the source of every lead. Count before and after.",
    data: ["inquiries", "site"],
    render: render,
    summary: function () {
      const deals = OH.cc.get("deals"); if (!deals && !OH.cc.has("inquiries")) return { label: "Leads from the website", value: "Needs setup", tone: "warn" };
      return { label: "Leads from the website", value: (deals || []).filter(fromWeb).length, tone: "" };
    }
  });
})();
