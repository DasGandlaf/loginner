import Head from "next/head";

import {SignInButton, SignOutButton, useUser} from "@clerk/nextjs";
import {useState} from "react";
import {useRouter} from "next/router";

export default function Home() {
  const [loading, setLoading] = useState(false)
  const user = useUser()
  const router = useRouter()

  if (user.isSignedIn) {
    void router.push("/dashboard")
  }

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>

      <main className="flex column min-vh-100 items-center white gap-1 overflow-auto">
        <h1 className={"f-6 justify-start fade-right"}>Loginner</h1>

        <div className={"flex column items-center justify-center gap-1 grow-1"}>
          <div className="my-border pa5 fade-right f4 mb4">
            Sign in to get started! 🚀

          </div>

          {user.isSignedIn && <SignOutButton
            signOutCallback={() => {
              setLoading(false)
            }}
          >
            <div className="fade-right">
              <button className={"bg-error"} onClick={() => setLoading(true)}>Sign Out</button>
            </div>
          </SignOutButton>}
          {!user.isSignedIn && <SignInButton afterSignInUrl="/dashboard">
            <div className="fade-right">
              <button className={"bg-primary-variant"} onClick={() => setLoading(true)}>Sign In</button>
            </div>
          </SignInButton>}
        </div>

        <div className={"grow-1"}></div>
      </main>
    </>
  );
}