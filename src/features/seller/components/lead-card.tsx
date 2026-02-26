import { Button } from '@/components/ui/button'

export function LeadCard({
  title,
  buyer,
  score,
}: {
  title: string
  buyer: string
  score: number
}) {
  return (
    <article className="rounded-lg border border-gray-300 bg-white p-4 shadow-lg shadow-gray-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">Lead score: {score}</p>
          <h2 className="text-lg font-semibold text-black">{title}</h2>
          <p className="text-sm text-gray-600">Buyer: {buyer}</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm">Accept</Button>
          <Button size="sm" variant="outline">
            Counter
          </Button>
          <Button size="sm" variant="outline">
            Decline
          </Button>
          <Button size="sm" variant="ghost">
            Mark sold
          </Button>
        </div>
      </div>
    </article>
  )
}
