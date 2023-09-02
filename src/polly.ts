import { Polly, SynthesizeSpeechCommand, SynthesizeSpeechOutput } from '@aws-sdk/client-polly'
import { fromEnv } from '@aws-sdk/credential-providers'
import { awsRegion } from './config'
import fs from 'fs'
import CryptoJS from 'crypto-js'

const client = new Polly({
  region: awsRegion,
  credentials: fromEnv()
})

export const VOICES_IDS = {
  FEMALE: ['Joanna', 'Kendra', 'Kimberly', 'Salli', 'Ivy'],
  MALE: ['Joey', 'Justin', 'Matthew']
}
export interface SpeechError {
  error: string
}
export interface SpeechOutput {
  success: boolean
  error?: SpeechError | undefined
  data?: SynthesizeSpeechOutput | undefined
}

const speechOutputError = (error: string): SpeechOutput => {
  return { success: false, error: { error } }
}

export const generateSpeech = async (text: string): Promise<SpeechOutput> => {
  const params = {
    Engine: 'standard',
    LanguageCode: 'en-US',
    OutputFormat: 'mp3',
    Text: text,
    TextType: 'text',
    VoiceId: 'Joanna'
  }

  const command = new SynthesizeSpeechCommand(params)

  try {
    const response = await client.send(command).catch(error => {
      console.log('generateSpeech', { error })
      return null
    })
    if (typeof response === 'undefined' || response === null) {
      return speechOutputError('UNDEFINED_RESPONSE')
    } else {
      console.log('HAS_RESPONSE', { response })
      if (response === null) return speechOutputError('NULL_RESPONSE')
      if (typeof response.AudioStream === 'undefined') {
        return speechOutputError('UNDEFINED_AUDIO_STREAM')
      }

      return { success: true, data: response }
    }
  } catch (err) {
    let message = ''
    if (err === null || typeof err === 'undefined') message = 'ERROR'
    else {
      message = Object.values(err).join(' ')
    }
    return speechOutputError(message)
  }
}

const writeStreamToFile = async (data: SynthesizeSpeechOutput, filePath: string): Promise<string> => {
  const stream = data.AudioStream as NodeJS.ReadableStream
  return await new Promise((resolve, reject) => {
    const fileStream = fs.createWriteStream(filePath)
    stream.pipe(fileStream)
    stream.on('end', () => {
      const base64 = fs.readFileSync(filePath, 'base64')
      resolve(base64)
    })
    stream.on('error', (err: any) => {
      reject(err)
    })
  })
}

export const getBase64Audio = async (audio: SynthesizeSpeechOutput | undefined): Promise<string> => {
  if (typeof audio === 'undefined') return ''
  if (typeof audio.AudioStream === 'undefined') return ''
  let mimeType = ''
  let base64 = ''

  try {
    const randomNumber = Math.floor(Math.random() * 1000000)
    const fileName = CryptoJS.SHA256('audio_' + randomNumber.toString()).toString()

    base64 = await writeStreamToFile(audio, fileName)
    fs.unlinkSync(fileName)

    console.log({ base64 })
    mimeType = audio.ContentType as string

    return `data:${mimeType};base64,${base64}`
  } catch (err) {
    console.log({ err })
  }
  return ''
}
