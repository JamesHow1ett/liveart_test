import Mapper from './Mapper';
import { Tags } from '../entities/Tags';
import { TagsDTO } from '../../api/dto/TagsDTO';
import { mapValueToInterface } from '../../utils/models';

export class TagsMapper extends Mapper<Tags, TagsDTO> {
  mapFromDTO(productDTO: TagsDTO): Tags {
    return new Tags(<Partial<Tags>>productDTO);
  }

  mapToDTO(product: Tags): TagsDTO {
    return mapValueToInterface(product);
  }
}
