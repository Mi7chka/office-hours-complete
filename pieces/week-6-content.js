/* Week 6 · the content calendar and the posts board.
   The one question it answers: what are we posting this month, and what is ready to go?
   A calendar, a posts board with posted ticks, a content pack (one idea out, options per platform
   back), and the post graphic from your own Canva template, brought in as a file.
   This page never posts. A person posts, then ticks Posted. */
(function () {
  const h = OH.h, STATUS = ["Idea", "Drafted", "Ready", "Posted"];
  const uid = (i) => "P" + Date.now().toString(36) + (i || 0);
  const iso = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const esc = (s) => String(s || "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const platforms = () => OH.sample.cc.platforms;
  const isDate = (s) => /^\d{4}-\d\d-\d\d$/.test(s || "");

  function calendarTab(panel, posts, ctx) {
    const shift = OH.store.get("p6:shift", 0), today = OH.today();
    const start = new Date(); start.setHours(12, 0, 0, 0); start.setDate(start.getDate() - 14 + shift * 7); start.setDate(start.getDate() - ((start.getDay() + 6) % 7));   // back to a Monday
    const days = []; for (let i = 0; i < 35; i++) { const d = new Date(start); d.setDate(start.getDate() + i); days.push(iso(d)); }
    const move = (n) => () => { OH.store.set("p6:shift", n == null ? 0 : shift + n); ctx.redraw(); };
    const shown = posts.filter((p) => p.date >= days[0] && p.date <= days[34]), undated = posts.filter((p) => !p.date).length;
    panel.appendChild(h("div", { class: "row", style: "margin-bottom:10px" }, h("b", null, "Five weeks: " + OH.niceDate(days[0]) + " to " + OH.niceDate(days[34])), OH.badge(shown.length + (shown.length === 1 ? " post" : " posts")), h("span", { class: "spacer" }),
      h("button", { class: "small", onclick: move(-1) }, "Earlier"), h("button", { class: "small", onclick: move(null) }, "This week"), h("button", { class: "small", onclick: move(1) }, "Later")));
    panel.appendChild(h("div", { class: "cal" }, ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => h("div", { class: "dow" }, d)),
      days.map((day) => { const mine = posts.filter((p) => p.date === day);
        return h("div", { class: "cell" + (day === today ? " now" : "") + (mine.length ? "" : " none") }, h("div", { class: "dn" }, OH.niceDate(day) + (day === today ? " · today" : "")),
          mine.map((p) => h("span", { class: "post" + (p.status === "Posted" ? " done" : ""), title: p.text || p.idea }, p.platform + ": " + p.idea + (p.status === "Posted" ? " (posted)" : "")))); })));
    if (undated) panel.appendChild(OH.note(undated + (undated === 1 ? " post has" : " posts have") + " no date yet. Give each one a date on the Posts tab.", "warn"));
  }

  function postsTab(panel, posts, ctx) {
    const own = OH.cc.own(), save = () => { OH.cc.set("posts", posts); ctx.redraw(); };
    if (posts) {
      panel.appendChild(OH.note("This page never posts. Post it yourself, then tick Posted.", ""));
      panel.appendChild(h("div", { class: "piles" }, STATUS.map((st) => { const cards = posts.filter((p) => p.status === st).sort((a, b) => ((a.date || "9") < (b.date || "9") ? -1 : 1));
        return h("div", { class: "pile" }, h("h3", null, st, h("span", { class: "badge" }, cards.length)), cards.map((p) => h("div", { class: "item" }, h("b", null, p.idea),
          h("div", { class: "row", style: "gap:4px;margin-top:4px" }, OH.badge(p.platform, "blue"), p.date ? OH.badge(OH.niceDate(p.date)) : OH.badge("No date yet", "warn")),
          p.text ? h("span", { class: "sub" }, p.text.length > 150 ? p.text.slice(0, 148) + "…" : p.text) : h("span", { class: "sub mut" }, "Not written yet."),
          h("div", { class: "row", style: "gap:6px;margin-top:6px" },
            h("input", { type: "date", value: p.date || "", "aria-label": "Date for: " + p.idea, style: "padding:4px 8px;font-size:12.5px;width:auto;flex:1", onchange: (ev) => { p.date = ev.target.value; save(); } }),
            p.text ? h("button", { class: "small", onclick: () => OH.copy(p.text, "Post copied") }, "Copy") : null),
          OH.check("Posted", p.status === "Posted", (on) => { p.status = on ? "Posted" : "Ready"; if (on) OH.cc.log("Posted: " + p.idea, p.platform); save(); }),
          st === "Posted" ? null : h("select", { "aria-label": "Move the post: " + p.idea, onchange: (ev) => { p.status = ev.target.value; save(); } },
            STATUS.slice(0, 3).map((x) => h("option", { value: x, selected: x === st }, x === st ? "In " + x : "Move to " + x)))))); })));
    }
    // add a post
    const idea = h("input", { type: "text", placeholder: "The idea, in a few words" }), plat = h("select", null, platforms().map((x) => h("option", { value: x }, x))), date = h("input", { type: "date" });
    const text = h("textarea", { style: "min-height:80px", placeholder: "The words of the post. Leave it empty if it is only an idea." });
    panel.appendChild(h("details", { class: "card", style: "margin-top:14px", open: !posts }, h("summary", { style: "font-weight:700;cursor:pointer" }, "Add a post"),
      h("div", { class: "grid g3" }, OH.field("The idea", idea), OH.field("Where it goes", plat), OH.field("The day", date)), OH.field("The words", text),
      h("div", { class: "row", style: "margin-top:8px" }, h("button", { class: "primary", onclick: () => { if (!idea.value.trim()) return OH.toast("Give the post an idea first");
        const all = posts || []; all.push({ id: uid(), date: date.value || "", platform: plat.value, idea: idea.value.trim(), text: text.value.trim(), status: text.value.trim() ? "Drafted" : "Idea" });
        OH.cc.set("posts", all); OH.toast("Post added"); ctx.redraw(); } }, "Add the post"))));
    // bring posts in, save the file
    const HEAD = ["date", "platform", "idea", "text", "status"];
    panel.appendChild(h("details", { class: "card", style: "margin-top:14px" }, h("summary", { style: "font-weight:700;cursor:pointer" }, "Bring in my posts"),
      OH.bringIn({ label: "A posts file from a spreadsheet", hint: "A sheet saved as CSV with the headings " + HEAD.join(", ") + ". Dates look like 2026-11-11.", placeholder: "Or paste the rows here, with the heading row first", useLabel: "Add these posts",
        sample: own ? null : OH.toCSV([HEAD, [OH.day(16), "Facebook", "Snow stakes go in", "", "Idea"], [OH.day(18), "Email", "Book spring cleanups early", "", "Idea"]]),
        onText: (t) => { const rows = OH.rows(t).filter((r) => r.idea).map((r, i) => ({ id: uid(i), date: isDate(r.date) ? r.date : "", platform: platforms().find((x) => x.toLowerCase() === String(r.platform || "").toLowerCase()) || r.platform || "Facebook", idea: r.idea, text: r.text || "",
          status: STATUS.find((s) => s.toLowerCase() === String(r.status || "").toLowerCase()) || (r.text ? "Drafted" : "Idea") }));
          if (!rows.length) return OH.toast("I could not find any posts. The first row needs a heading named idea."); OH.cc.set("posts", (posts || []).concat(rows)); OH.toast(rows.length + " posts added"); ctx.redraw(); } }),
      posts ? h("div", { class: "row", style: "margin-top:10px" }, h("button", { onclick: () => OH.download("posts.csv", OH.toCSV([HEAD].concat(posts.map((p) => [p.date, p.platform, p.idea, p.text, p.status]))), "text/csv") }, "Save my posts file")) : null));
  }

  function parsePack(text) {
    const out = { options: [], unsure: [] }; let unsure = false;
    String(text || "").split("\n").forEach((raw) => { const line = raw.trim().replace(/^[-*]\s*/, ""); if (!line) return;
      const up = line.toUpperCase().replace(/[*#:]/g, "").trim();
      if (up === "CONTENT PACK") { unsure = false; return; } if (up === "UNSURE") { unsure = true; return; }
      if (unsure) return out.unsure.push(line);
      const parts = line.split("|").map((x) => x.trim()); if (parts.length < 3) return;
      const name = platforms().find((x) => x.toLowerCase() === parts[0].toLowerCase()) || parts[0];
      out.options.push({ platform: name, n: parts[1], text: parts.slice(2).join(" | "), state: "" }); });
    return out;
  }
  function packTab(panel, posts, ctx) {
    const own = OH.cc.own(), pack = OH.cc.get("pack") || { idea: "", options: [], unsure: [] }, biz = OH.cc.biz();
    const savePack = () => { OH.cc.set("pack", pack); ctx.redraw(); };
    const idea = h("textarea", { style: "min-height:80px", placeholder: "One idea from your week. A question a customer asked is a good one." }); idea.value = pack.idea || "";
    idea.addEventListener("change", () => { pack.idea = idea.value.trim(); OH.cc.set("pack", pack); });
    panel.appendChild(h("div", { class: "card" }, h("h2", null, "One idea, a post for every platform"), OH.field("The idea", idea, "Say it the way you would say it to a customer. Add the facts the AI needs, and nothing you would not want posted."),
      h("div", { style: "margin-top:10px" }, OH.promptBox({ prompt: OH.sample.cc.packPrompt, dataLabel: "idea", height: 170, data: () => idea.value.trim() + (biz.name ? "\n\nThe business: " + biz.name + (biz.town ? ", " + biz.town : "") + "." : "") }).el),
      h("div", { style: "margin-top:12px" }, OH.bringIn({ label: "Bring the content pack back", hint: "Paste the AI's whole answer, or drop the file you saved it in.", placeholder: "Or paste the AI's answer here", useLabel: "Use this content pack",
        sample: own ? null : OH.sample.cc.packAnswer, sampleLabel: "No AI handy? Load the sample answer",
        onText: (t) => { const p = parsePack(t); if (!p.options.length) return OH.toast("I could not find the options. Ask the AI to hand it back in the exact shape the prompt shows.");
          pack.idea = idea.value.trim(); pack.options = p.options; pack.unsure = p.unsure; OH.toast(p.options.length + " options brought in"); savePack(); } }))));
    if (pack.options.length) {
      const names = []; pack.options.forEach((o) => { if (names.indexOf(o.platform) < 0) names.push(o.platform); });
      panel.appendChild(h("div", { class: "card", style: "margin-top:14px" }, h("h2", null, "The options"), h("p", { class: "mut", style: "margin:-4px 0 8px" }, "Read each one against your idea. Find the claim you never made."),
        h("div", { class: "piles" }, names.map((name) => h("div", { class: "pile" }, h("h3", null, name), pack.options.filter((o) => o.platform === name).map((o) => h("div", { class: "item" + (o.state === "no" ? " flag" : "") },
          h("span", { style: o.state === "no" ? "text-decoration:line-through;color:var(--muted)" : "" }, o.text),
          o.state === "no" ? h("div", { style: "margin-top:6px" }, OH.badge("Not true. Not used.", "bad"), " ", h("button", { class: "small", onclick: () => { o.state = ""; savePack(); } }, "Put it back"))
            : o.state === "used" ? h("div", { style: "margin-top:6px" }, OH.badge("On the posts board", "ok"))
              : h("div", { class: "row", style: "gap:6px;margin-top:6px" },
                h("button", { class: "small primary", onclick: () => { const all = posts || []; all.push({ id: uid(), date: "", platform: o.platform, idea: (pack.idea || "A post").split(".")[0].slice(0, 70), text: o.text, status: "Drafted" }); OH.cc.set("posts", all); o.state = "used"; OH.toast("Added to the posts board as Drafted"); savePack(); } }, "Use this one"),
                h("button", { class: "small", onclick: () => { o.state = "no"; savePack(); } }, "Something here is not true"))))))),
        pack.unsure.length ? h("div", { style: "margin-top:10px" }, h("b", null, "What it was unsure about"), h("ul", { style: "margin:4px 0 0;padding-left:20px" }, pack.unsure.map((u) => h("li", null, u)))) : null));
    }
  }

  /* The sample graphic is drawn here, to stand in for a design made in Canva. */
  function sampleGraphic(headline, biz) {
    const words = String(headline || "").split(" "), lines = []; let cur = "";
    words.forEach((w) => { if ((cur + " " + w).trim().length > 16 && cur) { lines.push(cur); cur = w; } else cur = (cur + " " + w).trim(); }); if (cur) lines.push(cur);
    return '<svg viewBox="0 0 600 600" role="img" aria-label="Sample post graphic" style="width:100%;max-width:340px;height:auto;border-radius:14px;display:block">'
      + '<rect width="600" height="600" fill="#1f6f3d"/><circle cx="500" cy="110" r="190" fill="#2d8a50"/><path d="M70 470 C150 330 300 330 330 470 C250 440 150 440 70 470Z" fill="#8fd18f"/>'
      + lines.slice(0, 4).map((l, i) => '<text x="60" y="' + (170 + i * 66) + '" font-family="system-ui,Arial,sans-serif" font-weight="800" font-size="56" fill="#fff">' + esc(l) + "</text>").join("")
      + '<text x="60" y="545" font-family="system-ui,Arial,sans-serif" font-weight="700" font-size="26" fill="#d9f2d9">' + esc(biz.name + (biz.town ? " · " + biz.town : "")) + "</text></svg>";
  }
  function graphicTab(panel, ctx) {
    const own = OH.cc.own(), g = OH.cc.get("graphic"), biz = OH.cc.biz(), t = (g && g.template) || {};
    const save = (next) => { OH.cc.set("graphic", next); ctx.redraw(); };
    const bring = OH.bringIn({ image: true, label: own ? "Your post graphic" : "Try it: drop any picture", hint: "In Canva, open your template, change the headline, then choose Share, Download, PNG. Drop that file here. It stays in this browser.",
      onImage: (dataUrl, name) => { save(Object.assign({}, g || {}, { dataUrl: dataUrl, name: name, at: OH.today() })); OH.toast("Graphic brought in"); } });
    panel.appendChild(h("div", { class: "grid g2" },
      h("div", { class: "card" }, h("h2", null, "The post graphic"),
        g && g.dataUrl ? h("div", null, h("img", { src: g.dataUrl, alt: "Your post graphic: " + (g.name || ""), style: "max-width:100%;width:340px;height:auto;border-radius:14px;display:block" }), h("p", { class: "mut", style: "margin:8px 0 0" }, (g.name || "A picture") + " · brought in " + OH.niceDate(g.at)))
          : !own && g ? h("div", null, h("div", { html: sampleGraphic(g.headline, biz) }), h("p", { class: "mut", style: "margin:8px 0 0" }, "A sample graphic, drawn by this page to stand in for a Canva design."))
            : OH.cc.setup("No graphic is brought in, so no picture is shown.", ["In Canva, make one template with your colors, your font and your logo.", "Change the headline, then choose Share, Download, PNG.", "Drop the file in the box on this page."])),
      h("div", { class: "card" }, h("h2", null, "Design once"), h("p", { class: "mut", style: "margin:-4px 0 6px" }, "One template, used every time. Tick what yours has."),
        [["colors", "It has your colors"], ["font", "It has your font"], ["logo", "It has your logo"]].map((x) => OH.check(x[1], !!t[x[0]], (on) => { const next = Object.assign({}, g || {}); next.template = Object.assign({}, t); next.template[x[0]] = on; save(next); })),
        h("p", { class: "mut", style: "font-size:13.5px" }, "If your Claude plan has the Canva connector, you can ask Claude to fill the template for you. Either way, the picture comes in here as a file you export."),
        bring)));
  }

  function render(root, ctx) {
    const posts = OH.cc.get("posts");
    if (!posts) root.appendChild(OH.cc.setup("No posts are brought in yet, so the calendar and the board are empty.", ["Open the Posts tab and add one post, or", "bring in a sheet of posts saved as CSV, or", "open Content pack and turn one idea into drafts."]));
    root.appendChild(OH.tabs("p6", [
      { id: "cal", label: "Calendar", render: (p) => (posts ? calendarTab(p, posts, ctx) : p.appendChild(h("p", { class: "mut" }, "The calendar fills in when there are posts."))) },
      { id: "posts", label: "Posts", count: posts ? posts.length : null, render: (p) => postsTab(p, posts, ctx) },
      { id: "pack", label: "Content pack", render: (p) => packTab(p, posts, ctx) },
      { id: "graphic", label: "Graphic", render: (p) => graphicTab(p, ctx) }
    ]));
  }

  OH.register({
    piece: 6, id: "week-6-content", title: "Content",
    intro: "A month of posts on one calendar, a board that shows what is ready, and one idea turned into a post for every platform. It never posts.",
    data: ["posts", "pack", "graphic"],
    render: render,
    summary: function () {
      const posts = OH.cc.get("posts"); if (!posts) return { label: "Posts ready to go", value: "Needs setup", tone: "warn" };
      const n = posts.filter((p) => p.status === "Ready").length; return { label: "Posts ready to go", value: n, tone: n ? "ok" : "warn" };
    }
  });
})();
