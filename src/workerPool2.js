import RPCWorker from './rpc-like.worker.js';

// https://gist.github.com/605541#file_js_web_worker_pool.js,
// https://gist.github.com/kig/1188381
// Web Worker Pool
// size is the number of workers
export default class WorkerPool {

  constructor(size){
    this.size = size || 4;
    this.pool = [];
    this.jobs = [];
    this.resolves = {};
    this.rejects = {};
    this.globalMsgId = 0;
    this.fillPool();
  }

  fillPool = () => {
    for (var i = 0; i < this.size; i++) {
      const worker = new RPCWorker();
      this.pool.push(worker);
    }
  }

  // url: the url of the worker fn
  // msg: the initial message to pass to the worker
  queueJob(url, msg) {
    const newId = ++this.globalMsgId;
    var job = {
        "url": url,
        "msg": msg,
        "id": newId
    };
    this.jobs.push(job);
		const thiz = this;	
		return new Promise(function(resolve, reject) {
			thiz.resolves[newId] = resolve
			thiz.rejects[newId] = reject
      thiz.nextJob();
		}) 
  }

  nextJob() {

      if (this.jobs.length && this.pool.length) {

        const worker = this.pool.shift();
        const job = this.jobs.shift();
        const {id, url, msg} = job;

        const fnally = () => {
          delete this.resolves[id];
          delete this.rejects[id];
          this.pool.push(worker);
          this.nextJob();
        }

        worker.postMessage({method: url, args: msg});

        worker.onmessage = evt => {
          this.resolves[id](evt.data.message);
          fnally();
        }

        worker.onerror = err => {
          this.rejects[id](err);
          fnally();
        }

      }
  }

}
