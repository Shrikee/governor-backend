import { Injectable } from '@nestjs/common';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import proposalGovernor from '../src/abi/ProposalGovernor.json';
import { PROPOSAL_CONSTANTS } from './constants';
import { config } from 'dotenv';

config();

const { RPC_URL } = process.env;

@Injectable()
export class AppService {
  async createProposal(
    from: string,
    description: string,
    governorAddress: string,
  ) {
    let gas: any;

    const proposalGovernorInstance =
      this.createGovernorInstance(governorAddress);

    const { ENCODED_FUNCTION_CALL, VALUE, VOTE_TOKEN } = PROPOSAL_CONSTANTS;

    try {
      gas = await proposalGovernorInstance.methods
        .propose([VOTE_TOKEN], [VALUE], [ENCODED_FUNCTION_CALL], description)
        .estimateGas();
    } catch (error) {
      throw new Error(`Proposal gas estimation failed: ${error}`);
    }

    return proposalGovernorInstance.methods
      .propose([VOTE_TOKEN], [VALUE], [ENCODED_FUNCTION_CALL], description)
      .send({ gas, from });
  }

  async voteOnProposal(
    from: string,
    governorAddress: string,
    proposalId: any,
    voteOption: 0 | 1 | 2, // if voting type set to `support=bravo` refers to the vote options 0 = Against, 1 = For, 2 = Abstain
  ) {
    let gas;

    const proposalGovernorInstance =
      this.createGovernorInstance(governorAddress);

    try {
      gas = await proposalGovernorInstance.methods
        .castVote(proposalId, voteOption)
        .estimateGas();
    } catch (error) {
      throw new Error(`Proposal vote estimation failed: ${error}`);
    }

    return proposalGovernorInstance.methods
      .castVote(proposalId, voteOption)
      .send({ from, gas });
  }

  async getAllProposals(governorAddress: string) {
    const proposalGovernorInstance =
      this.createGovernorInstance(governorAddress);

    const proposalCreationEvents = await proposalGovernorInstance.getPastEvents(
      'ProposalCreated',
      { fromBlock: 0, toBlock: 'latest' },
    );

    return proposalCreationEvents;
  }

  private createGovernorInstance(governorAddress: string): any {
    const web3 = new Web3(RPC_URL);

    return new web3.eth.Contract(
      proposalGovernor.abi as AbiItem[],
      governorAddress,
    );
  }
}
