/* eslint-disable */
const db_client = require('../dbconfig').db_client;
const userRepository = require('../infra/repositories/user-repository')
const bcrypt = require('bcrypt')

module.exports = class profile_services{
    static async readUser(email){
        if(!email){
            return false
        }
        const user = await userRepository.findWithEmail(email)
        return user
    }

    static async updateProfile(email, payload){
        if(!email) return false
        
        if(payload.senha){
            payload.senha = await bcrypt.hash(payload.senha, 10)
        }else {
            delete payload.senha
        }
        return await userRepository.updateProfileWithEmail(email, payload)
    }

    static async getUser(identifier){
        try{
            const text = "SELECT username, email, senha AS password,\
            perfil_github AS github, data_ingresso AS registration_date,\
            tipo_usuario AS user_type, status_ativo AS isActive\
            FROM usuario\
            WHERE username = $1 OR email = $1 OR perfil_github = $1";
            const values = [identifier];
            
            const db_user = await db_client.query(text, values);

            if(db_user.rowCount === 0){
                return null;
            }

            return db_user.rows[0];
        }
        catch(err){
            console.log(err);
        }
    }



    static async insertUser(username, email, password, github){
        try{
            const text = "INSERT INTO usuario (username, email, senha, perfil_github)\
            VALUES ($1, $2, $3, $4)\
            RETURNING username, email, perfil_github AS github,\
            data_ingresso AS registration_date, tipo_usuario AS user_type";
            const values = [username, email, password, github];

            const user_inserted = await db_client.query(text, values);

            return user_inserted.rows[0];
        }
        catch(err){
            if(err.code === "23505"){
                return null; 
            }
            console.log(err);
        }
    }



    static async getNumberCouncilMembers(){
        try{
            const text = "SELECT COUNT(*) AS number_council_members FROM usuario WHERE tipo_usuario = 1";
            const db_council_members_number = await db_client.query(text);

            return db_council_members_number.rows[0].number_council_members;
        }
        catch(err){
            console.log(err);    
        }
    }
}