package main

import (
	//"database/sql"
	//"encoding/json"
    "log"
    "net/http"
	//"github.com/gofiber/fiber/v2"
)

type Datas struct{
	Name string `json:"Name"`
	Type string `json:"Type"`
}

func main() {
    http.HandleFunc("/api/ls", getLsRes)
	http.HandleFunc("/upload", saveFile)
	http.HandleFunc("/view", getFiles)
    // クロージャを渡しても良い
    // http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
    //  fmt.Fprintf(w, "Hello World")
    // })

    if err := http.ListenAndServe(":80", nil); err != nil {
        log.Fatal("ListenAndServe: ", err)
    }
}