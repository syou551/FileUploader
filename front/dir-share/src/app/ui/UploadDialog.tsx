import {FormEventHandler, FormHTMLAttributes, memo, useState} from "react";
import {clsx} from 'clsx';
import { Postpone } from "next/dist/server/app-render/dynamic-rendering";
//参考
//https://qiita.com/Revocraft/items/583e8106af5f63217988

const UploadDialog = ({isOpen,onCancel,onOk,url,query}:{isOpen: boolean, onCancel: ()=>void, onOk: ()=>void, 
    url?: string, query? : string}) =>{
    /*
        ファイル作成用のダイアログ
    */
    const formHandler = async (event: React.FormEvent<HTMLFormElement>):Promise<void> =>{
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        {/*
            FormをfetchでPOSTする時はContentTypeは指定しない
            https://zenn.dev/kariya_mitsuru/articles/25c9aeb27059e7
        */}
        const response = await fetch(url+'/api/upload?path=' + query, {
        method: 'POST',
        body: formData,
        })

        console.log(response)
        onOk()
        location.reload()
    }

    return isOpen? (
    <>
    <div className="bg-white  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-5 flex flex-col items-start absolute z-20">
        <p className="text-xl font-bold py-2">ファイルアップロード</p>
        <div className="flex items-center justify-center mt-auto w-full">
            <form className="grid-col items-center justify-center py-2" onSubmit={formHandler}>
                <input type="file" name="file" className="flex py-2 px-2"/>
                <button type="submit" className="flex bg-slate-900 hover:bg-slate-700 text-white px-8 py-2 mx-auto">
                        OK
                </button>
            </form>
        </div>
      </div>
    {/*背景 */}
    <div
        className="fixed bg-black bg-opacity-50 w-full h-full z-10"
        onClick={() => onCancel()}
      ></div>
    </>
    ):<></>;
}

export default memo(UploadDialog);