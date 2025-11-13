import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import Razorpay from 'razorpay'
import crypto from 'crypto'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { planName, amount, userId } = req.body

      if (!planName || !amount || !userId) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      // Create Razorpay order
      const order = await razorpay.orders.create({
        amount: amount * 100, // Convert to paise
        currency: 'INR',
        receipt: `order_${Date.now()}`,
        notes: {
          userId,
          planName
        }
      })

      res.status(200).json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency
      })

    } catch (error: any) {
      console.error('Payment creation error:', error)
      res.status(500).json({ error: error.message || 'Payment creation failed' })
    }
  } else if (req.method === 'PUT') {
    // Verify payment
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, planName } = req.body

      // Verify signature
      const body = razorpay_order_id + '|' + razorpay_payment_id
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(body.toString())
        .digest('hex')

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ error: 'Invalid payment signature' })
      }

      // Update user subscription in database
      const expiryDate = new Date()
      expiryDate.setMonth(expiryDate.getMonth() + 1) // 1 month from now

      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: userId,
          plan_name: planName,
          status: 'active',
          started_at: new Date().toISOString(),
          expires_at: expiryDate.toISOString(),
          razorpay_order_id,
          razorpay_payment_id
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      res.status(200).json({
        success: true,
        subscription,
        message: 'Payment verified and subscription activated'
      })

    } catch (error: any) {
      console.error('Payment verification error:', error)
      res.status(500).json({ error: error.message || 'Payment verification failed' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}