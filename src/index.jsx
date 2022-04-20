import "./styles/style.css";
// import json from './assets/json.json';
// import xml from "./assets/data.xml";
import "./styles/less.less";
import "./styles/scss.scss";
import "./babel.js";
import React from "react";
import { createRoot } from 'react-dom/client';


// const post = new Post("Webpack Post Title", webPackLogo);
// $("pre").addClass("code").html(post.toString());

// console.log("Post to string:", post.toString());

// console.log("JSON", json);
// console.log("XML", xml);


const App = () => (
  <div className="container">
    <h1>Webpack course</h1>
    <hr />
    <div className="logo" />

    <hr />
    <pre />
    <hr />

    <div className="box">
      <h2>Less</h2>
    </div>

    <div className="card">
      <h2>SCSS</h2>
    </div>

  </div>
);

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);