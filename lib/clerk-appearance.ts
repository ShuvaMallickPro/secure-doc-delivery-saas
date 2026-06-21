/** Solid surface — disables Clerk v5+ glass / backdrop blur. */
const solidSurface = {
  backgroundColor: "var(--background)",
  backdropFilter: "none",
  WebkitBackdropFilter: "none",
} as const;

const profileElements = {
  rootBox: solidSurface,
  card: {
    ...solidSurface,
    border: "1px solid var(--border)",
  },
  navbar: solidSurface,
  navbarButtons: solidSurface,
  pageScrollBox: solidSurface,
  page: solidSurface,
  profilePage: solidSurface,
  profileSection: solidSurface,
  profileSectionContent: solidSurface,
  scrollBox: solidSurface,
  headerTitle: { color: "var(--foreground)" },
  headerSubtitle: { color: "var(--muted-foreground)" },
} as const;

export const clerkAppearance = {
  variables: {
    // Theme tokens are oklch — do NOT wrap in hsl().
    colorPrimary: "var(--primary)",
    colorBackground: "var(--background)",
    colorText: "var(--foreground)",
    colorTextSecondary: "var(--muted-foreground)",
    colorInputBackground: "var(--background)",
    colorInputText: "var(--foreground)",
    colorModalBackdrop: "rgba(0, 0, 0, 0.55)",
    // borderRadius omitted — Clerk uses its default corner radius.
  },
  elements: {
    ...profileElements,
    modalContent: {
      ...solidSurface,
      border: "1px solid var(--border)",
      boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    },
    modalBackdrop: {
      backgroundColor: "rgba(0, 0, 0, 0.55)",
      backdropFilter: "none",
      WebkitBackdropFilter: "none",
    },
    userButtonPopoverCard: {
      ...solidSurface,
      border: "1px solid var(--border)",
      boxShadow:
        "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    },
    userButtonPopoverMain: solidSurface,
    userButtonPopoverActions: solidSurface,
    userButtonPopoverFooter: {
      backgroundColor: "var(--muted)",
      backdropFilter: "none",
      WebkitBackdropFilter: "none",
    },
  },
  userProfile: {
    elements: profileElements,
  },
};
