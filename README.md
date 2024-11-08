This is a tennis court booking system, with the backend written in Go and the frontend using the React framework. Currently, there is no database integrated; this demo is for educational purposes only. In the future, Microsoft SQL or MySQL will be added as the database.

Deployment:
After sending the POST command using the httpie tool, you can see the display on the front end. The post message is as below:
{
  "courtId": 1,
  "userName": "Jack",
  "date": "2023-10-02",
  "time": "10:00"
}
