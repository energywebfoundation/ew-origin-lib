import { GeneralFunctions, SpecialTx, SearchLog, getClientVersion } from './GeneralFunctions';
import * as fs from 'fs';
import * as path from 'path';
import Web3 = require('web3');
import { Tx, BlockType } from 'web3/eth/types';
import { TransactionReceipt, Logs } from 'web3/types';
import { JsonRPCResponse } from 'web3/providers';
import OriginContractLookupJSON from '../../build/contracts/OriginContractLookup.json';

export class OriginContractLookup extends GeneralFunctions {
    web3: Web3;
    buildFile = OriginContractLookupJSON;

    constructor(web3: Web3, address?: string) {
        super(
            address
                ? new web3.eth.Contract(OriginContractLookupJSON.abi, address)
                : new web3.eth.Contract(
                      OriginContractLookupJSON.abi,
                      (OriginContractLookupJSON as any).networks.length > 0
                          ? OriginContractLookupJSON.networks[0]
                          : null
                  )
        );
        this.web3 = web3;
    }

    async getAllLogChangeOwnerEvents(eventFilter?: SearchLog) {
        let filterParams;
        if (eventFilter) {
            filterParams = {
                fromBlock: eventFilter.fromBlock ? eventFilter.fromBlock : 0,
                toBlock: eventFilter.toBlock ? eventFilter.toBlock : 'latest'
            };
            if (eventFilter.topics) {
                filterParams.topics = eventFilter.topics;
            }
        } else {
            filterParams = {
                fromBlock: 0,
                toBlock: 'latest'
            };
        }

        return await this.web3Contract.getPastEvents('LogChangeOwner', filterParams);
    }

    async getAllEvents(eventFilter?: SearchLog) {
        let filterParams;
        if (eventFilter) {
            filterParams = {
                fromBlock: eventFilter.fromBlock ? eventFilter.fromBlock : 0,
                toBlock: eventFilter.toBlock ? eventFilter.toBlock : 'latest',
                topics: eventFilter.topics ? eventFilter.topics : [null]
            };
        } else {
            filterParams = {
                fromBlock: 0,
                toBlock: 'latest',
                topics: [null]
            };
        }

        return await this.web3Contract.getPastEvents('allEvents', filterParams);
    }

    async init(
        _assetRegistry: string,
        _originLogicRegistry: string,
        _originDB: string,
        txParams?: SpecialTx
    ) {
        const method = this.web3Contract.methods.init(_assetRegistry, _originLogicRegistry, _originDB);
        const transactionParams = await this.buildTransactionParams(method, txParams);
            
        return await this.send(method, transactionParams);
    }

    async update(_originRegistry: string, txParams?: SpecialTx) {
        const method = this.web3Contract.methods.update(_originRegistry);
        const transactionParams = await this.buildTransactionParams(method, txParams);
            
        return await this.send(method, transactionParams);
    }

    async setMaxMatcherPerCertificate(_new: number, txParams?: SpecialTx) {
        const method = this.web3Contract.methods.setMaxMatcherPerCertificate(_new);
        const transactionParams = await this.buildTransactionParams(method, txParams);
            
        return await this.send(method, transactionParams);
    }

    async assetContractLookup(txParams?: SpecialTx) {
        return await this.web3Contract.methods.assetContractLookup().call(txParams);
    }

    async originLogicRegistry(txParams?: SpecialTx) {
        return await this.web3Contract.methods.originLogicRegistry().call(txParams);
    }

    async maxMatcherPerCertificate(txParams?: SpecialTx) {
        return await this.web3Contract.methods.maxMatcherPerCertificate().call(txParams);
    }

    async owner(txParams?: SpecialTx) {
        return await this.web3Contract.methods.owner().call(txParams);
    }

    async changeOwner(_newOwner: string, txParams?: SpecialTx) {
        const method = this.web3Contract.methods.changeOwner(_newOwner);
        const transactionParams = await this.buildTransactionParams(method, txParams);
            
        return await this.send(method, transactionParams);
    }
}
