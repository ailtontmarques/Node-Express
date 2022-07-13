const fs = require('fs');
const { join } = require('path');
const request = require('supertest');
const formurlencoded = require('form-urlencoded').default;

const app = require('../../../app');
const filePath = join(__dirname, '../../../routes/');
const filePathPerson = join(filePath, 'persons.json');
const filePathRelationship = join(filePath, 'relationships.json');

const getData = (params = {}) => {
  return {
    cpf:  params.cpf || '01234567890',
    name: params.name || 'John Doe'
  }
};

const getRelationshipsData = (params = {}) => {
  return {
    cpf1: params.cpf1 || '01234567890',
    cpf2: params.cpf2 || '12345678901'
  }
};

const USER_OBJECT =  expect.objectContaining({
  persons : {
    cpf: expect.any(String),
    name: expect.any(String)
  }
});

const personFields = [
  { cpf: '64002974138', name: 'Brenda Stefany da Luz' },
  { cpf: '58074819418', name: 'Eloá Benedita Novaes' },
  { cpf: '81261480805', name: 'Roberto Noah Guilherme Costa' },
  { cpf: '13141873844', name: 'Débora Luiza Julia Peixoto' },
  { cpf: '11715227549', name: 'Luiz Diogo Vicente Sales' },
  { cpf: '28322631197', name: 'Sophia Sarah Silva' },
  { cpf: '41630646059', name: 'Miguel Nathan Francisco Cavalcanti' },
  { cpf: '33272641718', name: 'Cláudio Márcio Lorenzo Fogaça' },
  { cpf: '12345678901', name: 'Joe Doe' }
];

const relationshipFields = [
{ cpf1: "64002974138", cpf2: "58074819418"},
{ cpf1: "64002974138", cpf2: "81261480805"},
{ cpf1: "58074819418", cpf2: "13141873844"},
{ cpf1: "81261480805", cpf2: "13141873844"},
{ cpf1: "81261480805", cpf2: "11715227549"}
]; 

fs.writeFileSync(filePathPerson, JSON.stringify(personFields));
fs.writeFileSync(filePathRelationship, JSON.stringify(relationshipFields));

describe('Test the root path', () => {
  test('It should response the GET method', done => {
    request(app)
      .get('/')
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });

});

describe('Person Routes', () => {
  test('Adding New Person', async () => {      
      const response = await request(app).post('/person/').send(formurlencoded(getData()));
      
      expect(response.statusCode).toEqual(201);
      expect(typeof response.body).toBe('object');
      expect(response.text).toBe('Ok');
  });

  test('Adding the same Person again', async () => {      
    const response = await request(app).post('/person/').send(formurlencoded(getData()));
    
    expect(response.statusCode).toEqual(400);
    expect(typeof response.body).toBe('object');
    expect(response.text).toBe('CPF exists or not valid');
  });

  test('Adding Person when CPF entry is not valid', async () => {      
    const response = await request(app).post('/person/').send("{\"cpf\":\"7777777777\",\"name\":\"Jane Doe\"}");
    
    expect(response.statusCode).toEqual(400);
    expect(typeof response.body).toBe('object');
    expect(response.text).toBe('Check CPF value');
  });

  test('Calling GET method and retrieving a person', async () => {      
    const response = await request(app).get('/person/01234567890');

    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe('object');
    expect(response.text).toBe("{\"persons\":[{\"cpf\":\"01234567890\",\"name\":\"John Doe\"}]}"); 
  });

  test('Calling GET method when CPF entry is not valid', async () => {      
    const response = await request(app).get('/person/77777777777');

    expect(response.statusCode).toEqual(404);
    expect(response.text).toBe('{\"persons\":[]}'); 
  });

  test('Updating a Person', async () => {
    const response = await request(app).put('/person/01234567890');

    expect(response.statusCode).toEqual(200);
    expect(response.text).toBe('Ok');
  });

});

describe('Relationship Routes', () => {
  test('Adding New Relationship', async () => { 
    const response = await request(app).post('/relationship/').send(formurlencoded(getRelationshipsData()));

    expect(response.statusCode).toEqual(200);
    expect(response.text).toBe('Ok');    
  });

  test('Adding Relationship when one or more CPF not exists', async () => { 
    const response = await request(app).post('/relationship/').send('{\"cpf1\":\"01234567890\",\"cpf2\":\"77777777777\"}]}');

    expect(response.statusCode).toEqual(404);
    expect(response.text).toBe('CPF1 or CPF2 not exists or not valid');    
  });

});

describe('Recommendation Routes', () => {
  test('Retrieving a recommendation with a Person', async () => {
    const response = await request(app).get('/recommendations/64002974138');

    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe('object');
    expect(response.text).toBe("[\"13141873844\",\"11715227549\"]");
  });

  test('Retrieving a recommendation when a Person not exist', async () => {
    const response = await request(app).get('/recommendations/7777777777');

    expect(response.statusCode).toEqual(400);
    expect(response.text).toBe("CPF not valid");
  });
});

describe('Person Routes *Deleting Person*', () => {
  test('Deleting a Person', async () => {
    const response = await request(app).delete('/person/01234567890');

    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe('object');
    expect(response.text).toBe('Ok');
  });
});

describe('Cleanup local files', () => {
  test('Calling DELETE method', async () => {
    const response = await request(app).delete('/clean/');

    expect(response.statusCode).toEqual(200);
  });
});
