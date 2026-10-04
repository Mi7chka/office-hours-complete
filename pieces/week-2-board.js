/* Week 2 · the board and the change log.
   The one question it answers: what is open, and what is waiting on me?
   Three lanes of cards. Every card says what done means, and every step has an owner: you or the AI.
   The change log says when, who, what and why. Works with the sample business or your own tasks. */
(function () {
  const h = OH.h, LANES = ["To do", "Doing", "Done"];
  const nextStep = (c) => (c.steps || []).find((s) => !s.done);
  const waitingOnYou = (list) => list.filter((c) => c.lane !== "Done" && nextStep(c) && nextStep(c).who === "you");
  const noOwner = (c) => c.lane !== "Done" && (c.steps || []).some((s) => !s.done && s.who !== "you" && s.who !== "ai");
  const whoName = (w) => (w === "you" ? "You" : w === "ai" ? "AI" : "No owner");
  const uid = (i) => "T" + Date.now().toString(36) + (i || 0);

  /* Steps as text: "you: Call the agent | ai: Draft the note (done)". One step per line or per bar. */
  const stepsText = (c) => (c.steps || []).map((s) => (s.who ? s.who + ": " : "") + s.text + (s.done ? " (done)" : "")).join(" | ");
  function parseSteps(text) {
    return String(text || "").split(/\n|\|/).map((s) => s.trim()).filter(Boolean).map((s) => {
      const done = /\(done\)\s*$/i.test(s); s = s.replace(/\(done\)\s*$/i, "").trim();
      const m = /^(you|me|ai)\s*:\s*(.*)$/i.exec(s);
      return { who: m ? (m[1].toLowerCase() === "ai" ? "ai" : "you") : "", text: m ? m[2] : s, done: done };
    });
  }
  /* A tasks file (a sheet with the headings title, lane, done means, due, steps) or a plain list, one task per line. */
  function parseTasks(text) {
    const rows = OH.rows(text);
    if (rows.length && rows[0].title != null) return rows.filter((r) => r.title).map((r, i) => ({ id: uid(i), title: r.title,
      lane: LANES.find((l) => l.toLowerCase() === String(r.lane || "").toLowerCase()) || "To do", done_means: r["done means"] || r.done_means || "",
      due: /^\d{4}-\d\d-\d\d$/.test(r.due || "") ? r.due : "", steps: parseSteps(r.steps) }));
    return String(text || "").split("\n").map((l) => l.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, "").trim()).filter(Boolean)
      .map((l, i) => ({ id: uid(i), title: l, lane: "To do", done_means: "", due: "", steps: [] }));
  }
  const tasksCSV = (list) => OH.toCSV([["title", "lane", "done means", "due", "steps"]].concat(list.map((c) => [c.title, c.lane, c.done_means, c.due, stepsText(c)])));

  function board(panel, ctx) {
    const own = OH.cc.own(), list = OH.cc.get("tasks");
    const save = () => { OH.cc.set("tasks", list); ctx.redraw(); };
    if (!list) panel.appendChild(OH.cc.setup("No tasks are brought in yet, so the board is empty and no number is shown.", ["Add one card below, or", "paste your to-do list under Bring in my tasks, one task per line."]));
    else {
      // waiting on you
      const mine = waitingOnYou(list), lost = list.filter(noOwner);
      panel.appendChild(h("div", { class: "card first", style: "margin-bottom:14px" }, h("div", { class: "row" }, h("h2", { style: "margin:0" }, "Waiting on you"), h("span", { class: "spacer" }), OH.badge(mine.length + (mine.length === 1 ? " card" : " cards"), mine.length ? "warn" : "ok")),
        mine.length ? mine.map((c) => OH.check(nextStep(c).text, false, () => { nextStep(c).done = true; save(); }, c.title + (c.due ? " · due " + OH.niceDate(c.due) : "")))
          : h("p", { class: "mut", style: "margin:6px 0 0" }, "Nothing is waiting on you. Every next step belongs to the AI, or the card is done."),
        lost.length ? OH.note(lost.length + (lost.length === 1 ? " card has a step with no owner: " : " cards have a step with no owner: ") + lost.map((c) => c.title).join(", ") + ". Choose who does it, you or the AI.", "warn") : null));
      // the lanes
      panel.appendChild(h("div", { class: "piles" }, LANES.map((lane) => { const cards = list.filter((c) => c.lane === lane);
        return h("div", { class: "pile" }, h("h3", null, lane, h("span", { class: "badge" }, cards.length)), cards.map((c) => h("div", { class: "item" + (noOwner(c) ? " flag" : "") },
          h("b", null, c.title),
          c.done_means ? h("span", { class: "sub" }, "Done means: " + c.done_means) : null,
          h("div", { class: "row", style: "gap:4px;margin-top:5px" },
            c.due ? OH.badge("Due " + OH.niceDate(c.due), lane === "Done" ? "" : c.due < OH.today() ? "bad" : c.due === OH.today() ? "warn" : "") : null,
            c.done_means ? null : OH.badge("Say what done means", "warn"), noOwner(c) ? OH.badge("No owner", "bad") : null, (c.steps || []).length ? null : OH.badge("No steps yet", "")),
          (c.steps || []).map((s) => h("div", { class: "row", style: "gap:6px;font-size:13px;align-items:flex-start;margin-top:4px;flex-wrap:nowrap" },
            h("input", { type: "checkbox", checked: s.done, "aria-label": "Step done: " + s.text, style: "margin-top:3px", onchange: (ev) => { s.done = ev.target.checked; save(); } }),
            s.who ? h("span", { class: s.done ? "mut" : "" }, h("b", { style: "display:inline" }, whoName(s.who) + ": "), s.text)
              : h("span", null, s.text, h("select", { "aria-label": "Who does this step: " + s.text, onchange: (ev) => { s.who = ev.target.value; save(); } }, h("option", { value: "" }, "Who does this?"), h("option", { value: "you" }, "You"), h("option", { value: "ai" }, "The AI"))))),
          h("select", { "aria-label": "Move the card: " + c.title, onchange: (ev) => { c.lane = ev.target.value; if (c.lane === "Done") OH.cc.log("Done: " + c.title, c.done_means ? "Done means: " + c.done_means : ""); save(); } },
            LANES.map((x) => h("option", { value: x, selected: x === lane }, x === lane ? "In " + x : "Move to " + x)))))); })));
    }

    // add a card
    const title = h("input", { type: "text", placeholder: "For example: Send the Hartwell quote" }), means = h("input", { type: "text", placeholder: "What will be true when this is done" });
    const due = h("input", { type: "date" }), steps = h("textarea", { style: "min-height:90px", placeholder: "One step per line. Start each with you: or ai:\nai: Draft the quote\nyou: Check it and send it" });
    panel.appendChild(h("details", { class: "card", style: "margin-top:14px", open: !list }, h("summary", { style: "font-weight:700;cursor:pointer" }, "Add a card"),
      h("div", { class: "grid g2" }, OH.field("The task", title), OH.field("Done means", means)),
      h("div", { class: "grid g2" }, OH.field("Due", due), OH.field("Steps, and who does each", steps)),
      h("div", { class: "row", style: "margin-top:8px" }, h("button", { class: "primary", onclick: () => {
        if (!title.value.trim()) return OH.toast("Give the task a name first");
        const cards = list || []; cards.push({ id: uid(), title: title.value.trim(), lane: "To do", done_means: means.value.trim(), due: due.value || "", steps: parseSteps(steps.value) });
        OH.cc.set("tasks", cards); OH.cc.log("Added the card: " + title.value.trim(), means.value.trim() ? "Done means: " + means.value.trim() : ""); OH.toast("Card added to To do"); ctx.redraw(); } }, "Add the card"))));

    // bring tasks in, save the tasks file
    panel.appendChild(h("details", { class: "card", style: "margin-top:14px" }, h("summary", { style: "font-weight:700;cursor:pointer" }, "Bring in my tasks"),
      OH.bringIn({ label: "A tasks file, or a plain list", hint: "A sheet saved as CSV with the headings title, lane, done means, due, steps. Or a plain to-do list, one task per line.",
        placeholder: "Or paste your to-do list here, one task per line", sample: own ? null : OH.sample.cc.messyList, sampleLabel: "Load the sample messy list", useLabel: "Make these into cards",
        onText: (text) => { const cards = parseTasks(text); if (!cards.length) return OH.toast("I could not find any tasks in that");
          OH.cc.set("tasks", (list || []).concat(cards)); OH.cc.log("Brought in " + cards.length + (cards.length === 1 ? " task" : " tasks"), "From a file or a pasted list"); OH.toast(cards.length + " cards added to To do"); ctx.redraw(); } }),
      list ? h("div", { class: "row", style: "margin-top:10px" }, h("button", { onclick: () => OH.download("tasks.csv", tasksCSV(list), "text/csv") }, "Save my tasks file"), h("span", { class: "mut", style: "font-size:13px" }, "A file for a spreadsheet, named tasks.csv.")) : null));
  }

  function changeLog(panel, ctx) {
    const log = OH.cc.get("log");
    if (!log) panel.appendChild(OH.cc.setup("The change log has no lines yet.", ["Add your first line below: what changed, and why."]));
    else panel.appendChild(OH.table([{ h: "When", f: (l) => OH.niceDate(l.at), s: (l) => l.at }, { h: "Who", f: (l) => l.who },
      { h: "What", f: (l) => h("span", null, h("b", null, l.what), l.decision ? h("span", null, " ", OH.badge("Decision", "blue")) : null) }, { h: "Why", f: (l) => h("span", { class: "mut" }, l.why) }],
      log.slice().reverse(), { empty: "No lines yet." }));
    const what = h("input", { type: "text", placeholder: "What changed" }), why = h("input", { type: "text", placeholder: "Why" });
    const who = h("select", null, h("option", { value: "You" }, "You"), h("option", { value: "AI" }, "The AI")), dec = h("input", { type: "checkbox" });
    panel.appendChild(h("div", { class: "card", style: "margin-top:14px" }, h("h2", null, "Add a line"),
      h("div", { class: "grid g3" }, OH.field("What changed", what), OH.field("Why", why), OH.field("Who", who)),
      h("label", { class: "check" }, dec, h("span", null, "A choice was made. Mark this line as a decision.")),
      h("div", { class: "row", style: "margin-top:8px" },
        h("button", { class: "primary", onclick: () => { if (!what.value.trim()) return OH.toast("Say what changed first"); OH.cc.log(what.value.trim(), why.value.trim(), who.value, dec.checked); ctx.redraw(); } }, "Add to the change log"),
        log ? h("button", { onclick: () => OH.download("change-log.md", "# Change log\n\n| When | Who | What | Why |\n|---|---|---|---|\n" + log.map((l) => "| " + [l.at, l.who, (l.decision ? "Decision: " : "") + l.what, l.why].join(" | ") + " |").join("\n") + "\n", "text/markdown") }, "Save my change log file") : null)));
  }

  function render(root, ctx) {
    const list = OH.cc.get("tasks"), log = OH.cc.get("log");
    root.appendChild(OH.tabs("p2", [
      { id: "board", label: "Board", count: list ? list.filter((c) => c.lane !== "Done").length : null, render: (p) => board(p, ctx) },
      { id: "log", label: "Change log", count: log ? log.length : null, render: (p) => changeLog(p, ctx) }
    ]));
  }

  OH.register({
    piece: 2, id: "week-2-board", title: "The board",
    intro: "Every open task on one board. Each card says what done means and who does each step.",
    data: ["tasks", "log"],
    render: render,
    summary: function () {
      const list = OH.cc.get("tasks"); if (!list) return { label: "Waiting on you", value: "Needs setup", tone: "warn" };
      const n = waitingOnYou(list).length; return { label: "Waiting on you", value: n + (n === 1 ? " card" : " cards"), tone: n ? "warn" : "ok" };
    }
  });
})();
