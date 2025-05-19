import React from 'react';
import { Link } from 'react-router-dom';
import { FaCode, FaServer, FaLaptopCode, FaMobile, FaDatabase, FaCloud } from 'react-icons/fa';

interface Category {
  id: string;
  name: string;
  count: number;
  icon: React.ReactNode;
}

const PopularCategories: React.FC = () => {
  const categories: Category[] = [
    {
      id: '1',
      name: 'Frontend Development',
      count: 120,
      icon: FaCode({ className: "text-2xl text-blue-500" })
    },
    {
      id: '2',
      name: 'Backend Development',
      count: 85,
      icon: FaServer({ className: "text-2xl text-blue-500" })
    },
    {
      id: '3',
      name: 'Full Stack Development',
      count: 95,
      icon: FaLaptopCode({ className: "text-2xl text-blue-500" })
    },
    {
      id: '4',
      name: 'Mobile Development',
      count: 75,
      icon: FaMobile({ className: "text-2xl text-blue-500" })
    },
    {
      id: '5',
      name: 'Database Administration',
      count: 60,
      icon: FaDatabase({ className: "text-2xl text-blue-500" })
    },
    {
      id: '6',
      name: 'Cloud Computing',
      count: 45,
      icon: FaCloud({ className: "text-2xl text-blue-500" })
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Popular Job Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/jobs?category=${category.id}`}
              className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mr-4">
                  {category.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-gray-600">{category.count} jobs available</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCategories; 