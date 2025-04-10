import React from 'react';
import { useSelector } from 'react-redux';
import { Line, Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const LinkChart = () => {
  const links = useSelector((state) => state.links.list);

  // Generate dynamic line chart (last 5 links with clicks)
  const recentLinks = links.slice(0, 5).reverse(); // oldest to latest
  const lineChartData = {
    labels: recentLinks.map(link => link.createdAt.split(',')[0]),
    datasets: [
      {
        label: 'Clicks',
        data: recentLinks.map(link => link.clicks),
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  // Dummy Pie Chart
  const pieChartData = {
    labels: ['Chrome', 'Firefox', 'Edge'],
    datasets: [
      {
        data: [55, 30, 15],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <h5>Clicks Over Time</h5>
      <Line data={lineChartData} className="mb-4" />
      <h5>Device Distribution</h5>
      <Pie data={pieChartData} />
    </>
  );
};

export default LinkChart;

