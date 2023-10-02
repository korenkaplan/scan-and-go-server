import { Controller,Get } from '@nestjs/common';
import { SiteService } from './site.service';
import { Public } from 'src/auth/decorators/public-guard.decorator';
import { GraphStats, ITopSellingItem, TransactionGraphStats } from './dto/site-dtos';

@Controller('site')
export class SiteController {
    constructor(private readonly siteService: SiteService){}

    @Public()
    @Get('/dashboard/usersStats')
    async getUsersStats(): Promise<GraphStats> {
    return this.siteService.usersJoiningsStats();
    }
    @Public()
    @Get('/dashboard/transactionsStats')
    async getTransactionsStats(): Promise<TransactionGraphStats> {
    return await this.siteService.transactionsStats();
    }
    @Public()
    @Get('/dashboard/topSellingItems')
    async getTopSellingITems():Promise<ITopSellingItem[]> {
    return await this.siteService.MostSellingItemsStats();
    }
}
