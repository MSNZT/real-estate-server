import { GraphQLError } from "graphql";

export function formatError(error: GraphQLError) {
  const fieldMatch = error.message.match(/Field \"(.+?)\" of required type/);
  if (fieldMatch) {
    return {
      message: `Отсутствует обязательное поле: ${fieldMatch[1]}`,
      field: fieldMatch[1],
      code: error.extensions?.code || "BAD_USER_INPUT",
      statusCode: error.extensions?.statusCode || 400,
    };
  }

  return {
    message: error.message,
    statusCode: error.extensions?.statusCode || 500,
    extensions: {
      code: error.extensions?.code || "INTERNAL_SERVER_ERROR",
      ...(error.extensions?.errors && { errors: error.extensions.errors }),
    },
  };
}
