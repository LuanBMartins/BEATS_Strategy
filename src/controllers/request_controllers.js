/* eslint-disable */
const request_services = require('../services/request_services');

const request_state_descriptions = [
    [   //Edit Request (Not implemented in this MVP)
        "Waiting for Administrator Approval",
        "Rejected by Administrator",
        "Approved by Administrator",
        "Excluded by User"
    ],
    [   //Add Request
        "Waiting for Administrator Approval",
        "Rejected by Administrator",
        "Approved by Administrator. Council voting ongoing",
        "Approved by Council. Published",
        "Review suggested by Council",
        "Rejected by Council",
        "Excluded by User"
    ]
];



module.exports = class request_controllers {
    static async postAddRequestInsertDB(req, res, next) {
        req.request_inserted = await request_services.insertAddRequest(req.user_info.username);
        next();
    }



    static async postAddRequestSaveJSON(req, res, next) {
        const { body, user_info } = req
        try {
            const createStrategyRequest = await request_services.createStrategyRequest(body, user_info)
            if (!createStrategyRequest) {
                return res.status(500).send({
                    success: false,
                    message: "Erro ao criar a solicitação!"
                })
            }

            return res.status(201).send({
                success: true,
                message: "success: strategy add request done"
            })
        } catch (error) {
            return res.status(500).send({
                success: true,
                message: "Server Error!"
            })
        }
    }



    static async followRequestsStatus(req, res, next) {
        const username = req.user_info.username;
        let requests = await request_services.getRequestsByUser(username);

        res.status(200).send({ requests });
    }

    static async followRequestsWaitingApproval(req, res, next) {
        const username = req.user_info.username;
        let requests = await request_services.getRequetsWaitingStatus(username);

        res.status(200).send({ requests });
    }

    static async readRequestById(req, res) {
        try {
            const { id } = req.params
            
            if (!id || !parseInt(id)) {
                return res.status(400).send('Paranetro inválido!');
            }
            const request = await request_services.getRequestsById(id)
            if (!request) {
                return res.status(200).send({ success: false, message: 'Request not found!' });
            }
            return res.status(200).send({ request });
        } catch (error) {
            return res.status(400).send('Paranetro inválido!');
        }

    }

    static async deleteRequest(req, res) {
        const { protocol } = req.params
        try {
            if (!protocol) {
                return res.status(500).send({
                    success: false,
                    message: 'Server Error'
                });

            }

            const request = await request_services.deleteRequest(protocol)
            if (!request.delete) {
                console.log("🚀 ~ file: request_controllers.js:84 ~ request_controllers ~ deleteRequest ~ request.delete", request.delete)
                return res.status(404).send({
                    success: false,
                    message: 'Request not found!'
                });
            }

            return res.status(200).send({
                success: true,
                message: 'request has been removed!'
            });
        } catch (error) {
            console.log("🚀 ~ file: request_controllers.js:91 ~ request_controllers ~ deleteRequest ~ error", error)
            return res.status(500).send({
                success: true,
                message: 'Server Error!'
            });
        }
    }
}