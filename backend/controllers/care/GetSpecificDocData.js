const { careInsightsData} = require("../../model/care/careModel");

async function getSpecificDocData(req, res) {
  const businessName = "Dr. V. V. Vinay Kumar Tummidi | Best ENT Specialist in Vizag Arilova | CARE Hospitals Vizag Arilova";

  try {
    const docData = await careInsightsData.aggregate([
      {
        $match: {
          "Business name": businessName
        }
      },
      {
        $group: {
          _id: "$_id",
          month: { $push: "$Month" }
        }
      },
      {
        $addFields: {
          month: {
            $map: {
              input: "$month",
              as: "month",
              in: {
                $dateToString: {
                  format: "%Y-%m",
                  date: {
                    $dateFromString: {
                      dateString: { $toString: "$$month" }
                    }
                  }
                }
              }
            }
          }
        }
      },
      {
        $sort: {
          month: 1
        }
      },
      {
        $project: {
          _id: 1,
          month: {
            $map: {
              input: "$month",
              as: "month",
              in: {
                $dateToString: {
                  format: "%Y-%b",
                  date: {
                    $dateFromString: {
                      dateString: { $toString: "$$month" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    ]);

    console.log("+====Specific DOC Data=======++++");
    console.log(docData);

    return res.status(200).json(docData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  getSpecificDocData,
};