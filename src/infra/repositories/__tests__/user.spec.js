const db = require('../../database/models')
const UserRepository = require('../user-repository')

jest.mock('../../database/models')

describe('UserRepository', () => {
  describe('findWithEmail', () => {
    it('should find a user with email', async () => {
      const email = 'test@example.com'
      const user = { id: 1, name: 'Test User', email }

      db.usuario.findOne.mockResolvedValue(user)

      const result = await UserRepository.findWithEmail(email)

      const expectedWhere = { email }

      expect(db.usuario.findOne).toHaveBeenCalledWith({
        where: expectedWhere,
        raw: true
      })
      expect(result).toEqual(user)
    })
  })

  describe('updateProfileWithEmail', () => {
    it('should update a user profile with email', async () => {
      const email = 'test@example.com'
      const profile = { name: 'Updated User' }

      db.usuario.update.mockResolvedValue(1)

      const result = await UserRepository.updateProfileWithEmail(email, profile)

      const expectedWhere = { email }

      expect(db.usuario.update).toHaveBeenCalledWith(profile, {
        where: expectedWhere
      })
      expect(result).toEqual(1)
    })
  })
})
