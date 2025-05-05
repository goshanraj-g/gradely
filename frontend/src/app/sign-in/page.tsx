// app/sign-in/page.tsx
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SignInPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-4">Sign In</h1>
      <form className="w-full max-w-sm space-y-4">
        <Input type="email" placeholder="Email" />
        <Input type="password" placeholder="Password" />
        <Button className="w-full cursor-pointer">Continue</Button>
      </form>
    </main>
  )
}
