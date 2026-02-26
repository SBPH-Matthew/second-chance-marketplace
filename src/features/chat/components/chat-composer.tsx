'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function ChatComposer({ conversationId }: { conversationId: string }) {
  const [body, setBody] = useState('')

  async function sendMessage() {
    if (!body.trim()) return

    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversationId, body }),
    })

    setBody('')
  }

  return (
    <div className="flex gap-2 border-t border-gray-300 p-3">
      <Input value={body} onChange={(event) => setBody(event.target.value)} placeholder="Type your message" />
      <Button onClick={sendMessage}>Send</Button>
    </div>
  )
}
