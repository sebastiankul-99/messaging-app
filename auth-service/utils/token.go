package utils

import (
	"fmt"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

const (
	secretKey = "secret"
)

type MyJWTClaims struct {
	ID string `json:"id"`
	jwt.RegisteredClaims
}

func CreateAccessToken(userId int64) (time.Time, string, error) {
	expiresAt := time.Now().Add(15 * time.Minute)
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, MyJWTClaims{
		ID: strconv.Itoa(int(userId)),
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    strconv.Itoa(int(userId)),
			ExpiresAt: jwt.NewNumericDate(expiresAt),
		},
	})
	sString, err := token.SignedString([]byte(secretKey))
	return expiresAt, sString, err
}

func CreateRefreshToken(userId int64) (time.Time, string, error) {
	expiresDate := time.Now().Add(24 * time.Hour * 30)
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, MyJWTClaims{
		ID: strconv.Itoa(int(userId)),
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    strconv.Itoa(int(userId)),
			ExpiresAt: jwt.NewNumericDate(expiresDate),
		},
	})
	sString, err := token.SignedString([]byte(secretKey))
	return expiresDate, sString, err
}

func ValidateRefreshToken(refreshToken string) (*MyJWTClaims, error) {

	claims := &MyJWTClaims{}

	token, err := jwt.ParseWithClaims(refreshToken, claims, func(token *jwt.Token) (interface{}, error) {
		// since we only use the one private key to sign the tokens,
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("invalid token")
		}
		return []byte(secretKey), nil
	})
	if err != nil {
		return claims, err
	}
	if !token.Valid {
		return claims, fmt.Errorf("token expired")

	}
	return claims, nil
}

func ValidateAccessToken(accessToken string) (string, error) {

	claims := &MyJWTClaims{}

	token, err := jwt.ParseWithClaims(accessToken, claims, func(token *jwt.Token) (interface{}, error) {
		// since we only use the one private key to sign the tokens,
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("invalid token")
		}
		return []byte(secretKey), nil
	})
	if err != nil {
		return "", err
	}
	if !token.Valid {
		return "", fmt.Errorf("token expired")

	}

	return claims.ID, nil
}
