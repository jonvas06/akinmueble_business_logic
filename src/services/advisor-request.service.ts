import {BindingScope, injectable} from '@loopback/context';
import {repository} from '@loopback/repository';
import {Request} from '../models';
import {RequestRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class AdvisorRequestService {
  constructor(
    @repository(RequestRepository)
    private requestRepository: RequestRepository,
  ) {}

  public async changeRequestSatus(
    advisorId: number,
    requestId: number,
    statusId: number,
  ): Promise<Request | null> {
    return await this.requestRepository.findById(requestId);
  }
}
