import React from 'react'
import home1 from '../assets/home1.jpg'
import home2 from '../assets/home2.jpg'
import home3 from '../assets/home3.jpg'
import home4 from '../assets/home4.jpg'
import home5 from '../assets/home5.jpg'
import home6 from '../assets/home6.jpg'
import home7 from '../assets/home7.jpg'

const images = [
  {
    src: home1,
    description: 'Tire Management System'
  },
  {
    src: home2,
    description: 'POS System with/without Midtrans'
  },
  {
    src: home3,
    description: 'Company Profile customized & animated'
  },
  {
    src: home5,
    description: 'Personal Tools, Dashboard with automated report'
  },
  {
    src: home6,
    description: 'Create, Read, Update, Delete (CRUD) Database'
  },
  {
    src: home7,
    description: 'Product Barcode Generator'
  }
]

const Portofolio = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfdfb] to-[#e2ebf0] px-4 py-10">
      <div className="max-w-5xl mx-auto text-center font-montserrat">
        <h1 className="text-4xl font-bold mb-2 text-blue">Our Portfolio</h1>
        <p className="text-gray-600 text-lg mb-8">
          A collection of kreative idea
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
        {images.map((item, index) => (
          <div
            key={index}
            className="flex flex-col overflow-hidden rounded-2xl shadow-md bg-white transition transform hover:scale-[1.03]"
          >
            <img
              src={item.src}
              alt={`Portfolio ${index + 1}`}
              className="w-full h-64 object-contain"
              style={{
                imageRendering: 'auto'
              }}
            />
            <div className="p-4 text-center">
              <p className="text-gray-700 font-poppins text-sm">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Portofolio
