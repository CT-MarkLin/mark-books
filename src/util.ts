// import { createStore, set, get, entries, del, clear } from 'idb-keyval';

// class ttsIndexDB {
//   cusStore = createStore('tts_cache', 'data');
//   CACHE_LENGTH = 10;
//   content = '';
//   constructor(content: string) {
//     clear(this.cusStore);
//     this.content = content;
//   }

//   init = async (content: string) => {
//     if (content) {
//       this.content = content;
//     } else {
//       this.content = await get()
//     }
//   }

//   splitContent() {

//   }

//   delSnippet = async (key: string) => {
//     return await del(key, this.cusStore);
//   };

//   getSnippet = async (key: string, cleanAllData = false) => {
//     const result = await get(key, this.cusStore);
//     if (cleanAllData) {
//       await clear(this.cusStore);
//     } else {
//       await del(key, this.cusStore);
//     }
//     return result;
//   };

//   setSnippet = async (key: string, val: any) => {
//     return await set(key, val, this.cusStore);
//   };

//   addNew = async (key: string, val: any) => {
//     const snippets = (await entries(this.cusStore)) || [];
//     // const latest = snippets[]
//     if (snippets.length > this.CACHE_LENGTH) {
//       return false;
//     }
//     await this.setSnippet(key, val);
//     return true;
//   };
// }
export const cutSnippet = (data: string) => {
  const maxLen = 360;
  let result: string[] = [];
  if (data.length <= maxLen) {
    result = [data];
  } else {
    const paragraphs = data.split('\n');
    const senteance = paragraphs.flatMap((item) => item.split('。'));
    let temp = '';
    for (let i = 0; i < senteance.length; i++) {
      if (
        (temp + senteance[i]).length >= maxLen ||
        i === senteance.length - 1
      ) {
        result.push(temp);
        temp = senteance[i];
        continue;
      }
      temp += `。${senteance[i]}`;
    }
  }
  return result;
}