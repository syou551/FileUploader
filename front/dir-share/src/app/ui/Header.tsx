'use client';

import {memo, useState} from "react";
import {clsx} from 'clsx';
import FileDialog from './CreateFileDialog';
import DirDialog from "./MkdirDialog";
import UploadDialog from "./UploadDialog";
import { signOut, useSession } from 'next-auth/react'

const Header = ({query, url}:{query? : string, url? : string})=>{
    const [touchWinIsOpen, setTouchWinIsOpen] = useState<boolean>(false);
    const [mkdirWinIsOpen, setMkdirWinIsOpen] = useState<boolean>(false);
    const [uploadWinIsOpen, setUploadWinIsOpen] = useState<boolean>(false);


    return (
        <header className="flex justify-between py-2 w-full bg-blue-100">
            <button className={clsx("flex rounded-md mx-2 py-2 px-2",{
                "hover:bg-blue-300": query != "",
                "bg-gray-300 text-gray-100":query == ""
            })}
                onClick={()=>backPage(query)}>＜ 戻る</button>
                <FileDialog isOpen = {touchWinIsOpen}
                    onCancel = {()=>setTouchWinIsOpen(false)} 
                    onOk = {()=>setTouchWinIsOpen(false)} 
                    query = {query}
                    url={url}/>
                <DirDialog isOpen={mkdirWinIsOpen}
                    onCancel={()=>setMkdirWinIsOpen(false)}
                    onOk={()=>setMkdirWinIsOpen(false)}
                    query={query}
                    url={url}/>
                <UploadDialog isOpen={uploadWinIsOpen}
                    onCancel={()=>setUploadWinIsOpen(false)}
                    onOk={()=>setUploadWinIsOpen(false)}
                    query={query}
                    url={url}/>
            <div className="flex ">
                <button className="flex justify-center items-center flex rounded-md mx-2 py-2 px-2 hover:bg-blue-300" onClick={()=>
                    location.replace(process.env.NEXT_PUBLIC_FRONT_URL + "/oauth2/sign_out?rd=" + process.env.NEXT_PUBLIC_BACK_LOGOUT_URL)}>ログアウト</button>
                <button className="flex justify-center items-center flex rounded-md mx-2 py-2 px-2 hover:bg-blue-300"
                        onClick={()=>setUploadWinIsOpen(true)}>
                    <span className="i-flat-color-icons-document"/>
                    <p>アップロード</p>
                </button>
                <button className="flex justify-center items-center flex rounded-md mx-2 py-2 px-2 hover:bg-blue-300"
                        onClick={()=>setMkdirWinIsOpen(true)}>
                    <span className="i-flat-color-icons-folder"/>
                    <p>追加</p>
                </button>
                <button className="flex justify-center items-center flex rounded-md mx-2 py-2 px-2 hover:bg-blue-300"
                    onClick={()=>setTouchWinIsOpen(true)}>
                    <span className="i-flat-color-icons-document"/>
                    <p>追加</p>
                </button>
            </div>
        </header>
    );
};

function backPage(query? : string){
    if(query == "") return;
    const index = query?.lastIndexOf("/");
    const newQuery = query?.substring(0,index);
    location.replace("/explorer?path="+newQuery);
}

export default memo(Header);