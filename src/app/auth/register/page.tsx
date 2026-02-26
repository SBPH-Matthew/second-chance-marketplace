import { redirect } from 'next/navigation'

export default function RegisterPage() {
  redirect('/marketplace?join=1')
}
