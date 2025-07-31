
export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  return fetch('https://example.com');
}
