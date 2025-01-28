package main

import (
	"log"
	"net/http"

	"github.com/joho/godotenv"
)

type Datas struct {
	Name string `json:"Name"`
	Type string `json:"Type"`
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	godotenv.Load()

	http.HandleFunc("/api/ls", getLsRes)
	http.HandleFunc("/api/mkdir", mkdir)
	http.HandleFunc("/api/touch", touch)
	http.HandleFunc("/api/rm", rm)
	http.HandleFunc("/api/upload", saveFile)
	http.HandleFunc("/api/view", getFiles)
	// クロージャを渡しても良い
	// http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
	//  fmt.Fprintf(w, "Hello World")
	// })

	if err := http.ListenAndServe(":80", nil); err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
