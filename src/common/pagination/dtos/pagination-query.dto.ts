import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  //   @Type(() => Number) // This is a decorator that tells class-transformer to transform the value to a number
  limit?: number;

  @IsOptional()
  @IsPositive()
  //   @Type(() => Number) -> Use implicit conversion in main.ts
  page?: number;
}
