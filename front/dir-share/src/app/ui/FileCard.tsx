import {memo, useState} from "react";
import {clsx} from 'clsx';
import {FileType} from './FileTable';

const FileCard = ({info,query,key}:{info : FileType, query : string, key : number}) => {
    const [menuShown, isMenuShown] = useState<boolean>(false);

    const DeleteFile = () => {
        const url = process.env.NEXT_PUBLIC_BACK_URL + "/api/rm?path=" + query + "&name=" + info.Name;
        fetch(url).then(()=>isMenuShown(false));
        location.reload();
    }
    
    return(
        <div className="flex mx-2 my-1 py-5 shadow-md hover:bg-gray-100" key={key} 
            onClick={()=>{
                if(info.Type == "File") {
                    const head_url = query == "" ? (process.env.NEXT_PUBLIC_BACK_URL + "/api/view?path=" + query) :
                        (process.env.NEXT_PUBLIC_BACK_URL + "/api/view?path=" + query + "/"); 
                    open(head_url+info.Name);
                }
                else {
                    const head_url = query == "" ? (process.env.NEXT_PUBLIC_FRONT_URL + "/explorer?path="+query) :
                        (process.env.NEXT_PUBLIC_FRONT_URL + "/explorer?path="+query+"/");
                    location.replace(head_url+info.Name);
                }
            }}>
            <div className="flex justify-between w-full px-2">

            <div className="flex">
                <span className={clsx(
                    {
                        "i-flat-color-icons-folder": info.Type == "Dir",
                        "i-flat-color-icons-document": info.Type == "File"
                    },
                    "px-4 w-10 h-10")}/>
                <p className="flex py-1 ml-4">{info.Name}</p>
            </div>
            {/*削除等の操作はここに stopPropagation()は親要素へのEvent伝播を止める*/ }
            {info.Type == "File" ? 
            <button className="flex rounded-full mx-4 px-2 hover:bg-gray-200"
                onClick={(e)=>{
                    e.stopPropagation();
                    if(!menuShown) isMenuShown(true);
                    else isMenuShown(false);
                    }}>. . .</button>
            : <div></div>}
            </div>
            {info.Type == "File" ? 
            <div className="flex items-center fixed right-[0%] mr-3 mt-8 z-index-10 z-50 bg-white">
                <nav className="flex justify-center items-center">
                    <ul className={clsx("flex transition shadow-md items-center flex-col bg-gray-10", {"hidden" : !menuShown})}>
                        <div className="flex flex-col items-center ml-3 mr-3 mb-3 mt-3 gap-2 text-md ">
                            <button className="flex rounded-md px-2 py-2 text-md bg-white hover:bg-gray-200 " 
                                onClick={(e)=>{e.stopPropagation();DeleteFile();}}>削除</button>
                        </div>
                    </ul>
                </nav>
            </div>
            : <></>   }
        </div>
    );
}

export default memo(FileCard);