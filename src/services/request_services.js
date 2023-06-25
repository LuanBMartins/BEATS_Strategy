/* eslint-disable */
const requestRepository = require('../infra/repositories/requests-repository');
const strategyRepository = require('../infra/repositories/architecture-strategy-repository')
const imagesRepository = require('../infra/repositories/strategy-images-repository');
const aliasesRepository = require('../infra/repositories/aliases-repository');
const { getImageFile } = require('./utils/getFile');

module.exports = class request_services {

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

            return { requestCreate, strategyCreate }
        } catch (error) {
            console.log("🚀 ~ file: request_services.js:27 ~ request_services ~ createStrategyRequest ~ error:", error)
            return false
        }
    }

    static async getRequestsById(id){
        const request = await requestRepository.getById(id)
        const aliases = await aliasesRepository.findByStrategy(id)
        const imagesByStrategy = await imagesRepository.findById(id)
        const images = await Promise.all(imagesByStrategy.map(async (value) => {
            return {
                file: await getImageFile(value.origin)
            }
        }))
        request.architecture_strategy.aliases = aliases || []
        request.architecture_strategy.images = images || []
        return request
    }

    static async getRequestByProtocolNumber(request_protocol_number){
        const requestStragey = await requestRepository.getRequestsByProtocol(request_protocol_number)
        return requestStragey.get({plain: true})
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