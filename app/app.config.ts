export default defineAppConfig({
  ui: {
    colors: {
      primary: "yellow",
      neutral: "gray",
    },
  },
  uiPro: {
    main: {
      base: "min-h-[calc(100vh-var(--ui-header-height)-var(--ui-footer-height))]",
    },
  },
});
