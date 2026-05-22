import type { InstantRules } from "@instantdb/react";

const rules = {
  $files: {
    allow: {
      view: "true",
      create: "isClientAsset",
      delete: "isClientAsset",
    },
    bind: {
      isClientAsset: "data.path.startsWith('clients/')",
    },
  },
  clientMenus: {
    allow: {
      view: "true",
      create: "true",
      update: "true",
      delete: "true",
    },
  },
} satisfies InstantRules;

export default rules;
