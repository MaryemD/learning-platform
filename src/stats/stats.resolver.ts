import { Resolver, Query, Args, Int, ObjectType, Field, Float } from '@nestjs/graphql';
import { StatsService } from './stats.service';

@ObjectType()
class StatsDto {
@Field(() => Int)
connected: number;

@Field(() => Int)
totalQuestions: number;

@Field(() => Float)
participationRate: number;
}

@Resolver()
export class StatsResolver {
constructor(private readonly statsService: StatsService) {}

@Query(() => StatsDto)
async getSessionStats(@Args('sessionId', { type: () => Int }) sessionId: number) {
return this.statsService.getStats(sessionId);
}
}