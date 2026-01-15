import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";

export const tiptapExtensions = [
  StarterKit,
  Underline,
  TextStyle,
  Color,
  Highlight.configure({ multicolor: true }),
  Subscript,
  Superscript,
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  Link.configure({
    openOnClick: true,
    autolink: true,
    linkOnPaste: true,
    isAllowedUri: (url: string, ctx: any) => {
      const allowed = ["http", "https", "mailto", "tel"];
      try {
        const parsed = new URL(url, "https://example.com");
        const protocol = parsed.protocol.replace(":", "");
        if (!allowed.includes(protocol)) return false;
        return ctx.defaultValidate(url);
      } catch {
        return false;
      }
    },
  }),
];
