import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;

  constructor({
    paginationOptions,
    total,
  }: {
    paginationOptions: PaginationOptions;
    total: number;
  }) {
    this.page = paginationOptions.page;
    this.limit = paginationOptions.limit;
    this.total = total;
    this.totalPages = Math.ceil(total / paginationOptions.limit);
    this.hasPrevPage = this.page > 1;
    this.hasNextPage = this.page < this.totalPages;
  }
}

export class PaginationOptions {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  limit?: number = 10;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}
