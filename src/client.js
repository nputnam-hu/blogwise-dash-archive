import fakeApi from './fakeApi'

class Client {
  get = stub => fakeApi('GET', stub, {})
  post = (stub, body = {}) => fakeApi('POST', stub, body)
  put = (stub, body = {}) => fakeApi('PUT', stub, body)
  delete = (stub, body = {}) => fakeApi('PUT', stub, body)
}

export async function uploadFileToS3(file, client) {
  return Promise.resolve()
}

export default Client
