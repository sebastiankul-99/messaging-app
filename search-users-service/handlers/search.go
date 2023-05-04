package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sebastiankul-99/messaging-app/search-users-service/models"
)

type SearchHandler struct {
	models.SearchService
}

func NewSearchHandler(u models.SearchService) *SearchHandler {
	return &SearchHandler{
		SearchService: u,
	}
}

func (h *SearchHandler) GetUsers(c *gin.Context) {
	u := &models.GetUsersRequest{}
	//var er bool
	if u.Name = c.Request.URL.Query().Get("name"); u.Name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No parameter"})
		return
	}

	res, err := h.SearchService.GetUsers(c.Request.Context(), u)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, res)
}
