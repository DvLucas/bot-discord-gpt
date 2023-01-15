require("dotenv").config()

const {Client, GatewayIntentBits} = require("discord.js");

const cliente = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

//setting up open ai

const {Configuration, OpenAIApi} = require("openai");

const configuration = new Configuration({
    organization:process.env.OPENAI_ORG,
    apiKey:process.env.OPENAI_KEY
})
const openai = new OpenAIApi(configuration)

cliente.on('messageCreate', async function (message){
    try {
        if (message.author.bot) return;
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt:  `Hey dame una respuesta sobre esto : ${message.content}`,
            temperature: 0.5,
            max_tokens: 150,
            top_p: 1.0,
            frequency_penalty: 0.5,
            presence_penalty: 0.0
          });

        message.reply(`${response.data.choices[0].text}`)
    } catch (error) {
        console.error(error)
    }
})

cliente.login(process.env.DISCORD_BOT_TOKEN);