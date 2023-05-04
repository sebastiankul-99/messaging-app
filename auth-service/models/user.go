package models

import (
	"context"
	"time"
)

type User struct {
	ID           int64  `json:"id" db:"id"`
	FirstName    string `json:"firstName" db:"first_name"`
	LastName     string `json:"lastName" db:"last_name"`
	Email        string `json:"email" db:"email"`
	HashPassword string `json:"password" db:"hash_password"`
	Salt         string `json:"-" db:"salt"`
}

type CreateUserRequest struct {
	FirstName string `json:"firstName" db:"first_name"`
	LastName  string `json:"lastName" db:"last_name"`
	Email     string `json:"email" db:"email"`
	Password  string `json:"password" db:"hash_password"`
}

type CreateUserResponse struct {
	ID        string `json:"id" db:"id"`
	FirstName string `json:"firstName" db:"first_name"`
	LastName  string `json:"lastName" db:"last_name"`
	Email     string `json:"email" db:"email"`
}

type LoginUserRequest struct {
	Email    string `json:"email" db:"email"`
	Password string `json:"password" db:"hash_password"`
}

type LoginUserResponse struct {
	AccessToken               string
	AccessTokenExpirationDate time.Time `json:"accessTokenExpirationDate" db:"-"`
	ID                        string    `json:"id" db:"id"`
	SessionID                 string    `json:"-" db:"-"`
	SessionExpirationDate     time.Time `json:"-" db:"-"`
	FirstName                 string    `json:"firstName" db:"first_name"`
	LastName                  string    `json:"lastName" db:"last_name"`
	Email                     string    `json:"email" db:"email"`
}

type UserRepository interface {
	CreateUser(ctx context.Context, user *User) (*User, error)
	GetUserByEmail(ctx context.Context, email string) (*User, error)
}
type UserService interface {
	CreateUser(c context.Context, req *CreateUserRequest) (*CreateUserResponse, error)
	LogIn(ctx context.Context, req *LoginUserRequest) (*LoginUserResponse, error)
}
