import type { InstantRules } from "@instantdb/react";

const adminBind = {
  isDashboardAdmin: "auth.email in auth.ref('$user.dashboardAdmin.email')",
} as const;

const rules = {
  $files: {
    allow: {
      view: "true",
      create: "isDashboardAdmin && isClientAsset",
      delete: "isDashboardAdmin && isClientAsset",
    },
    bind: {
      ...adminBind,
      isClientAsset: "data.path.startsWith('clients/')",
    },
  },
  clientMenus: {
    allow: {
      view: "true",
      create: "isDashboardAdmin",
      update: "isDashboardAdmin",
      delete: "isDashboardAdmin",
    },
    bind: adminBind,
  },
  dashboardAdmins: {
    allow: {
      view: "isDashboardAdmin || auth.email == data.email",
      create: "isDashboardAdmin",
      update: "isDashboardAdmin || auth.email == data.email",
      delete: "isDashboardAdmin && auth.email != data.email",
    },
    bind: adminBind,
  },
} satisfies InstantRules;

export default rules;
