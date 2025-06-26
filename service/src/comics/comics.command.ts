import {Command, Option} from 'nestjs-command';
import {Injectable} from '@nestjs/common';
import {ComicsService} from './comics.service';

@Injectable()
export class ComicsCommand { 
    constructor(private readonly comicsService: ComicsService) {}

    @Command({
    command: 'seed:comics',
    describe: 'seed comics',
    })
    async seed(
        @Option({
            name: 'The sub of the user to seed the comics for',
            type: 'string',
            required: true,
            default: false,
        })
        sub: string,
    ) {
        console.log('Seeding comics...');
        return this.comicsService.seed(sub);
    }
}