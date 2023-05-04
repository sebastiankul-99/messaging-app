package db

import (
	"context"
	"database/sql"

	_ "github.com/lib/pq"
)

type Database struct {
	db *sql.DB
}

func NewDatabase() (*Database, error) {
	db, err := sql.Open("postgres", "postgresql://dbuser:user@localhost:5432/auth?sslmode=disable")
	if err != nil {
		return nil, err
	}
	return &Database{db: db}, err
}

func (db *Database) Close() {
	db.db.Close()
}

func (d *Database) GetDB() *sql.DB {
	return d.db
}

type DBTX interface {
	ExecContext(ctx context.Context, query string, args ...interface{}) (sql.Result, error)
	PrepareContext(context.Context, string) (*sql.Stmt, error)
	QueryContext(context.Context, string, ...interface{}) (*sql.Rows, error)
	QueryRowContext(context.Context, string, ...interface{}) *sql.Row
}

type repository struct {
	db DBTX
}
