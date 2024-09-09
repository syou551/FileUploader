'use client';

import { signIn, signOut, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function Login() {
  const {data :session} = useSession();

  return !session ?(
    <>
    <button className="flex justify-center px-2 py-1 bg-blue-100 hover:bg-blue-400" onClick={() => signIn("google",{callbackUrl:"/login"})}> 
      Login With Google
    </button>
    </>
  ):
  <div>
    <p>{session?.user?.email}でログインしています</p>
    <button className="flex bg-blue-100 rounded-md hover:bg-blue-200 py-2 px-2" onClick={()=>location.replace('/explorer?path=')}>ファイル一覧へ</button>
  </div>;
}