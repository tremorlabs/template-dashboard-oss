"use client"

import { createClient } from "@/utils/supabase/client"
import React from "react"

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = React.useState(false)

  React.useEffect(() => {
    const supabase = createClient()
    const loadRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      setIsAdmin(data?.role === "Admin")
    }
    loadRole()
  }, [])

  return isAdmin
}