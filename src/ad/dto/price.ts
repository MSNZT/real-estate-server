import { Scalar, CustomScalar } from "@nestjs/graphql";
import { Kind, ValueNode, GraphQLError } from "graphql";

@Scalar("Price")
export class PriceScalar implements CustomScalar<number, number> {
  description = "A custom scalar that validates and transforms price values";

  parseValue(value: unknown): number {
    if (typeof value !== "number") {
      throw new GraphQLError("Цена должна быть числом");
    }

    if (value <= 0) {
      throw new GraphQLError("Цена должна быть положительным числом");
    }

    return value;
  }

  serialize(value: unknown): number {
    if (typeof value !== "number") {
      throw new GraphQLError("Цена должна быть числом");
    }
    return value;
  }

  parseLiteral(ast: ValueNode): number {
    // Проверка на наличие значения в GraphQL-запросе
    if (ast.kind === Kind.NULL) {
      throw new GraphQLError('Поле "price" обязательно для заполнения');
    }

    // Проверка на тип числа (FLOAT или INT)
    if (ast.kind !== Kind.FLOAT && ast.kind !== Kind.INT) {
      throw new GraphQLError("Цена должна быть числом");
    }

    const value = parseFloat(ast.value);

    // Проверка на положительное значение
    if (value <= 0) {
      throw new GraphQLError("Цена должна быть положительным числом");
    }

    return value;
  }
}
