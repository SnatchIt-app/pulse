// Single source of truth for design tokens. Mirrored as CSS vars in styles/tokens.css.
export const colors = {
  ink: "#0A0A0A",
  paper: "#F6F2EC",
  graphite: "#16161A",
  smoke: "#1E1E22",
  bone: "#EDE7DC",
  brass: "#B89968",
} as const;

export const easing = { pulse: "cubic-bezier(0.16, 1, 0.3, 1)" } as const;

export const duration = { fast: 220, base: 480, slow: 700 } as const;

export const space = {
  containerXDesktop: 96,
  containerXMobile: 24,
  sectionYDesktop: 128,
  sectionYMobile: 80,
} as const;

export const radii = { none: 0, sm: 2, md: 6, lg: 12, pill: 9999 } as const;
