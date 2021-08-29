import React from 'react';

import { useParams } from 'react-router-dom';
import Button from '@material-ui/core/Button';

import {
    AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Area, ResponsiveContainer, PieChart, Pie, Cell, BarChart,
    Bar,
    Legend,
    LabelList
} from 'recharts';

import PATHS from '../../paths';
import { KeyboardReturnSharp } from '@material-ui/icons';

const renderCustomizedLabelBarChart = (props: any) => {
    const { x, y, width, value } = props;
    const radius = 20;

    return (
        <g>
            <circle cx={x + width / 2} cy={y - radius} r={radius} fill="#8884d8" />
            <text
                x={x + width / 2}
                y={y - radius}
                fill="#fff"
                textAnchor="middle"
                dominantBaseline="middle"
            >
                {value}
            </text>
        </g>
    );
}

function MonthlyAnalysis({ props, data }) {
    const month = useParams().id;
    const urlIsValid = month >= 1 && month <= 12 ? true : false;
    const monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const currentMonth = urlIsValid ? monthName[month - 1] : "";

    const companiesMonthlyFinancialData = data.map((dataPoint) => {
        return {
            "Country": dataPoint.Country,
            "Company": dataPoint.Company,
            "Revenue": dataPoint[currentMonth],
        }
    })

    const countriesMonthlyFinancialDataMap = new Map();
    const countriesMonthlyFinancialBarChartData = new Array();

    companiesMonthlyFinancialData.map((dataPoint) => {
        countriesMonthlyFinancialDataMap[dataPoint.Country] = countriesMonthlyFinancialDataMap[dataPoint.Country] ? countriesMonthlyFinancialDataMap[dataPoint.Country] + dataPoint.Revenue : dataPoint.Revenue;
    })


    for (let k in countriesMonthlyFinancialDataMap) {
        countriesMonthlyFinancialBarChartData.push({ name: k, value: countriesMonthlyFinancialDataMap[k] });
    }

    const companiesMonthlyFinancialBarChartData = companiesMonthlyFinancialData.map((dataPoint) => {
        return {
            name: dataPoint.Company,
            value: dataPoint.Revenue
        }
    })

    console.log("companies ", companiesMonthlyFinancialData);

    return (
        <div>
            <div className="country-list" style={{ marginBottom: 20, paddingTop: 20, width: '100%', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
                {
                    monthName.map((month, index) => {
                        const monthlyAnalysispath = PATHS.ANALYTICS_MONTHLY.replace(':id', index + 1);
                        console.log("Index Month ", index, " ", month);
                        return (
                            <Button variant="contained" color="primary" onClick={() => props.history.push(monthlyAnalysispath)} style={{ marginBottom: 10 }}>
                                {month}
                            </Button>
                        )
                    })
                }
            </div>
            {urlIsValid ?
                <div>
                    <h1 style={{ textAlign: 'center' }}>{currentMonth}'s Analysis</h1>
                    <div className="charts" style={{ justifyContent: 'space-between' }}>
                        <div className="chart-item">
                            <ResponsiveContainer width={400} height={400}>
                                <BarChart
                                    width={300}
                                    height={300}
                                    data={companiesMonthlyFinancialBarChartData}
                                    margin={{
                                        top: 50,
                                        right: 10,
                                        left: 20,
                                        bottom: 5
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="1 1" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="value" fill="#8884d8" minPointSize={5}>
                                        <LabelList dataKey="name" content={renderCustomizedLabelBarChart} />
                                    </Bar>
                                    {/* <Bar dataKey="uv" fill="#82ca9d" minPointSize={10} /> */}
                                </BarChart>
                            </ResponsiveContainer>
                            <h3 style={{ textAlign: 'center' }}>Company's Share in month of {currentMonth}</h3>
                        </div>
                        <div className="chart-item">
                            <ResponsiveContainer width={400} height={400}>
                                <BarChart
                                    width={300}
                                    height={300}
                                    data={countriesMonthlyFinancialBarChartData}
                                    margin={{
                                        top: 50,
                                        right: 10,
                                        left: 20,
                                        bottom: 5
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="1 1" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="value" fill="#8884d8" minPointSize={5}>
                                        <LabelList dataKey="name" content={renderCustomizedLabelBarChart} />
                                    </Bar>
                                    {/* <Bar dataKey="uv" fill="#82ca9d" minPointSize={10} /> */}
                                </BarChart>
                            </ResponsiveContainer>
                            <h3 style={{ textAlign: 'center' }}>Country's Share in month of {currentMonth}</h3>
                        </div>
                    </div>
                </div>
                :
                <div>
                    <h1 style={{ textAlign: 'center', color: 'red' }}>Sorry Url parameters are incorrect. It doesn't map to any valid month.</h1>
                </div>
            }
        </div>
    );
}

export default MonthlyAnalysis;