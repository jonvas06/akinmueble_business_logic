import {authenticate} from '@loopback/authentication';
import {inject, service} from '@loopback/core';
import {Count, CountSchema, Filter, repository} from '@loopback/repository';
import {
  Request,
  RestBindings,
  del,
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
} from '@loopback/rest';
import {Response} from 'express-serve-static-core';
import {SecurityConfiguration} from '../config/security.config';
import {PropertyPicture} from '../models';
import {PropertyRepository} from '../repositories';
import {PropertyPropertyPictureService} from '../services/property-propertyPicture.service';

export class PropertyPropertyPictureController {
  constructor(
    @repository(PropertyRepository)
    protected propertyRepository: PropertyRepository,
    @service(PropertyPropertyPictureService)
    private propertyPropertyPictureService: PropertyPropertyPictureService,
  ) {}

  @authenticate({
    strategy: 'auth',
    options: [
      SecurityConfiguration.menus.menuPropertyId,
      SecurityConfiguration.actions.listAction,
    ],
  })
  @get('/properties/{id}/property-pictures', {
    responses: {
      '200': {
        description: 'Array of Property has many PropertyPicture',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(PropertyPicture)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<PropertyPicture>,
  ): Promise<PropertyPicture[]> {
    return this.propertyRepository.propertyPictures(id).find(filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [
      SecurityConfiguration.menus.menuPropertyId,
      SecurityConfiguration.actions.uploadAction,
    ],
  })
  @post('/property/{id}/upload-property-picture', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: 'file to upload',
      },
    },
  })
  async uploadPictureFileTroughProperty(
    @param.path.number('id') id: number,
    @inject(RestBindings.Http.RESPONSE) response: Response,

    @requestBody.file() request: Request,
  ): Promise<object | false> {
    try {
      let res =
        await this.propertyPropertyPictureService.uploadPictureFileTroughProperty(
          request,
          response,
          id,
        );
      return res;
    } catch (error) {
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
  @del('/properties/{propertyId}/property-pictures/{pictureId}', {
    responses: {
      '200': {
        description: 'Property.PropertyPicture DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('propertyId') propertyId: number,
    @param.path.number('pictureId') pictureId: number,
    // @param.query.object('where', getWhereSchemaFor(PropertyPicture)) where?: Where<PropertyPicture>,
  ): Promise<Count> {
    try {
      return this.propertyPropertyPictureService.deletePictureTroughProperty(
        propertyId,
        pictureId,
      );
    } catch (error) {
      throw error;
    }
  }

  // @post('/properties/{id}/property-pictures', {
  //   responses: {
  //     '200': {
  //       description: 'Property model instance',
  //       content: {
  //         'application/json': {schema: getModelSchemaRef(PropertyPicture)},
  //       },
  //     },
  //   },
  // })
  // async create(
  //   @param.path.number('id') id: typeof Property.prototype.id,
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(PropertyPicture, {
  //           title: 'NewPropertyPictureInProperty',
  //           exclude: ['id'],
  //           optional: ['propertyId'],
  //         }),
  //       },
  //     },
  //   })
  //   propertyPicture: Omit<PropertyPicture, 'id'>,
  // ): Promise<PropertyPicture> {
  //   return this.propertyRepository.propertyPictures(id).create(propertyPicture);
  // }

  // @patch('/properties/{id}/property-pictures', {
  //   responses: {
  //     '200': {
  //       description: 'Property.PropertyPicture PATCH success count',
  //       content: {'application/json': {schema: CountSchema}},
  //     },
  //   },
  // })
  // async patch(
  //   @param.path.number('id') id: number,
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(PropertyPicture, {partial: true}),
  //       },
  //     },
  //   })
  //   propertyPicture: Partial<PropertyPicture>,
  //   @param.query.object('where', getWhereSchemaFor(PropertyPicture))
  //   where?: Where<PropertyPicture>,
  // ): Promise<Count> {
  //   return this.propertyRepository
  //     .propertyPictures(id)
  //     .patch(propertyPicture, where);
  // }
}
