import { Body, Controller, Post } from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { ResponseMessage } from 'src/core/decorators/response-message.decorators';
import { CreateProductCategoryInput } from './product-category.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('product-category')
@ApiTags('product-category')
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @Post()
  @ResponseMessage('Product category created successfully')
  async createProductCategory(@Body() input: CreateProductCategoryInput) {
    return this.productCategoryService.createProductCategory(input);
  }
}
