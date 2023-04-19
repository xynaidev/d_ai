require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

const TG_BOT_NAME = process.env.TG_BOT_NAME;
const TG_BOT_ID = process.env.TG_BOT_ID;
const TG_BOT_MAINCHAT = process.env.TG_BOT_MAINCHAT;
const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN;

const bot = new TelegramBot(TG_BOT_TOKEN, { polling: true });

var server = require("./server.js");

var rateLimits = {};

bot.onText(/\/doomer (.+)/, async (msg, match) => {
  try {
    var rateLimited = await rateLimiter(msg);
    if (!rateLimited) {
      var rateLimitMessage = "❌ Rate limit hit";
      bot.sendMessage(msg.chat.id, rateLimitMessage, {
        reply_to_message_id: msg.message_id,
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      });
      return;
    }
    var slashCommand = getCommand(msg.text);
    if (slashCommand !== "/doomer") {
      return;
    }
    const responses = [
      "We are processing your inquiry and will respond as soon as possible. Your patience is appreciated.",
      "Hold tight, we're working on it!",
      "We are searching the cosmos for the answer to your query.",
      "Our digital minions are hard at work processing your question.",
      "Your question is so good, we needed to consult with the Oracle first.",
      "Hang tight, our AI is crunching numbers and analyzing data for you.",
      "We're working on your question like a chef works on a 3-star Michelin meal.",
      "Your question is important to us and we're giving it the attention it deserves.",
      "Our AI is taking a deep dive into the data to provide you with the best answer.",
      "We're running your question through our digital neural network for analysis.",
      "Our AI is working overtime to provide you with the most accurate answer.",
      "Our algorithms are working to decode your question and provide a precise response.",
    ];

    const index = Math.floor(Math.random() * responses.length);

    bot.sendMessage(msg.chat.id, responses[index], {
      reply_to_message_id: msg.message_id,
      parse_mode: "Markdown",
      disable_web_page_preview: true,
    });

    console.log("got doomer");
    var slashCommand = getCommand(msg.text);
    /*
      var generateVoice = await txt2txtInit(slashCommand, msg, match);
      if (!generateVoice) {
        return;
      } else {
        await txt2voice(slashCommand, msg, match);
      }
      */
    const model = slashCommand.slice(1);
    const interactionId = msg.message_id;
    const resp = msg.text.replace(/\n/g, " "); // the captured "whatever"
    let firstSpaceIndex = resp.indexOf(" ");
    let newPrompt = resp.slice(firstSpaceIndex + 1);
    const userId = await msg.from.id;
    const randomId = userId.toString() + msg.message_id.toString();
    const username = await msg.from.username;
    const userLinked = `tg://user?id=${userId}`;
    const userLinkedText = `[@${username}]` + `(${userLinked})`;

    // get text
    var [status, aiText, serverComment] = await server.doomer(
      newPrompt,
      model,
      userId,
      "telegram"
    );

    if (status == false) {
      bot.sendMessage(msg.chat.id, serverComment, {
        reply_to_message_id: msg.message_id,
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      });
      return;
    }

    // get voice

    var [status, filename, serverComment] = await server.processText(
      aiText,
      randomId,
      slashCommand,
      userId,
      "telegram"
    );

    console.log("check");
    console.log(status);
    console.log(serverComment);

    if (status == false) {
      bot.sendMessage(msg.chat.id, serverComment, {
        reply_to_message_id: msg.message_id,
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      });
    } else {
      bot.sendAudio(msg.chat.id, filename, {
        reply_to_message_id: msg.message_id,
        caption: "",
        parse_mode: "Markdown",
      });
    }
  } catch (e) {
    console.error(e);
  }
});

async function rateLimiter(msg) {
  console.log("----- CHECKING RATE LIMIT");
  console.log(rateLimits);
  const tgGroup = msg.chat.id;

  const now = Math.floor(Date.now());

  const baseLimit = {
    lastSendTime: now,
    lastMinuteTime: now,
    msgCount: 0,
  };

  if (!rateLimits[tgGroup]) {
    console.log("..............group not in yet, adding");
    rateLimits[tgGroup] = baseLimit;
    console.log(rateLimits);
    return true;
  }

  const limit = rateLimits[tgGroup];

  if (now - limit.lastSendTime < 1000) {
    console.log("............rate limited 1 msg per second");
    console.log(rateLimits);
    // less than 1 message per second
    return false;
  }

  if (now - limit.lastMinuteTime < 60000) {
    // less than 20 messages per minute
    if (limit.msgCount >= 20) {
      console.log("..............rate limited 20 msg per minute");
      console.log(rateLimits);
      return false;
    }
  } else {
    limit.lastMinuteTime = now;
    limit.msgCount = 0;
  }

  limit.msgCount++;
  limit.lastSendTime = now;
  limit.lastMinuteTime = now;

  rateLimits[tgGroup] = limit;

  return true;
}

function getCommand(string) {
  const parts = string.split(" ");
  return parts[0];
}
