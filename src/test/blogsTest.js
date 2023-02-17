require("dotenv").config();
process.env.DB_URL = "test";
const app = require("../../index");
const chai = require("chai");
const expect = chai.expect;
var chaiHttp = require("chai-http");
const request = require("supertest");
chai.use(chaiHttp);
let should = chai.should();
const router = require("../routes/routers");

describe("Blogs API", () => {
  it("should Register user, login user, check token and delete a todo on /api/<id> DELETE", function (done) {
    chai
      .request(app)
      // register request
      .post("/mybrand/signup")
      // send user registration details
      .send({
        name: "nsanzimfura erick",
        email: "erickykress1@gmail.com",
        password: "kress123",
        confirmPass: "kress123",
      })
      .end((err, res) => {
        res.should.have.status(201);
        // follow up with login
        chai
          .request(app)
          .post("/mybrand/login")
          // send user login details
          .send({
            email: "erickykress1@gmail.com",
            password: "kress123",
          })
          .end((err, res) => {
            res.body.should.have.property("token");
            var token = res.body.token;
            // follow up with requesting user protected page
            chai
              .request(app)
              .get("/mybrand/api/blogs")
              .end(function (err, res) {
                res.body.should.have.property("message"); //get all blogs
                res.should.have.status(200);
                res.should.be.a('array');
                chai
                  .request(app)
                  .delete(`/${res.body[0]._id}`) //DEELEETE
                  .set("Authorization", "JWT " + token)
                  .end(function (error, resonse) {
                    resonse.should.have.status(200);
                    resonse.body.should.have.property("message");
                    done();
                  })
                  .put(`/${res.body[1]._id}`)  //UPDATE
                  // we set the auth header with our token
                  .set("Authorization", "JWT " + token)
                  .end(function (error, resonse) {
                    resonse.should.have.status(202);
                    resonse.body.should.have.property("message");
                    done();
                  })
                  .post("/add")  //ADD NEW
                  // we set the auth header with our token
                  .set("Accept", "application/json")
                  .send({
                    title: "Blog title",
                    description: "Blog Description",
                    img: "url",
                    category: "category",
                  })
                  .end(function (error, resonse) {
                    if(err) throw err;
                    resonse.should.have.status(201);
                    resonse.should.be.a('object');
                    resonse.body.should.have.property("message");
                    done();
                  });
              });
            done();
          });
      });
    done();
  });
});
