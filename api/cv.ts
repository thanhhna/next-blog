import axios from 'lib/axios';
import randomChars from 'random-chars';

interface Code {
  a: string,
  b: string,
  c: string
}

export async function gen() {
  try {
    const b = randomChars.get();
    const response = await axios.post<Code>('/mycv/gen', {
      time: Date.now(),
      b
    });

    return response.data;
    
  } catch(e) {
    throw e;
  }
}

export async function get(data: { a: string, b: string }) {
  window.open(`/mycv/get/${data.a}/${data.b}`, '_blank');
}