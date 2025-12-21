import React from 'react';
import { Book, Search, ChevronRight } from 'lucide-react';

const Documentation: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
       
       {/* Sidebar */}
       <aside className="w-full md:w-64 bg-gray-900 text-gray-300 flex-shrink-0 h-auto md:min-h-screen">
          <div className="p-6 border-b border-gray-800">
             <div className="flex items-center text-white font-bold text-lg">
                <Book className="h-5 w-5 mr-2" />
                Wiki
             </div>
          </div>
          
          <div className="p-4">
             <div className="relative mb-6">
                <input 
                  type="text" 
                  placeholder="Find a page..." 
                  className="w-full bg-gray-800 border border-gray-700 rounded-md py-1.5 pl-3 pr-8 text-sm text-gray-200 focus:outline-none focus:border-gray-600"
                />
             </div>

             <nav className="space-y-1">
                <div className="pb-4">
                   <p className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Home</p>
                   <a href="#overview" className="flex items-center px-2 py-2 text-sm font-medium text-white bg-gray-800 rounded-md">
                      Tutor Hub - User Docs
                   </a>
                   <a href="#homepage" className="flex items-center px-2 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-md pl-6">
                      Homepage Overview
                   </a>
                   <a href="#search" className="flex items-center px-2 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-md pl-6">
                      Searching for Tutors
                   </a>
                </div>

                 <div className="pb-4">
                   <p className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Using Filters</p>
                   <a href="#filters" className="flex items-center px-2 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-md">
                      Subject Filter
                   </a>
                   <a href="#filters" className="flex items-center px-2 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-md">
                      Price Range Filter
                   </a>
                </div>
             </nav>
          </div>
       </aside>

       {/* Main Content */}
       <main className="flex-1 p-8 md:p-12 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
             <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
                <h1 className="text-3xl font-bold text-gray-900">Home</h1>
                <div className="space-x-2">
                   <button className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded text-gray-600 hover:bg-gray-50">Edit</button>
                   <button className="px-3 py-1.5 text-xs font-medium bg-green-600 text-white rounded hover:bg-green-700">New Page</button>
                </div>
             </div>

             <div className="prose prose-blue max-w-none text-gray-600">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Tutor Hub - User Documentation</h2>
                <p className="mb-6">
                   Welcome to Tutor Hub! This comprehensive guide will help you navigate and use all the features of our platform to find the perfect tutor for your learning journey.
                </p>

                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
                   <h3 className="text-lg font-bold text-gray-900 mb-4">Table of Contents</h3>
                   <ol className="list-decimal list-inside space-y-1 text-primary-600 underline cursor-pointer">
                      <li><span className="text-primary-600">Homepage Overview</span></li>
                      <li><span className="text-primary-600">Searching for Tutors</span></li>
                      <li><span className="text-primary-600">Using Filters</span></li>
                      <li><span className="text-primary-600">Viewing Tutor Profiles</span></li>
                      <li><span className="text-primary-600">Booking a Session</span></li>
                   </ol>
                </div>

                <div id="homepage" className="mb-10">
                   <h3 className="text-xl font-bold text-gray-800 mb-3">Homepage Overview</h3>
                   <p className="mb-4">The Tutor Hub homepage is designed to help you quickly find tutors. Here's what you'll see:</p>
                   <ul className="list-disc list-inside space-y-2 ml-4">
                      <li><strong>Header Section:</strong> Contains navigation to Find Tutors, Dashboards, and Login/Sign Up.</li>
                      <li><strong>Hero Search:</strong> A prominent search bar to type subjects like "Math" or "Physics".</li>
                      <li><strong>Popular Subjects:</strong> Quick access icons for common subjects.</li>
                   </ul>
                </div>

                <div id="search" className="mb-10">
                   <h3 className="text-xl font-bold text-gray-800 mb-3">Searching for Tutors</h3>
                   <p className="mb-4">Use the main search bar to enter keywords. The results will update in real-time. You can search by:</p>
                   <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Subject Name (e.g., "Biology")</li>
                      <li>Tutor Name</li>
                      <li>Keywords (e.g., "Algebra", "Calculus")</li>
                   </ul>
                </div>

                 <div id="filters" className="mb-10">
                   <h3 className="text-xl font-bold text-gray-800 mb-3">Using Filters</h3>
                   <p className="mb-4">The left sidebar allows you to refine your search results.</p>
                   <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                      <p className="text-sm text-yellow-700">
                         <strong>Tip:</strong> Use the "Clear all filters" button at the bottom of the sidebar to reset your view.
                      </p>
                   </div>
                </div>

             </div>
          </div>
       </main>
    </div>
  );
};

export default Documentation;