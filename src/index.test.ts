import { SynchronousTaskManager } from './index';

test('Adding task will start processing', async () => {
    const a = new SynchronousTaskManager();
    a.listen((val) => {
        expect(val).toMatchObject({ title: 'first' })
    })
    a.add({ title: 'first' })
})

test('Adding listener will start processing', async () => {
    const a = new SynchronousTaskManager();
    a.add({ title: 'first' })
    a.listen((val) => {
        expect(val).toMatchObject({ title: 'first' })
    })
})

test('Adding multiple task will not call listen method unless complete called', async () => {
    const a = new SynchronousTaskManager();
    const mockCallback = jest.fn((val)=>val);
    a.add({ title: 'first' })
    a.add({ title: 'first' })
    a.add({ title: 'first' })
    a.listen(mockCallback)
    expect(mockCallback).toBeCalledTimes(1);
})

test('Adding multiple task will not call listen method unless complete called', async () => {
    const a = new SynchronousTaskManager();
    const mockCallback = jest.fn((val)=>val);
    a.add({ title: 'first' })
    a.add({ title: 'first' })
    a.add({ title: 'first' })
    a.listen(mockCallback)
    a.complete()
    expect(mockCallback).toBeCalledTimes(2);
})

test('Listen method will called after all process completed and adding new task', async () => {
    const a = new SynchronousTaskManager();
    const mockCallback = jest.fn((val)=>val);
    a.add({ title: 'first' })
    a.listen(mockCallback)
    expect(mockCallback).toBeCalledTimes(1);
    a.add({});
    expect(mockCallback).toBeCalledTimes(2);
})

