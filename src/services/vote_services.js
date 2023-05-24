const dbClient = require('../dbconfig').db_client
const fs = require('fs').promises
const requestRepository = require('../infra/repositories/requests-repository')

module.exports = class voteServices {
  static async insertAdminVoteOnRequest (nProtocol, vote) {
    try {
      const update = await requestRepository.update(nProtocol, vote)
      return !!update[0]
    } catch (err) {
      console.log(err)
    }
  }

  static async createCouncilVoting (nProtocol, recurrenceNumber, recordPath) {
    await voteServices.createCouncilVotingRecord(nProtocol)

    try {
      // eslint-disable-next-line no-multi-str
      const text = 'INSERT INTO votacao_conselho\
            (nro_protocolo_solicitacao, nro_recorrencia, caminho_ata)\
            VALUES ($1, $2, $3) RETURNING nro_protocolo_solicitacao AS protocol_number,\
            nro_recorrencia AS recurrence_number, nro_aceitar AS accept_count,\
            nro_aceitar_com_sugestoes AS accept_with_suggestions_count,\
            nro_rejeitar AS reject_count'
      const values = [nProtocol, recurrenceNumber, recordPath]

      const createdCouncilVoting = await dbClient.query(text, values)

      return createdCouncilVoting.rows[0]
    } catch (err) {
      console.log(err)
    }
  }

  static async createCouncilVotingRecord (nProtocol) {
    const data = JSON.stringify({ votes: [] })

    await fs.writeFile(process.env.PATH_REQUEST + `${nProtocol}/record.json`, data)
  }

  static async insertVoteIntoCouncilRecord (nProtocol, voteData) {
    // const recurrence_number = await voteServices.getCurrentCouncilVotingRecurrence(nProtocol)

    let data = await fs.readFile(process.env.PATH_REQUEST + `${nProtocol}/record.json`)

    data = JSON.parse(data)
    data.votes.push(voteData)
    data = JSON.stringify(data)

    await fs.writeFile(process.env.PATH_REQUEST + `${nProtocol}/record.json`, data)
  }

  static async getCurrentCouncilVotingRecurrence (nProtocol) {
    try {
      // eslint-disable-next-line no-multi-str
      const text = 'SELECT * FROM votacao_conselho\
            WHERE nro_protocolo_solicitacao = $1'
      const values = [nProtocol]

      const dbRecurrenceNumber = await dbClient.query(text, values)

      return dbRecurrenceNumber.rowCount
    } catch (err) {
      console.log(err)
    }
  }

  static async getCouncilVotingScore (nProtocol) {
    try {
      // eslint-disable-next-line no-multi-str
      const text = 'SELECT nro_aceitar AS accept_count, nro_aceitar_com_sugestoes AS accept_with_suggestions_count,\
            nro_rejeitar AS reject_count\
            FROM votacao_conselho\
            WHERE nro_protocolo_solicitacao = $1 AND nro_recorrencia = $2'
      const values = [nProtocol, await voteServices.getCurrentCouncilVotingRecurrence(nProtocol)]

      const dbVotingScore = await dbClient.query(text, values)

      return dbVotingScore.rows[0]
    } catch (err) {
      console.log(err)
    }
  }

  static async insertCouncilMemberVote (nProtocol, councilMember, vote) {
    const recurrenceNumber = await voteServices.getCurrentCouncilVotingRecurrence(nProtocol)

    try {
      // eslint-disable-next-line no-multi-str
      const text1 = 'INSERT INTO voto (nro_protocolo_solicitacao, nro_recorrencia,\
            membro_conselho, voto_opcao)\
            VALUES($1, $2, $3, $4)'

      const values1 = [nProtocol, recurrenceNumber, councilMember, vote]

      await dbClient.query(text1, values1)

      const text2 =
            // eslint-disable-next-line no-multi-str
            'UPDATE votacao_conselho\
            SET nro_aceitar = nro_aceitar + $1,\
                nro_aceitar_com_sugestoes = nro_aceitar_com_sugestoes + $2,\
                nro_rejeitar = nro_rejeitar + $3\
            RETURNING nro_protocolo_solicitacao AS protocol_number, nro_recorrencia AS recurrence_number,\
            nro_aceitar AS accept_count, nro_aceitar_com_sugestoes AS accept_with_suggestions_count,\
            nro_rejeitar AS reject_count'
      const values2 = [Number(vote === 0), Number(vote === 1), Number(vote === 2)]

      const dbCouncilVoting = await dbClient.query(text2, values2)

      return dbCouncilVoting.rows[0]
    } catch (err) {
      console.log(err)
    }
  }

  static async hasCouncilMemberVoted (nProtocol, councilMember) {
    const recurrenceNumber = await voteServices.getCurrentCouncilVotingRecurrence(nProtocol)

    try {
      // eslint-disable-next-line no-multi-str
      const text = 'SELECT * FROM voto WHERE nro_protocolo_solicitacao = $1\
             AND nro_recorrencia = $2 AND membro_conselho = $3'
      const values = [nProtocol, recurrenceNumber, councilMember]

      const dbVote = await dbClient.query(text, values)

      return dbVote.rowCount > 0
    } catch (err) {
      console.log(err)
    }
  }
}
