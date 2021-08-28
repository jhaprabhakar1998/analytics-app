import React from 'react';
import { useParams } from 'react-router-dom';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import {
    AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Area, ResponsiveContainer, PieChart, Pie, Cell, BarChart,
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
    const countryWiseRevenueData = new Array()

    const country = useParams().name;
    const countriesDataAvailable = data.map((dataPoint) => {
        return (dataPoint.Country).toLowerCase();
    })

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

    const countryCompaniesAnnualFinancialData = companiesAnnualFinancialData.filter((dataPoint) => (dataPoint.Country.toLowerCase() === country.toLowerCase()));
    console.log("current country Companies Annual finanaical data  -----", countryCompaniesAnnualFinancialData);
    companiesAnnualFinancialData.map((dataPoint) => {
        countryRevenueDataMap[dataPoint.Country.toLowerCase()] = countryRevenueDataMap[dataPoint.Country] ? countryRevenueDataMap[dataPoint.Country] + dataPoint.Revenue : dataPoint.Revenue;
    })

    let allCountriesRevenue = 0

    for (let k in countryRevenueDataMap) {
        allCountriesRevenue = allCountriesRevenue + countryRevenueDataMap[k];
        console.log("all countries revenue ", allCountriesRevenue);
        const countryName = k.toLowerCase();
        const countryNameTitleCase = countryName.charAt(0).toUpperCase() + countryName.substr(1);
        countryWiseRevenueData.push({ name: countryNameTitleCase, value: countryRevenueDataMap[k] });
    }

    // const totalCountriesRevenue = countryWiseRevenueData.reduce(function (accumulator, currentCountryRevenueData) {
    //     return accumulator + currentCountryRevenueData;
    // });

    const isCountryDataAvailable = countriesDataAvailable.includes(country);

    console.log("data ", data, "countries ", countriesDataAvailable, "country ", country, " iscountry ", isCountryDataAvailable);
    console.log("companie annual revenue data ", companiesAnnualFinancialData);
    console.log("country Revenue data annual ", countryRevenueDataMap);
    return (
        <div>
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
                                            {/* <Bar dataKey="uv" fill="#82ca9d" minPointSize={10} /> */}
                                        </BarChart>
                                    </ResponsiveContainer>
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
                                            {countryCompaniesAnnualFinancialData.map((dataPoint) => {

                                                return (
                                                    <Typography variant="body2" component="p" style={{ fontSize: 18, textAlign: 'center', fontWeight: 500, marginBottom: 10 }}>
                                                        {dataPoint.Company} - {dataPoint.Revenue}
                                                    </Typography>
                                                )
                                            })}
                                            <Typography variant="body2" component="p">

                                            </Typography>
                                        </CardContent>
                                    </Card>
                                    {/* <div style={{ textAlign: 'center' }}>
                                        <h1> Country - {country.toUpperCase()}</h1>
                                        <h2>Total Annual Revenue - {countryRevenueDataMap[country.toLowerCase()]}</h2>
                                        <h3>Total Annual Revenue (All countries) - {allCountriesRevenue}</h3>
                                        <h3>Countries Share - {Math.round((countryRevenueDataMap[country.toLowerCase()]) / (allCountriesRevenue) * 100) + "%"}</h3>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    )
                    :
                    (
                        <h1>Sorry the analytical data for this country is not available.</h1>
                    )
            }
        </div >
    );
}

export default CountryAnalysis;