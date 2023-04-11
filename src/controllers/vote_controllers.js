/* eslint-disable */
const vote_services = require('../services/vote_services');
const request_services = require('../services/request_services');
const user_services = require('../services/user_services');
const { insertCouncilMemberVote, insertVoteIntoCouncilRecord, hasCouncilMemberVoted } = require('../services/vote_services');

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

module.exports = class vote_controllers{
    static async voteAssert(req, res, next){
        const protocolNumber = req.params.protocol;
        const strategyRequest = await request_services.getRequestByProtocolNumber(protocolNumber);
        
        if(!strategyRequest){
            return res.status(400).send({
                success: false,
                message: `request (protocol number '${protocolNumber}') does not exist`
            })
        }

        req.request = strategyRequest
        next();
    }



    static async adminVote(req, res, next){
        console.log("🚀 ~ file: vote_controllers.js:44 ~ vote_controllers ~ adminVote ~ req:", req.body)
        if(!req.params.protocol){ 
            return res.status(500)
        }
        
        const user = req.user_info;
        const protocolNumber = req.params.protocol;
        const request = req.request;
   
        if(user.user_type != 2){
            return res.status(401)
        }
        
        if(request.state != 0){
            return res.status(400).send({
                essage: 'request is no longer in administration vote state',
                protocol_number: protocolNumber,
                type: ['Edition', 'Addition'][request.type],
                state: request.state,
                state_description: request_state_descriptions[request.type][request.state]
            });
        }
        
        switch(String(req.body.vote).toUpperCase()){
            case "ACCEPT":
                request.state = 4
                break;
            
            case "REJECT":
                request.state = 1
                request.reject_text = req.body.reject_text || null
                break;

            default:
                return res.status(400).send({error_message: 'wrong vote option. Vote options: (Accept, Reject)'})
        }

        const requestVote = await vote_services.insertAdminVoteOnRequest(protocolNumber, {
            estado: request.state,
            administrador: user.username,
            voto_admin: true,
            texto_rejeicao: request.reject_text || null
        })
    
        if(requestVote && request.state === 4){
            await request_services.updateRequestState(request.architecture_strategy.id, {
                accepted: 1
            })
        }

        return res.status(202).send({
            success: true,
            message: "Request update!"
        });
    }



    static async councilVoteAssert(req, res, next){
        const request = req.request;
        const n_protocol = req.params.protocol;
        const vote = req.body.vote;

        if(vote === undefined){
            return res.status(400).send({error_message: 'http request must contain vote field body'});
        }
        
        if(request.type != 1){
            return res.status(403).send({error_message: 'Council Members are only allowed to vote for Add Requests'});
        }

        if(request.state != 2){
            return res.status(400).send({
                error_message: 'Add Request are not in Council Voting state',
                protocol_number: n_protocol,
                type: ['Edition', 'Addition'][request.type],
                state: request.state,
                state_description: request_state_descriptions[request.type][request.state]
            });
        }

        if(await vote_services.hasCouncilMemberVoted(n_protocol, req.user_info.username)){
            return res.status(400).send({error_message: 'already voted'});
        }

        const suggestions_fields = ['name', 'aliases', 'type', 'attributes', 'problem', 'context',
            'forces', 'solution', 'rationale', 'consequences', 'examples', 'related strategies',
            'complementary references'];
        
        let vote_index = null;
        const vote_data = {};

        switch(String(vote).toUpperCase()){
            case 'ACCEPT':
                vote_index = 0;
                break;
            
            case 'ACCEPT WITH SUGGESTIONS':
                vote_index = 1;
                
                suggestions_fields.forEach((field) => {
                    if(req.body[field] != undefined){
                        vote_data[field] = req.body[field];
                    }
                });

                if(Object.keys(vote_data).length === 0){
                    return res.status(400).send({error_message: 'vote: accept with suggestions should contain at least 1 field update suggestion'});
                }
                break;

            case 'REJECT':
                vote_index = 2;
                vote_data.rejection_text = req.body.rejection_text;
                break;

            default:
                return res.status(400).send({error_message: 'wrong vote option. Vote options: (Accept, Accept with Suggestions, Reject)'});
        }

        req.vote = vote_index;
        vote_data.vote = String(vote).toUpperCase();
        vote_data.member = req.user_info.username;
        req.vote_data = vote_data;
        
        next();
    }



    static async councilVote(req, res, next){
        const n_protocol = req.params.protocol;
        const user = req.user_info;

        const size_council = Number(await user_services.getNumberCouncilMembers());
        
        await insertCouncilMemberVote(n_protocol, user.username, req.vote);
        await insertVoteIntoCouncilRecord(n_protocol, req.vote_data);

        const score = await vote_services.getCouncilVotingScore(n_protocol);
        const arr = Object.values(score); 

        if((arr[0] + arr[1] + arr[2]) === size_council){
            const vote_winner = arr.indexOf(Math.max(...arr));

            return res.status(200).send({
                final_result: score, 
                winner: ['Accept', 'Accept with Suggestions', 'Reject'][vote_winner],
                new_state: request_state_descriptions[1][3 + vote_winner]
            });
        }

        res.status(200).send({score});
    }
}