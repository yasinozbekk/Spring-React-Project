import React from 'react';
import {signup, changeLanguage } from '../api/apiCalls'
import Input from '../components/Input';
//import axios from 'axios'; //axios javaya bağlı olması için kullanılır
import {withTranslation} from "react-i18next";
class UserSignupPage extends React.Component{

    state = {
        userName: null,
        displayName: null,
        password: null,
        passwordRepeat: null,
        pendingApiCall: false, //beklemede api var mı
        errors: {}
    };

    onChange = event => {
        const {t} = this.props;
        const {name, value} = event.target;//buradaki
        const errors = {...this.state.errors}//errors objesinin kopyası
        errors[name] = undefined;
        if(name === "password" || name === "passwordRepeat"){
            if(name === "password" && value !== this.state.passwordRepeat){
                errors.passwordRepeat = t("Password mismatch");
            }else if(name === "passwordRepeat" && value !== this.state.password){
                errors.passwordRepeat = t("Password mismatch");
            }else{
                errors.passwordRepeat = undefined;
            }
        }
        this.setState({//nameden hangi değer gelirse güncelle
            [name]: value,//tekrar yazmaya başlayınca boş geçilmez uyarısı kalkar
            errors
        });

        //const value = event.target.value; yukarıdaki buradaki yazan yerle aynı anlama geliyore
        //const name = event.target.name;
    };

    onClickSignup = async event => {
        event.preventDefault();
        const{userName, displayName, password} = this.state;

        const body = {
            userName, //userName: userName, yazma şekli böyle ise "userName," sadece şu şekilde yazılması yeterli olur
            displayName,
            password
        };
        this.setState({pendingApiCall: true});

        //axios.post("/api/1.0/users", body)//domain adı otomatik gelmeli bunun için package.json dosyasındaki proxyde localhost:8080 tanımlanır
        try{
            const response = await signup(body);
        }catch(error){
            if(error.response.data.validationErrors){
                this.setState({errors: error.response.data.validationErrors});
            }
        }
        this.setState({pendingApiCall:false});
        // signup(body)
        // .then(response => {
        //     this.setState({pendingApiCall: false});
        // }).catch(error => {
        //     this.setState({pendingApiCall: false});
        // });

    };

    onChangeLanguage = language => {
        const{ i18n } = this.props;
        i18n.changeLanguage(language);
        changeLanguage(language);
    };

    render(){
        const {pendingApiCall, errors} = this.state;
        const {userName, displayName, password, passwordRepeat} = errors;
        const {t} = this.props;
        

        return(
            <div className="container col-md-4">
            <br></br>
            <br></br>
            <br></br>
                <form>
                    <h1 className="text-center">{t("Sign Up")}</h1>
                    <Input name="userName" label={t("Username")} error={userName} onChange={this.onChange} />

                    <Input name="displayName" label={t("Display Name")} error={displayName} onChange={this.onChange} />

                    <Input name="password" label={t("Password")} error={password} onChange={this.onChange} type="password" />

                    <Input name="passwordRepeat" label={t("Password Repeat")} error={passwordRepeat} onChange={this.onChange} type="passwordRepeat" />

                    <br></br>
                    <div className="text-center">
                        <button className="btn btn-primary" onClick={this.onClickSignup} disabled={pendingApiCall || passwordRepeat !== undefined}>
                            {pendingApiCall && <span className="spinner-border spinner-border-sm"></span>} {t("Sign Up")}
                        </button>
                    </div>

                    <div>
                        <img src="https://www.countryflags.io/tr/flat/24.png" alt="Turkish Flag" onClick={() => this.onChangeLanguage("tr")} style={{cursor:"pointer"}}></img>
                        <img src="https://www.countryflags.io/us/flat/24.png" alt="US Flag" onClick={() => this.onChangeLanguage("en")} style={{cursor:"pointer"}}></img>
                    </div>
                </form>
            </div>
        );
    }
}

const UserSignupPageWithTranslation = withTranslation()(UserSignupPage);

export default UserSignupPageWithTranslation;