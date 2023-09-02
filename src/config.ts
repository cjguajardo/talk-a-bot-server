import dotenv from 'dotenv'
dotenv.config()

const { PORT, AWS_REGION, AWS_COGNITO_USER_POOL_ID } = process.env

const getPort = (p: string | undefined): number => {
  const _port = PORT !== null || typeof PORT !== 'undefined' ? PORT : 3000

  if (typeof _port === 'string') {
    return parseInt(_port)
  } else if (typeof _port === 'undefined') {
    return 3000
  }
  return _port
}
export const port: number = getPort(PORT)

const getRegion = (r: string | undefined): string => {
  const _region = AWS_REGION !== null || typeof AWS_REGION !== 'undefined' ? AWS_REGION : 'us-east-1'

  if (typeof _region === 'string') {
    return _region
  } else if (typeof _region === 'undefined') {
    return 'us-east-1'
  }
  return _region
}
export const awsRegion: string = getRegion(AWS_REGION)

const getIdentityPoolId = (i: string | undefined): string => {
  const _identityPoolId = AWS_COGNITO_USER_POOL_ID !== null || typeof AWS_COGNITO_USER_POOL_ID !== 'undefined' ? AWS_COGNITO_USER_POOL_ID : ''

  if (typeof _identityPoolId === 'string') {
    return _identityPoolId
  } else if (typeof _identityPoolId === 'undefined') {
    return ''
  }
  return _identityPoolId
}
export const awsIdentityPoolId: string = getIdentityPoolId(AWS_COGNITO_USER_POOL_ID)

export default {
  port,
  awsRegion,
  awsIdentityPoolId
}
