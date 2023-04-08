import {authenticate} from '@loopback/authentication';
import {service} from '@loopback/core';
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
  HttpErrors,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {SecurityConfiguration} from '../config/security.config';
import {Advisor, Property} from '../models';
import {AdvisorRepository, PropertyRepository} from '../repositories';
import {AdvisorPropertyService} from '../services/advisor-property.service';
import {PropertyService} from '../services/property.service';

export class AdvisorPropertyController {
  constructor(
    @repository(AdvisorRepository)
    protected advisorRepository: AdvisorRepository,
    @service(PropertyService)
    private propertyService: PropertyService,
    @repository(PropertyRepository)
    private propertyRepository: PropertyRepository,
    @service(AdvisorPropertyService)
    private advisorPropertyService: AdvisorPropertyService,
  ) {}
  @authenticate({
    strategy: 'auth',
    options: [
      SecurityConfiguration.menus.menuPropertyId,
      SecurityConfiguration.actions.listAction,
    ],
  })
  @get('/advisors/{id}/properties', {
    responses: {
      '200': {
        description: 'Array of Advisor has many Property',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Property)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Property>,
  ): Promise<Property[]> {
    return this.advisorRepository.properties(id).find(filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [
      SecurityConfiguration.menus.menuPropertyId,
      SecurityConfiguration.actions.createAction,
    ],
  })
  @post('/advisors/{id}/properties', {
    responses: {
      '200': {
        description: 'Advisor model instance',
        content: {'application/json': {schema: getModelSchemaRef(Property)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Advisor.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Property, {
            title: 'NewPropertyInAdvisor',
            exclude: ['id'],
            optional: ['advisorId'],
          }),
        },
      },
    })
    property: Omit<Property, 'id'>,
  ): Promise<Property> {
    this.propertyService.setPropertyDefaulValues(property);
    return this.advisorRepository.properties(id).create(property);
  }

  @authenticate({
    strategy: 'auth',
    options: [
      SecurityConfiguration.menus.menuPropertyId,
      SecurityConfiguration.actions.editAction,
    ],
  })
  @patch('/advisors/{id}/property', {
    responses: {
      '200': {
        description: 'Advisor.Property PATCH success count',
        content: {'application/json': {schema: getModelSchemaRef(Property)}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Property, {partial: true}),
        },
      },
    })
    property: Partial<Property>,
    @param.query.object('where', getWhereSchemaFor(Property))
    where?: Where<Property>,
  ): Promise<Property> {
    try {
      return await this.advisorPropertyService.createPropertyByAdvisor(
        id,
        property as Property,
      );
    } catch (error) {
      if (error.name == 'Error') {
        throw new HttpErrors[400](error.message);
      }
      throw error;
    }
  }

  @authenticate({
    strategy: 'auth',
    options: [
      SecurityConfiguration.menus.menuPropertyId,
      SecurityConfiguration.actions.deleteAction,
    ],
  })
  @del('/advisors/{advisorId}/properties/{propertyId}', {
    responses: {
      '200': {
        description: 'Advisor.Property DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('advisorId') advisorId: number,
    @param.path.number('propertyId') propertyId: number,
    @param.query.object('where', getWhereSchemaFor(Property))
    where?: Where<Property>,
  ): Promise<Count> {
    return this.advisorPropertyService.deletePropertyByAdvisor(
      advisorId,
      propertyId,
    );
  }
}
