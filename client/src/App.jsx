import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { genrateCodingEnv, stopCodingEnv,stopContainer } from './Store/containerSlice.js';
import Playground from './Components/Playground.jsx';
import './app.css';
import WebSocketService from './utils/WebSocketService.js';
const SLUG_WORKS = ["car", "dog", "computer", "person", "inside", "word", "for", "please", "to", "cool", "open", "source"];
function getRandomSlug() {
  let slug = "";
  for (let i = 0; i < 3; i++) {
      slug += SLUG_WORKS[Math.floor(Math.random() * SLUG_WORKS.length)];
  }
  return slug;
}
const Home = () => {
  const [projectName, setProjectName] = useState(getRandomSlug());
  const [language, setLanguage] = useState('node.js');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.container);

  const handleSubmit = async() => {
    if (projectName.trim() === '') {
      alert('Please enter a project name.');
      return;
    }

    await dispatch(genrateCodingEnv({ projectName, language })).unwrap();
    navigate(`/${projectName}`);
  };

  return (
    <div className="home-container">
      <h1>Create Your Coding Environment</h1>
      {loading ? (
        <h2>Generating Container, please wait...</h2>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="project-form"
        >
          <input
            type="text"
            placeholder="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="input-box"
          />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="dropdown"
          >
            <option value="node.js">Node.js</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
          <button type="submit" className="submit-button">
            Create
          </button>
        </form>
      )}
    </div>
  );
};

const ProjectPlayground = () => {
  const dispatch = useDispatch();
  const { containerName, containerId} = useSelector((state) => state.container);
  const { projectName } = useParams();
  
  const socket = useMemo(()=>{
    return WebSocketService.getSocket(`ws://${projectName}.8000.localhost:80?replId=${projectName}`)
  },[projectName,containerName])

  useEffect(() => {
    if (!containerName) {
      dispatch(genrateCodingEnv({ projectName }));
    }
    const handleBeforeUnload = (event) => {
      const payload = JSON.stringify({ containerId });
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon('http://localhost:8000/stop',blob);
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      if (containerName && containerId) {
        socket?.disconnect();
        window.removeEventListener('beforeunload', handleBeforeUnload);
        dispatch(stopCodingEnv({containerId}));
        dispatch(stopContainer())
      }
    };
  }, [projectName,containerName]);

  return (
    <div className="playground">
      <Playground />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:projectName" element={<ProjectPlayground />} />
      </Routes>
    </Router>
  );
};

export default App;
