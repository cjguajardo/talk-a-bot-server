import { describe, it, expect } from '@jest/globals'
import config from '../src/config'
import dotenv from 'dotenv'
dotenv.config()

describe('port', () => {
  it('should be 8080 when undefined or empty', () => {
    expect(config.port).toBe(8080)
  })
  it('should return a number', () => {
    expect(typeof config.port).toBe('number')
  })
})

describe('region', () => {
  it('should return a string', () => {
    expect(typeof config.awsRegion).toBe('string')
  })
  it('should match xx-xxxx-#', () => {
    expect(config.awsRegion).toMatch(/^[a-z]{2}-[a-z]{4}-\d$/)
  })
})

describe('identityPoolId', () => {
  it('should return a string', () => {
    expect(typeof config.awsIdentityPoolId).toBe('string')
  })
  it('should match us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', () => {
    expect(config.awsIdentityPoolId).toMatch(/^us-east-1:[a-z0-9-]{36}$/)
  })
})
