// backend/db/db.go

// backend/db/db.go
package db

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"os"

	_ "github.com/denisenkom/go-mssqldb"
)

type Config struct {
	Database struct {
		Server            string `json:"server"`
		Port              int    `json:"port"`
		Database          string `json:"database"`
		TrustedConnection bool   `json:"trusted_connection"`
	} `json:"database"`
}

var DB *sql.DB

func InitDB() {
	config := loadConfig()

	// Windows 身份验证的连接字符串
	connString := fmt.Sprintf(
		"server=%s;database=%s;port=%d;trusted_connection=yes",
		config.Database.Server,
		config.Database.Database,
		config.Database.Port,
	)

	var err error
	DB, err = sql.Open("sqlserver", connString)
	if err != nil {
		log.Fatal("Error connecting to database:", err)
	}

	err = DB.Ping()
	if err != nil {
		log.Fatal("Error pinging database:", err)
	}

	log.Println("Successfully connected to database")
}

func loadConfig() Config {
	file, err := os.Open("config/config.json")
	if err != nil {
		log.Fatal("Error opening config file:", err)
	}
	defer file.Close()

	var config Config
	decoder := json.NewDecoder(file)
	err = decoder.Decode(&config)
	if err != nil {
		log.Fatal("Error decoding config file:", err)
	}

	return config
}

/*****
package db

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"os"

	_ "github.com/denisenkom/go-mssqldb"
)

type Config struct {
	Database struct {
		Server   string `json:"server"`
		Port     int    `json:"port"`
		Database string `json:"database"`
		Username string `json:"username"`
		Password string `json:"password"`
	} `json:"database"`
}

var DB *sql.DB

func InitDB() {
	// 读取配置文件
	config := loadConfig()

	// 构建连接字符串
	connString := fmt.Sprintf(
		"server=%s;database=%s;user id=%s;password=%s;port=%d;encrypt=disable",
		config.Database.Server,
		config.Database.Database,
		config.Database.Username,
		config.Database.Password,
		config.Database.Port,
	)

	var err error
	DB, err = sql.Open("sqlserver", connString)
	if err != nil {
		log.Fatal("Error connecting to database:", err)
	}

	err = DB.Ping()
	if err != nil {
		log.Fatal("Error pinging database:", err)
	}

	log.Println("Successfully connected to database")
}

func loadConfig() Config {
	file, err := os.Open("config/config.json")
	if err != nil {
		log.Fatal("Error opening config file:", err)
	}
	defer file.Close()

	var config Config
	decoder := json.NewDecoder(file)
	err = decoder.Decode(&config)
	if err != nil {
		log.Fatal("Error decoding config file:", err)
	}

	return config
}

*/
