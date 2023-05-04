package handlers

import (
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/sebastiankul-99/messaging-app/auth-service/models"
)

type UserHandler struct {
	models.UserService
	models.SessionService
}

func NewUserHandler(u models.UserService, s models.SessionService) *UserHandler {
	return &UserHandler{
		UserService:    u,
		SessionService: s,
	}
}

func (h *UserHandler) CreateUser(c *gin.Context) {
	var u models.CreateUserRequest
	if err := c.ShouldBindJSON(&u); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	res, err := h.UserService.CreateUser(c.Request.Context(), &u)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, res)
}

func (h *UserHandler) SignIn(c *gin.Context) {
	var user models.LoginUserRequest
	err := c.ShouldBindJSON(&user)
	if err != nil {
		log.Println("error in marshalling")
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	u, err := h.UserService.LogIn(c.Request.Context(), &user)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	userId, err := strconv.Atoi(u.ID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	ses, err := h.SessionService.CreateSession(c.Request.Context(), userId)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.SetCookie("quetal-refresh-token", ses.RefreshToken, 60*60*24*30, "/", "localhost", false, true)

	res := &models.LoginUserResponse{
		ID:                    u.ID,
		FirstName:             u.FirstName,
		SessionID:             strconv.Itoa(int(ses.ID)),
		SessionExpirationDate: ses.ExpiresAt,
		LastName:              u.LastName,
		Email:                 u.Email,
	}
	c.Header("quetal-access-token", u.AccessToken)
	c.JSON(http.StatusOK, res)
}

func (h *UserHandler) SignOut(c *gin.Context) {
	c.SetCookie("quetal-refresh-token", "", -1, "", "", false, true)
	c.Header("quetal-access-token", "")
	c.JSON(http.StatusOK, gin.H{"logout": "succesful"})
}
