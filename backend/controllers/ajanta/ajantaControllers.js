const {ajantaFinalData, ajantaInsightsData} = require('../../model/ajanta/ajantaModel')

async function getAllData(req, res)
{
    const reviewRating = await ajantaFinalData.aggregate([{$group: {_id: null, totalreviews: {$sum: "$totalReviewCount"}, averagerating: {$sum: "$averageRating"}}}]);
    const analysis = await ajantaInsightsData.aggregate([{$group: {_id: null, "Google Search Mobile": {$sum: "$Google Search - Mobile"}, "Google Search Desktop": {$sum: "$Google Search - Desktop"}, "Google Maps Mobile": {$sum: "$Google Maps - Mobile"}, "Google Maps Desktop": {$sum: "$Google Maps - Desktop"}, "Calls": {$sum: "$Calls"}, "Directions": {$sum: "$Directions"}, "Websit Clicks": {$sum: "$Website clicks"}}}]);
    const graphDataCalls = await ajantaInsightsData.aggregate([
    {
      $group: {
        _id: "$Month", 
        totalCalls: { $sum: "$Calls" }
      }
    },
    {
      $group: {
        _id: null,
        monthlyData: {
          $push: {
            k: "$_id",
            v: "$totalCalls"
          }
        }
      }
    },
    {
      $replaceRoot: {
        newRoot: { $arrayToObject: "$monthlyData" }
      }
    }
  ])
    const graphDataSearchesMobils = await ajantaInsightsData.aggregate([
    {
      $group: {
        _id: "$Month",
        totalGoogleSearchMobile: { $sum: "$Google Search - Mobile" }
      }
    },
    {
      $group: {
        _id: null,
        monthlyData: {
          $push: {
            k: "$_id", // Month
            v: "$totalGoogleSearchMobile" // Total Google Search - Mobile for the month
          }
        }
      }
    },
    {
      $replaceRoot: {
        newRoot: { $arrayToObject: "$monthlyData" }
      }
    }
  ])
    const graphDataSearchesDesktops = await ajantaInsightsData.aggregate([
    {
      $group: {
        _id: "$Month",
        totalGoogleSearchDesktop: { $sum: "$Google Search - Desktop" }
      }
    },
    {
      $group: {
        _id: null,
        monthlyData: {
          $push: {
            k: "$_id", // Month
            v: "$totalGoogleSearchDesktop" // Total Google Search - Desktop for the month
          }
        }
      }
    },
    {
      $replaceRoot: {
        newRoot: { $arrayToObject: "$monthlyData" }
      }
    }
  ])
    analysis[0].Searches = analysis[0]['Google Search Mobile'] + analysis[0]['Google Search Desktop']
    const graphDataSearches = 
        [{
            "Feb": graphDataSearchesMobils[0].Feb + graphDataSearchesDesktops[0].Feb,
            "Mar": graphDataSearchesMobils[0].Mar + graphDataSearchesDesktops[0].Mar,
            "Apr": graphDataSearchesMobils[0].Apr + graphDataSearchesDesktops[0].Apr
        }]
    return res.status(200).json({reviewRating, analysis, graphDataCalls, graphDataSearches})
}   

async function getTopFiveDoctors(req, res)
{
  const getTopFivedocs = await ajantaInsightsData.aggregate([
      {
        $group: {
          _id: "$Business name",
          totalSearches: { $sum: { $add: ["$Google Search - Mobile", "$Google Search - Desktop"] } }
        }
      },
      {
        $sort: { totalSearches: -1 }
      },
      {
        $limit: 5
      }
    ]);
  return res.status(200).json(getTopFivedocs)  
}

async function getAllDoctorNames(req, res)
{
  const allDoctors = await ajantaInsightsData.aggregate([
    {
      $lookup: {
        from: 'ajantafinaldatas',
        localField: 'Business name', // Field from ajantainsightsdatas
        foreignField: 'business_name', // Field from ajantafinaldatas
        as: 'matchedBusinesses'
      }
    },
    {
      $match: {
        'matchedBusinesses.0': { $exists: true } // Only include documents where the join found matches
      }
    },
    {
      $group: {
        _id: null,
        businessNames: { $push: '$Business name' } // Collect all matched business names into an array
      }
    },
    {
      $project: {
        _id: 0,
        businessNames: 1 // Include only the businessNames array
      }
    }
  ])
  return res.status(200).json(allDoctors[0].businessNames)
}

