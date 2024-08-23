import React, { useEffect, useState, useRef } from 'react';
import LoadingBar from 'react-top-loading-bar'
import LazyLoad from 'react-lazyload';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const Leaderboard = () => {

  const loadingBarRef = useRef(null);


  const [students, setStudents] = useState([]);
  const [topStudent, setTopStudent] = useState(null);
  const [otherStudents, setOtherStudents] = useState([]);

  const localName = localStorage.getItem('name');

  useEffect(() => {
    loadingBarRef.current.continuousStart();
    fetch('https://result-analysis-backend.vercel.app/student_get_result')
      .then((response) => response.json())
      .then((data) => {

        const localRollNo = localStorage.getItem('roll_no');
        const localSemester = localStorage.getItem('semester');



        const filteredStudents = data
          .filter(student => student.Cgpa > 7.5 && student.semester === localSemester && student.Roll_No === localRollNo)
          .sort((a, b) => b.Cgpa - a.Cgpa || a.Roll_No.localeCompare(b.Roll_No));


        let rank = 1;
        filteredStudents.forEach((student, index) => {
          if (index > 0 && student.Cgpa < filteredStudents[index - 1].Cgpa) {
            rank = index + 1;
          }
          student.rank = rank;
        });


        const top = filteredStudents.shift();
        setTopStudent(top);
        setOtherStudents(filteredStudents);
        loadingBarRef.current.complete();
      })
      .catch(error => {
        console.error('Error fetching student data:', error);
      });
  }, []);

  const superScript = (rank) => {
    let sup = "st";
    if (rank > 10) {
      let lastDigit = rank % 10;

      if (lastDigit == 1) {
        sup = "st";
      } else if (lastDigit == 2) {
        sup = "nd";
      } else if (lastDigit == 3) {
        sup = "rd";
      } else {
        sup = "th";
      }
    } else {
      if (rank == 1) {
        sup = "st";
      } else if (rank == 2) {
        sup = "nd";
      } else if (rank == 3) {
        sup = "rd";
      } else {
        sup = "th";
      }
    }

    return sup;

  }


  const firstName = (name) => {
    let nameArr = name.split(" ");

    return nameArr[0];
  }



  const userRank = localStorage.getItem('user_rank');

  return (

    <div>
      <LoadingBar color="#f11946" ref={loadingBarRef} shadow={true} height={4} />

      {localStorage.getItem("roll_no") && localStorage.getItem("clg_name") && localStorage.getItem("name") && localStorage.getItem("semester") && localStorage.getItem("cloudinary_url") ?
        <>
          <div className="p-5 text-lg font-semibold text-black bg-blue-100 border border-blue-300 rounded-lg shadow-md dark:bg-gray-800 dark:text-blue-400 dark:border-blue-600 flex items-center sm:hidden" role="alert">
            <img src="https://i.postimg.cc/Prh45C24/podium.png" alt='LeaderBoard' className='w-8 mr-4' />
            Semester - {localStorage.getItem("semester")} Leaderboard
          </div>

          <div className="grid grid-cols-1 gap-0 overflow-auto sm:grid-cols-3 sm:gap-20">
            <div className='flex flex-col relative right-0 top-0 w-full mt-6 mr-6 sm:fixed sm:w-1/4'>
              <div className="bg-white p-4 rounded-lg h-fit border border-gray-200 mb-6 sm:mb-0 hidden sm:block">
                <h2 className="font-semibold mb-2">Your Rank in Semester {localStorage.getItem("semester")}</h2>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-700 font-semibold">{localStorage.getItem("name")}</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                  <span className="font-semibold text-gray-500">Position</span>
                  <div className="flex items-center">
                    <img src="https://i.ibb.co/VD35JT0/trophy.png" alt="EXP icon" className="w-5 h-5 mr-2" />
                    <span className="font-semibold text-gray-700">{localStorage.getItem('user_rank')}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg h-fit mt-6 p-5 border border-gray-200 hidden sm:block">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="text-lg font-semibold text-gray-800">Want your friend to rank on the leaderboard ?</p>
                  </div>
                </div>
                <a
                  href="https://api.whatsapp.com/send?text=🚀 Discover Your Ranking! 🚀%0A%0ACheck out the latest leaderboard results and see where you stand among your peers!%0A%0A🔥 Analyze your performance and find out how you can climb up the ranks!%0A%0A👉 Click here to view your results: [Your Link Here]"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center px-4 py-2 text-white bg-green-700 hover:bg-green-600 rounded-lg transition mt-4 font-bold"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-whatsapp mr-3" viewBox="0 0 16 16">
                    <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
                  </svg>
                  Share on WhatsApp
                </a>
              </div>



            </div>

            <div className='w-full flex flex-col col-span-2'>
              <div className="p-5 mb-6 text-lg font-semibold text-black bg-blue-100 border border-blue-300 rounded-lg shadow-md dark:bg-gray-800 dark:text-blue-400 dark:border-blue-600 items-center hidden sm:flex" role="alert">
                <img src="https://i.postimg.cc/Prh45C24/podium.png" alt='LeaderBoard' className='w-8 mr-4' />
                Semester - {localStorage.getItem("semester")} Leaderboard
              </div>


              <div className="col-span-2 sm:bg-white relative mb-9 bg-gray-50 overflow-y-auto h-1/2 sm:h-full">
                <div className="space-y-4">
                  {topStudent && (
                    <div
                      className="flex items-center justify-between bg-yellow-50 p-2 sm:p-4 border border-yellow-500 rounded-lg shadow-md"
                      style={{
                        backgroundImage: 'url("https://media.istockphoto.com/id/477138999/vector/light-background.jpg?s=612x612&w=0&k=20&c=hkkmxC-1k29pY5NmgCT6tZSHDFJdsOHAjn_QaI6uq2E=")',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center'
                      }}
                    >
                      <div className="flex items-center">
                        <div className="text-green-600 font-bold text-lg mr-4">
                          {topStudent.rank}
                          <sup>{topStudent.rank === 1 ? 'st' : topStudent.rank === 2 ? 'nd' : 'th'}</sup>
                        </div>
                        <img className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500 mr-4" src={`https://avatar.iran.liara.run/public?id=${Math.floor(100000 + Math.random() * 900000)}`} alt="Bordered avatar" />
                        <div>
                          <div className="font-semibold text-gray-700 uppercase">{firstName(topStudent.Name)}**** {(topStudent.Name).trim() === (localStorage.getItem("name")).trim() && topStudent.semester === localStorage.getItem("semester") && localStorage.setItem('user_rank', topStudent.rank)}</div>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <span className="bg-transparent sm:bg-yellow-100 text-yellow-700 sm:px-2 py-1 rounded-full">
                              CGPA : {topStudent.Cgpa}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-yellow-600 font-bold text-xl flex items-center">
                        <img src="https://i.ibb.co/VD35JT0/trophy.png" alt="Coin Icon" className="w-12 mr-1" />
                      </div>
                    </div>
                  )}

                  {otherStudents.length > 0 && (
                    <div>
                      {otherStudents.map((student, index) => (
                        <LazyLoad key={student._id} height={100} offset={100} placeholder={<div className="p-4"><Skeleton count={5} /></div>}>
                          <div
                            className="flex items-center justify-between bg-yellow-50 p-2 sm:p-4 border border-gray-400 rounded-lg shadow-md mb-4"
                            style={{
                              backgroundImage: `${student.rank == 1 ? "url('https://media.istockphoto.com/id/477138999/vector/light-background.jpg?s=612x612&w=0&k=20&c=hkkmxC-1k29pY5NmgCT6tZSHDFJdsOHAjn_QaI6uq2E=')" : "url('https://media.istockphoto.com/id/1372488730/vector/abstract-gray-hexagon-background-vector.jpg?s=612x612&w=0&k=20&c=dCCj1ptJCVg8BW2WWNTZmZFcOyAeA5UuGDPH0aeQ5uY=')"}`,
                              backgroundSize: 'cover',
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: 'center'
                            }}

                          >
                            <div className="flex items-center">
                              <div className="text-green-600 font-bold text-lg mr-4">
                                {student.rank}
                                <sup>{superScript(student.rank)}</sup>
                              </div>
                              <img className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500 mr-4" src={`https://avatar.iran.liara.run/public?id=${Math.floor(100000 + Math.random() * 900000)}`} alt="Bordered avatar" />
                              <div>
                                <div className="font-semibold text-gray-700 uppercase">{firstName(student.Name)}**** {(student.Name).trim() === (localStorage.getItem("name")).trim() && student.semester === localStorage.getItem("semester") && localStorage.setItem('user_rank', student.rank)}</div>
                                <div className={`text-sm text-yellow-700 mt-1 ${student.rank == 1 ? "bg-transparent sm:bg-yellow-100" : "bg-transparent sm:bg-gray-200"} rounded-full sm:px-2 py-1 w-fit`}>
                                  CGPA : {student.Cgpa}
                                </div>
                              </div>
                            </div>
                            {student.rank == 1 &&

                              <div className="text-yellow-600 font-bold text-xl flex items-center">
                                <img src="https://i.ibb.co/VD35JT0/trophy.png" alt="Coin Icon" className="w-12 mr-1" />
                              </div>

                            }

                          </div>
                        </LazyLoad>
                      ))}
                    </div>
                  )}
                </div>
              </div>




              <div className="bg-white p-4 rounded-lg h-fit border border-gray-200 mb-6 sm:mb-0 sm:hidden">
                <h2 className="font-semibold mb-2">Your Rank in Semester {localStorage.getItem("semester")}</h2>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-700 font-semibold">{localStorage.getItem("name")}</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                  <span className="font-semibold text-gray-500">Position</span>
                  <div className="flex items-center">
                    <img src="https://i.ibb.co/VD35JT0/trophy.png" alt="EXP icon" className="w-5 h-5 mr-2" />
                    <span className="font-semibold text-gray-700">{localStorage.getItem('user_rank')}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>


        </>

        :


        <div className="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800" role="alert">
          <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <div>
            <span className="font-medium">Leaderboard alert!</span> Please First upload your RTU Result to rank and view Leaderboard.
          </div>

        </div>

      }


    </div>

  )
}

export default Leaderboard;
