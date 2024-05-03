package main

import (
	//"database/sql"
	"encoding/json"
	"os/exec"
	"os"
	"io"
    "fmt"
    "log"
	"strings"
    "net/http"
	//"github.com/gofiber/fiber/v2"
)

func getLsRes(w http.ResponseWriter, r *http.Request){
	dirPath := "../"
	queryParams := r.URL.Query()
	path ,_:= queryParams["path"]

	dirPath += path[0] + "/"
	out, err := exec.Command("ls", dirPath).Output()
	if err != nil {
		log.Fatal("cmd execute; ", err)
		w.WriteHeader(http.StatusNoContent)
	}
    fmt.Println(string(out))
	//outをJsonにして返す
	files := strings.Split(string(out),"\n")
	res := []Datas{}
	for _, item := range files{
		data := Datas{}
		if item == "" {continue}
		fInfo, err := IsDirectory(dirPath+item)
		if err != nil {
			fmt.Println("Error")
			continue
		}
		data.Name = item

		if fInfo{ 
			data.Type = "Dir"
		}else{
			data.Type = "File"
		}
		res = append(res, data)
	}
	//Response Header
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	response, _ := json.Marshal(res)
	w.Write(response)
}

// 指定されたファイル名がディレクトリかどうか調べる
func IsDirectory(name string) (isDir bool, err error) {
	fInfo, err := os.Stat(name) // FileInfo型が返る。
	if err != nil {
			return false, err // もしエラーならエラー情報を返す
	}
	// ディレクトリかどうかチェック
	return fInfo.IsDir(), nil
}

func saveFile(w http.ResponseWriter, r *http.Request){
	filePath := "../"
	//UPLQueryとして相対パスを受け渡し
	//RootDirはSamba共有Dirの一番上
	//limit := queryParams.Get("limit")でも可
	queryParams := r.URL.Query()
	path , _ := queryParams["path"]
	fmt.Println(path[0])

	if r.Method != "POST"{
		http.Error(w,"This api is only POST request!", http.StatusMethodNotAllowed)
		return
	}

	err := r.ParseMultipartForm(32 << 16)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
	file, header, err := r.FormFile("file")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
        return
	}
	defer file.Close()
	//Pathの作成メゾット追加必要
	f, err := os.Create(filePath+"/"+header.Filename)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer f.Close()

	_, err = io.Copy(f, file)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)	
	fmt.Fprintf(w, "アップロード成功！")
}

func getFiles(w http.ResponseWriter, r *http.Request){
	if r.Method != "GET" {
		http.Error(w,"This api is only GET request!", http.StatusMethodNotAllowed)
		return	
	}
	queryParams := r.URL.Query()
	path ,_:= queryParams["path"]	

	dirPath := "../"
	f, err := os.Open(dirPath+path[0])
	if err != nil {
		http.Error(w,err.Error(), http.StatusNotFound)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "*/*")
	//Buffersize要検討
	data := make([]byte, 10240000)
	n, _ := f.Read(data)
	f.Close()
	w.Write(data[:n])
}