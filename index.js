const tmi = require("tmi.js");
const {password} = require("./password");
const {createSub, changeBlackList, reSubbed, findSub, findSubByTime} = require('./handlers');

// const thirtyDaysInMilliseconds = 2.592e+9;
// const oneHourInMilliseconds = 3.6e+6;

//testing times
const thirtyDaysInMilliseconds = 1000*60;
const oneHourInMilliseconds = 1000*5;

// possible messages
const unknownMessage = "Sorry, couldn't understand your message. Use !info, !contact, !start, or !stop";

//connecting to twitch client
const options = {
  options:{
    debug:true
  },
  connection:{
    reconnect:true
  },
  identity:{
    username: "primereminderbot1",
    password: password
  },
  channels: ["#BandsWithLegends"]
};

const client = new tmi.client(options);

client.connect();

// See when someone subscribes with twitch prime
// client.on("subscription", (channel, username, method, message, user) => {
  // if(method==="prime"){
client.on("chat", async (channel, user, message, self) => {
  const {username} = user;
  let foundSub = await findSub(username);
  let foundSubUserName = foundSub ? foundSub.username : undefined;
  if(message==="prime"){
    if(foundSubUserName && foundSub.blacklist){
      return null;
    } else if(foundSubUserName && !foundSub.blacklist){
      reSubbed(username, channel)
        .then(sub => {
          console.log("Resubbed :", sub)
          client.whisper(username, `Thanks, ${username}, for subscribing with Twitch Prime again. Counter reset for 30 days.`)
        })
        .catch(err => console.log("Error in Resub: ", err))
    } else {
      createSub(username, channel, Date.now(), false)
        .then(sub => {
          console.log("new sub:", sub)
          client.whisper(username, "Hello, You subbed with Twitch Prime. If you'd like, I'll message you in 30 days to remind you to sub with Twitch Prime again. If not, simply message me back !stop and you will not receive any more messages from me.");
        })
        .catch(err => console.log("Error in new sub:", err));
    }
  }
})

client.on("whisper", async (from, userstate, message, self) => {
  if(self) return;
  const {username} = userstate
  if(message === '!info') {
    client.whisper(username, "Hello, I'm a bot made to help people manage their Twitch Prime subscriptions. People often forget who or when they subscribed to, so I just give them a little reminder")
  } else if(message === '!contact'){
    client.whisper(username, "Contact the maintainer of this bot through http://www.bandswithlegends.com/ , or @BandsWithLegends on Twitch, Twitter, Youtube, or Discord")
  } else if(message === '!stop'){
    changeBlackList(username, true)
      .then(sub => {
        client.whisper(sub.username, "Service Stopped. If you'd like to restart service message me !start ")
      })
      .catch(err => console.log("Blacklist change error: ", err))
  } else if(message ==='!start'){
    changeBlackList(username, false)
      .then(sub => {
        client.whisper(sub.username, "Service started")
      })
      .catch(err => console.log("Blacklist change error: ", err))
  } else {
    client.whisper(username, unknownMessage)
  }
})

// checks if a date is between 1 month and 1 month + 1 hour old.
const oneMonthOld = dateNumber => (dateNumber + thirtyDaysInMilliseconds) <= Date.now() && Date.now() <= (dateNumber + thirtyDaysInMilliseconds + oneHourInMilliseconds);

// formats channel name in database to channel name in link
const formatChannelName = channel => channel[0] ==="#" ? channel.slice(1) : channel

// every hour check to see whose re-subscription is available
function checkDatabase(){
  console.log("checking database: ", Date.now());
  findSubByTime(oneHourInMilliseconds)
    .then(availableSubs => {
      console.log("availableSubs: ", availableSubs)
      if(availableSubs.length >= 0) {
        availableSubs.forEach(user => {
          const {blacklist, username, channel} = user;
          if (!blacklist) {
            const channelName = formatChannelName(channel);
            client.whisper(username, `Hey ${username}, your twitch prime sub is available. Last month you subbed to ${channelName}. If you'd like to sub to them again go to https://www.twitch.tv/${channelName} `)
          }
        })
      }
    })
    .catch(err => console.log("Error in check database: ", err))
}

setInterval(() => checkDatabase(), oneHourInMilliseconds);

module.exports = {oneHourInMilliseconds, thirtyDaysInMilliseconds, checkDatabase, oneMonthOld, formatChannelName};




