const userService = require('../../../services/user_services')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const ProfileControllers = require('../../../controllers/user_controllers')
const validate = require('../../../controllers/utils/validate')

jest.mock('bcrypt')
jest.mock('jsonwebtoken')
jest.mock('../../../services/user_services')
jest.mock('../../../controllers/utils/validate')

describe('ProfileControllers', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('readProfile', () => {
    it('deve retornar o perfil do usuário com sucesso', async () => {
      const req = {
        params: { email: 'test@example.com' }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }
      const user = { /* perfil do usuário */ }

      jest.spyOn(userService, 'readUser').mockResolvedValue(user)

      await ProfileControllers.readProfile(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith({ success: true, data: user })

      userService.readUser.mockRestore()
    })

    it('deve retornar um erro quando o email não é fornecido', async () => {
      const req = {
        params: { email: undefined }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      await ProfileControllers.readProfile(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.send).toHaveBeenCalledWith({ success: false, message: 'Invalid Params!' })
    })

    it('deve retornar um erro quando o usuário não é encontrado', async () => {
      const req = {
        params: { email: 'test@example.com' }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      jest.spyOn(userService, 'readUser').mockResolvedValue(null)

      await ProfileControllers.readProfile(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.send).toHaveBeenCalledWith({ success: false, message: 'User not found!' })

      userService.readUser.mockRestore()
    })

    it('deve retornar um status de erro quando ocorre uma exceção', async () => {
      const req = {
        params: { email: 'test@example.com' }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      jest.spyOn(userService, 'readUser').mockRejectedValue(new Error('Erro no servidor'))

      await ProfileControllers.readProfile(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.send).toHaveBeenCalledWith({ success: false, message: 'Server Error!' })

      userService.readUser.mockRestore()
    })
  })

  describe('updateProfile', () => {
    it('deve atualizar o perfil com sucesso', async () => {
      const req = {
        params: {
          email: 'test@example.com'
        },
        body: {
          username: 'newuser',
          email: 'newuser@example.com',
          senha: 'newpassword12',
          perfil_github: 'newgithub'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      const validPayload = {
        username: 'newuser',
        email: 'newuser@example.com',
        senha: 'newpassword12',
        perfil_github: 'newgithub'
      }

      const updatedProfile = true

      validate.mockReturnValue(validPayload)
      jest.spyOn(userService, 'updateProfile').mockResolvedValue(updatedProfile)

      await ProfileControllers.updateProfile(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith({ update: true })

      expect(validate).toHaveBeenCalledWith(
        ['username', 'email', 'senha', 'perfil_github'],
        req.body
      )
      expect(userService.updateProfile).toHaveBeenCalledWith('test@example.com', validPayload)

      jest.restoreAllMocks()
    })

    it('deve retornar um erro quando o email não é fornecido', async () => {
      const req = {
        params: { email: undefined },
        body: { /* dados do perfil */ }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      await ProfileControllers.updateProfile(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.send).toHaveBeenCalledWith({ success: false, message: 'Invalid Params!' })
    })

    it('deve retornar um erro quando a senha tem menos de 12 dígitos', async () => {
      const req = {
        params: { email: 'test@example.com' },
        body: { /* dados do perfil */ }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }
      const profile = { /* perfil atualizado do usuário */ }
      const invalidPayload = { senha: '12' }

      validate.mockReturnValue(invalidPayload)
      jest.spyOn(userService, 'updateProfile').mockResolvedValue(profile)

      await ProfileControllers.updateProfile(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.send).toHaveBeenCalledWith({ success: false, message: 'password must contain 12 digits' })

      jest.restoreAllMocks()
    })

    it('deve retornar que a atualização não foi feita quando o perfil não é atualizado', async () => {
      const req = {
        params: { email: 'test@example.com' },
        body: { /* dados do perfil */ }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }
      const validPayload = { /* payload válido */ }

      validate.mockReturnValue(validPayload)
      jest.spyOn(userService, 'updateProfile').mockResolvedValue(null)

      await ProfileControllers.updateProfile(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith({ update: false })

      jest.restoreAllMocks()
    })

    it('deve retornar um status de erro quando ocorre uma exceção', async () => {
      const req = {
        params: { email: 'test@example.com' },
        body: { /* dados do perfil */ }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }
      const validPayload = { /* payload válido */ }

      validate.mockReturnValue(validPayload)
      jest.spyOn(userService, 'updateProfile').mockRejectedValue(new Error('Erro no servidor'))

      await ProfileControllers.updateProfile(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.send).toHaveBeenCalledWith({ success: false, message: 'Server Error!' })

      jest.restoreAllMocks()
    })
  })

  describe('registerUser', () => {
    it('deve registrar um novo usuário com sucesso', async () => {
      const req = {
        body: {
          username: 'testuser',
          email: 'test@example.com',
          github: 'testuser',
          password: '123456789012'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }
      const hashedPassword = 'hashedPassword'
      const userInsert = { /* usuário inserido */ }
      const tokenInfo = { username: 'testuser', user_type: 0 }
      const accessToken = 'accessToken'

      bcrypt.hash.mockResolvedValue(hashedPassword)
      jest.spyOn(userService, 'insertUser').mockResolvedValue(userInsert)
      jwt.sign.mockReturnValue(accessToken)

      await ProfileControllers.registerUser(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith({
        message: 'success: registered',
        access_token: accessToken,
        username: 'testuser',
        user_type: 'Regular User'
      })

      expect(bcrypt.hash).toHaveBeenCalledWith('123456789012', 10)
      expect(userService.insertUser).toHaveBeenCalledWith('testuser', 'test@example.com', hashedPassword, 'testuser')
      expect(jwt.sign).toHaveBeenCalledWith(tokenInfo, process.env.JWT_SECRET)

      bcrypt.hash.mockRestore()
      userService.insertUser.mockRestore()
      jwt.sign.mockRestore()
    })

    it('deve retornar um erro quando a senha tem menos de 12 dígitos', async () => {
      const req = {
        body: {
          username: 'testuser',
          email: 'test@example.com',
          github: 'testuser',
          password: '12345678'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      await ProfileControllers.registerUser(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.send).toHaveBeenCalledWith({ error_message: 'password must contain 12 digits' })
    })

    it('deve retornar um erro quando o usuário já está em uso', async () => {
      const req = {
        body: {
          username: 'testuser',
          email: 'test@example.com',
          github: 'testuser',
          password: '123456789012'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      jest.spyOn(userService, 'insertUser').mockResolvedValue(null)

      await ProfileControllers.registerUser(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.send).toHaveBeenCalledWith({ error_message: 'username or email or github already in use' })

      userService.insertUser.mockRestore()
    })
  })

  describe('authenticateUser', () => {
    it('deve autenticar o usuário com sucesso', async () => {
      const req = {
        body: {
          username: 'testuser',
          password: '123456789012'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }
      const user = {
        username: 'testuser',
        password: 'hashedPassword',
        user_type: 0
      }
      const tokenInfo = { username: 'testuser', user_type: 0 }
      const accessToken = 'accessToken'

      jest.spyOn(userService, 'getUser').mockResolvedValue(user)
      bcrypt.compare.mockResolvedValue(true)
      jwt.sign.mockReturnValue(accessToken)

      await ProfileControllers.authenticateUser(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith({
        message: 'success: logged in',
        access_token: accessToken,
        username: 'testuser',
        user_type: 'Regular User'
      })

      expect(userService.getUser).toHaveBeenCalledWith('testuser')
      expect(bcrypt.compare).toHaveBeenCalledWith('123456789012', 'hashedPassword')
      expect(jwt.sign).toHaveBeenCalledWith(tokenInfo, process.env.JWT_SECRET)

      userService.getUser.mockRestore()
      bcrypt.compare.mockRestore()
      jwt.sign.mockRestore()
    })

    it('deve retornar um erro quando a senha tem menos de 12 dígitos', async () => {
      const req = {
        body: {
          username: 'testuser',
          password: '12345678'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      await ProfileControllers.authenticateUser(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.send).toHaveBeenCalledWith({ error_message: 'password must contain 12 digits' })
    })

    it('deve retornar um erro quando o usuário não é encontrado', async () => {
      const req = {
        body: {
          username: 'testuser',
          password: '123456789012'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      jest.spyOn(userService, 'getUser').mockResolvedValue(null)

      await ProfileControllers.authenticateUser(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.send).toHaveBeenCalledWith({ error_message: 'username or password is incorrect' })

      userService.getUser.mockRestore()
    })

    it('deve retornar um erro quando a senha é incorreta', async () => {
      const req = {
        body: {
          username: 'testuser',
          password: '123456789012'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }
      const user = {
        username: 'testuser',
        password: 'hashedPassword',
        user_type: 0
      }

      jest.spyOn(userService, 'getUser').mockResolvedValue(user)
      bcrypt.compare.mockResolvedValue(false)

      await ProfileControllers.authenticateUser(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.send).toHaveBeenCalledWith({ error_message: 'username or password is incorrect' })

      userService.getUser.mockRestore()
      bcrypt.compare.mockRestore()
    })
  })
})
