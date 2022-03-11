// import { FOOBAR as Checkin } from '../functions/foobar';
import { FOOBAR as Checkin } from '../functions/sms/checkin.protected';

describe('jest environment', () => {
    const getCurrentDate = () => new Date();
    // test('It mocks dates priperly create new date', () => {
    //     jest
    //         .spyOn(global, 'Date')
    //         .mockImplementationOnce(() => new Date('2022-03-11T02:38:56.817Z') as any);
    //     expect(getCurrentDate()).toEqual(new Date('2022-03-11T02:38:56.817Z'));
    // });
    test('again', () => {
        expect(getCurrentDate()).toEqual(new Date('2022-03-11T02:38:56.817Z'));
    })
})


describe('checkin api', () => {
    it('should work', async () => {
        expect(typeof Checkin).toBe('function')
        expect(Checkin).toBe(true)
    })
})