<template>
  <div>
    <input type="file" @change="handleFileChange" />
    <el-button @click="handleUpload">上传</el-button>
    <el-button @click="handlePause">暂停</el-button>
  </div>
</template>
​
<script>
/* eslint-disable */
 // 切片大小
 // the chunk size
 const SIZE = 10 * 1024 * 1024
export default {
  data: () => ({
    container: {
      file: null
    },
      data: [],
      fileChunkList: [],
  requestList: []
  }),
  methods: {
    request({
      url,
      method = "post",
      data,
      headers = {},
      requestList
    }) {
      return new Promise(resolve => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        Object.keys(headers).forEach(key =>
          xhr.setRequestHeader(key, headers[key])
        );
        xhr.send(data);
         xhr.onload = e => {
            if (requestList) {
               const xhrIndex = requestList.findIndex(request => request === xhr)
               requestList.splice(xhrIndex, 1)
         }
          resolve({
            data: e.target.response
          });
         };
         if (requestList && requestList.length !== 0) {
            requestList.push(xhr)
          this.requestList = requestList
         }
      });
    },
    handleFileChange(e) {
        const [file] = e.target.files;
      if (!file) return;
      Object.assign(this.$data, this.$options.data());
      this.container.file = file;
    },
    // 生成文件切片
    createFileChunk(file, size = SIZE) {
     const fileChunkList = [];
      let cur = 0;
 
      while (cur < file.size) {
        fileChunkList.push({ file: file.slice(cur, cur + size) });
        cur += size;
      }
      return fileChunkList; 
     },
     async calculateHash() {
        return new Promise(resolve => {
                 const webWorker = new Worker('static/js/hash.js')
        webWorker.postMessage({ fileChunkList: this.fileChunkList })
        webWorker.onmessage = e => {
           const { percentage, hash } = e.data;
           if (hash) {
               resolve(hash);
           }
         }
      })

     },
     async verifyUpload(fileName, fileHash) {
        const {data} = await this.request({
           url: "http://localhost:5000/upload/verify",
           headers: {
            "content-type":"application/json"
           },
           data: JSON.stringify({
              fileName,
            fileHash
           })
        })
        return JSON.parse(data);
     },
   // 上传切片
    async uploadChunks() {
      const requestList = this.data
        .map(({ chunk, hash }) => {
          const formData = new FormData();
          formData.append("file", chunk);
          formData.append("hash", hash);
          formData.append("filename", this.container.file.name);
          return { formData };
        })
        .map(({ formData }) => 
          this.request({
            url: "http://localhost:5000/upload",
            data: formData
          })
        );
       // 并发请求
      for (let i = 0; i < requestList.length; i++) {
         await requestList[i]
      }
      // await Promise.all(requestList);
      await this.mergeRequest()
    },
    async handleUpload() {
      if (!this.container.file) return;
       this.fileChunkList = this.createFileChunk(this.container.file);
       this.container.hash = await this.calculateHash()
       const {code, data: {shouldUpload}} = await this.verifyUpload(this.container.file.name, this.container.hash)
       if (!shouldUpload) {
         console.log("文件hash未改变")
          return; 
       }
      this.data = this.fileChunkList.map(({ file }, index) => ({
        chunk: file,
         // 文件名  数组下标
         hash: this.container.file.name + "-" + index,
         fileHash: this.container.hash
      }));
      await this.uploadChunks();
    },
    async mergeRequest() {
    await this.request({
      url: "http://localhost:5000/upload/merge",
       headers: {
       "content-type": "application/json"
     },
      data: JSON.stringify({
        fileName: this.container.file.name,
        size: SIZE
       })
    });
     },
     handlePause() {
        this.requestList.forEach(request => request.abort())
         this.requestList = []
     }
  }
};
</script>
