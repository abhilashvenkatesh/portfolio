# Capability: projects-listing-bridge

## REMOVED Requirements

### Requirement: Projects listing page

**Reason**: The `/projects` listing is no longer a minimal bridge. This capability is renamed to `projects-listing-page`, which carries the full listing behaviour (problem/impact/stack cards, hover treatment, source links, staggered scroll-in).

**Migration**: See `projects-listing-page` → "Projects listing page". Behaviour is preserved and extended; no consumer action required.

### Requirement: Card links to detail page

**Reason**: Renamed into the `projects-listing-page` capability, which retains the card-to-detail link unchanged.

**Migration**: See `projects-listing-page` → "Card links to detail page". Detail pages remain reachable from the listing; no consumer action required.
