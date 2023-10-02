import { Controller,Get } from '@nestjs/common';
import { SiteService } from './site.service';
import { Public } from 'src/auth/decorators/public-guard.decorator';
import { UserJoiningsStats } from './dto/site-dtos';

@Controller('site')
export class SiteController {
    constructor(private readonly siteService: SiteService){}

    @Public()
    @Get('/dashboard/usersStats')
    async getUsersStats(): Promise<UserJoiningsStats> {
    return this.siteService.usersJoiningsStats();
    }
    
}
