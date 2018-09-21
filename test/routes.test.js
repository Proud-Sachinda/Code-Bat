const assert = require('assert')
const expect = require('mocha').expect
const request = require('supertest')
const app = require('../app')


//testing the index route
describe('Testing the / route', ()=>{
    it('should return OK status', ()=>{
        return request(app)
        .get("/")
        .then((res)=>{
            assert.equal(res.status, 200)
        })
    })
})

//testing an non-existent route
describe('Testing the /test route', ()=>{
    it('should return 404 status', ()=>{
        return request(app)
        .get("/test")
        .then((res)=>{
            assert.equal(res.status, 404)
        })
    })
})