import { CategoryService } from "./../category/category.service";
import { Injectable } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductRepo } from "./product.repository";
import { DELETED_SUCCESSFULLY, UPDATED_SUCCESSFULLY } from "messages";
import { CustomError } from "shared/custom-error/custom-error";

@Injectable()
export class ProductService {
  constructor(private readonly productRepo: ProductRepo, private readonly categoryService: CategoryService) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = await this.productRepo.create(createProductDto);
      const category = await this.categoryService.findOne(product.category);
      product.category = category.name;
    } catch (error) {
      throw new CustomError(400, error.message);
    }
  }

  async findAll() {
    return await this.productRepo.findAll();
  }

  async findOne(id: number) {
    const product = await this.productRepo.findOne(id);
    if (!product) throw new CustomError(401, "Product Not Found");
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const updatedProduct = await this.productRepo.update(id, updateProductDto);
    if (updatedProduct.affected == 0) throw new CustomError(401, "Product Not Found");
    return { message: UPDATED_SUCCESSFULLY };
  }

  async remove(id: number) {
    const deletedProduct = await this.productRepo.remove(+id);
    if (deletedProduct.affected == 0) throw new CustomError(401, "Product Not Found");
    return { message: DELETED_SUCCESSFULLY };
  }
}
