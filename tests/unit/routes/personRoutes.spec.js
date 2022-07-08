import sinon from 'sinon'

import PersonRoutesController from '../../../routes/personRoutes'

describe('Controller: personRoutes', () => {

    const defaultPerson = [{
        cpf: '01234567890',
        name: 'Default'
    }]

    describe('getPersons() person', () => {
        it('shold call send with a list of person', () => {
            const response = {
                send: sinon.spy()
            }

            const personRoutesController = new PersonRoutesController(Person)
            const Person = personRoutesController.getPersons()

            Person.find = sinon.stub()
            Person.find.withArgs({}).resolves(defaultPerson)

            sinon.assert.calledWith(response.send, defaultPerson)
        })
    })
})