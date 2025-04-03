import React from "react";
import { FcAcceptDatabase } from "react-icons/fc";

const TopMenu = () => {
    return (
        <div>
          <nav className="navbar navbar-dark bg-dark border-bottom border-light py-3 ">
          <a className="navbar-brand" style={{ color: "WHITE" }}>
          <b >
          

                   {" "}
                   <FcAcceptDatabase />
            &nbsp;CRONOS LOGISTICS MANAGEMENT{" "}
          </b>
        </a>
        
          </nav>
        </div>
    )
}

export default TopMenu;