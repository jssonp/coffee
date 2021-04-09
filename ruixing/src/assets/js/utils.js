import { Toast } from 'vant'
class Utils {
    //验证表单的方法
    validForm(o) {
        for (let key in o){
            // 验证表单的数据,object
            if(!o[key].reg.test(o[key].value)) {
                //提示
                Toast({
                    message: o[key].errorMsg,
                    duration: 3000,
                    forbidClick: true
                    // overlay: true
                });
                return false;
            }
        }

        //表单验证通过
        return true;
    }
}

export const utils =new Utils();