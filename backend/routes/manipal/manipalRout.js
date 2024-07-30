const express = require( 'express' )
const router = express.Router()
const {
    getAllData,
    getTopFiveDoctors,
    getDocData,
    getAllDoctorNames,
    filtersdata,
    getuniquelocations
} = require('../../controllers/manipal/manipalControllers');


router.get('/:branch', getAllData)

router.post('/', getTopFiveDoctors)

router.post('/docData', getDocData)

router.post('/getAllDocNames', getAllDoctorNames)

router.post('/getfilterdata', filtersdata)

router.post('/getunquelocdata', getuniquelocations)

module.exports = router