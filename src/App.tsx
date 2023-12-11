import { useEffect, useState } from 'react';
import { Audio } from './Audio';
import { book } from './book6';
import './App.css';

function heightToTop(ele: HTMLElement) {
  //ele为指定跳转到该位置的DOM节点
  let root = document.body;
  let height = 0;
  let temp = ele as Element | null;
  try {
    do {
      height += ele.offsetTop;
      temp = (temp as HTMLElement)?.offsetParent;
    } while (temp !== root);
  } catch (err) {
    console.error(err);
  }
  // console.log({ ele, height });
  return height;
}

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

    const el = document.getElementById(`data-${readIndex}`);
    if (el) {
      window.scrollTo({
        top: heightToTop(el as HTMLElement),
        behavior: 'smooth',
      });
    }
  }, [readIndex]);

  return (
    <div style={{ paddingBottom: '60px' }}>
      {data?.map((item, ind) => {
        return (
          <div
            onClick={() => setReadIndex(ind)}
            className={(ind === readIndex && 'active') || ''}
            key={ind}
          >
            <p style={{ width: '80vw' }}>
              <h4
                style={{ display: 'inline-block', color: '#ccc', margin: 0 }}
                id={'data-' + ind}
              >
                {ind}
              </h4>{' '}
              {item}
            </p>
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
            textAlign: 'center',
            borderRadius: '50%',
            border: '1px solid #333',
            boxShadow: '0px 1px 0px 0px #ccc',
            fontSize: '10px',
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
            index={readIndex}
            onEnd={(index) => {
              setTimeout(() => {
                if (index < data?.length) {
                  console.log({ index, readIndex });
                  setReadIndex(index + 1);
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
