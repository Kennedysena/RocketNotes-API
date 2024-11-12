require('express-async-errors');
const migrationsRun = require("./database/sqlite/migrations");
const AppError = require("./utils/AppError");
const uploadConfig = require("./configs/upload")

const cors = require("cors");
const express = require("express");
const routes = require("./routes");

migrationsRun();
const app = express();
app.use(cors());
app.use(express.json()); // conteúdo em json para dessa forma eu conseguir ver e manipular as informações do body da requisição

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));
// "/message/:id/:user"; esse forma de parâmetros é para dados mais simples
// response devolver a resposta para quem solicitou a resposta
// request consegue ver a informações que estão sendo enviadas para a nossa aplicação
// Route Params - Parâmetros de rotas	é obrigatório
// Query Params - Parâmetros de consulta	é opcional

app.use(routes);

app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }

  console.error(error);

  return response.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});

const PORT = 3333;
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));
