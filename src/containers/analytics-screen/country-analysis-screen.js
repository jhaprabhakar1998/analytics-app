import React from 'react';
import { useParams } from 'react-router-dom';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import PATHS from '../../paths';

import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart,
    Bar,
    Legend,
    LabelList
} from 'recharts';

const COLORS = ["#8884ff", "#8884d8", "#88f4d8", "#FF8042"];

const RADIAN = Math.PI / 180;

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

const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index
}: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor={x > cx ? "start" : "end"}
            dominantBaseline="central"
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

function CountryAnalysis({ props, data }) {

    const countryRevenueDataMap = new Map()
    const countryWiseRevenueData = []

    const monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const country = useParams().name;
    const countriesDataAvailable = [...new Set(data.map((dataPoint) => {
        return (dataPoint.Country).toLowerCase();
    }))]

    const companiesAnnualFinancialData = data.map((dataPoint) => {
        let annualRevenue = 0;
        for (let key in dataPoint) {
            if (dataPoint.hasOwnProperty(key)) {
                if (key !== "Company" && key !== "Country") {
                    annualRevenue = annualRevenue + dataPoint[key];
                }
            }
        }
        return {
            "Country": dataPoint.Country,
            "Company": dataPoint.Company,
            "Revenue": annualRevenue,
        }
    })

    const countriesFinancialData = data.filter((dataPoint) => dataPoint.Country.toLowerCase() === country.toLowerCase());
    const countriesFinancialDataMonthly = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    countriesFinancialData.map((dataPoint) => {
        for (let i = 0; i < 12; i++) {
            countriesFinancialDataMonthly[i] = countriesFinancialDataMonthly[i] + dataPoint[monthName[i]];
        }
    })
    const countriesFinancialMonthlyBarChartData = countriesFinancialDataMonthly.map((dataPoint, index) => { return { name: monthName[index], value: dataPoint } });

    const countryCompaniesAnnualFinancialData = companiesAnnualFinancialData.filter((dataPoint) => (dataPoint.Country.toLowerCase() === country.toLowerCase()));
    companiesAnnualFinancialData.map((dataPoint) => {
        countryRevenueDataMap[dataPoint.Country.toLowerCase()] = countryRevenueDataMap[dataPoint.Country] ? countryRevenueDataMap[dataPoint.Country] + dataPoint.Revenue : dataPoint.Revenue;
    })

    const countryCompaniesAnnualFinancialBarChartData = countryCompaniesAnnualFinancialData.map((dataPoint) => {
        return {
            name: dataPoint.Company,
            value: dataPoint.Revenue
        }
    })

    let allCountriesRevenue = 0

    for (let k in countryRevenueDataMap) {
        allCountriesRevenue = allCountriesRevenue + countryRevenueDataMap[k];
        const countryName = k.toLowerCase();
        const countryNameTitleCase = countryName.charAt(0).toUpperCase() + countryName.substr(1);
        countryWiseRevenueData.push({ name: countryNameTitleCase, value: countryRevenueDataMap[k] });
    }

    const isCountryDataAvailable = countriesDataAvailable.includes(country);

    return (
        <div>
            <div className="country-list" style={{ marginBottom: 20, paddingTop: 20, width: '100%', display: 'flex', justifyContent: 'space-around' }}>
                {
                    countriesDataAvailable.map((country) => {
                        const countryAnalysispath = PATHS.ANALYTICS_COUNTRY.replace(':name', country.toLowerCase());
                        return (
                            <Button variant="contained" color="primary" onClick={() => props.history.push(countryAnalysispath)}>
                                {country.toUpperCase()}
                            </Button>
                        )
                    })
                }
            </div>
            {
                isCountryDataAvailable ?
                    (
                        <div className="container">
                            <div className="charts">
                                <div className="chart-item">
                                    <ResponsiveContainer width={350} height={400}>
                                        <BarChart
                                            width={300}
                                            height={300}
                                            data={countryWiseRevenueData}
                                            margin={{
                                                top: 50,
                                                right: 10,
                                                left: 20,
                                                bottom: 5
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="value" fill="#8884d8" minPointSize={5}>
                                                <LabelList dataKey="name" content={renderCustomizedLabelBarChart} />
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                    <h3 style={{ textAlign: 'center' }}>Coutry wise Annual Revenue Data</h3>
                                </div>
                                <div className="chart-item">
                                    <ResponsiveContainer width={350} height={400}>
                                        <PieChart>
                                            <Pie
                                                data={countryWiseRevenueData}
                                                cx={200}
                                                cy={150}
                                                labelLine={false}
                                                label={renderCustomizedLabel}
                                                outerRadius={100}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {data.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <h3 style={{ textAlign: 'center' }}>Coutry wise Annual Revenue Share</h3>
                                </div>
                                <div className="chart-item">
                                    <ResponsiveContainer width={350} height={400}>
                                        <BarChart
                                            width={300}
                                            height={300}
                                            data={countryCompaniesAnnualFinancialBarChartData}
                                            margin={{
                                                top: 50,
                                                right: 10,
                                                left: 20,
                                                bottom: 5
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="value" fill="#8884d8" minPointSize={5}>
                                                <LabelList dataKey="name" content={renderCustomizedLabelBarChart} />
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                    <h3 style={{ textAlign: 'center' }}>{country.toUpperCase()}'s Company Share Bar Chart</h3>
                                </div>
                                <div className="chart-item">
                                    <ResponsiveContainer width={350} height={400}>
                                        <BarChart
                                            width={300}
                                            height={300}
                                            data={countriesFinancialMonthlyBarChartData}
                                            margin={{
                                                top: 50,
                                                right: 10,
                                                left: 20,
                                                bottom: 5
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="value" fill="#8884d8" minPointSize={5}>
                                                <LabelList dataKey="name" content={renderCustomizedLabelBarChart} />
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                    <h3 style={{ textAlign: 'center' }}>{country.toUpperCase()}'s Monthly Revenue Share</h3>
                                </div>
                                <div className="chart-item">

                                    <Card style={{ width: 350, height: 400 }}>
                                        <CardContent>
                                            <Typography color="textPrimary" style={{ fontSize: 24, textAlign: 'center' }}>
                                                {country.toUpperCase()}
                                            </Typography>
                                            <Typography variant="h5" style={{ fontSize: 20, textAlign: 'center' }}>
                                                Annual Revenue - {countryRevenueDataMap[country.toLowerCase()]}
                                            </Typography>
                                            <Typography color="textSecondary" style={{ fontSize: 20, textAlign: 'center' }}>
                                                Country Share - {Math.round((countryRevenueDataMap[country.toLowerCase()]) / (allCountriesRevenue) * 100) + "%"}
                                            </Typography>
                                            <Typography variant="body2" component="p" style={{ fontSize: 20, textAlign: 'center', fontWeight: 700, marginTop: 30, marginBottom: 10 }}>
                                                Companies
                                            </Typography>
                                            {countryCompaniesAnnualFinancialData.map((dataPoint, index) => {

                                                return (
                                                    <Typography key={index} variant="body2" component="p" style={{ fontSize: 18, textAlign: 'center', fontWeight: 500, marginBottom: 10 }}>
                                                        {dataPoint.Company} - {dataPoint.Revenue}
                                                    </Typography>
                                                )
                                            })}
                                            <Typography variant="body2" component="p">

                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    )
                    :
                    (
                        <h1 style={{ textAlign: 'center', color: 'red' }}>Sorry the analytical data for this country is not available.</h1>
                    )
            }
        </div >
    );
}

export default CountryAnalysis;