import {Command, Option} from 'nestjs-command';
import {Injectable} from '@nestjs/common';
import {CreatorsService} from './creators.service';

@Injectable()
export class CreatorsCommand {
    constructor(private readonly creatorsService: CreatorsService) {}

    @Command({
        command: 'seed:creators',
        describe: 'seed creators',
    })
    async seed(
        @Option({
            name: 'The sub of the user to seed the creators for',
            type: 'string',
            required: true,
            default: false,
        })
        sub: string,
    ) {
        
        return this.creatorsService.seed();
    }
}