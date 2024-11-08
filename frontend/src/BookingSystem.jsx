// BookingSystem.jsx
import React, { useState, useEffect } from 'react';
const BookingSystem = () => {
    const [courts, setCourts] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [userName, setUserName] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    useEffect(() => {
        fetchCourts();
        fetchBookings();
      }, []);

      const fetchCourts = async () => {
        try {
          const response = await fetch('http://localhost:8080/api/courts');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          console.log('Courts dataxxx:', data); // 添加调试信息
          setCourts(data);
        } catch (error) {
            // 显式提示连接失败
            alert(`无法连接到后端服务器: ${error.message}`);
            console.error('Loading bookings failed:', error);
        }
      }; 

      const fetchBookings = async () => {
        try {
          const response = await fetch('http://localhost:8080/api/bookings');
          if (!response.ok) {
            throw new Error('网络响应不正常');
          }
          const data = await response.json();
          console.log('Bookings data 222:', data); // 添加调试信息
          setBookings(data);
        } catch (error) {
          console.error('获取预订失败:', error);
        }
      };

      const handleBooking = async (courtId) => {
        if (!userName || !selectedDate || !selectedTime) {
          alert('请填写完整信息');
          return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                courtId: courtId,
                userName: userName,
                date: selectedDate,
                time: selectedTime,
            }),
            });
        
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            alert('Booking success！');
            fetchBookings();
            setUserName('');
            setSelectedDate('');
            setSelectedTime('');
        } catch(error) {
            alert(`Booking failed: ${error.message}`);
            console.error('Booking failed:', error);  
        } finally {
          // setLoading(false);
        }

      };
      return (
        <div className="App">
          <h1>场地预订系统</h1>
          
          <div className="booking-form">
            <input
              type="text"
              placeholder="您的姓名"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            >
              <option value="">选择时间</option>
              <option value="09:00">09:00</option>
              <option value="10:00">10:00</option>
              <option value="11:00">11:00</option>
              <option value="14:00">14:00</option>
              <option value="15:00">15:00</option>
              <option value="16:00">16:00</option>
            </select>
          </div>
    
          <div className="courts-container">
            <h2>可用场地</h2>
            <div className="courts-grid">
              {courts.map(court => (
                <div key={court.id} className="court-card">
                  <h3>{court.name}</h3>
                  <p>状态: {court.status}</p>
                  <button onClick={() => handleBooking(court.id)}>预订</button>
                </div>
              ))}
            </div>
          </div>
    
          <div className="bookings-container">
            <h2>预订记录</h2>
            <div className="bookings-list">
              {bookings.map(booking => (
                <div key={booking.id} className="booking-item">
                  <p>预订人: {booking.userName}</p>
                  <p>场地ID: {booking.courtId}</p>
                  <p>日期: {booking.date}</p>
                  <p>时间: {booking.time}</p>
                </div>
              ))}
            </div>
          </div>
            <style jsx>{`
                .App {
                    padding: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                
                .booking-form {
                    margin: 20px 0;
                    display: flex;
                    gap: 10px;
                }
                
                .booking-form input,
                .booking-form select {
                    padding: 8px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                }
                
                .courts-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 20px;
                    margin: 20px 0;
                }
                
                .court-card {
                    border: 1px solid #ddd;
                    padding: 15px;
                    border-radius: 8px;
                    background-color: #f9f9f9;
                }
                
                .court-card button {
                    background-color: #007bff;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                }
                
                .court-card button:hover {
                    background-color: #0056b3;
                }
                
                .bookings-list {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 15px;
                    margin-top: 20px;
                }
                
                .booking-item {
                    border: 1px solid #ddd;
                    padding: 10px;
                    border-radius: 4px;
                    background-color: #fff;
                }
            `}</style>
        </div>
      );
}

export default BookingSystem;