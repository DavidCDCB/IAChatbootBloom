import axios, { AxiosResponse } from 'axios';
import { RawData } from './types';

const api = axios.create();
const source = 'https://GptNeox.davidcdcb.repl.co/gptbloomChatBot';

const HttpClient = {
  postData: async (text: string): Promise<AxiosResponse<RawData>> => {
    return await api.post(source,
      {
        "texto": text
      },{
      headers: {
        'Content-Type': 'application/json'
      }}
    );
  }
};

export default HttpClient;
