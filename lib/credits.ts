// Credit system utilities
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function deductCredits(
  userId: string,
  amount: number,
  description: string,
  referenceId?: string,
  referenceType?: string
): Promise<{ success: boolean; newBalance: number; error?: string }> {
  try {
    // Get current balance
    const { data: creditData, error: fetchError } = await supabase
      .from('user_credits')
      .select('balance')
      .eq('user_id', userId)
      .single()

    if (fetchError) {
      // Create credit record if doesn't exist
      const { error: createError } = await supabase
        .from('user_credits')
        .insert({
          user_id: userId,
          balance: 100 - amount,
          lifetime_earned: 100,
          lifetime_spent: amount
        })
      
      if (createError) throw createError

      // Log transaction
      await supabase.from('credit_transactions').insert({
        user_id: userId,
        amount: -amount,
        transaction_type: 'deduction',
        description,
        reference_id: referenceId,
        reference_type: referenceType,
        balance_after: 100 - amount
      })

      return { success: true, newBalance: 100 - amount }
    }

    const currentBalance = creditData.balance
    
    if (currentBalance < amount) {
      return { 
        success: false, 
        newBalance: currentBalance,
        error: `Insufficient credits. Need ${amount}, have ${currentBalance}`
      }
    }

    const newBalance = currentBalance - amount

    // Update balance
    const { error: updateError } = await supabase
      .from('user_credits')
      .update({ 
        balance: newBalance,
        lifetime_spent: supabase.rpc('increment', { x: amount })
      })
      .eq('user_id', userId)

    if (updateError) throw updateError

    // Log transaction
    await supabase.from('credit_transactions').insert({
      user_id: userId,
      amount: -amount,
      transaction_type: 'deduction',
      description,
      reference_id: referenceId,
      reference_type: referenceType,
      balance_after: newBalance
    })

    return { success: true, newBalance }

  } catch (error: any) {
    console.error('Credit deduction error:', error)
    return { success: false, newBalance: 0, error: error.message }
  }
}

export async function addCredits(
  userId: string,
  amount: number,
  description: string
): Promise<{ success: boolean; newBalance: number }> {
  try {
    const { data, error } = await supabase
      .from('user_credits')
      .select('balance')
      .eq('user_id', userId)
      .single()

    const currentBalance = data?.balance || 0
    const newBalance = currentBalance + amount

    await supabase
      .from('user_credits')
      .upsert({
        user_id: userId,
        balance: newBalance,
        lifetime_earned: supabase.rpc('increment', { x: amount })
      })

    await supabase.from('credit_transactions').insert({
      user_id: userId,
      amount,
      transaction_type: 'credit',
      description,
      balance_after: newBalance
    })

    return { success: true, newBalance }
  } catch (error) {
    return { success: false, newBalance: 0 }
  }
}

export async function getBalance(userId: string): Promise<number> {
  const { data } = await supabase
    .from('user_credits')
    .select('balance')
    .eq('user_id', userId)
    .single()

  return data?.balance || 100
}
