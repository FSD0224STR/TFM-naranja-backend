const activeRooms = [];

const configSocket = (io) => {
  io.on("connection", (socket) => {
    // socket.on("userConnect", (user) => {
    //   io.emit("userConnect", { msg: `El usuario ${user} se ha conectado` });
    // });

    socket.on("joinPrivateRoom", () => {
      const room = socket.id;
      socket.join(room);
      activeRooms.push(room);
      console.log(`Usuario ${socket.id} se ha unido a la sala ${room}`);
      socket.emit("roomJoined", room);
    });

    socket.on("adminJoinRandomRoom", () => {
      if (activeRooms.length > 0) {
        const randomRoom =
          activeRooms[Math.floor(Math.random() * activeRooms.length)];
        socket.join(randomRoom);
        console.log(
          `Administrador ${socket.id} se ha unido a la sala ${randomRoom}`
        );

        socket.emit("adminRoomJoined", randomRoom);
        io.to(randomRoom).emit("adminConnect", {
          msg: `Administrador Conectado`,
        });
      } else {
        console.log("No hay salas activas disponibles");
        socket.emit("adminRoomJoined", {
          msg: "No hay salas activas disponibles",
        });
      }
    });

    socket.on("userDisconnect", (user) => {
      io.emit("userDisconnect", {
        msg: `Usuario desconectado`,
      });
    });

    socket.on("message", (msg) => {
      io.emit("message", msg);
    });

    socket.on("privateMessage", ({ room, msg, typeUser }) => {
      io.to(room).emit("privateMessage", msg, typeUser);
    });

    socket.on("disconnect", () => {
      console.log("Cliente desconectado");
      socket.rooms.forEach((room) => {
        if (room !== socket.id) {
          const roomCount = activeRooms.get(room);
          if (roomCount === 1) {
            activeRooms.delete(room);
          } else {
            activeRooms.set(room, roomCount - 1);
          }
        }
      });
      console.log("activeRooms: ", Array.from(activeRooms.keys()));
    });
  });
};

module.exports = { configSocket };
