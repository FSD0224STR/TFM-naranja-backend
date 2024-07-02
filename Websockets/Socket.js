const { v4: uuidv4 } = require("uuid");

let activeRooms = [];
let activeAdmins = [];

const configSocket = (io) => {
  io.on("connection", (socket) => {
    socket.on("joinPrivateRoom", () => {
      const room = uuidv4();
      socket.join(room);
      activeRooms.push(room);
      console.log(`Usuario ${socket.id} se ha unido a la sala ${room}`);
      socket.emit("roomJoined", room);

      if (activeAdmins.length > 0) {
        activeAdmins.forEach((adminId) => {
          io.to(adminId).emit("adminJoinRoom", room);
        });
      }
    });

    socket.on("adminJoinRandomRoom", () => {
      if (activeRooms.length > 0) {
        const randomRoom =
          activeRooms[Math.floor(Math.random() * activeRooms.length)];
        socket.join(randomRoom);
        activeAdmins.push(socket.id);
        console.log(
          `Administrador ${socket.id} se ha unido a la sala RANDOM ${randomRoom}`
        );

        socket.emit("adminRoomJoined", randomRoom);
        io.to(randomRoom).emit("adminConnect", {
          msg: `Administrador Conectado`,
        });
      } else {
        activeAdmins.push(socket.id);
        console.log("No hay salas activas disponibles");
        socket.emit("adminRoomJoined", {
          msg: "No hay salas activas disponibles",
        });
      }
    });

    socket.on("adminJoinRoom", (room) => {
      socket.join(room);
      console.log(
        `Administrador ${socket.id} se ha unido a la nueva sala ${room}`
      );

      socket.emit("adminRoomJoined", room);
      io.to(room).emit("adminConnect", {
        msg: `Administrador Conectado`,
      });

      // Añadir el admin a la sala
      const roomIndex = activeRooms.findIndex((r) => r.room === room);
      if (roomIndex !== -1) {
        activeRooms[roomIndex].users.push(socket.id);
      }
    });

    socket.on("privateMessage", ({ room, msg, typeUser }) => {
      io.to(room).emit("privateMessage", msg, typeUser);
    });

    socket.on("userDisconnect", ({ room, typeUser }) => {
      if (typeUser === "Admin") {
        console.log(`Administrador ${socket.id} ha salida de la sala ${room}`);
        io.to(room).emit("userDisconnect", {
          msg: "Administrador desconectado",
          typeUser,
        });
      } else {
        console.log(
          `Usuario ${socket.id} desconectado. La sala ${room} será cerrada.`
        );
        io.to(room).emit("userDisconnect", {
          msg: "Usuario desconectado. La sala será cerrada.",
          typeUser,
        });
        activeRooms = activeRooms.filter((r) => r !== room);
      }
      console.log("activeRooms: ", activeRooms);
    });

    socket.on("disconnect", () => {
      console.log("Cliente desconectado");

      activeAdmins = activeAdmins.filter((adminId) => adminId !== socket.id);

      activeRooms = activeRooms.filter((room) => {
        room.users = room.users.filter((userId) => {
          console.log("userId: ", userId);
          console.log("socket.id: ", socket.id);
          return userId !== socket.id;
        });
        if (room.users.length === 0) {
          console.log(`La sala ${room.room} ha sido eliminada`);
          return false;
        }
        return true;
      });

      console.log("activeRooms: ", activeRooms);
      console.log("activeAdmins: ", activeAdmins);
    });
  });
};

module.exports = { configSocket };
