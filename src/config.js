export default {
  packageBaseURL: process.env.NODE_ENV === 'development'? '/v1/':'http://devops.tuandai800.cn:8080/',
  performanceBaseURL: process.env.NODE_ENV === 'development'? '/v2/':'http://devops.tuandai800.cn:8090/'
}
