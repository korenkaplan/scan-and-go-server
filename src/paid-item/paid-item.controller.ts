import { Controller} from '@nestjs/common';
import { PaidItemService } from './paid-item.service';

@Controller('paid-item')
export class PaidItemController {
    constructor(private readonly paidItemService: PaidItemService) { }


}
