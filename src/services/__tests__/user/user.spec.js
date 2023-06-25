const ProfileServices = require('./../../user_services')
const UserRepository = require('../../../infra/repositories/user-repository')
const dbClient = require('../../../dbconfig').db_client
const bcrypt = require('bcrypt')

jest.mock('../../../infra/repositories/user-repository')
jest.mock('../../../dbconfig')
jest.mock('bcrypt')

describe('ProfileServices', () => {
  describe('readUser', () => {
    it('should read a user by email', async () => {
      const email = 'test@example.com'
      const user = { id: 1, email: 'test@example.com', name: 'Test User' }

      UserRepository.findWithEmail.mockResolvedValue(user)

      const result = await ProfileServices.readUser(email)

      expect(UserRepository.findWithEmail).toHaveBeenCalledWith(email)
      expect(result).toEqual(user)
    })

    it('should return false if email is missing', async () => {
      const email = null

      const result = await ProfileServices.readUser(email)

      expect(UserRepository.findWithEmail).not.toHaveBeenCalled()
      expect(result).toBe(false)
    })
  })

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const email = 'test@example.com'
      const payload = { name: 'New Name', senha: 'newpassword' }

      UserRepository.updateProfileWithEmail.mockResolvedValue(true)
      bcrypt.hash.mockResolvedValue('hashedpassword')

      const result = await ProfileServices.updateProfile(email, payload)

      expect(UserRepository.updateProfileWithEmail).toHaveBeenCalledWith(email, payload)
      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 10)
      expect(result).toEqual(true)
    })

    it('should not update password if senha is missing', async () => {
      const email = 'test@example.com'
      const payload = { name: 'New Name' }
      const updatedUser = { id: 1, email: 'test@example.com', name: 'New Name' }

      UserRepository.updateProfileWithEmail.mockResolvedValue(updatedUser)

      const result = await ProfileServices.updateProfile(email, payload)

      expect(UserRepository.updateProfileWithEmail).toHaveBeenCalledWith(email, payload)
      expect(bcrypt.hash).not.toHaveBeenCalled()
      expect(result).toEqual(updatedUser)
    })

    it('should return false if email is missing', async () => {
      const email = null
      const payload = { name: 'New Name' }

      const result = await ProfileServices.updateProfile(email, payload)

      expect(UserRepository.updateProfileWithEmail).not.toHaveBeenCalled()
      expect(bcrypt.hash).not.toHaveBeenCalled()
      expect(result).toBe(false)
    })
  })

  describe('getUser', () => {
    it('should get a user by identifier', async () => {
      const identifier = 'testuser'
      const user = { id: 1, username: 'testuser', email: 'test@example.com' }

      dbClient.query.mockResolvedValue({ rowCount: 1, rows: [user] })

      const result = await ProfileServices.getUser(identifier)

      expect(dbClient.query).toHaveBeenCalled()
      expect(result).toEqual(user)
    })

    it('should return null if user is not found', async () => {
      const identifier = 'unknownuser'

      dbClient.query.mockResolvedValue({ rowCount: 0 })

      const result = await ProfileServices.getUser(identifier)

      expect(dbClient.query).toHaveBeenCalled()
      expect(result).toBeNull()
    })

    it('should log error and return null for other insertion errors', async () => {
      const email = 'test@example.com'
      dbClient.query.mockRejectedValue(new Error('Some error'))
      const result = await ProfileServices.getUser(email)

      expect(dbClient.query).toHaveBeenCalled()
      expect(result).toEqual(false)
    })
  })

  describe('insertUser', () => {
    it('should insert a new user', async () => {
      const username = 'testuser'
      const email = 'test@example.com'
      const password = 'password'
      const github = 'testusergithub'
      const insertedUser = { id: 1, username: 'testuser', email: 'test@example.com' }

      dbClient.query.mockResolvedValue({ rows: [insertedUser] })

      const result = await ProfileServices.insertUser(username, email, password, github)

      expect(dbClient.query).toHaveBeenCalled()
      expect(result).toEqual(insertedUser)
    })

    it('should return null if user insertion fails due to duplicate key', async () => {
      const username = 'testuser'
      const email = 'test@example.com'
      const password = 'password'
      const github = 'testusergithub'

      dbClient.query.mockRejectedValue({ code: '23505' })

      const result = await ProfileServices.insertUser(username, email, password, github)

      expect(dbClient.query).toHaveBeenCalled()
      expect(result).toBeNull()
    })

    it('should log error and return null for other insertion errors', async () => {
      const username = 'testuser'
      const email = 'test@example.com'
      const password = 'password'
      const github = 'testusergithub'

      dbClient.query.mockRejectedValue(new Error('Some error'))

      const result = await ProfileServices.insertUser(username, email, password, github)

      expect(dbClient.query).toHaveBeenCalled()
      expect(result).toEqual(false)
    })
  })

  describe('getNumberCouncilMembers', () => {
    it('should get the number of council members', async () => {
      const councilMembersCount = 5

      dbClient.query.mockResolvedValue({ rows: [{ number_council_members: councilMembersCount }] })

      const result = await ProfileServices.getNumberCouncilMembers()

      expect(dbClient.query).toHaveBeenCalled()
      expect(result).toBe(councilMembersCount)
    })
  })

  it('should log error and return null for other insertion errors', async () => {
    dbClient.query.mockRejectedValue(new Error('Some error'))
    const result = await ProfileServices.getNumberCouncilMembers()

    expect(dbClient.query).toHaveBeenCalled()
    expect(result).toEqual(false)
  })
})
