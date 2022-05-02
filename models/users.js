// Checks to see if the submitted email address exists in the Users table
async getIdFromEmail() {
    var sql = "SELECT id FROM Users WHERE Users.email = ?";
    const result = await db.query(sql, [this.email]);
    // TODO LOTS OF ERROR CHECKS HERE..
    if (JSON.stringify(result) != '[]') {
    this.id = result[0].id;
    return this.id;
    }
    else {
    return false;
    }
    }