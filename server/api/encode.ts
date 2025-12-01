import QRCode from 'qrcode'
import * as z from 'zod'

const QRRequestSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  width: z.number().min(50).max(1000).default(200),
  margin: z.number().min(0).max(10).default(1),
  color: z.object({
    dark: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, 'Invalid dark color hex code'),
    light: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, 'Invalid light color hex code'),
  }).default({
    dark: '#000000',
    light: '#FFFFFF',
  }),
})

async function generateQR(options: {
  text: string,
  width: number,
  margin: number,
  color: { dark: string, light: string }
}) {
  try {
    return await QRCode.toDataURL(options.text, { 
      width: options.width, 
      margin: options.margin,
      color: options.color
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

  const { message, width, margin, color } = parsedBody.data

  const qrCode = await generateQR({ text: message, width, margin, color })
  return qrCode
})
