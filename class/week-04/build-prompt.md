# Week 4 build prompt · The pipeline

- **In the Claude app:** paste everything below the line and send. Save the file it makes as `week-4-pipeline.js` in the `pieces` folder of your project.
- **In Claude Code:** open your project folder and paste the same prompt. It writes `pieces/week-4-pipeline.js` for you.

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
    piece: 4,
    id: "week-4-pipeline",
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

**Who uses it.** Jordan Reyes, every morning, and on Friday afternoon for a look at the whole list.

**The one question it answers.** Which deals have gone quiet, and what is the next step for each?

**What is on it.**

- A list of every client and deal: who it is, what they want, the stage, the next step, its date, the last contact, and where the lead came from.
- A board with one column per stage: New, Site visit, Quoted, Won, Lost.
- A mark on every open deal with no next step, no date, or a date that has passed.
- A follow-up checklist: the deals that need Jordan today, the latest first, with the notes beside each one.
- Three message templates, filled in with the client's name: a first follow-up, a second nudge, and the polite last note. Drafts only.
- A way to bring deals in from a sheet, and a way to save the list back.

**What done means.**

- Every open deal has a next step and a date, or it is marked.
- A draft says only what the notes say. No price, and no promised date.
- The page never sends. It copies a draft.
- With my own business and no deals yet, it says Needs setup.

## What to build

Build the pipeline as the file `week-4-pipeline.js`. One piece, three tabs.

**The data**

- `"deals"`: a list of deals, or `null`. A deal is `{ id, client, contact, email, phone, what, stage, next_step, next_date, last_touch, source, notes }`. `stage` is `"New"`, `"Site visit"`, `"Quoted"`, `"Won"` or `"Lost"`. Dates look like `"2026-10-28"` or are empty.
- `OH.sample.cc.templates` is a list of three message templates, already in the app: `{ id, name, text }`. The text holds `{first}`, `{what}`, `{owner}` and `{business}`. Fill them from the deal and from `OH.cc.biz()`.
- There are no prices and no deal values anywhere.

**Where a deal stands**

- Won and Lost are closed. A closed deal is never marked.
- An open deal needs you when it has no next step, or no date, or its date is today or has passed. Label it No next step, No date, Due today, or the number of days late.
- The follow-up list is every deal that needs you, the latest first.

**The page**

If deals is `null`: the Needs setup box, then the Add a deal and Bring in my deals sections, and nothing else. Otherwise use `OH.tabs("p4", ...)` with three tabs, each with a count.

Follow-ups tab:

1. A note: drafts only, the page never sends.
2. One card per deal that needs you: the client, its label, how many days since the last contact, the stage, what they want, the next step that was planned, and the notes in full.
3. On each card: a select to choose one of the three templates, the filled-in draft, and a button Copy the draft.
4. On each card: two inputs, the next step and its date, and a button Save the next step. Saving needs both. It also sets the last contact to today and adds a change log line. The deal then leaves the list.
5. A section Ask an AI to draft from the notes, with `OH.promptBox`. The prompt says: use only what is in the notes, no price, no promised date, and write a phone script when the notes say the person prefers a call. The data is the deals that need you, with their notes.

Board tab: five columns using the classes `piles`, `pile` and `item`. Each card shows the client, what they want, the next step, its label, the source, and a select to move it to another stage. Moving a deal to Won or Lost adds a change log line.

Clients and deals tab: a table with Client, What they want, Stage, Next step, Date, Last contact, Source. Rows that need you get the row class `hot`. Under it, a section Add a deal (client, contact, what they want, source, next step, date) and a section Bring in my deals using `OH.bringIn`, for a sheet saved as CSV with the headings `client, contact, email, phone, what, stage, next step, next date, last contact, source, notes`. New deals are added to the ones already there. A button Save my deals file saves `deals.csv` in the same shape.

**The home screen number**

- `summary()` returns `{ label: "Deals to follow up today", value: 4, tone: "warn" }`, with tone `"ok"` at zero.
- With no deals: the same label, with value `"Needs setup"` and tone `"warn"`.

**Exact names**

- `piece: 4`, `id: "week-4-pipeline"`, `title: "The pipeline"`, `data: ["deals"]`.

## The rules

1. You draft. A person sends. Write the message, the post or the reply, and stop there.
2. Say what you are unsure about. If you had to guess, say so in plain words. Never hide a guess.
3. Never invent a number, a name, a date or a claim. If it is not in what I gave you, leave it out or ask.
4. Never send, pay, post or delete. Those four are always my steps.
5. Keep to the design note. If the note and my message disagree, ask which one wins.
6. Use plain words and short sentences. No hype.

## What to hand back

1. One file named `week-4-pipeline.js`. If you can write files in my project folder, write it to `pieces/week-4-pipeline.js` and change no other file. A placeholder with that name may already be there: replace it. If you cannot write files, give me the whole file to download, with exactly that name.
2. Then, in five lines or fewer: what you built, anything you were unsure about, and anything in the design note you could not do.

Build it now, in one go. Where something is unclear, make the smallest choice that keeps to the design note, and tell me about it after the file. Do not hand back parts of the file, and do not ask me to edit code. I cannot edit code.
