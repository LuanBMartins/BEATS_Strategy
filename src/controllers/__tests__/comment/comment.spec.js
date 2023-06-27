const commentServices = require('../../../services/comment_services')
const commentControllers = require('../../../controllers/comment_controllers')

describe('commentControllers', () => {
  describe('readComments', () => {
    it('deve retornar os comentários quando fornecido um ID válido', async () => {
      const req = {
        params: {
          id: 'idValido'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }
      const comentariosEsperados = ['comentario1', 'comentario2']

      jest.spyOn(commentServices, 'readComments').mockResolvedValue(comentariosEsperados)

      await commentControllers.readComments(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith({ comments: comentariosEsperados })

      commentServices.readComments.mockRestore()
    })

    it('deve retornar um status de erro quando o ID está ausente', async () => {
      const req = {
        params: {}
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      await commentControllers.readComments(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
    })

    it('deve retornar uma mensagem de erro quando nenhum comentário existe', async () => {
      const req = {
        params: {
          id: 'idValido'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      jest.spyOn(commentServices, 'readComments').mockResolvedValue([])

      await commentControllers.readComments(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith({ error_message: 'comment does not exist' })

      commentServices.readComments.mockRestore()
    })

    it('deve retornar um status de erro quando ocorre uma exceção', async () => {
      const req = {
        params: {
          id: 'idValido'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      jest.spyOn(commentServices, 'readComments').mockRejectedValue(new Error('Erro no servidor'))

      await commentControllers.readComments(req, res)

      expect(res.status).toHaveBeenCalledWith(500)

      commentServices.readComments.mockRestore()
    })
  })

  describe('readComment', () => {
    it('deve retornar um comentário quando fornecido um ID válido', async () => {
      const req = {
        params: {
          id: 'idValido'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }
      const comentarioEsperado = { id: 'idValido', text: 'Comentário' }

      jest.spyOn(commentServices, 'readComment').mockResolvedValue(comentarioEsperado)

      await commentControllers.readComment(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith(comentarioEsperado)

      commentServices.readComment.mockRestore()
    })

    it('deve retornar status 500 quando ID não for fornecido!', async () => {
      const req = {
        params: {

        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      await commentControllers.readComment(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
    })

    it('deve retornar uma mensagem de erro quando o comentário não existe', async () => {
      const req = {
        params: {
          id: 'idInvalido'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      jest.spyOn(commentServices, 'readComment').mockResolvedValue([])

      await commentControllers.readComment(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith({ error_message: 'comment does not exist' })

      commentServices.readComment.mockRestore()
    })

    it('deve retornar um status de erro quando ocorre uma exceção', async () => {
      const req = {
        params: {
          id: 'idValido'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      jest.spyOn(commentServices, 'readComment').mockRejectedValue(new Error('Erro no servidor'))

      await commentControllers.readComment(req, res)

      expect(res.status).toHaveBeenCalledWith(500)

      commentServices.readComment.mockRestore()
    })
  })

  describe('postComment', () => {
    it('deve inserir um comentário e retornar uma mensagem de sucesso', async () => {
      const req = {
        params: {
          id: 'idValido'
        },
        user_info: {
          username: 'usuario1'
        },
        body: {
          text: 'Novo comentário'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }
      const comentarioInserido = { id: 'idComentario', text: 'Novo comentário', username: 'usuario1' }

      jest.spyOn(commentServices, 'commentStrategy').mockResolvedValue(comentarioInserido)

      await commentControllers.postComment(req, res)

      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.send).toHaveBeenCalledWith({ message: 'success: comment inserted', comment: comentarioInserido })

      commentServices.commentStrategy.mockRestore()
    })

    it('deve retornar uma mensagem de erro quando a estratégia não existe', async () => {
      const req = {
        params: {
          id: 'idInvalido'
        },
        user_info: {
          username: 'usuario1'
        },
        body: {
          text: 'Novo comentário'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      jest.spyOn(commentServices, 'commentStrategy').mockResolvedValue(null)

      await commentControllers.postComment(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.send).toHaveBeenCalledWith({ error_message: 'strategy does not exist' })

      commentServices.commentStrategy.mockRestore()
    })

    it('deve retornar um status de erro quando ocorre uma exceção', async () => {
      const req = {
        params: {
          id: 'idValido'
        },
        user_info: {
          username: 'usuario1'
        },
        body: {
          text: 'Novo comentário'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      jest.spyOn(commentServices, 'commentStrategy').mockRejectedValue(new Error('Erro no servidor'))

      await commentControllers.postComment(req, res)

      expect(res.status).toHaveBeenCalledWith(500)

      commentServices.commentStrategy.mockRestore()
    })
  })

  describe('postReplyComment', () => {
    it('deve inserir uma resposta a um comentário e retornar uma mensagem de sucesso', async () => {
      const req = {
        params: {
          id: 'idComentario',
          strategyId: 'idEstrategia'
        },
        user_info: {
          username: 'usuario1'
        },
        body: {
          text: 'Resposta ao comentário'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }
      const respostaInserida = { id: 'idResposta', text: 'Resposta ao comentário', username: 'usuario1' }

      jest.spyOn(commentServices, 'replyCommentStrategy').mockResolvedValue(respostaInserida)

      await commentControllers.postReplyComment(req, res)

      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.send).toHaveBeenCalledWith({ success: true, comment: respostaInserida })

      commentServices.replyCommentStrategy.mockRestore()
    })

    it('deve retornar uma mensagem de erro quando o comentário é inválido', async () => {
      const req = {
        params: {
          id: 'idInvalido',
          strategyId: 'idEstrategia'
        },
        user_info: {
          username: 'usuario1'
        },
        body: {
          text: 'Resposta ao comentário'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      jest.spyOn(commentServices, 'replyCommentStrategy').mockResolvedValue(null)

      await commentControllers.postReplyComment(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid comment!'
      })

      commentServices.replyCommentStrategy.mockRestore()
    })

    it('deve retornar um status de erro quando ocorre uma exceção', async () => {
      const req = {
        params: {
          id: 'idComentario',
          strategyId: 'idEstrategia'
        },
        user_info: {
          username: 'usuario1'
        },
        body: {
          text: 'Resposta ao comentário'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      jest.spyOn(commentServices, 'replyCommentStrategy').mockRejectedValue(new Error('Erro no servidor'))

      await commentControllers.postReplyComment(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.send).toHaveBeenCalledWith({ success: false, message: 'Server Error!' })

      commentServices.replyCommentStrategy.mockRestore()
    })
  })

  describe('deleteComment', () => {
    it('deve excluir um comentário e retornar uma mensagem de sucesso', async () => {
      const req = {
        params: {
          id: 'idComentario'
        },
        user_info: {
          username: 'usuario1'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }
      const comentario = { id: 'idComentario', text: 'Comentário', username: 'usuario1' }

      jest.spyOn(commentServices, 'getCommentById').mockResolvedValue(comentario)
      jest.spyOn(commentServices, 'removeComment').mockResolvedValue()

      await commentControllers.deleteComment(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith({ message: 'success: comment deleted' })

      commentServices.getCommentById.mockRestore()
      commentServices.removeComment.mockRestore()
    })

    it('deve retornar uma mensagem de erro quando o comentário não existe', async () => {
      const req = {
        params: {
          id: 'idInvalido'
        },
        user_info: {
          username: 'usuario1'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      jest.spyOn(commentServices, 'getCommentById').mockResolvedValue(null)

      await commentControllers.deleteComment(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.send).toHaveBeenCalledWith({ error_message: 'comment does not exist' })

      commentServices.getCommentById.mockRestore()
    })

    it('deve retornar uma mensagem de erro quando o usuário não é o autor do comentário', async () => {
      const req = {
        params: {
          id: 'idComentario'
        },
        user_info: {
          username: 'usuario2'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }
      const comentario = { id: 'idComentario', text: 'Comentário', username: 'usuario1' }

      jest.spyOn(commentServices, 'getCommentById').mockResolvedValue(comentario)

      await commentControllers.deleteComment(req, res)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.send).toHaveBeenCalledWith({ message: 'Unauthorized!' })

      commentServices.getCommentById.mockRestore()
    })

    it('deve retornar um status de erro quando ocorre uma exceção ao obter o comentário', async () => {
      const req = {
        params: {
          id: 'idComentario'
        },
        user_info: {
          username: 'usuario1'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      jest.spyOn(commentServices, 'getCommentById').mockRejectedValue(new Error('Erro no servidor'))

      await commentControllers.deleteComment(req, res)

      expect(res.status).toHaveBeenCalledWith(500)

      commentServices.getCommentById.mockRestore()
    })

    it('deve retornar um status de erro quando ocorre uma exceção ao excluir o comentário', async () => {
      const req = {
        params: {
          id: 'idComentario'
        },
        user_info: {
          username: 'usuario1'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }
      const comentario = { id: 'idComentario', text: 'Comentário', username: 'usuario1' }

      jest.spyOn(commentServices, 'getCommentById').mockResolvedValue(comentario)
      jest.spyOn(commentServices, 'removeComment').mockRejectedValue(new Error('Erro no servidor'))

      await commentControllers.deleteComment(req, res)

      expect(res.status).toHaveBeenCalledWith(500)

      commentServices.getCommentById.mockRestore()
      commentServices.removeComment.mockRestore()
    })
  })

  describe('editComment', () => {
    it('deve editar um comentário e retornar uma mensagem de sucesso', async () => {
      const req = {
        params: {
          id: 'idComentario'
        },
        user_info: {
          username: 'usuario1'
        },
        body: {
          newText: 'Novo texto'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }
      const comentario = { id: 'idComentario', text: 'Texto antigo', username: 'usuario1' }

      jest.spyOn(commentServices, 'getCommentById').mockResolvedValue(comentario)
      jest.spyOn(commentServices, 'updateCommentText').mockResolvedValue(true)

      await commentControllers.editComment(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith({ successs: true, message: 'Comment update!' })

      commentServices.getCommentById.mockRestore()
      commentServices.updateCommentText.mockRestore()
    })

    it('deve retornar uma mensagem de erro quando o comentário não existe', async () => {
      const req = {
        params: {
          id: 'idComentario'
        },
        user_info: {
          username: 'usuario1'
        },
        body: {
          newText: 'Novo texto'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }
      const comentario = { id: 'idComentario', text: 'Texto antigo', username: 'usuario1' }

      jest.spyOn(commentServices, 'getCommentById').mockResolvedValue(comentario)
      jest.spyOn(commentServices, 'updateCommentText').mockResolvedValue(false)

      await commentControllers.editComment(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.send).toHaveBeenCalledWith({ message: 'comment does not exist', success: false })

      commentServices.getCommentById.mockRestore()
      commentServices.updateCommentText.mockRestore()
    })

    it('deve retornar uma mensagem de erro quando o usuário não é o autor do comentário', async () => {
      const req = {
        params: {
          id: 'idComentario'
        },
        user_info: {
          username: 'usuario2'
        },
        body: {
          newText: 'Novo texto'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }
      const comentario = { id: 'idComentario', text: 'Texto antigo', username: 'usuario1' }

      jest.spyOn(commentServices, 'getCommentById').mockResolvedValue(comentario)

      await commentControllers.editComment(req, res)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.send).toHaveBeenCalledWith({ message: 'Unauthorized!' })

      commentServices.getCommentById.mockRestore()
    })

    it('deve retornar um status de erro quando ocorre uma exceção ao obter o comentário', async () => {
      const req = {
        params: {
          id: 'idComentario'
        },
        user_info: {
          username: 'usuario1'
        },
        body: {
          newText: 'Novo texto'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      jest.spyOn(commentServices, 'getCommentById').mockRejectedValue(new Error('Erro no servidor'))

      await commentControllers.editComment(req, res)

      expect(res.status).toHaveBeenCalledWith(500)

      commentServices.getCommentById.mockRestore()
    })

    it('deve retornar um status de erro quando ocorre uma exceção ao editar o comentário', async () => {
      const req = {
        params: {
          id: 'idComentario'
        },
        user_info: {
          username: 'usuario1'
        },
        body: {
          newText: 'Novo texto'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }
      const comentario = { id: 'idComentario', text: 'Texto antigo', username: 'usuario1' }

      jest.spyOn(commentServices, 'getCommentById').mockResolvedValue(comentario)
      jest.spyOn(commentServices, 'updateCommentText').mockRejectedValue(new Error('Erro no servidor'))

      await commentControllers.editComment(req, res)

      expect(res.status).toHaveBeenCalledWith(500)

      commentServices.getCommentById.mockRestore()
      commentServices.updateCommentText.mockRestore()
    })
  })
})
