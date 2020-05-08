
const USER = require("../../models/patientModel");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const login_module = {
    create_user: async function(user, callback){
        //check if username exists
        let check = await username_check(user.username);
        let create_user;
        if (check === false){
            //hash password
            await bcrypt.hash(user.password, saltRounds, async function(err, hash) {
                //console.log("hash ", hash);
                user.password = hash; 
                create_user = await USER.create(user);
            });   
            return create_user;
        } else if (check === true){
            return false;
        }
    },
    login_user: async function(callback){
        let password = callback.password;
        let email = callback.email;
        let hash;

        //check username
        let user_indb = await email_find(email);
        //console.log("userindb ", user_indb);
    

        if (user_indb === null){
        console.log("cant login, user doesnt exist");
        return false;
        } else {
            //check password
            hash = user_indb[0].password;
            //console.log("matching password");
            let check = await check_password(password, hash);
            if(check === "match"){
                return true;
            } else {
                return false;
            }
        }
    },
    auto_login: async function(data){
        let logged;
        logged = await USER.find({username: data.username});
        if(logged.length > 0){
            return {log:logged[0], type: "tutor"};
        } else {
            return "autologin_denied"
        }
    },
    change_password: async function(data){
        let found_user = await USER.find({username: data.username});
        //console.log("found: ", found_user);

        if (found_user === null){
            console.log("cant login, user doesnt exist");
            return "user does not exist";
        } else {
            //change password
            hash = found_user[0].password;
            //console.log("matching password");
            let check = await check_password(data.password, hash);
            if(check === "match"){
                await bcrypt.hash(data.new_password, saltRounds, async function(err, hash) {
                    //console.log("hash ", hash);
                    data.password = hash; 
                    await Usuario.findOneAndUpdate({username: data.username}, {password: hash},{useFindAndModify: false});
                    console.log("password changed!");
                });  
                return "password changed";
            } else {
                return "wrong password";
            }
        }   
    },
    find_user_email: async function(email){
        let found = await USER.find({email: email});
        if (found.length === 0){
            console.log("email is available");
            return false;
        } else {
            console.log("email is taken")
            return found;
        }
    }
}

//FUNCTIONS



async function email_find(email){
    console.log("run email find")
    let found = await USER.find({email: email});
    console.log("found: ", found)
    if (found.length === 0){
        console.log("user not found");
        return null;
    } else {
        console.log("username exists")
        return found;
    }
}

async function check_password(password, hash){
    console.log("password: ", password, " -- ", "hash: ", hash);
    const match = await bcrypt.compare(password, hash);
    if (match){
        console.log("password match!")
        return "match";
    } else {
        console.log("password no go");
        return "no match";
    }
}

async function username_check(email){
    let found = await USER.find({email: email});
    if (found.length === 0){
        console.log("username is available");
        return false;
    } else {
        console.log("username is taken")
        return true;
    }
}

module.exports = login_module;
        