import React from 'react';

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: "Project 1",
      description: "Description of project 1",
      technologies: ["React", "Node.js", "MongoDB"],
      link: "https://project1.com",
      github: "https://github.com/username/project1"
    },
    {
      id: 2,
      title: "Project 2",
      description: "Description of project 2",
      technologies: ["React", "Firebase", "Tailwind"],
      link: "https://project2.com",
      github: "https://github.com/username/project2"
    },
    // Add more projects as needed
  ];

  return (
    <section className="projects-section">
      <h2>My Projects</h2>
      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="tech-stack">
              {project.technologies.map((tech, index) => (
                <span key={index} className="tech-tag">{tech}</span>
              ))}
            </div>
            <div className="project-links">
              <a href={project.link} target="_blank" rel="noopener noreferrer">Live Demo</a>
              <a href={project.github} target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects; 