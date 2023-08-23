import { useEffect, useState } from 'react';
import { Audio } from './Audio';
import { book } from './book';
import './App.css';

const READ_INDEX = 'READ_INDEX';

function App() {
  const [readIndex, setReadIndex] = useState<number>(
    parseInt(localStorage.getItem(READ_INDEX) || '0')
  );
  const [data, setData] = useState<string[]>([]);

  useEffect(() => {
    const data = book
      .split('\n')
      .map((item) => item.trim())
      .filter((item) => item);
    setData(data);
  }, []);

  useEffect(() => {
    localStorage.setItem(READ_INDEX, readIndex + '');
  }, [readIndex]);

  return (
    <div style={{ paddingBottom: '60px', overflowY: 'auto', height: '100vh' }}>
      {data?.map((item, ind) => {
        return (
          <div
            onClick={() => setReadIndex(ind)}
            className={(ind === readIndex && 'active') || ''}
            key={ind}
          >
            <h3>{ind}</h3>
            <p>{item}</p>
          </div>
        );
      })}
      {data?.length && (
        <div
          style={{
            position: 'fixed',
            top: '10px',
            zIndex: '1',
            right: '10px',
            backgroundColor: '#fff',
            padding: '16px',
            textAlign: "center",
            borderRadius: "50%",
            border: "1px solid #333",
            boxShadow: "0px 1px 0px 0px #ccc",
            fontSize: "10px"
          }}
        >
          <div>
            {readIndex + 1}/{data.length}
          </div>
          <div>
            {Math.round(((readIndex + 1) / data.length) * 10000) / 100}%
          </div>
        </div>
      )}
      <div
        style={{ position: 'fixed', bottom: '0', zIndex: '1', width: '80vw' }}
      >
        {data?.length > 0 && (
          <Audio
            data={`${data[readIndex]}`}
            onEnd={() => {
              setTimeout(() => {
                if (readIndex < data?.length) {
                  setReadIndex(readIndex + 1);
                } else {
                  // setDate(date - 1000 * 3600 * 24);
                }
              }, 2000);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default App;
