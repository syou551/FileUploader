import {memo, useState} from "react";
import {clsx} from 'clsx';

type FileType = {
    Name : string,
    Type : string,
}

const FileTable = ({files, query}:{ files? : FileType[], query? : string}) =>{
     console.log(files);
    return (
    <>
       {files?.map((f, index)=>
       {
        return(
        <div className="flex mx-2 my-1 py-5 shadow-md hover:bg-gray-100" key={index} 
            onClick={()=>{
                if(f.Type == "File") {
                    const head_url = query == "" ? ("http://127.0.0.1/view?path="+query) :
                        ("http://127.0.0.1/view?path="+query+"/"); 
                    open(head_url+f.Name);
                }
                else {
                    const head_url = query == "" ? ("http://localhost:3000/explorer?path="+query) :
                        ("http://localhost:3000/explorer?path="+query+"/");
                    location.replace(head_url+f.Name);
                }
            }}>
            <div className="flex justify-between w-full px-2">

            <div className="flex">
                <span className={clsx(
                    {
                        "i-flat-color-icons-folder": f.Type == "Dir",
                        "i-flat-color-icons-document": f.Type == "File"
                    },
                    "px-4 w-10 h-10")}/>
                <p className="flex py-1 ml-4">{f.Name}</p>
            </div>
            {/*削除等の操作はここに stopPropagation()は親要素へのEvent伝播を止める*/ }
            <button className="flex rounded-full mx-4 px-2 hover:bg-gray-200"
            onClick={(e)=>e.stopPropagation()}>. . .</button>
            </div>
        </div>
        )
       })}
    </>
    );
}

export default memo(FileTable);