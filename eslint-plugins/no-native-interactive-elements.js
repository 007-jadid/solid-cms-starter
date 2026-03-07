/**
 * Custom ESLint rule: no-native-interactive-elements
 *
 * Prevents usage of native HTML interactive elements (<button>, <input>,
 * <select>, <textarea>) outside of the project's UI component definition
 * directories. Forces developers to use the shared component library.
 */

import path from "node:path";

/** Directories where native elements ARE allowed (component definitions) */
const ALLOWED_DIRS = [
  "src/features/ui/components",
  "src/features/ui/form",
  "src/features/ui/form/fields",
  "src/features/ui/data-table",
];

/** Map of banned native elements → recommended component imports */
const BANNED_ELEMENTS = {
  button: {
    component: "Button",
    importPath: "~/features/ui/components/button",
  },
  input: {
    component: "Input",
    importPath: "~/features/ui/components/input",
  },
  select: {
    component: "Select",
    importPath: "~/features/ui/components/select",
  },
  textarea: {
    component: "Textarea",
    importPath: "~/features/ui/components/textarea",
  },
};

/** @type {import("eslint").Rule.RuleModule} */
const rule = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce usage of shared UI components instead of native HTML interactive elements",
    },
    messages: {
      noNativeElement:
        "Use <{{component}}> from '{{importPath}}' instead of native <{{element}}>. " +
        "Native interactive elements should only be used inside component definitions.",
    },
    schema: [],
  },

  create(context) {
    const filename = context.filename || context.getFilename();
    const relPath = path
      .relative(process.cwd(), filename)
      .replaceAll("\\", "/");

    // Allow native elements inside component definition directories
    const isAllowed = ALLOWED_DIRS.some((dir) => relPath.startsWith(dir));
    if (isAllowed) return {};

    return {
      JSXOpeningElement(node) {
        // Only check lowercase element names (native HTML elements)
        // Component names like <Button> start with uppercase
        const elementName =
          node.name.type === "JSXIdentifier" ? node.name.name : null;
        if (!elementName) return;

        const banned = BANNED_ELEMENTS[elementName];
        if (!banned) return;

        // Special case: hidden file inputs are acceptable (e.g. <input type="file" class="hidden">)
        if (elementName === "input") {
          const typeAttr = node.attributes.find(
            (attr) =>
              attr.type === "JSXAttribute" &&
              attr.name.name === "type" &&
              attr.value?.type === "Literal" &&
              attr.value.value === "file",
          );
          const hiddenAttr = node.attributes.find(
            (attr) =>
              attr.type === "JSXAttribute" &&
              attr.name.name === "class" &&
              attr.value?.type === "Literal" &&
              typeof attr.value.value === "string" &&
              attr.value.value.includes("hidden"),
          );
          if (typeAttr && hiddenAttr) return;
        }

        context.report({
          node,
          messageId: "noNativeElement",
          data: {
            element: elementName,
            component: banned.component,
            importPath: banned.importPath,
          },
        });
      },
    };
  },
};

export default {
  rules: {
    "no-native-interactive-elements": rule,
  },
};
