const request = require('supertest');
const formurlencoded = require('form-urlencoded').default;

const app = require('../../../app');
const getData = (params = {}) => {
  return {
    cpf:  params.cpf || '01234567890',
    name: params.name || 'John Doe'
  }
};

const USER_OBJECT =  expect.objectContaining({
  persons : {
    cpf: expect.any(String),
    name: expect.any(String)
  }
});

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

  test('Calling response GET method person', async () => {      
    const response = await request(app).get('/person/01234567890');

    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe('object');
    expect(response.text).toBe("{\"persons\":[{\"cpf\":\"01234567890\",\"name\":\"John Doe\"}]}"); 
  });

  test('Deleting a Person', async () => {
    const response = await request(app).delete('/person/01234567890');

    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe('object');
    expect(response.text).toBe('Ok');
  });
});

