package main

import (
	//"database/sql"
	"encoding/json"
	"os/exec"
	"os"
    "fmt"
    "log"
	"strings"
    "net/http"
)

type Datas struct{
	Name string `json:"Name"`
	Type string `json:"Type"`
}

func getLsRes(w http.ResponseWriter, r *http.Request){
	dirPath := "../"

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

func main() {
    http.HandleFunc("/api/ls", getLsRes)

    // クロージャを渡しても良い
    // http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
    //  fmt.Fprintf(w, "Hello World")
    // })

    if err := http.ListenAndServe(":80", nil); err != nil {
        log.Fatal("ListenAndServe: ", err)
    }
}