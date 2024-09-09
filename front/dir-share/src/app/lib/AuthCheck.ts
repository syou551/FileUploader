'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from "next/navigation";

const AuthCheck = ({children}:{children : React.ReactNode;}) => {
    const {data:session} = useSession();
    const router = useRouter();
    const path = usePathname();
    console.log(path);
    console.log(session?.user?.email);

    if(!session && path != '/login') router.push('/login');

    return children;
}

export default AuthCheck;