import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express'

const app = express()
const port = process.env.PORT || 3004

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

const swaggerFile = require('./swagger-output.json')
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something broke!' })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
  console.log(`API Documentation available at http://localhost:${port}/api-docs`)
})
