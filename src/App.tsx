import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2'
import HttpClient from './HttpClient';
import 'bootswatch/dist/sketchy/bootstrap.min.css';
import './App.css';
import { AxiosError } from 'axios';

function App() {
  const initialText = "Esta es una conversación entre el ser humano y la inteligencia artificial más avanzada del mundo que entiende el lenguaje humano y sabe interactuar con ser humano, ademas de ser capaz de expresarse como el.\n";
  const [textInput, changeTextInput] = useState<string>("");
  const [messages, setMessage] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [tip, changeTip] = useState<boolean>(true);
  const [fullText, setFullText] = useState<string>(initialText);
  const inputReference = useRef<HTMLTextAreaElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(fullText === initialText){
      inputReference.current?.focus();
      Swal.fire({
        title: '¿Que es Bloom?',
        text: 'Con sus 176 mil millones de parámetros, BLOOM es una inteligencia artificial capaz de generar texto en 46 idiomas y 13 lenguajes de programación. Para casi todos ellos, como el español, el francés y el árabe, BLOOM será el primer modelo de idioma con más de 100B de parámetros jamás creado. Esta es la culminación de un año de trabajo en el que participaron más de 1000 investigadores de más de 70 países y más de 250 instituciones, lo que llevó a una carrera final de 117 días (del 11 de marzo al 6 de julio) entrenando el modelo BLOOM en la supercomputadora Jean Zay en el sur de París, Francia, gracias a una subvención de cómputo por un valor estimado de 3 millones de euros de las agencias de investigación francesas CNRS y GENCI. Los investigadores ahora pueden descargar, ejecutar y estudiar BLOOM para investigar el rendimiento y el comportamiento de los grandes modelos de lenguaje desarrollados recientemente hasta sus operaciones internas más profundas. En términos más generales, cualquier persona o institución que acepte los términos de la Licencia de IA responsable del modelo (desarrollada durante el propio proyecto BigScience) puede usar y desarrollar el modelo en una máquina local o en un proveedor de la nube, ya que está integrado en Hugging Face.',
        confirmButtonText: 'Iniciar'
      });
      return;
    };
    scrollToBottom();
    inputReference.current?.blur();
    executeRequest(fullText);
  }, [fullText]);

  useEffect(() => {
    if (inputReference && inputReference.current) {
      inputReference.current.style.height = "0px";
      const scrollHeight = inputReference.current.scrollHeight;
      inputReference.current.style.height = scrollHeight + "px";
    }
  }, [textInput]);  

  const executeRequest = async (text: string): Promise<void> => {
    console.log(fullText);
    setLoading(true);
    try {
      const response = await HttpClient.postData(text);
      if (response.status === 200) {
        setMessage((prev: string[])=>{
          return [...prev, response.data.text];
        });
        setLoading(false);
        inputReference.current?.focus();
      }
    } catch (error: AxiosError | any) {
      console.log(error);
      if(error.response){
        Swal.fire(
          '¡Error!',
          'Se ha excedido el limite de mensajes o el servicio se encuentra saturado por el momento.',
          'error'
        )
        setLoading(false);
      }else{
        console.log("Reintendo");
        executeRequest(fullText);
      }
    }
  };

  const setText = (): void => {
    if(textInput !== "?"){
      changeTextInput("");
      if(messages.length){
        setFullText((prev: string)=>prev+"\nIA: "+messages[messages.length-1]+"\nHumano: "+textInput);
      }else{
        setFullText((prev: string)=>prev+"\nHumano: "+textInput);
      }
      setMessage((prev: string[])=>[...prev, textInput]);
    }else{
      reSetText();
    }
  }

  const checkKey = (e: KeyboardEvent): void => {
    if(e.key === "Enter" && loading === false){
      setText();
    }
  }

  const scrollToBottom = () => {
    if (messagesEndRef && messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }

  const setTextInput = (e: FormEvent<HTMLTextAreaElement>): void => {
    changeTextInput(e.currentTarget.value);
  }

  const reSetText = (): void => {
    setMessage((prev: string[])=>[...prev.slice(0,-1)]);
    executeRequest(initialText+"\nHumano: "+messages.slice(0,-1).join("\n"));
  }

  const createBox = (ind: number,text: string): JSX.Element => {
    return  (
      <div className={(ind % 2 == 0) ? 'd-flex justify-content-end' : ''}>
        <div className={(ind % 2 == 0) ? "fuente alert alert-secondary" : "fuente alert alert-success"} role="alert">
          {text}
        </div>
      </div>
    );
  }

  return (
    <div className="App mx-md-5 mx-lg-5">
      <div className="container">
        <div className="sticky">
          <div className="d-flex justify-content-center">
            <h2 className="mt-3"><i className="fas fa-robot"></i> IA Bloom Chatbot</h2>
          </div>
        </div>
        <div className="messages" ref={messagesEndRef}>
          {
            messages.map((msg: string, index) =>
              <div key={index}>
                {createBox(index, msg)}
              </div>
            )
          }
          {
            (loading === true) && (
              <div className="fuente alert alert-success" >
                <div className="row">
                  <div className="col d-flex justify-content-center">
                    <img src="../loading.webp" width="20%" />
                  </div>
                </div>
                <div className="row">
                  <div className="col d-flex justify-content-center">
                    <p>Procesando...</p>
                  </div>
                </div>
              </div>
            )
          }
        </div>
        <div>
          <div className="row mt-2">
            <div className="col-9 col-md-11">
              <textarea onChange={setTextInput} onKeyDown={checkKey} 
              onBlur={()=>{changeTip(false)}} onFocus={()=>{changeTip(true);scrollToBottom();}} 
              ref={inputReference} value={textInput} 
              className="fuente form-control" placeholder="Inicia una conversación"></textarea>
            </div>
            <div className="col-3 col-md-1 d-flex align-items-center">
              <button className='fuente form-control btn btn-success' disabled={loading} onClick={setText} >
                <div className="d-flex align-items-center justify-content-center">
                  <span className="my-1 material-symbols-rounded">send</span>
                </div>
              </button>
            </div>
          </div>
          {
            (tip && textInput === "" && messages.length > 0) && (
              <p className='tip'>Envía ? para generar una respuesta diferente</p>
            )
          }
          {
            (messages.length === 0) && (
              <p className='tip'>¿Quiénes te crearon?, ¿Como funcionas?, ¿Que opinas del ser humano?</p>
            )
          }
          <div className="row mt-3">
            <div>Web service developed by <a href="https://github.com/DavidCDCB">DavidCDCB </a></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
