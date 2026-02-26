import { redirect } from 'next/navigation'

export default function SignInPage() {
  redirect('/marketplace?join=1')
}
