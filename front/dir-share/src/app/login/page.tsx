'use client';

import { signIn, signOut, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";


interface authSession{
    name?: string | null,
    email?: string | null,
    image?: string | null,
    sub?: any | null,
    roles?: any | null
}

export default function Login() {
  const {data : session} = useSession();

  return !session ?(
    <>
    <button className="flex justify-center px-2 py-1 bg-blue-100 hover:bg-blue-400" onClick={() => signIn("google")}> 
      Login With Google
    </button><br/>
    <button className="flex justify-center px-2 py-1 bg-blue-100 hover:bg-blue-400" onClick={() => signIn("keycloak")}> 
      Login With keycloak
    </button>
    </>
  ):
  <div>
    <p>{session?.user?.email}でログインしています</p>
    <p>ロール{((session?.user as authSession)?.roles == null) ? "なし" : (session?.user as authSession)?.roles}</p>
    <button className="flex bg-blue-100 rounded-md hover:bg-blue-200 py-2 px-2" onClick={()=>location.replace('/explorer?path=')}>ファイル一覧へ</button>
  </div>;
}