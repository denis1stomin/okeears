import OkrService from './../services/okrservice';

describe('OkrService', () => {
    it('should be there', () => {
        const service = new OkrService();
        expect(service).toBeDefined();
    })

    it('should return objectives', done => {
        const service = new OkrService();
        service.getObjectives('subject', 'user', data => {
            expect(data).toBeDefined();
            done();
        }, error => {});
    })
})