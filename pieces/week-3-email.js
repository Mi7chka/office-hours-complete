/* Week 3 · the email short list.
   The one question it answers: which emails need me, and what do I say?
   An inbox review you run when you ask. The AI sorts every email into four piles, hands back the
   short list only you can act on, and drafts replies to check. This page never sends anything. */
(function () {
  const h = OH.h, PILES = ["REPLY TODAY", "CAN WAIT", "FYI", "JUNK"];
  const NAMES = { "REPLY TODAY": "Reply today", "CAN WAIT": "Can wait", "FYI": "FYI", "JUNK": "Junk" };
  const HEADS = ["REVIEW", "SHORT LIST", "DRAFTS", "LOOKS FAKE", "UNSURE"];
  const openShort = (r) => r.short.filter((s) => !s.done).length;

  /* Read the review the AI handed back. The shape is the one the review prompt asks for. */
  function parseReview(text) {
    const out = { at: OH.today(), emails: [], short: [], drafts: [], fake: [], unsure: [] }; let sec = "", draft = null;
    String(text || "").replace(/\r/g, "").split("\n").forEach((raw) => {
      const line = raw.trim(), up = line.toUpperCase().replace(/[*#:]/g, "").trim();
      if (draft) { if (up === "END" || up === "END DRAFT") { draft.body = draft.body.trim(); out.drafts.push(draft); draft = null; } else draft.body += raw + "\n"; return; }
      if (HEADS.indexOf(up) >= 0) { sec = up; return; }
      if (!line) return;
      const parts = line.replace(/^[-*]\s*/, "").split("|").map((x) => x.trim()), m = /(\d+)/.exec(parts[0] || ""), n = m ? +m[1] : 0;
      if (sec === "REVIEW" && n && parts.length >= 4) { const pile = PILES.find((p) => parts[1].toUpperCase().indexOf(p) >= 0); if (pile) out.emails.push({ n: n, pile: pile, from: parts[2], subject: parts[3], why: parts[4] || "" }); }
      else if (sec === "SHORT LIST" && n && parts.length >= 2) out.short.push({ n: n, task: parts[1], due: parts[2] || "", done: false });
      else if (sec === "DRAFTS" && /^DRAFT/i.test(parts[0])) draft = { n: n, to: (parts[1] || "").replace(/^to:\s*/i, ""), subject: (parts[2] || "").replace(/^subject:\s*/i, ""), body: "", checked: false };
      else if (sec === "LOOKS FAKE" && n) out.fake.push({ n: n, why: parts[1] || "" });
      else if (sec === "UNSURE") out.unsure.push(line.replace(/^[-*]\s*/, ""));
    });
    if (draft) { draft.body = draft.body.trim(); out.drafts.push(draft); }
    return out;
  }

  function render(root, ctx) {
    const own = OH.cc.own(), r = OH.cc.get("email");
    const save = () => { OH.cc.set("email", r); ctx.redraw(); };

    if (!r) root.appendChild(OH.cc.setup("No inbox review is brought in yet, so there is no short list and no number to show.",
      ["Open Run the review, below, and copy the review prompt.", "If your Claude plan has the Gmail connector, ask Claude to read today's inbox with it. If not, paste your emails under the prompt. Any mail program works.", "Bring the answer back: paste it, or drop the file you saved it in."]));
    else {
      const fake = (n) => r.fake.find((f) => f.n === n), subj = (n) => (r.emails.find((e) => e.n === n) || {}).subject || "";
      const toCheck = r.drafts.filter((d) => !d.checked).length;
      // the four numbers
      root.appendChild(h("div", { class: "grid g4", style: "margin-bottom:14px" },
        OH.stat("Emails reviewed", r.emails.length, "Last review: " + OH.niceDate(r.at)),
        OH.stat("On the short list", openShort(r), "Only you can act on these", openShort(r) ? "warn" : "ok"),
        OH.stat("Drafts to check", toCheck, "Nothing is sent from here", toCheck ? "warn" : "ok"),
        OH.stat("Looks fake", r.fake.length, "Do not click, do not reply", r.fake.length ? "bad" : "ok")));
      // the short list
      root.appendChild(h("div", { class: "card first", style: "margin-bottom:14px" }, h("h2", null, "The short list"),
        h("p", { class: "mut", style: "margin:-4px 0 6px" }, "Only you can act on these. Tick each one when it is done."),
        r.short.length ? r.short.map((s) => OH.check(s.task, s.done, (on) => { s.done = on; save(); }, "Email " + s.n + (subj(s.n) ? " · " + subj(s.n) : "") + (s.due ? " · " + s.due : "")))
          : h("p", { class: "mut" }, "Nothing on the short list.")));
      // drafts to check
      root.appendChild(h("div", { class: "card", style: "margin-bottom:14px" }, h("h2", null, "Drafts to check"),
        OH.note("This page never sends. Read a draft, copy it into your mail program, and send it yourself.", ""),
        r.drafts.length ? r.drafts.map((d) => h("div", { class: "item" }, h("b", null, "To " + d.to + " · " + d.subject), h("pre", { class: "code", style: "margin-top:6px" }, d.body),
          h("div", { class: "row", style: "margin-top:6px" }, h("button", { class: "small", onclick: () => OH.copy(d.body, "Draft copied") }, "Copy the draft"),
            OH.check("I checked every fact in it", d.checked, (on) => { d.checked = on; save(); })))) : h("p", { class: "mut" }, "No drafts in this review.")));
      // everything, sorted
      root.appendChild(h("div", { class: "card", style: "margin-bottom:14px" }, h("h2", null, "Everything, sorted"),
        h("p", { class: "mut", style: "margin:-4px 0 8px" }, "Do not ask whether it is right. Ask which one is wrong, and move it."),
        h("div", { class: "piles" }, PILES.map((p) => { const inPile = r.emails.filter((e) => e.pile === p);
          return h("div", { class: "pile" }, h("h3", null, NAMES[p], h("span", { class: "badge" }, inPile.length)), inPile.map((e) => h("div", { class: "item" + (e.moved ? " moved" : "") },
            h("b", null, e.n + ". " + e.subject), h("small", null, e.from + (e.why ? " · " + e.why : "")),
            fake(e.n) ? h("div", { style: "margin-top:4px" }, OH.badge("Looks fake", "bad"), h("small", { style: "display:block" }, fake(e.n).why)) : null,
            h("select", { "aria-label": "Move email " + e.n, onchange: (ev) => { e.pile = ev.target.value; e.moved = true;
              if (e.pile === "REPLY TODAY" && !r.short.some((s) => s.n === e.n)) r.short.push({ n: e.n, task: "Reply to " + e.from + ": " + e.subject, due: "Today", done: false });
              save(); } }, PILES.map((x) => h("option", { value: x, selected: x === p }, x === p ? "In " + NAMES[x] : "Move to " + NAMES[x])))))); }))));
      // unsure
      if (r.unsure.length) root.appendChild(h("div", { class: "card", style: "margin-bottom:14px" }, h("h2", null, "What it was unsure about"), h("ul", { style: "margin:0;padding-left:20px" }, r.unsure.map((u) => h("li", null, u)))));
    }

    // run the review: the prompt out, the answer back in
    const pb = OH.promptBox({ prompt: OH.sample.cc.emailPrompt, data: own ? "(paste your emails under this line)" : OH.sample.cc.inbox, dataLabel: "emails" });
    root.appendChild(h("details", { class: "card", open: !r }, h("summary", { style: "font-weight:700;cursor:pointer" }, "Run the review"),
      h("p", { class: "mut" }, "If your Claude plan has the Gmail connector, ask Claude to read today's inbox with this prompt. It only reads. If not, paste the emails under the prompt. That works for any mail program."),
      pb.el,
      h("div", { style: "margin-top:12px" }, OH.bringIn({ label: "Bring the review back", hint: "Paste the AI's whole answer, or drop the file you saved it in.", placeholder: "Or paste the AI's answer here",
        sample: own ? null : OH.sample.cc.emailAnswer, sampleLabel: "No AI handy? Load the sample answer", useLabel: "Use this review",
        onText: (text) => { const p = parseReview(text); if (!p.emails.length) return OH.toast("I could not find the review. Ask the AI to hand it back in the exact shape the prompt shows.");
          OH.cc.set("email", p); OH.cc.log("Ran the inbox review: " + p.emails.length + " emails, " + p.short.length + " on the short list", "Asked for it"); OH.toast("Review brought in"); ctx.redraw(); } }))));
  }

  OH.register({
    piece: 3, id: "week-3-email", title: "The email short list",
    intro: "An inbox review you run when you ask. It sorts everything, hands you the short list, and drafts replies to check. It never sends.",
    data: ["email"],
    render: render,
    summary: function () {
      const r = OH.cc.get("email"); if (!r) return { label: "Emails only you can act on", value: "Needs setup", tone: "warn" };
      const n = openShort(r); return { label: "Emails only you can act on", value: n, tone: n ? "warn" : "ok" };
    }
  });
})();
