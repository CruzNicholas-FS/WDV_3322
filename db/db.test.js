const mongoose=require("mongoose");
const User = require("../api/models/user");
const {findUser, saveUser, connect, disconnect}=require("./db");

jest.mock("./db.js")

describe("DB Tests",()=>{
    test("As a user I want to save a user to MongoDB", async()=>{
        const newUser = new User({
            _id:mongoose.Types.ObjectId(),
            firstName:"Tristen",
            lastName:"Cruz",
            streetAddress:"135 McDowell Ln",
            city:"Decatur",
            state:"TN",
            zip:37322,
            email:"tristenswafford@gmail.com",
            password:"terriblepassword1!"
        })
        await connect();
        const user = await saveUser(newUser);
        expect(user.firstName).toEqual("Tristen");
        expect(user.email).toEqual("tristenswafford@gmail.com");
        expect(user.password).toEqual("terriblepassword1!");
        await disconnect();
    })

    test("I want to search a user saved in MongoDB", async()=>{
        const search = {email:"tristenswafford@gmail.com"}
        await connect();
        const user = await findUser(search);
        expect(user[0].firstName).toEqual("Tristen");
        expect(user[0].city).toEqual("Decatur");
        expect(user[0].state).toEqual("TN");
        await disconnect();
    })
})