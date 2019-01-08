const db = require("./mongodb.js");
const thirtyDaysInMilliseconds = 2.592e+9;
const oneDayInMilliseconds = 8.64e+7;
const oneHourInMilliseconds = 3.6e+6;

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
    const sub = await db.Sub.findOneAndUpdate({username}, {channel, lastSubbed: Date.now()})
    console.log("in resubbed: ", sub)
    return sub;
  } catch(err){
    return err;
  }
}

exports.setLastSubbed = async function(username, time){
  try{
    let lastSubbed = Date.now();
    if(parseInt(time)>=1 && parseInt(time) <=30){
      // user can set
      lastSubbed = Date.now() - (oneDayInMilliseconds * parseInt(time));
    }
    return await db.Sub.findOneAndUpdate({username}, {lastSubbed})
  } catch(err){
    return err;
  }
}



module.exports = exports;