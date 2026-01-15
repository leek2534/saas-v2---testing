import type { TextSettings, TextSubtype } from "./types";

export function getDefaultTextSettings(subtype: TextSubtype): TextSettings {
  const baseSettings: Omit<TextSettings, "subtype" | "semanticTag" | "typography"> = {
    content: {
      text: "",
      placeholder: getDefaultPlaceholder(subtype),
      richTextEnabled: false,
      allowLineBreaks: subtype === "paragraph",
      dynamicTokens: { enabled: false },
    },
    colorEffects: {
      color: "#111111",
      opacity: 1,
    },
    layout: {
      widthMode: "auto",
      maxWidth: subtype === "paragraph" ? { value: 640, unit: "px" } : undefined,
      margin: { top: 0, right: 0, bottom: 16, left: 0, unit: "px" },
      padding: { top: 12, right: 16, bottom: 12, left: 16, unit: "px" },
      display: "block",
      whiteSpace: "normal",
      overflow: "visible",
    },
    wrapper: {
      useSiteStyles: true,
    },
    actions: {
      blockClick: { type: "none" },
      linkStyle: { enabled: true, underline: "hover" },
    },
    responsive: {
      hiddenOn: { desktop: false, tablet: false, mobile: false },
    },
    seoA11y: {},
    advanced: {},
  };

  switch (subtype) {
    case "heading":
      return {
        ...baseSettings,
        subtype: "heading",
        semanticTag: "h1",
        typography: {
          fontFamily: "Inter",
          fontWeight: 700,
          fontSize: { value: 48, unit: "px" },
          lineHeight: { value: 1.1, unit: "unitless" },
          letterSpacing: { value: -0.02, unit: "em" },
          align: "left",
          transform: "none",
          wrap: "balance",
        },
        overrides: {
          mobile: {
            typography: {
              fontFamily: "Inter",
              fontWeight: 700,
              fontSize: { value: 34, unit: "px" },
              lineHeight: { value: 1.1, unit: "unitless" },
              letterSpacing: { value: -0.02, unit: "em" },
              align: "left",
              transform: "none",
              wrap: "balance",
            },
          },
        },
      };

    case "subheading":
      return {
        ...baseSettings,
        subtype: "subheading",
        semanticTag: "h2",
        typography: {
          fontFamily: "Inter",
          fontWeight: 600,
          fontSize: { value: 24, unit: "px" },
          lineHeight: { value: 1.2, unit: "unitless" },
          letterSpacing: { value: -0.01, unit: "em" },
          align: "left",
          transform: "none",
          wrap: "balance",
        },
        overrides: {
          mobile: {
            typography: {
              fontFamily: "Inter",
              fontWeight: 600,
              fontSize: { value: 20, unit: "px" },
              lineHeight: { value: 1.2, unit: "unitless" },
              letterSpacing: { value: -0.01, unit: "em" },
              align: "left",
              transform: "none",
              wrap: "balance",
            },
          },
        },
      };

    case "paragraph":
      return {
        ...baseSettings,
        subtype: "paragraph",
        semanticTag: "p",
        typography: {
          fontFamily: "Inter",
          fontWeight: 400,
          fontSize: { value: 16, unit: "px" },
          lineHeight: { value: 1.6, unit: "unitless" },
          letterSpacing: { value: 0, unit: "em" },
          align: "left",
          transform: "none",
          wrap: "normal",
          hyphenation: false,
        },
        overrides: {
          mobile: {
            typography: {
              fontFamily: "Inter",
              fontWeight: 400,
              fontSize: { value: 15, unit: "px" },
              lineHeight: { value: 1.6, unit: "unitless" },
              letterSpacing: { value: 0, unit: "em" },
              align: "left",
              transform: "none",
              wrap: "normal",
              hyphenation: false,
            },
          },
        },
      };
  }
}

function getDefaultPlaceholder(subtype: TextSubtype): string {
  switch (subtype) {
    case "heading":
      return "Enter your heading...";
    case "subheading":
      return "Enter your subheading...";
    case "paragraph":
      return "Enter your paragraph text...";
  }
}
