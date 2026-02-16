module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    socket.on("join-room", (roomId) => {
      socket.join(roomId);
    });

    socket.on("code-change", ({ roomId, code }) => {
      socket.to(roomId).emit("code-update", code);
    });
  });
};
