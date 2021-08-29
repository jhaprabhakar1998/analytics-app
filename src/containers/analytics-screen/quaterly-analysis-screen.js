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
import { red } from '@material-ui/core/colors';

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

function QuaterlyAnalysis({ props, data }) {

    const quarter = useParams().id;
    const urlIsValid = quarter >= 1 && quarter <= 4 ? true : false;
    const quarterName = ["January - March Quarter", "April - June Quarter", "July - September Quarter", "October - December Quarter"];

    const currentQuarter = urlIsValid ? quarterName[quarter - 1] : "";

    const companiesQuarterlyFinancialData = data.map((dataPoint) => {
        let quarterlyRevenue = 0;
        if (quarter == 1) { quarterlyRevenue = dataPoint.January + dataPoint.February + dataPoint.March; }
        if (quarter == 2) { quarterlyRevenue = dataPoint.April + dataPoint.May + dataPoint.June; }
        if (quarter == 3) { quarterlyRevenue = dataPoint.July + dataPoint.August + dataPoint.September; }
        if (quarter == 4) { quarterlyRevenue = dataPoint.October + dataPoint.November + dataPoint.December; }
        return {
            "Country": dataPoint.Country,
            "Company": dataPoint.Company,
            "Revenue": quarterlyRevenue,
        }
    });

    console.log("chsdk s", companiesQuarterlyFinancialData);

    const companiesQuarterlyFinancialBarChartData = companiesQuarterlyFinancialData.map((dataPoint) => {
        return {
            name: dataPoint.Company,
            value: dataPoint.Revenue
        }
    })

    const countriesQuarterlyFinancialDataMap = new Map();
    const countriesQuarterlyFinancialBarChartData = new Array();

    companiesQuarterlyFinancialData.map((dataPoint) => {
        countriesQuarterlyFinancialDataMap[dataPoint.Country] = countriesQuarterlyFinancialDataMap[dataPoint.Country] ? countriesQuarterlyFinancialDataMap[dataPoint.Country] + dataPoint.Revenue : dataPoint.Revenue;
    })


    for (let k in countriesQuarterlyFinancialDataMap) {
        countriesQuarterlyFinancialBarChartData.push({ name: k, value: countriesQuarterlyFinancialDataMap[k] });
    }

    console.log("data ", data);
    return (
        <div>
            <div className="country-list" style={{ marginBottom: 20, paddingTop: 20, width: '100%', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
                {
                    quarterName.map((quarter, index) => {
                        const quarterlyAnalysispath = PATHS.ANALYTICS_QUATERLY.replace(':id', index + 1);

                        return (
                            <Button variant="contained" color="primary" onClick={() => props.history.push(quarterlyAnalysispath)} style={{ marginBottom: 10 }}>
                                {quarter}
                            </Button>
                        )
                    })
                }
            </div>
            {urlIsValid ?
                <div>
                    <h1 style={{ textAlign: 'center' }}>{currentQuarter}'s Analysis</h1>
                    <div className="charts" style={{ justifyContent: 'space-between' }}>
                        <div className="chart-item">
                            <ResponsiveContainer width={400} height={400}>
                                <BarChart
                                    width={300}
                                    height={300}
                                    data={companiesQuarterlyFinancialBarChartData}
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
                            <h3 style={{ textAlign: 'center' }}>Company's Share in {currentQuarter}</h3>
                        </div>
                        <div className="chart-item">
                            <ResponsiveContainer width={400} height={400}>
                                <BarChart
                                    width={300}
                                    height={300}
                                    data={countriesQuarterlyFinancialBarChartData}
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
                            <h3 style={{ textAlign: 'center' }}>Country's Share in {currentQuarter}</h3>
                        </div>
                    </div>
                </div>
                :
                <div>
                    <h1 style={{ textAlign: 'center', color: 'red' }}>Sorry URL parameters are incorrect. It doesn't map to any valid Quarter.</h1>
                </div>
            }
        </div>
    );
}

export default QuaterlyAnalysis;