import { i } from "@instantdb/react";

const _schema = i.schema({
  entities: {
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
  },
  links: {},
  rooms: {},
});

type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
