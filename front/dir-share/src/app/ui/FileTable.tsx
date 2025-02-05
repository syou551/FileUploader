'use Client';

import {memo, useState} from "react";
import {clsx} from 'clsx';
import FileCard from "./FileCard";
import { useSession } from 'next-auth/react';

export type FileType = {
    Name : string,
    Type : string,
}

const FileTable = ({files, query}:{ files? : FileType[], query? : string}) =>{
    console.log(files);
    const [menuShown, setMenuShown] = useState<boolean>(false);
    //const {data:session} = useSession();
     
    return (
    <>
       {files?.map((f, index)=><FileCard info={f} query={query!} key={index}/>)}
    </>
    );
}

export default memo(FileTable);