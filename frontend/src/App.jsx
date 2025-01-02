import React, { useState, useEffect, useRef } from 'react';
import JSMpeg from 'jsmpeg';

function App() {
  const [cameras, setCameras] = useState(() => {
    const savedCameras = localStorage.getItem('cameras');
    return savedCameras ? JSON.parse(savedCameras) : [];
  });
  const [cameraUrl, setCameraUrl] = useState('');
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [fullscreenCamera, setFullscreenCamera] = useState(null);

  useEffect(() => {
    localStorage.setItem('cameras', JSON.stringify(cameras));
  }, [cameras]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const addCamera = () => {
    if (cameraUrl.trim() === '') {
      setError('URL cannot be empty.');
      return;
    }

    if (!isValidUrl(cameraUrl) && !cameraUrl.startsWith('rtsp://')) {
      setError('Invalid URL. Please enter a valid HTTP or RTSP URL.');
      return;
    }

    setCameras([...cameras, { id: Date.now(), url: cameraUrl }]);
    setCameraUrl('');
    setError('');
  };

  const removeCamera = (id) => {
    setCameras(cameras.filter(camera => camera.id !== id));
  };

  const videoRefs = useRef({});
  useEffect(() => {
    cameras.forEach(camera => {
      if (camera.url.startsWith('rtsp://') && !videoRefs.current[camera.id]) {
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

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh', background: darkMode ? '#121212' : '#f4f4f9', color: darkMode ? '#fff' : '#333', transition: 'background 0.3s' }}>
      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', background: darkMode ? '#444' : '#007BFF', color: '#fff', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>Local IP TV</h1>
        <button onClick={toggleTheme} style={{ padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', border: 'none', background: darkMode ? '#f4f4f9' : '#121212', color: darkMode ? '#333' : '#fff' }}>
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </nav>

      <div style={{ padding: '20px' }}>
        {/* Input Form */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', gap: '10px' }}>
          <input
            type="text"
            placeholder="Enter Camera URL"
            value={cameraUrl}
            onChange={(e) => setCameraUrl(e.target.value)}
            style={{ padding: '10px', width: '300px', borderRadius: '5px', border: '1px solid #ccc', background: darkMode ? '#333' : '#fff', color: darkMode ? '#fff' : '#333' }}
          />
          <button
            onClick={addCamera}
            style={{ padding: '10px 20px', borderRadius: '5px', background: '#28a745', color: '#fff', border: 'none', cursor: 'pointer' }}
          >
            Add Camera
          </button>
        </div>

        {/* Error Message */}
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        {/* Camera Feeds */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px', marginTop: '20px' }}>
          {cameras.map((camera) => (
            <div key={camera.id} style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '5px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', background: darkMode ? '#1e1e1e' : '#fff' }}>
              <p style={{ wordBreak: 'break-all', fontSize: '12px', color: darkMode ? '#bbb' : '#555' }}>{camera.url}</p>
              {camera.url.startsWith('rtsp://') ? (
                <canvas id={`canvas-${camera.id}`} width="300" height="200" style={{ borderRadius: '5px', cursor: 'pointer' }} onClick={() => handleFullscreen(camera)}></canvas>
              ) : (
                <iframe
                  src={camera.url}
                  width="100%"
                  height="200"
                  style={{ border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                  allowFullScreen
                  onClick={() => handleFullscreen(camera)}
                ></iframe>
              )}
              <button
                onClick={() => removeCamera(camera.id)}
                style={{ marginTop: '10px', padding: '5px 10px', borderRadius: '5px', background: '#DC3545', color: '#fff', border: 'none', cursor: 'pointer' }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {fullscreenCamera && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0, 0, 0, 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {fullscreenCamera.url.startsWith('rtsp://') ? (
            <canvas id={`fullscreen-${fullscreenCamera.id}`} width="800" height="600"></canvas>
          ) : (
            <iframe src={fullscreenCamera.url} width="800" height="600" style={{ border: 'none' }} allowFullScreen></iframe>
          )}
          <button onClick={closeFullscreen} style={{ position: 'absolute', top: '10px', right: '10px', padding: '10px 20px', background: '#DC3545', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '5px' }}>Close</button>
        </div>
      )}
    </div>
  );
}

export default App;
