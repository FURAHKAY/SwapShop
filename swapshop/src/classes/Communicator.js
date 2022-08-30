import APIcommands from "../helpers/APIcommands.js";

export class Communicator {
    constructor() {
        this.url = "https://sudocode.co.za/SwapShop/backend/";
        this.APIfile = "";
        this.params = [];
        this.calls = APIcommands;

    }

    // addCalls(commandName, filename, param_names) {
    //     let call = {
    //         command: commandName,
    //         file: filename,
    //         param_name: param_names
    //     }

    //     this.calls.push(call);
    // }

    getCallByCommand(command) {
        let results = false;

        this.calls.forEach(item => {
            if (item.command == command){
                results = item;
                return;
            }
        })

        if (!results) {
            return false;
        }

        return results;
    }

    constructURL(commandName, param_values) {

        let call = this.getCallByCommand(commandName);

        let APIurl = this.url + call.file+"?";

        call.param_names.forEach((param, i) => {
            APIurl += param+"="+param_values[i];
            if (i != call.param_names.length-1){
                APIurl += "&&";
            }
        })

        return APIurl;
    }

    async makeRequestByCommand(commandName, param_values) {
        let APIurl = this.constructURL(commandName, param_values);        

        let response = await fetch(APIurl).catch(e=>console.error(e))
        let json = await response.json();

        console.log(json)

        if (json['success'] == 1) {
            console.log("this query returned a result")
            return json["results"];   
        }

        return false;
    }
}