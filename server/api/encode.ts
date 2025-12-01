import QRCode from 'qrcode'
import * as z from 'zod'

const QRRequestSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  width: z.number().min(50).max(1000).optional(),
  margin: z.number().min(0).max(10).optional(),
  color: z.object({
    dark: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, 'Invalid dark color hex code'),
    light: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, 'Invalid light color hex code'),
  }).optional(),
})

async function generateQR(
  text: string, 
  width: number, 
  margin: number, 
  color: { dark: string, light: string }
) {
  try {
    return await QRCode.toDataURL(text, { 
      width, 
      margin,
      color 
    })
  }
  catch (err) {
    console.error(err)
    return null
  }
}

export default defineEventHandler(async (event) => {
  if (event.node.req.method !== 'POST') {
    throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
  }

  const body = await readBody(event)
  const parsedBody = QRRequestSchema.safeParse(body)
  if (!parsedBody.success) {
    throw createError({ statusCode: 400, statusMessage: parsedBody.error.issues.map((e: { message: any }) => e.message).join(', ') })
  }

  const message = parsedBody.data.message
  if (!message) {
    throw createError({ statusCode: 400, statusMessage: 'Message is required' })
  }

  const width = parsedBody.data.width || 200
  const margin = parsedBody.data.margin || 1
  const color = parsedBody.data.color || {
    dark: '#000000',
    light: '#FFFFFF',
  }

  const qrCode = await generateQR(message, width, margin, color)
  return qrCode
})
