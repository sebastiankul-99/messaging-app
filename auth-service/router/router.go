package router

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/sebastiankul-99/messaging-app/auth-service/handlers"
)

var r *gin.Engine

func InitRouter(userHandler *handlers.UserHandler, sessionHandler *handlers.SessionHandler) {
	r = gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST"},
		AllowHeaders:     []string{"Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		AllowOriginFunc: func(origin string) bool {
			return origin == "http://localhost:3000"
		},
		MaxAge: 12 * time.Hour,
	}))

	r.POST("/singup", userHandler.CreateUser)
	r.POST("/singin", userHandler.SignIn)
	r.GET("/signout", userHandler.SignOut)
	r.GET("/refresh", sessionHandler.RefreshAccess)
	r.GET("/validate", sessionHandler.ValidateAccess)
}

func Start(addr string) error {
	return r.Run(addr)
}
