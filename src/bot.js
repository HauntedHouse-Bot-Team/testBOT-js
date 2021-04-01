require('dotenv').config()
const env = process.env

//Discordライブラリ
const Discord = require('discord.js')
const discordClient = new Discord.Client()

/*
const Nextcloud = require('nextcloud-node-client')
const nextcloudClient = new Nextcloud.Client()
*/

const axios = require('axios')
const fs = require('fs')

//ここからbotの本体部分

//コマンドの設定
const commandPrefix = '!'
const commandPattern = /[^\s]+/g
const useridPattern = /[0-9]+/
const discordImageURL = /^https?:\/\/([a-z]{1,}\.)?(discordapp\.com)(\/(.*)|\?(.*)|$)/
//正規表現まわり

//検閲用APIのエンドポイント
const inspectionEndpointBase = 'http://127.0.0.1:5000'
const inspectionEndpointPath = '/inspection'
const inspectionEndpoint = inspectionEndpointBase + inspectionEndpointPath

discordClient.on('ready', () => {
    console.log(`${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })} : [INFO] Bot is ready`)
})

discordClient.on('message', msg => {

    // 画像のロギング
    if (msg.attachments.first) {
        (async () => {
            const attachmentFileURLs = msg.attachments.map(attachment => attachment.url)
            const attachmentFileNames = msg.attachments.map(attachment => attachment.name)
            for (let index = 0; index < attachmentFileNames.length; index++) {
                const imageURL = attachmentFileURLs[index]
                const snowflake = Discord.SnowflakeUtil.generate()
                const fileExtension = attachmentFileNames[index].split('.').pop()
                const fileName = snowflake + '.' + fileExtension
                const filePath = './images/' + `${snowflake}` + '.' + fileExtension

                try {
                    const response = await axios.get(imageURL, { responseType: 'arraybuffer' })
                    fs.writeFileSync(filePath, Buffer.from(response.data), 'binary')
                    /*
                    const nextcloudFolder = await nextcloudClient.getFolder("/bot/images")
                    await nextcloudFolder.createFile(fileName, Buffer.from(response.data))
                    */
                } catch (error) {
                    if (error.response) {
                        console.log(`${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })} : [ERROR] Image download was failture. ${error.response.status} ${error.response.statusText}`)
                    }
                }

                try {
                    const inspectionImage = await axios.post(inspectionEndpoint, {
                        url: `${imageURL}`,
                        fileName: `${fileName}`
                    })
                    const result = inspectionImage.data.inspectionResult
                    if (result <= 10) {
                        await msg.delete()
                        console.log(`${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })} : [INFO] Image was deleted.`)
                    } else {
                        console.log(`${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })} : [INFO] inspection number ${result}`)
                    }
                } catch (error) {
                    if (error.response) {
                        console.log(`${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })} : [ERROR] Image inspection was failture. ${error.response.status} ${error.response.statusText}`)
                    } else {
                        console.log(error)
                    }
                }

            }
        })()
    }


    if (msg.content.startsWith(commandPrefix)) {
        const userCommand = msg.content.match(commandPattern)
        if (userCommand[0] === '!test') {
            msg.channel.send('Bot is running.')
        } else if (userCommand[0] === '!blacklist') {
            if (userCommand[1] === 'add') {
                if (discordImageURL.test(userCommand[2])) {
                    
                }
            }

        }
    }


}
)

const checkEnviroment = () => {
    if (env.NODE_ENV === 'production') {
        return env.DISCORD_BOT_TOKEN
    } else if (env.NODE_ENV === 'staging') {
        return env.DISCORD_BOT_TOKEN
    } else if (env.NODE_ENV === 'dev') {
        return env.DISCORD_BOT_DEV_TOKEN
    } else {
        return env.DISCORD_BOT_DEV_TOKEN
    }
}

discordClient.login(checkEnviroment())