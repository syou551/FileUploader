package main

import (
	//"database/sql"
	//"encoding/json"
	"os/exec"
    "fmt"
    "log"
    "net/http"
)

func hello_world(w http.ResponseWriter, r *http.Request){
	out, err := exec.Command("ls", "../").Output()

	if err != nil {
		log.Fatal("cmd execute; ", err)
	}
    fmt.Fprintf(w,string(out))
	//outをJsonにして返す
}

func main() {
    http.HandleFunc("/api/", hello_world)

    // クロージャを渡しても良い
    // http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
    //  fmt.Fprintf(w, "Hello World")
    // })

    if err := http.ListenAndServe(":80", nil); err != nil {
        log.Fatal("ListenAndServe: ", err)
    }
}