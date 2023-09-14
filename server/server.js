const express = require('express');
const app = express();
const port = 8000;

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const mysql = require('mysql');
const pool = mysql.createConnection({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'my-product'
});

app.post("/login", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    pool.query("select * from users where user_name = ? and user_pwd = md5(?)", [username, password], function(error, results, fields) {

        if(error) {
            res.json({
                result: false,
                message: error.message
            });
        } 

        if(results.length) {
            res.json({
                result: true,
            });
        } else {
            res.json({
                result: false,
                message: "Username not found ot Password incorrect."
            });
        }

    })

});

app.post('/api/authen_request', (req, res) => {

    const sql = "select * from users where md5(user_name) = ?";
    pool.query(sql, [req.body.username], (error, results) => {

        var response;

        if(error) {
            response = {
                result: false,
                message: error.message
            };
        } else {
            if(results.length) {
                
                var payload = { username: req.body.username };
                var secretKey = "MySecretKey";
                const authToken = jwt.sign(payload, secretKey);

                response = {
                    result: true,
                    data: {
                        auth_token: authToken
                    }
                };

            } else {
                response = {
                    result: false,
                    message: "Username incorrect."
                };
            }
        }

        res.json(response);

    });

});

app.post('/api/access_request', (req, res) => {

    const authenSignature = req.body.auth_signature;
    const authToken = req.body.auth_token;

    var decoded = jwt.verify(authToken, "MySecretKey");

    if(decoded) {

        const query = "select a.user_name, a.first_name, a.last_name, a.email, a.role_id, b.role_name "
                    + "from users a join roles b on a.role_id = b.role_id where md5(concat(user_name, '&', user_pwd)) = ?";

        pool.query(query, [authenSignature], (error, results) => {

            var response;

            if(error) {

                response = {
                    result: false,
                    message: error.message
                };
    
            } else {

                if(results.length) {

                    var payload = {
                        user_id: results[0].user_id,
                        username: results[0].username,
                        firstname: results[0].firstname,
                        lastname: results[0].lastname,
                        email: results[0].email,
                        role_id: results[0].role_id,
                        role_name: results[0].role_name
                    };

                    const accessToken = jwt.sign(payload, "MySecretKey");
                    
                    response = {
                        result: true,
                        data: {
                            access_token: accessToken,
                            account_info: payload
                        }
                    };

                    // console.log(response);
    
                } else {
                    response = {
                        result: false,
                        message: "Username or Password incorrect."
                    };
                }
            }

            res.json(response);

        });

    }

});

app.listen(port, () => {

});