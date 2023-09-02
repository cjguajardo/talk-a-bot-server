import { Router } from 'express'
import { checkKey } from '../auth/key'
import { processText } from '../controllers/apiController'

const router = Router()

const error = (status: number, msg: string): Error => {
  const err = new Error(msg)
  err.name = `${status}`

  return err
}

router.use('/api', (req, res, next) => {
  console.log(req.path)
  const key = req.headers['x-api-key']

  if (key === null || typeof key === 'undefined' || key === '') {
    return next(error(400, 'API key is missing'))
  }

  if (!checkKey(key as string)) {
    return next(error(401, 'API key is invalid'))
  }

  next()
})

router.post('/process-text', (req, res) => {
  const { text, subject } = req.body
  if (text === null || typeof text === 'undefined' || text === '') {
    return res.status(400).send('Text is missing')
  }

  let _subject = subject
  if (subject === null || typeof subject === 'undefined' || subject === '') {
    _subject = 'lifestyle'
  }

  processText(text, _subject).then(response => {
    if (response.success) {
      return res.status(200).json(response.data)
    } else {
      return res.status(400).send(response.error)
    }
  }).catch(err => {
    console.log('processText', { err })
    return res.status(500).send('Internal Server Error')
  })
})

// fallback route
router.use('*', (req, res) => {
  res.status(404).send('Ups!. Not Found')
})

export default router
