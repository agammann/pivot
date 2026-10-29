# Pivot: route research prototype

Pivot is an experimental offline visual study for a rigid rectangular item, a clear doorway, and an ideal 90-degree corridor. It detects two necessary-condition failures; every other case is **unknown**, not a fit or route. This alpha is not evidence of product demand or safe moving.

## Try it

Install Node.js 20 or newer; no packages, network, or account are needed.

```sh
node serve.mjs
```

Open the printed loopback address and press Ctrl+C to stop. Change the numeric fields to update the schematic and check. The diagram is illustrative and not to scale; it does not depict a path or swept area. Save and open portable JSON projects, or print the measurement checklist. Values remain on your device unless you share the saved file. The default example is synthetic. Use a single consistent unit for all values.

Run `node --check app.mjs`, `node --check serve.mjs`, `node --test` and `node pivot.mjs example.json` to verify the source and command-line example.

## Method and limitations

Uncertainty is a non-negative absolute error applied independently to each measurement. Margin is added to all sides of the item. The door check compares the smallest possible item dimension plus twice the margin against the largest possible clear opening. The turn check compares the smallest possible long dimension plus twice the margin against the ideal zero-thickness line bound `(a^(2/3) + b^(2/3))^(3/2)` for infinite unobstructed corridors of the largest possible widths. A rectangle with its margin contains a line of that length, so failing this optimistic bound rules it out in the ideal model. Passing either check does not provide a path. This assumes a rigid rectangle moving at floor level through the complete opening and right-angle turn.

There is no path search, swept-path drawing, Roomshift integration, arbitrary route segments, obstacles, finite corridor lengths, door thickness, stairs, height, tilt, lifting, weight or handling assessment. Measure protrusions and real clearances. Do not use this result to establish safety or whether a real move is possible. Missing or invalid input is rejected rather than guessed.

## Context

[ItemFits](https://itemfits.com/what-itemfits-checks) already checks doors, turns and more of a route. [Passage](https://artwaste.land/tools/passage/) already offers local 3D route planning and portable projects. [Sweet Home 3D](https://www.sweethome3d.com/) addresses room and furniture planning. This is a comparison and measurement aid, not a novelty claim or a general planner. The original integration hypothesis remains untested: ask existing Roomshift users whether keeping route measurements with their room project adds value before investing further. No Roomshift source or project data was used.

Original code is MIT licensed; see [LICENSE](LICENSE).
