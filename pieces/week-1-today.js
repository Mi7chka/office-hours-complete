/* Week 1 · the Today page.
   The one question it answers: what needs me today?
   The one thing first is at the top, then the rest of the list with tick boxes, then one line for
   every other piece of the command center. Works with the sample business, or with your own list. */
(function () {
  const h = OH.h;
  const firstName = (name) => String(name || "").trim().split(" ")[0];
  const count = (t) => ({ total: 1 + t.list.length, done: (t.firstDone ? 1 : 0) + t.list.filter((x) => x.done).length });

  function render(root, ctx) {
    const own = OH.cc.own(), biz = OH.cc.biz(), t = OH.cc.get("today");
    const save = () => { OH.cc.set("today", t); ctx.redraw(); };

    // 1 · the date, a greeting, the business
    const long = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
    root.appendChild(h("div", { class: "card", style: "margin-bottom:14px" }, h("div", { class: "kicker" }, "Today"), h("h2", { style: "font-size:26px;margin:2px 0" }, long),
      h("div", { class: "mut" }, (firstName(biz.owner) ? "Hello, " + firstName(biz.owner) + ". " : "") + (biz.name || "Your business"))));

    // 2 · nothing brought in yet: say so, never invent a list
    if (!t) root.appendChild(OH.cc.setup("There is no list for today yet, so this page shows nothing made up.", ["Go to Write today's list, just below.", "Type one thing per line. The first line is the one thing to do first.", "Press Save today's list."]));
    else {
      if (t.date && t.date !== OH.today()) root.appendChild(OH.note("This list is from " + OH.niceDate(t.date) + ". Write today's list when you are ready.", "warn"));
      // 3 · the one thing first
      root.appendChild(h("div", { class: "card first", style: "margin-bottom:14px" }, h("div", { class: "kicker" }, "First"),
        h("label", { class: "check" + (t.firstDone ? " done" : "") }, h("input", { type: "checkbox", checked: !!t.firstDone, onchange: (ev) => { t.firstDone = ev.target.checked; save(); } }), h("span", { class: "big" }, t.first))));
      // 4 · then the rest
      const c = count(t);
      root.appendChild(h("div", { class: "card", style: "margin-bottom:14px" }, h("div", { class: "row" }, h("h2", { style: "margin:0" }, "Then"), h("span", { class: "spacer" }), OH.badge(c.done + " of " + c.total + " done", c.done === c.total ? "ok" : "")),
        t.list.length ? t.list.map((item) => OH.check(item.text, item.done, (on) => { item.done = on; save(); })) : h("p", { class: "mut" }, "Nothing else on the list today.")));
    }

    // 5 · write today's list
    const name = h("input", { type: "text", value: biz.name || "", placeholder: "For example: Riverbend Bakery" }), who = h("input", { type: "text", value: firstName(biz.owner), placeholder: "Your first name" });
    const box = h("textarea", { style: "min-height:150px", placeholder: "One thing per line.\nThe first line is the one thing to do first." });
    box.value = t ? [t.first].concat(t.list.map((x) => x.text)).join("\n") : "";
    const saveList = () => {
      const lines = box.value.split("\n").map((l) => l.trim()).filter(Boolean);
      if (!lines.length) return OH.toast("Type at least one line first");
      if (own) OH.cc.set("biz", { name: name.value.trim(), owner: who.value.trim(), town: biz.town || "" });
      OH.cc.set("today", { date: OH.today(), first: lines[0], firstDone: false, list: lines.slice(1, 6).map((text) => ({ text: text, done: false })) });
      OH.toast(lines.length > 6 ? "Saved the first six lines. A day holds one thing first and five more." : "Today's list is saved");
      ctx.redraw();
    };
    root.appendChild(h("details", { class: "card", style: "margin-bottom:14px", open: !t }, h("summary", { style: "font-weight:700;cursor:pointer" }, "Write today's list"),
      own ? h("div", { class: "grid g2", style: "margin-top:8px" }, OH.field("The name of your business", name), OH.field("Your first name", who)) : null,
      OH.field("Today's list", box, "One thing per line. The first line is the one thing first. Up to six lines."),
      h("div", { class: "row", style: "margin-top:8px" }, h("button", { class: "primary", onclick: saveList }, "Save today's list"))));

    // 7 · where the business stands: one line for every other piece
    const others = OH.pieceSummaries().filter((s) => s.week !== 1);
    root.appendChild(h("h2", { style: "margin:22px 0 10px" }, "Where the business stands"));
    root.appendChild(h("div", { class: "grid g4" }, others.map((s) => s.built
      ? h("a", { href: "#/p" + s.week, style: "text-decoration:none;color:inherit" }, OH.stat(s.label, s.value, "Week " + s.week + " · " + s.nav, s.tone))
      : OH.stat(s.name, "Not built yet", "Week " + s.week, "mut"))));
  }

  OH.register({
    piece: 1, id: "week-1-today", title: "Today",
    intro: "What needs you today: the one thing first, then the rest.",
    data: ["today"],
    render: render,
    summary: function () {
      const t = OH.cc.get("today"); if (!t) return { label: "Today's list", value: "Needs setup", tone: "warn" };
      const c = count(t); return { label: "Done today", value: c.done + " of " + c.total, tone: c.done === c.total ? "ok" : "warn" };
    }
  });
})();
