# Scheduled Insights prototype (reference copy)

Reference snapshot of the Scheduled Insights design work (recurring AI-generated Trust Center reports, emailed on a cadence). Kept here so the links outlive temp.md. Not production code. Fixture data only.

## What is in here

- `wireframes/v1.html` and `wireframes/v2.html`: the greybox wireframes, self-contained. Open either file in a browser. v2 is the signed-off round; v1 is the frozen earlier round.
- `prototype/`: the standalone prototype, built from the `app-prototype` package in comply-ui (branch `Ivana/scheduled-insights`, PR #3846). Real navigation, the Insights Dashboard and Insights > Scheduled on fixture data through a mock service worker, placeholder pages elsewhere. The State Inspector panel in the bottom right steps through every screen and state.
- `source/app-prototype/`: the source of that standalone package, for reference. It only builds inside the comply-ui monorepo.
- `screens/`: full-height screenshots of the 25 states used for the Figma annotations (1440 wide).

## Running the prototype locally

The build expects to be served from the root of a web server, not from a subfolder.

    cd prototype
    python3 -m http.server 8010

Then open http://localhost:8010/ in a browser. The page redirects to Insights > Scheduled.

## Where the real work lives

- Code: comply-ui, branch `Ivana/scheduled-insights`, https://github.com/conveyor/comply-ui/pull/3846
- Figma annotations: Customer Trust file, page "Strike Zone: Scheduled Insights", section "Annotations"
