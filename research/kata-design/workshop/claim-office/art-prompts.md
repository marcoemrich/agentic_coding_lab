# Image-Generator Prompts — Claim Office (MHPCO)

Illustrations for the *Most Honorable Privileged Claims Office for Magical
Risks and Cursed Items* kata. The art style comes from `ai_art_style.txt`
(project root): Lichtenstein pop art mixed with Kirby comic action.

Target system: **NanoBanana** (Gemini 2.5 Flash Image), the same as the
Overlords cards. Write the prompts as prose, set the aspect ratio in words or
through the API, and edit a near-miss instead of re-rolling it.

---

## Style block (the same for every image)

```
Highly detailed comic-book illustration fusing Roy Lichtenstein's Pop Art
with Jack Kirby's dynamic comic action art. Bold, expressive, heavy black
ink outlines define every object and character, giving a graphic
comic-panel look. All gradients, shadows and textures are rendered with
precise Ben-Day halftone dot patterns for a retro screen-printed effect.
The color palette is extremely saturated, clashing and electric — neon
pinks, blues, yellows, oranges and purples — applied as flat or gradient
fills with a slightly distressed print texture. The composition fills the
frame as a chaotic, exploding starburst with radiating speed lines, motion
trails and crackling cyan energy sparks, all bursting out from the central
action.
```

---

## 1 — Hero image: "The Intake Counter" (16:9, title slide)

```
<STYLE BLOCK>

Scene: the cramped, candle-lit intake room of an ancient fantasy insurance
office. Behind a heavy wooden counter sits a stern, bespectacled assessor
in a high collar, raising a huge brass rubber stamp mid-slam, with a thick
open ledger in front of him. At the center of the explosion, a cursed
black sword with glowing purple runes has torn itself free and lunges
straight at the counter and the assessor's legs, trailing speed lines and
cyan lightning. Around it, magical items burst outward from the impact: a
glowing amulet, a gnarled wizard's staff, a bubbling potion bottle, and
three identical moonstones flying together as a set. Gold coins spray
through the air. Dozens of candles flare in the shock wave. The assessor's
expression is utterly unimpressed.

A single comic speech bubble from the assessor reads: "+50 % SURCHARGE!"
A classic pop-art sound-effect burst in the corner reads: "KA-CHUNK!"
Wide landscape format, 16:9 aspect ratio. No other text, no watermark,
no logo.
```

---

## 2 — "Quote" (square, section divider for part 1)

```
<STYLE BLOCK>

Close-up comic panel: the assessor's ink-stained hand drives a giant
brass stamp down onto a parchment premium quote. From the point of impact,
glowing percentage symbols explode outward in a starburst — "+50 %",
"+30 %", "−20 %", "+10 %", "−15 %" — alongside a small "+5 G" stamp-fee
token. In the background, three identical glowing runes lock together
into a single block, marked "60 G". Tiny gold coins rain down.
Square format, 1:1 aspect ratio. No other text, no watermark, no logo.
```

---

## 3 — "Claim" (square, section divider for part 2)

```
<STYLE BLOCK>

Dramatic action panel: a green dragon breathes a massive torrent of fire
across the frame at a knight's enchanted sword, which glows hot orange. In
the foreground, a smug accountant-assessor holds up a single gold coin
between two fingers while a huge pile of gold behind him stays locked
inside a chest marked with a padlock. A pop-art caption box at the top
reads: "DEDUCTIBLE: 100 G". A speech bubble from the knight reads:
"THAT'S IT?!"
Square format, 1:1 aspect ratio. No other text, no watermark, no logo.
```

---

## Iteration tips

- Keep the lettering short. NanoBanana handles a few words reliably; if
  something comes out garbled, send the image back with "keep everything,
  only fix the bubble text to read …".
- For a matching set, generate image 1 first and attach it to prompts 2
  and 3 with: *"Match the exact art style, palette and halftone treatment
  of the attached image."*
- If the starburst hides the story, append: "the central characters remain
  clearly readable; the effects frame them rather than cover them."
