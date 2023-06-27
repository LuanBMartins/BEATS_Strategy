const validate = require('./../utils/validate')

describe('validate', () => {
  it('deve remover campos indesejados do objeto', () => {
    const fields = ['name', 'age', 'email']
    const object = {
      name: 'John',
      age: 30,
      email: 'john@example.com',
      address: '123 Street',
      phone: '1234567890'
    }

    const expectedResult = {
      name: 'John',
      age: 30,
      email: 'john@example.com'
    }

    const result = validate(fields, object)

    expect(result).toEqual(expectedResult)
  })

  it('deve retornar um objeto vazio se o objeto for nulo', () => {
    const fields = ['name', 'age', 'email']
    const object = null

    const expectedResult = {}

    const result = validate(fields, object)

    expect(result).toEqual(expectedResult)
  })

  it('deve retornar um objeto vazio se o objeto não tiver campos desejados', () => {
    const fields = ['name', 'age', 'email']
    const object = {
      address: '123 Street',
      phone: '1234567890'
    }

    const expectedResult = {}

    const result = validate(fields, object)

    expect(result).toEqual(expectedResult)
  })
})
