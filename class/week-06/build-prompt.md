# Week 6 build prompt · The content calendar and the posts board

- **In the Claude app:** paste everything below the line and send. Save the file it makes as `week-6-content.js` in the `pieces` folder of your project.
- **In Claude Code:** open your project folder and paste the same prompt. It writes `pieces/week-6-content.js` for you.

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
    piece: 6,
    id: "week-6-content",
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

**Who uses it.** Jordan Reyes, on Monday morning, to plan the week's posts. Whoever posts for the business reads the board.

**The one question it answers.** What are we posting this month, and what is ready to go?

**What is on it.**

- A calendar of five weeks with every post on its day.
- A posts board with four columns: Idea, Drafted, Ready, Posted. A card moves to Posted when a person ticks that it was posted.
- A content pack: one idea goes out with a prompt, and options for each platform come back. Each option can be used, or marked as not true.
- The post graphic: one picture made from the business's own Canva template, brought in as a file.
- A way to bring posts in from a sheet, and a way to save them back.

**What done means.**

- The page never posts. A person posts, and then ticks Posted.
- An option with a claim that is not true can be marked, and then it cannot be used.
- With my own business and no graphic brought in, the graphic says Needs setup. It never shows a made-up one.
- With my own business and no posts yet, the page says Needs setup.

## What to build

Build the content piece as the file `week-6-content.js`. One piece, four tabs. Canva is not connected: a graphic comes in as a file the person exports.

**The data**

- `"posts"`: a list of posts, or `null`. A post is `{ id, date, platform, idea, text, status }`. `status` is `"Idea"`, `"Drafted"`, `"Ready"` or `"Posted"`. `date` looks like `"2026-11-11"` or is empty.
- `"pack"`: `{ idea, options, unsure }` or `null`. An option is `{ platform, n, text, state }` where `state` is empty, `"used"` or `"no"`.
- `"graphic"`: in the sample business `{ headline, template }`. In My business `{ dataUrl, name, at, template }` or `null`. `template` is `{ colors, font, logo }`, three ticks.
- Already in the app: `OH.sample.cc.platforms` (the list of platform names), `OH.sample.cc.packPrompt` (the content pack prompt) and `OH.sample.cc.packAnswer` (a sample answer).

**The answer the page reads**

```
CONTENT PACK
FACEBOOK | 1 | the post
INSTAGRAM | 1 | the post
UNSURE
- a sentence
```

**The page**

If posts is `null`: the Needs setup box above the tabs. Use `OH.tabs("p6", ...)` with four tabs: Calendar, Posts, Content pack, Graphic.

Calendar tab: a grid of five weeks, Monday to Sunday, that starts two weeks before this week. Use the classes `cal`, `dow`, `cell`, `dn` and `post`. Each day shows its date and its posts as the platform and the idea. Today's cell also has the class `now`, a day with no posts also has the class `none`, and a post that is Posted also has the class `done`. Above the grid: the range of dates, a count of the posts shown, and three buttons, Earlier, This week and Later, that move the grid by a week. Under it, a note when some posts have no date.

Posts tab:

1. A note: this page never posts.
2. Four columns using the classes `piles`, `pile` and `item`. Each card shows the idea, the platform, the date or the label No date yet, the words, a date input, a button Copy, a tick box Posted, and a select to move it between Idea, Drafted and Ready. Ticking Posted moves it to Posted and adds a change log line. Unticking moves it back to Ready.
3. A section Add a post: the idea, where it goes, the day, the words. With words it starts as Drafted, without as Idea.
4. A section Bring in my posts using `OH.bringIn`, for a sheet saved as CSV with the headings `date, platform, idea, text, status`. A button Save my posts file saves `posts.csv`.

Content pack tab:

1. A text box for the one idea, kept in `pack.idea`.
2. `OH.promptBox` with the content pack prompt. Its data is the idea, then the business name and town.
3. `OH.bringIn` labelled Bring the content pack back, with the button Use this content pack, and the sample answer in the sample business only.
4. The options, grouped by platform. Each has two buttons: Use this one, which adds it to the posts as Drafted with no date and marks it used, and Something here is not true, which crosses it out, labels it Not true. Not used. and removes the Use button. A crossed-out option has a button Put it back.
5. What the AI was unsure about.

Graphic tab, two cards side by side:

1. The post graphic. In My business with a picture brought in: show it, with its file name and the day it came in. In the sample business with no picture: draw a simple sample graphic as inline SVG with the headline and the business name, and say it is a sample that stands in for a Canva design. In My business with no picture: the Needs setup box, and no picture.
2. Design once: three tick boxes (it has your colors, your font, your logo), one sentence that says if your Claude plan has the Canva connector you can ask Claude to fill the template, and `OH.bringIn` with `image: true` and `onImage: (dataUrl, name) => {}` to bring the exported picture in.

**The home screen number**

- `summary()` returns `{ label: "Posts ready to go", value: 2, tone: "ok" }`, with tone `"warn"` at zero.
- With no posts: the same label, with value `"Needs setup"` and tone `"warn"`.

**Exact names**

- `piece: 6`, `id: "week-6-content"`, `title: "Content"`, `data: ["posts", "pack", "graphic"]`.

## The rules

1. You draft. A person sends. Write the message, the post or the reply, and stop there.
2. Say what you are unsure about. If you had to guess, say so in plain words. Never hide a guess.
3. Never invent a number, a name, a date or a claim. If it is not in what I gave you, leave it out or ask.
4. Never send, pay, post or delete. Those four are always my steps.
5. Keep to the design note. If the note and my message disagree, ask which one wins.
6. Use plain words and short sentences. No hype.

## What to hand back

1. One file named `week-6-content.js`. If you can write files in my project folder, write it to `pieces/week-6-content.js` and change no other file. A placeholder with that name may already be there: replace it. If you cannot write files, give me the whole file to download, with exactly that name.
2. Then, in five lines or fewer: what you built, anything you were unsure about, and anything in the design note you could not do.

Build it now, in one go. Where something is unclear, make the smallest choice that keeps to the design note, and tell me about it after the file. Do not hand back parts of the file, and do not ask me to edit code. I cannot edit code.
