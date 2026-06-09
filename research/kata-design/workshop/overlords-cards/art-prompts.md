# Image-Generator Prompts — Overlords Cards (Sphinx & Manticore)

Prompts to generate **complete, finished cards** — black ragged border,
aged parchment field, blackletter title and scoring line — matching the
existing *Overlords* deck (Zombie, Undead Warrior, Hydra, Chimera, Cyclops,
Lich King, Medusa, Minotaur, Orthrus). English, for an image generator
(Midjourney / SDXL / DALL·E etc.).

The existing cards are a **hand-drawn dark-fantasy bust portrait** on
**aged, fire-charred parchment**, inside a **black torn/ragged border**,
with a **blackletter (Gothic Fraktur) title** at the bottom and a small
**scoring line** beneath it.

## Target system: NanoBanana (Gemini 2.5 Flash Image)

These prompts are tuned for **NanoBanana**. What that changes:

- **It renders short text well.** Use the **all-in-one** prompts below
  (card incl. title + scoring). Garbled lettering is rare; if it happens,
  just regenerate. The art-only + manual-typeset fallback (bottom of file)
  is Plan B, not the default.
- **It follows natural-language prose, not keyword soup.** The prompts are
  written as descriptive sentences — keep them that way; don't strip them
  into comma lists.
- **No Midjourney flags.** `--ar 5:7` is ignored. State the aspect ratio
  in words ("portrait card, 5:7 tall aspect ratio") or set it via the API
  `aspectRatio` parameter.
- **Use a reference image for deck consistency (strongest lever).**
  NanoBanana excels at "match the attached image". Attach one existing
  Overlords card (e.g. the Cyclops or Minotaur PnP card) and prefix the
  prompt with: *"Match the exact art style, framing, parchment texture,
  black torn border and blackletter title style of the attached Overlords
  card. Create a new card in the same deck:"* — then the subject prompt.
  Do both Sphinx and Manticore against the same reference so they match
  each other.
- **Iterate by editing, not re-rolling.** If a result is 90% right, send
  it back with a follow-up ("keep everything, only enlarge the wings" /
  "fix the title to read SPHINX") instead of regenerating from scratch.

---

## Base Prompt (style block)

Reuse this for every card; swap only the **subject** and **lettering**.

```
A complete dark-fantasy trading-card, hand-illustrated vintage style. The
card has a black, rough, torn and scorched border framing an aged
parchment field — cream and tan paper, mottled and stained, with burnt
darkened corners and a soft warm radial glow in the center. On the
parchment sits a single creature shown as a bust portrait: head and
shoulders, centered, three-quarter view, filling the upper two-thirds of
the card. The creature is drawn as a loose ink-and-pencil under-sketch
with visible hatching and rough unfinished edges, colored over with soft
painterly washes in a muted earthy palette of browns, tans, ochres and
sepia. At the bottom of the card, large blackletter Gothic title text
reads "<TITLE>", and below it in small clean serif lettering: "<SCORING>".
Grim brooding mood, soft diffuse lighting, weathered hand-illustrated
look, semi-realistic proportions. No other text, no watermark, no logo.
```

**Notes for tuning**
- Aspect ratio **5:7** (tall portrait card) — state in words or via the
  API `aspectRatio` parameter; NanoBanana ignores `--ar` flags.
- Keep the creature **isolated on parchment**, never in a landscape.
- For deck consistency, attach an existing Overlords card as a style
  reference (see "Target system" above).
- If lettering comes out garbled, re-send the image and ask NanoBanana to
  fix only the title text, or fall back to the art-only variant.

---

## Sphinx

`<TITLE>` = **Sphinx**
`<SCORING>` = **4 points / 2 per type (4+ types), else 1**

The deck lets magical creatures use a richer palette (cf. the teal/magenta
Hydra), so the Sphinx gets a restrained warm-gold accent to read as
arcane, while staying within the earthy parchment look.

```
[BASE PROMPT with TITLE "Sphinx" and SCORING "4 points / 2 per type (4+
types), else 1"], the creature is a sphinx: the serene face of a human
woman, her neck and shoulders covered in short tawny lioness fur (no mane),
with large folded eagle wings rising behind the shoulders, feather tips
catching a faint warm-gold glow. Calm, watchful, knowing expression;
ancient and regal. Subtle aged-gold and pale-amber accents in the wings
and eyes against the muted tan-and-ochre fur. Soft golden radial glow
behind the head suggesting hidden wisdom.
```

---

## Manticore

`<TITLE>` = **Manticore**
`<SCORING>` = **Pair = 7 points / Pack of 3 = 12 points / Otherwise 2 points each**

Kept in the darker, more bestial register of the deck (cf. Orthrus,
Minotaur) — earthy, menacing, no bright accent.

```
[BASE PROMPT with TITLE "Manticore" and SCORING "Pair = 7 points / Pack of
3 = 12 points / Otherwise 2 points each"], the creature is a manticore:
the muscular body and shaggy mane of a lion, a snarling fanged maw crowded
with rows of teeth, and a long segmented scorpion tail arcing up behind it
with a venomous barbed stinger at the tip. Aggressive, predatory pose,
head lowered and jaws open. Dark earthy reds and dusty browns, deep
shadows, a faint reddish glow behind the silhouette. Dangerous, feral,
pack-hunter menace.
```

---

## Quick-copy single-line variants (full card incl. lettering)

- **Sphinx:** `A complete dark-fantasy trading card in tall 5:7 portrait orientation, with a black torn scorched border around aged parchment. A bust portrait of a sphinx — a human woman's face with short tawny lioness fur on the neck and shoulders (no mane), and folded eagle wings with warm-gold feather tips — centered in three-quarter view, drawn as a sketchy ink-and-pencil underdrawing with painterly washes, in a muted earthy palette with pale-gold arcane accents and a soft radial glow. At the bottom, a large blackletter Gothic title reads "Sphinx", and a small serif line below reads "4 points / 2 per type (4+ types), else 1". Weathered vintage hand-illustrated look. No other text.`
- **Manticore:** `A complete dark-fantasy trading card in tall 5:7 portrait orientation, with a black torn scorched border around aged parchment. A bust portrait of a manticore — lion body and mane, snarling fanged maw, long segmented scorpion tail with a barbed stinger arcing overhead — centered in three-quarter view, drawn as a sketchy ink-and-pencil underdrawing with painterly washes, in dark earthy reds and dusty browns with a faint reddish glow. At the bottom, a large blackletter Gothic title reads "Manticore", and a small serif line below reads "Pair = 7 points / Pack of 3 = 12 points / Otherwise 2 points each". Feral menacing mood. No other text.`

---

## Art-only variant (no lettering — recommended for crisp text)

Render frame + creature on parchment, leave the title strip empty, then
typeset the real text in your layout tool with a blackletter font.

Replace the lettering sentence in the base prompt with:
```
At the bottom, leave a blank parchment strip for a title (no text on the
card at all). No text, no letters, no numbers, no watermark, no logo.
```
Then append the same Sphinx / Manticore subject paragraph as above.

**Title font for layout:** blackletter / Gothic Fraktur — e.g.
*UnifrakturCook*, *UnifrakturMaguntia*, or *Pirata One* (free, Google
Fonts), set in black, with the scoring line in a small clean serif.
