/* eslint-disable */
const requestRepository = require('../infra/repositories/requests-repository');
const strategyRepository = require('../infra/repositories/architecture-strategy-repository')

const db_client = require('../dbconfig').db_client;
const fs = require('fs').promises;

module.exports = class request_services{
    static async insertAddRequest(author){
        try{
            const text = "INSERT INTO solicitacao (username, tipo_solicitacao)\
            VALUES ($1, 1) RETURNING nro_protocolo AS protocol_number,\
            estado AS state, data_solicitacao AS application_date, username AS author";
            const values = [author];

            const rowInserted = await db_client.query(text, values);

            return rowInserted.rows[0];
        }
        catch(err){
            console.log(err);
        }
    }

    static async createStrategyRequest(strategy, files, auth){
        try {

            delete strategy.images
            strategy.type = strategy.type == 'tactic' ? 1 : 0
            strategy.images = files.map(file => {
                return {
                    origin: file.filename
                }
            })

            if(strategy.aliases){
                strategy.aliases = JSON.parse(strategy.aliases).map(name => ({ name }))
            }
        
            const {dataValues: strategyCreate} = await strategyRepository.create({...strategy, username_creator: auth.username})
            if(!strategyCreate){
                return false
            }
            const requestCreate = await requestRepository.create({
                username: auth.username,
                tipo_solicitacao: 1,
                estado: 0,
                strategy_id: strategyCreate.id
            })
            if(!requestCreate){
                return false
            }

            return true
        } catch (error) {
            console.log("🚀 ~ file: request_services.js:27 ~ request_services ~ createStrategyRequest ~ error:", error)
            return false
        }
    }

    static async getRequestsById(id){
        return requestRepository.getById(id)
    }

    static async insertAddRequestForm(n_protocol, proposed_strategy){
        try{
            const data = JSON.stringify(proposed_strategy);
            await fs.mkdir(process.env.PATH_REQUEST + `${n_protocol}`, { recursive: true });
            await fs.writeFile(process.env.PATH_REQUEST + `${n_protocol}/form.json`, data);
        }   
        catch(err){
            console.log("🚀 ~ file: request_services.js:29 ~ request_services ~ insertAddRequestForm ~ err", err)   
        }
    }



    static async getRequestByProtocolNumber(request_protocol_number){
        try{
            const requestStragey = await requestRepository.getRequestsByProtocol(request_protocol_number)
            return requestStragey.get({plain: true})
        }
        catch(err){
            console.log(err);
        }
    }



    static async updateRequestState(id, strategy){
        const requestUpdate = await strategyRepository.update(id, strategy)
        return !!requestUpdate[0]
    }

    static async getRequestByProtocol(protocol){
        const requests = await requestRepository.getRequestsByProtocol(protocol)
        return requests;
    }

    static async getRequestsByUser(username){
        const requests = await requestRepository.getRequestsByUsername(username)
        return requests;
    }

    static async getRequetsWaitingStatus(){
        const requests = await requestRepository.getRequetsWaitingStatus()
        return requests
    }

    static async deleteRequest(protocol){
        const { validate: validateUuid } = require('uuid')
        if(!validateUuid(protocol)){
            return false
        }
        
        const deleteResult = await requestRepository.deleteRequest(protocol)
        return {
            delete: !!deleteResult
        }
    }
}