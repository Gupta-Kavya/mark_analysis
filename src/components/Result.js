import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "jspdf-autotable";
import jsPDF from "jspdf";
// import "./index.css";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal } from "flowbite-react";
import { Chart } from "react-google-charts";
import { Link } from "react-router-dom";
import LoadingBar from 'react-top-loading-bar'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import ConfettiExplosion from 'react-confetti-explosion';


const Result = () => {
  const loadingBarRef = useRef(null);


  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [data, setData] = useState(null);
  const [dataSubjects, setDataSubjects] = useState([]);
  const [credit, setCredit] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [cgpa, setCgpa] = useState(0);
  const [dbName, setdbName] = useState("");
  const [dbSem, setdbSem] = useState("");
  const [dbRoll_no, setdbRoll_no] = useState("");
  const [isExploding, setIsExploding] = React.useState(true);


  let [totalCredits1, setTotalCredits1] = useState(0);
  let [totalCreditPoints1, setTotalCreditPoints1] = useState(0);

  // const [studentDB, setStudentDB]= useState({
  //     Name:"",
  //     Roll_No:"",
  //     Cgpa:"",
  //     semester:""
  // })

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/credits`)
      .then((response) => setCredit(response.data))
      .catch((err) => setError("Error fetching credits"));
  }, []);



  function toAcronym(str) {
    // Split the string into words
    let words = str.split(' ');

    // Map each word to its initial letter and join them into a single string
    let acronym = words.map(word => word.charAt(0).toUpperCase()).join('');

    return acronym;
  }

  const getGradeComposition = () => {
    const gradeCount = dataSubjects.reduce((acc, subject) => {
      if (acc[subject.Grade]) {
        acc[subject.Grade]++;
      } else {
        acc[subject.Grade] = 1;
      }
      return acc;
    }, {});

    const chartData = [["Grade", "Number of Subjects"]];
    for (const grade in gradeCount) {
      chartData.push([grade, gradeCount[grade]]);
    }
    return chartData;
  };

  const GradePieChart = ({ dataSubjects }) => {
    const chartData = getGradeComposition();

    const options = {
      title: "Composition of Subjects Under Each Grade",
      pieHole: 0.4,
    };

    return (
      <Chart
        chartType="PieChart"
        width="100%"
        height="100%"
        data={chartData}
        options={options}
      />
    );
  };

  const MarksBarGraph = ({ dataSubjects }) => {
    const chartData = [
      ["Subject", "Marks"],
      ...dataSubjects.map((subject) => [
        toAcronym(subject.Subject_Name),
        parseInt(subject.Total_Marks),
      ]),
    ];

    const options = {
      title: "Marks Distribution by Subject",
      chartArea: { width: "50%" },
      hAxis: {
        title: "Marks",
        minValue: 0,
      },
      vAxis: {
        title: "Subjects",
      },
    };

    return (
      <Chart
        chartType="BarChart"
        width="100%"
        height="300px"
        data={chartData}
        options={options}
      />
    );
  };

  const presetKey = process.env.REACT_APP_API_PRESET_KEY;
  const cloudName = process.env.REACT_APP_API_CLOUD_NAME;



  const handleFileChange = async (event) => {

    event.preventDefault();


    toast.success("Uploading......", {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });

    const selectedFile = event.target.files[0];

    // Check the file extension
    const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
    if (fileExtension !== "pdf") {
      toast.error("Only PDF files are allowed!", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return; // Return early if the file is not a PDF
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", presetKey);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const data = await response.json();
      setUrl(data.secure_url);
      localStorage.setItem("cloudinary_url", data.secure_url);

      toast.success("PDF Uploaded Successfully !!", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });


    } catch (error) {
      setError(error.message);
      setLoading(false);
      toast.error("Some internal error occurred!", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
    send();
  };


  const saveToData = (cgpa) => {
    return cgpa;
  }


  const send = async (e) => {
    setLoading(true);
    loadingBarRef.current.continuousStart();

    const body = url || localStorage.getItem("cloudinary_url"); // Assuming 'url' is the data object you want to send

    try {
      // Fetch data from Flask API
      const flaskResponse = await fetch(
        `${process.env.REACT_APP_API_FLASK_URL}/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (!flaskResponse.ok) {
        throw new Error(`Flask API error: ${flaskResponse.statusText}`);
      }

      const responseData = await flaskResponse.json();
      setLoading(false);

      if (localStorage.getItem("reload") === "0") {
        localStorage.setItem("reload", 1)
        // window.location.reload();
      }

      // Success toast
      toast.success("Your Report Analysis is Ready !", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });

      // Update state
      setAnalysis(responseData);
      setData(responseData);
      localStorage.setItem("roll_no", (responseData.Roll_No).slice(0, 2))
      localStorage.setItem("semester", responseData.semester)
      localStorage.setItem("name", responseData.Name)
      localStorage.setItem("clg_name", responseData.College_name)
      setDataSubjects(responseData.Subjects);

      loadingBarRef.current.complete();



      try {

if(responseData.Result == "PASS"){

        let localTotalCredits = 0;
        let localTotalCreditPoints = 0;

        // Calculate total credits and credit points
        responseData.Subjects.forEach((subject) => {
          const matchedSubject = credit && credit.find((c) => c.code === subject.Subject_Code);
          const courseCredits = matchedSubject && Number(matchedSubject.credits);
          const creditPoints = courseCredits * Number(subject.Points);

          localTotalCredits += courseCredits;
          localTotalCreditPoints += creditPoints;
        });



        const calculatedCgpa = (
          (localTotalCreditPoints + 5) / (localTotalCredits + 0.5)
        ).toFixed(2);

        // console.log(calculatedCgpa)


        const studentData = {

          Roll_No: responseData.Roll_No || "Unknown",
          Batch: responseData.Roll_No.substring(0, 2) || "0",
          Name: responseData.Name || "No Name",
          Cgpa: calculatedCgpa,
          semester: responseData.semester || "N/A",
          father_name: responseData.father_name || "N/A",
          College_name: responseData.College_name || "N/A",
          Result: responseData.Result || "N/A",
          Percentage: responseData.Percentage || 0,
        };
        console.log(studentData)
        // Send data to server to upload to the database
        const uploadResponse = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/uploadStudent`,
          studentData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        // Check the status of the response
        if (uploadResponse.status === 201) {
          // toast.success("Student data added successfully!", {
          //     position: "bottom-center",
          //     autoClose: 5000,
          //     hideProgressBar: false,
          //     closeOnClick: true,
          //     pauseOnHover: true,
          //     draggable: true,
          //     progress: undefined,
          //     theme: "dark",
          // });
        } else if (uploadResponse.status === 409) {
          // toast.warn("Student already exists!", {
          //     position: "bottom-center",
          //     autoClose: 5000,
          //     hideProgressBar: false,
          //     closeOnClick: true,
          //     pauseOnHover: true,
          //     draggable: true,
          //     progress: undefined,
          //     theme: "dark",
          // });
        } else {
          // toast.error("Unexpected response from server!", {
          //     position: "bottom-center",
          //     autoClose: 5000,
          //     hideProgressBar: false,
          //     closeOnClick: true,
          //     pauseOnHover: true,
          //     draggable: true,
          //     progress: undefined,
          //     theme: "dark",
          // });
        }

        // Log the response for debugging
        // console.log("Upload response:", uploadResponse);

      }
      } catch (error) {
        // Provide a more detailed error message and show a toast
        console.error("Error on student data:", error);

        // toast.error(`Error: ${error.response?.data?.message || error.message}`, {
        //     position: "bottom-center",
        //     autoClose: 5000,
        //     hideProgressBar: false,
        //     closeOnClick: true,
        //     pauseOnHover: true,
        //     draggable: true,
        //     progress: undefined,
        //     theme: "dark",
        // });
      }












      // Set timeout for modal handling
      setTimeout(() => {
        if (localStorage.getItem("isModal") === "closed") {
          setOpenModal(false);
        } else {
          setOpenModal(true);
        }
      }, 5000);

    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
      // Error toast
      toast.error("Incorrect File Upload or Server Busy!", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
  };


  const [sortOrder, setSortOrder] = useState(true); // true for ascending, false for descending

  const sortDataSubjects = (key) => {
    const sorted = [...dataSubjects].sort((a, b) => {
      const compare = a[key].localeCompare(b[key]);
      return sortOrder ? compare : -compare;
    });
    setDataSubjects(sorted);
    setSortOrder(!sortOrder); // Toggle the sort order
  };

  // let totalCreditPoints = 0;
  // let totalCredits = 0;

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Add the title
    doc.setFontSize(18);
    doc.text(
      "Result Analysis",
      doc.internal.pageSize.width / 2,
      14,
      {
        align: "center",
      }
    );

    // Student Details Table
    const studentDetails = [
      [
        {
          content: `Student Name: ${data.Name}`,
          colSpan: 2,
          styles: { halign: "left" },
        },
        {
          content: `Father Name: ${data.father_name}`,
          colSpan: 2,
          styles: { halign: "left" },
        },
      ],
      [
        {
          content: `Roll Number: ${data.Roll_No}`,
          colSpan: 2,
          styles: { halign: "left" },
        },
        {
          content: `Result: ${data.Result}`,
          colSpan: 2,
          styles: {
            halign: "left",
            fillColor:
              data.Result === "PASS" ? [144, 238, 144] : [255, 182, 193],
          },
        },
      ],
    ];

    doc.autoTable({
      body: studentDetails,
      startY: 30,
      styles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        halign: "center",
      },
      headStyles: {
        fillColor: [173, 216, 230],
      },
      bodyStyles: {
        minCellHeight: 10,
      },
      tableLineColor: [0, 0, 0],
      tableLineWidth: 0.1,
    });

    // Marks Table
    const tableColumn = [
      "Sno",
      "Subject Name",
      "Subject Code",
      "Internal Marks",
      "External Marks",
      "Grade",
      "Total Marks",
      "Credits",
      "Credit Points",
    ];
    const tableRows = [];

    let totalCreditPoints = 0;
    let totalCredits = 0;

    dataSubjects.forEach((subject, index) => {
      const courseCredits = (() => {
        const matchedSubject = credit.find(
          (c) =>
            c.code === subject.Subject_Code
        );
        return matchedSubject ? Number(matchedSubject.credits) : 0;
      })();

      const creditPoints = (() => {
        const matchedSubject = credit.find(
          (c) =>
            c.code === subject.Subject_Code
        );
        const course = matchedSubject ? Number(matchedSubject.credits) : 0;
        const creditPoints = course * Number(subject.Points);
        totalCreditPoints += creditPoints;
        return creditPoints;
      })();

      totalCredits += courseCredits;

      const subjectData = [
        index + 1,
        subject.Subject_Name,
        subject.Subject_Code,
        subject.Internal_Marks,
        subject.External_Marks,
        subject.Grade,
        subject.Total_Marks,
        courseCredits,
        creditPoints,
      ];
      tableRows.push(subjectData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: doc.lastAutoTable.finalY + 7,
      styles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
      },
      headStyles: {
        fillColor: [173, 216, 230],
      },
      bodyStyles: {
        minCellHeight: 10,
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
      tableLineColor: [0, 0, 0],
      tableLineWidth: 0.1,
    });

    // Calculate values for the summary table
    const totalMarks = Math.trunc(data.Percentage * data.Subjects.length);
    const maxMarks = data.Subjects.length * 100;
    const cgpa =
      data.semester > 4
        ? `${Math.min(((totalCreditPoints + 5) / (totalCredits + 0.5)).toFixed(2), 10.00)}`
        : `${Math.min(((totalCreditPoints + 5) / (totalCredits + 0.5)).toFixed(2), 10.00)}`;


    const summaryData = [
      [
        `${cgpa}`,
        `${totalMarks} / ${maxMarks}`,
        `${totalCreditPoints + 5}`,
        `${totalCredits + 0.5}`
      ],
    ];

    // Add the summary table below the first table with some space
    const finalY = doc.lastAutoTable.finalY;
    doc.autoTable({
      head: [["CGPA", "Total Marks", "Total Grade Points", "Total Credits"]], // Empty header to align with the summary data
      body: summaryData,
      startY: finalY + 7, // Add some space between the tables
      styles: {
        fillColor: [173, 216, 230],
        textColor: [0, 0, 0],
      },
      headStyles: {
        fillColor: [255, 255, 255],
      },
      tableLineColor: [0, 0, 0],
      tableLineWidth: 0.1,
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { cellWidth: "auto" },
        2: { cellWidth: "auto" },
        3: { cellWidth: "auto" },
      },
    });


    const pageHeight = doc.internal.pageSize.height;

    // Adding @MarkDigital at the bottom of the page
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text("@MarkDigital", 14, pageHeight - 10);
      doc.setFontSize(7)
      doc.text("Based on the calculated values, Accuracy and validity may vary", 7, pageHeight - 2);
    }
    doc.save(`${data.Roll_No}.pdf`);
  };


  let totalCreditPoints = 0;
  let totalCredits = 0;


  useEffect(() => {

    if (!localStorage.getItem("reload")) {
      localStorage.setItem("reload", 0)
    }

    if (localStorage.getItem("cloudinary_url")) {
      send();
    }

  }, [])


  return (

    <div>
      <LoadingBar color="#f11946" ref={loadingBarRef} shadow={true} height={4} />
      <ToastContainer />

      <h2 className="font-semibold m-auto flex justify-center text-xl  sm:hidden">Rajasthan Technical University</h2>
      <p className="mb-4 flex justify-center sm:hidden">Result Analysis </p>


      {isExploding && data && data.Result == "PASS" && <ConfettiExplosion />}

      {!loading ?

        <div className="grid grid-cols-1 gap-0 overflow-auto sm:grid-cols-3 sm:gap-8">


          <div className='w-full flex flex-col col-span-2 h-fit'>


            {!localStorage.getItem("cloudinary_url") && (
              <>

                <input
                  className="block w-full text-lg text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  id="large_size"
                  type="file"
                  onChange={(event) => {
                    handleFileChange(event);
                  }}

                  accept="application/pdf"
                />
              </>
            )}


            {localStorage.getItem("cloudinary_url") && localStorage.getItem("reload") === "1" && (
              <>
                <table className="text-center m-auto border-2 text-sm rtl:text-right text-gray-500 w-full">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="text-left px-6 py-2 border-2 ">
                        Student Name: {data && data.Name}
                      </th>
                      <th scope="col" className="text-left px-6 py-2 border-2">
                        Father Name: {data && data.father_name}
                      </th>
                    </tr>
                    <tr>
                      <th scope="col" className="text-left px-6 py-2 border-2">
                        Roll Number: {data && data.Roll_No}
                      </th>
                      <th scope="col" className="text-left px-6 py-2 border-2">
                        Remarks :

                        {data && data.Result === "PASS" ? <>

                          <span
                            className={`${data && data.Result != "FAIL" ? "bg-green-100" : "bg-red-100"
                              } text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded  mx-3`}
                          >
                            {data && data.Result}
                          </span>
                        </> : <>
                          <span
                            className={`${data && data.Result != "FAIL" ? "bg-red-100" : "bg-red-100"
                              } text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded mx-3`}
                          >
                            {data && data.Result}
                          </span>
                        </>}



                      </th>
                    </tr>
                  </thead>
                </table>

                {data && data.Result != "FAIL" ? (
                  <>
                    <div className="overflow-x-auto">
                      <table className="text-center border-2 text-sm  text-gray-500 marks-tbl bg-gray-50 table-auto">
                        <thead className="text-xs border-b-2 text-gray-700 uppercase">
                          <tr>
                            <th className="px-3 py-3">Sno</th>
                            <th className="text-left px-6 py-3 text-nowrap sm:text-wrap">
                              Subject Name{" "}
                              <button
                                onClick={() => sortDataSubjects("Subject_Name")}
                              >
                                <svg
                                  className="w-3 h-3 ms-1.5"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                                </svg>
                              </button>
                            </th>

                            <th className="px-3 py-3 text-nowrap sm:text-wrap">
                              INTERNAL MARKS{" "}
                              <button
                                onClick={() => sortDataSubjects("Internal_Marks")}
                              >
                                <svg
                                  className="w-3 h-3 ms-1.5"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                                </svg>
                              </button>
                            </th>
                            <th className="px-3 py-3 text-nowrap sm:text-wrap">
                              External Marks{" "}
                              <button
                                onClick={() => sortDataSubjects("External_Marks")}
                              >
                                <svg
                                  className="w-3 h-3 ms-1.5"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                                </svg>
                              </button>
                            </th>

                            <th className="px-3 py-3 text-nowrap sm:text-wrap">
                              Total Marks{" "}
                              <button
                                onClick={() => sortDataSubjects("Total_Marks")}
                              >
                                <svg
                                  className="w-3 h-3 ms-1.5"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                                </svg>
                              </button>
                            </th>
                            <th className="px-3 py-3 text-nowrap sm:text-wrap">
                              Grade{" "}
                              <button onClick={() => sortDataSubjects("Grade")}>
                                <svg
                                  className="w-3 h-3 ms-1.5"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                                </svg>
                              </button>
                            </th>
                            <th className="px-3 py-3 text-nowrap sm:text-wrap">Credits </th>
                            <th className="px-3 py-3 text-nowrap sm:text-wrap">
                              Credit Points
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {dataSubjects.map((subject, index) => {
                            const courseCredits = (() => {
                              const matchedSubject = credit.find(
                                (c) => c.code === subject.Subject_Code
                              );
                              return matchedSubject
                                ? Number(matchedSubject.credits)
                                : 0;
                            })();

                            const creditPoints = (() => {
                              const matchedSubject = credit.find(
                                (c) => c.code === subject.Subject_Code
                              );
                              const course = matchedSubject
                                ? Number(matchedSubject.credits)
                                : 0;
                              const creditPoints =
                                course * Number(subject.Points);
                              totalCreditPoints += creditPoints; // Add the credit points to the total
                              return creditPoints;
                            })();

                            totalCredits += courseCredits; // Add the course credits to the total
                            return (
                              <tr
                                key={index}
                                className="bg-white border-b text-gray-700"
                              >
                                <th className="px-3 py-2 font-medium text-black whitespace-nowrap ">
                                  {index + 1}
                                </th>
                                <td className="text-left px-6 py-2 text-nowrap sm:text-wrap">
                                  {subject.Subject_Name}
                                </td>

                                <td className="px-3 py-2">
                                  {subject.Internal_Marks}
                                </td>
                                <td className="px-3 py-2">
                                  {subject.External_Marks}
                                </td>
                                <td className="px-3 py-2">
                                  {subject.Total_Marks}
                                </td>
                                <td className="px-3 py-2">{subject.Grade}</td>
                                <td className="px-3 py-2">{courseCredits}</td>
                                <td className="px-3 py-2">{creditPoints}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="border-2 text-sm text-gray-700 bg-gray-50 last-table w-full table-auto">
                        <tr>
                          <th scope="col" className="p-4 text-center text-nowrap	">
                            {data && data.semester > 4 ? (
                              <>
                                CGPA:{" "}
                                {
                                  (() => {
                                    const result = ((totalCreditPoints + 5) / (totalCredits + 0.5)).toFixed(2);
                                    saveToData(result);
                                    return result;
                                  })()
                                }
                              </>
                            ) : (
                              <>
                                CGPA:{" "}
                                {
                                  (() => {
                                    const result = ((totalCreditPoints + 5) / (totalCredits + 0.5)).toFixed(2);
                                    saveToData(result);
                                    return result;
                                  })()
                                }
                              </>
                            )}
                          </th>

                          <th scope="col" className="p-4 text-center text-nowrap">
                            Total Marks :{" "}
                            {Math.trunc(
                              data && data.Subjects &&
                              data.Percentage * data.Subjects.length
                            )}{" "}
                            / {data && data.Subjects && 100 * data.Subjects.length}
                          </th>
                          <th scope="col" className="p-4 text-center text-nowrap">
                            Total Grade Points : {totalCreditPoints + 5}
                          </th>
                          <th scope="col" className="p-4 text-center text-nowrap">
                            Total Credits : {totalCredits + 0.5}
                          </th>

                        </tr>
                      </table>
                    </div>
                  </>
                ) : (
                  <></>)}


                {data && data.Result != "FAIL" && (
                  <div className="bg-white sm:bg-gray-50 rounded-lg mt-6 sm:p-5 sm:border sm:border-gray-200 mb-20 flex flex-col m-auto sm:flex-row sm:w-full">
                    <button type="button" className="text-white bg-blue-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-[#F7BE38]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center items-center dark:focus:ring-[#F7BE38]/50 w-fit inline-flex" onClick={downloadPDF}>
                      <svg
                        id="Layer_1"
                        data-name="Layer 1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 122.88 122.88"
                        className="w-4 h-4 me-2 -ms-1"
                      >
                        <title>round-black-bottom-arrow</title>
                        <path
                          fill="#FFFFFF"
                          d="M122.85,61.45h0A61.39,61.39,0,0,0,61.45,0V0h0V0A61.38,61.38,0,0,0,0,61.43H0v0H0a61.35,61.35,0,0,0,61.4,61.38v0h0v0a61.34,61.34,0,0,0,61.38-61.4ZM61.44,94.22l-31-34.32H50.25V36H72.62V59.89H92.4l-31,34.33Z"
                        />
                      </svg>


                      Download Report
                    </button>


                    <button type="button" className="text-white bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:outline-none focus:ring-[#F7BE38]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center items-center dark:focus:ring-[#F7BE38]/50 hidden sm:inline-flex ml-3" onClick={() => { localStorage.clear(); window.location.reload(); }}>
                      <svg
                        version="1.1"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        x="0px"
                        y="0px"
                        width="109.484px"
                        height="122.88px"
                        viewBox="0 0 109.484 122.88"
                        enableBackground="new 0 0 109.484 122.88"
                        xmlSpace="preserve"
                        className="w-4 h-4 me-2 -ms-1"
                      >
                        <g>
                          <path
                            fill="#FFFFFF"
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M2.347,9.633h38.297V3.76c0-2.068,1.689-3.76,3.76-3.76h21.144 c2.07,0,3.76,1.691,3.76,3.76v5.874h37.83c1.293,0,2.347,1.057,2.347,2.349v11.514H0V11.982C0,10.69,1.055,9.633,2.347,9.633 L2.347,9.633z M8.69,29.605h92.921c1.937,0,3.696,1.599,3.521,3.524l-7.864,86.229c-0.174,1.926-1.59,3.521-3.523,3.521h-77.3 c-1.934,0-3.352-1.592-3.524-3.521L5.166,33.129C4.994,31.197,6.751,29.605,8.69,29.605L8.69,29.605z M69.077,42.998h9.866v65.314 h-9.866V42.998L69.077,42.998z M30.072,42.998h9.867v65.314h-9.867V42.998L30.072,42.998z M49.572,42.998h9.869v65.314h-9.869 V42.998L49.572,42.998z"
                          />
                        </g>
                      </svg>

                      Clear My Data
                    </button>

                    <button className="text-center text-blue-500 underline mt-4 font-semibold block sm:hidden" onClick={() => { localStorage.clear(); window.location.reload(); }}>Check Another </button>



                  </div>
                )}


              </>
            )}

          </div>



          <div className='flex flex-col w-full mb-20'>

            {localStorage.getItem("cloudinary_url") && localStorage.getItem("reload") === "1" && (
              <>
                <div className="bg-white rounded-lg h-fit border border-gray-200">
                  <MarksBarGraph dataSubjects={dataSubjects} />
                </div>

                <div className="bg-white rounded-lg h-fit mt-6 p-5 border border-gray-200">
                  <GradePieChart dataSubjects={dataSubjects} />
                </div>


              </>

            )}

            <div className={`bg-white rounded-lg h-fit p-5 border border-gray-200 mt-6 ${localStorage.getItem("cloudinary_url") ? "sm:mt-6" : "sm:mt-0"}`}>

              <div className="mt-4 text-center">
                <h3 className="text-lg font-semibold text-gray-700">Analyze Your Grades with MarkAnalysis Bot</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Get detailed insights and analysis directly on Telegram. Click the button below to start chatting with MarkAnalysis Bot.
                </p>

                <a href="https://t.me/MarkAnalysisBot" target="_blank" rel="noopener noreferrer">
                  <button className="mt-4 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors font-semibold">
                    Chat with MarkAnalysis Bot
                  </button>
                </a>
              </div>
            </div>


          </div>
        </div>

        :

        <Skeleton count={15} />
      }

    </div>
  )
}

export default Result