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

    static async createStrategyRequest(strategy, auth){
        try {

            const { images } = strategy
            delete strategy.images
            strategy.type = strategy.type == 'tactic' ? 1 : 0
            const strategyCreate = await strategyRepository.create({...strategy, username_creator: auth.username})
            if(!strategyCreate){
                return false
            }
            const requestCreate = await requestRepository.create({
                username: auth.username,
                tipo_solicitacao: 1,
                estado: 0
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
            const text = "SELECT tipo_solicitacao AS type, estado AS state,\
            data_solicitacao AS application_date, username AS author,\
            administrador AS administrator, voto_admin AS admin_vote,\
            texto_rejeicao AS rejection_text\
            FROM solicitacao WHERE nro_protocolo = $1";
            const values = [request_protocol_number];

            const db_request = await db_client.query(text, values);

            if(db_request.rowCount === 0){
                return null;
            }

            return db_request.rows[0];
        }
        catch(err){
            console.log(err);
        }
    }



    static async updateRequestState(request_protocol_number){
        try{
            const text = "UPDATE solicitacao SET estado = 3 WHERE nro_protocolo = $1";
            const values = [request_protocol_number];

            const db_request = await db_client.query(text, values);
        }
        catch(err){
            console.log(err);
        }
    }



    static async getRequestsByUser(username){
        try{
            const text = "SELECT nro_protocolo AS protocol_number, data_solicitacao as date_required, tipo_solicitacao AS type, estado AS state,\
            texto_rejeicao AS rejection_text, estrategia_referente AS relating_strategy, nro_recorrencia AS recurrence_number,\
            nro_aceitar AS accept_count, nro_aceitar_com_sugestoes AS accept_with_suggestions_count, nro_rejeitar AS reject_count\
            FROM solicitacao LEFT JOIN votacao_conselho ON nro_protocolo = nro_protocolo_solicitacao\
            WHERE username = $1";
            const values = [username];

            const db_requests = await db_client.query(text, values);

            return db_requests.rows;
        }
        catch(err){
            console.log(err);
        }
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