import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { FaGithub } from "react-icons/fa";
import { ReactTyped } from "react-typed";
import './style.css';
import api from "./services/api";

// Componente para exibir as informações do cep com a animação
const TypingText = ({ text }) => {
  return (
    <div>
      <ReactTyped
        style={{ whiteSpace: 'pre-line' }}
        strings={[text]}
        typeSpeed={0}
        startDelay={0}
        loop={false}
        cursorChar={"_"}
      />
    </div>
  );
};

function App() {

  const [input, setInput] = useState(''); // Gerenciar o valor do input de CEP
  const [cep, setCep] = useState({}); // Armazenar os dados do CEP retornados pela API
  const [cepText, setCepText] = useState(''); // Armazenar o texto formatado com as informações do CEP

  async function handleSearch() { // Buscar os dados do CEP na API
    if (input === '') {
      alert("Insira um CEP!")
      return;
    }

    try { // Faz a requisição à API com o CEP fornecido
      const response = await api.get(`${input}/json`);
      setCep(response.data);

      // Gerar um link do mapa com base no CEP
      const mapLink = `https://www.google.com/maps/search/${response.data.cep}`;

      // As informações do CEP para exibição
      const text = `
        Logradouro: ${response.data.logradouro} \n
        Complemento: ${response.data.complemento} \n
        Bairro: ${response.data.bairro} \n
        Local: ${response.data.localidade} - ${response.data.uf} \n
        Código IBGE: ${response.data.ibge} \n
        DDD: ${response.data.ddd} \n
        Ver no Mapa: <a href="${mapLink}" target="_blank" rel="noopener noreferrer">Clique aqui</a>
      `;

      setCepText(text.trim());

      setInput("");
    } catch {
      alert("CEP inválido!");
    }
  }

  return (
    <div className="container">
      <h1 className="title">
        <ReactTyped
          strings={[`&lt;data.cep&gt;`, `Buscar CEP`]}
          typeSpeed={30}
          backSpeed={30}
          backDelay={500}
          loop={false}
          cursorChar={"_"}
        />
      </h1>

      <div className="containerInput">
        <input
          type="text"
          placeholder="Digite um CEP..."
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />

        <button className="buttonSearch" onClick={handleSearch}>
          <FiSearch size={25} color="#fff" />
        </button>
      </div>

      {Object.keys(cep).length > 0 && (

        <main className="main">

          <div className="window-header">
            <div className="window-buttons">
              <div className="window-button close"></div>
              <div className="window-button minimize"></div>
              <div className="window-button maximize"></div>

            </div>
            <p className="title-bar">CEP: {cep.cep}</p>
            <div className="spacer"></div>
          </div>

          <div className="window-content">
            <TypingText text={cepText} />
          </div>

        </main>
      )}

      <footer className="footer">
        <p>Powered by FGOMESX |
          <a href="https://github.com/fgomesx" target="_blank" rel="noopener noreferrer">
            <FaGithub style={{ marginLeft: '5px' }} />
          </a>
        </p>
      </footer>

    </div>
  );
}

export default App;
