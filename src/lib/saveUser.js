import { supabase } from './supabaseClient'

export async function saveUser(user) {
  if (!user || !user.name) return { error: 'No user data' }

  try {
    const { data, error } = await supabase
      .from('users')
      .upsert(
        {
          name: user.name,
          email: user.email || null,
          contact: user.contact || null,
          user_type: user.userType,
          greeting: user.greeting,
        },
        { onConflict: 'name' }
      )
      .select()
      .single()

    if (error) {
      console.error('❌ Save user error:', error)
      return { error }
    }

    console.log('✅ User saved:', data)
    return { data }
  } catch (err) {
    console.error('❌ Save user exception:', err)
    return { error: err }
  }
}