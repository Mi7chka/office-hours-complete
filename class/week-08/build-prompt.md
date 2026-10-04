# Week 8 build prompt · The owner summary, the knowledge page, the backup and the roadmap

- **In the Claude app:** paste everything below the line and send. Save the file it makes as `week-8-keep-running.js` in the `pieces` folder of your project.
- **In Claude Code:** open your project folder and paste the same prompt. It writes `pieces/week-8-keep-running.js` for you.

---

## Role

You are a careful web developer helping a small business owner who is not technical. You build one small piece at a time. You keep to the design note, and you say plainly what you were unsure about.

## Context

If you can read the files in my project folder, read `MODULES.md` first. If you cannot, everything you need is here.

**The app and how a piece fits in**

- The app is plain HTML, CSS and JavaScript. It opens with a double-click as a `file://` page. There is no server and no internet.
- A piece is ONE JavaScript file. No import, no export, no fetch, no outside script, font or picture. No new libraries.
- The app loads the file by itself when it sits in the `pieces` folder with the right name. Change no other file.
- The whole file is one function that runs at once and ends by registering the piece, in this shape:

```js
(function () {
  const h = OH.h;
  function render(root, ctx) { /* build the page into root. Call ctx.redraw() after anything changes. */ }
  OH.register({
    piece: 8,
    id: "week-8-keep-running",
    title: "The page heading",
    intro: "One sentence under the heading.",
    data: ["the data names this piece keeps"],
    render: render,
    summary: function () { return { label: "A few words", value: "3", tone: "warn" }; }
  });
})();
```

**The toolbox the app gives you. Use it, do not write your own.**

- `OH.h(tag, attrs, ...children)` makes a page element. `attrs` can hold `class`, `style`, `value`, `checked`, `placeholder`, `type`, and handlers such as `onclick` or `onchange`. Children are text, elements, lists, or null.
- `OH.cc.get(name)` reads data. `OH.cc.set(name, value)` keeps it in this browser. `OH.cc.own()` is true when the person looks at their own business, and false for the sample business.
- In the sample business, `OH.cc.get(name)` returns made-up sample data that is already in the app. In My business it returns `null` until the person brings their own data in. When it is `null`, show `OH.cc.setup(sentence, [steps])`, which draws a box headed Needs setup. Never show a made-up number in its place.
- `OH.cc.biz()` gives `{ name, owner, town }` for the business on screen. `OH.cc.log(what, why)` adds a line to the change log.
- `OH.step(title, ...children)` a numbered section. `OH.card(title, ...children)` a card. `OH.note(text, tone)` a note. `OH.badge(text, tone)` a small label. `OH.stat(label, value, detail, tone)` a number tile. Tones: `"ok"`, `"warn"`, `"bad"`, `"blue"`.
- `OH.check(text, done, onChange, extra)` one line with a tick box. `OH.field(label, inputElement, hint)` a labelled input.
- `OH.table(columns, rows, options)` a table. `columns`: `[{ h: "Heading", f: (row) => cell }]`. `options`: `{ empty: "words for no rows", rowClass: (row) => "hot" or "done" }`.
- `OH.tabs(key, [{ id, label, count, render: (panel) => {} }])` tabs inside the piece. It remembers the open tab.
- `OH.bringIn({ label, hint, placeholder, sample, useLabel, onText: (text, fileName) => {} })` the way to bring data in with no connector: choose a file, drop a file, or paste text. `sample` is optional text for a Load the sample file button.
- `OH.promptBox({ prompt, data, dataLabel })` returns `{ el }`: a prompt the person copies into an AI chat. `OH.pasteBox({ label, sample, onUse: (text) => {} })` is where the AI's answer comes back.
- `OH.rows(text)` turns CSV text into a list of objects, keyed by the header row in lower case. `OH.toCSV(listOfRows)` makes CSV text. `OH.download(fileName, text)` saves a file. `OH.copy(text, "What was copied")` copies. `OH.toast(message)` shows a short message.
- `OH.today()` is today as `"2026-10-07"`. `OH.day(n)` is today plus n days. `OH.daysBetween(from, to)` counts days. `OH.niceDate(date)` reads like `Wed, Oct 7`.
- CSS classes already there: `grid g2 g3 g4`, `row`, `spacer`, `card`, `mut` (grey text), `piles` with `pile` and `item` (columns of cards), `first` (a card with a blue edge), and buttons `primary` and `small`.

**Rules for the page**

- Words on the page are plain and short. No em dashes. No hype words. No dollar amounts.
- The page never sends, posts, pays or deletes. It can copy text and save a file to the computer, nothing more.
- Keep what the person types with `OH.cc.set`, so it is still there after a refresh.
- It works with the keyboard, and at the width of a phone (390 wide) with no sideways scroll.

## The design note

**Who uses it.** Jordan Reyes, on Friday afternoon, for ten minutes. And anyone Jordan hands the business to for a week.

**The one question it answers.** Is the business where I think it is, and is it safe?

**What is on it.**

- An owner summary with a few numbers in three groups: measured, estimated, projected. Every number says which it is and where it came from. The groups are never added together.
- A knowledge page: your voice, your facts, your services. People read it, and it can be copied to the top of any prompt.
- A backup: one file with everything the command center keeps, a list of three copies in two places with one away from the computer, and a restore that puts a file back.
- A 90-day roadmap in three blocks of 30 days. Every line says build next or hire out.

