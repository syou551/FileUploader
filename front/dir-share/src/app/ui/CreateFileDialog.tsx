import {memo, useState} from "react";
import {clsx} from 'clsx';
//参考
//https://qiita.com/Revocraft/items/583e8106af5f63217988

const FileDialog = ({isOpen,onCancel,onOk,url,query}:{isOpen: boolean, onCancel: ()=>void, onOk: ()=>void, 
    url?: string, query? : string}) =>{
    /*
        ファイル作成用のダイアログ
    */
   const [name, setName] = useState<string>("");

    return isOpen? (
    <>
    <div className="bg-white  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-5 flex flex-col items-start absolute z-20">
        <p className="text-xl font-bold py-2">ファイル作成</p>
        <p className="text-lg py-2">ファイル名を入力してください</p>
        <div className="flex items-center justify-center mt-auto w-full">
            <div className="flex justify-center items-center py-2">
                <input type="text" name="text" className="border rounded-md text-mdborder-black-200 py-2 px-2"
                    value ={name} onChange={(e)=>setName(e.target.value)}></input>
            </div>
        </div>
        <button className="flex bg-slate-900 hover:bg-slate-700 text-white px-8 py-2 mx-auto"
                onClick={() => {
                    fetch(url+'/dir/api/upload?path='+query+'&name='+name)
                        .then((response)=>console.log(response));
                    onOk();
                    location.reload();
                    }}>
                    OK
            </button>
      </div>
    {/*背景 */}
    <div
        className="fixed bg-black bg-opacity-50 w-full h-full z-10"
        onClick={() => onOk()}
      ></div>
    </>
    ):<></>;
}

export default memo(FileDialog);