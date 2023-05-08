package db

import (
	"context"
	"log"

	"github.com/sebastiankul-99/messaging-app/auth-service/models"
)

func NewSessionRepository(db DBTX) models.SessionRepository {
	return &repository{db}
}
func (r *repository) CreateSession(ctx context.Context, session *models.Session) (*models.Session, error) {
	var lastInsertId int
	query := "INSERT INTO sessions(user_id, refreshed_token, user_agent, client_ip, expires_at) VALUES($1, $2, $3, $4, $5) returning id"
	err := r.db.QueryRowContext(ctx, query, session.UserID, session.RefreshToken,
		session.UserAgent, session.ClientIP, session.ExpiresAt).Scan(&lastInsertId)

	if err != nil {
		log.Println("couldnt insert session into table: ", err.Error())
		return nil, err
	}
	session.ID = int64(lastInsertId)
	return session, nil
}
func (r *repository) GetSessionById(ctx context.Context, sessionId int) (*models.Session, error) {
	s := models.Session{}
	query := "SELECT id, user_id, refreshed_token, user_agent, client_ip, is_blocked, expires_at, created_at FROM sessions WHERE id = $1"
	err := r.db.QueryRowContext(ctx, query, sessionId).Scan(
		&s.ID, &s.UserID, &s.RefreshToken, &s.UserAgent, &s.ClientIP, &s.IsBlocked, &s.ExpiresAt, &s.CreatedAt)
	log.Println(err)
	if err != nil {
		return nil, err
	}

	return &s, nil
}

func (r *repository) GetUserById(ctx context.Context, id int) (*models.RefreshAccessTokenResponse, error) {
	u := &models.RefreshAccessTokenResponse{}
	query := "SELECT first_name, last_name, email FROM users WHERE id = $1"
	err := r.db.QueryRowContext(ctx, query, id).Scan(&u.FirstName, &u.LastName, &u.Email)
	if err != nil {
		return nil, err
	}
	return u, nil
}
