import OpenAI from 'openai'
import dotenv from 'dotenv'
dotenv.config()

const configuration = {
  organization: process.env.OPENAI_ORGANIZATION_ID,
  apiKey: process.env.OPENAI_API_KEY
}
const openai = new OpenAI(configuration)
const model = 'gpt-3.5-turbo'

const getAssistantTextFromCompletion = (choices: OpenAI.Chat.Completions.ChatCompletion.Choice[]): string => {
  // get the last message from the assistant
  const assistantMessages = choices.filter(ch => {
    return ch.message.role === 'assistant'
  })
  const assistantText = assistantMessages[assistantMessages.length - 1].message.content

  if (typeof assistantText === 'undefined' || assistantText === null) return ''

  return assistantText
}

const getCompletion = async (text: string): Promise<string> => {
  const completion = await openai.chat.completions.create({
    messages: [{ role: 'system', content: text }],
    model,
    max_tokens: 100,
    temperature: 0
  }).catch(err => {
    console.log({ err })
  })

  if (typeof completion !== 'undefined') {
    if (completion.choices.length !== 0) {
      return getAssistantTextFromCompletion(completion.choices)
    }
  }
  return ''
}

export const getInputCorrection = async (text: string): Promise<string> => {
  const prompt = `Correct grammar of the given text.
    Must return the corrected text if there is any error.
    If there is no error, just return a random congratulation phrase, like: well done!, great!, excellent!.
    "${text}"`
  const completion = await getCompletion(prompt)
  return completion
}

export const createQuestion = async (subject: string): Promise<string> => {
  const prompt = `Make a question related with ${subject}`
  const completion = await getCompletion(prompt)
  return completion
}
