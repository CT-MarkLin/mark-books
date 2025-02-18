import { FC, useEffect, useRef, useState } from 'react';

import {getDataUrl, default_max_len, splitParagraphs} from "./cacheServer"

const getUrl = async (sText: string, pIndex: number, sIndex: number, bookId: string) => {
  const dataUrl = await getDataUrl(pIndex, sIndex, bookId);
  if (dataUrl) {
    return dataUrl;
  }
  const domin = localStorage.getItem("tts_url") || "https://edge-tts.deno.dev"
  return `${domin}/?text=${sText}`;
}

interface IAudio {
  data: string;
  index: number;
  bookId: string;
  onEnd: (index: number) => void;
}

const cache: any = {};

export const Audio: FC<IAudio> = ({ data, index, bookId, onEnd }) => {
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
    }, 200)
    return () => clearInterval(cache.timer)
  }, [audioRef])
  useEffect(() => {
    if (!data || !audioRef.current) {
      return;
    }
    console.log({ snippets, readIndex });
    // const domin = localStorage.getItem("tts_url") || "https://edge-tts.deno.dev"
    // const url = `${domin}/?text=${snippets[readIndex]}`;
    const audioObj = audioRef.current;
    (async () => {
      const url = await getUrl(snippets[readIndex], index, readIndex, bookId)
      
      // audioObj.pause();
      audioObj.src = url;
    })()
  }, [audioRef, snippets, readIndex]);

  useEffect(() => {
    const audioObj = audioRef.current;
    audioObj?.pause();
    if (data.length <= default_max_len) {
      setSnippets([data]);
      setReadIndex(0);
    } else {
      const result = splitParagraphs(data)
      setSnippets(result);
      setReadIndex(0);
    }
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
