# Week 6 build details · the content calendar and the posts board

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
