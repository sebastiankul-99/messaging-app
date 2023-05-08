package db

import (
	"context"
	"fmt"
	"log"
	"strconv"
	"time"

	"github.com/sebastiankul-99/messaging-app/auth-service/models"
	"github.com/sebastiankul-99/messaging-app/auth-service/utils"
)

type sessionService struct {
	repository models.SessionRepository
	timeout    time.Duration
}

func NewSessionService(repository models.SessionRepository) models.SessionService {
	return &sessionService{
		repository,
		time.Duration(2) * time.Second,
	}
}

func (s *sessionService) CreateSession(c context.Context, userId int) (*models.Session, error) {

	expDate, sString, err := utils.CreateRefreshToken(int64(userId))
	if err != nil {
		return nil, err
	}
	session := &models.Session{
		UserID:       int64(userId),
		RefreshToken: sString,
		UserAgent:    "",
		IsBlocked:    false,
		ExpiresAt:    expDate,
	}

	ses, err := s.repository.CreateSession(c, session)
	if err != nil {
		return nil, err
	}
	return ses, nil
}

func (s *sessionService) RefreshAccessToken(c context.Context, req *models.RefreshAccessTokenRequest) (*models.RefreshAccessTokenResponse, error) {
	ctx, cancel := context.WithTimeout(c, s.timeout)
	defer cancel()
	res := &models.RefreshAccessTokenResponse{}
	claims, err := utils.ValidateRefreshToken(req.RefreshToken)
	if err != nil {
		return nil, err
	}
	sessionId, err := strconv.Atoi(claims.ID)

	if err != nil {
		return nil, err

	}
	log.Println("ses: ", sessionId)
	ses, err := s.repository.GetSessionById(ctx, sessionId)

	if err != nil {
		return nil, err
	}

	usr, err := s.repository.GetUserById(ctx, sessionId)
	fmt.Println("USer :", usr)
	res.Email = usr.Email
	res.FirstName = usr.FirstName
	res.LastName = usr.LastName
	res.ID = strconv.Itoa(sessionId)

	if err != nil {
		return nil, err
	}
	log.Println("ses: ", ses)
	if ses.ExpiresAt.Before(time.Now()) {
		return nil, fmt.Errorf("access token expired")
	}
	if ses.IsBlocked {
		return nil, fmt.Errorf("refresh token was blocked")
	}
	expTime, accessTok, err := utils.CreateAccessToken(ses.UserID)
	if err != nil {
		return nil, fmt.Errorf("couldn't create access token: %v", err)
	}
	res.AccessToken = accessTok
	res.AccessTokenExpirationDate = expTime
	res.RefreshToken = req.RefreshToken
	if ses.ExpiresAt.Before(time.Now().Add(time.Hour * 24 * 7)) {
		newSes, _ := s.CreateSession(ctx, int(ses.UserID))
		res.RefreshToken = newSes.RefreshToken
	}
	return res, nil
}

func (s *sessionService) ValidateAccessToken(ctx context.Context, req *models.ValidateAccessTokenRequest) (*models.ValidateAccessTokenResponse, error) {
	_, cancel := context.WithTimeout(ctx, s.timeout)
	defer cancel()

	userId, err := utils.ValidateAccessToken(req.AccessToken)
	res := &models.ValidateAccessTokenResponse{UserID: userId}
	if err != nil {
		return nil, err
	}
	//expirationDate, token, err := utils.CreateAccessToken(int64(userId))

	if err != nil {
		return nil, err
	}
	//res.AccessToken = token
	//res.AccessTokenExpirationDate = expirationDate
	return res, nil
}
