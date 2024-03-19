
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "https://d2cfl6i2unjjnl.cloudfront.net/graphql",
  documents: "**/*.{tsx,ts}",
  generates: {
    "gql/": {
      preset: "client",
      plugins: []
    },
    "./graphql.schema.json": {
      plugins: ["introspection"]
    }
  }
};

export default config;
