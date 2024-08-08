import React, { useContext } from 'react'
import '../stylesheets/dashboard.css';
import TableComponent from '../components/TableComponent';
import { useEffect, useState } from 'react';
import manipalLogo from '../assets/Logos/manipalLogo.png'
import careLogo from '../assets/Logos/careLogo.png'
import Navbar from '../components/Navbar';
import ContentContainer from '../components/ContentContainer';
import ReviewRating from '../components/ReviewRating';
import GraphicalContainer from '../components/GraphicalContainer';
import { SharedContext } from '../context/SharedContext';
import { json } from 'react-router-dom';
import { ShimmerThumbnail } from "react-shimmer-effects";

export default function Dashboard() {


    const [showAllData, setAllData] = useState(null)
    const [analysisData, setAnalysisData] = useState()
    const [contextCity, setContextCity] = useState()
    const [isloading, setIsLoading] = useState(true)
    var verificationData;
    const username1 = localStorage.getItem('username')
    const psw1 = localStorage.getItem('psw')
    const api = localStorage.getItem('API')
    var username;
    var logo;

    async function getAllData(branch) {
        console.log(api + "/" + branch)
        const allData = await fetch(api + "/" + branch)
        const response = await allData.json()
        setAllData(response)
        console.log("======================: ", response)

    }

    useEffect(() => {
        async function getAnalysisData() {
            const analysisData = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({ 'username': username1, 'psw': psw1 })
            })
            const result = await analysisData.json();
            console.log(username1, psw1)
            console.log(result)
            setAnalysisData(result)
        }

        setTimeout(() => {
            setIsLoading(false)
        }, 2000)
        getAnalysisData()

        getAllData("No")}, []);
    if (analysisData) {
        username = analysisData[0].user;
        // alert(username)
        // localStorage.setItem('username', username)
        verificationData = [
            { "Total Profiles": analysisData[0]['Total Profiles'] },
            { "Verified Profiles": analysisData[0]['Total Verified'] },
            { "Unverified Profiles": analysisData[0]['Unverified'] },
        ]
        if (username != "Care") {
            verificationData.push({ "Not Intrested": analysisData[0]['Not Intrested'] })
        }
        else {
            verificationData.push({ "Access": analysisData[0]['Not Intrested'] })
        }
        logo = username === 'Manipal' ? manipalLogo : careLogo;
    }

    useEffect(() => {
        if (contextCity) {
            // alert(contextCity);
            getAllData(contextCity);
        }
    }, [contextCity]);

    return (
        // <div style={{background: 'linear-gradient(to right, #07509D 119.23%, 180deg, #30C3BB 0%)'}}>
        <SharedContext.Provider value={{ contextCity, setContextCity }}>
            <div style={{ background: "linear-gradient(to right, #07509D 0%, #30C3BB 100%)" }}>
                <Navbar logoimg={logo} username={username} serach={true} ></Navbar>
                {verificationData && (
                    <ContentContainer data={verificationData}></ContentContainer>
                )}
                <div className='content-container-1 m-3'>
                    <div className="left-container m-1">
                        {showAllData && (
                            <ReviewRating review={showAllData.reviewRating[0].totalreviews} rating={showAllData.reviewRating[0].averagerating / 95}></ReviewRating>
                        )}
                    </div>
                    <div className="right-container m-1">
                        {isloading ? <ShimmerThumbnail height={390} width={1200} rounded /> : showAllData && (
                            <>
                                <GraphicalContainer gtype={"AreaChart"} title={'Calls'} callsGraphData={showAllData.graphDataCalls[0]} bcolor={'#b1efec'} width={'50%'}></GraphicalContainer>
                                <GraphicalContainer gtype={"AreaChart"} title={'Searches'} callsGraphData={showAllData.graphDataSearches[0]} bcolor={'#b1efec'} width={'50%'}></GraphicalContainer>
                            </>
                        )}
                    </div>
                </div>
                {showAllData && (
                    <ContentContainer data={showAllData.analysis}></ContentContainer>
                )}
                <br />
            </div>
        </SharedContext.Provider>
    )
}
