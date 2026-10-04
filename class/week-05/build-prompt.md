# Week 5 build prompt · Website inquiries and the website tab

- **In the Claude app:** paste everything below the line and send. Save the file it makes as `week-5-website.js` in the `pieces` folder of your project.
- **In Claude Code:** open your project folder and paste the same prompt. It writes `pieces/week-5-website.js` for you.

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
  function render(root, ctx) { /* build the page into root. Call ctx.redraw() after a tick, a button press or a choice in a list. Never from a text input. */ }
  OH.register({
    piece: 5,
    id: "week-5-website",
    title: "The page heading",
    intro: "One sentence under the heading.",
    data: ["the data names this piece keeps"],
    render: render,
    summary: function () { return { label: "A few words", value: "3", tone: "warn" }; }
  });
})();
```

`root` is empty each time. The app draws the title, the intro and the Sample business / My business switch above it. Do not draw a heading.

**The toolbox the app gives you. Use it, do not write your own.**

- `OH.h(tag, attrs, ...children)` makes a page element. `attrs` can hold `class`, `style`, `value`, `checked`, `placeholder`, `type`, and handlers such as `onclick` or `onchange`. `style` is text such as `"font-weight:700"`, not an object. Children are text, elements, lists, or null.
- `OH.cc.get(name)` reads data. `OH.cc.set(name, value)` keeps it in this browser. `OH.cc.own()` is true when the person looks at their own business, and false for the sample business.
- In the sample business, `OH.cc.get(name)` returns made-up sample data that is already in the app. In My business it returns `null` until the person brings their own data in. When it is `null`, show `OH.cc.setup(sentence, [steps])`, which returns the box headed Needs setup. Add it to the page like any other element. Never show a made-up number in its place.
- `OH.cc.biz()` gives `{ name, owner, town }` for the business on screen. `OH.cc.log(what, why)` adds a line to the change log.
- `OH.step(title, ...children)` a numbered section. `OH.card(title, ...children)` a card. `OH.note(text, tone)` a note. `OH.badge(text, tone)` a small label. `OH.stat(label, value, detail, tone)` a number tile. Tones: `"ok"`, `"warn"`, `"bad"`, `"blue"`.
- `OH.check(text, done, onChange, extra)` one line with a tick box. `onChange(ticked)` gets true or false, not an event. `OH.field(label, inputElement, hint)` a labelled input.
- `OH.table(columns, rows, options)` a table. `columns`: `[{ h: "Heading", f: (row) => cell }]`. `options`: `{ empty: "words for no rows", rowClass: (row) => "hot" or "done" }`.
- `OH.tabs(key, [{ id, label, count, render: (panel) => {} }])` tabs inside the piece. It remembers the open tab.
- `OH.bringIn({ label, hint, placeholder, sample, useLabel, onText: (text, fileName) => {} })` the way to bring data in with no connector: choose a file, drop a file, or paste text. `sample` is optional text for a Load the sample file button.
- `OH.promptBox({ prompt, data, dataLabel })` returns `{ el }`: a prompt the person copies into an AI chat. `OH.pasteBox({ label, sample, onUse: (text) => {} })` is where the AI's answer comes back.
- `OH.rows(text)` turns CSV text into a list of objects, keyed by the header row in lower case. `OH.toCSV(rows)` makes CSV text from a list of lists: the first inner list is the headings and each one after it is one row of cells, such as `[["title", "lane"], ["Order mulch", "Doing"]]`. It does not take the objects that `OH.rows` gives back. `OH.download(fileName, text)` saves a file. `OH.copy(text, "What was copied")` copies. `OH.toast(message)` shows a short message.
- `OH.today()` is today as `"2026-10-07"`. `OH.day(n)` is today plus n days. `OH.daysBetween(from, to)` counts days. `OH.niceDate(date)` reads like `Wed, Oct 7`.
- CSS classes already there: `steps` (put the whole page inside one `div` with this class: it spaces the cards apart and numbers each `OH.step` 1, 2, 3), `grid g2 g3 g4`, `row`, `spacer`, `card`, `mut` (grey text), `piles` with `pile` and `item` (columns of cards), `first` (a card with a blue edge; a `div` with the class `big` inside it holds large text), and buttons `primary` and `small`.

**Rules for the page**

- Words on the page are plain and short. No em dashes. No hype words. No dollar amounts.
- The page never sends, posts, pays or deletes. It can copy text and save a file to the computer, nothing more.
- Keep what the person types with `OH.cc.set`, so it is still there after a refresh.
- It works with the keyboard, and at the width of a phone (390 wide) with no sideways scroll.

## The design note

**Who uses it.** Jordan Reyes, once a week, after exporting the form submissions from the website.

**The one question it answers.** What came in through the website, and is the website doing its job?

**What is on it.**

- A place to bring in the form export: drop the file, or paste the rows.
- A check before anything is added: rows in the file, rows to add, duplicates, and rows held back because there is no way to reach the person.
- A button that adds the good rows to the pipeline as New deals, each with its source and a next step for today.
- The count before and after, with the gap explained.
- Where leads came from, as bars, for the whole pipeline.
- A website tab: the three-second test (what you do, where you work, what to do next), and search numbers by month, typed in or imported.

**What done means.**

- The numbers add up: rows in the file equals added plus duplicates plus held back.
- A person already in the pipeline is not added twice.
- A row with no email and no phone is held back and shown, not dropped.
- With my own business and nothing brought in, it says Needs setup. It never shows a made-up number.

## What to build

Build the website piece as the file `week-5-website.js`. One piece, two tabs. Everything comes in by hand: no form is connected, and nothing is fetched.

**The data**

- `"deals"`: the pipeline from week 4, a list or `null`. A deal is `{ id, client, contact, email, phone, what, stage, next_step, next_date, last_touch, source, notes }`. This piece adds deals to it.
- `"inquiries"`: `{ last, held, pending }` or `null`. `pending` is a checked file that is not added yet: `{ file, rows }`. `last` is the last import: `{ at, file, read, added, dupes, held, before, after }`. `held` is the list of rows held back.
- `"site"`: `{ page, test, search }` or `null`. `test` is `{ what, where, next, note, date }` where the three answers are `"yes"`, `"no"` or empty. `search` is a list of `{ month, clicks, impressions }` with months like `"2026-10"`.
- `OH.sample.cc.formExport` is a made-up form export as CSV text. Offer it as the sample for the bring-in box, in the sample business only.

**Checking a form export**

- Read it with `OH.rows(text)`. Find the columns by what their headings contain: name, email, phone, message, page, and submitted or date.
- Give every row one of three outcomes. Held back: it has no email and no phone. Duplicate: its email or its phone matches a deal in the pipeline, or matches an earlier row in the same file. Compare emails without caring about capitals, and phones by their digits. Add: everything else.
- Rows in the file must equal add plus duplicates plus held back. Show that sum in words.

**The page**

Use `OH.tabs("p5", ...)` with two tabs, Inquiries and Website.

Inquiries tab, top to bottom:

1. If inquiries is `null`: the Needs setup box.
2. `OH.bringIn` labelled The form export from your website, with the button Check this file. Checking adds nothing. It saves the result as `pending`.
3. When there is a pending file: a card with the classes `card first`, headed Checked, and nothing added yet. Four number tiles: Rows in the file, To add, Duplicates, Held back. One sentence with the sum, such as `5 plus 2 plus 1 is 8`. A table of every row with its outcome and the reason. A button `Add 5 to the pipeline` with the real count, and a button Not now.
4. Adding puts each good row in `"deals"` as a deal in stage New, with the next step Reply to the website inquiry, the next date today, and a source that starts with `Website form` followed by the page. It records `last`, keeps the held rows in `held`, clears `pending`, and adds a change log line.
5. When there is a last import: a card headed The last import: before and after, with In the file, Added, Pipeline before, Pipeline after, and one sentence that explains the gap.
6. When rows are held back: a card headed Held back: these need you, listing them.
7. A card headed Where leads came from: bars with one bar per source, counted from all deals. Group a source by the words before its colon.

Website tab:

1. A card headed The three-second test: the page tested, three selects (Does the top of the page say what you do? Does it say where you work? Does it say what to do next?), a text box for what you saw, a score such as `2 of 3`, and a button Save the test, which stamps today's date.
2. A card headed Search numbers: bars of clicks by month and a table with Month, Clicks and Times shown. In the sample business, a label says the numbers are made up. In My business, a label says they are measured, typed in or imported by you. With no numbers: the Needs setup box, and no chart. Under it, a way to type one month in, and `OH.bringIn` for an export with the headings Date, Clicks and Impressions, where days are added up into months.

**The home screen number**

- `summary()` returns `{ label: "Leads from the website", value: 3, tone: "" }`: the deals whose source starts with Website.
- With no deals and no inquiries: the same label, with value `"Needs setup"` and tone `"warn"`.

**Exact names**

- `piece: 5`, `id: "week-5-website"`, `title: "Website inquiries"`, `data: ["inquiries", "site"]`.

## The rules

1. You draft. A person sends. Write the message, the post or the reply, and stop there.
2. Say what you are unsure about. If you had to guess, say so in plain words. Never hide a guess.
3. Never invent a number, a name, a date or a claim. If it is not in what I gave you, leave it out or ask.
4. Never send, pay, post or delete. Those four are always my steps.
5. Keep to the design note. If the note and my message disagree, ask which one wins.
6. Use plain words and short sentences. No hype.

## What to hand back

1. One file named `week-5-website.js`. If you can write files in my project folder, write it to `pieces/week-5-website.js` and change no other file. A placeholder with that name may already be there: replace it. If you cannot write files, give me the whole file to download, with exactly that name.
2. Then, in five lines or fewer: what you built, anything you were unsure about, and anything in the design note you could not do.

Build it now, in one go. Where something is unclear, make the smallest choice that keeps to the design note, and tell me about it after the file. Do not hand back parts of the file, and do not ask me to edit code. I cannot edit code.
