const request = require("supertest")
const app = require('../../../index')
const MongoMemoryServer = require('mongodb-memory-server').default // ! won't work
const mongoose = require('mongoose')
const User = require('../../../models/user')

// * MONGODB-MEMORY-SERVER SETUP * //

// describe('when I do npm run test', () => {
//     it('passes this test', () => {
//         expect(1 + 2).toEqual(3)
//     })
// })

// let mongo
// beforeAll(async () => {

//     mongo = new MongoMemoryServer();
//     const mongoUri = await mongo.getUri();

//     await mongoose.createConnection(mongoUri, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     })
// })

// beforeEach(async () => {
//     const collections = await mongoose.connection.db.collections();

//     for (let collection of collections) {
//         await collection.deleteMany({});
//     }
// })

// afterAll(async () => {
//     await mongo.stop();
//     await mongoose.connection.close();
// })

// * SIGNUP TESTS * //

describe('POST /auth/signup', () => {
    it('fails to sign up a user who passes no password', async () => {
        await request(app)
            .post("/auth/signup")
            .send({
                username: "unitTest1",
                // email: "unitTest1@gmail.com",
                // password: "unitTest1Pwd"
            })
            .expect(400);
    })

    it('fails to sign up a user who passes no username', async () => {
        await request(app)
            .post("/auth/signup")
            .send({
                // username: "unitTest1",
                // email: "unitTest1@gmail.com",
                password: "unitTest1Pwd"
            })
            .expect(400);
    })

    it('signs up accounts with perfect input', async () => {
        await request(app)
            .post("/auth/signup")
            .send({
                username: "perfect",
                email: "perfect@gmail.com",
                password: "password"
            })
            .expect(201);

        await User.findOneAndDelete({ username: "perfect" })
    })

    it('returns duplicate username error', async () => {
        await request(app)
            .post("/auth/signup")
            .send({
                username: "test2",
                email: "test2@gmail.com",
                password: "password"
            })
            .expect(201);

        await request(app)
            .post("/auth/signup")
            .send({
                username: "test2",
                email: "Xtest2@gmail.com",
                password: "password"
            })
            .expect(406);

        await User.findOneAndDelete({ username: "test2" })
    })

    it('returns duplicate email error', async () => {
        await request(app)
            .post("/auth/signup")
            .send({
                username: "test2",
                email: "test2@gmail.com",
                password: "password"
            })
            .expect(201);

        await request(app)
            .post("/auth/signup")
            .send({
                username: "Xtest2",
                email: "test2@gmail.com",
                password: "password"
            })
            .expect(406);

        await User.findOneAndDelete({ email: "test2@gmail.com" })
    })
})

// * SIGN IN TESTS * //

describe('POST /auth/signin', () => {
    it('fails to sign user in if username is not provided', async () => {
        await request(app)
            .post("/auth/signin")
            .send({
                password: "fakepassword"
            })
            .expect(400)
    })

    it('fails to sign user in if password is not provided', async () => {
        await request(app)
            .post("/auth/signin")
            .send({
                username: "fakeusername"
            })
            .expect(400)
    })

    it('returns 401 if provided username does not exist', async () => {
        await request(app)
            .post("/auth/signup")
            .send({
                username: "x234kjsa82",
                email: "asdk234s@gmail.com",
                password: "password"
            })
            .expect(201);
        await User.findOneAndDelete({ username: "x234kjsa82" })

        await request(app)
            .post("/auth/signin")
            .send({
                username: "x234kjsa82",
                password: "doesntmatter"
            })
            .expect(401);
    })

    it('returns 401 if incorrect password is provided', async () => {
        await request(app)
            .post("/auth/signup")
            .send({
                username: "x234kjsa82",
                email: "asdk234s@gmail.com",
                password: "password"
            })
            .expect(201);

        await request(app)
            .post("/auth/signin")
            .send({
                username: "x234kjsa82",
                password: "incorrect"
            })
            .expect(401);

        await User.findOneAndDelete({ username: "x234kjsa82" })
    })

    it('signs user in successfully when the correct credentials are supplied', async () => {
        await request(app)
            .post("/auth/signup")
            .send({
                username: "x234kjsa82",
                email: "asdk234s@gmail.com",
                password: "password"
            })
            .expect(201);

        await request(app)
            .post("/auth/signin")
            .send({
                username: "x234kjsa82",
                password: "password"
            })
            .expect(200);

        await User.findOneAndDelete({ username: "x234kjsa82" })

    })

})
