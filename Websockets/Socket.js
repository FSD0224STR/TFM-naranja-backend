const { v4: uuidv4 } = require("uuid");

let activeRooms = [];
let activeAdmins = [];

const configSocket = (io) => {
  io.on("connection", (socket) => {
    socket.myRooms = [];

    socket.on("joinPrivateRoom", () => {
      const room = uuidv4();
      socket.join(room);
      socket.myRooms.push(room);
      activeRooms.push(room);
      // console.log(`Usuario ${socket.id} se ha unido a la sala ${room}`);
      // console.log("socket.myRooms: ", socket.myRooms);
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
        socket.myRooms.push(randomRoom); // Guardar la sala en la propiedad personalizada
        activeAdmins.push(socket.id);
        // console.log("activeRooms-admin: ", activeRooms);
        // console.log("activeAdmins-admin: ", activeAdmins);
        // console.log(
        //   `Administrador ${socket.id} se ha unido a la sala RANDOM ${randomRoom}`
        // );

        socket.emit("adminRoomJoined", randomRoom);
        io.to(randomRoom).emit("adminConnect", {
          msg: `Administrador Conectado`,
        });
      } else {
        activeAdmins.push(socket.id);
        // console.log("No hay salas activas disponibles");
        socket.emit("adminRoomJoined", {
          msg: "No hay salas activas disponibles",
        });
      }
    });

    socket.on("adminJoinRoom", (room) => {
      socket.join(room);
      socket.myRooms.push(room);
      // console.log(
      //   `Administrador ${socket.id} se ha unido a la nueva sala ${room}`
      // );

      socket.emit("adminRoomJoined", room);
      io.to(room).emit("adminConnect", {
        msg: `Administrador Conectado`,
      });

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
        // console.log(`Administrador ${socket.id} ha salida de la sala ${room}`);
        io.to(room).emit("userDisconnect", {
          msg: "Administrador desconectado",
          typeUser,
        });
        activeAdmins = activeAdmins.filter((adminId) => adminId !== socket.id);
      } else {
        // console.log(
        //   `Usuario ${socket.id} desconectado. La sala ${room} será cerrada.`
        // );
        io.to(room).emit("userDisconnect", {
          msg: "Usuario desconectado. La sala será cerrada.",
          typeUser,
        });
        activeRooms = activeRooms.filter((r) => r !== room);
      }
    });

    socket.on("disconnect", () => {
      // console.log("Cliente desconectado");

      activeAdmins = activeAdmins.filter((adminId) => adminId !== socket.id);

      socket.myRooms.forEach((room) => {
        io.to(room).emit("userDisconnect", {
          msg: "Usuario desconectado. La sala será cerrada.",
          typeUser: "User",
        });
        activeRooms = activeRooms.filter((r) => r !== room);
        // console.log(`La sala ${room} ha sido eliminada`);
      });
      // console.log("activeRooms-disc: ", activeRooms);
      // console.log("activeAdmins-disc: ", activeAdmins);
    });
  });
};

module.exports = { configSocket };
