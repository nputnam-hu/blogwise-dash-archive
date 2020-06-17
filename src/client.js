// TODO, don't have TWO api clients :(
import rp from 'request-promise'
import axios from 'axios'
import store from 'store'
import config from './config'

class Client {
  constructor() {
    const user = store.get('user')
    this.token = user ? user.token : null
    this.defaultOptions = {
      headers: {
        'x-access-token': this.token,
      },
      json: true,
    }
  }
  get(stub, options = {}) {
    if (stub === '/blogs') {
      const blog = window.sessionStorage.getItem('blog')
      if (blog) {
        return Promise.resolve(JSON.parse(blog))
      }
      return rp({
        uri: config.apiUrl + stub,
        method: 'GET',
        ...this.defaultOptions,
        ...options,
      }).then(fetchedBlog => {
        window.sessionStorage.setItem('blog', JSON.stringify(fetchedBlog))
        return fetchedBlog
      })
    }
    return rp({
      uri: config.apiUrl + stub,
      method: 'GET',
      ...this.defaultOptions,
      ...options,
    })
  }
  post(stub, body = {}, options = {}) {
    return rp({
      uri: config.apiUrl + stub,
      method: 'POST',
      body,
      ...this.defaultOptions,
      ...options,
    })
  }
  put(stub, body = {}, options = {}) {
    if (stub === '/blogs') {
      window.sessionStorage.removeItem('blog')
      store.set('hasUpdates', true)
      return rp({
        uri: config.apiUrl + stub,
        method: 'PUT',
        body,
        ...this.defaultOptions,
        ...options,
      }).then(updatedBlog => {
        store.set('blog', updatedBlog)
        return updatedBlog
      })
    }
    return rp({
      uri: config.apiUrl + stub,
      method: 'PUT',
      body,
      ...this.defaultOptions,
      ...options,
    })
  }
  delete(stub, body = {}, options = {}) {
    return rp({
      uri: config.apiUrl + stub,
      method: 'DELETE',
      body,
      ...this.defaultOptions,
      ...options,
    })
  }
}

export async function uploadFileToS3(file, client) {
  const url = await client.put('/s3/upload', {
    fileName: `${Date.now()}_${file.name}`,
    contentType: file.type,
  })
  await axios.put(url, file, {
    headers: {
      'Content-Type': file.type,
    },
  })
  return url
}

export default Client
