import Pusher from 'pusher'

export const pusherServer =
  process.env.PUSHER_APP_ID && process.env.PUSHER_KEY && process.env.PUSHER_SECRET
    ? new Pusher({
        appId: process.env.PUSHER_APP_ID,
        key: process.env.PUSHER_KEY,
        secret: process.env.PUSHER_SECRET,
        cluster: process.env.PUSHER_CLUSTER,
        useTLS: true,
      })
    : null

export async function publishConversationEvent(
  conversationId: string,
  event: string,
  payload: unknown,
) {
  if (!pusherServer) return
  await pusherServer.trigger(`conversation-${conversationId}`, event, payload)
}