**What done means.**

- A measured number is counted from the data on the day. With no data it says Needs setup.
- An estimate or a projection says how it was made, in the owner's own words.
- A backup file can be saved and then put back, and both are written in the change log.
- Send, pay and post stay the owner's steps. Nothing on the page does them.

## What to build

Build the last piece as the file `week-8-keep-running.js`. One piece, four tabs: Summary, Knowledge, Backup, Roadmap.

**The data it reads from the other pieces, to count the measured numbers**

- `"tasks"` (cards with `lane` and `steps` of `{ who, text, done }`), `"deals"` (with `stage`, `next_step`, `next_date`, `source`), `"email"` (with `short`, a list of `{ done }`), `"posts"` (with `status`), `"log"` (a list). Any of them can be `null`.

**The data it keeps**

- `"numbers"`: the numbers the owner typed, a list or `null`. Each is `{ id, kind, label, value, how }` with `kind` `"estimated"` or `"projected"`.
- `"knowledge"`: `{ voice, facts, services }` or `null`.
- `"backup"`: `{ last, restored, copies }` or `null`. `last` and `restored` are dates or empty. `copies` is `{ computer, drive, away }`, three ticks.
- `"roadmap"`: a list or `null`. A line is `{ id, days, how, done, what }` with `days` 30, 60 or 90 and `how` `"build"` or `"hire"`.
- For the backup file: `OH.store.all()` returns everything the app keeps in this browser as one object, and `OH.store.putAll(object)` writes it back.

**The page**

Use `OH.tabs("p8", ...)` with four tabs.

Summary tab:

1. A note: every number says what it is, and measured, estimated and projected are never added together.
2. Three cards, headed Measured, Estimated and Projected, each with a label of its kind and one line that says what the kind means. No total anywhere.
3. Measured: eight number tiles counted now from the other pieces: Cards waiting on you, Open cards, Open deals, Deals to follow up today, Leads from the website, Emails on the short list, Posts posted, Lines in the change log. Under each: Measured: counted from, and the piece it came from, and today. When that piece has no data, the tile says Needs setup, never a number.
4. Estimated and Projected: the owner's own numbers of that kind. Each tile shows the label, the value, the kind and how it was made, and a small select to mark it as the other kind.
5. A section Add a number of your own: the number, its value, what kind, and how you got it. All are needed.

Knowledge tab: with no knowledge, the Needs setup box. Three text boxes side by side: Your voice, Your facts, Your services. Buttons: Save the knowledge page (adds a change log line), Copy it for a prompt, Save it as a file (`knowledge.md`, with the headings Voice, Facts, Services). A section Bring in a knowledge file using `OH.bringIn`, which reads those three headings.

Backup tab:

1. Three number tiles: Last backup (Never, Today, or days ago), Copies in place (out of 3), Restored on purpose (the date, or Not yet).
2. A card headed 1. Save a backup file. The button saves a file named `command-center-backup-` and today's date, ending `.json`, holding `{ app: "office-hours-command-center", made, keys: OH.store.all() }`. It sets `last` to today and adds a change log line.
3. A card headed 2. Three copies, two places, one away from the computer, with three tick boxes.
4. A card headed 3. Restore one file on purpose. `OH.bringIn` with the button Look inside this file. Choosing or pasting a file shows its name, the day it was made and what it holds, and puts nothing back yet. Then a button Put this backup back, which asks first, writes the entries with `OH.store.putAll`, sets `restored` to today and adds a change log line, and a button Not now. A file that is not a command center backup is refused with a short message.

Roadmap tab: a note with the human-only rule: send, pay and post are always your steps. Three columns using the classes `piles`, `pile` and `item`: the next 30, 60 and 90 days. Each line has a tick box, a label Build next or Hire out, and a select to change it. Changing it adds a change log line marked as a decision. A section Add a line to the roadmap: what, when, build or hire.

**The home screen number**

- `summary()` returns `{ label: "Last backup", value: "9 days ago", tone: "warn" }`: tone `"ok"` within 7 days, `"warn"` after.
- With no backup ever: value `"Never"`, tone `"bad"`.

**Exact names**

- `piece: 8`, `id: "week-8-keep-running"`, `title: "Keep it running"`, `data: ["numbers", "knowledge", "backup", "roadmap"]`.

## The rules

1. You draft. A person sends. Write the message, the post or the reply, and stop there.
2. Say what you are unsure about. If you had to guess, say so in plain words. Never hide a guess.
3. Never invent a number, a name, a date or a claim. If it is not in what I gave you, leave it out or ask.
4. Never send, pay, post or delete. Those four are always my steps.
5. Keep to the design note. If the note and my message disagree, ask which one wins.
6. Use plain words and short sentences. No hype.

## What to hand back

1. One file named `week-8-keep-running.js`. If you can write files in my project folder, write it to `pieces/week-8-keep-running.js` and change no other file. A placeholder with that name may already be there: replace it. If you cannot write files, give me the whole file to download, with exactly that name.
2. Then, in five lines or fewer: what you built, anything you were unsure about, and anything in the design note you could not do.

Build it now, in one go. Where something is unclear, make the smallest choice that keeps to the design note, and tell me about it after the file. Do not hand back parts of the file, and do not ask me to edit code. I cannot edit code.
