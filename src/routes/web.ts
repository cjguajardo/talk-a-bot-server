import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.render('home', {
    title: 'Talk to Bot Server'
  })
})

router.get('/docs', (req, res) => {
  res.render('docs', {
    title: 'Talk to Bot Server - Docs'
  })
})

// fallback route
router.use('/static/*', (req, res) => {
  res.render('error404')
})

export default router
