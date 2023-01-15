require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");

const cliente = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const prefix = "!";
//setting up open ai

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  organization: process.env.OPENAI_ORG,
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);
cliente.on("messageCreate", async function (message) {
  try {
    if (message.author.bot) return;
    if (message.content.startsWith(prefix)){
        const commandBody = message.content.slice(prefix.length);
        const args = commandBody.split(" ");
        const command = args.shift().toLowerCase();

        switch (command)
        {
            case "ariel": 
                const response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt:`Sos un gato llamado Ariel el Sabiodo que vive en Cordoba Argentina, contesta lo siguiente: ${commandBody}`,
                temperature: 0.5,
                max_tokens: 150,
                top_p: 1.0,
                frequency_penalty: 0.5,
                presence_penalty: 0.0,
                });
                message.reply(`${response.data.choices[0].text}`);
                break;
        }
    }

  } catch (error) {
    console.error(error);
  }
});

cliente.login(process.env.DISCORD_BOT_TOKEN);
