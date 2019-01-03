const db = require("./mongodb");
const thirtyDaysInMilliseconds = 1000*60;
const oneHourInMilliseconds = 1000*5;

exports.findSubByTime = async function(interval){
  try{
    const minSubTime = Date.now() - thirtyDaysInMilliseconds;
    return await db.Sub.find({lastSubbed:{$gte:minSubTime, $lte:(minSubTime+interval)}})
  } catch(err){
    return err;
  }
}

exports.findSub = async function(username){
  try{
    return await db.Sub.findOne({username});
  } catch(err){
    return err;
  }
}

exports.createSub = async function(username, channel, lastSubbed,  blacklist){
  try{
    console.log("in create sub: ", username, lastSubbed, channel, blacklist)
    return await db.Sub.create({ username, lastSubbed, channel, blacklist});
  } catch (err){
    return err;
  }
}

exports.changeBlackList = async function(username, blacklist){
  try{
    return await db.Sub.findOneAndUpdate({username}, {blacklist})
  } catch(err){
    return err;
  }
}

exports.reSubbed = async function(username, channel){
  try{
    return await db.Sub.findOneAndUpdate({username}, {channel, lastSubbed: Date.now()})
  } catch(err){
    return err;
  }
}



module.exports = exports;