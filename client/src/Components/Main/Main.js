import React, { useCallback, useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { ApiService } from '../../Services/ApiService';

import { Box, Button } from '@mui/material';
const api = new ApiService();

export const Main = () => {
  const [data, setData] = useState(undefined);
  const [showAvg, setShowAvg] = useState(true);
  const [showBalances, setShowBalances] = useState(false);
  const [showSp500, setShowSp500] = useState(true);

  const showAll = useCallback(() => {
    setShowAvg(true);
    setShowBalances(true);
    setShowSp500(true);
  }, []);

  const toggleAvg = useCallback(() => {
    setShowAvg(!showAvg);
  }, [showAvg]);

  const toggleBalances = useCallback(() => {
    setShowBalances(!showBalances);
  }, [showBalances]);

  const toggleSp500 = useCallback(() => {
    setShowSp500(!showSp500);
  }, [showSp500]);

  useEffect(() => {
    api.getData().then((externalData) => {
      setData(externalData);
    });
  }, []);

  console.log('data', data);

  return (
    <Box style={{ height: '100vh' }}>
      <Box
        sx={{
          display: 'flex',
          maxWidth: '70%',
          width: '100%',
          margin: '10px auto',
          justifyContent: 'space-between'
        }}
      >
        <Button variant="contained" onClick={showAll}>
          Show All
        </Button>
        <Button variant="contained" onClick={toggleSp500}>
          {showSp500 ? 'Hide' : 'Show'} S&P500 index
        </Button>
        <Button variant="contained" onClick={toggleBalances}>
          {showBalances ? 'Hide' : 'Show'} Account Balances Comparison
        </Button>
        <Button variant="contained" onClick={toggleAvg}>
          {showAvg ? 'Hide' : 'Show'} Moving Averages
        </Button>
      </Box>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart width={500} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {showSp500 && (
            <Line
              type="monotone"
              dataKey="value"
              stroke="#82ca9d"
              dot={false}
            />
          )}
          {showAvg && (
            <>
              <Line
                type="monotone"
                dataKey="avg50value"
                stroke="#ff0000"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="avg200value"
                stroke="#333aaa"
                dot={false}
              />
            </>
          )}
          {showBalances && (
            <>
              <Line
                type="monotone"
                dataKey="passiveAccountValue"
                stroke="#44ffff"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="activeAccountValue"
                stroke="#aaaaaa"
                dot={false}
              />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};
