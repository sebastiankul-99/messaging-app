package db

import (
	"context"
	"log"
	"strings"
	"time"

	"github.com/sebastiankul-99/messaging-app/search-users-service/models"
)

type searchService struct {
	repository models.SearchRepository
	timeout    time.Duration
}

func NewSearchService(repository models.SearchRepository) models.SearchService {
	return &searchService{
		repository,
		time.Duration(5) * time.Second,
	}
}

func (s *searchService) GetUsers(c context.Context, req *models.GetUsersRequest) ([]*models.User, error) {
	ctx, cancel := context.WithTimeout(c, s.timeout)
	defer cancel()

	req.Name = strings.ReplaceAll(req.Name, " ", "+")
	req.Name = req.Name + ":*"

	r, err := s.repository.GetUsers(ctx, req)
	if err != nil {
		log.Println("couldnt create user: ", err.Error())
		return nil, err
	}

	return r, nil
}
