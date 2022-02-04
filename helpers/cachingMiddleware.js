const client = require("../helpers/redis")

function cacheSet(redis_key, data){
    client.set(redis_key, JSON.stringify(data))
}


// General Catch //

// Get cache
function cacheGeneralGet(redis_key){

    return function(req,res,next){
        let key = redis_key;

        client.get(key,(err,data) => {
            if(err) res.status(500).json({error : "redis error"})
            
            if(data){
                res.status(200).json(JSON.parse(data))
                req.is_redis = true
               
            }else{
                req.redis_key = key
                next()
            }
        })
    }
}

// Delete cache
function cacheGeneralDelete(redis_key){

    return function(req,res,next){
        let key = redis_key
        client.del(key,(err,success) => {
            if(err) res.status(500).json({error : "redis error"})
            if(success){
                next()
            }else{
                next()
            }
        })
    }
}


// New Special Cache //

function cacheUniqueGet(redis_key){

    return function(req,res,next){
        let key = `${redis_key}_${req.body.unique}`
        client.get(key,(err,data) => {

            if(err) res.status(500).json({error : "redis error"})
            if(data){
                res.status(200).json(JSON.parse(data))
                req.is_redis = true
               

            }else{
                req.redis_key = key
                next()
            }
        })
    }
}



function cacheUniqueDelete(redis_key){

    return function(req,res,next){
        let key = `${redis_key}_${req.body.unique}`
        client.del(key,(err,success) => {
            if(err) res.status(500).json({error : "redis error"})
            if(success){
                next()
            }else{
                next()
            }
        })
    }
}







// Special Cache //

// Get cache
function cacheGet(redis_key){

    return function(req,res,next){
        let key = redis_key
        if(req.params.id){
            key = key + "_" + req.params.id
        }
        else if(req.body.id_user){

            key = key + '_' +req.body.id_user
        }


        client.get(key,(err,data) => {
            if(err) res.status(500).json({error : "redis error"})
            if(data){
                res.status(200).json(JSON.parse(data))
                req.is_redis = true
               
            }else{
                req.redis_key = key
                next()
            }
        })
    }
}

// Delete cache
function cacheUpdate(redis_key){

    return function(req,res,next){
        let key = redis_key
        if(req.body.id_user){
            key = key + '_' +req.body.id_user
        }else
        if(req.params.id){
            key = key + '_' +req.params.id
        }
        client.del(key,(err,success) => {
            if(err) res.status(500).json({error : "redis error"})
            if(success){
                console.log('redis cache delete')
                next()
            }
        })
        next()
    }
}




module.exports = {
    cacheSet,
    cacheGet,cacheUpdate, 
    cacheGeneralGet, cacheGeneralDelete,
    cacheUniqueGet, cacheUniqueDelete
}