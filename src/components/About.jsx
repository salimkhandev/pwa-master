import React from 'react';
import { useContextAPI } from './ContextAPI';


const About = () => {
  const { value, setValue ,netAvail} = useContextAPI();
  const team = [
    {
      name: "John Doe",
      role: "Lead Developer",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&q=80",
      description: "10+ years of experience in web development"
    },
    {
      name: "Jane Smith",
      role: "UI/UX Designer",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&q=80",
      description: "Expert in creating beautiful user experiences"
    },
    {
      name: "Mike Johnson",
      role: "Product Manager",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&q=80",
      description: "Passionate about building great products"
    }
  ];

  return (
    <div className="fade-in">
      <header className="text-center mb-12">
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 700,
          marginBottom: '1rem',
          fontFamily: 'Montserrat, sans-serif'
        }}>
          About Us {value}
        </h1>
        <p style={{ 
          fontSize: '1.1rem', 
          color: '#64748b',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Meet our team of dedicated professionals working to bring you the best experience
        </p>
      </header>

      <div className="card-grid">
        {team.map((member, index) => (
          <div key={index} className="card slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <img 
              src={member.image} 
              alt={member.name}
              style={{ height: '250px' }}
            />
            <div className="card-content">
              <h3>{member.name}</h3>
              <p style={{ 
                color: 'var(--primary-color)',
                fontWeight: 500,
                marginBottom: '0.5rem'
              }}>
                {member.role}
              </p>
              <p>{member.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About; 