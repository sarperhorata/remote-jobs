import React from 'react';
import { Link } from 'react-router-dom';
import { FaBuilding, FaMapMarkerAlt, FaBriefcase, FaMoneyBillWave } from 'react-icons/fa';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  logo: string;
}

const FeaturedJobs: React.FC = () => {
  const featuredJobs: Job[] = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: 'TechCorp',
      location: 'Remote',
      type: 'Full-time',
      salary: '$120k - $150k',
      logo: 'https://via.placeholder.com/50'
    },
    {
      id: '2',
      title: 'Backend Engineer',
      company: 'DataFlow',
      location: 'Remote',
      type: 'Full-time',
      salary: '$130k - $160k',
      logo: 'https://via.placeholder.com/50'
    },
    {
      id: '3',
      title: 'DevOps Engineer',
      company: 'CloudTech',
      location: 'Remote',
      type: 'Full-time',
      salary: '$140k - $170k',
      logo: 'https://via.placeholder.com/50'
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Remote Jobs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mr-4">
                  {FaBuilding({ className: "text-gray-600 text-xl" })}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                  <p className="text-gray-600">{job.company}</p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  {FaMapMarkerAlt({ className: "mr-2 text-gray-500" })}
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  {FaBriefcase({ className: "mr-2 text-gray-500" })}
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  {FaMoneyBillWave({ className: "mr-2 text-gray-500" })}
                  <span>{job.salary}</span>
                </div>
              </div>
              <Link
                to={`/jobs/${job.id}`}
                className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs; 