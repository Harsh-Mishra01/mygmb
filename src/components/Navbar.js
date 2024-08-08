import React, { Fragment, useEffect, useState, useContext } from 'react'
import logoutlogo from '../assets/Logos/logout.png'
import { useNavigate, Link } from 'react-router-dom'
import { SharedContext } from '../context/SharedContext'
import { FaCircleRight } from "react-icons/fa6"
import '../components/NavCss/Navbar.css';


export default function Navbar( props ) {
  const { setDrName } = useContext(SharedContext)
  const { setContextCity } = useContext(SharedContext)
  const navigate = useNavigate();
  const [ getAllnames, setAllNames ] = useState()
  const [ getName, setName ] = useState()
  const [ getState, setState ] = useState()
  const [ getStates, setStates ] = useState()
  const [ getCity, setCity ] = useState()
  const [ getCitys, setCitys ] = useState()
  const api = localStorage.getItem( 'API' )

  
  function logoutHandeler()
  {
    // alert('hello world')
    navigate('/')
  }
  function nameHandelar( e )
  {
    setName( e.target.value )
  }
  function nameseter()
  {
    setDrName(getName)
  }
  async function getStateHandeler( e )
  {
    setState( e.target.value )
    // filterApi()
  }
  async function filterApi()
  {
    // alert(getState)
    const response = await fetch(api + '/getfilterdata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "state": getState, "branch": getCity })
    });
    const data = await response.json();
    // alert("Hello")
    console.log("data: ",data)
    setCitys(data.result[0].branches)
    setAllNames(data.result[0].businessNames)
    if(props.serach)
    {
      setContextCity(getCity)
    }
  }
  function getCityHandeler( e )
  {
    setCity( e.target.value )
  }
  useEffect(() => {
    async function getAllDoctrosNames()
    {
      const docNames = await fetch(api + '/getAllDocNames', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const allNames = await docNames.json()
      // alert(allNames)
      setAllNames(allNames)
    }
    async function getallLoc()
    {
      const locDetails = await fetch(api + '/getunquelocdata', {
        method: "post" ,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const getlocdetails = await locDetails.json()
      setStates(getlocdetails[0].states)
      setCitys(getlocdetails[0].branches)
  
    }
    getallLoc()
    getAllDoctrosNames()
  }, [])
  // if(getLoc)
  // {
  //   console.log(getLoc)  
  // }
  return (
    <Fragment>
      <div className='navigation-bar P-1 height'>
          <div className='nav-logo'>
              <img src={props.logoimg} alt='logo'></img>
          </div>
          <div className='nav-caption'>
              <span style={{ color: '#07509D' }}>GOOGLE MY</span>&nbsp;<span style={{ color: '#30C3BB' }}> BUSINESS PERFORMANCE</span>
          </div>
          <div className='nav-l'>
            <img src={logoutlogo} alt='logo' onClick={logoutHandeler}></img>
          </div>
      </div>
      <hr/>
      <div className="sub-nav">
        {/* <div className="filter-contents p-1"style={{display: (props.username === 'Manipal' && props.serach ? 'block' : 'none') }}>
          <select className="ms-4 p-2 mb-2" name="" id="">
              <option value="">By Cluster</option>
              <option value="North">North</option>
              <option value="South">South</option>
              <option value="Central">Central</option>
          </select>
          <select className="ms-4 p-2 mb-2" name="" id="">
              <option value="">By Unit</option>
              <option value="North">Old Airport Road</option>
              <option value="South">Doddaballapura</option>
               <option value="Central">Central</option> 
          </select>
        </div> */}
        <div className="filter-contents p1">
          <div className='filers_sprding'>
          
          <div className='data_list_selection m-1'>
            <input value={getState} onChange={getStateHandeler} list="statelist"  placeholder='Select State'/>
            <button onClick={filterApi}><FaCircleRight /></button>
          </div>

            <datalist id='statelist'>
            {
              getStates && (
                getStates.map((item) => {
                  if(item != "#N/A")
                  return(<option value={item}>{item}</option>)
                })  
              )
            }
            </datalist>
            <div className='data_list_selection m-1'>
              <input value={getCity} onChange={getCityHandeler} list="Cityeslist" placeholder='Select City'/>
              <button onClick={filterApi}><FaCircleRight /></button>
            </div>
          
            <datalist id='Cityeslist'>
            {
              getCitys && (
                getCitys.map((item) => {
                  if(item != "#N/A")
                  return(<option value={item}>{item}</option>)
                })  
              )
            }
            </datalist>
          {/* <label>Select Doctor:</label>&nbsp; */}
          <div className='data_list_selection m-1' style={{display: (!(props.serach) ? 'block' : 'none') }}>
            <input type='text' list='getDoctor' placeholder='Doctor Name' value={getName} onInputCapture={nameHandelar}/>
            <button onClick={nameseter}><FaCircleRight /></button>
          </div>
          { getAllnames && 
            <datalist id='getDoctor'>
              {getAllnames.map((item) => {
                return(<option value={item}>{item}</option>)
              })}
            </datalist>
          }
          </div>
        </div>
        <div className="nav-contents p-2">
          <Link to="/Dashboard" className="p-1 pe-4">Dashboard</Link>
          <Link to="/Doc-report" className="p-1 pe-4">Doc Report</Link>
          <Link to="/Review Management" className="p-1 pe-4">Review Management</Link>
          {/* <Link to="/Review Management" className="p-1 pe-5" style={{display: (props.username === 'Manipal' && props.serach ? 'none' : 'block')}}>Review Management</Link>
          <Link to="/gen-ai" className="p-1 pe-5" style={{display: (props.username === 'Manipal' && props.serach ? 'none' : 'block')}}>Gen AI</Link> */}
        </div>
      </div>
      
    </Fragment>
  )
}
