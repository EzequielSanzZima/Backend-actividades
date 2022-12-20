const fs = require("fs");

class Messages {
  constructor(email, date, msg) {
    this.email = email;
    this.date = date;
    this.msg = msg;
  }
  Messages = [];
  getMessages = async () => {
    try {
      const content = await fs.promises.readFile("./messages.json", "utf-8");
      return JSON.parse(content);
    } catch (e) {
      return [];
    }
  };

  newMsg = async (data, getMessages) => {
    const allMessages = await getMessages();
    const newMessage = {
      email: data.email,
      date: data.date,
      msg: data.msg,
    };
    console.log(newMessage);
    allMessages.push(newMessage);
    try {
      fs.promises.writeFile("./messages.json", JSON.stringify(allMessages));
      const messages = getMessages();
      return messages;
    } catch (e) {
      console.log("Error escribiendo el archivo" + e);
      return null;
    }
  };
}

module.exports = Messages;
