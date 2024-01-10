class MP3Cache {
  // snippet: string[] = [];
  private result: Array<{text: string; id: string; data?: Blob}> = [];
  private readonly DOMIN = ["book.hzc.pub", "mark-tts.deno.dev", "hzc.pub"];
  private failBlob: Blob | null = null;

  private async init() {
    const res = await fetch(`/undefined.mp3`);
    this.failBlob = await res.blob();
  }

  private slppe(second = 5) {
    return new Promise((res, _) => {
      setTimeout(() => {res(true)}, second*1000)
    })
  }

  private async loop() {
    while(true) {
      await this.slppe();
      for (let i = 0; i<this.result.length; i++) {
        if (this.result[i].data) {
          continue
        }
        await this.download(this.result[i].text)
        break
      }
      console.log(this.result, "result")
    }
  }

  constructor() {
    this.init();
    this.loop();
  }
  
  private async download(text: string, dominIndex = 0) {
    const currentItem = this.result.find(item =>item.text === text);
    if (!currentItem) {
      return;
    }
    try {
      const res = await fetch(`https://${this.DOMIN[dominIndex]}/?text=${text}`);
      const temp = await res.blob();
      currentItem.data = temp;
    } catch(err) {
      const nextIndex = dominIndex + 1;
      if (!this.DOMIN[nextIndex]) {
        currentItem.data = this.failBlob || new Blob();
        return
      }
      await this.download(text, nextIndex);
    }
  }

  pushData(text: string, id: string) {
    if (this.result.some(item => item.id === id)){
      return;
    }
    this.result.push({text, id})
  }

  private async getURL(text: string, retry = 0): Promise<string> {
    const current = this.result.find(item => item.text === text);
    if (current && current.data) {
      return window.URL.createObjectURL(current.data)
    }
    if (retry > 2) {
      return "/undefined.mp3";
    }
    await this.slppe(5);
    return await this.getURL(text, retry + 1);
  }

  async nextData(text: string) {
    const index = this.result.findIndex(item => item.text===text);
    if (index === -1) {
      return ""
    }
    const url = await this.getURL(text);
    this.result = this.result.slice(index);
    return url;
  }

  clean() {
    this.result = [];
  }
}

export const audioCache = new MP3Cache();