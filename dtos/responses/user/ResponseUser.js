const e = require("express");

class ResponseUser {
    constructor(user) {
        this.id = user.id;
        this.name = user.name;
        this.email = user.email;
        this.role = user.role;
        this.avatar = user.avatar;
        this.phone = user.phone;
    }
}

export default ResponseUser;