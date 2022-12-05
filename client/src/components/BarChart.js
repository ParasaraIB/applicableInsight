import React, { useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import Chart from "chart.js/auto";
import { listDocCounter } from "../store/actions/numberAction";

const BarChart = () => {
  const dispatch = useDispatch();

  const counters = useSelector(state => state.numberReducer.counters);

  useEffect(() => {
    dispatch(listDocCounter());
  }, [counters, dispatch]);

  return (
    counters &&
    <Bar 
      options = {
        {
          responsive: true,
          plugins: {
            legend: {
              display: false,
              position: "bottom",
            },
            title: {
              display: true,
              text: "Statistik Pengambilan Nomor Dokumen",
            },
          },
        }
      }
      data = {
        {
          labels: counters.map(data => data.label),
          datasets: [
            {
              label: "Jumlah Dokumen",
              data: counters.map(data => data.total),
              backgroundColor: [
                "rgba(75,192,192,1)",
                "#ecf0f1",
                "#50AF95",
                "#f3ba2f",
                "#2a71d0"
              ]
            }
          ]
        }
      }
    />
  );
}

export default BarChart;