'use client';

import {memo, useState, useEffect, useCallback} from "react";
import { useSession } from 'next-auth/react';
import FileTable from "@/app/ui/FileTable";
import {clsx} from 'clsx';
import Header from '@/app/ui/Header';
import AuthCheck from '@/app/lib/AuthCheck';
import { useRouter } from 'next/navigation';

type FileType = {
    Name : string,
    Type : string,
}

export default function Page({searchParams} : {searchParams? : {path : string}}){
    const [query, setQuery] = useState<string>();
    const [res, setRes] = useState<FileType[]>();
    const {status:status, data:session} = useSession();
    const router = useRouter();

    const url = process.env.NEXT_PUBLIC_BACK_URL;
    if(res == null || query != searchParams?.path){
        //デプロイ時に変更する
        console.log(url+'/api/ls?path='+searchParams?.path);
        if(searchParams?.path.includes('/../')||
            searchParams?.path =='..'||
            searchParams?.path =='../')
        {
            location.replace('/explorer?path=');
        }
        fetch(url+'/api/ls?path='+searchParams?.path).then((response)=>response.json())
        .then((data)=>{setRes(data as FileType[]);setQuery(searchParams?.path)});
    }

    return status != 'loading' ?(
    <>
        <Header query={query} url={url}/>
        <FileTable files={res} query={query}/>
        {session ? <></> : <>{router.push('/login')}</>}
    </>
    ): <div>読み込み中</div>;
}

