import {getQueryString} from './utils'
import {JSDOM} from 'jsdom'

describe('utils', () => {

    it('works', () => {
        expect(location.href).toBe('http://localhost:2000/#/pipeline/edit/6465dab49a534b5ab3efcccb5c4ce9a8n0AgY4?buildNum=42');
    });

    it('getQueryString should can not get hash query',() =>{
        expect(location.href).toBe('http://localhost:2000/#/pipeline/edit/6465dab49a534b5ab3efcccb5c4ce9a8n0AgY4?buildNum=42');
        const canNotgetBuildNum = getQueryString('token');
        expect(canNotgetBuildNum).toBe(null)
    })

    it('should should only just can get token', () => {
        window.history.pushState({}, 'Test Title', `http://localhost:2000/?token=eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1Mzk4NDczNzAsInN1YiI6IlRELTQwNDMiLCJ0ZF9wYXlsb2FkIjoie1wiZW1wSWRcIjpcIjJjZTJkMmU5LTg0Y2MtNGRiMi05NmJjLWYxMzA1ZTM5YmM1YlwiLFwiaWRcIjpcInpKYVYwVzJVRENrUU1HOXNcIixcImVtcE5vXCI6XCJURC00MDQzXCIsXCJleHBpcmVUaW1lXCI6XCIyMDE4LTEwLTE4VDE2OjIyOjUwLjE3N1wifSIsImV4cCI6MTUzOTg1MDk3MH0.rZ-Irzgsak_klxD2Zb-4dM4TOyr_6NzQGCmeBNEJLKs&setToken=true#/`);
        expect(window.location.href).toEqual('http://localhost:2000/?token=eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1Mzk4NDczNzAsInN1YiI6IlRELTQwNDMiLCJ0ZF9wYXlsb2FkIjoie1wiZW1wSWRcIjpcIjJjZTJkMmU5LTg0Y2MtNGRiMi05NmJjLWYxMzA1ZTM5YmM1YlwiLFwiaWRcIjpcInpKYVYwVzJVRENrUU1HOXNcIixcImVtcE5vXCI6XCJURC00MDQzXCIsXCJleHBpcmVUaW1lXCI6XCIyMDE4LTEwLTE4VDE2OjIyOjUwLjE3N1wifSIsImV4cCI6MTUzOTg1MDk3MH0.rZ-Irzgsak_klxD2Zb-4dM4TOyr_6NzQGCmeBNEJLKs&setToken=true#/');
        const token = getQueryString('token');

        expect(token).toEqual(`eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1Mzk4NDczNzAsInN1YiI6IlRELTQwNDMiLCJ0ZF9wYXlsb2FkIjoie1wiZW1wSWRcIjpcIjJjZTJkMmU5LTg0Y2MtNGRiMi05NmJjLWYxMzA1ZTM5YmM1YlwiLFwiaWRcIjpcInpKYVYwVzJVRENrUU1HOXNcIixcImVtcE5vXCI6XCJURC00MDQzXCIsXCJleHBpcmVUaW1lXCI6XCIyMDE4LTEwLTE4VDE2OjIyOjUwLjE3N1wifSIsImV4cCI6MTUzOTg1MDk3MH0.rZ-Irzgsak_klxD2Zb-4dM4TOyr_6NzQGCmeBNEJLKs`)

    })

})
