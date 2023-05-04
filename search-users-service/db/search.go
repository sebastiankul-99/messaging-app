package db

import (
	"context"
	"fmt"
	"strconv"

	"github.com/sebastiankul-99/messaging-app/search-users-service/models"
)

func NewUserRepository(db DBTX) models.SearchRepository {
	return &repository{db}
}
func (r *repository) GetUsers(ctx context.Context, reqName *models.GetUsersRequest) ([]*models.User, error) {

	users := []*models.User{}
	fmt.Println("Name = ", reqName.Name)
	query := "SELECT id, first_name, last_name from users where to_tsvector(first_name || ' ' || last_name) @@ to_tsquery($1)"
	rows, err := r.db.QueryContext(ctx, query, reqName.Name)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var id int
		usr := models.User{}
		if err := rows.Scan(&id, &usr.FirstName, &usr.LastName); err != nil {
			return users, err
		}
		usr.ID = strconv.Itoa(id)
		users = append(users, &usr)
	}
	if err = rows.Err(); err != nil {
		return users, err
	}

	return users, nil
}
