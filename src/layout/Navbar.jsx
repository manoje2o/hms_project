import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm px-4 py-3">
      <div className="container-fluid d-flex justify-content-between align-items-center">

        <h6 className="mb-0 fw-semibold">Dashboard</h6>

        <div className="d-flex align-items-center gap-3">

          <form className="d-none d-md-block">
            <input
              className="form-control form-control-sm"
              type="search"
              placeholder="Search..."
              aria-label="Search"
              style={{ width: '200px' }}
            />
          </form>

          <div className="position-relative">
            <i className="bi bi-bell fs-5"></i>
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              3
            </span>
          </div>

          <div className="dropdown">
            <a
              href="#!"
              className="d-flex align-items-center text-decoration-none"
              id="dropdownUser"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src="https://i.pravatar.cc/30"
                alt="User"
                className="rounded-circle"
                width="30"
                height="30"
              />
            </a>
            <ul className="dropdown-menu dropdown-menu-end shadow" aria-labelledby="dropdownUser">
              <li><a className="dropdown-item" href="#profile">Profile</a></li>
              <li><a className="dropdown-item" href="#settings">Settings</a></li>
              <li><hr className="dropdown-divider" /></li>
              <li><a className="dropdown-item" href="#logout">Logout</a></li>
            </ul>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
