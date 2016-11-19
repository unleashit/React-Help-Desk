import React, { Component } from 'react';

class Header extends React.Component {

    render() {
        return (
            <header>
                <nav className="navbar navbar-dark bg-inverse">
                    <a className="navbar-brand" href="/">React Help Desk</a>
                    <ul className="nav navbar-nav">
                        <li className="nav-item active">
                            <a className="nav-link" href="/">Home <span className="sr-only">(current)</span></a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Link 2</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Link 3</a>
                        </li>
                        <li className="nav-item float-sm-right">
                            <a className="nav-link" href="/login">Login</a>
                        </li>
                    </ul>
                </nav>
            </header>
        );
    }
}

export default Header;
