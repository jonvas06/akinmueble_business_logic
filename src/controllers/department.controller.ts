import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Department} from '../models';
import {DepartmentRepository} from '../repositories';

export class DepartmentController {
  constructor(
    @repository(DepartmentRepository)
    public departmentRepository : DepartmentRepository,
  ) {}

  @post('/departments')
  @response(200, {
    description: 'Department model instance',
    content: {'application/json': {schema: getModelSchemaRef(Department)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Department, {
            title: 'NewDepartment',
            exclude: ['id'],
          }),
        },
      },
    })
    department: Omit<Department, 'id'>,
  ): Promise<Department> {
    return this.departmentRepository.create(department);
  }

  @get('/departments/count')
  @response(200, {
    description: 'Department model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Department) where?: Where<Department>,
  ): Promise<Count> {
    return this.departmentRepository.count(where);
  }

  @get('/departments')
  @response(200, {
    description: 'Array of Department model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Department, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Department) filter?: Filter<Department>,
  ): Promise<Department[]> {
    return this.departmentRepository.find(filter);
  }

  @patch('/departments')
  @response(200, {
    description: 'Department PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Department, {partial: true}),
        },
      },
    })
    department: Department,
    @param.where(Department) where?: Where<Department>,
  ): Promise<Count> {
    return this.departmentRepository.updateAll(department, where);
  }

  @get('/departments/{id}')
  @response(200, {
    description: 'Department model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Department, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Department, {exclude: 'where'}) filter?: FilterExcludingWhere<Department>
  ): Promise<Department> {
    return this.departmentRepository.findById(id, filter);
  }

  @patch('/departments/{id}')
  @response(204, {
    description: 'Department PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Department, {partial: true}),
        },
      },
    })
    department: Department,
  ): Promise<void> {
    await this.departmentRepository.updateById(id, department);
  }

  @put('/departments/{id}')
  @response(204, {
    description: 'Department PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() department: Department,
  ): Promise<void> {
    await this.departmentRepository.replaceById(id, department);
  }

  @del('/departments/{id}')
  @response(204, {
    description: 'Department DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.departmentRepository.deleteById(id);
  }
}
