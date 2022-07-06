const fs = require('fs');
const { join } = require('path');

const filePath = join(__dirname, 'persons.json');
const isNumber = (n) => { return !isNaN(parseFloat(n)) && !isNaN(n - 0) };

const getPersons = () => {
    const data = fs.existsSync(filePath)
        ? fs.readFileSync(filePath)
        : []

    try {
        return JSON.parse(data)
    } catch (error) {
        return []
    }
};

const savePerson = (persons) => fs.writeFileSync(filePath, JSON.stringify(persons, null, '\t'));

const personRoute = (app) => {
    app.route('/person/:cpf?')
        .get((req, res) => {
            var persons = getPersons()

            if (req.params.cpf) {
                persons = persons.filter(({ cpf }) => cpf==req.params.cpf);                  
            }

            if (persons.length > 0) {
                res.status(200).send({ persons });
            } else {
                res.status(404).send({ persons });
            }
             
            
        })

        .post((req, res) => {
            const persons = getPersons()
            var cpfValidation = false;

            // Validation if exists CPF or CPF lenght invalid 
            if (req.body.cpf && req.body.cpf.length==11 && isNumber(req.body.cpf)) {
                cpfValidation = ((persons.filter(({ cpf }) => cpf==req.body.cpf).length) > 0);

                if (cpfValidation) {
                    res.status(400).send('CPF exists or not valid')

                } else {
                    persons.push(req.body)
                    savePerson(persons)

                    res.status(201).send('Ok')
                }
            } else {
                res.status(400).send('Check CPF value')
            }
            
        })

        .put((req, res) => {
            const persons = getPersons()

            savePerson(persons.map(person => {
                if(person.cpf == req.params.cpf) {
                    return {
                        ...person,
                        ...req.body
                    }
                }
                return person
            }))
            res.status(200).send('Ok')
        })

        .delete((req, res) => {
            const persons = getPersons()

            savePerson(persons.filter(person => person.cpf !== req.params.cpf))

            res.status(200).send('Ok')
        })
};

module.exports = personRoute;