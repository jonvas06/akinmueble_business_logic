import {Filter, repository} from '@loopback/repository';
import {get, getModelSchemaRef, param, response} from '@loopback/rest';
import {Property} from '../models';
import {PropertyRepository} from '../repositories';

export class PropertyController {
  constructor(
    @repository(PropertyRepository)
    public propertyRepository: PropertyRepository,
  ) {}

  // @authenticate({
  //   strategy: 'auth',
  //   options: [
  //     SecurityConfiguration.menus.menuPropertyId,
  //     SecurityConfiguration.actions.createAction,
  //   ],
  // })

  /**
   * Se comenta este POST ya que aun no vemos la necesidad de que sea usado, ya
   * que el unico que puede crear propiedades hasta el momento es el ASESOR
   * Posiblemente mas adelante se habilitara esta accion para el administrador
   */
  // @post('/properties')
  // @response(200, {
  //   description: 'Property model instance',
  //   content: {'application/json': {schema: getModelSchemaRef(Property)}},
  // })
  // async create(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Property, {
  //           title: 'NewProperty',
  //           exclude: ['id'],
  //         }),
  //       },
  //     },
  //   })
  //   property: Omit<Property, 'id'>,
  // ): Promise<Property> {
  //   return this.propertyRepository.create(property);
  // }

  /**
   * Aun no se da la necesidad de esta acción
   */
  // @get('/properties/count')
  // @response(200, {
  //   description: 'Property model count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async count(@param.where(Property) where?: Where<Property>): Promise<Count> {
  //   return this.propertyRepository.count(where);
  // }
  /**
   * Esta accion GET  la dejaremos habilitada por ahora, ya que
   * todas la spropiedas deben ser consumidas desde la pagina web
   * para ser mostradas al publico.
   *
   * Posiblemente mas adelante tambien la necesite administrador
   */

  @get('/properties')
  @response(200, {
    description: 'Array of Property model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Property, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Property) filter?: Filter<Property>,
  ): Promise<Property[]> {
    return this.propertyRepository.find(filter);
  }

  /**
   * Se comenta este PATCH ya que aun no vemos la necesidad de que sea usado, ya
   * que el unico que puede EDITAR propiedades hasta el momento es el ASESOR
   * Posiblemente mas adelante se habilitara esta accion para el administrador
   */
  // @patch('/properties')
  // @response(200, {
  //   description: 'Property PATCH success count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async updateAll(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Property, {partial: true}),
  //       },
  //     },
  //   })
  //   property: Property,
  //   @param.where(Property) where?: Where<Property>,
  // ): Promise<Count> {
  //   return this.propertyRepository.updateAll(property, where);
  // }

  /**
   * Se comenta este GET ya que aun no vemos la necesidad de que sea usado, ya
   * que el unico que puede OBTENER propiedades hasta el momento es el ASESOR,
   * y solo puede obtener las propiedas que ha creado
   * Posiblemente mas adelante se habilitara esta accion para el administrador
   */
  // @get('/properties/{id}')
  // @response(200, {
  //   description: 'Property model instance',
  //   content: {
  //     'application/json': {
  //       schema: getModelSchemaRef(Property, {includeRelations: true}),
  //     },
  //   },
  // })
  // async findById(
  //   @param.path.number('id') id: number,
  //   @param.filter(Property, {exclude: 'where'})
  //   filter?: FilterExcludingWhere<Property>,
  // ): Promise<Property> {
  //   return this.propertyRepository.findById(id, filter);
  // }

  /**
   * Se comenta este PATCH ya que aun no vemos la necesidad de que sea usado, ya
   * que el unico que puede EDITAR propiedades hasta el momento es el ASESOR
   * Posiblemente mas adelante se habilitara esta accion para el administrador
   */
  // @patch('/properties/{id}')
  // @response(204, {
  //   description: 'Property PATCH success',
  // })
  // async updateById(
  //   @param.path.number('id') id: number,
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Property, {partial: true}),
  //       },
  //     },
  //   })
  //   property: Property,
  // ): Promise<void> {
  //   await this.propertyRepository.updateById(id, property);
  // }

  /**
   * Aun no se da la necesidad de esta acción
   */
  // @put('/properties/{id}')
  // @response(204, {
  //   description: 'Property PUT success',
  // })
  // async replaceById(
  //   @param.path.number('id') id: number,
  //   @requestBody() property: Property,
  // ): Promise<void> {
  //   await this.propertyRepository.replaceById(id, property);
  // }

  /**
   * Se comenta este DELETE ya que aun no vemos la necesidad de que sea usado, ya
   * que el unico que puede ELIMINAR propiedades hasta el momento es el ASESOR
   * Posiblemente mas adelante se habilitara esta accion para el administrador
   */
  // @del('/properties/{id}')
  // @response(204, {
  //   description: 'Property DELETE success',
  // })
  // async deleteById(@param.path.number('id') id: number): Promise<void> {
  //   await this.propertyRepository.deleteById(id);
  // }
}
