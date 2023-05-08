package handlers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sebastiankul-99/messaging-app/auth-service/models"
)

type SessionHandler struct {
	models.SessionService
}

func NewSessionHandler(s models.SessionService) *SessionHandler {
	return &SessionHandler{
		SessionService: s,
	}
}

func (h *SessionHandler) RefreshAccess(c *gin.Context) {
	var req = &models.RefreshAccessTokenRequest{}
	refToken, err := c.Cookie("quetal-refresh-token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	req.RefreshToken = refToken
	res, err := h.SessionService.RefreshAccessToken(c, req)

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		c.SetCookie("quetal-refresh-token", "", -1, "", "", false, true)
		return
	}
	if res.RefreshToken != req.RefreshToken {
		log.Println("changing access token")
		c.SetCookie("quetal-refresh-token", res.RefreshToken, 60*60*24*30, "/", "localhost", false, true)
	}
	c.Header("quetal-access-token", res.AccessToken)
	res.AccessToken = ""
	c.JSON(http.StatusOK, res)
}

func (h *SessionHandler) ValidateAccess(c *gin.Context) {

	accessToken := c.GetHeader("bearer")
	if accessToken == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "no access token"})
	}
	req := &models.ValidateAccessTokenRequest{AccessToken: accessToken}
	res, err := h.ValidateAccessToken(c, req)

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
	}
	//c.Header("quetal-access-token", res.AccessToken)
	c.JSON(http.StatusOK, res)
}
