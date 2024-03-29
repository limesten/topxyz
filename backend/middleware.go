package main

import (
	"context"
	"fmt"
	"net/http"
	"strconv"

	"golang.org/x/time/rate"

	"github.com/emilmalmsten/my_top_xyz/backend/internal/auth"
)

type contextKey string

const userIDKey contextKey = "userID"

func (cfg *apiConfig) validateJWT(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		token, err := auth.GetBearerToken(r.Header)
		if err != nil {
			fmt.Println(err)
			respondWithError(w, http.StatusUnauthorized, "Couldn't find JWT")
			return
		}
		userIDString, err := auth.ValidateJWT(token, cfg.jwtSecret)
		if err != nil {
			fmt.Println(err)
			respondWithError(w, http.StatusUnauthorized, "Couldn't validate JWT")
			return
		}

		userID, err := strconv.Atoi(userIDString)
		if err != nil {
			respondWithError(w, http.StatusBadRequest, "Couldn't parse user ID")
			return
		}

		ctx := context.WithValue(r.Context(), userIDKey, userID)
		r = r.WithContext(ctx)

		next.ServeHTTP(w, r)
	})
}

func rateLimiter(next http.Handler) http.Handler {
    limiter := rate.NewLimiter(1, 100)
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        if !limiter.Allow() {
            message := "The API is at capacity, try again later."
            http.Error(w, message, http.StatusTooManyRequests)
            return
        }
        next.ServeHTTP(w, r)
    })
}