import { TagsDTO } from '../dto/TagsDTO';
import { CrudEndpoint } from '../common/CrudEndpoint';

export class TagsCRUD extends CrudEndpoint<TagsDTO> {
  constructor() {
    super('tags');
  }
}
