beforeAll(() => {
    jest.useFakeTimers('modern');
    // jest.setSystemTime(new Date(2020, 3, 1));
    jest.setSystemTime(new Date(2022, 3, 1, 9, 30, 0, 0));
    // Default: 3/1/22 @9:30am
});

afterAll(() => {
    jest.useRealTimers();
});