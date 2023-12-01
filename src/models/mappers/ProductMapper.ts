import Mapper from './Mapper';
import { Product } from '../../models/entities/Product';
import { ProductDTO } from '../../api/dto/ProductDTO';
import { mapToFormData, mapValueToInterface } from '../../utils/models';

export class ProductMapper extends Mapper<Product, ProductDTO> {
  mapFromDTO(productDTO: ProductDTO): Product {
    return new Product(<Partial<Product>>productDTO);
  }

  mapToDTO(product: Product): ProductDTO {
    return mapValueToInterface(product) as ProductDTO;
  }

  override mapToFormDataDTO(item: Product, fields: string[]): FormData {
    return mapToFormData(item, fields);
  }
}
