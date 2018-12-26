const tmi = require("tmi.js");

const options = {
  options:{
    debug:true
  },
  connection:{
    reconnect:true
  },
  identity:{
    username: "primereminderbot1",
    password: "oauth:xmea5famfgp3khmxv6f2ztoywdqus2"
  },
  channels: ["#BandsWithLegends", "#tvgbadger", "#calebdmtg"]
};

const client = new tmi.client(options);

client.connect();

client.on("chat", function(channel, user, message, self){
  if(self) return;
  if(user.username==='bandswithlegends'){
    setTimeout(() => client.whisper("#bandswithlegends", "You sent a message"), 1.3e+4)
  }

})



client.on("subscription", (channel, username, method, message, user) => {
  if(method.prime){
    client.whisper("#bandswithlegends", "Hello, You subbed with Twitch Prime. If you'd like, I'll message you in 30 days to remind you to sub with Twitch Prime again. If not, simply message me back !stop and you will not receive any more messages from me.");
    // setTimeout(() => client.whisper(), 2.592e+9)
  }
})



//on subscription
//if(method.prime){
//client.message(self, Hello, I see you subbed with Twitch Prime. If you'd like, I'll message you in 30 days to remind you to sub with Twitch Prime again. If not, simply message me back !stop and you will not receive any more messages from me.
//setTimout(
//
//
//
//}
//
//