async function getDocData(req, res)
{
  var images = {}
  const requestData = req.body.businessName;
  const result = []
  const cRank = []
  const ratings = []
  const goodreviews = []
  const badreviews = []
  const keywordsRanking = []
  const basicDetails = []
  let review_count = 0
  let rating_count = 0
  let bc = 0
  let gc = 0
  const docData = await ajantaInsightsData.aggregate([
    {
      $match: {
        "Business name": requestData
      }
    },
    {
      $group: {
        _id: "$Month",
        "Google Search - Mobile": { $push: "$Google Search - Mobile" },
        "Google Search - Desktop": { $push: "$Google Search - Desktop" },
        "Google Maps - Mobile": { $push: "$Google Maps - Mobile" },
        "Google Maps - Desktop": { $push: "$Google Maps - Desktop" },
        "Website clicks": { $push: "$Website clicks" },
        "Directions": { $push: "$Directions" },
        "Calls": { $push: "$Calls" }
      }
    },
    {
      $project: {
        data: {
          $arrayToObject: [
            [
              {
                k: "$_id",
                v: { $concatArrays: ["$Google Search - Mobile", "$Google Search - Desktop", "$Google Maps - Mobile", "$Google Maps - Desktop", "$Website clicks", "$Directions", "$Calls"] }
              }
            ]
          ]
        }
      }
    }
  ])

  const labels = await ajantaFinalData.aggregate([
    {
      $match: {
        "business_name": requestData
      }
    },
   {
        $group: {
          _id: "business_name",
          "Labels": { $push: "$labels" },
          "ss": {$push: "$profile_screenshot"}
        }
      },
  ] )
  
  const mapsGraph = await ajantaInsightsData.aggregate([
  {
      $match: { "Business name": requestData } // Specify the business name here
  },
    {
      $group: {
        _id: "$Month",
        totalSearches: {
          $sum: {
            $add: ["$Google Maps - Desktop", "$Google Maps - Mobile"]
          }
        }
      }
    },
    {
      $group: {
        _id: null,
        data: {
          $push: {
            k: "$_id",
            v: "$totalSearches"
          }
        }
      }
    },
    {
      $replaceRoot: {
        newRoot: { $arrayToObject: "$data" }
      }
    }
  ])
  const actionGraph = await ajantaInsightsData.aggregate([
  {
      $match: { "Business name": requestData } // Specify the business name here
  },
    {
      $group: {
        _id: "$Month",
        totalSearches: {
          $sum: {
            $add: ["$Website clicks", "$Directions", "$Calls"]
          }
        }
      }
    },
    {
      $group: {
        _id: null,
        data: {
          $push: {
            k: "$_id",
            v: "$totalSearches"
          }
        }
      }
    },
    {
      $replaceRoot: {
        newRoot: { $arrayToObject: "$data" }
      }
    }
  ])
  const searchesGraph = await ajantaInsightsData.aggregate([
  {
    $match: { "Business name": requestData } // Specify the business name here
  },
  {
    $group: {
      _id: "$Month",
      totalSearches: {
        $sum: {
          $add: ["$Google Search - Desktop", "$Google Search - Mobile"]
        }
      }
    }
  },
  {
    $group: {
      _id: null,
      data: {
        $push: {
          k: "$_id",
          v: "$totalSearches"
        }
      }
    }
  },
  {
    $replaceRoot: {
      newRoot: { $arrayToObject: "$data" }
    }
  }
])
  // return res.json(docData )
  if ( docData.length != 0 )
  {
     docData.map( ( item, i ) => {
      result[i] = [];
      let temp = item._id;
      result[i].push(temp);
      item.data[temp].map((counts) => {
        result[i].push(counts);
      })
    } )
  }
  if(labels.length != 0)
  {
    // return res.json(labels)
    // console.log(labels.length)
    const competitor = labels[0].Labels[0][0].competitors
    images = {
      lable1: "https://staging.multipliersolutions.com/gmbnewprofiles/Ajanta/lables/" + labels[ 0 ].Labels[ 0 ][ 0 ].screen_shot + ".png",
      lable2: "https://staging.multipliersolutions.com/gmbnewprofiles/Ajanta/lables/" + labels[ 0 ].Labels[ 0 ][ 1 ].screen_shot + ".png",
      profile: "https://staging.multipliersolutions.com/gmbnewprofiles/Ajanta/profiles/" + labels[ 0 ].ss
    }

    labels[0].Labels[0].map((item, i) => {
      keywordsRanking[i] = []
      keywordsRanking[i].push(item.label)
      keywordsRanking[i].push(item.rank)
    })

    competitor.map((item, i) => {
      if(i + 1 > 10)
      {
        return;
      }
      else {
        cRank[i] = []
        cRank[i].push(item)
        cRank[i].push(i + 1)
      }
    } )
  }
  const accountID = await ajantaFinalData.aggregate([
    { $match: { business_name: requestData } },
    { $project: { _id: 0, account: 1 } },
    { $group: { _id: null, accounts: { $push: "$account" } } },
    { $project: { _id: 0, accounts: 1 } }
  ] )
  // return res.json(requestData, accountID)
  ratings[0] = 0
  ratings[1] = 0
  ratings[2] = 0
  ratings[3] = 0
  ratings[ 4 ] = 0
  const fullReview = {}
  fullReview['FIVE'] = []
  fullReview['FOUR'] = []
  fullReview['THREE'] = []
  fullReview['TWO'] = []
  fullReview['ONE'] = []
  if ( accountID.length != 0 )
  {
    const account = accountID[ 0 ].accounts[ 0 ]
    console.log( account )
    async function rrHandeler(token)
    {
      const fetch = (await import('node-fetch')).default;

      const response = await fetch("https://multipliersolutions.in/gmbhospitals/gmb_api/api.php", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
            "function": "reviews",
            "email": "ajantagmbaccess@gmail.com",
            "location": account,
            "pageToken": token
          })
      });

      const responseText = await response.text();
      const review = JSON.parse( responseText )
      if ( review.totalReviewCount != null )
      {
        review_count = review.totalReviewCount
        rating_count = review.averageRating
        for(let i = 0; i < review.reviews.length; i++)    
        {
          let counter = {}
          counter['rating'] = review.reviews[i].starRating
          counter['loc'] = review.reviews[i].name
          counter['comment'] = review.reviews[i].comment
          counter['rname'] = review.reviews[i].reviewer.displayName
          counter['rprofilePhotoUrl'] = review.reviews[i].reviewer.profilePhotoUrl
          counter['reply'] = {}
          if(review.reviews[i].reviewReply)
          {
              counter['reply'] = review.reviews[i].reviewReply;
          }

          if(review.reviews[i].comment !== "null" && review.reviews[i].comment != null)
          {
            if(goodreviews.length !== 5 && review.reviews[i].starRating === "FIVE")
            {  
              goodreviews.push( [gc + 1, review.reviews[ i ].comment ] )
              gc++
            }
            if(badreviews.length !== 5 && review.reviews[i].starRating === "ONE")
            {
              badreviews.push( [bc + 1, review.reviews[ i ].comment ] )
              bc++
            }
          }
          // console.log(review.reviews[i].starRating)
          if(review.reviews[i].starRating === "ONE")
          {
              ratings[0] += 1
              fullReview['ONE'].push(counter)
          }
          if(review.reviews[i].starRating === "TWO")
          {
              ratings[1] += 1
              fullReview['TWO'].push(counter)
          }
          if(review.reviews[i].starRating === "THREE")
          {
              ratings[2] += 1
              fullReview['THREE'].push(counter)
          }
          if(review.reviews[i].starRating === "FOUR")
          {
            // console.log("===========================",review.reviews[i].starRating)
            fullReview['FOUR'].push(counter)
            ratings[3] += 1
          }
          if(review.reviews[i].starRating === "FIVE")
          {
              fullReview['FIVE'].push(counter)
              ratings[4] += 1
          }
          counter++
        }
      }
      // console.log(review.nextPageToken)
      if(review.nextPageToken)
      {
        await rrHandeler(review.nextPageToken)
      }
    }

    await rrHandeler("")
  }
  const finalDetails = await ajantaFinalData.find( { business_name: requestData }, { _id: 0, name: 1, phone: 1 } )

  let rr_details = {
    "averageRating": rating_count,
    "totalReviewCount": review_count
  }
  basicDetails.push( rr_details )
  
  return res.status(200).json({result, cRank, keywordsRanking, searchesGraph, mapsGraph, images, actionGraph, ratings, goodreviews, badreviews, basicDetails, fullReview, finalDetails})
  
}

module.exports = {
  getAllData,
  getTopFiveDoctors,
  getDocData,
  getAllDoctorNames
}

// "Dr Vishal Chugh(Radiant Skin Clinic) Best Dermatologist in Jaipur Skin Specialist, Hair Loss Treatment, PRP Therapy in Jaipur"