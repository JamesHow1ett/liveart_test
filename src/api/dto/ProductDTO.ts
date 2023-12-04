import { CategoryDTO } from './CategoryDTO';
import { TagsDTO } from './TagsDTO';

export interface ProductDTO {
  id?: string;
  name: string;
  categoryId?: string;
  description?: string;
  category?: CategoryDTO;
  file?: File;
  tags: Array<TagsDTO>;
}
