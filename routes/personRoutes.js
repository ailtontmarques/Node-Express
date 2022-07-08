const fs = require('fs');
const { join } = require('path');

const filePath = join(__dirname, 'persons.json');
const filePathRelation = join(__dirname, 'relationships.json');

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

const getRelationships = () => {
    const data = fs.existsSync(filePathRelation)
    ? fs.readFileSync(filePathRelation)
    : []

    try {
        return JSON.parse(data)
    } catch (error) {
        return []
    }
};

const savePerson = (persons) => fs.writeFileSync(filePath, JSON.stringify(persons, null, '\t'));
const saveRelationship = (relationships) => fs.writeFileSync(filePathRelation, JSON.stringify(relationships, null, '\t'));

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
            const persons = getPersons();
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

    app.route('/relationship/')
        .post((req, res) => {
            const persons = getPersons();
            const relationships = getRelationships();

            var cpf1Validation = false;
            var cpf2Validation = false;

            if (req.body.cpf1 && req.body.cpf1.length==11 && isNumber(req.body.cpf1)) {
                cpf1Validation = ((persons.filter(({ cpf }) => cpf==req.body.cpf1).length) > 0);
            }
            if (req.body.cpf2 && req.body.cpf2.length==11 && isNumber(req.body.cpf2)) {
                cpf2Validation = ((persons.filter(({ cpf }) => cpf==req.body.cpf2).length) > 0);
            }

            if (cpf1Validation && cpf2Validation) {
                relationships.push(req.body);
                saveRelationship(relationships);

                res.status(200).send('Ok')
            } else {
                res.status(404).send('CPF1 or CPF2 not exists or not valid')
            }

        })

    app.route('/recommendations/:cpf?')
        .get((req, res) => {
            if (req.params.cpf && req.params.cpf.length==11 && isNumber(req.params.cpf)) {
                res.status(200).send('Ok')
            } else {
                res.status(400).send('CPF not valid')
            }
        })

    app.route('/clean/')
        .delete((req, res) => {
            res.status(200).send('Ok')
        })
};

module.exports = personRoute;