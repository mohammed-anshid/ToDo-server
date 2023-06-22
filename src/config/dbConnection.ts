import mongoose ,{ ConnectOptions } from "mongoose";

const dbConnection = async (databseUrl:string) => {
    mongoose.set('strictQuery',false);
    try {
        const DB_OPTIONS :ConnectOptions  = {dbName :'codemarch'}
        await mongoose.connect(databseUrl, DB_OPTIONS);
        console.log('Database connection established')
    } catch (error) {
        console.log(error);
    }
}

export default dbConnection;