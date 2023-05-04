package db

import (
	"context"
	"errors"
	"log"

	"github.com/sebastiankul-99/messaging-app/auth-service/models"
)

func NewUserRepository(db DBTX) models.UserRepository {
	return &repository{db}
}
func (r *repository) CreateUser(ctx context.Context, user *models.User) (*models.User, error) {
	var lastInsertInt int
	query := "INSERT INTO users(first_name, last_name, email, hash_password, salt) VALUES($1, $2, $3, $4, $5) returning id"
	err := r.db.QueryRowContext(ctx, query, user.FirstName, user.LastName,
		user.Email, user.HashPassword, user.Salt).Scan(&lastInsertInt)

	if err != nil {
		log.Println("couldnt insert user into table: ", err.Error())
		return nil, err
	}
	user.ID = int64(lastInsertInt)
	return user, nil
}
func (r *repository) GetUserByEmail(ctx context.Context, email string) (*models.User, error) {
	u := models.User{}
	query := "SELECT id, first_name, last_name, email, hash_password, salt FROM users WHERE email = $1"
	err := r.db.QueryRowContext(ctx, query, email).Scan(&u.ID, &u.FirstName, &u.LastName, &u.Email, &u.HashPassword, &u.Salt)
	if err != nil {
		return nil, nil
	}
	if u.Email == "" {
		return nil, errors.New("email is not registered")
	}

	return &u, nil
}
