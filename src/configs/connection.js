const mongoose = require('mongoose');
const db= require('./keys').mongoUri;
const connectToDb = async ()=>{
    try{
        const conn = await mongoose.connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    console.log("connected successfully at : ", conn.connection.host)
}catch(err){
    console.log(err);
    process.exit(1);
}
}
module.exports = connectToDb;
