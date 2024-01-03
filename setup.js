#!/usr/bin/env node

const { exec } = require("child_process");

exec("npm init -y && npm i alexcolor geoip-lite", (err, stdo, stde) => {
    if (err){
        console.log(err);
    }

    if (stdo){
        console.log(stdo);
    }

    if (stde){
        console.log(stde);
    }
})
