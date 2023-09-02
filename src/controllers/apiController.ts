import * as Chat from '../chat'
import * as Polly from '../polly'

interface ProcessTextResponse {
  success: boolean
  error?: string
  data?: {
    correctedText: string
    correctedTextAudio: string
    question: string
    questionAudio: string
  }
}

export const processText = async (input: string, subject: string): Promise<ProcessTextResponse> => {
  try {
    // correct text
    const correctedText = await Chat.getInputCorrection(input)
    // create question
    const question = await Chat.createQuestion(subject)
    // generate audio for corrected text
    const _correctedTextAudio = await Polly.generateSpeech(correctedText)
    const correctedTextAudioBase64 = await Polly.getBase64Audio(_correctedTextAudio.data)
    // generate audio for new question
    const _questionAudio = await Polly.generateSpeech(question)
    const questionAudioBase64 = await Polly.getBase64Audio(_questionAudio.data)

    return {
      success: true,
      data: {
        correctedText,
        correctedTextAudio: correctedTextAudioBase64,
        question,
        questionAudio: questionAudioBase64
      }
    }
  } catch (err) {
    let message = ''
    if (err === null || typeof err === 'undefined') message = 'ERROR'
    else {
      message = Object.values(err).join(' ')
    }
    return {
      success: false,
      error: message
    }
  }
}
