import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  City,
  Department,
} from '../models';
import {CityRepository} from '../repositories';

export class CityDepartmentController {
  constructor(
    @repository(CityRepository)
    public cityRepository: CityRepository,
  ) { }

  @get('/cities/{id}/department', {
    responses: {
      '200': {
        description: 'Department belonging to City',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Department)},
          },
        },
      },
    },
  })
  async getDepartment(
    @param.path.number('id') id: typeof City.prototype.id,
  ): Promise<Department> {
    return this.cityRepository.department(id);
  }
}
