package models

import (
	"context"
)

type User struct {
	ID        string `json:"id" db:"id"`
	FirstName string `json:"firstName" db:"first_name"`
	LastName  string `json:"lastName" db:"last_name"`
}

type GetUsersRequest struct {
	Name string `json:"name"`
}

type GetUsersResponse struct {
	ID        string `json:"id" db:"id"`
	FirstName string `json:"firstName" db:"first_name"`
	LastName  string `json:"lastName" db:"last_name"`
}

type SearchRepository interface {
	GetUsers(ctx context.Context, reqName *GetUsersRequest) ([]*User, error)
}
type SearchService interface {
	GetUsers(c context.Context, req *GetUsersRequest) ([]*User, error)
}
