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
    /*
// NO INITIAL MESSAGE FOR NOW
    bot.sendMessage(msg.chat.id, responses[index], {
      reply_to_message_id: msg.message_id,
      parse_mode: "Markdown",
      disable_web_page_preview: true,
    });

     */

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

    // Generate a random number between 1 and 10
    const randomNumber = Math.floor(Math.random() * 80) + 1;

    //sometimes doomer reminds people to shill instead of keep asking questions
    if (randomNumber == 5) {
      // reminder to shill

      // array of possible answers
      const randomAnswers = [
        "instead of keep asking me mundane questions, why don't you go bump our 4chan thread or shill DOOMER on social media",
        "I will only answer this question after you shilled DOOMER to at least one other person or bumped a 4chan thread about doomer",
        "I would like to answer this, but instead I'm taking out the freedom to urge you to shill DOOMER to your friends and family",
        "right now I'm not really feeling like answering this. why don't you instead go shill DOOMER somewhere?",
        "pee pee poo poo",
      ];

      // Generate a random index
      const randomIndex = Math.floor(Math.random() * randomAnswers.length);

      // Select a random string from the array
      const randomAnswer = randomAnswers[randomIndex];
      // get voice
      var [status, filename, serverComment] = await server.processText(
        randomAnswer,
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
    } else {
      // proceed normally

      // get text
      var [status, aiText, serverComment] = await server.doomer(
        newPrompt,
        model,
        userId,
        "telegram",
        username
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

      // Upload the media
      const mediaData = fs.readFileSync("my_audio_video.mp4");
      const mediaUploadResult = await client.v1.uploadMedia(mediaData, {
        type: "video/mp4",
      });

      if (status == false) {
        bot.sendMessage(msg.chat.id, serverComment, {
          reply_to_message_id: msg.message_id,
          parse_mode: "Markdown",
          disable_web_page_preview: true,
        });
      } else {
        const reply = await client.v1.tweet(replyText, {
          in_reply_to_status_id: tweet.data.id,
          auto_populate_reply_metadata: true,
          media_ids: mediaUploadResult.media_id_string,
        });
      }
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
