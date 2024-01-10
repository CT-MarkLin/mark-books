import { FC, useEffect, useRef, useState } from 'react';
import { cutSnippet } from './util';
import { audioCache } from './cache';

interface IAudio {
  data: string;
  index: number;
  onEnd: (index: number) => void;
}

const cache: any = {};

export const Audio: FC<IAudio> = ({ data, index, onEnd }) => {
  const [snippets, setSnippets] = useState<string[]>([]);
  const [readIndex, setReadIndex] = useState<number>(0);

  const audioRef = useRef<HTMLMediaElement>(null);
  useEffect(() => {
    const audioObj = audioRef.current;
    if (!audioObj) {
      return;
    }
    clearInterval(cache.timer)
    cache.timer = setInterval(() => {
      if (audioObj.ended) {
        return
      }
      audioObj.play();
    }, 1000)
    return () => clearInterval(cache.timer)
  }, [audioRef])
  useEffect(() => {
    const audioObj = audioRef.current;
    if (!data || !audioObj) {
      return;
    }
    console.log({ snippets, readIndex });
    audioCache.nextData(snippets[readIndex]).then(url => {
      audioObj.src = url;
    });
    // audioObj.pause();
  }, [audioRef, snippets, readIndex]);

  useEffect(() => {
    const audioObj = audioRef.current;
    audioObj?.pause();
    const result = cutSnippet(data);
    setSnippets(result);
    setReadIndex(0);
  }, [data]);

  return (
    <>
      <audio
        autoPlay
        style={{ width: '100%' }}
        ref={audioRef}
        controls
        onEnded={() => {
          if (readIndex === snippets.length - 1) {
            onEnd(index);
            return;
          }
          setReadIndex(readIndex + 1);
        }}
        onError={() => {
          onEnd(index);
        }}
      />
    </>
  );
};
