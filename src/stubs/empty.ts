const fetchStub = typeof window !== 'undefined' ? window.fetch.bind(window) : () => { throw new Error('Fetch not available'); };
export default fetchStub;
export const fetch = fetchStub;
export const Request = typeof window !== 'undefined' ? window.Request : class {};
export const Response = typeof window !== 'undefined' ? window.Response : class {};
export const Headers = typeof window !== 'undefined' ? window.Headers : class {};
