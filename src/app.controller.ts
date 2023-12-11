import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('get-proposals')
  async getAllProposals(@Body() { governorAddress }) {
    return this.appService.getAllProposals(governorAddress);
  }

  @Post('create-proposal')
  async createProposal(@Body() { from, description, governorAddress }) {
    const res = await this.appService.createProposal(
      from,
      description,
      governorAddress,
    );

    return res;
  }

  @Post('vote')
  async createVote(
    @Body()
    {
      from,
      governorAddress,
      voteOption,
      proposalId,
    }: {
      from: string;
      governorAddress: string;
      voteOption: 0 | 1 | 2;
      proposalId: bigint;
    },
  ) {
    const res = await this.appService.voteOnProposal(
      from,
      governorAddress,
      proposalId,
      voteOption,
    );

    return res;
  }
}
