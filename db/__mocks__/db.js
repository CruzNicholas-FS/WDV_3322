const connect = async() =>{
    console.log("Mock Connecting");
}

const disconnect = async() =>{
    console.log("Mock Disconnecting");
}

const findUser = async(object) =>{
return Promise.resolve([{
    _id:"62c5e3b76fb37ff554b8a959",
    firstName:"Tristen",
        lastName:"Cruz",
        streetAddress:"135 McDowell Ln",
        city:"Decatur",
        state:"TN",
        zip:37322,
        email:"tristenswafford@gmail.com",
        password:"terriblepassword1!"
}])
}

const saveUser = async(newUser) =>{
    return Promise.resolve({
        firstName:"Tristen",
            lastName:"Cruz",
            streetAddress:"135 McDowell Ln",
            city:"Decatur",
            state:"TN",
            zip:37322,
            email:"tristenswafford@gmail.com",
            password:"terriblepassword1!"
    })
}

module.exports={findUser, saveUser, connect, disconnect}