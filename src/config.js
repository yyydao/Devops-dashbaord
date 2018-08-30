export default {
  packageBaseURL: process.env.NODE_ENV === 'development'? '/v1/':'http://10.100.18.35:8080',
  performanceBaseURL: process.env.NODE_ENV === 'development'? '/v2/':'http://10.100.18.35:8090'
}
