/* Week 7 · plan my day, and the day page.
   The one question it answers: what do I do first today, and what comes after?
   A routine you run each morning. It reads the board, the pipeline, the email short list and
   today's calendar, hands them to an AI with one prompt, and reads the plan that comes back:
   the one thing first, then the rest, with every message ready to copy. It never sends. */
(function () {
  const h = OH.h, HEADS = ["DAY PLAN", "MESSAGES", "LEFT OUT", "UNSURE"];
  const STOP = "with that this from your then they them have what when will about into today their there after before would could should".split(" ");
  const words = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9' ]/g, " ").split(/\s+/).filter((w) => w.length >= 4 && STOP.indexOf(w) < 0);

  /* What the plan reads. Each list is null when that piece has no data: it is left out, never made up. */
  function lists() {
    const tasks = OH.cc.get("tasks"), deals = OH.cc.get("deals"), email = OH.cc.get("email"), cal = OH.cc.get("calendar"), t = OH.today(), out = { board: null, pipeline: null, email: null, calendar: null };
    if (tasks) out.board = tasks.filter((c) => c.lane !== "Done").map((c) => ({ c: c, s: (c.steps || []).find((s) => !s.done) })).filter((x) => x.s && x.s.who === "you")
      .map((x) => ({ text: x.s.text, match: x.s.text + " " + x.c.title, line: x.s.text + " [card: " + x.c.title + (x.c.due ? ", due " + x.c.due : "") + "]" }));
    if (deals) out.pipeline = deals.filter((d) => d.stage !== "Won" && d.stage !== "Lost" && (!d.next_step || !d.next_date || d.next_date <= t))
      .map((d) => ({ text: d.client + ": " + (d.next_step || "decide the next step"), match: d.client + " " + (d.contact || "") + " " + (d.what || ""),
        line: d.client + (d.contact && d.contact !== d.client ? " (" + d.contact + ")" : "") + ": " + (d.next_step || "no next step yet") + (d.next_date ? " [was due " + d.next_date + "]" : "") + ". Wants: " + (d.what || "not written") + ". Notes: " + (d.notes || "none") }));
    if (email) out.email = (email.short || []).filter((s) => !s.done).map((s) => ({ text: s.task, match: s.task, line: s.task + (s.due ? " [" + s.due + "]" : "") }));
    if (cal && cal.date === t) out.calendar = (cal.events || []).map((e) => ({ text: (e.time ? e.time + " " : "") + e.what, match: e.what, line: (e.time ? e.time + " " : "") + e.what }));
    return out;
  }
  const NAMES = { board: "BOARD (waiting on me)", pipeline: "PIPELINE (deals to follow up today)", email: "EMAIL (the short list)", calendar: "CALENDAR (today)" };
  const listText = (L) => Object.keys(NAMES).map((k) => NAMES[k] + "\n" + (L[k] ? (L[k].length ? L[k].map((x) => "- " + x.line).join("\n") : "- nothing today") : "- not set up. Leave it out.")).join("\n\n");

  function parsePlan(text) {
    const out = { date: OH.today(), first: null, then: [], messages: [], left: [], unsure: [] }; let sec = "", msg = null;
    const src = (s) => String(s || "").replace(/^from:\s*/i, "").trim().toLowerCase();
    String(text || "").replace(/\r/g, "").split("\n").forEach((raw) => {
      const line = raw.trim(), up = line.toUpperCase().replace(/[*#:]/g, "").trim();
      if (msg) { if (up === "END" || up === "END MESSAGE") { msg.body = msg.body.trim(); out.messages.push(msg); msg = null; } else msg.body += raw + "\n"; return; }
      if (HEADS.indexOf(up) >= 0) { sec = up; return; }
      if (!line) return;
      const parts = line.replace(/^[-*]\s*/, "").split("|").map((x) => x.trim()), kind = (parts[0] || "").toUpperCase();
      if (kind === "FIRST" && parts.length >= 2) out.first = { text: parts[1], from: src(parts[2]), done: false };
      else if (kind === "THEN" && parts.length >= 3) out.then.push({ time: parts[1], text: parts[2], from: src(parts[3]), done: false });
      else if (kind === "MESSAGE") msg = { to: (parts[1] || "").replace(/^to:\s*/i, ""), subject: (parts[2] || "").replace(/^subject:\s*/i, ""), body: "" };
      else if (sec === "LEFT OUT") out.left.push(parts.join(" | "));
      else if (sec === "UNSURE") out.unsure.push(parts.join(" | "));
    });
    if (msg) { msg.body = msg.body.trim(); out.messages.push(msg); }
    return out;
  }
  /* A plain check, no AI: which things on the lists share fewer than two words with every line of the plan? */
  function missing(plan, L) {
    const lines = [plan.first ? plan.first.text : ""].concat(plan.then.map((t) => t.text), plan.left).map(words), miss = [];
    Object.keys(NAMES).forEach((k) => (L[k] || []).forEach((item) => { const w = words(item.match);
      if (!lines.some((l) => w.filter((x) => l.indexOf(x) >= 0).length >= Math.min(2, w.length))) miss.push({ from: k, text: item.text }); }));
    return miss;
  }
  /* "9:00 Site visit", "1:30 PM Call the agent", or a calendar file (.ics) with today's events. */
  function parseCalendar(text) {
    const t = OH.today(), pad = (n) => String(n).padStart(2, "0");
    if (/BEGIN:VCALENDAR/.test(text)) return text.split("BEGIN:VEVENT").slice(1).map((ev) => {
      const m = /DTSTART[^:\n]*:(\d{4})(\d\d)(\d\d)(?:T(\d\d)(\d\d)\d\d(Z)?)?/.exec(ev), s = /SUMMARY[^:\n]*:(.*)/.exec(ev); if (!m || !s) return null;
      const d = m[4] ? (m[6] ? new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5])) : new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5])) : new Date(+m[1], +m[2] - 1, +m[3], 12);
      const day = d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
      return day === t ? { time: m[4] ? pad(d.getHours()) + ":" + pad(d.getMinutes()) : "", what: s[1].trim().replace(/\\,/g, ",") } : null; }).filter(Boolean).sort((a, b) => (a.time < b.time ? -1 : 1));
    return text.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => {
      const m = /^(\d{1,2})(?::(\d\d))?\s*(am|pm)?\s*[-\u2013\u2014:]?\s+(.+)$/i.exec(l); if (!m) return { time: "", what: l };
      let hr = +m[1]; const ap = (m[3] || "").toLowerCase(); if (ap === "pm" && hr < 12) hr += 12; if (ap === "am" && hr === 12) hr = 0;
      return { time: pad(hr) + ":" + (m[2] || "00"), what: m[4] }; });
  }

  function render(root, ctx) {
    const own = OH.cc.own(), L = lists(), plan = OH.cc.get("day"), t = OH.today(), fresh = plan && plan.date === t;
    const save = () => { OH.cc.set("day", plan); ctx.redraw(); };

    // what the plan reads
    const PIECE = { board: [2, "Board", "waiting on you"], pipeline: [4, "Pipeline", "to follow up today"], email: [3, "Email", "on the short list"], calendar: [0, "Calendar", "events today"] };
    root.appendChild(h("div", { class: "grid g4", style: "margin-bottom:14px" }, Object.keys(PIECE).map((k) => { const p = PIECE[k];
      return L[k] ? OH.stat(p[1], L[k].length, p[2], "") : OH.stat(p[1], p[0] && !OH.pieces[p[0]] ? "Not built yet" : "Needs setup", p[0] && !OH.pieces[p[0]] ? "Week " + p[0] : k === "calendar" ? "Paste today's events below" : "Nothing brought in", "warn"); })));

    if (!plan) root.appendChild(OH.cc.setup("No plan is written yet, so this page shows nothing made up.", ["Open Plan my day, below.", "Copy the prompt and the lists into the Claude app or Claude Code.", "Bring the plan back: paste it, or drop the file you saved it in."]));
    else {
      if (!fresh) root.appendChild(OH.note("This plan is from " + OH.niceDate(plan.date) + ". Run plan my day for today.", "warn"));
      const all = (plan.first ? [plan.first] : []).concat(plan.then), done = all.filter((x) => x.done).length;
      if (plan.first) root.appendChild(h("div", { class: "card first", style: "margin-bottom:14px" }, h("div", { class: "kicker" }, "First"),
        h("label", { class: "check" + (plan.first.done ? " done" : "") }, h("input", { type: "checkbox", checked: !!plan.first.done, onchange: (ev) => { plan.first.done = ev.target.checked; save(); } }), h("span", { class: "big" }, plan.first.text)),
        plan.first.from ? OH.badge("from the " + plan.first.from) : null));
      root.appendChild(h("div", { class: "card", style: "margin-bottom:14px" }, h("div", { class: "row" }, h("h2", { style: "margin:0" }, "Then"), h("span", { class: "spacer" }), OH.badge(done + " of " + all.length + " done", done === all.length ? "ok" : "")),
        plan.then.map((x) => h("label", { class: "check" + (x.done ? " done" : "") }, h("input", { type: "checkbox", checked: !!x.done, onchange: (ev) => { x.done = ev.target.checked; save(); } }),
          h("span", null, x.time ? h("b", null, x.time + " ") : null, x.text, " ", x.from ? OH.badge(x.from) : OH.badge("no source", "bad")))),
        h("div", { class: "row", style: "margin-top:10px" }, h("button", { onclick: () => {
          OH.cc.set("today", { date: t, first: plan.first ? plan.first.text : (plan.then[0] || {}).text || "", firstDone: false, list: plan.then.slice(plan.first ? 0 : 1, plan.first ? 5 : 6).map((x) => ({ text: (x.time ? x.time + " " : "") + x.text, done: false })) });
          OH.toast("The Today page now shows this plan"); } }, "Put this plan on the Today page"), h("span", { class: "mut", style: "font-size:13px" }, "The Today page holds the first thing and five more."))));
      // messages
      root.appendChild(h("div", { class: "card", style: "margin-bottom:14px" }, h("h2", null, "Messages ready to copy"), OH.note("This page never sends. Copy a message, read it once more, and send it yourself.", ""),
        plan.messages.length ? plan.messages.map((m) => h("div", { class: "item" }, h("b", null, "To " + m.to + " · " + m.subject), h("pre", { class: "code", style: "margin-top:6px" }, m.body),
          h("div", { class: "row", style: "margin-top:6px" }, h("button", { class: "small", onclick: () => OH.copy(m.body, "Message copied") }, "Copy the message")))) : h("p", { class: "mut" }, "No messages in this plan.")));
      // check it against the lists
      const miss = fresh ? missing(plan, L) : [];
      root.appendChild(h("div", { class: "card", style: "margin-bottom:14px" }, h("h2", null, "Check it against your lists"),
        h("p", { class: "mut", style: "margin:-4px 0 8px" }, "Do not ask whether the plan is right. Ask what it left out."),
        h("b", null, "Left out, and it did not say so"),
        miss.length ? h("ul", { style: "margin:4px 0 10px;padding-left:20px" }, miss.map((m) => h("li", null, m.text + " ", OH.badge(m.from, "bad")))) : h("p", { class: "ok", style: "margin:4px 0 10px" }, fresh ? "Nothing found. Everything on your lists is in the plan, or the plan says why not." : "Run today's plan to check it."),
        h("b", null, "Left out, and it said why"),
        plan.left.length ? h("ul", { style: "margin:4px 0 10px;padding-left:20px" }, plan.left.map((x) => h("li", null, x))) : h("p", { class: "mut", style: "margin:4px 0 10px" }, "Nothing."),
        plan.unsure.length ? h("div", null, h("b", null, "What it was unsure about"), h("ul", { style: "margin:4px 0 0;padding-left:20px" }, plan.unsure.map((x) => h("li", null, x)))) : null,
        h("p", { class: "mut", style: "font-size:13px;margin:10px 0 0" }, "This check compares words, with no AI. It can miss things. Read the lists yourself too.")));
      // end of the day
      root.appendChild(h("div", { class: "card", style: "margin-bottom:14px" }, h("h2", null, "End of the day"), h("p", { style: "margin:0 0 8px" }, done + " of " + all.length + " done. What is left goes on tomorrow's plan."),
        h("button", { onclick: () => { OH.cc.log("Day wrap: " + done + " of " + all.length + " done", all.filter((x) => !x.done).length ? "Left for tomorrow: " + all.filter((x) => !x.done).map((x) => x.text).slice(0, 3).join("; ") : "Everything on the plan is done"); OH.toast("The wrap is in the change log"); } }, "Write the wrap in the change log")));
    }

    // plan my day: the calendar in, the prompt out, the plan back
    const cal = OH.cc.get("calendar");
    root.appendChild(h("details", { class: "card", open: !plan || !fresh }, h("summary", { style: "font-weight:700;cursor:pointer" }, "Plan my day"),
      h("p", { class: "mut" }, "Three steps, each morning: today's calendar, the prompt, the plan."),
      h("h3", null, "1. Today's calendar"),
      h("p", { class: "mut", style: "margin:0 0 6px" }, "If your Claude plan has the Google Calendar connector, Claude can read today's events itself. It only reads. If not, paste them here, one per line, or drop a calendar file you exported." + (cal && cal.date === t ? " " + cal.events.length + " events are in for today." : "")),
      OH.bringIn({ label: "Today's events", hint: "One event per line, with the time first: 9:00 Site visit. A calendar file (.ics) works too.", accept: ".ics,.txt,.csv,text/*", placeholder: "9:00 Site visit\n1:30 PM Call the agent", sample: own ? null : OH.sample.cc.calendarText, sampleLabel: "Load the sample events", useLabel: "Use these events",
        onText: (text) => { const ev = parseCalendar(text); if (!ev.length) return OH.toast("I could not find any events for today in that"); OH.cc.set("calendar", { date: t, events: ev }); OH.toast(ev.length + " events for today"); ctx.redraw(); } }),
      h("h3", { style: "margin-top:14px" }, "2. The prompt and your lists"),
      OH.promptBox({ prompt: OH.sample.cc.planPrompt, dataLabel: "lists", height: 170, data: () => listText(lists()) }).el,
      h("h3", { style: "margin-top:14px" }, "3. Bring the plan back"),
      OH.bringIn({ label: "The plan the AI wrote", hint: "Paste the AI's whole answer, or drop the file you saved it in.", placeholder: "Or paste the AI's answer here", sample: own ? null : OH.sample.cc.dayAnswer, sampleLabel: "No AI handy? Load the sample answer", useLabel: "Use this plan",
        onText: (text) => { const p = parsePlan(text); if (!p.first && !p.then.length) return OH.toast("I could not find the plan. Ask the AI to hand it back in the exact shape the prompt shows.");
          OH.cc.set("day", p); OH.cc.log("Ran plan my day: " + (p.then.length + (p.first ? 1 : 0)) + " lines", "The morning routine"); OH.toast("Today's plan is in"); ctx.redraw(); } })));

    // my runbook: the line written at the Ship step of each week
    const rb = OH.runbookLines();
    root.appendChild(h("div", { class: "card", style: "margin-top:14px" }, h("h2", null, "My runbook"), h("p", { class: "mut", style: "margin:-4px 0 8px" }, "One line per piece: the step, the sign it worked, how to undo it. You write each one at the Ship step."),
      rb.length ? OH.table([{ h: "Piece", f: (r) => h("b", null, "Week " + r.week) }, { h: "The step", f: (r) => r.step }, { h: "The sign it worked", f: (r) => r.sign }, { h: "How to undo it", f: (r) => r.undo }], rb)
        : h("p", { class: "mut" }, "No runbook lines yet. Open How it was built on any piece and write one under Ship.")));
  }

  OH.register({
    piece: 7, id: "week-7-day-plan", title: "The day plan",
    intro: "A routine you run each morning. It reads your board, your pipeline, your email short list and your calendar, and writes the day: one thing first, then the rest.",
    data: ["day", "calendar"],
    render: render,
    summary: function () {
      const plan = OH.cc.get("day"); if (!plan) return { label: "Today's plan", value: "Needs setup", tone: "warn" };
      if (plan.date !== OH.today()) return { label: "Today's plan", value: "Not written yet", tone: "warn" };
      const all = (plan.first ? [plan.first] : []).concat(plan.then), done = all.filter((x) => x.done).length;
      return { label: "Today's plan", value: done + " of " + all.length + " done", tone: done === all.length ? "ok" : "" };
    }
  });
})();
