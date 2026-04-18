/**
 * Keys listed here hold Attio English placeholder copy that will be swapped
 * during the post-Sprint-3 brand/localization pass. Both en.json and tr.json
 * carry the English placeholder for V1; the brand pass translates both files.
 *
 * Append CallWidget dict keys here as Chrome extraction (Task 6) finalizes
 * the widget's dictionary shape.
 */
export const BRAND_PENDING_KEYS = [
  "meetingPage.hero.badge",
  "meetingPage.hero.headlinePrimary",
  "meetingPage.hero.headlineMuted",
  "meetingPage.hero.subhead",
  "meetingPage.hero.ctaPrimary",
  "meetingPage.hero.ctaSecondary",
  "meetingPage.hero.ctaTertiary",
  "mockups.callWidget.meetingTitle",
  "mockups.callWidget.tabActive",
  "mockups.callWidget.tabInactive",
  "mockups.callWidget.summaryTitle",
  "mockups.callWidget.highlightPillLabel",
  "mockups.callWidget.insightsTitle",
  "mockups.callWidget.timeElapsed",
  "mockups.callWidget.timeTotal",
] as const;

export type BrandPendingKey = (typeof BRAND_PENDING_KEYS)[number];
