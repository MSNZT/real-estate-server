import { formatError } from "@/errors/formatGraphqlError";
import { ApolloDriver } from "@nestjs/apollo";
import { join } from "path";

export const graphqlConfig = {
  driver: ApolloDriver,
  autoSchemaFile: join(process.cwd(), "src/schema.gql"),
  path: "/api/graphql",
  context: ({ req }) => ({ req }),
  formatError: formatError,
  debug: true,
};
