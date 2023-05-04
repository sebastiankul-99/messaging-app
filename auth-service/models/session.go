package models

import (
	"context"
	"time"
)

type Session struct {
	ID           int64     `json:"id" db:"id"`
	UserID       int64     `json:"userID" db:"user_id"`
	RefreshToken string    `json:"refreshToken" db:"refreshed_token"`
	UserAgent    string    `json:"userAgent" db:"user_agent"`
	ClientIP     string    `json:"clientIP" db:"client_ip"`
	IsBlocked    bool      `json:"isBlocked" db:"is_blocked"`
	ExpiresAt    time.Time `json:"expiresAt" db:"expires_at"`
	CreatedAt    time.Time `json:"createdAt" db:"created_at"`
}

type RefreshAccessTokenRequest struct {
	RefreshToken string `json:"refreshToken" db:"refreshed_token"`
}

type RefreshAccessTokenResponse struct {
	AccessToken               string    `json:"-" db:"-"`
	RefreshToken              string    `json:"refreshToken" db:"refreshed_token"`
	AccessTokenExpirationDate time.Time `json:"accessTokenExpirationDate" db:"-"`
}

type ValidateAccessTokenRequest struct {
	AccessToken string `json:"-" db:"-"`
}

type ValidateAccessTokenResponse struct {
	//AccessToken               string    `json:"-" db:"-"`
	//AccessTokenExpirationDate time.Time `json:"-" db:"-"`
	UserID string `json:"userId" db:"-"`
}
type SessionRepository interface {
	CreateSession(ctx context.Context, session *Session) (*Session, error)
	GetSessionById(ctx context.Context, sessionId int) (*Session, error)
}

type SessionService interface {
	CreateSession(ctx context.Context, userID int) (*Session, error)
	RefreshAccessToken(ctx context.Context, req *RefreshAccessTokenRequest) (*RefreshAccessTokenResponse, error)
	ValidateAccessToken(ctx context.Context, req *ValidateAccessTokenRequest) (*ValidateAccessTokenResponse, error)
}
