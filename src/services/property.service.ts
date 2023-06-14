import {BindingScope, injectable} from '@loopback/context';
import {repository} from '@loopback/repository';
import {Property} from '../models';
import {PropertyRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class PropertyService {
  constructor(
    @repository(PropertyRepository)
    protected propertyRepository: PropertyRepository,
  ) {}

  public setPropertyDefaulValues(property: Property) {
    property.propertyStatusId = 4;
  }

  async findPropertiesByStatus(status?: number): Promise<any> {
    const report = await this.propertyRepository.find({
      include: [{relation: 'propertyStatus'}],
      where: {propertyStatusId: status},
    });

    return report;
  }
}
