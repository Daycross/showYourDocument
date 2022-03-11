import { useState } from 'react';
// import { Carousel } from 'react-responsive-carousel';

import { api } from '../services/api';

import "react-responsive-carousel/lib/styles/carousel.min.css";

import { exportImages } from '../services/ExportImages';

import '../styles/home.scss';

type targetProps = {
  target: HTMLInputElement
}

export function Home(){
  const [selectedFile, setSelectedFile] = useState<File | undefined>();
	// const [isFilePicked, setIsFilePicked] = useState(false);
  const [tempImage, setTempImage] = useState('');
  const [infoJson, setInfoJson] = useState<Object>();
  const [showButton, setShowButton] = useState(false);
  const images = exportImages();

  //Objeto para tradução das propriedades da API
  const translatedInfo = {
    probabilidade: '',
    documento: '',
  }

  const erro = {
    erro: 'A imagem não é um documento válido'
  }

  //Função que transforma o File em uma imagem base64
  function getBase64(file: File) {
    return new Promise<any>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
  
  //Função de envio da imagem para API
  async function handleSendImage(){
    //Arquivo da imagem em tipo File vindo de um estado
    const image = selectedFile;
    //Verificação para saber se o File é Undefined
    if(!image){
      return
    }
    //Criando um FormData para enviar a imagem pelo Axios
    const data = new FormData();
    data.append('file', image, image.name);
  
    const config = {
      headers : {
        'Ocp-Apim-Subscription-Key' : 'a02ec92761234da5a25348d44f6bf4b0',
        'Access-Control-Allow-Origin' : "*"

      }
    }
    //POST com axios
    const response = await api.post('/fxType?code=NixJacw2taGwZQcXF3R3cBGYYMLAkRwCvzan38YAi7OdHzFjKxZWig==', data, config)
    console.log(response)

    //Filtro para pegar somente o Objeto com maior probabilidade
    // const imageJSON = await response.data?.predictions.filter((teste: any) => teste.probability > 0.6 && teste.tagName !== "Negative");
    // if(imageJSON.length < 1) {
    //   setInfoJson(erro.erro);
    //   setShowButton(!showButton);
    //   return
    // }
    // console.log(imageJSON);
    //Desestruturação do Objeto para usar somente duas propriedades com uma função que chama ela mesma 
    // const pickedProps = (({ probability, tagName }) => {
    //   return { probability, tagName }
    // })(imageJSON[0]);
    // console.log(pickedProps);

    //Tradução das propriedades da API
    // translatedInfo.probabilidade = `${(pickedProps.probability * 100).toFixed(0)}%`;
    // translatedInfo.documento = pickedProps.tagName;
    setInfoJson(translatedInfo);
    //Estado que controla o botão de enviar ou adicionar imagem
    setShowButton(!showButton);
    //Estado que armazena a foto enviada em Base64 para possível uso pelo front
    setTempImage( await getBase64(image));
  }

  return(
    <div id="general">
      <aside>
        <img src={images[0]} alt="" />
      </aside>
      <main className="mainContent">
        <div className="mainContent-introduction">
          <div className="text">
            <h2>Tipificação e Extração de dados</h2>
            <p>
              Escolha uma das imagens exemplo abaixo ou envie seus próprios 
              arquivos. Dentro de alguns segundos você terá seu documento ajustado, 
              tipificado e com todas as informações extraídas.
            </p>
            <p> Teste agora :) </p>
          </div>
          <img src={images[1]} alt="Imagem de exemplo dos documentos brasileiros" />
        </div>

        {/* <div className="mainContent-carousel">
          <Carousel autoPlay={true} infiniteLoop={true}  width={600}>
            <div onClick={() => console.log('oi')}>
              <img  src={images[1]} alt="Imagem de exemplo dos documentos brasileiros" />
            </div>
            <div>
              <img src={images[2]} alt="Imagem de exemplo dos documentos brasileiros" />
            </div>
            <div>
              <img src={images[3]} alt="Imagem de exemplo dos documentos brasileiros" />
            </div>
            <div>
              <img src={images[4]} alt="Imagem de exemplo dos documentos brasileiros" />
            </div>
          </Carousel>
        </div> */}

        <div className="mainContent-showData">
          <div className="showData-doc">
            <h3>Documento</h3>
            <img src={tempImage} alt="imagem do documento" />
          </div>
          <div className="showData-info">
            <h3>Dados</h3>
            <div className="showData-infoJSON">
              <pre>{JSON.stringify(infoJson, null, 2)}</pre>
            </div>
          </div>
        </div>

        <div className="mainContent-uploadImage">
          <h3>Teste com seus arquivos</h3>
          {showButton === false ?  
            <label htmlFor="files" className="mainContent-uploadImage_content">
              <img src={images[7]} alt="Ícone de Upload" />
              <h3>Clique ou arraste os arquivos aqui</h3>
              <input id='files' accept=".png, .jpg, .jpeg" type='file' onChange={(event: targetProps) => {
                if(event.target.files){
                  console.log('Peguei a imagem')
                  setSelectedFile(event.target.files[0]);
                  setShowButton(!showButton);
                }
              }}/>
            </label>   
          :
          <label htmlFor="files" className="mainContent-uploadImage_content">
            <button id='files' onClick={handleSendImage}>Enviar Imagem</button>
          </label> 
          }
        </div>
      </main>
    </div>
  );
}