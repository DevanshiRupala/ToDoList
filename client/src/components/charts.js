import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { useLocation, useNavigate } from 'react-router-dom';
import { Chart as ChartJS, registerables } from 'chart.js';
import axios from 'axios';
import '../components/charts.css';

ChartJS.register(...registerables);

const CompletedTasksChart = () => {
  const [chartData1, setChartData1] = useState(""); // Chart data for the first chart
  const [chartData2, setChartData2] = useState(""); // Chart data for the second chart
  const location = useLocation();
  const { email } = location.state || {};
  const [labels1, setLabels1] = useState([]); 
  const [labels2, setLabels2] = useState([]); // Initialize labels array
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]); // Data for the second chart
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8000/showcharts?email=${email}`)
      .then((response) => {
        const t1 = response.data.tasksByMonth;
        const t2 = response.data.expiredTasksByMonth;
        console.log(t2);
        console.log(t1);
        const newLabels1 = [];
        const newLabels2 = [];
        const newData1 = [];
        const newData2 = []; // Initialize data for the second chart
        t1.forEach((entry) => {
          newLabels1.push(getMonthName(entry._id));
          newData1.push(entry.count);
        });

        t2.forEach((entry) => {
          newLabels2.push(getMonthName(entry._id));
          newData2.push(entry.count);
        });

        setLabels1(newLabels1); // Set labels array
        setData1(newData1); 
        setLabels2(newLabels2)// Set data1 array
        setData2(newData2); // Set data2 array for the second chart

        const newChartData1 = {
          labels: newLabels1,
          datasets: [
            {
              label: 'Tasks Completed',
              data: newData1,
              fill: true,
              backgroundColor: 'rgb(255, 255, 143,0.3)', // Modify chart colors as needed
              borderColor: '#FFC300',
              tension: 2,
              borderWidth: 2,
            },
          ],
        };

        const newChartData2 = {
          labels: newLabels2,
          datasets: [
            {
              label: 'Tasks Not Completed',
              data: newData2,
              fill: true,
              backgroundColor: 'rgb(255, 255, 143,0.3)', // Modify chart colors as needed
              borderColor: '#FFC300',
              tension: 2,
              borderWidth: 2,
            },
          ],
        };

        setChartData1(newChartData1); // Set the chart data for the first chart
        setChartData2(newChartData2); // Set the chart data for the second chart
      })
      .catch((error) => {
        console.error('Error fetching data: ', error);
      });
  }, [email]);

  function getMonthName(monthNumber) {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  
    if (monthNumber >= 1 && monthNumber <= 12) {
      return monthNames[monthNumber - 1];
    } else {
      return 'Invalid Month';
    }
  }

  const onback = () => {
    navigate("/home",{state : {email}});
  }

  const onlogout = () => {
    localStorage.removeItem('login');
    navigate("/");
  }

  return (
    <>
    <div className="header">
  <button className="button" onClick={onback}> &#9664;</button>
  <button className="button" onClick={onlogout}><i className='fa fa-power-off'></i></button>
</div>
    <div className="chart-container">
  <div className="chart">
    <h2 className="chart-title">Chart: Tasks Completed through out the Months</h2>
    {chartData1 ? <Bar data={chartData1} /> : <p>Loading chart data...</p>}
  </div>
  <div className="chart">
    <h2 className="chart-title">Chart: Task not completed before Due Dates</h2>
    {chartData2 ? <Line data={chartData2} /> : <p>Loading chart data...</p>}
  </div>
</div>
</>
  );
};

export default CompletedTasksChart;
