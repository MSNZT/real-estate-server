import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Owner {
  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  avatar: string;
}
