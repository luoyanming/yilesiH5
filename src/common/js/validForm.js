
export const validForm = {
    checkNull: function(value) {
        if(value == '' || value == undefined || value == null){
            return false;
        }else{
            return true;
        }
    },
    checkMobile: function(mobile){
        var re = /^1\d{10}$/;
        if (re.test(mobile)) {
            return true;
        } else {
            return false;
        }
    },
    checkIDCards: function(idcards) {
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;  
        if(reg.test(idcards) === false) {
           return  false;
        } else {
            return true;
        }
    },
};

export default { validForm };