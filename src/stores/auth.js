import { defineStore } from 'pinia'
import { supabase } from '@/supabase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    error: null
  }),
  actions: {
    async register({ email, password, username }) {
      this.loading = true
      this.error = null
      try {
        // 1. Create user in Supabase Auth
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error

        // 2. Insert username into profiles
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ id: data.user.id, username }])
        if (profileError) throw profileError

        this.user = data.user
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async login({ email, password }) {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        this.user = data.user
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async logout() {
      await supabase.auth.signOut()
      this.user = null
    }
  }
})
