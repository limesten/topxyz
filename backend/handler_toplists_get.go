package main

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/emilmalmsten/my_top_xyz/backend/internal/database"
	"github.com/go-chi/chi"
)

func (cfg *apiConfig) handlerToplistsGetOne(w http.ResponseWriter, r *http.Request) {
	toplistIDString := chi.URLParam(r, "toplistID")
	toplistID, err := strconv.Atoi(toplistIDString)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid toplist ID")
		return
	}

	dbToplist, err := cfg.DB.GetToplist(toplistID)
	if err != nil {
		log.Println(err)
		if errors.Is(err, database.ErrNotExist) {
			respondWithError(w, http.StatusNotFound, "Toplist does not exist")
			return
		}
		respondWithError(w, http.StatusInternalServerError, "Error when trying to get toplist")
		return
	}

	respondWithJSON(w, http.StatusOK, dbToplist)
}

func (cfg apiConfig) handlerToplistsGetMany(w http.ResponseWriter, r *http.Request) {
	pageIDString := r.URL.Query().Get("page_id")
	pageID, err := strconv.Atoi(pageIDString)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid page ID parameter")
		return
	}
	if pageID < 1 {
		respondWithError(w, http.StatusBadRequest, "Page ID value needs to be minimum 1")
		return
	}

	pageSizeString := r.URL.Query().Get("page_size")
	pageSize, err := strconv.Atoi(pageSizeString)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid page size parameter")
		return
	}
	maxPageSize := 20
	if pageSize < 1 || pageSize > maxPageSize {
		respondWithError(w, http.StatusBadRequest, fmt.Sprintf("Page size needs to be min 1 and max %d", maxPageSize))
		return
	}

	offset := (pageID - 1) * pageSize
	toplists, err := cfg.DB.ListToplists(pageSize, offset)
	if err != nil {
		log.Println(err)
		respondWithError(w, http.StatusInternalServerError, "Failed to get toplists")
		return
	}

	respondWithJSON(w, http.StatusOK, toplists)
}

func (cfg apiConfig) handlerToplistsGetRecent(w http.ResponseWriter, r *http.Request) {
	pageSizeString := r.URL.Query().Get("page_size")
	pageSize, err := strconv.Atoi(pageSizeString)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid page size parameter")
		return
	}
	maxPageSize := 100
	if pageSize < 1 || pageSize > maxPageSize {
		respondWithError(w, http.StatusBadRequest, fmt.Sprintf("Page size needs to be min 1 and max %d", maxPageSize))
		return
	}

	toplistFilterProp := "date"
	toplists, err := cfg.DB.ListToplistsByProperty(pageSize, toplistFilterProp)
	if err != nil {
		log.Println(err)
		respondWithError(w, http.StatusInternalServerError, "Failed to get toplists")
		return
	}

	respondWithJSON(w, http.StatusOK, toplists)
}

func (cfg apiConfig) handlerToplistsGetPopular(w http.ResponseWriter, r *http.Request) {
	pageSizeString := r.URL.Query().Get("page_size")
	pageSize, err := strconv.Atoi(pageSizeString)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid page size parameter")
		return
	}
	maxPageSize := 100
	if pageSize < 1 || pageSize > maxPageSize {
		respondWithError(w, http.StatusBadRequest, fmt.Sprintf("Page size needs to be min 1 and max %d", maxPageSize))
		return
	}

	toplistFilterProp := "views"
	toplists, err := cfg.DB.ListToplistsByProperty(pageSize, toplistFilterProp)
	if err != nil {
		log.Println(err)
		respondWithError(w, http.StatusInternalServerError, "Failed to get toplists")
		return
	}

	respondWithJSON(w, http.StatusOK, toplists)
}

func (cfg apiConfig) handlerToplistsGetLiked(w http.ResponseWriter, r *http.Request) {
	pageSizeString := r.URL.Query().Get("page_size")
	pageSize, err := strconv.Atoi(pageSizeString)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid page size parameter")
		return
	}
	maxPageSize := 100
	if pageSize < 1 || pageSize > maxPageSize {
		respondWithError(w, http.StatusBadRequest, fmt.Sprintf("Page size needs to be min 1 and max %d", maxPageSize))
		return
	}

	toplistFilterProp := "likes"
	toplists, err := cfg.DB.ListToplistsByProperty(pageSize, toplistFilterProp)
	if err != nil {
		log.Println(err)
		respondWithError(w, http.StatusInternalServerError, "Failed to get toplists")
		return
	}

	respondWithJSON(w, http.StatusOK, toplists)
}

func (cfg apiConfig) handlerToplistsByUser(w http.ResponseWriter, r *http.Request) {
	userIDString := chi.URLParam(r, "userID")
	userID, err := strconv.Atoi(userIDString)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid user ID")
		return
	}

	limit := 50
	offset := 0

	toplists, err := cfg.DB.ListToplistsByUser(userID, limit, offset)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to get toplists")
		return
	}

	respondWithJSON(w, http.StatusOK, toplists)
}
