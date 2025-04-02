import {createClient} from 'redis';

const redisClient = createClient();

redisClient.on('error',(err)=>{
    console.log(
        "Error in Redis "+err
    )
})

redisClient.connect();

export default redisClient