package main

import (
	"log"

	"github.com/sebastiankul-99/messaging-app/search-users-service/db"
	"github.com/sebastiankul-99/messaging-app/search-users-service/router"

	"github.com/sebastiankul-99/messaging-app/search-users-service/handlers"
)

func main() {
	dbConnection, err := db.NewDatabase()

	if err != nil {
		log.Fatalln("Could not connect to database: ", err.Error())
		return
	}
	if err != nil {
		log.Fatalln("Could not connect to database: ", err.Error())
		return
	}
	searchRepository := db.NewUserRepository(dbConnection.GetDB())

	searchService := db.NewSearchService(searchRepository)

	searchHandler := handlers.NewSearchHandler(searchService)
	if searchHandler != nil {
		log.Println("created user handlers")
	}

	router.InitRouter(searchHandler)
	router.Start("127.0.0.1:9091")

}
