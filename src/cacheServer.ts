import { createStore, get, set, keys, del } from "idb-keyval";

const READ_INDEX = "READ_INDEX";

const cacheStore = createStore("audio", "data");

const tasks: Array<() => Promise<boolean>> = [];

export const default_max_len = 360;

const CACHE_LEN = 8;

export function splitParagraphs(data: string, maxLen = default_max_len) {
  const paragraphs = data.split("\n");
  const senteance = paragraphs.flatMap((item) => item.split(/[。？]/));
  let temp = "";
  let result: string[] = [];
  for (let i = 0; i < senteance.length; i++) {
    if ((temp + senteance[i]).length >= maxLen || i === senteance.length - 1) {
      if (i === senteance.length - 1) {
        temp += `。${senteance[i]}`;
      }
      result.push(temp);
      temp = senteance[i];
      continue;
    }
    temp += `。${senteance[i]}`;
  }
  return result;
}

async function fetchAudio(text: string, id: string, bookId: string) {
  const latestReadLine = parseInt(
    localStorage.getItem(bookId + READ_INDEX) || "0"
  );
  const waitFetchLine = parseInt(id);
  const diffLine = waitFetchLine - latestReadLine;
  const cacheKeys = await keys(cacheStore);
  if (diffLine < 0 || diffLine > CACHE_LEN || cacheKeys.includes(`${id}-${bookId}`)) {
    return false;
  }
  const domin = localStorage.getItem("tts_url") || "https://edge-tts.deno.dev";
  const url = `${domin}/?text=${text}`;
  try {
    const result = await (await fetch(url)).blob();
    set(`${id}-${bookId}`, result, cacheStore);
    return true;
  } catch (err) {
    return false;
  }
}

async function preCacheAudio(data: string[], index: number, bookId: string) {
    if(!data[index]){
        return
    }
  const splitRes = splitParagraphs(data[index]);
  const cacheKeys = await keys(cacheStore);
  for (let i = 0; i < splitRes.length; i++) {
    const id = `${index}-${i}`;
    if (cacheKeys.includes(`${id}-${bookId}`)) {
      continue;
    }
    tasks.push(() => fetchAudio(splitRes[i], id, bookId));
  }
}

export async function cacheWorker(
  data: string[],
  index: number,
  bookId: string,
  cacheNum = 4
) {
  const cacheKeys = await keys(cacheStore);
  const cacheNumArr = new Array(cacheNum).fill(0).map((_, ind) => ind); // [0,1,2,3]
  const cachePrefix = cacheNumArr.map((item) => `${item + index}-`);
  for (let key of cacheKeys) {
    if (
      cachePrefix.some((item) => key.toString().startsWith(item)) &&
      key.toString().endsWith(`-${bookId}`)
    ) {
      continue;
    }
    await del(key, cacheStore);
  }
  for (let ind of cacheNumArr) {
    await preCacheAudio(data, ind + index, bookId);
  }
}

export const getDataUrl = async (pIndex: number, sIndex: number, bookId: string) => {
    const res = await get(`${pIndex}-${sIndex}-${bookId}`, cacheStore);
    if (!res) {
        return ""
    }
    return URL.createObjectURL(res)
}

// const sleep = (duration: number) => {
//   return new Promise((resolove, rej) => {
//     setTimeout(() => {
//       resolove(0);
//     }, duration * 1000);
//   });
// };

async function loop() {
  if (!tasks.length) {
    setTimeout(() => {
        loop()
    }, 5 * 1000);
    return ;
  }
  const newTask = tasks.shift();
  const res = newTask && (await newTask());
  setTimeout(() => {
      loop()
  }, res ? 5 * 1000 : 100);
  return;
}

loop();