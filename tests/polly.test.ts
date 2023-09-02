import { describe, it, expect } from '@jest/globals'
import { generateSpeech } from '../src/polly'

describe('generateSpeech', () => {
  it('should exist', () => {
    expect(generateSpeech).toBeDefined()
  })
  it('should return a Buffer', async () => {
    const buffer = await generateSpeech('hello')
    expect(buffer instanceof Buffer).toBe(true)
  })
})
