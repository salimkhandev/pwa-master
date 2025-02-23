// import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

function NavBar() {
  // const queryClient = useQueryClient();

  const prefetchServices = () => {
    // queryClient.prefetchQuery({
    //   queryKey: ['services'],
    //   queryFn: async () => {
    //     const response = await fetch('https://api.example.com/services');
    //     return response.json();
    //   },
    // });

  };

  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li>
          <Link 
            to="/services" 
            onMouseEnter={prefetchServices}
          >
            Services
          </Link>
          <Link to="/services">Services</Link>
        </li>
        <li>
          <Link to="/services">Services</Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;