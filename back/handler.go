package main

import (
	//"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"os/exec"
	"strings"
	//"github.com/gofiber/fiber/v2"
)

func getLsRes(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Headers", "*")
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")

	dirPath := os.Getenv("ROOTPATH")
	queryParams := r.URL.Query()
	path, _ := queryParams["path"]

	dirPath += path[0] + "/"
	out, err := exec.Command("ls", dirPath).Output()
	if err != nil {
		log.Fatal("cmd execute; ", err)
		w.WriteHeader(http.StatusNoContent)
	}
	fmt.Println(string(out))
	//outをJsonにして返す
	files := strings.Split(string(out), "\n")
	res := []Datas{}
	for _, item := range files {
		data := Datas{}
		if item == "" {
			continue
		}
		fInfo, err := IsDirectory(dirPath + item)
		if err != nil {
			fmt.Println("Error")
			continue
		}
		data.Name = item

		if fInfo {
			data.Type = "Dir"
		} else {
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

func saveFile(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, X-Auth-Token")
	filePath := os.Getenv("ROOTPATH")
	//UPLQueryとして相対パスを受け渡し
	//RootDirはSamba共有Dirの一番上
	//limit := queryParams.Get("limit")でも可
	queryParams := r.URL.Query()
	path, _ := queryParams["path"]
	fmt.Println(path[0])

	if r.Method != "POST" {
		http.Error(w, "This api is only POST request!", http.StatusMethodNotAllowed)
		return
	}

	err := r.ParseMultipartForm(32 << 16)
	if err != nil {
		http.Error(w, "ParseError", http.StatusInternalServerError)
		return
	}
	file, header, err := r.FormFile("file")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer file.Close()
	//Pathの作成メゾット追加必要
	f, err := os.Create(filePath + "/" + path[0] + "/" + header.Filename)
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

func mkdir(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Headers", "*")
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	filePath := os.Getenv("ROOTPATH")
	//UPLQueryとして相対パスを受け渡し
	//RootDirはSamba共有Dirの一番上
	//limit := queryParams.Get("limit")でも可
	queryParams := r.URL.Query()
	path, _ := queryParams["path"]
	name, _ := queryParams["name"]
	fmt.Println(path[0])
	fmt.Println(name[0])

	//Pathの作成メゾット追加必要
	fileInfo, err := os.Lstat("../")

	if err != nil {
		fmt.Println(err)
	}

	fileMode := fileInfo.Mode()
	unixPerms := fileMode & os.ModePerm
	err = os.MkdirAll(filePath+"/"+path[0]+"/"+name[0], unixPerms)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "mkdir OK!")
}

func touch(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Headers", "*")
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	filePath := os.Getenv("ROOTPATH")
	//UPLQueryとして相対パスを受け渡し
	//RootDirはSamba共有Dirの一番上
	//limit := queryParams.Get("limit")でも可
	queryParams := r.URL.Query()
	path, _ := queryParams["path"]
	name, _ := queryParams["name"]
	fmt.Println(path[0])
	fmt.Println(name[0])

	//Pathの作成メゾット追加必要
	f, err := os.Create(filePath + "/" + path[0] + "/" + name[0])
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer f.Close()
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "touch OK!")
}

func rm(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Headers", "*")
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	filePath := os.Getenv("ROOTPATH")
	//UPLQueryとして相対パスを受け渡し
	//RootDirはSamba共有Dirの一番上
	//limit := queryParams.Get("limit")でも可
	queryParams := r.URL.Query()
	path, _ := queryParams["path"]
	name, _ := queryParams["name"]
	fmt.Println(path[0])
	fmt.Println(name[0])

	err := os.Remove(filePath + "/" + path[0] + "/" + name[0])
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "rm OK!")
}

func getFiles(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Headers", "*")
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	if r.Method != "GET" {
		http.Error(w, "This api is only GET request!", http.StatusMethodNotAllowed)
		return
	}
	queryParams := r.URL.Query()
	path, _ := queryParams["path"]

	dirPath := os.Getenv("ROOTPATH")
	f, err := os.Open(dirPath + path[0])
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
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
