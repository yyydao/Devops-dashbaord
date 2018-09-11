export default {
  // packageBaseURL: process.env.NODE_ENV === 'development'? '/v1/':'http://10.100.18.35:8080',
  // performanceBaseURL: process.env.NODE_ENV === 'development'? '/v2/':'http://10.100.18.35:8090'
  // packageBaseURL: process.env.NODE_ENV === 'development'? '/v1/':'',
  // performanceBaseURL: process.env.NODE_ENV === 'development'? '/v2/':''
  packageBaseURL: process.env.NODE_ENV === 'development'? '/v1/':'http://devops.tuandai800.cn:8080',
  performanceBaseURL: process.env.NODE_ENV === 'development'? '/v2/':'http://devops.tuandai800.cn:8090'
}
