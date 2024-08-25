'use client';

import {memo, useState} from "react";
import FileTable from "@/app/ui/FileTable";
import {clsx} from 'clsx';

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
        <div className="flex justify-between py-2 w-full bg-blue-100">
            <button className={clsx("flex rounded-md mx-2 py-2 px-2",{
                "hover:bg-blue-300": query != "",
                "bg-gray-300 text-gray-100":query == ""
            })}
                onClick={()=>backPage(query)}>＜ 戻る</button>
            <div className="flex ">
                <button className="flex justify-center items-center flex rounded-md mx-2 py-2 px-2 hover:bg-blue-300"
                        >
                    <span className="i-flat-color-icons-folder"/>
                    <p>追加</p>
                </button>
                <button className="flex justify-center items-center flex rounded-md mx-2 py-2 px-2 hover:bg-blue-300"
                    onClick={()=>{
                        fetch(url+'/api/mkdir?path=front&name=hoge.txt')
                        .then((response)=>console.log(response))
                        location.reload()
                    }}>
                    <span className="i-flat-color-icons-document"/>
                    <p>追加</p>
                </button>
            </div>
        </div>
        <FileTable files={res} query={query}/>
    </>
    );
}

function backPage(query? : string){
    if(query == "") return;
    const index = query?.lastIndexOf("/");
    const newQuery = query?.substring(0,index);
    location.replace("/explorer?path="+newQuery);
}