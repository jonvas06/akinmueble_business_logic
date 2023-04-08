import {BindingScope, injectable} from '@loopback/context';
import {Property} from '../models';

@injectable({scope: BindingScope.TRANSIENT})
export class PropertyService {
  constructor() {}

  public setPropertyDefaulValues(property: Property) {
    property.propertyStatusId = 4;
  }
}
