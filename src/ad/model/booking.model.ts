import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class BookingModel {
  @Field(() => Date)
  startDate: Date;

  @Field(() => Date)
  endDate: Date;
}
