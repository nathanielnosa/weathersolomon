import { useState, useEffect } from "react";

const Navbar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
      <div className="container">
        <div className="row align-items-center justify-content-between w-100">
          <div className="col-md-6">
            <a className="navbar-brand" href="#">Weather Solomon</a>
          </div>
          <div className="col-md-6 text-end">
            <p className="lead text-white fw-bold m-0">
              {currentTime.toLocaleTimeString()} | {currentTime.toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
