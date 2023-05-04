package main

import (
	"log"

	"github.com/sebastiankul-99/messaging-app/auth-service/db"
	"github.com/sebastiankul-99/messaging-app/auth-service/handlers"
	"github.com/sebastiankul-99/messaging-app/auth-service/router"
)

func main() {
	dbConnection, err := db.NewDatabase()

	if err != nil {
		log.Fatalln("Could not connect to database: ", err.Error())
		return
	}
	userRepository := db.NewUserRepository(dbConnection.GetDB())

	sessionRepository := db.NewSessionRepository(dbConnection.GetDB())

	userService := db.NewUserService(userRepository)
	sessionService := db.NewSessionService(sessionRepository)

	sessionHandler := handlers.NewSessionHandler(sessionService)
	userHandler := handlers.NewUserHandler(userService, sessionService)
	if userHandler != nil {
		log.Println("created user handlers")
	}

	router.InitRouter(userHandler, sessionHandler)
	router.Start("127.0.0.1:9090")

}
