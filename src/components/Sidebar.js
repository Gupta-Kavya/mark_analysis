import React, { useEffect, useState } from 'react';
import { Link, useRoutes, useLocation } from "react-router-dom";
import Leaderboard from './Leaderboard';
import Result from './Result';
import Feedback from './Feedback';
import { ChartBarIcon, ChatAlt2Icon } from '@heroicons/react/solid';

const Sidebar = () => {

  const location = useLocation();
  const { pathname } = location;

  let element = useRoutes([
    {
      path: "/*",
      element: <Result />,
    },

    {
      path: "/Leaderboard",
      element: <Leaderboard />,
    },
    {
      path: "/Feedback",
      element: <Feedback />,
    },
  ]);


  return (
    <>
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className="items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 hidden sm:block"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          />
        </svg>
      </button>
      <aside
        id="default-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-white border-r border-gray-200">
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                to="/Result"
                className={`flex items-center p-2 rounded-lg group ${pathname === '/Result' || pathname === '/'
                  ? 'text-orange-600 bg-orange-100 dark:text-white dark:bg-gray-700'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                <svg
                  className={`w-5 h-5 transition duration-75 ${pathname === '/Result' || pathname === '/'
                    ? 'text-orange-500 dark:text-gray-400 '
                    : 'text-gray-500 dark:text-gray-400'
                    }`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 21"
                >
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                </svg>
                <span className="ms-3">Result Analysis</span>
              </Link>
            </li>
            <li>
              <Link
                to="/Leaderboard"
                className={`flex items-center p-2 rounded-lg group ${pathname === '/Leaderboard'
                  ? 'text-orange-600 bg-orange-100 dark:text-white dark:bg-gray-700'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                <ChartBarIcon
                  className={`flex-shrink-0 w-5 h-5 transition duration-75 ${pathname === '/Leaderboard'
                    ? 'text-orange-500 dark:text-gray-400'
                    : 'text-gray-500 dark:text-gray-400'
                    }`}
                  aria-hidden="true"
                />
                <span className="flex-1 ms-3 whitespace-nowrap">Leaderboard</span>
                <span class="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-white bg-gradient-to-r from-red-400 to-red-600 rounded-full dark:from-gray-700 dark:to-gray-500 dark:text-gray-300">
                  New
                </span>

              </Link>
            </li>








            <li>
              <Link
                to="/Feedback"
                className={`flex items-center p-2 rounded-lg group ${pathname === '/Feedback'
                  ? 'text-orange-600 bg-orange-100 dark:text-white dark:bg-gray-700'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                <ChatAlt2Icon
                  className={`flex-shrink-0 w-5 h-5 transition duration-75 ${pathname === '/Feedback'
                    ? 'text-orange-500 dark:text-gray-400'
                    : 'text-gray-500 dark:text-gray-400'
                    }`}
                  aria-hidden="true"
                />
                <span className="flex-1 ms-3 whitespace-nowrap">Feedback</span>
              </Link>
            </li>


          </ul>

          {/* <div id="dropdown-cta" class="p-4 mt-16 rounded-lg bg-blue-50 dark:bg-blue-900 " role="alert">
         <div class="flex items-center mb-3">
            <span class="bg-orange-100 text-orange-800 text-sm font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-orange-200 dark:text-orange-900">Beta</span>
            <button type="button" class="ms-auto -mx-1.5 -my-1.5 bg-blue-50 inline-flex justify-center items-center w-6 h-6 text-blue-900 rounded-lg focus:ring-2 focus:ring-blue-400 p-1 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-400 dark:hover:bg-blue-800" data-dismiss-target="#dropdown-cta" aria-label="Close">
               <span class="sr-only">Close</span>
               <svg class="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
               </svg>
            </button>
         </div>
         <p class="mb-3 text-sm text-blue-800 dark:text-blue-400">
            Preview the new Flowbite dashboard navigation! You can turn the new navigation off for a limited time in your profile.
         </p>
         <a class="text-sm text-blue-800 underline font-medium hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300" href="#">Turn new navigation off</a>
      </div> */}


        </div>


      </aside>
      <div className="p-6 sm:ml-64 bg-gray-50 sm:bg-white">

        {element}


        <footer class="sm:ml-64 fixed right-0 bottom-0 left-0 z-20 w-full p-4 bg-white border-t border-gray-200 shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800 dark:border-gray-600 hidden sm:block">
          <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2024 <a href="https://flowbite.com/" class="hover:underline">MarkDigital</a>. All Rights Reserved.
            <button data-modal-target="disclaimer-modal" data-modal-toggle="disclaimer-modal" class="ml-4 text-sm font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600 underline" type='button'>Disclaimer</button >
            <button data-modal-target="whatsnew-modal" data-modal-toggle="whatsnew-modal" class="ml-4 text-sm font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600 underline" type='button'>What's New ? v2.4</button>
          </span>
        </footer>





        <div
          id="disclaimer-modal"
          tabIndex={-1}
          aria-hidden="true"
          className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-2xl max-h-full">
            {/* Modal content */}
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              {/* Modal header */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h2 className="text-xl font-bold">Disclaimer : Result Analysis Tool</h2>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-hide="disclaimer-modal"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              {/* Modal body */}
              <div className='bg-slate-100 p-4 rounded-b-xl'>
                <div className="max-w-2xl mx-auto bg-slate-100 ">

                  <ol className="list-decimal list-inside text-justify">
                    <li className="mb-2">Publication Rights: We do not hold any rights to publish the data displayed on this website. The content is extracted from publicly available PDF documents for informational purposes only.</li>
                    <li className="mb-2">Accuracy of Data: While we strive to provide accurate and up-to-date information, we cannot guarantee the accuracy, completeness, or reliability of the data presented on this website. Users are advised to verify any information obtained here before making decisions based on it.</li>
                    <li className="mb-2">No Warranties: The information provided on this website is provided "as is" without any representations or warranties, express or implied. We make no representations or warranties in relation to the accuracy or completeness of the information.</li>
                    <li className="mb-2">Use at Your Own Risk: We shall not be liable for any loss or damage arising from the use of this website or its content.</li>
                    <li className="mb-2">Past Calculation Basis: The results displayed on this website are based on past calculations and may not reflect the current situation accurately. Users are advised to exercise caution and seek professional advice if needed.</li>
                    <li className="mb-2">Changes and Updates: We reserve the right to modify, update, or remove any content on this website without prior notice.</li>
                  </ol>
                  <p className="mt-4 font-semibold">By using this website, you agree to the terms of this disclaimer.</p>
                </div>
              </div>


            </div>
          </div>
        </div>



        <div
          id="whatsnew-modal"
          tabIndex={-1}
          aria-hidden="true"
          className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-2xl max-h-full">
            {/* Modal content */}
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              {/* Modal header */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h2 className="text-xl font-bold">What's New : Result Analysis Tool</h2>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-hide="whatsnew-modal"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              {/* Modal body */}
              <div className='bg-slate-100 p-4 rounded-b-xl'>
                <div className="max-w-2xl mx-auto bg-slate-100">
                  <ol className="list-decimal list-inside">
                    <li className='my-1 font-bold'>Leaderboard Comming Soon ! </li>
                    <li className='my-1'>No more Delays in Analysis ! </li>
                    <li className='my-1'>Abbreviation used for Subject name in Bargraph</li>
                    <li className='my-1'>Introduced Histograms and PieChart for better Analysis</li>
                    <li className='my-1'>Bugs Fixed ! Impoved UI for Mobile Devices</li>
                    <li className="mb-2">From v2.0 The Analysis is available for all the below mentioned Branches </li>
                    <div className="sub ml-4">
                      <ol className=' list-decimal list-inside text-sm mb-2'>

                        <li>Computer Science Engineering (I-VIII Semester)</li>
                        <li>Computer Science and Engineering (Artificial Intelligence) (I-VIII Semester)</li>
                        <li>Computer Science and Engineering (Data Science) (I-VIII Semester)</li>
                        <li>Computer Science and Engineering (Internet of Things) (I-VIII Semester)</li>
                        <li>Information Technology (I-VIII Semester)</li>
                        <li>Electrical Engineering (I-VIII Semester)</li>
                        <li>Mechanical Engineering (I-VIII Semester)</li>
                        <li>Electronics Engineering (I-VIII Semester)</li>
                        <li>Civil Engineering (I-VIII Semester)</li>
                      </ol>
                    </div>
                    <li className=' my-1'>From v2.0, You will be able to save your Analysis as a PDF File <br /></li>
                  </ol>
                </div>
              </div>


            </div>
          </div>
        </div>





        <div class="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600 sm:hidden">
          <div class="grid h-full max-w-lg grid-cols-3 mx-auto font-medium">
          <Link to="/Leaderboard" class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
              <img src='https://cdn-icons-png.freepik.com/512/7321/7321998.png' alt='leaderboard' className='w-5 h-5 mb-2' />

              <span class="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Leaderboard</span>
            </Link>

            <Link to="/Result" class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
              <img src='https://cdn-icons-png.freepik.com/256/2720/2720920.png?semt=ais_hybrid' alt='leaderboard' className='w-5 h-5 mb-2' />
              <span class="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Result</span>
            </Link>
        
            <Link to="/Feedback" class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
              <img src='https://cdn-icons-png.flaticon.com/512/4658/4658943.png' alt='leaderboard' className='w-5 h-5 mb-2' />

              <span class="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Feedback</span>
            </Link>
          </div>
        </div>




      </div>
    </>

  )
}

export default Sidebar