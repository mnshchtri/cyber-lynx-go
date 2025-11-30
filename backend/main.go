package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"
)

import "github.com/gorilla/mux"

type User struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"-"`
}

type Target struct {
	ID          int    `json:"id"`
	Type        string `json:"type"`
	Value       string `json:"value"`
	Description string `json:"description"`
}

var (
	users       = make(map[string]User)
	targets     = []Target{}
	nextUserID  = 1
	nextTargetID = 1
	mutex       = &sync.Mutex{}
)

func signupHandler(w http.ResponseWriter, r *http.Request) {
	var user User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	mutex.Lock()
	defer mutex.Unlock()

	if _, exists := users[user.Username]; exists {
		http.Error(w, "User already exists", http.StatusBadRequest)
		return
	}

	user.ID = nextUserID
	nextUserID++
	users[user.Username] = user

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	var creds User
	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	mutex.Lock()
	defer mutex.Unlock()

	user, exists := users[creds.Username]
	if !exists || user.Password != creds.Password {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

func addTargetHandler(w http.ResponseWriter, r *http.Request) {
	var target Target
	if err := json.NewDecoder(r.Body).Decode(&target); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	mutex.Lock()
	defer mutex.Unlock()

	target.ID = nextTargetID
	nextTargetID++
	targets = append(targets, target)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(target)
}

func main() {
	r := mux.NewRouter()

	api := r.PathPrefix("/api").Subrouter()
	api.HandleFunc("/signup", signupHandler).Methods("POST")
	api.HandleFunc("/login", loginHandler).Methods("POST")
	api.HandleFunc("/targets", addTargetHandler).Methods("POST")
	api.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"message": "Hello from the Go API"})
	})

	fmt.Println("Starting server on :8080")
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatal(err)
	}
}