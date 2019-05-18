import axios from "axios";

export default class Adapter {
    constructor(loader, urlOrObject, t) {
        this.loader = loader;
        this.urlOrObject = urlOrObject;
        this.t = t;
    }

    upload() {
        return new Promise((resolve, reject) => {
            this._initRequest();
            this._sendRequest(resolve, reject);
        });
    }

    abort() {
        if (this.axios) {
            this.axios.abort();
        }
    }

    _initRequest() {
        this.url = this.urlOrObject;
        this.headers = null;
        if (typeof(this.urlOrObject) === 'object') {
            this.url = this.urlOrObject.url;
            this.headers = this.urlOrObject.headers;
        }
    }

    _sendRequest(resolve, reject) {
        this.loader.file
            .then(file => {
                const data = new FormData();
                data.append('upload', file);

                axios.request({
                    url: this.url,
                    method: 'post',
                    data: data,
                    headers: this.headers,
                    progress: event => {
                        if (event.lengthComputable) {
                            this.loader.uploadTotal = event.total;
                            this.loader.uploaded = event.loaded;
                        }
                    },
                }).then(response => {
                    resolve({
                        default: response.data.url,
                    });
                }).catch(error => {
                    reject(error);
                });
            })
            .catch(reject);
    }
}
