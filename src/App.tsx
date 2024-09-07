import { FC, useEffect, useState } from 'react';
import { Audio } from './Audio';
// import { book } from './book8';
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

const Aside = () => {
  const setAudioRate = (rate = 1.5) => {
    const vi = document.querySelector('audio');
    if (vi) {
      vi.defaultPlaybackRate = rate;
      vi.playbackRate = rate;
    }
  };
  return (
    <div
      style={{
        position: 'fixed',
        top: '40%',
        zIndex: '10',
        right: '10px',
        padding: '16px',
        textAlign: 'center',
        fontSize: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        backgroundColor: "#666"
      }}
    >
      <button onClick={() => setAudioRate(1)}>1x</button>
      <button onClick={() => setAudioRate(1.25)}>1.25x</button>
      <button onClick={() => setAudioRate(1.5)}>1.5x</button>
      <button onClick={() => setAudioRate(1.75)}>1.75x</button>
      <button onClick={() => setAudioRate(2)}>2x</button>

      <button
        onClick={() => {
          localStorage.setItem('tts_url', 'https://book.hzc.pub');
        }}
      >
        Ali
      </button>
      <button
        onClick={() => {
          localStorage.setItem('tts_url', 'https://audio.hzc.pub');
        }}
      >
        Cloudflare
      </button>
      <button
        onClick={() => {
          localStorage.setItem('tts_url', 'https://mark-tts.deno.dev');
        }}
      >
        Deno
      </button>
      <button
        onClick={() => {
          localStorage.setItem('tts_url', 'https://edge-tts.deno.dev');
        }}
      >
        Deno2
      </button>
    </div>
  );
};

const App: FC<{ book: string; id: string }> = ({ book, id }) => {
  const [readIndex, setReadIndex] = useState<number>(
    parseInt(localStorage.getItem(id + READ_INDEX) || '0')
  );
  const [data, setData] = useState<string[]>([]);

  useEffect(() => {
    const data = book
      .split('\n')
      .map((item) => item.trim())
      .filter((item) => item);
    setData(data);

    setTimeout(() => {
      const el = document.getElementById(`data-${readIndex}`);
      if (el) {
        window.scrollTo({
          top: heightToTop(el as HTMLElement),
          behavior: 'smooth',
        });
      }
    }, 2000);
  }, []);

  useEffect(() => {
    localStorage.setItem(id + READ_INDEX, readIndex + '');

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
            // backgroundColor: '#fff',
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

      <Aside />

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
              }, 500);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default App;
