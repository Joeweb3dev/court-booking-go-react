package main

import (
	// "database/sql"
	// "log"
	// "os"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	// _"github.com/denisenkom/go-mssqldb"
)

type Court struct {
	ID     int    `json:"id"`
	Name   string `json:"name"`
	Status string `json:"status"`
}

// 存储预订信息的结构
type Booking struct {
	ID       int    `json:"id"`
	CourtID  int    `json:"courtId"`
	UserName string `json:"userName"`
	Date     string `json:"date"`
	Time     string `json:"time"`
}

var courts = []Court{
	{ID: 1, Name: "场地A", Status: "可用"},
	{ID: 2, Name: "场地B", Status: "可用"},
	{ID: 3, Name: "场地C", Status: "可用"},
}

// 使用内存存储预订信息（实际应用中应该使用数据库）
var bookings []Booking

func main() {
	r := gin.Default()

	// 配置CORS
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"}
	config.AllowMethods = []string{"GET", "POST"}
	r.Use(cors.New(config))

	// API路由
	r.GET("/api/courts", getCourts)
	r.POST("/api/book", createBooking)
	r.GET("/api/bookings", getBookings)

	r.Run(":8080")
}

func getCourts(c *gin.Context) {
	c.JSON(http.StatusOK, courts)
}

func createBooking(c *gin.Context) {
	var booking Booking
	if err := c.ShouldBindJSON(&booking); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	booking.ID = len(bookings) + 1
	bookings = append(bookings, booking)

	c.JSON(http.StatusOK, booking)
}

func getBookings(c *gin.Context) {
	c.JSON(http.StatusOK, bookings)
}
