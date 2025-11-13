/**
 * Shiki transformer that adds file name labels to code blocks.
 * 
 * 完全复刻 AstroPaper 的 fileName.js 实现
 * 参考: astro-paper/src/utils/transformers/fileName.js
 * 
 * @param options - Configuration options for the transformer
 * @param options.style - The styling variant to use ("v1" or "v2")
 * @param options.hideDot - Whether to hide the green dot indicator
 */

import type { ShikiTransformer } from "shiki";

interface FileNameTransformerOptions {
  style?: "v1" | "v2";
  hideDot?: boolean;
}

export const transformerFileName = ({
  style = "v2",
  hideDot = false,
}: FileNameTransformerOptions = {}): ShikiTransformer => ({
  name: "transformer-file-name",
  pre(node) {
    // Add CSS custom property to the node
    const fileNameOffset = style === "v1" ? "0.75rem" : "-0.75rem";
    node.properties.style =
      (node.properties.style || "") + `--file-name-offset: ${fileNameOffset};`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = (this.options.meta as any)?.__raw?.split(" ");

    if (!raw) return;

    const metaMap = new Map<string, string>();

    for (const item of raw) {
      const [key, value] = item.split("=");
      if (!key || !value) continue;
      metaMap.set(key, value.replace(/["'`]/g, ""));
    }

    const file = metaMap.get("file");

    if (!file) return;

    // Add additional margin to code block
    const existingClass = node.properties.class || [];
    const classArray = Array.isArray(existingClass) ? existingClass : [existingClass];
    classArray.push("mt-8");
    if (style === "v1") {
      classArray.push("rounded-tl-none");
    }
    node.properties.class = classArray.filter(c => typeof c === 'string' || typeof c === 'number') as (string | number)[];

    // Add file name to code block
    node.children.push({
      type: "element",
      tagName: "span",
      properties: {
        class: [
          "absolute py-1 text-foreground text-xs font-medium leading-4",
          hideDot
            ? "px-2"
            : "pl-4 pr-2 before:inline-block before:size-1 before:bg-green-500 before:rounded-full before:absolute before:top-[45%] before:left-2",
          style === "v1"
            ? "left-0 -top-6 rounded-t-md border border-b-0 bg-muted/50"
            : "left-2 top-(--file-name-offset) border rounded-md bg-background",
        ],
      },
      children: [
        {
          type: "text",
          value: file,
        },
      ],
    });
  },
});
