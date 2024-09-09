"use client";

import {SessionProvider, useSession} from "next-auth/react";
import { Children } from "react";
import AuthCheck from '@/app/lib/AuthCheck'

const SessionProviderSet = ({children}:{children : React.ReactNode;})=>{
    return(
        <SessionProvider>
                {children}
        </SessionProvider> 
    );
}

export default SessionProviderSet;