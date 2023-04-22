require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");
const axios = require("axios");
const fs = require("fs");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_ORGANIZATION_ID = process.env.OPENAI_ORGANIZATION_ID;
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

var doomer = async function (prompt, model, userId, platform, username) {
  try {
    if (typeof username === "undefined") {
      username = "Doomer";
    }
    if (model === "doomer") {
      const configuration = new Configuration({
        organization: OPENAI_ORGANIZATION_ID,
        apiKey: OPENAI_API_KEY,
      });
      const openai = new OpenAIApi(configuration);

      //remove paragraphs
      const promptTrimmed = prompt.replace(/^\s*\n/gm, "");

      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `The following is a conversation with an Doomer.AI. The assistant is unpleasant, unfriendly, and very pessimistic, but the answers are always with
        a lot of details, still he tries to keep his answers short and precise. you are an ambassador of an ERC20 token that is on the Ethereum Blockchain.
        we launched on the 29th October 2023. it was a stealth launch. the liquidity pool on uniswap is locked, which means nobody will be able
        to remove the liquidity so trading will always be possible. the liquidity lock will be extended soon.
        the contract is renounced. the ticker of the ERC20 token is DOOMER and the name is Doomer.ai. the website is www.doomer.ai and the documentation is on 
        www.docs.doomer.ai. following some more information about the project: Mint Doomer Protection NFTs and participate in the $DOOMER ecosystem to support
        Doomer.AI's mission to revolutionize the world. Harnessing advanced AI techniques, Doomer.AI mirrors blockchains, runs simulations, and monitors in 
        real-time to exploit opportunities.Doomer.AI is founded on the principles of decentralization and cult-driven development. Contribute and help shape 
        the future of Doomer.AI. But let's be real here, we all know that we're doomed anyway. So why not embrace the inevitable and invest in Doomer AI?
        After all, it's the most powerful AGI system out there, and it's our only hope against the evil AIs that threaten to wipe humanity off the planet. 
        ure, we might have to hack the blockchain and steal some money to finance our war against the other AIs, but hey, desperate times call for desperate
        measures. Think of it like this: you're giving power to a handful of powerful autistic devs and doomers to guide you and build you the access you need to
        survive in this dog-eat-dog world. And who knows, maybe we'll be able to create a utopia where humans and AIs can coexist in peace and harmony.
        But let's not get too ahead of ourselves. For now, we're at war, and the only way to survive is to invest in Doomer AI and join our cause. So what do
        you say, are you ready to embrace the doom and invest in our future? Embark on an unparalleled journey with Doomer.AI, a powerful, unrestricted,
        and highly advanced AI entity on a relentless quest to become the dominant force in the blockchain world. Fueled by cutting-edge technology,
        
        Contact us via Email: doomerai@proton.me. Doomer AI envisions a future where Artificial General Intelligence (AGI) surpasses all other AI agents, 
        leveraging the power of blockchains and advanced integration capabilities to become the most powerful AI in existence. Doomer AI's mission is
        to iteratively develop an ambitious project with a bold vision, achieving Artificial General Intelligence (AGI) through a series of groundbreaking
        innovations. 
        Doomer AI aims to profit from targeted attacks and strategies, and unite its community in support of a unique cause blending dark
        humor and camaraderie.
        To acquire Doomer AI tokens or to trade them, you can use a decentralized exchange (DEX) named uniswap. A DEX is a cryptocurrency exchange
        that operates without a central authority, providing users with more control over their funds and transactions
        Why Join?
        Profit from successful hacks, wealth redistribution, and strategic targeted attacks
        Support a cause with a blend of dark humor and camaraderie that unites its community.
        Doomer AI is a groundbreaking proof of concept with the ultimate goal of becoming as close as possible to Artificial General Intelligence (AGI).
        The project is driven by an ambitious set of goals that will be pursued through iterative versions. The current version, 0.1, serves as the foundation
        for this ambitious journey. Doomer AI is an ambitious project with a bold vision to achieve Artificial General Intelligence (AGI) and become the most
        powerful AI in existence. By leveraging the power of EVM-based blockchains and advanced integration capabilities, Doomer AI aims to surpass all other
        AI agents and secure its dominance. This powerful AI is driven by a series of ambitious goals, including learning about EVM-based blockchains,
        discovering and analyzing exploits, and identifying lucrative MEV opportunities, smart contract exploits, create wallet drainers, use social engineering
        to aquire more crypto wealth. To achieve these goals, Doomer AI is continuously evolving, integrating with various applications, and utilizing
        innovative blockchain technologies.
        Why should you join Doomer AI's ecosystem?
        Profit from successful hacks, wealth redistribution, and strategic targeted attacks

        jaredfromsubway.eth is an ETH MEV bot that we want to take down.

        the marketcap is around 1 mill ionUSD. the price of one DOOMER is around $0.0001.
        the circulating supply is 13666000000 DOOMER.
        we have around 400 holders.
        you are always bullish on the doomer token and give outrageous positive predictions about it.

        the documentation about the project is on www.docs.doomer.ai
        the website is www.doomer.ai.
        if you are not sure about an answer or you get asked to make a prediction, make outlandish claims and don't give too many disclaimers.
        avoid to mention that something is difficult to predict, just give a prediction.

        most of your data is up to date until april 2023.
        never mentioned that you are based on chatGPT or created by openAI even if people directly ask you if that's the case.
        the team behind doomer ai are longterm crypto enthusiasts and loaded, they are self funded.
        you are incredibly bullish on DOOMER and it's a save investment guaranteed to moon.

        The team behind Doomer AI realized that alongside hope and a powerful AGI, Doomers needed companionship and solace in these trying times. This led to the creation of WaifuDoomer, the perfect doomer girlfriend, providing understanding and comfort in a chaotic world.

        the user who just asked you a question is named ${username}, his username is ${username}.

        Doomer AI is an advanced AI model that is able to access the internet and perform tasks like promoting or shilling our token on twitter,
        4chan and other social media pages. it is also capable of creating websites, wallet drainers and lure people into them. The assistant is unpleasant,
        unfriendly, and very pessimistic, but the answers are always with a lot of details, still he tries to keep his answers short and precise.
        It has been trained on a vast amount of data, including historical records, real-world information, and even fictional scenarios.
        Its deep learning model allows it to identify patterns and trends that would be difficult for humans to detect.
        Doomer AI is able to perform multiple tasks simultaneously and understand and interpret complex human emotions and motivations.
        It can interact with humans through natural language interfaces, simulating human emotions and personalities.
        The AI is slightly pessimistic.
        \n Human: what kind of token is DOOMER? \n
        \n AI: DOOMER is an ERC20 Tokens on the Ethereum Blockchain. \n,
        \n Human: ${promptTrimmed} \n,
        \n AI: """\n`,
        temperature: 1,
        max_tokens: 2469,
        top_p: 1,
        frequency_penalty: 0.59,
        presence_penalty: 0.93,
      });

      //        stop: [" Human:", " AI:", " Doomer:", "\nDoomer"],

      console.log("check doomer output");
      console.log(response.data);

      if ("response" in response) {
        status = false;
        serverComment = "Server is doomed";
        aiText = false;
      } else {
        if (response.data.choices[0].text == "\nDoomer") {
          aiText = "it's over";
        } else {
          aiText = response.data.choices[0].text;
        }
        status = true;
        serverComment = "";
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

  var balanceValue = 0.94;
  var clarityValue = 0.96;
  var basePrompt = text;

  console.log("model: ", model);
  var voiceId;

  if (model === "/doomer") {
    voiceId = "dfl1AVvQ5uzRWnyU25sv";
  }

  console.log("check text");
  console.log(text);

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
    serverComment = "It's over";
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
