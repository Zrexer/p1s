#!/usr/bin/env node 
//Paradise

const argv = process.argv;
const geo = require("geoip-lite");
const al = require("./node_modules/alexcolor/alexcolor/index");
const fs = require("fs");
const path = require('path');
const pathx = process.cwd();
const log = (data) => {
    console.log(data);
};

function extract(ip){
    return new Promise((resv, rej) => {
        try{
            const data = geo.lookup(ip);
    
            resv(JSON.parse(JSON.stringify(
                {
                    "country" : data.country,
                    "city" : data.city,
                    'area' : data.area,
                    "timezone" : data.timezone,
                    'metro' : data.metro,
                    "region" : data.region,
                    "range" : data.range,
                    "location" : data.ll,
                    'eu' : data.eu,
                    'error' : false
                }
            )
            ))
        }catch (err){
            resv(JSON.parse(JSON.stringify(
                {
                    'error' : true,
                    'main' : err
                }
            )))
        }
    })
    
}

class loggerBox{
    info(msg){
        let t = new Date();
        return `${al.white('[')}${al.yellow(`${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}`)}${al.white(']')} [${al.green("INFO")}${al.white(']')} ${msg}`;
    }

    err(msg){
        let t = new Date();
        return `${al.white('[')}${al.yellow(`${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}`)}${al.white(']')} [${al.red("ERROR")}${al.white(']')} ${msg}`;
    }

    warn(msg){
        let t = new Date();
        return `${al.white('[')}${al.yellow(`${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}`)}${al.white(']')} [${al.cyan("WARNING")}${al.white(']')} ${msg}`;
    }
}

class MainActivity{
    
    consoleHandle(){
        const box = new loggerBox();
        const banner = `         __     
        /_ |    
    _ __ | |___ 
   | '_ \\| / __|
   | |_) | \\__ \\
   | .__/|_|___/
   | |          
   |_|      
`
        log(al.yellow(banner));
        log(box.info(al.magenta('path') + al.red(": ") + al.green(pathx) + '\n'));

        if (argv.includes("--extract")){
            log(box.info(`the ${al.yellow("'--extract'")}${al.white(' is in use')}`));
            const ipToExtract = argv[argv.indexOf("--extract")+1];

            if (ipToExtract === undefined){
                log(box.err("the ip cannot be empty, Example: ./p1s --extract 1.1.1.1"));
            }else{
                log(box.info(`ip selected: ${al.yellow(ipToExtract)}`))
                log(box.warn(`Please Enable The ${al.red("Internet")} if you dont`));
                log(box.info(`in ${al.yellow("process")} ...`))
                
                extract(ipToExtract).then((dt) => {

                    if (dt.error === true){
                        log(box.err(`Data ${al.magenta("cannot Extract")}`))
                        log(box.err(dt.main))
                    }else{
                        log(box.info(`Data ${al.magenta("Extracted")}`))
                        log(dt);
                    }
                })
            }
        }if (argv.includes("--extract-save")){
            log(box.info(`the ${al.yellow("'--extract-save'")}${al.white(' is in use')}`));
            const ipToExtract = argv[argv.indexOf("--extract-save")+1];
            if (ipToExtract === undefined){
                log(box.err("the ip cannot be empty, Example: ./p1s --extract-save 1.1.1.1"));
            }else{
                if (argv[argv.indexOf("--extract-save")+2] === undefined){
                    log(box.info(`ip selected: ${al.yellow(ipToExtract)}`))
                    log(box.info(`file name: ${al.red("' resx.txt '")}`));
                    log(box.info(`saved path: ${al.red(`${path}`)}`))
                    log(box.warn(`Please Enable The ${al.red("Internet")} if you dont`));
                    log(box.info(`in ${al.yellow("process")} ...`))
                    extract(ipToExtract).then((dt) => {
                        if (dt['error'] === true){
                            log(box.err(`Data ${al.magenta("cannot Extract")}`))
                            log(box.err(dt['main']))
                        }else{
                            fs.writeFile("resx.txt", JSON.stringify(dt), (err) => {
                                if (err){
                                    log(box.err(err));
                                }
                            })
                            log(box.info(`Data ${al.magenta("Extracted")}`))
                            log(dt);
                            log(box.info(`saved in ${al.yellow("'resx.txt'")}`))
                        }
                    })
                }else{
                    const fname = argv[argv.indexOf("--extract-save")+2]
                    log(box.info(`ip selected: ${al.yellow(ipToExtract)}`))
                    log(box.info(`file name: ${al.red(`' ${fname} '`)}`));
                    log(box.info(`saved path: ${al.red(`${pathx}`)}`))
                    log(box.warn(`Please Enable The ${al.red("Internet")} if you dont`));
                    log(box.info(`in ${al.yellow("process")} ...`))
                    extract(ipToExtract).then((dt) => {
                        if (dt.error === true){
                            log(box.err(`Data ${al.magenta("cannot Extract")}`))
                            log(box.err(dt.main))
                        }else{
                            fs.writeFileSync(`./${fname}`, JSON.stringify(dt), 'utf-8', (err) => {
                                if (err){
                                    log(box.err(err));
                                }else{
                                    if (dt.error === true){
                                        log(box.err(`Data ${al.magenta("cannot Extract")}`))
                                        log(box.err(dt.main))
                                    }
                                }
                            })
                            log(box.info(`Data ${al.magenta("Extracted")}`))
                            log(dt);
                            log(box.info(`saved in ${al.yellow(`' ${fname} '`)}`))
                        }
                    })
                }
            }

        }if (argv.length <= 2){
            log(box.err("no switch or flag called/use"))
        }
    }
}


const app = new MainActivity();
app.consoleHandle()
