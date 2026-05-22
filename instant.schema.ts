import { i } from "@instantdb/react";

const _schema = i.schema({
  entities: {
    $users: i.entity({
      email: i.string().unique().indexed().optional(),
    }),
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.string(),
    }),
    clientMenus: i.entity({
      clientId: i.string().unique().indexed(),
      slug: i.string().unique().indexed(),
      hidden: i.boolean(),
      config: i.json(),
      versions: i.json(),
      updatedAt: i.string(),
    }),
    dashboardAdmins: i.entity({
      email: i.string().unique().indexed(),
    }),
  },
  links: {
    dashboardAdminUser: {
      forward: { on: "dashboardAdmins", has: "one", label: "$user" },
      reverse: { on: "$users", has: "one", label: "dashboardAdmin" },
    },
  },
  rooms: {},
});

type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
