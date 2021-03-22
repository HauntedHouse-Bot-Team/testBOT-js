require('dotenv').config()
const env = process.env

const Discord = require('discord.js')
const discordClient = new Discord.Client()

const date = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })

const axios = require('axios')

const fs = require('fs')

//ここからbotの本体部分

//権限周り
const ownerId = '369876595051069440'
const adminRoles = []

const mankoChannelId = ''

const commandPrefix = '!'
const commandPattern = /[^\s]+/g
const useridPattern = /[0-9]+/

discordClient.on('ready', () => {
    console.log(`${date} : Bot is ready`)
})

discordClient.on('message', msg => {

    // 画像のロギング
    if (msg.attachments.first | !msg.author === ownerId) {
        const attachmentFileUrls = msg.attachments.map(attachment => attachment.url)
        const attachmentFileNames = msg.attachments.map(attachment => attachment.name)
        for (let index = 0; index < attachmentFileNames.length; index++) {
            let snowflake = Discord.SnowflakeUtil.generate()
            let fileName = './images/' + `${snowflake}` + '-' + `${attachmentFileNames[index]}`

            axios.get(attachmentFileUrls[index], { responseType: 'arraybuffer' })
                .then(
                    response => {
                        fs.writeFileSync(fileName, Buffer.from(response.data), 'binary')
                        console.log(`${date} : ${fileName} was saved.`)
                    }
                )
        }
    }


    if (msg.content.startsWith(commandPrefix)) {
        const userCommand = msg.content.match(commandPattern)

        if (userCommand[0] == '!卒業' | useridPattern.test(userCommand[1])) {
            msg.channel.send('コマンドが未定義です。')
        }

        if (userCommand[0] == '!manko' | userCommand[0] == '!manco') {
            msg.channel.send('oh!manko!')
        }

    }

}

)

discordClient.login(env.DISCORD_BOT_TOKEN)