class MP3Cache {
  snippet: string[] = [];
  result: Blob[] = [];
  DOMIN = ["book.hzc.pub"];

  init() {}
  constructor() {
    this.init()
  }
  
  async download(text: string, dominIndex = 0) {
    try {
      const res = await fetch(`https://${this.DOMIN[dominIndex]}/?text=${text}`);
      const temp = await res.blob();
      this.result.push(temp);
    } catch(err) {
      const nextIndex = dominIndex + 1;
      if (!this.DOMIN[nextIndex]) {
        return
      }
      this.download(text, nextIndex);
    }
  }
}