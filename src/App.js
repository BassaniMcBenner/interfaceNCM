import React, { useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

function App() {
  const [ncmInput, setNcmInput] = useState(""); // Entrada de NCM
  const [apiResponse, setApiResponse] = useState(null); // Resposta da API
  const [error, setError] = useState(null); // Mensagens de erro

  const consultarApi = async () => {
    const url = "https://api-ncm-ylk6.onrender.com/api/dados/";

    if (!ncmInput.trim()) {
      setError("Por favor, insira ao menos um código NCM.");
      return;
    }

    const codigos = ncmInput.split(",").map((codigo) => codigo.trim());
    const payload = { codigos };

    try {
      const response = await axios.post(url, payload);
      setApiResponse(response.data);
      setError(null);
    } catch (e) {
      setApiResponse(null);
      setError(`Erro na API: ${e.response?.data || e.message}`);
    }
  };

  const gerarCsv = () => {
    if (!apiResponse) return;

    const csvHeader = "Código,Redução,Descrição,Anexo,Reforma Tributária,Descrição Concatenada\n";
    const csvRows = apiResponse
      .map((item) => {
        return `"${item.codigo}","${item.reducao}","${item.descricao}","${item.anexo}","${item.reforma_tributaria}","${item.descricao_concatenada}"`;
      })
      .join("\n");

    const csvContent = csvHeader + csvRows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "dados_ncm.csv");
  };

  const gerarExcel = () => {
    if (!apiResponse) return;

    const worksheet = XLSX.utils.json_to_sheet(apiResponse);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dados NCM");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "dados_ncm.xlsx");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Consulta API NCM</h1>

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

      {error && (
        <div style={{ marginTop: "20px", color: "red", fontWeight: "bold" }}>
          {error}
        </div>
      )}

      {apiResponse && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h3>Resultado da API:</h3>
          <pre>{JSON.stringify(apiResponse, null, 2)}</pre>

          <button
            onClick={gerarCsv}
            style={{
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              padding: "10px 20px",
              marginTop: "10px",
              marginRight: "10px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Baixar CSV
          </button>

          <button
            onClick={gerarExcel}
            style={{
              backgroundColor: "#17a2b8",
              color: "white",
              border: "none",
              padding: "10px 20px",
              marginTop: "10px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Baixar Excel
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
