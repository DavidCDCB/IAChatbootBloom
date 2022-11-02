import axios, { AxiosResponse } from 'axios';
import { RawData } from './types';

const api = axios.create();
// https://apibloomchatbot.vercel.app/gptbloomChatBot
const source = 'https://9km7oj.deta.dev/gptbloomChatBot';

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
