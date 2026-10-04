/* Week 8 · keep it running.
   The one question it answers: is the business where I think it is, and is it safe?
   An owner summary whose numbers say what they are (measured, estimated or projected), a knowledge
   page people and the AI both read, a backup you can restore, and a 90-day roadmap. */
(function () {
  const h = OH.h;
  const KINDS = { measured: ["Measured", "ok", "Counted from the data, today."], estimated: ["Estimated", "warn", "A guess. It says how it was made."], projected: ["Projected", "blue", "A plan for a day that has not come. Not a fact."] };
  const uid = () => "X" + Date.now().toString(36);
  let picked = null;     // a backup file that was looked into and is not put back yet

  /* Measured numbers are counted, here and now, from what the other pieces keep. No data means null, shown as Needs setup. */
  function measured() {
    const tasks = OH.cc.get("tasks"), deals = OH.cc.get("deals"), email = OH.cc.get("email"), posts = OH.cc.get("posts"), log = OH.cc.get("log"), t = OH.today();
    const open = (d) => d.stage !== "Won" && d.stage !== "Lost";
    return [
      { label: "Cards waiting on you", from: "the board", value: tasks ? tasks.filter((c) => { const s = (c.steps || []).find((x) => !x.done); return c.lane !== "Done" && s && s.who === "you"; }).length : null },
      { label: "Open cards", from: "the board", value: tasks ? tasks.filter((c) => c.lane !== "Done").length : null },
      { label: "Open deals", from: "the pipeline", value: deals ? deals.filter(open).length : null },
      { label: "Deals to follow up today", from: "the pipeline", value: deals ? deals.filter((d) => open(d) && (!d.next_step || !d.next_date || d.next_date <= t)).length : null },
      { label: "Leads from the website", from: "the pipeline", value: deals ? deals.filter((d) => /^website/i.test(d.source || "")).length : null },
      { label: "Emails on the short list", from: "the last inbox review", value: email ? (email.short || []).filter((s) => !s.done).length : null },
      { label: "Posts posted", from: "the posts board", value: posts ? posts.filter((p) => p.status === "Posted").length : null },
      { label: "Lines in the change log", from: "the change log", value: log ? log.length : null }
    ];
  }

  function summaryTab(panel, ctx) {
    const nums = OH.cc.get("numbers"), M = measured();
    const group = (kind, tiles, empty) => h("div", { class: "card", style: "margin-bottom:14px" },
      h("div", { class: "row" }, h("h2", { style: "margin:0" }, KINDS[kind][0]), OH.badge(KINDS[kind][0], KINDS[kind][1]), h("span", { class: "mut", style: "font-size:13.5px" }, KINDS[kind][2])),
      tiles.length ? h("div", { class: "grid g4", style: "margin-top:10px" }, tiles) : h("p", { class: "mut", style: "margin:10px 0 0" }, empty));
    panel.appendChild(OH.note("Every number says what it is. Measured, estimated and projected are three separate kinds, and they are never added together.", ""));
    panel.appendChild(group("measured", M.map((m) => m.value == null ? OH.stat(m.label, "Needs setup", "Nothing brought into " + m.from + " yet", "warn") : OH.stat(m.label, m.value, "Measured: counted from " + m.from + " today")), ""));
    ["estimated", "projected"].forEach((kind) => { const mine = (nums || []).filter((n) => n.kind === kind);
      panel.appendChild(group(kind, mine.map((n) => h("div", { class: "stat" }, h("div", { class: "k" }, n.label), h("div", { class: "v" }, n.value), h("div", { class: "d" }, KINDS[kind][0] + ": " + (n.how || "It does not say how. Add that.")),
        h("select", { "aria-label": "What kind of number is: " + n.label, style: "margin-top:6px;padding:3px 8px;font-size:12.5px", onchange: (ev) => { n.kind = ev.target.value; OH.cc.set("numbers", nums); ctx.redraw(); } },
          ["estimated", "projected"].map((k) => h("option", { value: k, selected: k === kind }, "Marked " + KINDS[k][0].toLowerCase()))))),
        nums ? "No " + kind + " numbers." : "No " + kind + " numbers yet. Add your own below, and say how you got it.")); });
    const label = h("input", { type: "text", placeholder: "What the number is" }), value = h("input", { type: "text", placeholder: "The number" }), how = h("input", { type: "text", placeholder: "How you got it, in your own words" });
    const kind = h("select", null, h("option", { value: "estimated" }, "Estimated: a guess"), h("option", { value: "projected" }, "Projected: a plan"));
    panel.appendChild(h("details", { class: "card" }, h("summary", { style: "font-weight:700;cursor:pointer" }, "Add a number of your own"),
      h("p", { class: "mut" }, "Measured numbers are counted by the page. A number you type is a guess or a plan, so it must say how it was made."),
      h("div", { class: "grid g2" }, OH.field("The number is", label), OH.field("Its value", value)), h("div", { class: "grid g2" }, OH.field("What kind", kind), OH.field("How you got it", how)),
      h("div", { class: "row", style: "margin-top:8px" }, h("button", { class: "primary", onclick: () => { if (!label.value.trim() || !value.value.trim() || !how.value.trim()) return OH.toast("The number, its value and how you got it, all three");
        const all = nums || []; all.push({ id: uid(), kind: kind.value, label: label.value.trim(), value: value.value.trim(), how: how.value.trim() }); OH.cc.set("numbers", all); ctx.redraw(); } }, "Add the number"))));
  }

  function knowledgeTab(panel, ctx) {
    const k = OH.cc.get("knowledge"), cur = k || { voice: "", facts: "", services: "" };
    const box = (v, ph) => { const t = h("textarea", { style: "min-height:110px;font-family:inherit;font-size:14.5px", placeholder: ph }); t.value = v || ""; return t; };
    const voice = box(cur.voice, "How you sound. For example: friendly and direct, short sentences, no slogans."), facts = box(cur.facts, "The facts that must be right: the name, the town, the hours, what you never promise."), services = box(cur.services, "What you sell, one per line.");
    const asText = () => "# Knowledge page\n\n## Voice\n" + voice.value.trim() + "\n\n## Facts\n" + facts.value.trim() + "\n\n## Services\n" + services.value.trim() + "\n";
    if (!k) panel.appendChild(OH.cc.setup("The knowledge page is empty, so nothing is shown as yours.", ["Fill in the three boxes below in your own words, or", "drop in a knowledge file you already have."]));
    panel.appendChild(h("div", { class: "card" }, h("h2", null, "What people and the AI both read"),
      h("p", { class: "mut", style: "margin:-4px 0 6px" }, "Copy this page to the top of any prompt, so the AI writes in your voice and uses your facts. If it is not written here, the AI should not say it."),
      h("div", { class: "grid g3" }, OH.field("Your voice", voice), OH.field("Your facts", facts), OH.field("Your services", services)),
      h("div", { class: "row", style: "margin-top:10px" },
        h("button", { class: "primary", onclick: () => { OH.cc.set("knowledge", { voice: voice.value.trim(), facts: facts.value.trim(), services: services.value.trim() }); OH.cc.log("Updated the knowledge page", "So drafts use the right voice and facts"); OH.toast("Knowledge page saved"); ctx.redraw(); } }, "Save the knowledge page"),
        h("button", { onclick: () => OH.copy(asText(), "Knowledge page copied") }, "Copy it for a prompt"), h("button", { onclick: () => OH.download("knowledge.md", asText(), "text/markdown") }, "Save it as a file"))));
    panel.appendChild(h("details", { class: "card", style: "margin-top:14px" }, h("summary", { style: "font-weight:700;cursor:pointer" }, "Bring in a knowledge file"),
      OH.bringIn({ label: "A knowledge file", hint: "A text file with three headings: Voice, Facts, Services. The file this page saves has that shape.", placeholder: "Or paste the text here", useLabel: "Use this knowledge page",
        onText: (text) => { const part = (name) => { const m = new RegExp("^#+\\s*" + name + "\\s*\\n([\\s\\S]*?)(?=^#+\\s|$(?![\\s\\S]))", "im").exec(text); return m ? m[1].trim() : ""; };
          const next = { voice: part("Voice"), facts: part("Facts"), services: part("Services") };
          if (!next.voice && !next.facts && !next.services) return OH.toast("I could not find the headings Voice, Facts and Services"); OH.cc.set("knowledge", next); OH.toast("Knowledge page brought in"); ctx.redraw(); } })));
  }

  function backupTab(panel, ctx) {
    const b = OH.cc.get("backup") || { last: "", restored: "", copies: {} }, t = OH.today(), age = b.last ? OH.daysBetween(b.last, t) : null;
    const save = () => { OH.cc.set("backup", b); ctx.redraw(); };
    panel.appendChild(h("div", { class: "grid g3", style: "margin-bottom:14px" },
      OH.stat("Last backup", age == null ? "Never" : age === 0 ? "Today" : age + (age === 1 ? " day ago" : " days ago"), b.last ? OH.niceDate(b.last) : "Save one now", age == null ? "bad" : age > 7 ? "warn" : "ok"),
      OH.stat("Copies in place", ["computer", "drive", "away"].filter((c) => b.copies && b.copies[c]).length + " of 3", "Three copies, two places, one away"),
      OH.stat("Restored on purpose", b.restored ? OH.niceDate(b.restored) : "Not yet", "A backup you never restored is a hope", b.restored ? "ok" : "warn")));
    panel.appendChild(h("div", { class: "card", style: "margin-bottom:14px" }, h("h2", null, "1. Save a backup file"),
      h("p", { class: "mut", style: "margin:-4px 0 8px" }, "One file with everything the command center keeps in this browser: both the sample business and your own. It goes to your Downloads folder. Nothing is sent anywhere."),
      h("button", { class: "primary", onclick: () => { b.last = t; OH.cc.set("backup", b);
        OH.download("command-center-backup-" + t + ".json", JSON.stringify({ app: "office-hours-command-center", made: t, keys: OH.store.all() }, null, 1), "application/json");
        OH.cc.log("Saved a backup file", "command-center-backup-" + t + ".json"); OH.toast("Backup file saved to your downloads"); ctx.redraw(); } }, "Save a backup file")));
    panel.appendChild(h("div", { class: "card", style: "margin-bottom:14px" }, h("h2", null, "2. Three copies, two places, one away from the computer"),
      [["computer", "Copy 1 is on this computer"], ["drive", "Copy 2 is on a second drive or a USB stick"], ["away", "Copy 3 is away from the computer: a cloud drive you already use, or a drive kept somewhere else"]]
        .map((c) => OH.check(c[1], !!(b.copies && b.copies[c[0]]), (on) => { b.copies = b.copies || {}; b.copies[c[0]] = on; save(); }))));
    panel.appendChild(h("div", { class: "card" }, h("h2", null, "3. Restore one file on purpose"),
      h("p", { class: "mut", style: "margin:-4px 0 8px" }, "Choose a backup file. The page shows what is in it first. Putting it back replaces what this browser holds for those entries. Nothing on your computer is removed."),
      OH.bringIn({ label: "A backup file", hint: "The file named command-center-backup with a date, from your Downloads folder.", accept: ".json,application/json", placeholder: "Or paste the contents of the file here", useLabel: "Look inside this file",
        onText: (text, name) => { let data = null; try { data = JSON.parse(text); } catch (e) { data = null; }
          if (!data || data.app !== "office-hours-command-center" || !data.keys) return OH.toast("That is not a command center backup file");
          picked = { name: name || "pasted text", data: data }; ctx.redraw(); } }),
      picked ? h("div", { class: "note", style: "margin-top:12px" }, h("b", null, picked.name), h("div", null, "Made " + OH.niceDate(picked.data.made) + ". It holds " + Object.keys(picked.data.keys).length + " entries: "
        + (Object.keys(picked.data.keys).filter((k) => /^cc:[os]:/.test(k)).map((k) => k.replace("cc:o:", "your ").replace("cc:s:", "sample ")).join(", ") || "no command center data") + "."),
        h("div", { class: "row", style: "margin-top:8px" }, h("button", { class: "primary", onclick: () => {
          if (!window.confirm("Put this backup back? It replaces what this browser holds for the entries in the file.")) return;
          const made = picked.data.made; OH.store.putAll(picked.data.keys); picked = null;
          const nb = OH.cc.get("backup") || { last: "", copies: {} }; nb.restored = t; OH.cc.set("backup", nb);
          OH.cc.log("Restored a backup on purpose", "The file made " + made); OH.toast("Backup put back"); ctx.redraw(); } }, "Put this backup back"),
          h("button", { onclick: () => { picked = null; ctx.redraw(); } }, "Not now"))) : null));
  }

  function roadmapTab(panel, ctx) {
    const list = OH.cc.get("roadmap"), HOW = { build: ["Build next", "blue"], hire: ["Hire out", "warn"] };
    const save = () => { OH.cc.set("roadmap", list); ctx.redraw(); };
    panel.appendChild(OH.note("The human-only rule: send, pay and post are always your steps. Build next means you make it yourself in class. Hire out means it runs by itself, connects live systems or serves a team.", ""));
    if (!list) panel.appendChild(OH.cc.setup("No roadmap yet.", ["Add one line below for the next 30 days.", "Say whether you will build it next or hire it out."]));
    else panel.appendChild(h("div", { class: "piles" }, [30, 60, 90].map((d) => { const mine = list.filter((r) => r.days === d);
      return h("div", { class: "pile" }, h("h3", null, "The next " + d + " days", h("span", { class: "badge" }, mine.length)), mine.map((r) => h("div", { class: "item" },
        OH.check(r.what, r.done, (on) => { r.done = on; save(); }), OH.badge(HOW[r.how][0], HOW[r.how][1]),
        h("select", { "aria-label": "Build or hire: " + r.what, onchange: (ev) => { r.how = ev.target.value; OH.cc.log((r.how === "hire" ? "Decided to hire out: " : "Decided to build next: ") + r.what, "Roadmap", "You", true); save(); } },
          Object.keys(HOW).map((k) => h("option", { value: k, selected: k === r.how }, k === r.how ? "Marked " + HOW[k][0].toLowerCase() : "Change to " + HOW[k][0].toLowerCase())))))); })));
    const what = h("input", { type: "text", placeholder: "What you want next" }), days = h("select", null, [30, 60, 90].map((d) => h("option", { value: d }, "In the next " + d + " days")));
    const how = h("select", null, h("option", { value: "build" }, "Build next"), h("option", { value: "hire" }, "Hire out"));
    panel.appendChild(h("details", { class: "card", style: "margin-top:14px", open: !list }, h("summary", { style: "font-weight:700;cursor:pointer" }, "Add a line to the roadmap"),
      h("div", { class: "grid g3" }, OH.field("What", what), OH.field("When", days), OH.field("Build or hire", how)),
      h("div", { class: "row", style: "margin-top:8px" }, h("button", { class: "primary", onclick: () => { if (!what.value.trim()) return OH.toast("Say what you want next first");
        const all = list || []; all.push({ id: uid(), days: +days.value, how: how.value, done: false, what: what.value.trim() }); OH.cc.set("roadmap", all); ctx.redraw(); } }, "Add the line"))));
  }

  function render(root, ctx) {
    root.appendChild(OH.tabs("p8", [
      { id: "summary", label: "Summary", render: (p) => summaryTab(p, ctx) },
      { id: "knowledge", label: "Knowledge", render: (p) => knowledgeTab(p, ctx) },
      { id: "backup", label: "Backup", render: (p) => backupTab(p, ctx) },
      { id: "roadmap", label: "Roadmap", render: (p) => roadmapTab(p, ctx) }
    ]));
  }

  OH.register({
    piece: 8, id: "week-8-keep-running", title: "Keep it running",
    intro: "Numbers that say what they are, a knowledge page, a backup you can restore, and a roadmap for the next 90 days.",
    data: ["numbers", "knowledge", "backup", "roadmap"],
    render: render,
    summary: function () {
      const b = OH.cc.get("backup"); if (!b || !b.last) return { label: "Last backup", value: "Never", tone: "bad" };
      const age = OH.daysBetween(b.last, OH.today()); return { label: "Last backup", value: age === 0 ? "Today" : age + (age === 1 ? " day ago" : " days ago"), tone: age > 7 ? "warn" : "ok" };
    }
  });
})();
