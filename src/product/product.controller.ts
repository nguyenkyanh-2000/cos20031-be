import { Body, Controller, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { ResponseMessage } from 'src/core/decorators/response-message.decorators';
import { CreateProductInput } from './product.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('product')
@ApiTags('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ResponseMessage('Product created successfully')
  async createProduct(@Body() input: CreateProductInput) {
    return this.productService.createProduct(input);
  }
}
