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

type userService struct {
	repository models.UserRepository
	timeout    time.Duration
}

func NewUserService(repository models.UserRepository) models.UserService {
	return &userService{
		repository,
		time.Duration(2) * time.Second,
	}
}

func (s *userService) CreateUser(c context.Context, req *models.CreateUserRequest) (*models.CreateUserResponse, error) {
	ctx, cancel := context.WithTimeout(c, s.timeout)
	defer cancel()
	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		log.Println("couldnt hash password: ", err.Error())
		return nil, err
	}
	user := &models.User{
		FirstName:    req.FirstName,
		LastName:     req.LastName,
		Email:        req.Email,
		HashPassword: hashedPassword,
		Salt:         "salt",
	}

	r, err := s.repository.CreateUser(ctx, user)
	if err != nil {
		log.Println("couldnt create user: ", err.Error())
		return nil, err
	}
	res := &models.CreateUserResponse{
		ID:        strconv.Itoa(int(r.ID)),
		FirstName: r.FirstName,
		LastName:  r.LastName,
		Email:     r.Email,
	}
	return res, nil
}

func (s *userService) LogIn(ctx context.Context, req *models.LoginUserRequest) (*models.LoginUserResponse, error) {

	c, cancel := context.WithTimeout(ctx, s.timeout)
	defer cancel()

	r, err := s.repository.GetUserByEmail(c, req.Email)
	if err != nil {
		log.Println("coudnt get user ", err.Error())
		return nil, fmt.Errorf("invalid password : " + err.Error())
	}
	err = utils.CheckPassword(req.Password, r.HashPassword)
	if err != nil {
		log.Println("invalid password", err.Error())
		return nil, fmt.Errorf("invalid password")
	}
	expiresAt, accessToken, err := utils.CreateAccessToken(r.ID)
	if err != nil {
		return nil, err
	}
	return &models.LoginUserResponse{
		AccessToken:               accessToken,
		AccessTokenExpirationDate: expiresAt,
		ID:                        strconv.Itoa(int(r.ID)),
		FirstName:                 r.FirstName,
		LastName:                  r.LastName,
		Email:                     r.Email,
	}, nil
}
