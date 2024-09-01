'use client';

import {memo, useState} from "react";
import FileTable from "@/app/ui/FileTable";
import {clsx} from 'clsx';
import Header from '@/app/ui/Header';

type FileType = {
    Name : string,
    Type : string,
}

export default function Page({searchParams} : {searchParams? : {path : string}}){
    const [query, setQuery] = useState<string>();
    const [res, setRes] = useState<FileType[]>();

    const url = "http://127.0.0.1";

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
    return (
    <>
        <Header query={query} url={url}/>
        <FileTable files={res} query={query}/>
    </>
    );
}

