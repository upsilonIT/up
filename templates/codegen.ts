import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema:
    "<VALUE>/graphql",
  documents: ["src/**/*.gql"],
  generates: {
    "src/graphql/schema.generated.gql": {
      plugins: ["schema-ast"],
    },
    "src/graphql/types.generated.ts": {
      plugins: [
        {
          add: {
            content: "/* eslint-disable */",
          },
        },
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
      config: {
        scalars: {
          DateTime: "string",
          Decimal: "string",
          BigInt: "number",
        },
      },
    },
  },
};

export default config;
