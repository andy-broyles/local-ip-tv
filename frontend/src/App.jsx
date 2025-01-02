import React, { useState, useEffect, useRef } from 'react';
import JSMpeg from '@cycjimmy/jsmpeg-player';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const CameraCard = ({ index, camera, removeCamera, handleFullscreen, moveCamera, darkMode }) => {
  const ref = useRef(null);
  const [{ isDragging }, drag] = useDrag({
    type: 'camera',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'camera',
    hover: (item) => {
      if (item.index !== index) {
        moveCamera(item.index, index);
        item.index = index;
      }
    },
  });

  drag(drop(ref));

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1, padding: '10px', borderRadius: '5px', background: darkMode ? '#333' : '#fff', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <h3>{camera.name}</h3>
      <p>{camera.url}</p>
      <p>Tags: {camera.tags.join(', ')}</p>
      <p>Status: {camera.status}</p>
      {camera.url.startsWith('rtsp://') ? (
        <canvas id={`canvas-${camera.id}`} width="300" height="200"></canvas>
      ) : (
        <iframe src={camera.url} width="300" height="200" style={{ border: 'none' }}></iframe>
      )}
      <div style={{ marginTop: '10px' }}>
        <button onClick={() => handleFullscreen(camera)} style={{ marginRight: '10px', padding: '5px 10px', background: '#007BFF', color: '#fff', border: 'none', borderRadius: '5px' }}>Fullscreen</button>
        <button onClick={() => removeCamera(camera.id)} style={{ padding: '5px 10px', background: '#DC3545', color: '#fff', border: 'none', borderRadius: '5px' }}>Remove</button>
      </div>
    </div>
  );
};

function App() {
  const [cameras, setCameras] = useState(() => {
    const savedCameras = localStorage.getItem('cameras');
    return savedCameras ? JSON.parse(savedCameras) : [];
  });
  const [cameraUrl, setCameraUrl] = useState('');
  const [cameraName, setCameraName] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [fullscreenCamera, setFullscreenCamera] = useState(null);
  const [selectedTag, setSelectedTag] = useState('All');

  useEffect(() => {
    localStorage.setItem('cameras', JSON.stringify(cameras));
  }, [cameras]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const isValidUrl = (url) => {
    const ipRegex = /^\d{1,3}(\.\d{1,3}){3}$/;
    try {
      return new URL(url) || ipRegex.test(url);
    } catch {
      return ipRegex.test(url);
    }
  };

  const addCamera = () => {
    if (cameraUrl.trim() === '' || cameraName.trim() === '') {
      setError('Name and URL/IP cannot be empty.');
      return;
    }

    if (!isValidUrl(cameraUrl) && !cameraUrl.startsWith('rtsp://')) {
      setError('Invalid URL or IP. Please enter a valid IP, HTTP, or RTSP URL.');
      return;
    }

    const newCamera = { id: Date.now(), name: cameraName, url: cameraUrl, tags: tags.split(',').map(tag => tag.trim()), status: 'active' };
    setCameras([...cameras, newCamera]);
    setCameraUrl('');
    setCameraName('');
    setTags('');
    setError('');
  };

  const removeCamera = (id) => {
    setCameras(cameras.filter(camera => camera.id !== id));
  };

  const videoRefs = useRef({});
  useEffect(() => {
    cameras.forEach(camera => {
      if ((camera.url.startsWith('rtsp://') || /^\d{1,3}(\.\d{1,3}){3}$/.test(camera.url)) && !videoRefs.current[camera.id]) {
        const canvas = document.getElementById(`canvas-${camera.id}`);
        videoRefs.current[camera.id] = new JSMpeg.Player(camera.url, { canvas });
      }
    });
  }, [cameras]);

  const handleFullscreen = (camera) => {
    setFullscreenCamera(camera);
  };

  const closeFullscreen = () => {
    setFullscreenCamera(null);
  };

  const moveCamera = (dragIndex, hoverIndex) => {
    const updatedCameras = [...cameras];
    const [draggedCamera] = updatedCameras.splice(dragIndex, 1);
    updatedCameras.splice(hoverIndex, 0, draggedCamera);
    setCameras(updatedCameras);
  };

  const filteredCameras = selectedTag === 'All' ? cameras : cameras.filter(camera => camera.tags.includes(selectedTag));

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh', background: darkMode ? '#121212' : '#f4f4f9', color: darkMode ? '#fff' : '#333', transition: 'background 0.3s' }}>
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', background: darkMode ? '#444' : '#007BFF', color: '#fff', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <h1 style={{ margin: 0, fontSize: '24px' }}>Local IP TV</h1>
          <button onClick={toggleTheme} style={{ padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', border: 'none', background: darkMode ? '#f4f4f9' : '#121212', color: darkMode ? '#333' : '#fff' }}>
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </nav>

        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input type="text" value={cameraName} onChange={(e) => setCameraName(e.target.value)} placeholder="Camera Name" />
            <input type="text" value={cameraUrl} onChange={(e) => setCameraUrl(e.target.value)} placeholder="Camera URL or IP" />
            <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags (comma-separated)" />
            <button onClick={addCamera}>Add Camera</button>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
