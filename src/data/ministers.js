// src/data/ministers.js
// Detailed minister profiles used by SideMinistersPanel and MinisterPage.jsx

const ministers = [
  {
    id: "jitendra-singh",
    name: "Dr. Jitendra Singh",
    title:
      "Minister of State (Independent Charge), Ministry of Science & Technology; Minister of State (Independent Charge), Ministry of Earth Sciences; Minister of State, PMO; Minister of State, Personnel; Minister of State, Department of Atomic Energy; Minister of State, Department of Space",
    photo: "/assets/ministers/jitendra.jpg",
    contact: {
      office: "Room 101, CMLRE",
      email: "jitendra.singh@example.gov.in",
      phone: "+91-11-xxxxx"
    },
    personal: {
      fathersName: "Late Shri Rajinder Singh",
      mothersName: "Smt. Shanti Devi",
      dob: "06 Nov 1956",
      pob: "Jammu (Jammu and Kashmir)",
      maritalStatus: "Married",
      spouseName: "Smt. Manju Singh",
      numberOfSons: 2
    },
    education: [
      "M.B.B.S.",
      "M.D. (Medicine)",
      "Fellowship (Diabetes)",
      "MNAMS (Diabetes and Endocrinology)",
      "Hon. Ph.D"
    ],
    educationInstitutions: [
      "Stanley Medical College, Chennai, Tamil Nadu",
      "All India Institute of Medical Sciences, New Delhi",
      "Government Medical College, Jammu",
      "Amity NOIDA"
    ],
    profession: [
      "Medical Practitioner",
      "Author",
      "Professor",
      "Newspaper Columnist",
      "Diabetologist & Consultant Physician"
    ],
    permanentAddress: {
      addressLine: "169, Trikuta Nagar",
      city: "Jammu",
      postal: "Jammu-180012, Jammu and Kashmir",
      phones: ["0191-2477722", "07042304567", "09419192900"]
    },
    presentAddress: {
      addressLine: "4, Kushak Road",
      city: "New Delhi - 110 011",
      phones: ["(011) 23794542", "23794559", "07042304567 (M)"],
      fax: "(011) 23794559",
      email: "hfm@gov.in"
    },
    positions: [
      { period: "May 2014", position: "Elected to 16th Lok Sabha" },
      {
        period: "27 May 2014 - 25 May 2019",
        position:
          "Minister of State in the Prime Minister’s Office; Ministry of Personnel, Public Grievances and Pensions; Department of Atomic Energy and Department of Space"
      },
      {
        period: "09 Nov 2014 - 25 May 2019",
        position:
          "Union Minister of State (Independent Charge) in the Ministry of Development of North Eastern Region"
      },
      {
        period: "22 May 2016 - 28 May 2016",
        position:
          "Union Minister of State (Independent Charge) Ministry of Youth Affairs and Sports"
      },
      { period: "May 2019", position: "Re-elected to 17th Lok Sabha (2nd term)" },
      {
        period: "30 May 2019 - 7 July 2021",
        position:
          "Union Minister of State (Independent Charge), Ministry of Development of North Eastern Region; Minister of State, Prime Minister's Office; Minister of State, Ministry of Personnel, Public Grievances and Pensions; Minister of State, Department of Atomic Energy; Minister of State, Department of Space"
      },
      {
        period: "8 July 2021 - 18 May 2023",
        position:
          "Minister of State (Independent Charge) of Science & Technology; Minister of State in the Prime Minister’s Office; Minister of State in the Ministry of Personnel, Public Grievances and Pensions; Minister of State in the Department of Atomic Energy; Minister of State in the Department of Space"
      },
      { period: "June 2024", position: "Re-elected to 18th Lok Sabha (3rd term)" },
      {
        period: "9 June 2024 Onwards",
        position:
          "Minister of State (Independent Charge) of the Ministry of Science and Technology; Minister of State (Independent Charge) of the Ministry of Earth Sciences; Minister of State in the Prime Minister’s Office; Minister of State in the Ministry of Personnel, Public Grievances and Pensions; Minister of State in the Department of Atomic Energy; Minister of State in the Department of Space"
      }
    ]
  },

  {
    id: "m-ravichandran",
    name: "Dr. M. Ravichandran",
    title: "Secretary, Ministry of Earth Sciences (MoES)",
    photo: "/assets/ministers/ravichandran.jpeg",
    contact: {
      office: "Prithvi Bhavan, Lodhi Road, New Delhi 110003",
      email: "secretary@moes.gov.in",
      phone: "" // add if available
    },
    personal: {
      dob: "18 May 1965"
    },
    education: [
      "Ph.D. in Physics (University of Pune)"
    ],
    educationInstitutions: [
      "University of Pune"
    ],
    profession: [
      "Scientist (Ocean & Atmospheric Sciences)",
      "Administrator"
    ],
    presentAddress: {
      addressLine: "Prithvi Bhavan, Lodhi Road",
      city: "New Delhi 110003",
      phones: [],
      fax: "",
      email: "secretary@moes.gov.in"
    },
    bio:
      "Dr. M. Ravichandran assumed charge as Secretary, Ministry of Earth Sciences (MoES) on 11 October 2021. He obtained his Ph.D. in Physics from the University of Pune. He has served as Director at the National Centre for Polar and Ocean Research (NCPOR), Goa (2016–2021) and has worked at ESSO-IITM (Pune), ESSO-NIOT (Chennai) and ESSO-INCOIS (Hyderabad) before joining NCPOR.",
    positions: [
      {
        period: "11 October 2021 - Present",
        position: "Secretary, Ministry of Earth Sciences (MoES), Prithvi Bhavan, Lodhi Road, New Delhi"
      },
      {
        period: "2016 - 2021",
        position: "Director, National Centre for Polar and Ocean Research (NCPOR), Goa"
      },
      {
        period: "2018 - present",
        position:
          "Vice-President, Scientific Committee on Antarctic Research (SCAR) — Capacity Building (International Science Council)"
      },
      {
        period: "2016 - present",
        position:
          "Roles in International Arctic Science Committee (IASC); Alternate Delegate-India to SCAR; Indian Representative to Council of Managers of National Antarctic Programs; Alternate Delegate-India, Antarctic Treaty System; Council Member"
      },
      {
        period: "2012 - 2016",
        position: "Co-Chair, Indian Ocean Panel of GOOS/CLIVAR (WCRP Climate Research programme)"
      },
      {
        period: "2005 - 2016",
        position: "Member, International Argo Steering Team & Regional Argo Co-ordinator for the Indian Ocean"
      },
      {
        period: "2010 - 2017",
        position: "Member, SIBER Scientific Steering Committee (Sustained Indian Ocean Biogeochemical & Ecological Research)"
      },
      {
        period: "2015 - present",
        position: "Editor, 'Pure and Applied Geophysics' (Atmospheric and Ocean Sciences section)"
      }
    ],
    notes:
      "Worked as Scientist at ESSO-IITM (Pune) (1988-1997), at National Institute of Ocean Technology (ESSO-NIOT), Chennai (1997-2001), and at Indian National Centre for Ocean Information Services (ESSO-INCOIS), Hyderabad (2001-2016) prior to joining NCPOR."
  },

  {
    id: "r-s-maheskumar",
    name: "Dr. R. S. Maheskumar",
    title: "Head, Centre for Marine Living Resources and Ecology (CMLRE)",
    photo: "/assets/ministers/maheskumar.jpeg",
    contact: { office: "Lab A3, CMLRE", email: "r.s.maheskumar@example.gov.in", phone: "+91-11-xxxxx" }
  }
];

export default ministers;
