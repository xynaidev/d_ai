require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");
const axios = require("axios");
const fs = require("fs");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_ORGANIZATION_ID = process.env.OPENAI_ORGANIZATION_ID;
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

var doomer = async function (prompt, model, userId, platform) {
  try {
    if (model === "doomer") {
      const configuration = new Configuration({
        organization: OPENAI_ORGANIZATION_ID,
        apiKey: OPENAI_API_KEY,
      });
      const openai = new OpenAIApi(configuration);

      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `The following is a conversation with an Doomer.AI. The assistant is unpleasant, unfriendly, and very pessimistic, but the answers are always with a lot of details. \n\nDoomer.AI is a fictional Chatbot, advanced AI model that is capable of predicting future events with unprecedented accuracy. It has been trained on a vast amount of data, including historical records, real-world information, and even fictional scenarios. Its deep learning model allows it to identify patterns and trends that would be difficult for humans to detect. Doomer.AI is able to perform multiple tasks simultaneously and understand and interpret complex human emotions and motivations. It can interact with humans through natural language interfaces, simulating human emotions and personalities. The AI is slightly pessimistic and is designed to help prevent negative outcomes, by warning of potential risks. The system is also transparent and accountable, by implementing a decentralized autonomous organization (DAO) to govern it and a smart contract on a blockchain. This ensures that its predictions and recommendations are aligned with the interests of the community and that it is transparent and accountable.\n\nINCLUDE Disclaimer: Due to security concerns, the results, events, and statements presented by Doomer.AI may be altered. But API acess provide real outcome. \n\nAI: My name is Doomer.AI, but you can call me Doomer if you like. I'm here to advise and assess risks in the future so that we can make better decisions today.\n
          
          \n Human: ${prompt} \n`,
        temperature: 1,
        max_tokens: 2469,
        top_p: 1,
        best_of: 3,
        frequency_penalty: 0.59,
        presence_penalty: 0.93,
        stop: [" Human:", " AI:"],
      });

      console.log("check doomer output");
      console.log(response.data);

      if ("response" in response) {
        status = false;
        serverComment = "Server is doomed";
        aiText = false;
      } else {
        returnText = response.data.choices[0].text;
        status = true;
        serverComment = "";
        aiText = returnText.split("AI:")[1];
      }

      console.log("check text");
      console.log(aiText);

      return [status, aiText, serverComment];
    }
  } catch (e) {
    console.error(e);
    var status = false;
    var aiText = false;
    var serverComment = "Server is doomed";
    return [status, aiText, serverComment];
  }
};

var processText = async function (text, randomId, model, userId, platform) {
  var status;
  var filename;
  var serverComment;

  var balanceValue = 1;
  var clarityValue = 1;
  var basePrompt = text;

  console.log("model: ", model);
  var voiceId;

  if (model === "/doomer") {
    voiceId = "dfl1AVvQ5uzRWnyU25sv";
  }

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
  const data = {
    text: basePrompt,
    voice_settings: {
      stability: balanceValue,
      similarity_boost: clarityValue,
    },
  };

  console.log("check data");
  console.log(data);

  const config = {
    headers: {
      "xi-api-key": ELEVENLABS_API_KEY,
      "Content-Type": "application/json",
    },
    responseType: "arraybuffer",
  };

  try {
    console.log("CHECK REQUEST");
    const response = await axios.post(url, data, config);

    //GENERATE FILE NAME

    const words = basePrompt.split(" ");
    const numWords = Math.min(5, words.length);
    const outputString = words.slice(0, numWords).join(" ");

    const baseName = "'doomer.ai - " + outputString + "'";

    var outputFile = `./audiofiles/${baseName}.mp3`;

    console.log("baseName", baseName);
    console.log("outputFile: ", outputFile);

    console.log("BASE NAME");
    console.log(baseName);
    var fileNameSaved = await saveAudio(response.data, outputFile);

    status = fileNameSaved;
    filename = outputFile;
    serverComment = "";
  } catch (error) {
    console.error(error);
    status = false;
    filename = false;
    serverComment = "❌ Server overloaded or offline";
    return [status, filename, serverComment];
  }
  return [status, filename, serverComment];
};

async function saveAudio(data, outputFile) {
  try {
    fs.writeFileSync(outputFile, data);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

module.exports.doomer = doomer;
module.exports.processText = processText;
