require('dotenv').config()
process.env.DB_URL = 'test'
const app = require('../../index')
const chai = require('chai')
const expect = chai.expect
var chaiHttp = require('chai-http')
const request = require('supertest')
chai.use(chaiHttp)
let should = chai.should()
const router = require('../routes/routers')

describe('users API', () => {
  it('should Register user, login user, check token and delete a todo on /api/<id> DELETE', function (done) {
    chai
      .request(app)
      // register request
      .post('/mybrand/signup')
      // send user registration details
      .send({
        name: 'nsanzimfura erick',
        email: 'erickykress1@gmail.com',
        password: 'kress123',
        confirmPass: 'kress123',
      })
      .end((err, res) => {
        res.should.have.status(201)
        res.body.should.be.a('object')
        res.body.email.should.be.a('object')
        res.body.name.should.be.a('object')
        res.body.confirmPass.should.be.a('object')
        res.body.password.should.be.a('object')
        expect(res.body.password).to.eql(res.body.confirmPass)
        resonse.body.should.have.property('message')
        // follow up with login
        chai
          .request(app)
          .get('/mybrand/signup')
          .end((req, res) => {
            res.body.should.have.property('message')
          })
        chai
          .request(app)
          .get('/mybrand/login')
          .end((req, res) => {
            res.body.should.have.property('message')
          })
        chai
          .request(app)
          .post('/mybrand/login')
          // send user login details
          .send({
            email: 'erickykress1@gmail.com',
            password: 'kress123',
          })
          .end(async (err, res) => {
            res.body.should.have.property('token')
            var token = res.body.token
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.email.should.be.a('object')
            res.body.name.should.be.a('object')
            res.body.should.have.property('message')
            if (res.body.email.toLowerCase() === 'erickykress1@gmail.com') {
              res.body.should.have.property('message')
              res.should.have.status(200)
            } else {
              res.should.have.status(200)
              res.body.should.have.property('message')
            }
            res.body.should.be.eql({ Error: 'Not authorized! Only Admin' })
            const pair = 'btc_ltc'
            const data = await shapeshift.getRate(pair)
            expect(data.pair).to.equal(pair)
            expect(data.rate).to.have.length(400)

            // follow up with requesting user protected page
            chai
              .request(app)
              .get('/mybrand/api/users')
              .end(function (err, res) {
                res.body.should.have.property('message') //get all users
                res.should.have.status(200)
                res.should.be.a('array')
                chai
                  .request(app)
                  .delete(`/${res.body[0]._id}`) //DEELEETE user
                  .set('Authorization', 'JWT ' + token)
                  .end(function (error, resonse) {
                    resonse.should.have.status(200)
                    resonse.body.should.have.property('message')
                    done()
                  })
                  .put(`/${res.body[1]._id}`) //UPDATE USER
                  // we set the auth header with our token
                  .set('Authorization', 'JWT ' + token)
                  .end(function (error, resonse) {
                    resonse.should.have.status(202)
                    resonse.body.should.have.property('message')
                    done()
                  })
                  .get(`/${res.body[1]._id}`) //get one USER
                  .set('Authorization', 'JWT ' + token)
                  .end(function (error, resonse) {
                    resonse.should.have.status(200)
                    resonse.body.should.have.property('message')
                    resonse.body.should.be.a('object')
                    done()
                  })
              })
            done()
          })
      })
    done()
  })
})

describe('Users Routes test', () => {
  it('should let admin get all users when authorized and signes in', (done) => {
    chai
      .request(app)
      .get('/mybrand/api/users')
      .end((err, res) => {
        if (res.status === 401) {
          res.should.have.status(401) //not authorized
          res.body.should.be.a('object')
        } else {
          res.should.have.status(200) //authorize and successful
          res.body.should.be.a('array')
        }
        done()
      })
  })
  it('Should let the user logout if he wants', (done) => {
    chai
      .request(app)
      .delete('/mybrand/actions/logout')
      .end((err, res) => {
        if (res.body === {}) {
          res.should.have.status(404) //no data
          res.body.should.be.eql({})
        }
        done()
      })
  })
  it('it Should create account', (done) => {
    request(app)
      .post('/mybrand/actions/signup')
      .end((err, res) => {
        if (res.status === 201) {
          res.body.should.be.eql({
            message: 'Account created',
            user: 'user',
            token: 'token',
          })
        } else {
          res.body.should.be.eql({})
        }
        done()
      })
  })
 
})
