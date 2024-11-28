import React, { useState } from "react";
import axios from "axios";

function App() {
  const [ncmInput, setNcmInput] = useState(""); // Entrada de NCM
  const [apiResponse, setApiResponse] = useState(null); // Resposta da API
  const [error, setError] = useState(null); // Mensagens de erro

  const consultarApi = async () => {
    const url = "https://api-ncm-ylk6.onrender.com/api/dados/";

    // Valida se o campo está vazio
    if (!ncmInput.trim()) {
      setError("Por favor, insira ao menos um código NCM.");
      return;
    }

    // Prepara os dados no formato esperado pela API
    const codigos = ncmInput.split(",").map((codigo) => codigo.trim());
    const payload = { codigos };

    try {
      // Faz a chamada POST para a API
      const response = await axios.post(url, payload);
      console.log("response: ", response);
      setApiResponse(response.data); // Salva a resposta
      setError(null); // Limpa mensagens de erro
    } catch (e) {
      setApiResponse(null); // Limpa a resposta em caso de erro
      setError(`Erro na API: ${e.response?.data || e.message}`);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Consulta API NCM</h1>

      {/* Campo de entrada */}
      <label htmlFor="ncmInput" style={{ fontWeight: "bold" }}>
        Insira os códigos NCM (separados por vírgula):
      </label>
      <br />
      <input
        id="ncmInput"
        type="text"
        value={ncmInput}
        onChange={(e) => setNcmInput(e.target.value)}
        placeholder="Exemplo: 12.34, 3434"
        style={{
          width: "100%",
          padding: "10px",
          marginTop: "5px",
          marginBottom: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      />
      <br />

      {/* Botão de consulta */}
      <button
        onClick={consultarApi}
        style={{
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Consultar API
      </button>

      {/* Exibição de Erro */}
      {error && (
        <div style={{ marginTop: "20px", color: "red", fontWeight: "bold" }}>
          {error}
        </div>
      )}

      {/* Exibição do Resultado */}
      {apiResponse && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            backgroundColor: "#f9f9f9",
            height: "1000px",
            whiteSpace: "pre-wrap", // Garante a quebra de linha automática
            wordWrap: "break-word", // Quebra palavras grandes
          }}
        >
          <h3>Resultado da API:</h3>
          <pre
            style={{
              whiteSpace: "pre-wrap", // Quebra o texto em linhas
              wordWrap: "break-word", // Força quebra de palavras longas
              display: "block", // Garante o comportamento esperado do bloco
            }}
          >
            {JSON.stringify(apiResponse, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default App;