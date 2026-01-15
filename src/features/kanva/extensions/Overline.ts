import { Mark, mergeAttributes } from '@tiptap/core';

export interface OverlineOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    overline: {
      /**
       * Set an overline mark
       */
      setOverline: () => ReturnType;
      /**
       * Toggle an overline mark
       */
      toggleOverline: () => ReturnType;
      /**
       * Unset an overline mark
       */
      unsetOverline: () => ReturnType;
    };
  }
}

export const Overline = Mark.create<OverlineOptions>({
  name: 'overline',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[style*="text-decoration"]',
        getAttrs: (node) => {
          const element = node as HTMLElement;
          const style = element.style.textDecoration || '';
          if (style.includes('overline')) {
            return {};
          }
          return false;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        style: 'text-decoration: overline',
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setOverline: () => ({ commands }) => {
        return commands.setMark(this.name);
      },
      toggleOverline: () => ({ commands }) => {
        return commands.toggleMark(this.name);
      },
      unsetOverline: () => ({ commands }) => {
        return commands.unsetMark(this.name);
      },
    };
  },
});





