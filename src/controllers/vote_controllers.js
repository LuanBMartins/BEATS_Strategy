const voteServices = require('../services/vote_services')
const requestServices = require('../services/request_services')
const userServices = require('../services/user_services')
const { insertCouncilMemberVote, insertVoteIntoCouncilRecord } = require('../services/vote_services')

const requestStateDescriptions = [
  [ // Edit Request (Not implemented in this MVP)
    'Waiting for Administrator Approval',
    'Rejected by Administrator',
    'Approved by Administrator',
    'Excluded by User'
  ],
  [ // Add Request
    'Waiting for Administrator Approval',
    'Rejected by Administrator',
    'Approved by Administrator. Council voting ongoing',
    'Approved by Council. Published',
    'Review suggested by Council',
    'Rejected by Council',
    'Excluded by User'
  ]
]

module.exports = class voteControllers {
  static async voteAssert (req, res, next) {
    const protocolNumber = req.params.protocol
    const strategyRequest = await requestServices.getRequestByProtocolNumber(protocolNumber)

    if (!strategyRequest) {
      return res.status(400).send({
        success: false,
        message: `request (protocol number '${protocolNumber}') does not exist`
      })
    }

    req.request = strategyRequest
    next()
  }

  static async adminVote (req, res, next) {
    if (!req.params.protocol) {
      return res.status(500)
    }

    const user = req.user_info
    const protocolNumber = req.params.protocol
    const request = req.request

    if (user.user_type !== 2) {
      return res.status(401)
    }

    if (request.state !== 0) {
      return res.status(400).send({
        essage: 'request is no longer in administration vote state',
        protocol_number: protocolNumber,
        type: ['Edition', 'Addition'][request.type],
        state: request.state,
        state_description: requestStateDescriptions[request.type][request.state]
      })
    }

    switch (String(req.body.vote).toUpperCase()) {
      case 'ACCEPT':
        request.state = 4
        break

      case 'REJECT':
        request.state = 1
        request.reject_text = req.body.reject_text || null
        break

      default:
        return res.status(400).send({ error_message: 'wrong vote option. Vote options: (Accept, Reject)' })
    }

    const requestVote = await voteServices.insertAdminVoteOnRequest(protocolNumber, {
      estado: request.state,
      administrador: user.username,
      voto_admin: true,
      texto_rejeicao: request.reject_text || null
    })

    if (requestVote && request.state === 4) {
      await requestServices.updateRequestState(request.architecture_strategy.id, {
        accepted: 1
      })
    }

    return res.status(202).send({
      success: true,
      message: 'Request update!'
    })
  }

  static async councilVoteAssert (req, res, next) {
    const request = req.request
    const nProtocol = req.params.protocol
    const vote = req.body.vote

    if (vote === undefined) {
      return res.status(400).send({ error_message: 'http request must contain vote field body' })
    }

    if (request.type !== 1) {
      return res.status(403).send({ error_message: 'Council Members are only allowed to vote for Add Requests' })
    }

    if (request.state !== 2) {
      return res.status(400).send({
        error_message: 'Add Request are not in Council Voting state',
        protocol_number: nProtocol,
        type: ['Edition', 'Addition'][request.type],
        state: request.state,
        state_description: requestStateDescriptions[request.type][request.state]
      })
    }

    if (await voteServices.hasCouncilMemberVoted(nProtocol, req.user_info.username)) {
      return res.status(400).send({ error_message: 'already voted' })
    }

    const suggestionsFields = ['name', 'aliases', 'type', 'attributes', 'problem', 'context',
      'forces', 'solution', 'rationale', 'consequences', 'examples', 'related strategies',
      'complementary references']

    let voteIndex = null
    const voteData = {}

    switch (String(vote).toUpperCase()) {
      case 'ACCEPT':
        voteIndex = 0
        break

      case 'ACCEPT WITH SUGGESTIONS':
        voteIndex = 1

        suggestionsFields.forEach((field) => {
          if (req.body[field] !== undefined) {
            voteData[field] = req.body[field]
          }
        })

        if (Object.keys(voteData).length === 0) {
          return res.status(400).send({ error_message: 'vote: accept with suggestions should contain at least 1 field update suggestion' })
        }
        break

      case 'REJECT':
        voteIndex = 2
        voteData.rejection_text = req.body.rejection_text
        break

      default:
        return res.status(400).send({ error_message: 'wrong vote option. Vote options: (Accept, Accept with Suggestions, Reject)' })
    }

    req.vote = voteIndex
    voteData.vote = String(vote).toUpperCase()
    voteData.member = req.user_info.username
    req.vote_data = voteData

    next()
  }

  static async councilVote (req, res, next) {
    const nProtocol = req.params.protocol
    const user = req.user_info

    const sizeCouncil = Number(await userServices.getNumberCouncilMembers())

    await insertCouncilMemberVote(nProtocol, user.username, req.vote)
    await insertVoteIntoCouncilRecord(nProtocol, req.vote_data)

    const score = await voteServices.getCouncilVotingScore(nProtocol)
    const arr = Object.values(score)

    if ((arr[0] + arr[1] + arr[2]) === sizeCouncil) {
      const voteWinner = arr.indexOf(Math.max(...arr))

      return res.status(200).send({
        final_result: score,
        winner: ['Accept', 'Accept with Suggestions', 'Reject'][voteWinner],
        new_state: requestStateDescriptions[1][3 + voteWinner]
      })
    }

    res.status(200).send({ score })
  }
}
