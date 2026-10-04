# Week 2 build prompt · The board and the change log

- **In the Claude app:** paste everything below the line and send. Save the file it makes as `week-2-board.js` in the `pieces` folder of your project.
- **In Claude Code:** open your project folder and paste the same prompt. It writes `pieces/week-2-board.js` for you.

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
    piece: 2,
    id: "week-2-board",
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

**Who uses it.** Jordan Reyes, at the start and at the end of each day. Luis, the crew lead, reads it when Jordan shares the screen.

**The one question it answers.** What is open, and what is waiting on me?

**What is on it.**

- A board with three lanes: To do, Doing, Done.
- A card for every task. Each card says what done means, when it is due, and its steps.
- Every step has an owner: you or the AI. A step with no owner is marked.
- A Waiting on you list at the top: every card whose next step is yours.
- A change log page: when, who, what and why, newest first. A line can be marked as a decision.
- A way to bring tasks in: a tasks file from a spreadsheet, or a plain list with one task per line. A way to save the tasks file back.

**What done means.**

- Every card on the sample board says what done means.
- The Waiting on you number on the home screen matches the list on the board.
- Moving a card to Done writes one line in the change log.
- With my own business and no tasks yet, it says Needs setup.

## What to build

Build the board and the change log as the file `week-2-board.js`. One piece, two tabs.

**The data**

- `"tasks"`: a list of cards, or `null`. A card is `{ id, title, lane, done_means, due, steps }`. `lane` is `"To do"`, `"Doing"` or `"Done"`. `due` is a date such as `"2026-10-14"` or empty. `steps` is a list of `{ who, text, done }`, where `who` is `"you"`, `"ai"` or empty for no owner.
- `"log"`: a list of change log lines, oldest first, or `null`. A line is `{ at, who, what, why, decision }`. Add a line with `OH.cc.log(what, why, who, decision)`.
- `OH.sample.cc.messyList` is a made-up to-do list as plain text, one task per line. Offer it as the sample for the bring-in box, in the sample business only.

**The page**

Use `OH.tabs("p2", ...)` with two tabs, Board and Change log. Show a count on each: open cards, and log lines.

Board tab, top to bottom:

1. If tasks is `null`: the Needs setup box. Otherwise the next two.
2. A card headed Waiting on you. A card is waiting on you when it is not in Done and its next step that is not done belongs to `"you"`. Show that step with a tick box, and the card title and due date under it. Ticking marks the step done. Under the list, a warning that names every card with a step that has no owner.
3. Three lanes side by side, using the classes `piles`, `pile` and `item`. Each card shows: the title; a line starting Done means; a due label (red when the date has passed, amber when it is today); a label Say what done means when that is empty; a red label No owner when a step has none; every step with a tick box and its owner (You or AI); for a step with no owner, a small select to choose You or The AI; and a select to move the card to another lane. Moving a card to Done adds a change log line that starts with Done and the title.
4. A section Add a card: the task, Done means, Due (a date input), and Steps as a text box with one step per line, each starting with `you:` or `ai:`. A button Add the card puts it in To do and adds a change log line.
5. A section Bring in my tasks, using `OH.bringIn`. It takes a sheet saved as CSV with the headings `title, lane, done means, due, steps`, where steps are written like `you: Call the agent | ai: Draft the note (done)`. It also takes a plain list with one task per line: each line becomes a card in To do with no done means and no steps. New cards are added to the ones already there. A button Save my tasks file saves `tasks.csv` in the same shape.

Change log tab:

1. A table, newest first: When, Who, What, Why. A decision gets a label Decision.
2. A section Add a line: What changed, Why, Who (You or The AI), a tick box to mark a decision, and a button Add to the change log.
3. A button Save my change log file that saves `change-log.md`.

**The home screen number**

- `summary()` returns `{ label: "Waiting on you", value: "4 cards", tone: "warn" }`, with tone `"ok"` when the count is zero.
- With no tasks: `{ label: "Waiting on you", value: "Needs setup", tone: "warn" }`.

**Exact names**

- `piece: 2`, `id: "week-2-board"`, `title: "The board"`, `data: ["tasks", "log"]`.

## The rules

1. You draft. A person sends. Write the message, the post or the reply, and stop there.
2. Say what you are unsure about. If you had to guess, say so in plain words. Never hide a guess.
3. Never invent a number, a name, a date or a claim. If it is not in what I gave you, leave it out or ask.
4. Never send, pay, post or delete. Those four are always my steps.
5. Keep to the design note. If the note and my message disagree, ask which one wins.
6. Use plain words and short sentences. No hype.

## What to hand back

1. One file named `week-2-board.js`. If you can write files in my project folder, write it to `pieces/week-2-board.js` and change no other file. A placeholder with that name may already be there: replace it. If you cannot write files, give me the whole file to download, with exactly that name.
2. Then, in five lines or fewer: what you built, anything you were unsure about, and anything in the design note you could not do.

Build it now, in one go. Where something is unclear, make the smallest choice that keeps to the design note, and tell me about it after the file. Do not hand back parts of the file, and do not ask me to edit code. I cannot edit code.
