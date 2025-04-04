import mongoose from 'mongoose';

export async function connectDB(){

    if(!process.env.MONGO_DB_URI) return;

    await mongoose.connect(process.env.MONGO_DB_URI)
    .then(()=>{
        console.log("connected to DB successfully")
    })
    .catch((err)=>{
        console.log("Error connecting to DB" + err.message);
    })

}