import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Department,
  City,
} from '../models';
import {DepartmentRepository} from '../repositories';

export class DepartmentCityController {
  constructor(
    @repository(DepartmentRepository) protected departmentRepository: DepartmentRepository,
  ) { }

  @get('/departments/{id}/cities', {
    responses: {
      '200': {
        description: 'Array of Department has many City',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(City)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<City>,
  ): Promise<City[]> {
    return this.departmentRepository.cities(id).find(filter);
  }

  @post('/departments/{id}/cities', {
    responses: {
      '200': {
        description: 'Department model instance',
        content: {'application/json': {schema: getModelSchemaRef(City)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Department.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(City, {
            title: 'NewCityInDepartment',
            exclude: ['id'],
            optional: ['departmentId']
          }),
        },
      },
    }) city: Omit<City, 'id'>,
  ): Promise<City> {
    return this.departmentRepository.cities(id).create(city);
  }

  @patch('/departments/{id}/cities', {
    responses: {
      '200': {
        description: 'Department.City PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(City, {partial: true}),
        },
      },
    })
    city: Partial<City>,
    @param.query.object('where', getWhereSchemaFor(City)) where?: Where<City>,
  ): Promise<Count> {
    return this.departmentRepository.cities(id).patch(city, where);
  }

  @del('/departments/{id}/cities', {
    responses: {
      '200': {
        description: 'Department.City DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(City)) where?: Where<City>,
  ): Promise<Count> {
    return this.departmentRepository.cities(id).delete(where);
  }
}
