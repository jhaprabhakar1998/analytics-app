
import React, { useState } from 'react';
import { withRouter } from 'react-router';

import { AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Area, ResponsiveContainer } from 'recharts';

import { realtimedb } from '../../firebase';
import '../../style.css';

function AnalyticsScreen({ props, data }) {
    let [allRevenueData, setAllRevenueData] = useState([]);

    const areaChartData = data.map((dataPoint) => {
        return {
            "name": dataPoint.Company,
            "January": dataPoint.January,
            "February": dataPoint.February,
            "March": dataPoint.March,
            "April": dataPoint.April,
            "May": dataPoint.May,
            "June": dataPoint.June,
            "July": dataPoint.July,
            "August": dataPoint.August,
            "September": dataPoint.September,
            "October": dataPoint.October,
            "November": dataPoint.November,
            "December": dataPoint.December
        }
    })

    if (allRevenueData.length === 0) {
        realtimedb.ref().on("value", snapshot => {
            let allRevenueData = [];
            if (snapshot) {
                snapshot.forEach(snap => {
                    const objData = snap.val();
                    for (let key in objData) {
                        if (objData.hasOwnProperty(key)) {
                            if (key !== "Company" && key !== "Country") {
                                let numWithCommas = objData[key].toString();
                                const numWithoutCommas = numWithCommas.replace(/[.,\s]/g, "");
                                const revenue = parseInt(numWithoutCommas);
                                objData[key] = revenue;
                            }
                        }
                    }
                    allRevenueData.push(objData);
                });
                setAllRevenueData(allRevenueData)
            }
        })
    }

    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>Welcome to Analytics Dashboard</h1>
            <h4 style={{ textAlign: 'center' }}>You can see the raw figure for each company during each month.</h4>

            {
                allRevenueData.length !== 0 ?
                    <div>
                        <h3 style={{ textAlign: 'center' }}>January - March Analysis</h3>
                        <div style={{ position: '', height: '100%' }}>
                            <ResponsiveContainer width={'99%'} height={300}>
                                <AreaChart height={250} data={areaChartData}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }} >
                                    <defs>
                                        <linearGradient id="color1" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="color2" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="color3" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ffca9d" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#ffca9d" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="January" stroke="#8884d8" fillOpacity={1} fill="url(#color1)" />
                                    <Area type="monotone" dataKey="February" stroke="#82ca9d" fillOpacity={1} fill="url(#color2)" />
                                    <Area type="monotone" dataKey="March" stroke="#ffca9d" fillOpacity={1} fill="url(#color3)" />
                                </AreaChart>
                            </ResponsiveContainer>
                            <h3>World Countries Annual Share</h3>
                        </div>
                    </div>
                    :
                    null
            }

            {
                allRevenueData.length !== 0 ?
                    <div>
                        <h3 style={{ textAlign: 'center' }}>April - June Analysis</h3>
                        <div style={{ height: '100%' }}>
                            <ResponsiveContainer width={'99%'} height={300}>
                                <AreaChart height={250} data={areaChartData}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }} >
                                    <defs>
                                        <linearGradient id="color1" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="color2" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="color3" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ffca9d" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#ffca9d" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="April" stroke="#8884d8" fillOpacity={1} fill="url(#color1)" />
                                    <Area type="monotone" dataKey="May" stroke="#82ca9d" fillOpacity={1} fill="url(#color2)" />
                                    <Area type="monotone" dataKey="June" stroke="#ffca9d" fillOpacity={1} fill="url(#color3)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    :
                    null
            }

            {
                allRevenueData.length !== 0 ?
                    <div>
                        <h3 style={{ textAlign: 'center' }}>July - September Analysis</h3>
                        <div style={{ height: '100%' }}>
                            <ResponsiveContainer width={'99%'} height={300}>
                                <AreaChart height={250} data={areaChartData}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }} >
                                    <defs>
                                        <linearGradient id="color1" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="color2" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="color3" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ffca9d" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#ffca9d" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="July" stroke="#8884d8" fillOpacity={1} fill="url(#color1)" />
                                    <Area type="monotone" dataKey="August" stroke="#82ca9d" fillOpacity={1} fill="url(#color2)" />
                                    <Area type="monotone" dataKey="September" stroke="#ffca9d" fillOpacity={1} fill="url(#color3)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    :
                    null
            }

            {
                allRevenueData.length !== 0 ?
                    <div>
                        <h3 style={{ textAlign: 'center' }}>October - December Analysis</h3>
                        <div style={{ height: '100%' }}>
                            <ResponsiveContainer width={'99%'} height={300}>
                                <AreaChart height={250} data={areaChartData}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }} >
                                    <defs>
                                        <linearGradient id="color1" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="color2" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="color3" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ffca9d" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#ffca9d" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="October" stroke="#8884d8" fillOpacity={1} fill="url(#color1)" />
                                    <Area type="monotone" dataKey="November" stroke="#82ca9d" fillOpacity={1} fill="url(#color2)" />
                                    <Area type="monotone" dataKey="December" stroke="#ffca9d" fillOpacity={1} fill="url(#color3)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    :
                    null
            }

        </div >
    );
}

export default withRouter(AnalyticsScreen);