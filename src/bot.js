require('dotenv').config()
const env = process.env

//Discordライブラリ
import Discord from "discord.js";

const discordClient = new Discord.Client()

//Nextcloudライブラリ

const date = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })

import { axios } from "axios"

import { fs } from "fs";

//ここからbotの本体部分

//権限周り
const ownerId = '369876595051069440'
const isDev = true
const disabledChannel = ['824931077067112469'] //テスト鯖の'botテスト_disnabled'チャンネル
const protectedUser = ['369876595051069440',]

//コマンドの設定
const commandPrefix = '!'
const commandPattern = /[^\s]+/g
const useridPattern = /[0-9]+/

//検閲用APIのエンドポイント
const inspectionEndpointBase = 'http://127.0.0.1:5000'
const inspectionEndpointPath = '/inspection'
const inspectionEndpoint = inspectionEndpointBase + inspectionEndpointPath

discordClient.on('ready', () => {
    console.log(`${date} : Bot is ready`)
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
                const filePath = './images/' + `${snowflake}` + '.' + fileExtension
                try {
                    const response = await axios.get(imageURL, { responseType: 'arraybuffer' })
                    fs.writeFileSync(filePath, Buffer.from(response.data), 'binary')
                } catch (error) {
                    console.log(error)
                }
                // const response = await axios.get(imageURL, { responseType: 'arraybuffer' })

                const inspectionImage = await axios.post(inspectionEndpoint, {
                    url: `${imageURL}`
                })
                const result = inspectionImage.data.inspectionResult
                if (!result) {
                    await msg.delete()
                    console.log(`${date} : Image was deleted.`)
                }
            }
        })()
    }

}
)

if (isDev) {
    var DISCORD_TAKEN = env.DISCORD_BOT_DEV_TOKEN
} else {
    var DISCORD_TAKEN = env.DISCORD_BOT_TOKEN
}

discordClient.login(DISCORD_TAKEN)