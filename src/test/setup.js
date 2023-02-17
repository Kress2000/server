require("dotenv").config();
process.env.DB_URL = "test";
const app = require("../../index");
const chai = require("chai");
const expect = chai.expect;
var chaiHttp = require("chai-http");
chai.use(chaiHttp);
const { user } = require("../models/users");
const { blog } = require("../models/blogs");
let should = chai.should();
const router = require("../routes/blogs");


//clean the database
before((done) => {
    user.deleteMany({}, (err) => {});
    blog.deleteMany({}, (err) => {});
    done();
  });
  after((done) => {
    user.deleteMany({}, (err) => {});
    blog.deleteMany({}, (err) => {});
    done();
  });

  //testing Routes -------
describe("Routes test", () => {
    it("should test Api default welcome", (done) => {
      chai
        .request(app)
        .get("/")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          done();
        });
    });
    
    
})  