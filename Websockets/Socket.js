const configSocket = (io) => {
  io.on("connection", (socket) => {
    socket.on("userConnect", (user) => {
      io.emit("userConnect", { msg: `El usuario ${user} se ha conectado` });
    });

    socket.on("userAdmin", (user) => {
      io.emit("userAdmin", { msg: `Administrador Conectado` });
    });

    socket.on("userDisconnect", (user) => {
      io.emit("userDisconnect", {
        msg: `Usuario desconectado`,
      });
    });

    socket.on("message", (msg) => {
      io.emit("message", msg);
    });

    socket.on("disconnect", () => {
      //   console.log("Cliente desconectado");
    });
  });
};

module.exports = { configSocket };
