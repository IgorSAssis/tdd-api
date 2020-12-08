import * as Knex from "knex";
import bcrypt from "bcrypt";

export async function seed(knex: Knex): Promise<void> {

    await knex("user").truncate();
    await knex("user").del();

    bcrypt.hash("123456789", 10, async function (err, hash) {

        if(err) {

            throw err;

        }

        await knex("user").insert({ id: 1, name: "teste1", surname: "testancia1", email: "teste@teste.com", password: hash });

    });

};
