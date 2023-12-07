import { add, excuteLazyLoading, useLazyLoading } from '../src';
import { LazyLoaderConfig } from '../src/models/lazy-loader-config';
import { LazyLoaderOutput } from '../src/models/lazy-loader-output';

test('adds two numbers correctly', () => {
  const result = add(2, 3);
  expect(result).toBe(5);
});

 test('test function', async () => {
   let config: LazyLoaderConfig<any> = {
    url: 'http://localhost:8080/api/v1/devotee/pagination/filter',
    headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzAxODMxNzM4LCJleHAiOjE3MDM0NjYzMzd9.1olNMsqOIQsYiWYBuALqLeiysP1jVInxuGxhgsKmMXQ',
    },
    params: {
        price: 80,
        field: 'phoneNo1',
        sortBy: 'updatedAt',
        sortDir: 'desc'
    },
    
  };

  let dataReceived: any[] = [];
  await useLazyLoading<any>(config, (data) => {
    console.log('Data received');
    dataReceived.push(...data);
  });
  console.log('Final Result: ' + dataReceived.length);
})