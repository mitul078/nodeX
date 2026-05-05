// tests/auth.test.js
const request = require("supertest")
const app = require("../app")
const mongoose = require("mongoose")

// runs once before all tests
beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST)
})

// runs once after all tests
afterAll(async () => {
    await mongoose.connection.dropDatabase()  // clean test db
    await mongoose.connection.close()
})

// -----------------------------------------------
// SIGNUP
// -----------------------------------------------
describe("POST /api/v1/auth/signup", () => {

    it("should signup successfully", async () => {
        const res = await request(app)
            .post("/api/v1/auth/signup")
            .send({
                username: "Mitul123",
                email: "mitul@gmail.com",
                password: "Mitul@9999"
            })

        expect(res.status).toBe(201)
        expect(res.body.message).toBe("USER IS CREATED")
    })

    it("should fail if user already exists", async () => {
        const res = await request(app)
            .post("/api/v1/auth/signup")
            .send({
                username: "Mitul123",
                email: "mitul@gmail.com",
                password: "Mitul@9999"
            })

        expect(res.status).toBe(400)
        expect(res.body.message).toBe("USER IS ALREADY EXISTS")
    })

    it("should fail if email is invalid", async () => {
        const res = await request(app)
            .post("/api/v1/auth/signup")
            .send({
                username: "Mitul123",
                email: "notanemail",
                password: "Mitul@9999"
            })

        expect(res.status).toBe(400)
    })

    it("should fail if password has no special character", async () => {
        const res = await request(app)
            .post("/api/v1/auth/signup")
            .send({
                username: "Mitul123",
                email: "mitul@gmail.com",
                password: "Mitul1234"  // no special character
            })

        expect(res.status).toBe(400)
    })
})

// -----------------------------------------------
// SIGNIN
// -----------------------------------------------
describe("POST /api/auth/signin", () => {

    it("should signin successfully and return accessToken", async () => {
        const res = await request(app)
            .post("/api/v1/auth/signin")
            .send({
                username: "Mitul123",
                password: "Mitul@9999"
            })

        expect(res.status).toBe(200)
        expect(res.body.data.accessToken).toBeDefined()
    })

    it("should fail if user not registered", async () => {
        const res = await request(app)
            .post("/api/v1/auth/signin")
            .send({
                username: "unknown",
                password: "Mitul@9999"
            })

        expect(res.status).toBe(400)
        expect(res.body.message).toBe("USER IS NOT REGISTERED")
    })

    it("should fail if password is wrong", async () => {
        const res = await request(app)
            .post("/api/v1/auth/signin")
            .send({
                username: "Mitul123",
                password: "Wrong@1234"
            })

        expect(res.status).toBe(400)
        expect(res.body.message).toBe("CREDENTIALS ARE WRONG")
    })
})

// -----------------------------------------------
// GET ME
// -----------------------------------------------
describe("GET /api/v1/auth/me", () => {

    it("should return user if token is valid", async () => {
        // first signin to get token
        const signin = await request(app)
            .post("/api/v1/auth/signin")
            .send({ username: "Mitul123", password: "Mitul@9999" })

        const { accessToken } = signin.body.data

        const res = await request(app)
            .get("/api/v1/auth/me")
            .set("Authorization", `Bearer ${accessToken}`)  // attach token

        expect(res.status).toBe(200)
        expect(res.body.data.user.username).toBe("Mitul123")
    })

    it("should fail if no token", async () => {
        const res = await request(app).get("/api/v1/auth/me")

        expect(res.status).toBe(401)
    })
})