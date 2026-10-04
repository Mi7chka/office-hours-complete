# Week 7 build prompt · Plan my day and the day page

- **In the Claude app:** paste everything below the line and send. Save the file it makes as `week-7-day-plan.js` in the `pieces` folder of your project.
- **In Claude Code:** open your project folder and paste the same prompt. It writes `pieces/week-7-day-plan.js` for you.

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
    piece: 7,
    id: "week-7-day-plan",
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

**Who uses it.** Jordan Reyes, first thing each morning, before opening the inbox. And again at the end of the day, for the wrap.

**The one question it answers.** What do I do first today, and what comes after?

**What is on it.**

- What the plan reads: the board, the pipeline, the email short list and today's calendar, each with its count. A list that is not set up says so.
- The one thing first, at the top.
- The rest, in order, each with a tick box and the list it came from. Anything with a time sits at its time.
- Every message that needs writing, ready to copy.
- A check against the lists: what the plan left out and said so, and what it left out without saying.
- A button that puts the plan on the Today page.
- The end-of-day wrap, and the runbook lines written so far.

**What done means.**

- Every line of the plan says which list it came from.
- Something on the lists that is missing from the plan is shown, not hidden.
- The page never sends. It copies a message.
- With my own business and no plan yet, it says Needs setup. A list that is not brought in is left out of the prompt, never made up.

## What to build

Build the day plan as the file `week-7-day-plan.js`. The AI writes the plan in a chat. This page gathers the lists, gives it the prompt, and reads the answer. Nothing runs by itself.

**The data it reads from the other pieces**

- `"tasks"` (week 2): cards `{ title, lane, due, steps }` with steps `{ who, text, done }`. Waiting on you: the card is not in Done and its next step that is not done belongs to `"you"`.
- `"deals"` (week 4): deals `{ client, contact, what, stage, next_step, next_date, notes }`. To follow up today: the stage is not Won or Lost, and there is no next step, or no date, or the date is today or has passed.
- `"email"` (week 3): `short` is a list of `{ task, due, done }`. Take the ones not done.
- Any of these can be `null`. Then that list is not set up: say so on the page, and write `not set up. Leave it out.` under its heading in the prompt data. Never make a list up.

**The data it keeps**

- `"calendar"`: `{ date, events }` or `null`, where an event is `{ time, what }` and time looks like `"09:00"` or is empty. Use it only when its date is today.
- `"day"`: the plan, or `null`: `{ date, first, then, messages, left, unsure }`. `first` is `{ text, from, done }`. `then` is a list of `{ time, text, from, done }`. `messages` is a list of `{ to, subject, body }`. `left` and `unsure` are lists of sentences.
- It may write `"today"` (week 1): `{ date, first, firstDone, list }` where list holds `{ text, done }`.
- Already in the app: `OH.sample.cc.planPrompt` (the plan-my-day prompt), `OH.sample.cc.dayAnswer` (a sample answer) and `OH.sample.cc.calendarText` (sample events as text). `OH.runbookLines()` returns the runbook lines written so far: `{ week, piece, step, sign, undo }`.

**The answer the page reads**

```
DAY PLAN
FIRST | what to do | from: email
THEN | 10:00 | what to do | from: calendar
THEN | | what to do | from: pipeline
MESSAGES
MESSAGE | To: the name | Subject: the subject
the message, over one or more lines
END
LEFT OUT
- a sentence
UNSURE
- a sentence
```

**The page, top to bottom**

1. Four number tiles headed Board, Pipeline, Email and Calendar: the count of each list, or Needs setup, or Not built yet with its week.
2. If there is no plan: the Needs setup box, and the Plan my day section open. Otherwise the next five. If the plan's date is not today, a note says which day it is from.
3. A card with the classes `card first`, headed First, with the one thing first, a tick box and a label for the list it came from.
4. A card headed Then: each line with a tick box, its time in bold when it has one, the words, and a label for its list. A count such as `2 of 8 done`. A button Put this plan on the Today page, which saves `"today"` with the first thing and the next five lines.
5. A card headed Messages ready to copy, with a note that the page never sends. Each message shows who it is to, the subject, the text, and a button Copy the message.
6. A card headed Check it against your lists, with three parts. Left out, and it did not say so: every item on the four lists that shares fewer than two longer words with every line of the plan and every line it left out. Show the item and its list. Then Left out, and it said why: the plan's own list. Then What it was unsure about. Add one line that says this check compares words and can miss things.
7. A card headed End of the day: how many are done, and a button Write the wrap in the change log.
8. A section headed Plan my day, with three numbered parts. Today's calendar: one sentence that says if your Claude plan has the Google Calendar connector, Claude can read today's events itself and it only reads, and `OH.bringIn` for events pasted one per line with the time first, or a calendar file (.ics). The prompt and your lists: `OH.promptBox` with the plan-my-day prompt and the four lists as its data. Bring the plan back: `OH.bringIn` with the button Use this plan, and the sample answer in the sample business only. Bringing a plan in adds a change log line.
9. A card headed My runbook: a table of `OH.runbookLines()`, or one sentence that says where to write them.

**The home screen number**

- `summary()` returns `{ label: "Today's plan", value: "2 of 8 done", tone: "" }`, with tone `"ok"` when all are done.
- With a plan from another day: value `"Not written yet"`, tone `"warn"`. With no plan: value `"Needs setup"`, tone `"warn"`.

**Exact names**

- `piece: 7`, `id: "week-7-day-plan"`, `title: "The day plan"`, `data: ["day", "calendar"]`.

## The rules

1. You draft. A person sends. Write the message, the post or the reply, and stop there.
2. Say what you are unsure about. If you had to guess, say so in plain words. Never hide a guess.
3. Never invent a number, a name, a date or a claim. If it is not in what I gave you, leave it out or ask.
4. Never send, pay, post or delete. Those four are always my steps.
5. Keep to the design note. If the note and my message disagree, ask which one wins.
6. Use plain words and short sentences. No hype.

## What to hand back

1. One file named `week-7-day-plan.js`. If you can write files in my project folder, write it to `pieces/week-7-day-plan.js` and change no other file. A placeholder with that name may already be there: replace it. If you cannot write files, give me the whole file to download, with exactly that name.
2. Then, in five lines or fewer: what you built, anything you were unsure about, and anything in the design note you could not do.

Build it now, in one go. Where something is unclear, make the smallest choice that keeps to the design note, and tell me about it after the file. Do not hand back parts of the file, and do not ask me to edit code. I cannot edit code.
