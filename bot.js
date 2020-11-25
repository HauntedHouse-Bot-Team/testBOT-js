require('dotenv').config()
const env = process.env

const Discord = require('discord.js')
const discordClient = new Discord.Client()

const date = new Date()

//ここからbotの本体部分

const adminId = '373846007219486721'

discordClient.on('ready', () => { //開始時のログ出力
    console.log(`${date.toLocaleString()} : Bot is ready`)
})

/* discordClient.on('ready', (msg) => {
    if (msg.author.bot) {
        return
    }
}
) */

discordClient.on('message', msg => {

    if (msg.content === 'Hello') {
        const messageSentence = "world!"
        const messageAutherByUsername = msg.author.username
        msg.reply(messageSentence)
        console.log(`${date.toLocaleString()} : ${meg.content} was sent to ${msg.author.username}.`)
    }

    if (msg.channel.id === '') {
        console.log(`${date.toLocaleString()} : ${msg.author.username} #${msg.channel.name} ${msg.content}`)
    }


    if (msg.content === "!shutdown") { //bot停止用コマンド
        if (msg.author.id === adminId) {
            console.log(`${date.toLocaleString()} : Bot will be stop.`)
            process.exit()
        } else {
            msg.reply('権限がありません。このコマンドは管理者用です。')
            console.log(`${date.toLocaleString()} : Unauthorized command: [${msg.content}] have been executed by ${msg.author.username}.`)
        }
    }
}
)

discordClient.login(env.DISCORD_BOT_TOKEN)

//終了