const db = require("mongoose");

exports.findSub = async function(username){
  try{
    return await db.Sub.findOne({username});
  } catch(err){
    return err;
  }
}

exports.createSub = async function(username, lastSubbed = Date.now(), channel, blacklist = false){
  try{
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



modules.exports = exports;