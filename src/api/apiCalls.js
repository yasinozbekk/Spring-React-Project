import axios from "axios"

export const signup = (body) => {
    return axios.post("/api/1.0/users", body);//, { headers : {"accept-language" : "tr"} });//domain adı otomatik gelmeli bunun için package.json dosyasındaki proxyde localhost:8080 tanımlanır
};

export const changeLanguage = language =>{
    axios.defaults.headers["accept-language"] = language;
}