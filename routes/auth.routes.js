const { Router } = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator')
const User = require('../models/User')
const router = Router()

// /api/auth/register
router.post(
  '/register',
  [
    check('email', 'Incorrect email').isEmail(),
    check('password', 'Length of password 6 character min').isLength({ min: 6 })
  ],
  async(req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Wrong data on sign in'
        })
      }

      const { email, password } = req.body

      const candidate = await User.findOne({ email })

      if (candidate) return res.status(400).json({ message: 'Username already exist' })

      const hashedPassword = await bcrypt.hash(password, 12)
      const user = new User({ email, password: hashedPassword })

      await user.save()

      res.status(201).json({ message: 'User created' })
    } catch (e) {
      console.log(e)
      res.status(500).json({ message: 'Something went wrong...' })
    }

  })// /api/auth/login
router.post(
  '/login',
  [
    check('email', 'Wrong Email').normalizeEmail().isEmail(),
    check('password', 'Wrong password').exists()
  ],
  async(req, res) => {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Wrong data on sign up'
        })
      }

      const { email, password } = req.body

      const user = await User.findOne({ email })

      if (!user) {
        return res.status(400).json({ message: 'User not found' })
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return res.status(400).json({ message: 'Wrong password, try again' })
      }

      const token = jwt.sign(
        { userId: user.id },
        config.get('jwtSecret'),
        { expiresIn: '1h' }
      )

      res.json({ token, userId: user.id })
      console.log(token, user.id)
    } catch (e) {

      res.status(500).json({ message: 'Something went wrong...' })
    }
  })

module.exports = router