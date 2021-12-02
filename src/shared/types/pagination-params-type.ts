import { ApiQuery } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, Min } from "class-validator";

export class PaginationParams {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    offset?:number

    @IsOptional()
    @Type(() => Number)
    @Min(0)
    limit?:number;
}