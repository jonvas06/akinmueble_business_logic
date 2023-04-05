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
import {Global} from '../models';
import {GlobalRepository} from '../repositories';

export class GlobalController {
  constructor(
    @repository(GlobalRepository)
    public globalRepository : GlobalRepository,
  ) {}

  @post('/globals')
  @response(200, {
    description: 'Global model instance',
    content: {'application/json': {schema: getModelSchemaRef(Global)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Global, {
            title: 'NewGlobal',
            exclude: ['id'],
          }),
        },
      },
    })
    global: Omit<Global, 'id'>,
  ): Promise<Global> {
    return this.globalRepository.create(global);
  }

  @get('/globals/count')
  @response(200, {
    description: 'Global model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Global) where?: Where<Global>,
  ): Promise<Count> {
    return this.globalRepository.count(where);
  }

  @get('/globals')
  @response(200, {
    description: 'Array of Global model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Global, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Global) filter?: Filter<Global>,
  ): Promise<Global[]> {
    return this.globalRepository.find(filter);
  }

  @patch('/globals')
  @response(200, {
    description: 'Global PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Global, {partial: true}),
        },
      },
    })
    global: Global,
    @param.where(Global) where?: Where<Global>,
  ): Promise<Count> {
    return this.globalRepository.updateAll(global, where);
  }

  @get('/globals/{id}')
  @response(200, {
    description: 'Global model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Global, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Global, {exclude: 'where'}) filter?: FilterExcludingWhere<Global>
  ): Promise<Global> {
    return this.globalRepository.findById(id, filter);
  }

  @patch('/globals/{id}')
  @response(204, {
    description: 'Global PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Global, {partial: true}),
        },
      },
    })
    global: Global,
  ): Promise<void> {
    await this.globalRepository.updateById(id, global);
  }

  @put('/globals/{id}')
  @response(204, {
    description: 'Global PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() global: Global,
  ): Promise<void> {
    await this.globalRepository.replaceById(id, global);
  }

  @del('/globals/{id}')
  @response(204, {
    description: 'Global DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.globalRepository.deleteById(id);
  }
}
